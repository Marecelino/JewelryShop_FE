import { ApiError } from './errorHandler'
import type { ApiErrorResponse } from '../types/api.types'

interface RequestOptions extends RequestInit {
  token?: string | null
}

const TOKEN_STORAGE_KEY = 'jewelryshop_access_token'

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY)
  } catch {
    return null
  }
}

export function setStoredToken(token: string | null): void {
  try {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token)
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
    }
  } catch {
    // Ignore storage errors in private browsing
  }
}

export async function apiClient<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const { token = getStoredToken(), headers = {}, signal, ...rest } = options

  const requestHeaders: Record<string, string> = {
    ...(headers as Record<string, string>),
  }

  // Only default to application/json if body is NOT FormData
  if (!(options.body instanceof FormData) && !requestHeaders['Content-Type']) {
    requestHeaders['Content-Type'] = 'application/json'
  }

  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`
  }

  let response: Response
  try {
    response = await fetch(url, {
      ...rest,
      headers: requestHeaders,
      signal,
    })
  } catch (networkError) {
    if (networkError instanceof DOMException && networkError.name === 'AbortError') {
      throw networkError
    }
    throw new ApiError(0, 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.', 'Network Error')
  }

  // Handle 401 Unauthorized globally
  if (response.status === 401) {
    setStoredToken(null)
    // Avoid infinite reload if already on login or register
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'))
    }
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null as unknown as T
  }

  // Parse JSON response body
  let responseData: unknown
  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    try {
      responseData = await response.json()
    } catch {
      responseData = null
    }
  } else {
    try {
      responseData = await response.text()
    } catch {
      responseData = null
    }
  }

  if (!response.ok) {
    const errorData = responseData as Partial<ApiErrorResponse> | null
    const errorMessage = errorData?.message || (typeof responseData === 'string' && responseData) || response.statusText || 'Lỗi yêu cầu'
    const errorType = errorData?.error || `HTTP ${response.status}`
    const validationErrors = errorData?.validationErrors

    throw new ApiError(response.status, errorMessage, errorType, validationErrors)
  }

  return responseData as T
}

