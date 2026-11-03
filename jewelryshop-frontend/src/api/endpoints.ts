export const API_BASE = import.meta.env.VITE_API_URL || '/api/v1'

export const ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE}/auth/login`,
    REGISTER: `${API_BASE}/auth/register`,
    ME: `${API_BASE}/auth/me`,
  },
  PRODUCTS: {
    LIST: `${API_BASE}/products`,
    DETAIL: (id: number | string) => `${API_BASE}/products/${id}`,
    SEARCH: (category: string) => `${API_BASE}/products/search?category=${encodeURIComponent(category)}`,
    PAGINATED: (page: number, size: number) => `${API_BASE}/products/test-pagination?page=${page}&size=${size}`,
    CREATE: `${API_BASE}/products`,
    UPDATE: (id: number | string) => `${API_BASE}/products/${id}`,
    DELETE: (id: number | string) => `${API_BASE}/products/${id}`,
  },
  INVENTORY_ITEMS: {
    LIST: (pageNumber: number = 0, size: number = 10) => `${API_BASE}/inventory-items?pageNumber=${pageNumber}&size=${size}`,
    DETAIL: (id: number | string) => `${API_BASE}/inventory-items/${id}`,
    CREATE: `${API_BASE}/inventory-items`,
  },
  ORDERS: {
    CREATE: `${API_BASE}/orders`,
    LIST: (page: number = 0, size: number = 10, sort: string = 'createdAt,desc', status?: string) => {
      const params = new URLSearchParams({ page: String(page), size: String(size), sort })
      if (status) params.append('status', status)
      return `${API_BASE}/orders?${params.toString()}`
    },
    DETAIL: (orderReference: string) => `${API_BASE}/orders/${encodeURIComponent(orderReference)}`,
    CANCEL: (orderReference: string) => `${API_BASE}/orders/${encodeURIComponent(orderReference)}/cancellation`,
  },
} as const

