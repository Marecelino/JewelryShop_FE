// API Error Response - mirrors ApiErrorResponse.java from all services
export interface ApiErrorResponse {
  timestamp: string
  status: number
  error: string
  message: string
  path: string
  validationErrors?: Record<string, string>
}

// Spring Data Page
export interface SpringPage<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
  numberOfElements: number
}

// PagedModel (from Spring Data Web)
export interface PagedModel<T> {
  content: T[]
  page: {
    size: number
    totalElements: number
    totalPages: number
    number: number
  }
}

