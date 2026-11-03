import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../../../api/client'
import { ENDPOINTS } from '../../../api/endpoints'
import type { ProductResponse } from '../../../types/product.types'
import { useAuth } from '../../auth/store/authStore'

export function useProductsQuery(category?: string | null) {
  const { isAuthenticated } = useAuth()

  return useQuery({
    queryKey: ['products', category || 'all'],
    queryFn: async ({ signal }) => {
      const url = category && category !== 'all' ? ENDPOINTS.PRODUCTS.SEARCH(category) : ENDPOINTS.PRODUCTS.LIST
      return await apiClient<ProductResponse[]>(url, { signal })
    },
    // If not authenticated, we still attempt if Gateway allows, or catch 401 gracefully
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  })
}

export function useProductDetailQuery(productId: number | string | undefined) {
  const { isAuthenticated } = useAuth()

  return useQuery({
    queryKey: ['product', String(productId)],
    queryFn: async ({ signal }) => {
      if (!productId) throw new Error('Missing Product ID')
      return await apiClient<ProductResponse>(ENDPOINTS.PRODUCTS.DETAIL(productId), { signal })
    },
    enabled: isAuthenticated && Boolean(productId),
    staleTime: 5 * 60 * 1000,
  })
}

