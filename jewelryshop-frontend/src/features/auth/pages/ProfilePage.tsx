import React from 'react'
import {
  Container,
  Card,
  Typography,
  Box,
  Divider,
  Breadcrumbs,
  Link,
  Chip,
  Alert,
  Button,
} from '@mui/material'
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined'
import { Link as RouterLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCurrentUserQuery } from '../api/useAuth'
import { useDocumentTitle } from '../../../hooks/useDocumentTitle'
import { formatDate } from '../../../utils/formatDate'
import { brandColors } from '../../../theme/palette'
import { TableSkeleton } from '../../../components/common/LoadingSkeleton'

export const ProfilePage: React.FC = () => {
  const { t, i18n } = useTranslation(['auth', 'common'])
  useDocumentTitle(t('auth:profileTitle', 'Hồ Sơ Cá Nhân'))

  const { data: user, isLoading, error } = useCurrentUserQuery()

  return (
    <Container maxWidth="md" sx={{ py: 4, pb: 10 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/" color="inherit" underline="hover">
          {t('common:nav.collection', 'Trang Chủ')}
        </Link>
        <Typography color="text.primary" sx={{ fontWeight: 600 }}>{t('auth:profileTitle', 'Hồ Sơ')}</Typography>
      </Breadcrumbs>

      <Typography variant="h1" sx={{ fontSize: { xs: '1.85rem', md: '2.4rem' }, fontFamily: '"Playfair Display", Georgia, serif', mb: 3.5, color: brandColors.primary }}>
        {t('auth:profileTitle', 'Hồ Sơ Thành Viên')}
      </Typography>

      {isLoading ? (
        <TableSkeleton rows={4} />
      ) : error ? (
        <Alert severity="error" sx={{ borderRadius: 3 }}>Không thể tải thông tin tài khoản. Vui lòng thử lại sau.</Alert>
      ) : user ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
          {/* Haute Joaillerie VIP Metallic Membership Card */}
          <Card
            sx={{
              borderRadius: 4,
              background: 'linear-gradient(135deg, #2F2925 0%, #201C19 60%, #151210 100%)',
              color: '#FFFFFF',
              border: '1.5px solid rgba(176, 141, 87, 0.4)',
              boxShadow: '0 20px 48px -12px rgba(47, 41, 37, 0.35)',
              p: { xs: 3, sm: 4 },
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Ambient Gold Radial Flare */}
            <Box
              sx={{
                position: 'absolute',
                top: '-30%',
                right: '-10%',
                width: 320,
                height: 320,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(176, 141, 87, 0.25) 0%, rgba(32, 28, 25, 0) 70%)',
                pointerEvents: 'none',
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(216, 195, 165, 0.2)',
                    border: '1px solid rgba(176, 141, 87, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <DiamondOutlinedIcon sx={{ color: brandColors.secondary, fontSize: 22 }} />
                </Box>
                <Typography variant="caption" sx={{ color: brandColors.accent, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  JewelryShop Atelier VIP Privilege
                </Typography>
              </Box>

              <Chip
                label={user.role === 'ADMIN' ? 'QUẢN TRỊ VIÊN' : 'THÀNH VIÊN ĐẶC QUYỀN'}
                size="small"
                sx={{
                  backgroundColor: 'rgba(176, 141, 87, 0.25)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(176, 141, 87, 0.5)',
                  fontWeight: 700,
                  fontSize: '0.72rem',
                }}
              />
            </Box>

            <Box sx={{ mb: 4, position: 'relative', zIndex: 1 }}>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', mb: 0.5 }}>
                Tên Thành Viên Showroom
              </Typography>
              <Typography variant="h2" sx={{ fontSize: { xs: '1.5rem', sm: '1.85rem' }, color: '#FFFFFF', fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600 }}>
                {user.username}
              </Typography>
              <Typography variant="body2" sx={{ color: brandColors.accent, mt: 0.25 }}>
                {user.email}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', zIndex: 1 }}>
              <Box>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', display: 'block', fontSize: '0.7rem' }}>
                  MÃ THẺ THÀNH VIÊN
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.1em', color: '#FFFFFF' }}>
                  JW-MEMBER-{String(user.id).padStart(6, '0')}
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', display: 'block', fontSize: '0.7rem' }}>
                  NGÀY GIA NHẬP
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#FFFFFF' }}>
                  {formatDate(user.createdAt, i18n.language)}
                </Typography>
              </Box>
            </Box>
          </Card>

          {/* Quick Actions & Detail Card */}
          <Card sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3.5, border: `1px solid ${brandColors.border}` }}>
            <Typography variant="h3" sx={{ fontSize: '1.2rem', mb: 2.5, color: brandColors.primary }}>
              Thông Tin Tài Khoản & Đặc Quyền
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, mb: 4 }}>
              <Box sx={{ p: 2, borderRadius: 2.5, backgroundColor: brandColors.surfaceSubtle }}>
                <Typography variant="caption" sx={{ color: brandColors.textSecondary, textTransform: 'uppercase' }}>
                  Trạng Thái Tài Khoản
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <VerifiedOutlinedIcon sx={{ color: user.enabled ? brandColors.success : brandColors.error, fontSize: 18 }} />
                  <Typography variant="body1" sx={{ fontWeight: 600, color: user.enabled ? brandColors.success : brandColors.error }}>
                    {user.enabled ? 'Đang hoạt động bình thường' : 'Tài khoản đang bị khóa'}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ p: 2, borderRadius: 2.5, backgroundColor: brandColors.surfaceSubtle }}>
                <Typography variant="caption" sx={{ color: brandColors.textSecondary, textTransform: 'uppercase' }}>
                  Dịch Vụ Showroom Được Phục Vụ
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: brandColors.primary, mt: 0.5 }}>
                  Giữ chỗ 15 phút & Thử vàng tại quầy
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                component={RouterLink}
                to="/orders"
                variant="contained"
                color="primary"
                startIcon={<ShoppingBagOutlinedIcon />}
                sx={{ borderRadius: 2.5, px: 3 }}
              >
                Lịch Sử Đặt Giữ Chỗ
              </Button>
              <Button
                component={RouterLink}
                to="/"
                variant="outlined"
                sx={{ borderRadius: 2.5, px: 3 }}
              >
                Khám Phá Bộ Sưu Tập
              </Button>
            </Box>
          </Card>
        </Box>
      ) : null}
    </Container>
  )
}
