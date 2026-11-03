// Mirrors InventoryItemResponse.java record & InventoryItemStatus.java enum
export type InventoryItemStatus = 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'DAMAGED'

export interface InventoryItemResponse {
  inventoryItemId: number
  productId: number
  barcode: string
  serialNumber?: string | null
  actualWeightGrams?: number | null
  actualGoldPurityPercent?: number | null
  certificateNumber?: string | null
  locationCode?: string | null
  status: InventoryItemStatus
  reservationReference?: string | null
  reservedUntil?: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateInventoryItemRequest {
  productId: number
  barcode: string
  serialNumber?: string
  actualWeightGrams?: number
  actualGoldPurityPercent?: number
  certificateNumber?: string
  locationCode?: string
}

