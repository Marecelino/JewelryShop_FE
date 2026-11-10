import React, { useState, useContext } from 'react'
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Divider,
  Alert,
  Breadcrumbs,
  Link,
  List,
  ListItem,
  ListItemText,
} from '@mui/material'
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined'
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined'
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCart, cartStore } from '../../cart/store/cartStore'
import { useCreateOrderMutation } from '../api/useOrders'
import { formatVND } from '../../../utils/formatCurrency'
import { useDocumentTitle } from '../../../hooks/useDocumentTitle'
import { brandColors } from '../../../theme/palette'
import { parseApiError } from '../../../api/errorHandler'
import { ToastContext } from '../../../layouts/ToastContext'

export const CheckoutPage: React.FC = () => {
  const { t, i18n } = useTranslation(['order', 'cart', 'common'])
  useDocumentTitle(t('order:checkoutTitle', 'Xác Nhận Đặt Lịch & Giữ Chỗ'))
  const navigate = useNavigate()
  const { showToast } = useContext(ToastContext)

  const { items, totalQuantity, totalAmount } = useCart()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const createOrderMutation = useCreateOrderMutation()

  const handleConfirmReservation = async () => {
    if (items.length === 0) return
    setErrorMessage(null)

    const payload = {
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    }

    try {
      const order = await createOrderMutation.mutateAsync(payload)
      cartStore.clearCart()
      showToast({
        message: t('order:reservationSuccess', 'Giữ chỗ món trang sức thành công!'),
        severity: 'success',
      })
      navigate(`/orders/${encodeURIComponent(order.orderReference)}`)
    } catch (err) {
      const parsed = parseApiError(err)
      if (parsed.status === 409) {
        setErrorMessage(
          t(
            'order:reservationFailed',
            'Rất tiếc! Món trang sức vừa có khách khác giữ chỗ trước đó hoặc đã hết tồn kho tại quầy. Vui lòng chọn món khác.'
          )
        )
      } else if (parsed.status === 503) {
        setErrorMessage(
          'Dịch vụ khóa tồn kho vật lý đang bảo trì hoặc quá tải. Vui lòng thử lại sau giây lát.'
        )
      } else {
        setErrorMessage(parsed.message || 'Không thể tạo đơn giữ chỗ. Vui lòng thử lại.')
      }
    }
  }

  if (items.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: 12, textAlign: 'center' }}>
        <Typography variant="h2" sx={{ mb: 2, fontFamily: '"Playfair Display", Georgia, serif' }}>
          {t('cart:emptyCart', 'Giỏ hàng của bạn đang trống.')}
        </Typography>
        <Typography variant="body1" sx={{ color: brandColors.textSecondary, mb: 4 }}>
          Vui lòng chọn món trang sức ưng ý trước khi tiến hành đặt lịch giữ chỗ.
        </Typography>
        <Button component={RouterLink} to="/" variant="contained" sx={{ borderRadius: 2.5, px: 3, py: 1.25 }}>
          {t('cart:exploreCollection', 'Khám Phá Bộ Sưu Tập')}
        </Button>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, pb: 10 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/" color="inherit" underline="hover">
          {t('common:nav.collection', 'Trang Chủ')}
        </Link>
        <Link component={RouterLink} to="/cart" color="inherit" underline="hover">
          {t('cart:cartTitle', 'Giỏ Hàng')}
        </Link>
        <Typography color="text.primary" sx={{ fontWeight: 600 }}>{t('order:checkoutTitle', 'Xác Nhận Giữ Chỗ')}</Typography>
      </Breadcrumbs>

      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: '1.85rem', md: '2.4rem' },
          fontFamily: '"Playfair Display", Georgia, serif',
          mb: 3.5,
          color: brandColors.primary,
        }}
      >
        {t('order:checkoutTitle', 'Xác Nhận Đặt Lịch & Giữ Chỗ')}
      </Typography>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 4, borderRadius: 3 }}>
          {errorMessage}
        </Alert>
      )}

      {/* Stripe-style 2-Column Checkout Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '7fr 5fr' },
          gap: { xs: 4, md: 5 },
          alignItems: 'start',
        }}
      >
        {/* Left Column: Showroom Visit Journey & Items Review */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
          {/* Showroom Physical Reservation Commitment Card */}
          <Card sx={{ borderRadius: 3.5, border: `1.5px solid ${brandColors.secondary}`, backgroundColor: brandColors.surfaceSubtle }}>
            <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3.5 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <VerifiedOutlinedIcon sx={{ color: brandColors.secondary, fontSize: 28 }} />
                <Typography variant="h3" sx={{ fontSize: '1.25rem', color: brandColors.primary, fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600 }}>
                  {t('order:reservationCommitment', 'Cam Kết Giữ Chỗ 15 Phút Tại Showroom')}
                </Typography>
              </Box>

              {/* 3-Step Journey Timeline */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2, my: 2.5 }}>
                <Box sx={{ p: 2, borderRadius: 2.5, backgroundColor: brandColors.surface, border: `1px solid ${brandColors.border}` }}>
                  <Typography variant="caption" sx={{ color: brandColors.secondary, fontWeight: 700, display: 'block', mb: 0.5 }}>
                    BƯỚC 1
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.primary }}>
                    Khóa tồn kho vật lý
                  </Typography>
                  <Typography variant="caption" sx={{ color: brandColors.textSecondary }}>
                    Hệ thống giữ riêng món đồ trong 15 phút.
                  </Typography>
                </Box>

                <Box sx={{ p: 2, borderRadius: 2.5, backgroundColor: brandColors.surface, border: `1px solid ${brandColors.border}` }}>
                  <Typography variant="caption" sx={{ color: brandColors.secondary, fontWeight: 700, display: 'block', mb: 0.5 }}>
                    BƯỚC 2
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.primary }}>
                    Đến Showroom Kim Ngân Phát
                  </Typography>
                  <Typography variant="caption" sx={{ color: brandColors.textSecondary }}>
                    Đọc mã đơn hàng để nhân viên chuẩn bị khay nhung.
                  </Typography>
                </Box>

                <Box sx={{ p: 2, borderRadius: 2.5, backgroundColor: brandColors.surface, border: `1px solid ${brandColors.border}` }}>
                  <Typography variant="caption" sx={{ color: brandColors.secondary, fontWeight: 700, display: 'block', mb: 0.5 }}>
                    BƯỚC 3
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.primary }}>
                    Kiểm định & Thanh toán
                  </Typography>
                  <Typography variant="caption" sx={{ color: brandColors.textSecondary }}>
                    Thử trang sức và thanh toán trực tiếp tại quầy.
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2, borderColor: brandColors.border }} />

              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <BlockOutlinedIcon sx={{ color: brandColors.warning, fontSize: 22, mt: 0.2 }} />
                <Typography variant="caption" sx={{ color: brandColors.textSecondary, lineHeight: 1.6 }}>
                  {t(
                    'order:noShippingNotice',
                    'Lưu ý an toàn kim hoàn: JewelryShop chỉ phục vụ nhận và trải nghiệm trực tiếp tại showroom, không áp dụng giao hàng qua bưu điện/shipper nhằm bảo đảm tính toàn vẹn và an toàn kiểm định giá trị cao.'
                  )}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Order Items Review Card */}
          <Card sx={{ borderRadius: 3.5, p: { xs: 2, sm: 2.5, md: 3 } }}>
            <Typography variant="h3" sx={{ fontSize: '1.2rem', mb: 2, color: brandColors.primary }}>
              Danh Sách Món Giữ Chỗ ({totalQuantity} món)
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <List disablePadding>
              {items.map((item) => (
                <ListItem key={item.productId} sx={{ py: 2, px: 0, borderBottom: `1px solid ${brandColors.hairline}` }}>
                  <ListItemText
                    primary={
                      <Typography variant="body1" sx={{ fontWeight: 600, color: brandColors.primary }}>
                        {item.productName}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" sx={{ color: brandColors.textSecondary, mt: 0.5, display: 'block' }}>
                        {item.category} • {item.material} {item.gemstone ? `• ${item.gemstone}` : ''} × {item.quantity} chiếc
                      </Typography>
                    }
                  />
                  <Typography variant="body1" sx={{ fontWeight: 700, color: brandColors.primary, ml: 2 }}>
                    {formatVND(item.price * item.quantity, i18n.language)}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Card>
        </Box>

        {/* Right Column: Sticky Summary & Payment-at-Counter Confirmation */}
        <Box sx={{ position: { md: 'sticky' }, top: 100 }}>
          <Card
            sx={{
              borderRadius: 3.5,
              p: { xs: 2, sm: 2.5, md: 3.5 },
              border: `1px solid ${brandColors.borderStrong}`,
              boxShadow: '0 16px 36px -12px rgba(47, 41, 37, 0.12)',
              backgroundColor: brandColors.surface,
            }}
          >
            <Typography variant="h3" sx={{ fontSize: '1.25rem', fontFamily: '"Playfair Display", Georgia, serif', mb: 2.5 }}>
              Tóm Tắt Đơn Giữ Chỗ
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography variant="body2" sx={{ color: brandColors.textSecondary }}>
                Số lượng món
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {totalQuantity} món trang sức
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography variant="body2" sx={{ color: brandColors.textSecondary }}>
                Phí đặt trước
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: brandColors.success }}>
                0 ₫ (Miễn phí đặt chỗ)
              </Typography>
            </Box>

            <Divider sx={{ my: 2.5 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 3 }}>
              <Typography variant="body1" sx={{ fontWeight: 700, color: brandColors.primary }}>
                Tổng thanh toán tại quầy:
              </Typography>
              <Typography variant="h2" sx={{ fontSize: '1.75rem', fontWeight: 800, color: brandColors.primary }}>
                {formatVND(totalAmount, i18n.language)}
              </Typography>
            </Box>

            <Box sx={{ p: 2, borderRadius: 2.5, backgroundColor: 'rgba(53, 102, 74, 0.08)', mb: 3 }}>
              <Typography variant="caption" sx={{ color: brandColors.success, fontWeight: 600, display: 'block', textAlign: 'center' }}>
                ✓ Quý khách không cần trả tiền trước. Chỉ thanh toán sau khi hài lòng và kiểm định trang sức tại quầy.
              </Typography>
            </Box>

            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={createOrderMutation.isPending}
              onClick={handleConfirmReservation}
              startIcon={<StorefrontOutlinedIcon />}
              sx={{
                py: 1.8,
                borderRadius: 3,
                fontSize: '1rem',
                fontWeight: 700,
                boxShadow: '0 4px 16px rgba(47, 41, 37, 0.25)',
                mb: 2,
              }}
            >
              {createOrderMutation.isPending
                ? t('order:orderProcessing', 'Đang khóa món vật lý...')
                : t('order:confirmOrderBtn', 'Xác Nhận Giữ Chỗ (15 Phút)')}
            </Button>

            <Button
              component={RouterLink}
              to="/cart"
              variant="outlined"
              fullWidth
              sx={{ borderRadius: 2.5, py: 1 }}
            >
              {t('common:actions.back', 'Quay Lại Giỏ Hàng')}
            </Button>
          </Card>
        </Box>
      </Box>
    </Container>
  )
}
