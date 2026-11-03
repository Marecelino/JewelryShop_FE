import type { Components, Theme } from '@mui/material/styles'
import { brandColors } from './palette'

export const componentOverrides: Components<Theme> = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        backgroundColor: brandColors.background,
        color: brandColors.textPrimary,
        minHeight: '100vh',
      },
      '::selection': {
        backgroundColor: brandColors.accent,
        color: brandColors.primary,
      },
      ':focus-visible': {
        outline: `2px solid ${brandColors.secondary}`,
        outlineOffset: '2px',
      },
    },
  },
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      root: {
        borderRadius: 8,
        minHeight: 44,
        padding: '10px 22px',
        fontWeight: 600,
        textTransform: 'none',
        letterSpacing: '0.01em',
        transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        '&:active': {
          transform: 'scale(0.98)',
        },
      },
      contained: {
        boxShadow: '0 2px 6px rgba(47, 41, 37, 0.12)',
        '&:hover': {
          boxShadow: '0 4px 14px rgba(47, 41, 37, 0.2)',
        },
      },
      outlined: {
        borderColor: brandColors.borderStrong,
        color: brandColors.primary,
        '&:hover': {
          borderColor: brandColors.secondary,
          backgroundColor: 'rgba(176, 141, 87, 0.06)',
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 14,
        backgroundColor: brandColors.surface,
        border: `1px solid ${brandColors.border}`,
        boxShadow: '0 1px 3px rgba(47, 41, 37, 0.04), 0 8px 20px -4px rgba(47, 41, 37, 0.06)',
        transition: 'transform 220ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 220ms cubic-bezier(0.16, 1, 0.3, 1), border-color 220ms cubic-bezier(0.16, 1, 0.3, 1)',
        '&:hover': {
          boxShadow: '0 4px 6px -1px rgba(47, 41, 37, 0.05), 0 16px 32px -4px rgba(47, 41, 37, 0.10)',
          borderColor: brandColors.secondary,
        },
      },
    },
  },
  MuiTextField: {
    defaultProps: {
      variant: 'outlined',
    },
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 8,
          backgroundColor: brandColors.surface,
          transition: 'border-color 180ms ease, box-shadow 180ms ease',
          '& fieldset': {
            borderColor: brandColors.border,
          },
          '&:hover fieldset': {
            borderColor: brandColors.borderStrong,
          },
          '&.Mui-focused fieldset': {
            borderColor: brandColors.secondary,
            borderWidth: 2,
          },
        },
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: 16,
        backgroundColor: brandColors.surface,
        border: `1px solid ${brandColors.border}`,
        boxShadow: '0 24px 48px -12px rgba(47, 41, 37, 0.18)',
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 6,
        fontWeight: 600,
        letterSpacing: '0.02em',
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundColor: 'rgba(250, 248, 245, 0.92)',
        backdropFilter: 'blur(16px)',
        color: brandColors.textPrimary,
        borderBottom: `1px solid ${brandColors.hairline}`,
        boxShadow: '0 1px 3px rgba(47, 41, 37, 0.03)',
      },
    },
  },
}
