import React from 'react'
import {
  Container,
  Typography,
  Box,
  Button,
  Divider,
  Breadcrumbs,
  Link,
  Card,
  CardContent,
  IconButton,
  Alert,
} from '@mui/material'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCart, cartStore } from '../store/cartStore'
import { formatVND } from '../../../utils/formatCurrency'
import { useDocumentTitle } from '../../../hooks/useDocumentTitle'
import { brandColors } from '../../../theme/palette'

export const CartPage: React.FC = () => {
  const { t, i18n } = useTranslation(['cart', 'common'])
  useDocumentTitle(t('cart:cartTitle', 'Giỏ Hàng Trang Sức'))
  const navigate = useNavigate()
  const { items, totalQuantity, totalAmount } = useCart()

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/" color="inherit" underline="hover">
          {t('common:nav.collection', 'Trang Chủ')}
        </Link>
        <Typography color="text.primary">{t('cart:cartTitle', 'Giỏ Hàng')}</Typography>
      </Breadcrumbs>

      <Typography variant="h1" sx={{ fontSize: '2rem', mb: 3, color: brandColors.primary }}>
        {t('cart:cartTitle', 'Giỏ Hàng Trang Sức')}
      </Typography>

      {items.length === 0 ? (
        <Card sx={{ p: 6, textAlign: 'center' }}>
          <ShoppingBagOutlinedIcon sx={{ fontSize: 64, color: brandColors.borderStrong, mb: 2 }} />
          <Typography variant="h2" sx={{ fontSize: '1.5rem', mb: 1 }}>
            {t('cart:emptyCart', 'Giỏ hàng của bạn đang trống.')}
          </Typography>
          <Typography variant="body2" sx={{ color: brandColors.textSecondary, mb: 3 }}>
            {t('cart:emptySubtitle', 'Hãy chiêm ngưỡng các tuyệt tác kim hoàn và chọn cho mình món trang sức ưng ý.')}
          </Typography>
          <Button component={RouterLink} to="/" variant="contained">
            {t('cart:exploreCollection', 'Khám Phá Bộ Sưu Tập')}
          </Button>
        </Card>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 4 }}>
          {/* Items Column */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Alert severity="info" sx={{ mb: 1 }}>
              {t('cart:limitNotice', 'Mỗi món tối đa 10 chiếc; tổng đơn không quá 20 chiếc (quy định an toàn bảo hiểm kim hoàn).')}
            </Alert>

            {items.map((item) => (
              <Card key={item.productId} sx={{ p: 2.5 }}>
                <CardContent sx={{ p: 0, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 2 }}>
                  <Box>
                    <Typography variant="h3" sx={{ fontSize: '1.125rem', mb: 0.5 }}>
                      {item.productName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: brandColors.textSecondary, display: 'block', mb: 1 }}>
                      {item.category} • {item.material} {item.gemstone ? `• ${item.gemstone}` : ''}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700, color: brandColors.primary }}>
                      {formatVND(item.price, i18n.language)} / chiếc
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', border: `1px solid ${brandColors.borderStrong}`, borderRadius: 1.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => cartStore.updateQuantity(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        sx={{ width: 36, height: 36 }}
                        aria-label="Giảm 1"
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <Typography sx={{ px: 1.5, fontWeight: 700, minWidth: 28, textAlign: 'center' }}>
                        {item.quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => cartStore.updateQuantity(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= 10 || totalQuantity >= 20}
                        sx={{ width: 36, height: 36 }}
                        aria-label="Tăng 1"
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    <Typography variant="body1" sx={{ fontWeight: 700, minWidth: 120, textAlign: 'right' }}>
                      {formatVND(item.price * item.quantity, i18n.language)}
                    </Typography>

                    <IconButton
                      onClick={() => cartStore.removeItem(item.productId)}
                      sx={{ color: brandColors.textSecondary, '&:hover': { color: brandColors.error } }}
                      aria-label="Xóa món này"
                    >
                      <DeleteOutlinedIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Summary Column */}
          <Box>
            <Card sx={{ p: 3, position: 'sticky', top: 96 }}>
              <Typography variant="h3" sx={{ mb: 2 }}>
                {t('cart:total', 'Tóm Tắt Đơn Giữ Chỗ')}
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: brandColors.textSecondary }}>
                  {t('cart:itemCount', { count: totalQuantity, defaultValue: `${totalQuantity} món trang sức` })}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {formatVND(totalAmount, i18n.language)}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  Tổng Giá Trị
                </Typography>
                <Typography variant="h2" sx={{ fontSize: '1.5rem', color: brandColors.primary, fontWeight: 700 }}>
                  {formatVND(totalAmount, i18n.language)}
                </Typography>
              </Box>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={() => navigate('/checkout')}
                sx={{ py: 1.5, fontSize: '1rem', mb: 1.5 }}
              >
                {t('cart:proceedToCheckout', 'Tiến Hành Giữ Chỗ (15 Phút)')}
              </Button>

              <Button
                variant="outlined"
                fullWidth
                size="small"
                onClick={() => cartStore.clearCart()}
                sx={{ color: brandColors.textSecondary, borderColor: brandColors.border }}
              >
                {t('cart:clearCart', 'Xóa Toàn Bộ Giỏ')}
              </Button>
            </Card>
          </Box>
        </Box>
      )}
    </Container>
  )
}
