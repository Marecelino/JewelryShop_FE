import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../features/auth/store/authStore'
import { RoleGuard } from './RoleGuard'

interface Props {
  children: React.ReactNode
  requiredRole?: 'ADMIN' | 'USER'
}

export const ProtectedRoute: React.FC<Props> = ({ children, requiredRole }) => {
  const { isAuthenticated, isAdmin } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requiredRole === 'ADMIN' && !isAdmin) {
    return <RoleGuard />
  }

  return <>{children}</>
}

