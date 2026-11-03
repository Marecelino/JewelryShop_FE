import React, { useState } from 'react'
import { Box, IconButton, Chip } from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import CollectionsOutlinedIcon from '@mui/icons-material/CollectionsOutlined'
import type { ProductImageResponse } from '../../../types/product.types'
import { JewelryIllustration } from '../../../components/common/JewelryIllustration'
import { brandColors } from '../../../theme/palette'

interface Props {
  images?: ProductImageResponse[]
  productName: string
  category: string
}

export const ProductGallery: React.FC<Props> = ({ images = [], productName, category }) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Fallback nếu sản phẩm không có ảnh
  if (!images || images.length === 0) {
    return (
      <Box
        sx={{
          borderRadius: 4,
          overflow: 'hidden',
          border: `1px solid ${brandColors.border}`,
          backgroundColor: brandColors.surface,
          boxShadow: '0 12px 32px -8px rgba(47, 41, 37, 0.08)',
          position: 'relative',
        }}
      >
        <JewelryIllustration category={category} ratio="4/5" />
      </Box>
    )
  }

  const currentImage = images[selectedIndex] || images[0]

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
  }

  const handleNext = () => {
    setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* 1. Khung hiển thị ảnh lớn chính */}
      <Box
        sx={{
          position: 'relative',
          borderRadius: 4,
          overflow: 'hidden',
          border: `1px solid ${brandColors.border}`,
          backgroundColor: brandColors.surface,
          boxShadow: '0 12px 32px -8px rgba(47, 41, 37, 0.08)',
          aspectRatio: '4/5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&:hover .gallery-nav-btn': {
            opacity: 1,
          },
        }}
      >
        <Box
          component="img"
          src={currentImage.imageUrl}
          alt={`${productName} - Ảnh ${selectedIndex + 1}`}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        />

        {/* Badge Ảnh đại diện */}
        {currentImage.isPrimary && (
          <Chip
            size="small"
            label="Ảnh đại diện"
            sx={{
              position: 'absolute',
              top: 14,
              left: 14,
              backgroundColor: 'rgba(47, 41, 37, 0.85)',
              color: '#FFFFFF',
              backdropFilter: 'blur(4px)',
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          />
        )}

        {/* Counter số lượng ảnh */}
        {images.length > 1 && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 14,
              right: 14,
              backgroundColor: 'rgba(47, 41, 37, 0.75)',
              color: '#FFFFFF',
              px: 1.5,
              py: 0.5,
              borderRadius: 2,
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          >
            <CollectionsOutlinedIcon sx={{ fontSize: 14 }} />
            {selectedIndex + 1} / {images.length}
          </Box>
        )}

        {/* Nút chuyển ảnh Trước / Sau */}
        {images.length > 1 && (
          <>
            <IconButton
              className="gallery-nav-btn"
              onClick={handlePrev}
              sx={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                color: brandColors.primary,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                opacity: { xs: 1, md: 0 },
                transition: 'all 200ms ease',
                '&:hover': { backgroundColor: '#FFFFFF', transform: 'translateY(-50%) scale(1.08)' },
              }}
              size="small"
            >
              <ArrowBackIosNewIcon sx={{ fontSize: 16, ml: 0.5 }} />
            </IconButton>

            <IconButton
              className="gallery-nav-btn"
              onClick={handleNext}
              sx={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                color: brandColors.primary,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                opacity: { xs: 1, md: 0 },
                transition: 'all 200ms ease',
                '&:hover': { backgroundColor: '#FFFFFF', transform: 'translateY(-50%) scale(1.08)' },
              }}
              size="small"
            >
              <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </>
        )}
      </Box>

      {/* 2. Dải thumbnail cuộn ngang phía dưới */}
      {images.length > 1 && (
        <Box
          sx={{
            display: 'flex',
            gap: 1.5,
            overflowX: 'auto',
            pb: 1,
            '&::-webkit-scrollbar': { height: 4 },
            '&::-webkit-scrollbar-thumb': { backgroundColor: brandColors.border, borderRadius: 2 },
          }}
        >
          {images.map((img, idx) => {
            const isSelected = idx === selectedIndex
            return (
              <Box
                key={img.imageId || idx}
                onClick={() => setSelectedIndex(idx)}
                sx={{
                  flexShrink: 0,
                  width: 72,
                  height: 90,
                  borderRadius: 2.5,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: isSelected ? `2px solid ${brandColors.secondary}` : `1px solid ${brandColors.border}`,
                  boxShadow: isSelected ? `0 0 0 2px ${brandColors.hairlineGold}` : 'none',
                  opacity: isSelected ? 1 : 0.65,
                  transition: 'all 200ms ease',
                  '&:hover': {
                    opacity: 1,
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Box
                  component="img"
                  src={img.imageUrl}
                  alt={`Thumbnail ${idx + 1}`}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
            )
          })}
        </Box>
      )}
    </Box>
  )
}

