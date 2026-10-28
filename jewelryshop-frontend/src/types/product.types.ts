// Mirrors InventorySummary.java (response DTO, embedded in ProductResponse)
export interface InventorySummary {
  availableQuantity: number
  reservedQuantity: number
  soldQuantity: number
  damagedQuantity: number
}

// Mirrors ProductResponse.java
export interface ProductResponse {
  productId: number
  productName: string
  category: string
  material: string
  gemstone: string | null
  price: number
  description: string | null
  createdAt: string
  active: boolean
  // null means Inventory Service was unavailable - NOT "out of stock"
  inventory: InventorySummary | null
}

// Mirrors CreateProductRequest.java
export interface CreateProductRequest {
  productName: string
  category: string
  material: string
  gemstone?: string
  price: number
  description?: string
}

// Mirrors UpdateProductRequest.java
export interface UpdateProductRequest {
  productName: string
  category: string
  material: string
  gemstone?: string
  price: number
  description?: string
  active: boolean
}

