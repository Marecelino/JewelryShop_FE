import React from 'react'
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  List,
  ListItem,
  LinearProgress,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCart, cartStore } from '../store/cartStore'
import { formatVND } from '../../../utils/formatCurrency'
import { brandColors } from '../../../theme/palette'

interface Props {
  open: boolean
  onClose: () => void
}

export const CartDrawer: React.FC<Props> = ({ open, onClose }) => {
  const { items, totalQuantity, totalAmount } = useCart()
  const { t, i18n } = useTranslation(['cart', 'common'])
  const navigate = useNavigate()

  const handleCheckout = () => {
    onClose()
    navigate('/checkout')
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        backdrop: {
          sx: { backdropFilter: 'blur(4px)', backgroundColor: 'rgba(47, 41, 37, 0.35)' },
        },
        paper: {
          sx: {
            width: { xs: '100%', sm: 440 },
            maxWidth: '100vw',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: brandColors.background,
            boxShadow: '0 24px 64px -12px rgba(47, 41, 37, 0.25)',
          },
        },
      }}
    >
      {/* Frosted Glass Header */}
      <Box
        sx={{
          p: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${brandColors.border}`,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <ShoppingBagOutlinedIcon sx={{ color: brandColors.secondary, fontSize: 26 }} />
          <Typography variant="h3" sx={{ fontSize: '1.25rem', fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600 }}>
            {t('cart:cartTitle', 'Khay Giữ Chỗ Trang Sức')}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          aria-label={t('common:actions.close', 'Đóng')}
          sx={{ minWidth: 44, minHeight: 44, borderRadius: 2 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Showroom Capacity Meter */}
      <Box sx={{ px: 2.5, py: 1.75, backgroundColor: brandColors.surfaceSubtle, borderBottom: `1px solid ${brandColors.border}` }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
          <Typography variant="caption" sx={{ color: brandColors.textSecondary, fontWeight: 500 }}>
            {t('cart:capacity', { current: totalQuantity, defaultValue: `Dung lượng giữ chỗ: ${totalQuantity}/20 món tối đa` })}
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 700, color: totalQuantity >= 20 ? brandColors.error : brandColors.primary }}>
            {totalQuantity}/20 món
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={(totalQuantity / 20) * 100}
          sx={{
            height: 6,
            borderRadius: 3,
            backgroundColor: 'rgba(47, 41, 37, 0.08)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: totalQuantity >= 20 ? brandColors.error : brandColors.secondary,
              borderRadius: 3,
            },
          }}
        />
      </Box>

      {/* Items list or empty state */}
      {items.length === 0 ? (
        <Box sx={{ flexGrow: 1, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: brandColors.surfaceSubtle,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: brandColors.secondary,
              mb: 2.5,
            }}
          >
            <DiamondOutlinedIcon sx={{ fontSize: 40 }} />
          </Box>
          <Typography variant="h3" sx={{ mb: 1, fontSize: '1.25rem', color: brandColors.textPrimary }}>
            {t('cart:emptyCart', 'Khay trang sức của bạn đang trống')}
          </Typography>
          <Typography variant="body2" sx={{ color: brandColors.textSecondary, mb: 3.5, maxWidth: 320, lineHeight: 1.6 }}>
            {t('cart:emptySubtitle', 'Hãy chiêm ngưỡng các tuyệt tác kim hoàn và chọn cho mình món trang sức ưng ý để giữ chỗ tại quầy.')}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              onClose()
              navigate('/')
            }}
            sx={{ borderRadius: 2.5, px: 3, py: 1.25 }}
          >
            {t('cart:exploreCollection', 'Khám Phá Bộ Sưu Tập')}
          </Button>
        </Box>
      ) : (
        <List sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
          {items.map((item) => (
            <ListItem
              key={item.productId}
              sx={{
                mb: 1.5,
                p: 2,
                borderRadius: 3,
                backgroundColor: brandColors.surface,
                border: `1px solid ${brandColors.border}`,
                boxShadow: '0 1px 3px rgba(47, 41, 37, 0.03)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                gap: 1.5,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ pr: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: brandColors.primary, lineHeight: 1.35 }}>
                    {item.productName}
                  </Typography>
                  <Typography variant="caption" sx={{ color: brandColors.textSecondary }}>
                    {item.material} {item.gemstone ? `• ${item.gemstone}` : ''}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={() => cartStore.removeItem(item.productId)}
                  aria-label={t('cart:remove', 'Xóa món này')}
                  sx={{
                    color: brandColors.textSecondary,
                    borderRadius: 1.5,
                    '&:hover': { color: brandColors.error, backgroundColor: brandColors.errorBg },
                  }}
                >
                  <DeleteOutlinedIcon fontSize="small" />
                </IconButton>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Stepper */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    border: `1px solid ${brandColors.borderStrong}`,
                    borderRadius: 2,
                    backgroundColor: brandColors.surfaceSubtle,
                    p: 0.25,
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => cartStore.updateQuantity(item.productId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    sx={{ width: 32, height: 32, borderRadius: 1.5 }}
                    aria-label="Giảm 1"
                  >
                    <RemoveIcon sx={{ fontSize: '0.9rem' }} />
                  </IconButton>
                  <Typography sx={{ px: 1.5, fontWeight: 700, minWidth: 28, textAlign: 'center', fontSize: '0.9rem' }}>
                    {item.quantity}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => cartStore.updateQuantity(item.productId, item.quantity + 1)}
                    disabled={item.quantity >= 10 || totalQuantity >= 20}
                    sx={{ width: 32, height: 32, borderRadius: 1.5 }}
                    aria-label="Tăng 1"
                  >
                    <AddIcon sx={{ fontSize: '0.9rem' }} />
                  </IconButton>
                </Box>

                <Typography variant="body1" sx={{ fontWeight: 700, color: brandColors.primary }}>
                  {formatVND(item.price * item.quantity, i18n.language)}
                </Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      )}

      {/* Footer checkout bar */}
      {items.length > 0 && (
        <Box
          sx={{
            p: { xs: 2.5, sm: 3 },
            pb: 'calc(24px + env(safe-area-inset-bottom, 0px))',
            borderTop: `1px solid ${brandColors.border}`,
            backgroundColor: brandColors.surface,
            boxShadow: '0 -8px 24px rgba(47, 41, 37, 0.05)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ color: brandColors.textSecondary }}>
              {t('cart:subtotal', 'Tạm tính')}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {formatVND(totalAmount, i18n.language)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 2.5 }}>
            <Typography variant="body1" sx={{ fontWeight: 700, color: brandColors.primary }}>
              {t('cart:total', 'Tổng Giá Trị Giữ Chỗ')}
            </Typography>
            <Typography variant="h3" sx={{ color: brandColors.primary, fontWeight: 700, fontSize: '1.4rem' }}>
              {formatVND(totalAmount, i18n.language)}
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            endIcon={<ArrowForwardIcon />}
            onClick={handleCheckout}
            sx={{
              py: 1.6,
              borderRadius: 3,
              fontSize: '1rem',
              fontWeight: 700,
              boxShadow: '0 4px 14px rgba(47, 41, 37, 0.2)',
            }}
          >
            {t('cart:proceedToCheckout', 'Tiến Hành Giữ Chỗ (15 Phút)')}
          </Button>
        </Box>
      )}
    </Drawer>
  )
}
