import React from 'react'
import { Box, Typography } from '@mui/material'
import type { InventorySummary } from '../../types/product.types'
import { brandColors } from '../../theme/palette'
import { useTranslation } from 'react-i18next'

interface Props {
  inventory: InventorySummary | null | undefined
  active?: boolean
  size?: 'small' | 'medium'
}

export const StockBadge: React.FC<Props> = ({ inventory, active = true, size = 'small' }) => {
  const { t } = useTranslation('catalog')

  const isSmall = size === 'small'

  if (!active) {
    return (
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.75,
          px: isSmall ? 1.25 : 1.75,
          py: isSmall ? 0.35 : 0.6,
          borderRadius: 2,
          backgroundColor: 'rgba(111, 103, 95, 0.1)',
          border: '1px solid rgba(111, 103, 95, 0.2)',
          color: brandColors.textSecondary,
        }}
      >
        <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: brandColors.textSecondary }} />
        <Typography variant="caption" sx={{ fontWeight: 600, fontSize: isSmall ? '0.72rem' : '0.8rem' }}>
          {t('common:status.inactive', 'Ngừng kinh doanh')}
        </Typography>
      </Box>
    )
  }

  if (inventory === null || inventory === undefined) {
    return (
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.75,
          px: isSmall ? 1.25 : 1.75,
          py: isSmall ? 0.35 : 0.6,
          borderRadius: 2,
          backgroundColor: brandColors.warningBg,
          border: `1px solid rgba(139, 94, 26, 0.25)`,
          color: brandColors.warning,
        }}
      >
        <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: brandColors.warning }} />
        <Typography variant="caption" sx={{ fontWeight: 600, fontSize: isSmall ? '0.72rem' : '0.8rem' }}>
          {t('stockServiceUnavailable', 'Đang kết nối kho')}
        </Typography>
      </Box>
    )
  }

  const available = inventory.availableQuantity

  if (available > 0) {
    return (
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.75,
          px: isSmall ? 1.25 : 1.75,
          py: isSmall ? 0.35 : 0.6,
          borderRadius: 2,
          backgroundColor: brandColors.successBg,
          border: '1px solid rgba(53, 102, 74, 0.25)',
          color: brandColors.success,
          boxShadow: '0 1px 2px rgba(53, 102, 74, 0.06)',
        }}
      >
        <Box
          className="pulse-dot-green"
          sx={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            backgroundColor: brandColors.success,
          }}
        />
        <Typography variant="caption" sx={{ fontWeight: 700, fontSize: isSmall ? '0.72rem' : '0.8rem' }}>
          {t('inStock', { count: available, defaultValue: `Còn ${available} món tại quầy` })}
        </Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        px: isSmall ? 1.25 : 1.75,
        py: isSmall ? 0.35 : 0.6,
        borderRadius: 2,
        backgroundColor: brandColors.errorBg,
        border: '1px solid rgba(163, 59, 50, 0.2)',
        color: brandColors.error,
      }}
    >
      <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: brandColors.error }} />
      <Typography variant="caption" sx={{ fontWeight: 600, fontSize: isSmall ? '0.72rem' : '0.8rem' }}>
        {t('outOfStock', 'Tạm hết hàng tại showroom')}
      </Typography>
    </Box>
  )
}
