import React from 'react'
import { Box, Container, Typography, Button } from '@mui/material'
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Link as RouterLink } from 'react-router-dom'
import { brandColors } from '../../../theme/palette'

export const MiddleBanner: React.FC = () => {
  return (
    <Box
      sx={{
        my: { xs: 5, md: 8 },
        py: { xs: 4, sm: 6, md: 8 },
        px: { xs: 2, sm: 3 },
        backgroundColor: '#24201D',
        color: '#FFFFFF',
        borderRadius: { xs: 3, sm: 4 },
        position: 'relative',
        overflow: 'hidden',
        maxWidth: '100%',
        background: 'radial-gradient(circle at 75% 30%, #38302A 0%, #24201D 60%, #171412 100%)',
        border: '1px solid rgba(176, 141, 87, 0.3)',
        boxShadow: '0 20px 48px -12px rgba(47, 41, 37, 0.25)',
      }}
    >
      {/* Decorative Gold Circular Geometry */}
      <Box
        sx={{
          position: 'absolute',
          top: '-30%',
          right: '-10%',
          width: 460,
          height: 460,
          borderRadius: '50%',
          border: '1px solid rgba(176, 141, 87, 0.12)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-20%',
          left: '5%',
          width: 280,
          height: 280,
          borderRadius: '50%',
          border: '1px dashed rgba(216, 195, 165, 0.15)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            px: 2,
            py: 0.6,
            borderRadius: 3,
            backgroundColor: 'rgba(216, 195, 165, 0.15)',
            border: '1px solid rgba(176, 141, 87, 0.3)',
            mb: 2.5,
          }}
        >
          <DiamondOutlinedIcon sx={{ color: brandColors.accent, fontSize: 16 }} />
          <Typography
            variant="caption"
            sx={{
              color: brandColors.accent,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontSize: '0.72rem',
            }}
          >
            Tiệm Vàng Kim Ngân Phát • Bình Cơ, TP. Hồ Chí Minh
          </Typography>
        </Box>

        <Typography
          variant="h2"
          sx={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: { xs: '1.4rem', sm: '1.85rem', md: '2.6rem' },
            fontWeight: 500,
            lineHeight: 1.25,
            mb: 2,
            color: '#FFFFFF',
          }}
        >
          Khóa Giữ Chỗ 15 Phút — Nhận Món Tận Tay Tại Showroom
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: 'rgba(255, 255, 255, 0.8)',
            maxWidth: 620,
            mx: 'auto',
            lineHeight: 1.7,
            mb: 3.5,
            fontSize: { xs: '0.95rem', md: '1.05rem' },
          }}
        >
          Mọi tuyệt tác kim cương và vàng nguyên chất đều được niêm phong khay nhung riêng biệt ngay khi quý khách tạo đơn. Kiểm định tuổi vàng và thử trang sức trực tiếp tại quầy mà không phải thanh toán trước.
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button
            component={RouterLink}
            to="/?category=Rings"
            variant="contained"
            color="secondary"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{
              width: { xs: '100%', sm: 'auto' },
              borderRadius: 3,
              px: 3.5,
              py: 1.4,
              fontWeight: 700,
              backgroundColor: brandColors.secondary,
              color: '#FFFFFF',
              boxShadow: '0 4px 16px rgba(176, 141, 87, 0.35)',
              '&:hover': {
                backgroundColor: brandColors.secondaryHover,
              },
            }}
          >
            Khám Phá Nhẫn Kim Cương
          </Button>

          <Button
            component={RouterLink}
            to="/?category=Necklaces"
            variant="outlined"
            size="large"
            sx={{
              width: { xs: '100%', sm: 'auto' },
              borderRadius: 3,
              px: 3.5,
              py: 1.4,
              borderColor: 'rgba(255, 255, 255, 0.3)',
              color: '#FFFFFF',
              '&:hover': {
                borderColor: brandColors.accent,
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
              },
            }}
          >
            Dây Chuyền Quý Phái
          </Button>
        </Box>
      </Container>
    </Box>
  )
}
