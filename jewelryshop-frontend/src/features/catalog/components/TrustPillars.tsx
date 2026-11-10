import React from 'react'
import { Box, Typography, Card, CardContent } from '@mui/material'
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined'
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined'
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined'
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined'
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined'
import { brandColors } from '../../../theme/palette'

const PILLARS = [
  {
    icon: <VerifiedOutlinedIcon sx={{ fontSize: 32, color: brandColors.secondary }} />,
    title: '100% Vàng Đủ Tuổi',
    desc: 'Cam kết chuẩn tuổi vàng 18K/24K và kim cương tự nhiên có chứng thư kiểm định độc lập.',
  },
  {
    icon: <TimerOutlinedIcon sx={{ fontSize: 32, color: brandColors.secondary }} />,
    title: 'Khóa Giữ Chỗ 15 Phút',
    desc: 'Món trang sức thực tế được khóa và giữ riêng trên khay nhung tại quầy ngay khi tạo đơn.',
  },
  {
    icon: <StorefrontOutlinedIcon sx={{ fontSize: 32, color: brandColors.secondary }} />,
    title: 'Kiểm Định Tại Showroom',
    desc: 'Trực tiếp soi tuổi vàng, cân trọng lượng và thử trang sức trước khi quyết định thanh toán.',
  },
  {
    icon: <SecurityOutlinedIcon sx={{ fontSize: 32, color: brandColors.secondary }} />,
    title: 'An Toàn Tuyệt Đối',
    desc: 'Không áp dụng giao hàng bưu điện, bảo đảm món đồ có giá trị cao không bao giờ bị tráo đổi.',
  },
]

export const TrustPillars: React.FC = () => {
  return (
    <Box sx={{ my: { xs: 5, md: 8 }, maxWidth: '100%', overflow: 'hidden' }}>
      {/* Title */}
      <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 5 } }}>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <DiamondOutlinedIcon sx={{ color: brandColors.secondary, fontSize: 16 }} />
          <Typography
            variant="caption"
            sx={{
              color: brandColors.secondary,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontSize: '0.72rem',
            }}
          >
            Đặc Quyền Khách Hàng Showroom
          </Typography>
        </Box>
        <Typography
          variant="h2"
          sx={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: { xs: '1.35rem', sm: '1.75rem', md: '2.2rem' },
            color: brandColors.primary,
          }}
        >
          Vì Sao Khách Hàng Lựa Chọn Tiệm Vàng Kim Ngân Phát?
        </Typography>
      </Box>

      {/* 4 Bento Columns */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
          gap: { xs: 2, sm: 3 },
        }}
      >
        {PILLARS.map((pillar, idx) => (
          <Card
            key={idx}
            sx={{
              borderRadius: 3.5,
              border: `1px solid ${brandColors.border}`,
              backgroundColor: brandColors.surface,
              boxShadow: '0 2px 8px rgba(47, 41, 37, 0.04)',
              transition: 'transform 200ms ease, box-shadow 200ms ease',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 12px 28px rgba(47, 41, 37, 0.08)',
                borderColor: brandColors.secondary,
              },
            }}
          >
            <CardContent sx={{ p: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  backgroundColor: brandColors.surfaceSubtle,
                  border: `1px solid rgba(176, 141, 87, 0.25)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                }}
              >
                {pillar.icon}
              </Box>
              <Typography variant="h3" sx={{ fontSize: '1.1rem', fontWeight: 700, mb: 1, color: brandColors.primary }}>
                {pillar.title}
              </Typography>
              <Typography variant="body2" sx={{ color: brandColors.textSecondary, lineHeight: 1.6, fontSize: '0.85rem' }}>
                {pillar.desc}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  )
}
