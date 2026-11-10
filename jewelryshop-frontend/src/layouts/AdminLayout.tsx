import React from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Container,
  Tabs,
  Tab,
  Paper,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import { Link as RouterLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth, authStore } from '../features/auth/store/authStore'
import { brandColors } from '../theme/palette'

export const AdminLayout: React.FC = () => {
  const { t } = useTranslation('admin')
  const { claims } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  // Determine current active tab
  let currentTab = 0
  if (location.pathname.startsWith('/admin/inventory')) currentTab = 1
  if (location.pathname.startsWith('/admin/orders')) currentTab = 2

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    if (newValue === 0) navigate('/admin/products')
    if (newValue === 1) navigate('/admin/inventory')
    if (newValue === 2) navigate('/admin/orders')
  }

  return (
    <Box sx={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', backgroundColor: brandColors.background, overflowX: 'hidden' }}>
      {/* Top Admin Header */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: '#24201D',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          color: brandColors.textInverse,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', height: 64, px: { xs: 1.5, sm: 2, md: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
            <Button
              component={RouterLink}
              to="/"
              startIcon={<ArrowBackIcon />}
              sx={{
                color: brandColors.accent,
                fontWeight: 600,
                borderRadius: 2,
                px: { xs: 1, sm: 1.5 },
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  color: '#FFFFFF',
                },
              }}
            >
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Về Cửa Hàng</Box>
              <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>Về Shop</Box>
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DiamondOutlinedIcon sx={{ color: brandColors.secondary, fontSize: 22 }} />
              <Typography
                variant="h3"
                sx={{
                  color: brandColors.textInverse,
                  fontSize: { xs: '0.95rem', sm: '1.15rem' },
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                {t('title', 'Quản Trị Showroom Kim Hoàn')}
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  color: brandColors.textInverse,
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  display: { xs: 'block', sm: 'none' },
                }}
              >
                Quản Trị
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
            <Box
              sx={{
                display: { xs: 'none', sm: 'block' },
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                backgroundColor: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              <Typography variant="caption" sx={{ color: brandColors.accent, fontWeight: 600 }}>
                Admin: {claims?.username}
              </Typography>
            </Box>
            <Button
              size="small"
              variant="outlined"
              onClick={() => {
                authStore.logout()
                navigate('/')
              }}
              sx={{
                borderColor: 'rgba(255,255,255,0.25)',
                color: brandColors.textInverse,
                borderRadius: 2,
                px: { xs: 1, sm: 1.5 },
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                '&:hover': {
                  borderColor: brandColors.accent,
                  backgroundColor: 'rgba(255,255,255,0.08)',
                },
              }}
            >
              Đăng Xuất
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Admin Tabs Bar */}
      <Paper elevation={0} sx={{ borderBottom: `1px solid ${brandColors.border}`, backgroundColor: brandColors.surface }}>
        <Container maxWidth="xl">
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            textColor="secondary"
            indicatorColor="secondary"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                minHeight: 52,
                fontWeight: 600,
                fontSize: '0.925rem',
                textTransform: 'none',
                gap: 1,
              },
            }}
          >
            <Tab icon={<DiamondOutlinedIcon fontSize="small" />} iconPosition="start" label="Danh Mục Trang Sức" />
            <Tab icon={<Inventory2OutlinedIcon fontSize="small" />} iconPosition="start" label="Kho Vật Lý & Barcode" />
            <Tab icon={<AssignmentOutlinedIcon fontSize="small" />} iconPosition="start" label="Giám Sát Đơn Hàng" />
          </Tabs>
        </Container>
      </Paper>

      {/* Admin Content Outlet */}
      <Container maxWidth="xl" sx={{ py: { xs: 2.5, sm: 3, md: 4 }, px: { xs: 1.5, sm: 2.5, md: 3 }, flexGrow: 1 }}>
        <Outlet />
      </Container>
    </Box>
  )
}
