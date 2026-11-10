import React from 'react'
import { Box, Typography, ButtonBase } from '@mui/material'
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined'
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
import { useSearchParams } from 'react-router-dom'
import { brandColors } from '../../../theme/palette'

interface CategoryItem {
  key: string
  label: string
  sectionId?: string
  svgType: 'all' | 'ring' | 'necklace' | 'bracelet' | 'earring'
}

const CATEGORY_CIRCLES: CategoryItem[] = [
  { key: 'all', label: 'Tất Cả', sectionId: 'all-section', svgType: 'all' },
  { key: 'Rings', label: 'Nhẫn Kim Hoàn', sectionId: 'rings-section', svgType: 'ring' },
  { key: 'Necklaces', label: 'Dây Chuyền', sectionId: 'necklaces-section', svgType: 'necklace' },
  { key: 'Bracelets', label: 'Vòng & Lắc Tay', sectionId: 'bracelets-section', svgType: 'bracelet' },
  { key: 'Earrings', label: 'Bông Tai', sectionId: 'earrings-section', svgType: 'earring' },
]

export const CategoryCircles: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentCategory = searchParams.get('category') || 'all'

  const handleCircleClick = (cat: CategoryItem) => {
    // If user is already on homepage without search, smooth scroll to the section
    const targetElement = cat.sectionId ? document.getElementById(cat.sectionId) : null
    if (targetElement && !searchParams.has('search')) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    // Otherwise navigate via query param
    const nextParams = new URLSearchParams(searchParams)
    if (cat.key === 'all') {
      nextParams.delete('category')
      nextParams.delete('search')
    } else {
      nextParams.set('category', cat.key)
      nextParams.delete('search')
    }
    setSearchParams(nextParams, { replace: false })
  }

  const renderIcon = (type: CategoryItem['svgType']) => {
    switch (type) {
      case 'all':
        return <AutoAwesomeOutlinedIcon sx={{ fontSize: 28, color: brandColors.secondary }} />
      case 'ring':
        return (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={brandColors.secondary} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="14" r="7" />
            <polygon points="12 3 15 7 9 7" stroke={brandColors.secondary} fill="rgba(176, 141, 87, 0.2)" />
          </svg>
        )
      case 'necklace':
        return (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={brandColors.secondary} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 4 C7 14, 17 14, 18 4" strokeDasharray="2 1.5" />
            <circle cx="12" cy="15" r="3" fill="rgba(176, 141, 87, 0.3)" />
            <line x1="12" y1="12" x2="12" y2="10" />
          </svg>
        )
      case 'bracelet':
        return (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={brandColors.secondary} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <ellipse cx="12" cy="12" rx="9" ry="6" transform="rotate(-15 12 12)" />
            <circle cx="16" cy="9" r="1.5" fill={brandColors.secondary} />
          </svg>
        )
      case 'earring':
        return (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={brandColors.secondary} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8" cy="7" r="2" fill={brandColors.secondary} />
            <path d="M8 9 L8 14 L11 18 L5 18 Z" fill="rgba(176, 141, 87, 0.25)" />
            <circle cx="16" cy="7" r="2" fill={brandColors.secondary} />
            <path d="M16 9 L16 14 L19 18 L13 18 Z" fill="rgba(176, 141, 87, 0.25)" />
          </svg>
        )
      default:
        return <DiamondOutlinedIcon sx={{ fontSize: 28, color: brandColors.secondary }} />
    }
  }

  return (
    <Box sx={{ mb: { xs: 4, md: 6 }, maxWidth: '100%', overflow: 'hidden' }}>
      {/* Title */}
      <Box sx={{ textAlign: 'center', mb: { xs: 2, sm: 3 } }}>
        <Typography
          variant="caption"
          sx={{
            color: brandColors.secondary,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            display: 'block',
            mb: 0.5,
          }}
        >
          Khám Phá Danh Mục Kim Hoàn
        </Typography>
        <Typography
          variant="h3"
          sx={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: { xs: '1.25rem', sm: '1.75rem' },
            color: brandColors.primary,
          }}
        >
          Xu Hướng Chế Tác Được Yêu Thích
        </Typography>
      </Box>

      {/* Circle Icons Row */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: { xs: 'flex-start', sm: 'center' },
          alignItems: 'center',
          gap: { xs: 2, sm: 4, md: 5 },
          overflowX: 'auto',
          maxWidth: '100%',
          width: '100%',
          py: 1.5,
          px: { xs: 0.5, sm: 1 },
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {CATEGORY_CIRCLES.map((cat) => {
          const isSelected = currentCategory === cat.key
          return (
            <ButtonBase
              key={cat.key}
              onClick={() => handleCircleClick(cat)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1.25,
                flexShrink: 0,
                borderRadius: 4,
                p: 1,
                transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  '& .circle-disc': {
                    borderColor: brandColors.secondary,
                    boxShadow: '0 8px 24px rgba(176, 141, 87, 0.2)',
                    backgroundColor: 'rgba(216, 195, 165, 0.15)',
                  },
                },
              }}
            >
              {/* Disc */}
              <Box
                className="circle-disc"
                sx={{
                  width: { xs: 68, sm: 80 },
                  height: { xs: 68, sm: 80 },
                  borderRadius: '50%',
                  backgroundColor: isSelected ? 'rgba(216, 195, 165, 0.25)' : brandColors.surface,
                  border: `1.5px solid ${isSelected ? brandColors.secondary : brandColors.border}`,
                  boxShadow: isSelected
                    ? '0 6px 18px rgba(176, 141, 87, 0.18)'
                    : '0 2px 8px rgba(47, 41, 37, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 200ms ease',
                }}
              >
                {renderIcon(cat.svgType)}
              </Box>

              {/* Label */}
              <Typography
                variant="body2"
                sx={{
                  fontWeight: isSelected ? 700 : 600,
                  fontSize: '0.85rem',
                  color: isSelected ? brandColors.primary : brandColors.textSecondary,
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                }}
              >
                {cat.label}
              </Typography>
            </ButtonBase>
          )
        })}
      </Box>
    </Box>
  )
}
