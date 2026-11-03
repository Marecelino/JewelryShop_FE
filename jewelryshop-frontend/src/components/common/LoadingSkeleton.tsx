import React from 'react'
import { Box, Skeleton, Card, CardContent } from '@mui/material'
import { brandColors } from '../../theme/palette'

export const ProductCardSkeleton: React.FC = () => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3.5,
        border: `1px solid ${brandColors.border}`,
        backgroundColor: brandColors.surface,
        boxShadow: '0 1px 3px rgba(47, 41, 37, 0.04)',
      }}
    >
      {/* 4:5 Aspect Ratio Product Image Skeleton */}
      <Skeleton
        variant="rectangular"
        sx={{
          aspectRatio: '4/5',
          width: '100%',
          backgroundColor: 'rgba(242, 238, 232, 0.7)',
        }}
        animation="wave"
      />
      <CardContent sx={{ flexGrow: 1, p: 2.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {/* Category micro-tag */}
        <Skeleton variant="text" width="30%" height={16} sx={{ backgroundColor: 'rgba(242, 238, 232, 0.9)' }} />
        {/* Product Name 2 lines */}
        <Skeleton variant="text" width="90%" height={24} sx={{ backgroundColor: 'rgba(242, 238, 232, 0.8)' }} />
        <Skeleton variant="text" width="60%" height={24} sx={{ backgroundColor: 'rgba(242, 238, 232, 0.8)' }} />
        {/* Price & action */}
        <Box sx={{ mt: 'auto', pt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Skeleton variant="text" width="45%" height={28} sx={{ backgroundColor: 'rgba(216, 195, 165, 0.4)' }} />
          <Skeleton variant="rounded" width="40%" height={36} sx={{ borderRadius: 2 }} />
        </Box>
      </CardContent>
    </Card>
  )
}

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, p: 2 }}>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton
          key={i}
          variant="rounded"
          height={56}
          sx={{
            borderRadius: 2,
            backgroundColor: 'rgba(242, 238, 232, 0.6)',
          }}
          animation="wave"
        />
      ))}
    </Box>
  )
}
