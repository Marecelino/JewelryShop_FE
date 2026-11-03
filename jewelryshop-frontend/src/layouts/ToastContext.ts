import React from 'react'

export interface ToastMessage {
  message: string
  severity?: 'success' | 'info' | 'warning' | 'error'
}

export const ToastContext = React.createContext<{
  showToast: (toast: ToastMessage) => void
}>({
  showToast: () => {},
})

