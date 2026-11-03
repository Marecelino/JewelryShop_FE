import React, { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Container,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import LanguageIcon from '@mui/icons-material/Language'
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined'
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import { Link as RouterLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth, authStore } from '../features/auth/store/authStore'
import { useCart } from '../features/cart/store/cartStore'
import { CartDrawer } from '../features/cart/components/CartDrawer'
import { brandColors } from '../theme/palette'

export const StorefrontLayout: React.FC = () => {
  const { t, i18n } = useTranslation(['common', 'auth'])
  const { isAuthenticated, claims, isAdmin } = useAuth()
  const { totalQuantity } = useCart()
  const navigate = useNavigate()
  const location = useLocation()

  // State
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [accountMenuAnchor, setAccountMenuAnchor] = useState<null | HTMLElement>(null)

  const handleOpenAccountMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAccountMenuAnchor(event.currentTarget)
  }

  const handleCloseAccountMenu = () => {
    setAccountMenuAnchor(null)
  }

  const handleLogout = () => {
    handleCloseAccountMenu()
    authStore.logout()
    navigate('/')
  }

  const toggleLanguage = () => {
    const nextLang = i18n.language.startsWith('vi') ? 'en' : 'vi'
    i18n.changeLanguage(nextLang)
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: brandColors.background }}>
      {/* Frosted Glass Sticky Header */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: 'rgba(250, 248, 245, 0.90)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: `1px solid ${brandColors.hairline}`,
          zIndex: (theme) => theme.zIndex.drawer - 1,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', height: { xs: 64, md: 76 }, px: { xs: 2, md: 5 } }}>
          {/* Left: Mobile Hamburger & Brand Wordmark */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <IconButton
              sx={{ display: { md: 'none' }, minWidth: 44, minHeight: 44, color: brandColors.primary }}
              onClick={() => setMobileDrawerOpen(true)}
              aria-label={t('common:nav.menu', 'Menu')}
            >
              <MenuIcon />
            </IconButton>

            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                textDecoration: 'none',
                color: brandColors.primary,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: { xs: 36, md: 40 },
                  height: { xs: 36, md: 40 },
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(216, 195, 165, 0.3) 0%, rgba(176, 141, 87, 0.1) 100%)',
                  border: `1px solid rgba(176, 141, 87, 0.3)`,
                }}
              >
                <DiamondOutlinedIcon sx={{ color: brandColors.secondary, fontSize: { xs: 22, md: 24 } }} />
              </Box>
              <Box>
                <Typography
                  variant="h1"
                  sx={{
                    fontFamily: '"Playfair Display", Georgia, serif',
                    fontSize: { xs: '1.25rem', md: '1.5rem' },
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    color: brandColors.primary,
                    lineHeight: 1.1,
                  }}
                >
                  JEWELRY SHOP
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: { xs: 'none', sm: 'block' },
                    fontSize: '0.65rem',
                    letterSpacing: '0.14em',
                    color: brandColors.secondary,
                    textTransform: 'uppercase',
                    fontWeight: 600,
                  }}
                >
                  Haute Joaillerie Atelier
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Center: Desktop Primary Nav Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 4 }}>
            <Button
              component={RouterLink}
              to="/"
              sx={{
                color: location.pathname === '/' ? brandColors.secondary : brandColors.textPrimary,
                fontWeight: location.pathname === '/' ? 700 : 500,
                fontSize: '0.925rem',
                letterSpacing: '0.02em',
                position: 'relative',
                px: 1,
                py: 0.5,
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -4,
                  left: 0,
                  width: location.pathname === '/' ? '100%' : '0%',
                  height: '2px',
                  backgroundColor: brandColors.secondary,
                  transition: 'width 200ms ease-in-out',
                },
                '&:hover::after': {
                  width: '100%',
                },
              }}
            >
              {t('common:nav.collection', 'Bộ Sưu Tập')}
            </Button>
          </Box>

          {/* Right: Actions (Language, Cart, Account) */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            {/* Language Switcher */}
            <Button
              onClick={toggleLanguage}
              size="small"
              startIcon={<LanguageIcon fontSize="small" />}
              sx={{
                minWidth: 44,
                minHeight: 40,
                color: brandColors.textSecondary,
                fontWeight: 600,
                borderRadius: 2,
                px: 1.5,
                display: { xs: 'none', sm: 'inline-flex' },
                '&:hover': {
                  color: brandColors.primary,
                  backgroundColor: 'rgba(47, 41, 37, 0.04)',
                },
              }}
            >
              {i18n.language.startsWith('vi') ? 'EN' : 'VI'}
            </Button>

            {/* Cart Icon with badge */}
            <IconButton
              onClick={() => setCartOpen(true)}
              aria-label={t('common:nav.cart', 'Giỏ Hàng')}
              sx={{
                minWidth: 44,
                minHeight: 44,
                color: brandColors.primary,
                transition: 'transform 180ms ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  backgroundColor: 'rgba(176, 141, 87, 0.08)',
                },
              }}
            >
              <Badge
                badgeContent={totalQuantity}
                color="secondary"
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: brandColors.secondary,
                    color: brandColors.textInverse,
                    fontWeight: 700,
                    boxShadow: '0 0 0 2px #FAF8F5',
                  },
                }}
              >
                <ShoppingBagOutlinedIcon />
              </Badge>
            </IconButton>

            {/* Account area */}
            {isAuthenticated ? (
              <>
                <Button
                  onClick={handleOpenAccountMenu}
                  startIcon={<AccountCircleOutlinedIcon />}
                  sx={{
                    minHeight: 42,
                    color: brandColors.primary,
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: 2,
                    px: 1.5,
                    display: { xs: 'none', sm: 'inline-flex' },
                    backgroundColor: 'rgba(242, 238, 232, 0.6)',
                    border: `1px solid ${brandColors.border}`,
                    '&:hover': {
                      backgroundColor: brandColors.surfaceSubtle,
                    },
                  }}
                >
                  {claims?.username || 'Khách hàng'}
                </Button>
                <IconButton
                  onClick={handleOpenAccountMenu}
                  sx={{ minWidth: 44, minHeight: 44, display: { xs: 'inline-flex', sm: 'none' } }}
                  aria-label="Tài khoản"
                >
                  <AccountCircleOutlinedIcon />
                </IconButton>
                <Menu
                  anchorEl={accountMenuAnchor}
                  open={Boolean(accountMenuAnchor)}
                  onClose={handleCloseAccountMenu}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  slotProps={{
                    paper: {
                      sx: {
                        borderRadius: 3,
                        mt: 1,
                        boxShadow: '0 12px 32px rgba(47, 41, 37, 0.12)',
                        border: `1px solid ${brandColors.border}`,
                        minWidth: 200,
                      },
                    },
                  }}
                >
                  <MenuItem
                    component={RouterLink}
                    to="/profile"
                    onClick={handleCloseAccountMenu}
                    sx={{ py: 1.25, fontWeight: 500 }}
                  >
                    {t('common:nav.profile', 'Hồ Sơ Của Tôi')}
                  </MenuItem>
                  <MenuItem
                    component={RouterLink}
                    to="/orders"
                    onClick={handleCloseAccountMenu}
                    sx={{ py: 1.25, fontWeight: 500 }}
                  >
                    {t('common:nav.orders', 'Đơn Hàng Của Tôi')}
                  </MenuItem>
                  {isAdmin && (
                    <MenuItem
                      component={RouterLink}
                      to="/admin/products"
                      onClick={handleCloseAccountMenu}
                      sx={{ py: 1.25, color: brandColors.secondary, fontWeight: 700 }}
                    >
                      {t('common:nav.admin', 'Trang Quản Trị Showroom')}
                    </MenuItem>
                  )}
                  <Divider sx={{ my: 0.5 }} />
                  <MenuItem onClick={handleLogout} sx={{ py: 1.25, color: brandColors.error, fontWeight: 600 }}>
                    {t('common:nav.logout', 'Đăng Xuất')}
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  size="small"
                  sx={{ minHeight: 38, borderRadius: 2 }}
                >
                  {t('common:nav.login', 'Đăng Nhập')}
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{ minHeight: 38, borderRadius: 2, display: { xs: 'none', sm: 'inline-flex' } }}
                >
                  {t('common:nav.register', 'Đăng Ký')}
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: 'min(300px, 82vw)',
              backgroundColor: brandColors.background,
              boxShadow: '0 16px 40px rgba(47, 41, 37, 0.15)',
            },
          },
        }}
      >
        <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DiamondOutlinedIcon sx={{ color: brandColors.secondary, fontSize: 24 }} />
            <Typography variant="h3" sx={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '1.25rem' }}>
              JEWELRY SHOP
            </Typography>
          </Box>
          <IconButton onClick={() => setMobileDrawerOpen(false)} aria-label="Đóng menu">
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <List sx={{ px: 1, py: 1.5 }}>
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={RouterLink}
              to="/"
              onClick={() => setMobileDrawerOpen(false)}
              sx={{ borderRadius: 2 }}
            >
              <ListItemText primary={t('common:nav.collection', 'Bộ Sưu Tập Trang Sức')} />
            </ListItemButton>
          </ListItem>

          {isAuthenticated ? (
            <>
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={RouterLink}
                  to="/orders"
                  onClick={() => setMobileDrawerOpen(false)}
                  sx={{ borderRadius: 2 }}
                >
                  <ListItemText primary={t('common:nav.orders', 'Đơn Hàng Của Tôi')} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={RouterLink}
                  to="/profile"
                  onClick={() => setMobileDrawerOpen(false)}
                  sx={{ borderRadius: 2 }}
                >
                  <ListItemText primary={t('common:nav.profile', 'Hồ Sơ Của Tôi')} />
                </ListItemButton>
              </ListItem>
              {isAdmin && (
                <ListItem disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    component={RouterLink}
                    to="/admin/products"
                    onClick={() => setMobileDrawerOpen(false)}
                    sx={{ borderRadius: 2 }}
                  >
                    <ListItemText
                      primary={t('common:nav.admin', 'Trang Quản Trị Showroom')}
                      slotProps={{ primary: { sx: { color: brandColors.secondary, fontWeight: 700 } } }}
                    />
                  </ListItemButton>
                </ListItem>
              )}
              <Divider sx={{ my: 1.5 }} />
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    setMobileDrawerOpen(false)
                    handleLogout()
                  }}
                  sx={{ borderRadius: 2 }}
                >
                  <ListItemText
                    primary={t('common:nav.logout', 'Đăng Xuất')}
                    slotProps={{ primary: { sx: { color: brandColors.error, fontWeight: 600 } } }}
                  />
                </ListItemButton>
              </ListItem>
            </>
          ) : (
            <>
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={RouterLink}
                  to="/login"
                  onClick={() => setMobileDrawerOpen(false)}
                  sx={{ borderRadius: 2 }}
                >
                  <ListItemText primary={t('common:nav.login', 'Đăng Nhập')} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={RouterLink}
                  to="/register"
                  onClick={() => setMobileDrawerOpen(false)}
                  sx={{ borderRadius: 2 }}
                >
                  <ListItemText primary={t('common:nav.register', 'Đăng Ký')} />
                </ListItemButton>
              </ListItem>
            </>
          )}

          <Divider sx={{ my: 2 }} />
          <ListItem>
            <Button
              onClick={toggleLanguage}
              fullWidth
              variant="outlined"
              size="small"
              startIcon={<LanguageIcon />}
              sx={{ borderRadius: 2 }}
            >
              {i18n.language.startsWith('vi') ? 'Ngôn ngữ: Tiếng Việt (Chuyển sang EN)' : 'Language: English (Switch to VI)'}
            </Button>
          </ListItem>
        </List>
      </Drawer>

      {/* Slide-over Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Main Content Area */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>

      {/* Luxury Brand Atelier Footer */}
      <Box
        component="footer"
        sx={{
          backgroundColor: brandColors.surface,
          borderTop: `1px solid ${brandColors.border}`,
          pt: { xs: 5, md: 8 },
          pb: 4,
          mt: 'auto',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1.2fr 1.2fr' }, gap: { xs: 4, md: 6 }, mb: 6 }}>
            {/* Column 1: Brand & Atelier Promise */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <DiamondOutlinedIcon sx={{ color: brandColors.secondary, fontSize: 28 }} />
                <Typography variant="h2" sx={{ fontSize: '1.5rem', color: brandColors.primary, fontFamily: '"Playfair Display", Georgia, serif' }}>
                  JEWELRY SHOP
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: brandColors.textSecondary, mb: 2.5, maxWidth: 460, lineHeight: 1.7 }}>
                {t('common:footer.promise', 'Nhà chế tác kim hoàn thượng lưu với cam kết 100% vàng nguyên chất, kim cương tự nhiên và chứng thư kiểm định độc lập.')}
              </Typography>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2.5,
                  backgroundColor: brandColors.surfaceSubtle,
                  border: `1px solid ${brandColors.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  maxWidth: 460,
                }}
              >
                <AccessTimeOutlinedIcon sx={{ color: brandColors.secondary, fontSize: 24, flexShrink: 0 }} />
                <Typography variant="caption" sx={{ color: brandColors.primary, fontWeight: 600, lineHeight: 1.5 }}>
                  {t('common:footer.pickupNote', 'Hệ thống giữ chỗ độc quyền 15 phút tại showroom. Quý khách trải nghiệm thực tế, kiểm định và thanh toán trực tiếp tại quầy.')}
                </Typography>
              </Box>
            </Box>

            {/* Column 2: Showroom Destination */}
            <Box>
              <Typography variant="h4" sx={{ mb: 2, color: brandColors.primary, fontWeight: 700 }}>
                Showroom Trải Nghiệm
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25, mb: 1.5 }}>
                <LocationOnOutlinedIcon sx={{ color: brandColors.secondary, fontSize: 20, mt: 0.2 }} />
                <Typography variant="body2" sx={{ color: brandColors.textSecondary }}>
                  {t('common:footer.address', 'Tòa nhà Kim Hoàn, Hà Nội, Việt Nam')}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25, mb: 1.5 }}>
                <AccessTimeOutlinedIcon sx={{ color: brandColors.secondary, fontSize: 20, mt: 0.2 }} />
                <Typography variant="body2" sx={{ color: brandColors.textSecondary }}>
                  {t('common:footer.hours', '08:30 – 21:00 (Thứ Hai – Chủ Nhật)')}
                </Typography>
              </Box>
            </Box>

            {/* Column 3: Trust & Atelier Policies */}
            <Box>
              <Typography variant="h4" sx={{ mb: 2, color: brandColors.primary, fontWeight: 700 }}>
                Cam Kết Bảo An
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.25 }}>
                <VerifiedOutlinedIcon sx={{ color: brandColors.success, fontSize: 18 }} />
                <Typography variant="body2" sx={{ color: brandColors.textSecondary }}>
                  Kiểm định tuổi vàng trực tiếp tại quầy
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.25 }}>
                <VerifiedOutlinedIcon sx={{ color: brandColors.success, fontSize: 18 }} />
                <Typography variant="body2" sx={{ color: brandColors.textSecondary }}>
                  Khóa giữ chỗ an toàn 15 phút
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <VerifiedOutlinedIcon sx={{ color: brandColors.warning, fontSize: 18 }} />
                <Typography variant="body2" sx={{ color: brandColors.textSecondary }}>
                  Không áp dụng giao hàng bưu điện
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ borderColor: brandColors.hairline, mb: 3 }} />

          <Typography variant="caption" sx={{ color: brandColors.textMuted, display: 'block', textAlign: 'center', letterSpacing: '0.04em' }}>
            {t('common:footer.copyright', '© 2026 JewelryShop. Bản quyền thuộc về thương hiệu JewelryShop Haute Joaillerie.')}
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}
