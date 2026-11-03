import React, { useState, useMemo } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider, CssBaseline, Snackbar, Alert } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { theme } from '../theme'
import { ScrollToTop } from '../components/common/ScrollToTop'
import { ToastContext, type ToastMessage } from './ToastContext'

export const RootLayout: React.FC = () => {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes cache for catalog
            retry: (failureCount, error) => {
              if (typeof error === 'object' && error !== null && 'status' in error) {
                const status = (error as { status: number }).status
                if (status === 401 || status === 403 || status === 404) return false
              }
              return failureCount < 2
            },
            refetchOnWindowFocus: false,
          },
        },
      }),
    []
  )

  const [toast, setToast] = useState<ToastMessage | null>(null)

  const showToast = (t: ToastMessage) => {
    setToast(t)
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastContext.Provider value={{ showToast }}>
          <ScrollToTop />
          <Outlet />

          <Snackbar
            open={!!toast}
            autoHideDuration={4000}
            onClose={() => setToast(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            {toast ? (
              <Alert
                onClose={() => setToast(null)}
                severity={toast.severity || 'info'}
                variant="filled"
                sx={{ width: '100%', boxShadow: '0 8px 24px rgba(41, 37, 33, 0.2)' }}
              >
                {toast.message}
              </Alert>
            ) : undefined}
          </Snackbar>
        </ToastContext.Provider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
