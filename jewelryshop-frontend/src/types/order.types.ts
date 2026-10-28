// Mirrors OrderStatus.java enum
export type OrderStatus =
  | 'PENDING_RESERVATION'
  | 'AWAITING_PAYMENT'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'RESERVATION_FAILED'
  | 'CANCELLATION_PENDING'
  | 'RESERVATION_EXPIRED'
  | 'RECONCILIATION_REQUIRED'

// Mirrors OrderItemStatus.java enum
export type OrderItemStatus =
  | 'PENDING_RESERVATION'
  | 'RESERVED'
  | 'COMMITTED'
  | 'RELEASED'
  | 'RESERVATION_FAILED'
  | 'EXPIRED'
  | 'RECONCILIATION_REQUIRED'

// Mirrors OrderItemRequest.java
export interface OrderItemRequest {
  productId: number
  quantity: number // 1..10 per item
}

// Mirrors CreateOrderRequest.java
export interface CreateOrderRequest {
  items: OrderItemRequest[] // total quantity <= 20
}

// Mirrors OrderItemResponse.java record
export interface OrderItemResponse {
  orderItemId: number
  orderItemReference: string
  productId: number
  productNameSnapshot: string
  unitPrice: number
  reservationId: number | null
  inventoryItemId: number | null
  status: OrderItemStatus
  retryCount: number
  createdAt: string
  updatedAt: string
}

// Mirrors OrderResponse.java record
export interface OrderResponse {
  orderId: number
  orderReference: string
  userId: number
  status: OrderStatus
  totalAmount: number
  idempotencyKey: string | null
  createdAt: string
  updatedAt: string
  items: OrderItemResponse[]
}

