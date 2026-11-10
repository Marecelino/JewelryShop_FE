import React from 'react'
import { Box, Typography, Button } from '@mui/material'
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Link as RouterLink } from 'react-router-dom'
import { brandColors } from '../../../theme/palette'

interface Props {
  id?: string
  subtitle?: string
  title: string
  description?: string
  viewAllLink?: string
  viewAllText?: string
}

export const SectionHeader: React.FC<Props> = ({
  id,
  subtitle = 'Haute Joaillerie Atelier',
  title,
  description,
  viewAllLink,
  viewAllText = 'Xem tất cả',
}) => {
  return (
    <Box id={id} sx={{ mb: 3.5 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { sm: 'flex-end' },
          gap: 2,
        }}
      >
        <Box>
          {/* Subtitle with diamond icon */}
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
            <DiamondOutlinedIcon sx={{ color: brandColors.secondary, fontSize: 16 }} />
            <Typography
              variant="caption"
              sx={{
                color: brandColors.secondary,
                fontWeight: 700,
                letterSpacing: '0.12em',
                fontSize: '0.72rem',
                textTransform: 'uppercase',
              }}
            >
              {subtitle}
            </Typography>
          </Box>

          {/* Title */}
          <Typography
            variant="h2"
            sx={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: { xs: '1.65rem', md: '2.1rem' },
              fontWeight: 500,
              color: brandColors.primary,
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>

          {description && (
            <Typography variant="body2" sx={{ color: brandColors.textSecondary, mt: 0.75, maxWidth: 540 }}>
              {description}
            </Typography>
          )}
        </Box>

        {viewAllLink && (
          <Button
            component={RouterLink}
            to={viewAllLink}
            endIcon={<ArrowForwardIcon fontSize="small" />}
            sx={{
              color: brandColors.secondary,
              fontWeight: 700,
              fontSize: '0.875rem',
              p: 0,
              minWidth: 0,
              alignSelf: { xs: 'flex-start', sm: 'flex-end' },
              '&:hover': {
                backgroundColor: 'transparent',
                color: brandColors.primary,
                '& .MuiSvgIcon-root': {
                  transform: 'translateX(4px)',
                },
              },
              '& .MuiSvgIcon-root': {
                transition: 'transform 180ms ease',
              },
            }}
          >
            {viewAllText}
          </Button>
        )}
      </Box>

      {/* Decorative Gold Hairline Divider (like the ornamental divider in high-end jewelry ateliers) */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
        <Box sx={{ flexGrow: 1, height: '1px', backgroundColor: brandColors.hairline }} />
        <Box
          sx={{
            width: 8,
            height: 8,
            transform: 'rotate(45deg)',
            backgroundColor: brandColors.secondary,
            opacity: 0.7,
          }}
        />
        <Box sx={{ width: 40, height: '1px', backgroundColor: brandColors.secondary, opacity: 0.4 }} />
      </Box>
    </Box>
  )
}
