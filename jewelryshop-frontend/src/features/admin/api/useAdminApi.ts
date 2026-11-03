import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../../../api/client'
import { ENDPOINTS } from '../../../api/endpoints'
import type { CreateProductRequest, UpdateProductRequest, ProductResponse } from '../../../types/product.types'
import type { InventoryItemResponse, CreateInventoryItemRequest } from '../../../types/inventory.types'
import type { OrderResponse } from '../../../types/order.types'
import type { SpringPage, PagedModel } from '../../../types/api.types'

// Admin Product CRUD
export function useCreateProductMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: CreateProductRequest | FormData) => {
      return await apiClient<ProductResponse>(ENDPOINTS.PRODUCTS.CREATE, {
        method: 'POST',
        body: payload instanceof FormData ? payload : JSON.stringify(payload),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export function useUpdateProductMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdateProductRequest }) => {
      return await apiClient<ProductResponse>(ENDPOINTS.PRODUCTS.UPDATE(id), {
        method: 'PUT',
        body: JSON.stringify(payload),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export function useDeleteProductMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      return await apiClient<null>(ENDPOINTS.PRODUCTS.DELETE(id), {
        method: 'DELETE',
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

// Admin Inventory Items
export function useInventoryItemsQuery(pageNumber: number = 0, size: number = 10) {
  return useQuery({
    queryKey: ['adminInventory', pageNumber, size],
    queryFn: async ({ signal }) => {
      return await apiClient<PagedModel<InventoryItemResponse> | SpringPage<InventoryItemResponse> | InventoryItemResponse[]>(
        ENDPOINTS.INVENTORY_ITEMS.LIST(pageNumber, size),
        { signal }
      )
    },
  })
}

export function useCreateInventoryItemMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: CreateInventoryItemRequest) => {
      return await apiClient<InventoryItemResponse>(ENDPOINTS.INVENTORY_ITEMS.CREATE, {
        method: 'POST',
        body: JSON.stringify(payload),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminInventory'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

// Admin Orders Oversight
export function useAdminOrdersQuery(page: number = 0, size: number = 20, sort: string = 'createdAt,desc', status?: string) {
  return useQuery({
    queryKey: ['adminOrders', page, size, sort, status || 'all'],
    queryFn: async ({ signal }) => {
      return await apiClient<SpringPage<OrderResponse> | OrderResponse[]>(
        ENDPOINTS.ORDERS.LIST(page, size, sort, status),
        { signal }
      )
    },
  })
}

