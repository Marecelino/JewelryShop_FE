import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../../../api/client'
import { ENDPOINTS } from '../../../api/endpoints'
import type { CreateOrderRequest, OrderResponse } from '../../../types/order.types'
import type { SpringPage } from '../../../types/api.types'
import { generateIdempotencyKey } from '../../../utils/generateIdempotencyKey'
import { useAuth } from '../../auth/store/authStore'

export function useCreateOrderMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateOrderRequest) => {
      const idempotencyKey = generateIdempotencyKey()
      return await apiClient<OrderResponse>(ENDPOINTS.ORDERS.CREATE, {
        method: 'POST',
        headers: {
          'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify(payload),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export function useOrdersQuery(page: number = 0, size: number = 10, sort: string = 'createdAt,desc', status?: string) {
  const { isAuthenticated } = useAuth()

  return useQuery({
    queryKey: ['orders', page, size, sort, status || 'all'],
    queryFn: async ({ signal }) => {
      return await apiClient<SpringPage<OrderResponse> | OrderResponse[]>(
        ENDPOINTS.ORDERS.LIST(page, size, sort, status),
        { signal }
      )
    },
    enabled: isAuthenticated,
  })
}

export function useOrderDetailQuery(orderReference: string | undefined) {
  const { isAuthenticated } = useAuth()

  return useQuery({
    queryKey: ['order', orderReference],
    queryFn: async ({ signal }) => {
      if (!orderReference) throw new Error('Missing Order Reference')
      return await apiClient<OrderResponse>(ENDPOINTS.ORDERS.DETAIL(orderReference), { signal })
    },
    enabled: isAuthenticated && Boolean(orderReference),
    refetchInterval: (query) => {
      // If status is PENDING_RESERVATION (202 response), poll every 3 seconds
      if (query.state.data?.status === 'PENDING_RESERVATION') {
        return 3000
      }
      return false
    },
  })
}

export function useCancelOrderMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (orderReference: string) => {
      return await apiClient<OrderResponse>(ENDPOINTS.ORDERS.CANCEL(orderReference), {
        method: 'POST',
      })
    },
    onSuccess: (_, orderReference) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['order', orderReference] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

