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
import PhoneInTalkOutlinedIcon from '@mui/icons-material/PhoneInTalkOutlined'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined'
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined'
import QrCode2OutlinedIcon from '@mui/icons-material/QrCode2Outlined'
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
    <Box sx={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', backgroundColor: brandColors.background, overflowX: 'hidden' }}>
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
                    fontSize: { xs: '1.15rem', sm: '1.35rem', md: '1.5rem' },
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    color: brandColors.primary,
                    lineHeight: 1.15,
                  }}
                >
                  KIM NGÂN PHÁT
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: { xs: 'none', sm: 'block' },
                    fontSize: '0.65rem',
                    letterSpacing: '0.12em',
                    color: brandColors.secondary,
                    textTransform: 'uppercase',
                    fontWeight: 600,
                  }}
                >
                  Tiệm Vàng & Chế Tác Kim Hoàn
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
              width: 'min(320px, 85vw)',
              backgroundColor: brandColors.background,
              boxShadow: '0 16px 40px rgba(47, 41, 37, 0.15)',
            },
          },
        }}
      >
        <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DiamondOutlinedIcon sx={{ color: brandColors.secondary, fontSize: 24 }} />
            <Typography variant="h3" sx={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '1.2rem', fontWeight: 700 }}>
              KIM NGÂN PHÁT
            </Typography>
          </Box>
          <IconButton onClick={() => setMobileDrawerOpen(false)} aria-label="Đóng menu" sx={{ minWidth: 44, minHeight: 44 }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <List sx={{ px: 1, py: 1.5, pb: 'calc(24px + env(safe-area-inset-bottom, 0px))' }}>
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

      {/* Luxury Brand Fine Jewelry Footer */}
      <Box
        component="footer"
        sx={{
          backgroundColor: brandColors.surface,
          borderTop: `1px solid ${brandColors.border}`,
          pt: { xs: 6, md: 8 },
          pb: 4,
          mt: 'auto',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: 1200,
            height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, #B08D57 50%, transparent 100%)',
            opacity: 0.7,
          },
        }}
      >
        <Container maxWidth="lg">
          {/* Main 4-Column Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: '1.4fr 1.2fr 1.2fr 1.2fr' },
              gap: { xs: 4, sm: 4, lg: 5 },
              mb: 6,
            }}
          >
            {/* Column 1: Brand & Atelier Purity Guarantee */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(216, 195, 165, 0.3) 0%, rgba(176, 141, 87, 0.1) 100%)',
                    border: '1px solid rgba(176, 141, 87, 0.35)',
                    color: brandColors.secondary,
                  }}
                >
                  <DiamondOutlinedIcon sx={{ fontSize: 22 }} />
                </Box>
                <Box>
                  <Typography
                    variant="h2"
                    sx={{
                      fontSize: '1.35rem',
                      color: brandColors.primary,
                      fontFamily: '"Playfair Display", Georgia, serif',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      lineHeight: 1.2,
                    }}
                  >
                    KIM NGÂN PHÁT
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: '0.7rem',
                      letterSpacing: '0.12em',
                      color: brandColors.secondary,
                      textTransform: 'uppercase',
                      fontWeight: 600,
                      display: 'block',
                    }}
                  >
                    Tiệm Vàng & Chế Tác Kim Hoàn
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body2" sx={{ color: brandColors.textSecondary, mb: 2.5, lineHeight: 1.7, fontSize: '0.875rem' }}>
                {t(
                  'common:footer.promise',
                  'Thương hiệu chế tác kim hoàn và vàng bạc đá quý uy tín. Cam kết 100% vàng đủ tuổi, kim cương & đá quý tự nhiên có mã kiểm định độc lập. Giữ trọn giá trị qua từng thế hệ.'
                )}
              </Typography>

              {/* 15-Minute Reservation Feature Callout */}
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2.5,
                  backgroundColor: brandColors.surfaceSubtle,
                  border: `1px solid ${brandColors.border}`,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1.5,
                }}
              >

              </Box>
            </Box>

            {/* Column 2: Showroom & Direct Contact */}
            <Box>
              <Typography
                variant="h4"
                sx={{
                  mb: 2.5,
                  color: brandColors.primary,
                  fontWeight: 700,
                  fontSize: '1rem',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  position: 'relative',
                  display: 'inline-block',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -6,
                    left: 0,
                    width: 28,
                    height: 2,
                    backgroundColor: brandColors.secondary,
                    borderRadius: 1,
                  },
                }}
              >
                {t('common:footer.showroomTitle', 'Showroom Trải Nghiệm')}
              </Typography>

              {/* Address */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25, mb: 1.75 }}>
                <LocationOnOutlinedIcon sx={{ color: brandColors.secondary, fontSize: 20, mt: 0.2, flexShrink: 0 }} />
                <Box>
                  <Typography variant="body2" sx={{ color: brandColors.textPrimary, fontWeight: 500, lineHeight: 1.5, fontSize: '0.875rem' }}>
                    {t('common:footer.address', 'ĐT 746B, KP4, P. Bình Cơ, Hồ Chí Minh, Việt Nam')}
                  </Typography>
                  <Box
                    component="a"
                    href="https://maps.app.goo.gl/cvpm8ijJpxDp4N8z8"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.5,
                      mt: 0.75,
                      fontSize: '0.785rem',
                      color: brandColors.secondary,
                      textDecoration: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        textDecoration: 'underline',
                        color: brandColors.secondaryHover,
                      },
                    }}
                  >
                    <span>{t('common:footer.viewMap', 'Chỉ đường trên Google Maps')}</span>
                    <OpenInNewIcon sx={{ fontSize: 14 }} />
                  </Box>
                </Box>
              </Box>

              {/* Hotline Phone */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1.75 }}>
                <PhoneInTalkOutlinedIcon sx={{ color: brandColors.secondary, fontSize: 20, flexShrink: 0 }} />
                <Box>
                  <Typography variant="caption" sx={{ color: brandColors.textMuted, display: 'block' }}>
                    Tư vấn & Khóa giữ chỗ:
                  </Typography>
                  <Box
                    component="a"
                    href="tel:0974863175"
                    sx={{
                      color: brandColors.primary,
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                      letterSpacing: '0.02em',
                      '&:hover': {
                        color: brandColors.secondary,
                      },
                    }}
                  >
                    0974 863 175
                  </Box>
                </Box>
              </Box>

              {/* Opening Hours */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
                <AccessTimeOutlinedIcon sx={{ color: brandColors.secondary, fontSize: 20, mt: 0.2, flexShrink: 0 }} />
                <Typography variant="body2" sx={{ color: brandColors.textSecondary, lineHeight: 1.5, fontSize: '0.875rem' }}>
                  {t('common:footer.hours', 'Giờ mở cửa: 08:30 – 21:00 (Tất cả các ngày trong tuần)')}
                </Typography>
              </Box>
            </Box>

            {/* Column 3: Trust & Atelier Policies */}
            <Box>
              <Typography
                variant="h4"
                sx={{
                  mb: 2.5,
                  color: brandColors.primary,
                  fontWeight: 700,
                  fontSize: '1rem',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  position: 'relative',
                  display: 'inline-block',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -6,
                    left: 0,
                    width: 28,
                    height: 2,
                    backgroundColor: brandColors.secondary,
                    borderRadius: 1,
                  },
                }}
              >
                {t('common:footer.policyTitle', 'Cam Kết Bảo An Kim Hoàn')}
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <VerifiedOutlinedIcon sx={{ color: brandColors.success, fontSize: 18, mt: 0.3, flexShrink: 0 }} />
                  <Typography variant="body2" sx={{ color: brandColors.textSecondary, fontSize: '0.85rem', lineHeight: 1.5 }}>
                    {t('common:footer.policySpectroscopy', 'Kiểm định tuổi vàng quang phổ trực tiếp tại quầy')}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <VerifiedOutlinedIcon sx={{ color: brandColors.success, fontSize: 18, mt: 0.3, flexShrink: 0 }} />
                  <Typography variant="body2" sx={{ color: brandColors.textSecondary, fontSize: '0.85rem', lineHeight: 1.5 }}>
                    {t('common:footer.policyReservation', 'Khóa giữ chỗ an toàn 15 phút chống trùng món')}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <VerifiedOutlinedIcon sx={{ color: brandColors.secondary, fontSize: 18, mt: 0.3, flexShrink: 0 }} />
                  <Typography variant="body2" sx={{ color: brandColors.textSecondary, fontSize: '0.85rem', lineHeight: 1.5 }}>
                    {t('common:footer.policyLifetimeCare', 'Bảo dưỡng, đánh bóng và làm sáng trọn đời')}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1,
                    p: 1.25,
                    borderRadius: 2,
                    backgroundColor: brandColors.warningBg,
                    border: '1px solid rgba(139, 94, 26, 0.2)',
                  }}
                >

                </Box>
              </Box>
            </Box>

            {/* Column 4: Counter Payment & Certifications */}
            <Box>
              <Typography
                variant="h4"
                sx={{
                  mb: 2.5,
                  color: brandColors.primary,
                  fontWeight: 700,
                  fontSize: '1rem',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  position: 'relative',
                  display: 'inline-block',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -6,
                    left: 0,
                    width: 28,
                    height: 2,
                    backgroundColor: brandColors.secondary,
                    borderRadius: 1,
                  },
                }}
              >
                {t('common:footer.paymentTitle', 'Thanh Toán & Chứng Nhận')}
              </Typography>

              <Typography variant="caption" sx={{ color: brandColors.textMuted, display: 'block', mb: 1.25 }}>
                Phương thức chấp nhận tại quầy:
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2.5 }}>
                <Box
                  sx={{
                    px: 1.25,
                    py: 0.5,
                    borderRadius: 1.5,
                    border: `1px solid ${brandColors.border}`,
                    backgroundColor: brandColors.surfaceSubtle,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                  }}
                >
                  <PaymentsOutlinedIcon sx={{ fontSize: 15, color: brandColors.primary }} />
                  <Typography variant="caption" sx={{ fontWeight: 600, color: brandColors.primary, fontSize: '0.75rem' }}>
                    Tiền mặt
                  </Typography>
                </Box>

                <Box
                  sx={{
                    px: 1.25,
                    py: 0.5,
                    borderRadius: 1.5,
                    border: `1px solid ${brandColors.border}`,
                    backgroundColor: brandColors.surfaceSubtle,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                  }}
                >
                  <QrCode2OutlinedIcon sx={{ fontSize: 15, color: brandColors.primary }} />
                  <Typography variant="caption" sx={{ fontWeight: 600, color: brandColors.primary, fontSize: '0.75rem' }}>
                    VietQR / Napas
                  </Typography>
                </Box>

                <Box
                  sx={{
                    px: 1.25,
                    py: 0.5,
                    borderRadius: 1.5,
                    border: `1px solid ${brandColors.border}`,
                    backgroundColor: brandColors.surfaceSubtle,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                  }}
                >
                  <CreditCardOutlinedIcon sx={{ fontSize: 15, color: brandColors.primary }} />
                  <Typography variant="caption" sx={{ fontWeight: 600, color: brandColors.primary, fontSize: '0.75rem' }}>
                    Visa / Mastercard
                  </Typography>
                </Box>
              </Box>

              {/* Trust Badges */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                {/* Bộ Công Thương Badge */}
                <Box
                  sx={{
                    p: 1.25,
                    borderRadius: 2,
                    border: '1px solid rgba(46, 125, 50, 0.35)',
                    backgroundColor: '#F1F8E9',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.25,
                  }}
                >
                  <ShieldOutlinedIcon sx={{ color: '#2E7D32', fontSize: 20, flexShrink: 0 }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: '#1B5E20', fontWeight: 700, display: 'block', fontSize: '0.725rem' }}>
                      ĐÃ THÔNG BÁO BỘ CÔNG THƯƠNG
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#33691E', fontSize: '0.675rem', display: 'block' }}>
                      Website TMĐT bán hàng kim hoàn hợp chuẩn
                    </Typography>
                  </Box>
                </Box>

                {/* TCVN Gold Standard Badge */}
                <Box
                  sx={{
                    p: 1.25,
                    borderRadius: 2,
                    border: `1px solid ${brandColors.hairlineGold}`,
                    backgroundColor: 'rgba(216, 195, 165, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.25,
                  }}
                >
                  <DiamondOutlinedIcon sx={{ color: brandColors.secondary, fontSize: 18, flexShrink: 0 }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: brandColors.primary, fontWeight: 700, display: 'block', fontSize: '0.725rem' }}>
                      TIÊU CHUẨN ĐO LƯỜNG VÀNG TCVN
                    </Typography>
                    <Typography variant="caption" sx={{ color: brandColors.textSecondary, fontSize: '0.675rem', display: 'block' }}>
                      Cân đo điện tử & quang phổ chính xác 99.99%
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Bottom Bar: Gold Hairline & Exact User-Specified Copyright */}
          <Divider sx={{ borderColor: brandColors.hairlineGold, mb: 3 }} />

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: brandColors.textPrimary,
                fontSize: { xs: '0.825rem', sm: '0.875rem' },
                fontWeight: 500,
                letterSpacing: '0.02em',
                lineHeight: 1.6,
              }}
            >
              © Copyright Kim Ngân Phát. All rights reserved. Designed by Nguyễn Trọng Thứ
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
