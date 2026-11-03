import React, { Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '../layouts/RootLayout'
import { StorefrontLayout } from '../layouts/StorefrontLayout'
import { ProtectedRoute } from '../components/guards/ProtectedRoute'
import { TableSkeleton } from '../components/common/LoadingSkeleton'

// Eagerly loaded critical path pages
import { CatalogPage } from '../features/catalog/pages/CatalogPage'
import { ProductDetailPage } from '../features/catalog/pages/ProductDetailPage'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { RegisterPage } from '../features/auth/pages/RegisterPage'
import { NotFoundPage } from '../pages/NotFoundPage'

// Lazy loaded components
import {
  CartPage,
  CheckoutPage,
  OrderListPage,
  OrderDetailPage,
  ProfilePage,
  AdminLayout,
  AdminProductsPage,
  AdminInventoryPage,
  AdminOrdersPage,
} from './lazyPages'

function withSuspense(component: React.ReactNode) {
  return <Suspense fallback={<TableSkeleton rows={6} />}>{component}</Suspense>
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // Bare routes (No header/footer)
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },

      // Storefront Customer-facing routes
      {
        element: <StorefrontLayout />,
        children: [
          {
            path: '/',
            element: <CatalogPage />,
          },
          {
            path: '/products/:productId',
            element: <ProductDetailPage />,
          },
          {
            path: '/cart',
            element: withSuspense(<CartPage />),
          },
          {
            path: '/checkout',
            element: (
              <ProtectedRoute>
                {withSuspense(<CheckoutPage />)}
              </ProtectedRoute>
            ),
          },
          {
            path: '/orders',
            element: (
              <ProtectedRoute>
                {withSuspense(<OrderListPage />)}
              </ProtectedRoute>
            ),
          },
          {
            path: '/orders/:orderReference',
            element: (
              <ProtectedRoute>
                {withSuspense(<OrderDetailPage />)}
              </ProtectedRoute>
            ),
          },
          {
            path: '/profile',
            element: (
              <ProtectedRoute>
                {withSuspense(<ProfilePage />)}
              </ProtectedRoute>
            ),
          },
        ],
      },

      // Admin Management routes (ROLE_ADMIN only)
      {
        path: '/admin',
        element: (
          <ProtectedRoute requiredRole="ADMIN">
            {withSuspense(<AdminLayout />)}
          </ProtectedRoute>
        ),
        children: [
          {
            path: 'products',
            element: withSuspense(<AdminProductsPage />),
          },
          {
            path: 'inventory',
            element: withSuspense(<AdminInventoryPage />),
          },
          {
            path: 'orders',
            element: withSuspense(<AdminOrdersPage />),
          },
        ],
      },

      // Catch-all 404
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
