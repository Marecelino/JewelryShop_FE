import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../../../api/client'
import { ENDPOINTS } from '../../../api/endpoints'
import type { LoginRequest, LoginResponse, RegisterRequest, UserResponse } from '../../../types/auth.types'
import { authStore } from '../store/authStore'

export function useLoginMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const response = await apiClient<LoginResponse>(ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        body: JSON.stringify(credentials),
      })
      return response
    },
    onSuccess: (data) => {
      authStore.login(data.accessToken)
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: async (payload: RegisterRequest) => {
      return await apiClient<UserResponse>(ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        body: JSON.stringify(payload),
      })
    },
  })
}

export function useCurrentUserQuery() {
  const { isAuthenticated } = authStore.getState()

  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async ({ signal }) => {
      return await apiClient<UserResponse>(ENDPOINTS.AUTH.ME, {
        method: 'GET',
        signal,
      })
    },
    enabled: isAuthenticated,
    staleTime: 10 * 60 * 1000,
  })
}

