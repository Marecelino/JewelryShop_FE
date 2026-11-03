import React from 'react'
import { Box, Typography, Button, Container } from '@mui/material'
import LockPersonOutlinedIcon from '@mui/icons-material/LockPersonOutlined'
import { Link as RouterLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { brandColors } from '../../theme/palette'

export const RoleGuard: React.FC = () => {
  const { t } = useTranslation('common')

  return (
    <Container maxWidth="sm" sx={{ py: 12, textAlign: 'center' }}>
      <Box
        sx={{
          display: 'inline-flex',
          p: 3,
          borderRadius: '50%',
          backgroundColor: 'rgba(163, 59, 50, 0.08)',
          color: brandColors.error,
          mb: 3,
        }}
      >
        <LockPersonOutlinedIcon sx={{ fontSize: 56 }} />
      </Box>
      <Typography variant="h2" sx={{ mb: 2, color: brandColors.textPrimary }}>
        {t('forbidden.title', '403 — Từ Chối Truy Cập')}
      </Typography>
      <Typography variant="body1" sx={{ color: brandColors.textSecondary, mb: 4, maxWidth: 440, mx: 'auto' }}>
        {t('forbidden.message', 'Bạn không có quyền quản trị viên (ROLE_ADMIN) để truy cập khu vực này.')}
      </Typography>
      <Button
        component={RouterLink}
        to="/"
        variant="contained"
        color="primary"
        size="large"
      >
        {t('forbidden.backHome', 'Quay Về Trang Chủ')}
      </Button>
    </Container>
  )
}

