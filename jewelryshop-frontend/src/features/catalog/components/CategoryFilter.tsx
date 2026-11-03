import React from 'react'
import { Box, Button } from '@mui/material'
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined'
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { brandColors } from '../../../theme/palette'

const CATEGORIES = [
  { key: 'all', labelKey: 'catalog:categories.all', fallback: 'Tất Cả Sản Phẩm' },
  { key: 'Rings', labelKey: 'catalog:categories.Rings', fallback: 'Nhẫn Kim Hoàn' },
  { key: 'Necklaces', labelKey: 'catalog:categories.Necklaces', fallback: 'Dây Chuyền' },
  { key: 'Earrings', labelKey: 'catalog:categories.Earrings', fallback: 'Bông Tai' },
  { key: 'Bracelets', labelKey: 'catalog:categories.Bracelets', fallback: 'Vòng & Lắc Tay' },
]

export const CategoryFilter: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { t } = useTranslation(['catalog', 'common'])
  const selectedCategory = searchParams.get('category') || 'all'

  const handleSelectCategory = (catKey: string) => {
    const nextParams = new URLSearchParams(searchParams)
    if (catKey === 'all') {
      nextParams.delete('category')
    } else {
      nextParams.set('category', catKey)
    }
    setSearchParams(nextParams, { replace: false })
  }

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1.25,
        overflowX: 'auto',
        py: 1,
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat.key || (cat.key === 'all' && !searchParams.has('category'))
        return (
          <Button
            key={cat.key}
            onClick={() => handleSelectCategory(cat.key)}
            size="small"
            startIcon={
              cat.key === 'all' ? (
                <AutoAwesomeOutlinedIcon sx={{ fontSize: '1rem !important' }} />
              ) : (
                <DiamondOutlinedIcon sx={{ fontSize: '1rem !important' }} />
              )
            }
            sx={{
              px: 2.25,
              py: 0.85,
              borderRadius: 3,
              fontWeight: isSelected ? 700 : 500,
              fontSize: '0.875rem',
              whiteSpace: 'nowrap',
              backgroundColor: isSelected ? brandColors.primary : brandColors.surface,
              color: isSelected ? brandColors.textInverse : brandColors.textPrimary,
              border: `1px solid ${isSelected ? brandColors.primary : brandColors.border}`,
              boxShadow: isSelected
                ? '0 4px 12px rgba(47, 41, 37, 0.15)'
                : '0 1px 3px rgba(47, 41, 37, 0.04)',
              transition: 'all 180ms cubic-bezier(0.16, 1, 0.3, 1)',
              '&:hover': {
                backgroundColor: isSelected ? brandColors.primaryHover : brandColors.surfaceSubtle,
                borderColor: isSelected ? brandColors.primaryHover : brandColors.borderStrong,
                transform: 'translateY(-1px)',
              },
            }}
          >
            {t(cat.labelKey, cat.fallback)}
          </Button>
        )
      })}
    </Box>
  )
}
