import { createTheme } from '@mui/material/styles'
import { brandColors } from './palette'
import { typographyOptions } from './typography'
import { componentOverrides } from './components'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: brandColors.primary,
      light: brandColors.primaryHover,
      dark: '#1A1614',
      contrastText: brandColors.textInverse,
    },
    secondary: {
      main: brandColors.secondary,
      light: brandColors.accent,
      dark: brandColors.secondaryHover,
      contrastText: brandColors.textInverse,
    },
    background: {
      default: brandColors.background,
      paper: brandColors.surface,
    },
    text: {
      primary: brandColors.textPrimary,
      secondary: brandColors.textSecondary,
    },
    divider: brandColors.border,
    success: {
      main: brandColors.success,
      light: brandColors.successBg,
    },
    warning: {
      main: brandColors.warning,
      light: brandColors.warningBg,
    },
    error: {
      main: brandColors.error,
      light: brandColors.errorBg,
    },
    info: {
      main: brandColors.info,
      light: brandColors.infoBg,
    },
  },
  typography: typographyOptions,
  shape: {
    borderRadius: 8,
  },
  components: componentOverrides,
})

export default theme

