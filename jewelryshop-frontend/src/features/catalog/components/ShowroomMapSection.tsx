import React from 'react'
import { Box, Card, Typography, Button } from '@mui/material'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import NavigationOutlinedIcon from '@mui/icons-material/NavigationOutlined'
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined'
import { brandColors } from '../../../theme/palette'

export const ShowroomMapSection: React.FC = () => {
  return (
    <Box sx={{ mt: { xs: 5, md: 8 }, mb: 4, maxWidth: '100%', overflow: 'hidden' }}>
      <Box sx={{ textAlign: 'center', mb: { xs: 2.5, sm: 4 } }}>
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
            Điểm Đến Trải Nghiệm Thực Tế
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
          Không Gian Tiệm Vàng Kim Ngân Phát
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1.4fr' },
          gap: { xs: 2.5, sm: 3.5 },
          alignItems: 'stretch',
        }}
      >
        {/* Left Information Card */}
        <Card
          sx={{
            borderRadius: 3.5,
            border: `1px solid ${brandColors.border}`,
            backgroundColor: brandColors.surface,
            p: { xs: 3, sm: 4 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 4px 16px rgba(47, 41, 37, 0.05)',
          }}
        >
          <Box>
            <Typography variant="h3" sx={{ fontSize: '1.25rem', fontFamily: '"Playfair Display", Georgia, serif', mb: 1.5, color: brandColors.primary }}>
              Showroom Trưng Bày & Kiểm Định
            </Typography>
            <Typography variant="body2" sx={{ color: brandColors.textSecondary, mb: 3.5, lineHeight: 1.6 }}>
              Kính mời quý khách đến trực tiếp showroom để nhân viên phục vụ khay nhung, soi quang phổ vàng và hoàn tất nhận sản phẩm sau khi đặt giữ chỗ 15 phút.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.75 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    backgroundColor: brandColors.surfaceSubtle,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: brandColors.secondary,
                    flexShrink: 0,
                  }}
                >
                  <LocationOnOutlinedIcon fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: brandColors.textSecondary, textTransform: 'uppercase', fontWeight: 600 }}>
                    Địa Chỉ Showroom
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: brandColors.primary }}>
                    ĐT 746B, KP4, P. Bình Cơ, Hồ Chí Minh, Việt Nam
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.75 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    backgroundColor: brandColors.surfaceSubtle,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: brandColors.secondary,
                    flexShrink: 0,
                  }}
                >
                  <AccessTimeOutlinedIcon fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: brandColors.textSecondary, textTransform: 'uppercase', fontWeight: 600 }}>
                    Thời Gian Mở Cửa Đón Khách
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: brandColors.primary }}>
                    08:30 – 21:00 (Thứ Hai – Chủ Nhật)
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.75 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    backgroundColor: brandColors.surfaceSubtle,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: brandColors.secondary,
                    flexShrink: 0,
                  }}
                >
                  <PhoneOutlinedIcon fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: brandColors.textSecondary, textTransform: 'uppercase', fontWeight: 600 }}>
                    Số Điện Thoại / Hotline Hỗ Trợ
                  </Typography>
                  <Typography
                    component="a"
                    href="tel:0974863175"
                    variant="body1"
                    sx={{
                      fontWeight: 700,
                      color: brandColors.primary,
                      textDecoration: 'none',
                      display: 'block',
                      '&:hover': { color: brandColors.secondary, textDecoration: 'underline' },
                    }}
                  >
                    0974 863 175
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          <Button
            variant="outlined"
            color="primary"
            startIcon={<NavigationOutlinedIcon />}
            href="https://maps.app.goo.gl/cvpm8ijJpxDp4N8z8"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              mt: 4,
              borderRadius: 2.5,
              py: 1.25,
              fontWeight: 700,
            }}
          >
            Chỉ Đường Google Maps
          </Button>
        </Card>

        {/* Right Map Embed Card */}
        <Card
          sx={{
            borderRadius: 3.5,
            border: `1px solid ${brandColors.border}`,
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(47, 41, 37, 0.05)',
            minHeight: { xs: 320, md: 'auto' },
            position: 'relative',
          }}
        >
          <iframe
            title="Bản đồ Tiệm Vàng Kim Ngân Phát"
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d244.67932417441253!2d106.7646389!3d11.1231191!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174c59509d58b27%3A0x9c9a69bdf6237ae4!2zVGnhu4dtIFbDoG5nIEtpbSBOZ8OibiBQaMOhdA!5e0!3m2!1svi!2s!4v1793717711697!5m2!1svi!2s"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: 380, width: '100%', display: 'block' }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </Card>
      </Box>
    </Box>
  )
}
