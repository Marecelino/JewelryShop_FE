import React, { useContext } from 'react'
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Button,
} from '@mui/material'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import { Link as RouterLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { ProductResponse } from '../../../types/product.types'
import { JewelryIllustration } from '../../../components/common/JewelryIllustration'
import { StockBadge } from '../../../components/common/StockBadge'
import { formatVND } from '../../../utils/formatCurrency'
import { cartStore } from '../../cart/store/cartStore'
import { brandColors } from '../../../theme/palette'
import { ToastContext } from '../../../layouts/ToastContext'

interface Props {
  product: ProductResponse
}

export const ProductCard: React.FC<Props> = ({ product }) => {
  const { t, i18n } = useTranslation(['catalog', 'common'])
  const { showToast } = useContext(ToastContext)

  const isAvailable = product.active && (product.inventory?.availableQuantity ?? 0) > 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const result = cartStore.addItem(product, 1)
    if (result.success) {
      showToast({ message: `Đã thêm "${product.productName}" vào giỏ hàng`, severity: 'success' })
    } else {
      showToast({ message: result.error || 'Không thể thêm vào giỏ', severity: 'warning' })
    }
  }

  return (
    <Card
      component={RouterLink}
      to={`/products/${product.productId}`}
      sx={{
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        color: 'inherit',
        borderRadius: 3.5,
        border: `1px solid ${brandColors.border}`,
        backgroundColor: brandColors.surface,
        boxShadow: '0 1px 3px rgba(47, 41, 37, 0.04), 0 6px 16px -4px rgba(47, 41, 37, 0.05)',
        transition: 'transform 220ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 220ms cubic-bezier(0.16, 1, 0.3, 1), border-color 220ms ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 4px 6px -1px rgba(47, 41, 37, 0.04), 0 18px 36px -6px rgba(47, 41, 37, 0.12)',
          borderColor: brandColors.secondary,
          '& .jewelry-art': {
            transform: 'scale(1.04)',
          },
        },
      }}
    >
      {/* Category illustration or primary image with 4:5 golden ratio and zoom effect */}
      <Box sx={{ position: 'relative', overflow: 'hidden', aspectRatio: '4/5', backgroundColor: brandColors.surfaceSubtle }}>
        {product.primaryImageUrl ? (
          <Box
            component="img"
            src={product.primaryImageUrl}
            alt={product.productName}
            loading="lazy"
            className="jewelry-art"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 360ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        ) : (
          <Box
            className="jewelry-art"
            sx={{
              transition: 'transform 320ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <JewelryIllustration category={product.category} ratio="4/5" />
          </Box>
        )}
        <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 2 }}>
          <StockBadge inventory={product.inventory} active={product.active} size="small" />
        </Box>
      </Box>

      {/* Content */}
      <CardContent sx={{ flexGrow: 1, p: 2.5, pb: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="caption"
          sx={{
            color: brandColors.secondary,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontSize: '0.72rem',
            mb: 0.75,
          }}
        >
          {product.category}
        </Typography>

        <Typography
          variant="h3"
          sx={{
            fontSize: '1.1rem',
            fontWeight: 600,
            color: brandColors.textPrimary,
            lineHeight: 1.4,
            mb: 0.75,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.productName}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: brandColors.textSecondary,
            fontSize: '0.825rem',
            mb: 1.5,
          }}
        >
          {product.material} {product.gemstone ? `• ${product.gemstone}` : ''}
        </Typography>

        <Typography
          variant="h3"
          sx={{
            mt: 'auto',
            fontSize: '1.25rem',
            fontWeight: 700,
            color: brandColors.primary,
            letterSpacing: '-0.01em',
          }}
        >
          {formatVND(product.price, i18n.language)}
        </Typography>
      </CardContent>

      {/* Actions */}
      <CardActions sx={{ p: 2.5, pt: 0 }}>
        <Button
          fullWidth
          variant="outlined"
          color="primary"
          size="medium"
          disabled={!isAvailable}
          startIcon={<AddShoppingCartIcon sx={{ fontSize: '1.1rem !important' }} />}
          onClick={handleAddToCart}
          sx={{
            borderRadius: 2.5,
            minHeight: 40,
            borderColor: brandColors.borderStrong,
            fontWeight: 600,
            fontSize: '0.875rem',
            '&:hover': {
              borderColor: brandColors.secondary,
              backgroundColor: 'rgba(176, 141, 87, 0.08)',
              color: brandColors.primary,
            },
          }}
        >
          {isAvailable ? t('catalog:addToCart', 'Thêm Vào Giỏ') : t('catalog:outOfStock', 'Hết hàng')}
        </Button>
      </CardActions>
    </Card>
  )
}
