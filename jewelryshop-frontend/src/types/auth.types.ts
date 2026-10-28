// Mirrors LoginRequest.java
export interface LoginRequest {
  email: string
  password: string
}

// Mirrors RegisterRequest.java
export interface RegisterRequest {
  username: string // 3-50 chars
  email: string
  password: string // 6-72 chars
}

// Mirrors LoginResponse.java
export interface LoginResponse {
  accessToken: string
  tokenType: 'Bearer'
  expiresAt: string // ISO 8601 Instant
}

// Mirrors UserResponse.java
export interface UserResponse {
  id: number
  username: string
  email: string
  role: 'USER' | 'ADMIN'
  enabled: boolean
  createdAt: string
  updatedAt: string
}

// Decoded JWT claims stored in auth state
export interface AuthClaims {
  sub: string // userId as string
  username: string
  roles: string[] // e.g. ["USER"] or ["ADMIN"]
  exp: number
  iat: number
}

