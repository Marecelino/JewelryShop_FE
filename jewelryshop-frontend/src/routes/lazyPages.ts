import { lazy } from 'react'

export const CartPage = lazy(() =>
  import('../features/cart/pages/CartPage').then((m) => ({ default: m.CartPage }))
)
export const CheckoutPage = lazy(() =>
  import('../features/orders/pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage }))
)
export const OrderListPage = lazy(() =>
  import('../features/orders/pages/OrderListPage').then((m) => ({ default: m.OrderListPage }))
)
export const OrderDetailPage = lazy(() =>
  import('../features/orders/pages/OrderDetailPage').then((m) => ({ default: m.OrderDetailPage }))
)
export const ProfilePage = lazy(() =>
  import('../features/auth/pages/ProfilePage').then((m) => ({ default: m.ProfilePage }))
)

export const AdminLayout = lazy(() =>
  import('../layouts/AdminLayout').then((m) => ({ default: m.AdminLayout }))
)
export const AdminProductsPage = lazy(() =>
  import('../features/admin/pages/AdminProductsPage').then((m) => ({ default: m.AdminProductsPage }))
)
export const AdminInventoryPage = lazy(() =>
  import('../features/admin/pages/AdminInventoryPage').then((m) => ({ default: m.AdminInventoryPage }))
)
export const AdminOrdersPage = lazy(() =>
  import('../features/admin/pages/AdminOrdersPage').then((m) => ({ default: m.AdminOrdersPage }))
)

