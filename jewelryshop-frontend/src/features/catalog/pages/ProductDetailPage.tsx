import React, { useState, useContext } from 'react'
import {
  Container,
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Button,
  IconButton,
  Divider,
  Alert,
  Card,
  CardContent,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined'
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined'
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined'
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useProductDetailQuery } from '../api/useProductsQuery'
import { ProductGallery } from '../components/ProductGallery'
import { StockBadge } from '../../../components/common/StockBadge'
import { formatVND } from '../../../utils/formatCurrency'
import { cartStore } from '../../cart/store/cartStore'
import { useDocumentTitle } from '../../../hooks/useDocumentTitle'
import { brandColors } from '../../../theme/palette'
import { TableSkeleton } from '../../../components/common/LoadingSkeleton'
import { ToastContext } from '../../../layouts/ToastContext'

export const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>()
  const { t, i18n } = useTranslation(['catalog', 'common', 'cart'])
  const navigate = useNavigate()
  const { showToast } = useContext(ToastContext)

  const [quantity, setQuantity] = useState(1)
  const { data: product, isLoading, error } = useProductDetailQuery(productId)

  useDocumentTitle(product ? product.productName : t('catalog:details', 'Chi Tiết Sản Phẩm'))

  const available = product?.inventory?.availableQuantity ?? 0
  const isAvailable = Boolean(product?.active && available > 0)
  const maxCanAdd = Math.min(10, available || 1)

  const handleAddToCart = () => {
    if (!product) return
    const result = cartStore.addItem(product, quantity)
    if (result.success) {
      showToast({
        message: `Đã thêm ${quantity} món "${product.productName}" vào giỏ hàng`,
        severity: 'success',
      })
    } else {
      showToast({ message: result.error || 'Không thể thêm vào giỏ', severity: 'warning' })
    }
  }

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <TableSkeleton rows={6} />
      </Container>
    )
  }

  if (error || !product) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
          Món trang sức này không tồn tại hoặc đã ngừng kinh doanh.
        </Alert>
        <Button component={RouterLink} to="/" variant="contained" sx={{ borderRadius: 2.5 }}>
          Quay lại Bộ Sưu Tập
        </Button>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2.5, sm: 3, md: 4 }, px: { xs: 2, sm: 3 } }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/" color="inherit" underline="hover">
          {t('common:nav.collection', 'Trang Chủ')}
        </Link>
        <Link
          component={RouterLink}
          to={`/?category=${encodeURIComponent(product.category)}`}
          color="inherit"
          underline="hover"
        >
          {product.category}
        </Link>
        <Typography color="text.primary" sx={{ fontWeight: 600 }}>{product.productName}</Typography>
      </Breadcrumbs>

      {/* Back Button for mobile */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        size="small"
        sx={{ mb: 2.5, display: { xs: 'inline-flex', sm: 'none' }, borderRadius: 2 }}
      >
        {t('common:actions.back', 'Quay Lại')}
      </Button>

      {/* Detail Split Layout */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: { xs: 4, md: 7 },
          alignItems: 'start',
        }}
      >
        {/* Left Column: Showcase & Atelier Guarantee */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <ProductGallery
            images={product.images}
            productName={product.productName}
            category={product.category}
          />

          {/* Showroom Guarantee Bento Box */}
          <Card sx={{ borderRadius: 3, border: `1px solid ${brandColors.border}`, backgroundColor: brandColors.surfaceSubtle }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="caption" sx={{ color: brandColors.secondary, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', mb: 1.5 }}>
                Chính Sách Chế Tác & Nhận Tại Showroom
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                  <TimerOutlinedIcon sx={{ color: brandColors.secondary, fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: brandColors.textPrimary }}>
                    <strong>Giữ chỗ 15 phút:</strong> Khóa sản phẩm vật lý tại quầy ngay khi tạo đơn
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                  <VerifiedOutlinedIcon sx={{ color: brandColors.success, fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: brandColors.textPrimary }}>
                    <strong>Kiểm định tại quầy:</strong> Trực tiếp thử độ tinh khiết vàng và cân trọng lượng
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                  <SecurityOutlinedIcon sx={{ color: brandColors.warning, fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: brandColors.textPrimary }}>
                    <strong>Không giao hàng bưu điện:</strong> Đảm bảo 100% an toàn kiểm định giá trị cao
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Right Column: Specifications & Reservation Action */}
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography
              variant="caption"
              sx={{
                color: brandColors.secondary,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontSize: '0.78rem',
              }}
            >
              {product.category}
            </Typography>
            <StockBadge inventory={product.inventory} active={product.active} size="medium" />
          </Box>

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '1.85rem', md: '2.4rem' },
              fontFamily: '"Playfair Display", Georgia, serif',
              color: brandColors.primary,
              lineHeight: 1.2,
              mb: 2,
            }}
          >
            {product.productName}
          </Typography>

          {/* Price Box with subtle highlight */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'baseline',
              flexWrap: 'wrap',
              gap: 1.5,
              p: 2,
              borderRadius: 3,
              backgroundColor: 'rgba(216, 195, 165, 0.15)',
              border: `1px solid rgba(176, 141, 87, 0.25)`,
              mb: 3,
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.6rem', md: '2.1rem' },
                fontWeight: 700,
                color: brandColors.primary,
                letterSpacing: '-0.02em',
              }}
            >
              {formatVND(product.price, i18n.language)}
            </Typography>
            <Typography variant="caption" sx={{ color: brandColors.textSecondary, fontWeight: 500 }}>
              (Giá niêm yết tại showroom)
            </Typography>
          </Box>

          {/* Description */}
          {product.description && (
            <Typography variant="body1" sx={{ color: brandColors.textSecondary, lineHeight: 1.75, mb: 3.5 }}>
              {product.description}
            </Typography>
          )}

          {/* Bento Specs Grid (Responsive: 1 col on mobile, 2 cols on tablet+) */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2, mb: 4 }}>
            <Box sx={{ p: 2, borderRadius: 2.5, backgroundColor: brandColors.surface, border: `1px solid ${brandColors.border}` }}>
              <Typography variant="caption" sx={{ color: brandColors.textSecondary, display: 'block', mb: 0.5 }}>
                {t('catalog:material', 'Chất liệu chính')}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: brandColors.primary }}>
                {product.material}
              </Typography>
            </Box>

            <Box sx={{ p: 2, borderRadius: 2.5, backgroundColor: brandColors.surface, border: `1px solid ${brandColors.border}` }}>
              <Typography variant="caption" sx={{ color: brandColors.textSecondary, display: 'block', mb: 0.5 }}>
                {t('catalog:gemstone', 'Đá quý đính kèm')}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: brandColors.primary }}>
                {product.gemstone || 'Không đính đá'}
              </Typography>
            </Box>

            <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' }, p: 2, borderRadius: 2.5, backgroundColor: brandColors.surface, border: `1px solid ${brandColors.border}` }}>
              <Typography variant="caption" sx={{ color: brandColors.textSecondary, display: 'block', mb: 0.5 }}>
                {t('catalog:availability', 'Tồn kho vật lý tại showroom')}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: isAvailable ? brandColors.success : brandColors.error }}>
                {product.inventory
                  ? `${product.inventory.availableQuantity} chiếc có sẵn (${product.inventory.reservedQuantity} chiếc đang giữ chỗ)`
                  : 'Đang kết nối kho'}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3.5, borderColor: brandColors.hairline }} />

          {/* Quantity Stepper & Add to Bag CTA */}
          {isAvailable ? (
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: { sm: 'center' } }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  border: `1px solid ${brandColors.borderStrong}`,
                  borderRadius: 3,
                  backgroundColor: brandColors.surface,
                  p: 0.5,
                }}
              >
                <IconButton
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  sx={{ width: 44, height: 44, minWidth: 44, minHeight: 44, borderRadius: 2 }}
                  aria-label="Giảm số lượng"
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <Typography sx={{ px: 2, fontWeight: 700, minWidth: 36, textAlign: 'center' }}>
                  {quantity}
                </Typography>
                <IconButton
                  onClick={() => setQuantity((q) => Math.min(maxCanAdd, q + 1))}
                  disabled={quantity >= maxCanAdd}
                  sx={{ width: 44, height: 44, minWidth: 44, minHeight: 44, borderRadius: 2 }}
                  aria-label="Tăng số lượng"
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>

              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<ShoppingBagOutlinedIcon />}
                onClick={handleAddToCart}
                sx={{
                  flexGrow: 1,
                  py: 1.6,
                  borderRadius: 3,
                  fontSize: '1rem',
                  fontWeight: 700,
                  boxShadow: '0 4px 14px rgba(47, 41, 37, 0.2)',
                }}
              >
                {t('catalog:addToCart', 'Thêm Vào Giỏ Giữ Chỗ')}
              </Button>
            </Box>
          ) : (
            <Alert severity="warning" sx={{ borderRadius: 3 }}>
              {t('catalog:outOfStock', 'Món trang sức này hiện đang tạm hết hàng tại showroom. Quý khách vui lòng chọn món trang sức khác.')}
            </Alert>
          )}
        </Box>
      </Box>
    </Container>
  )
}
