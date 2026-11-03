import { useSyncExternalStore } from 'react'
import type { AuthClaims } from '../../../types/auth.types'
import { getStoredToken, setStoredToken } from '../../../api/client'

interface AuthState {
  token: string | null
  claims: AuthClaims | null
  isAuthenticated: boolean
  isAdmin: boolean
}

function parseJwt(token: string): AuthClaims | null {
  try {
    const base64Url = token.split('.')[1]
    if (!base64Url) return null
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload) as AuthClaims
  } catch {
    return null
  }
}

function createInitialState(): AuthState {
  const token = getStoredToken()
  if (!token) {
    return { token: null, claims: null, isAuthenticated: false, isAdmin: false }
  }

  const claims = parseJwt(token)
  // Check token expiration
  if (claims && claims.exp && claims.exp * 1000 < Date.now()) {
    setStoredToken(null)
    return { token: null, claims: null, isAuthenticated: false, isAdmin: false }
  }

  const roles = claims?.roles || []
  const isAdmin = roles.includes('ADMIN') || roles.includes('ROLE_ADMIN')

  return {
    token,
    claims,
    isAuthenticated: !!claims,
    isAdmin,
  }
}

let currentState: AuthState = createInitialState()
const listeners = new Set<() => void>()

function emitChange() {
  for (const listener of listeners) {
    listener()
  }
}

export const authStore = {
  getState(): AuthState {
    return currentState
  },

  subscribe(listener: () => void): () => void {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },

  login(token: string) {
    setStoredToken(token)
    const claims = parseJwt(token)
    const roles = claims?.roles || []
    const isAdmin = roles.includes('ADMIN') || roles.includes('ROLE_ADMIN')

    currentState = {
      token,
      claims,
      isAuthenticated: !!claims,
      isAdmin,
    }
    emitChange()
  },

  logout() {
    setStoredToken(null)
    currentState = {
      token: null,
      claims: null,
      isAuthenticated: false,
      isAdmin: false,
    }
    emitChange()
  },
}

// React Hook using standard useSyncExternalStore
export function useAuth() {
  return useSyncExternalStore(authStore.subscribe, authStore.getState, authStore.getState)
}

// Listen to global 401 unauthorized event from apiClient
if (typeof window !== 'undefined') {
  window.addEventListener('auth:unauthorized', () => {
    authStore.logout()
  })
}

