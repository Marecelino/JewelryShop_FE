import { useSyncExternalStore } from 'react'
import type { ProductResponse } from '../../../types/product.types'

export interface CartItem {
  productId: number
  quantity: number
  productName: string
  price: number
  category: string
  material: string
  gemstone?: string | null
}

interface CartState {
  items: CartItem[]
  totalQuantity: number
  totalAmount: number
}

const CART_STORAGE_KEY = 'jewelryshop_cart_v1'
const MAX_ITEM_QUANTITY = 10
const MAX_TOTAL_QUANTITY = 20

function calculateTotals(items: CartItem[]) {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  return { totalQuantity, totalAmount }
}

function loadFromStorage(): CartState {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (raw) {
      const items = JSON.parse(raw) as CartItem[]
      if (Array.isArray(items)) {
        const { totalQuantity, totalAmount } = calculateTotals(items)
        return { items, totalQuantity, totalAmount }
      }
    }
  } catch {
    // Ignore storage errors
  }
  return { items: [], totalQuantity: 0, totalAmount: 0 }
}

function saveToStorage(items: CartItem[]): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  } catch {
    // Ignore
  }
}

let currentCart: CartState = loadFromStorage()
const cartListeners = new Set<() => void>()

function emitCartChange() {
  saveToStorage(currentCart.items)
  for (const listener of cartListeners) {
    listener()
  }
}

export const cartStore = {
  getState(): CartState {
    return currentCart
  },

  subscribe(listener: () => void): () => void {
    cartListeners.add(listener)
    return () => cartListeners.delete(listener)
  },

  addItem(product: ProductResponse, quantity: number = 1): { success: boolean; error?: string } {
    const existingIndex = currentCart.items.findIndex((item) => item.productId === product.productId)
    const currentItemQty = existingIndex >= 0 ? currentCart.items[existingIndex].quantity : 0
    const newQty = currentItemQty + quantity

    if (newQty > MAX_ITEM_QUANTITY) {
      return { success: false, error: `Số lượng tối đa cho mỗi món trang sức là ${MAX_ITEM_QUANTITY} chiếc.` }
    }

    const newTotal = currentCart.totalQuantity + quantity
    if (newTotal > MAX_TOTAL_QUANTITY) {
      return { success: false, error: `Tổng số lượng trong một đơn giữ chỗ không vượt quá ${MAX_TOTAL_QUANTITY} chiếc.` }
    }

    let updatedItems: CartItem[]
    if (existingIndex >= 0) {
      updatedItems = currentCart.items.map((item, idx) =>
        idx === existingIndex ? { ...item, quantity: newQty } : item
      )
    } else {
      updatedItems = [
        ...currentCart.items,
        {
          productId: product.productId,
          quantity,
          productName: product.productName,
          price: product.price,
          category: product.category,
          material: product.material,
          gemstone: product.gemstone,
        },
      ]
    }

    const { totalQuantity, totalAmount } = calculateTotals(updatedItems)
    currentCart = { items: updatedItems, totalQuantity, totalAmount }
    emitCartChange()
    return { success: true }
  },

  updateQuantity(productId: number, newQuantity: number): { success: boolean; error?: string } {
    if (newQuantity <= 0) {
      cartStore.removeItem(productId)
      return { success: true }
    }

    if (newQuantity > MAX_ITEM_QUANTITY) {
      return { success: false, error: `Mỗi món chỉ được chọn tối đa ${MAX_ITEM_QUANTITY} chiếc.` }
    }

    const existing = currentCart.items.find((item) => item.productId === productId)
    if (!existing) return { success: false }

    const qtyDiff = newQuantity - existing.quantity
    if (currentCart.totalQuantity + qtyDiff > MAX_TOTAL_QUANTITY) {
      return { success: false, error: `Tổng giỏ hàng không được vượt quá ${MAX_TOTAL_QUANTITY} món.` }
    }

    const updatedItems = currentCart.items.map((item) =>
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    )

    const { totalQuantity, totalAmount } = calculateTotals(updatedItems)
    currentCart = { items: updatedItems, totalQuantity, totalAmount }
    emitCartChange()
    return { success: true }
  },

  removeItem(productId: number) {
    const updatedItems = currentCart.items.filter((item) => item.productId !== productId)
    const { totalQuantity, totalAmount } = calculateTotals(updatedItems)
    currentCart = { items: updatedItems, totalQuantity, totalAmount }
    emitCartChange()
  },

  clearCart() {
    currentCart = { items: [], totalQuantity: 0, totalAmount: 0 }
    emitCartChange()
  },
}

export function useCart() {
  return useSyncExternalStore(cartStore.subscribe, cartStore.getState, cartStore.getState)
}

