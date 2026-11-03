import type { ApiErrorResponse } from '../types/api.types'

export class ApiError extends Error {
  status: number
  error: string
  validationErrors?: Record<string, string>

  constructor(status: number, message: string, error: string = 'Api Error', validationErrors?: Record<string, string>) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.error = error
    this.validationErrors = validationErrors
  }
}

export function parseApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error
  }

  if (typeof error === 'object' && error !== null && 'status' in error && 'message' in error) {
    const err = error as Partial<ApiErrorResponse>
    return new ApiError(
      err.status || 500,
      err.message || 'Đã có lỗi xảy ra từ máy chủ',
      err.error || 'Server Error',
      err.validationErrors
    )
  }

  if (error instanceof Error) {
    return new ApiError(500, error.message)
  }

  return new ApiError(500, 'Lỗi kết nối không xác định')
}

