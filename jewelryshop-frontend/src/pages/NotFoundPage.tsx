import React from 'react'
import { Container, Box, Typography, Button } from '@mui/material'
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Link as RouterLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { brandColors } from '../theme/palette'

export const NotFoundPage: React.FC = () => {
  const { t } = useTranslation('common')
  useDocumentTitle(t('notFound.title', '404 — Không Tìm Thấy Trang'))

  return (
    <Container maxWidth="sm" sx={{ py: 14, textAlign: 'center' }}>
      <Box
        sx={{
          display: 'inline-flex',
          p: 3.5,
          borderRadius: '50%',
          backgroundColor: brandColors.surfaceSubtle,
          border: `1.5px solid ${brandColors.borderStrong}`,
          color: brandColors.secondary,
          boxShadow: '0 8px 24px rgba(47, 41, 37, 0.06)',
          mb: 3.5,
        }}
      >
        <DiamondOutlinedIcon sx={{ fontSize: 64 }} />
      </Box>

      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: '2.2rem', md: '2.8rem' },
          color: brandColors.primary,
          mb: 2,
          fontFamily: '"Playfair Display", Georgia, serif',
          fontWeight: 600,
        }}
      >
        404 — Tuyệt Tác Không Tìm Thấy
      </Typography>

      <Typography variant="body1" sx={{ color: brandColors.textSecondary, mb: 4, maxWidth: 460, mx: 'auto', lineHeight: 1.7 }}>
        {t('notFound.message', 'Trang bạn đang tìm kiếm không tồn tại hoặc đã được chuyển hướng sang bộ sưu tập kim hoàn khác.')}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
        <Button
          component={RouterLink}
          to="/"
          variant="contained"
          color="primary"
          size="large"
          endIcon={<ArrowForwardIcon />}
          sx={{ px: 4, py: 1.5, borderRadius: 2.5, fontWeight: 700 }}
        >
          {t('notFound.backHome', 'Về Trang Chủ Bộ Sưu Tập')}
        </Button>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', mt: 1 }}>
          <Button
            component={RouterLink}
            to="/?category=Rings"
            size="small"
            sx={{ color: brandColors.textSecondary, '&:hover': { color: brandColors.primary } }}
          >
            Nhẫn Kim Hoàn
          </Button>
          <Typography sx={{ color: brandColors.borderStrong }}>•</Typography>
          <Button
            component={RouterLink}
            to="/?category=Necklaces"
            size="small"
            sx={{ color: brandColors.textSecondary, '&:hover': { color: brandColors.primary } }}
          >
            Dây Chuyền
          </Button>
          <Typography sx={{ color: brandColors.borderStrong }}>•</Typography>
          <Button
            component={RouterLink}
            to="/?category=Earrings"
            size="small"
            sx={{ color: brandColors.textSecondary, '&:hover': { color: brandColors.primary } }}
          >
            Bông Tai
          </Button>
        </Box>
      </Box>
    </Container>
  )
}
