import React, { useMemo } from 'react'
import {
  Container,
  Box,
  Typography,
  TextField,
  MenuItem,
  InputAdornment,
  Alert,
  Button,
  Card,
  CardContent,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined'
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined'
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined'
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { Link as RouterLink, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useProductsQuery } from '../api/useProductsQuery'
import { ProductCard } from '../components/ProductCard'
import { CategoryFilter } from '../components/CategoryFilter'
import { ProductCardSkeleton } from '../../../components/common/LoadingSkeleton'
import { useDocumentTitle } from '../../../hooks/useDocumentTitle'
import { useAuth } from '../../auth/store/authStore'
import { brandColors } from '../../../theme/palette'

export const CatalogPage: React.FC = () => {
  const { t } = useTranslation(['catalog', 'common', 'auth'])
  useDocumentTitle(t('catalog:title', 'Bộ Sưu Tập Trang Sức'))

  const { isAuthenticated } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()

  const category = searchParams.get('category') || undefined
  const searchQuery = searchParams.get('search') || ''
  const sortBy = searchParams.get('sort') || 'newest'

  const { data: products, isLoading, error, refetch } = useProductsQuery(category)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextParams = new URLSearchParams(searchParams)
    const val = e.target.value
    if (val) {
      nextParams.set('search', val)
    } else {
      nextParams.delete('search')
    }
    setSearchParams(nextParams, { replace: true })
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('sort', e.target.value)
    setSearchParams(nextParams, { replace: false })
  }

  // Filter and sort items locally
  const filteredProducts = useMemo(() => {
    if (!products) return []
    let list = [...products]

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter(
        (p) =>
          p.productName.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q) ||
          (p.gemstone && p.gemstone.toLowerCase().includes(q))
      )
    }

    // Sort
    if (sortBy === 'priceAsc') {
      list.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'priceDesc') {
      list.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'nameAsc') {
      list.sort((a, b) => a.productName.localeCompare(b.productName))
    } else {
      // Default: newest by ID
      list.sort((a, b) => b.productId - a.productId)
    }

    return list
  }, [products, searchQuery, sortBy])

  return (
    <Box sx={{ pb: 10 }}>
      {/* Editorial Haute Joaillerie Hero Section */}
      <Box
        sx={{
          background: 'radial-gradient(ellipse at 50% 15%, rgba(216, 195, 165, 0.35) 0%, rgba(250, 248, 245, 0.9) 65%, #FAF8F5 100%)',
          pt: { xs: 6, md: 9 },
          pb: { xs: 5, md: 8 },
          borderBottom: `1px solid ${brandColors.hairline}`,
          mb: 4,
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <Container maxWidth="md">
          {/* Atelier Badge */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 0.6,
              borderRadius: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              border: `1px solid ${brandColors.borderStrong}`,
              boxShadow: '0 2px 8px rgba(47, 41, 37, 0.04)',
              mb: 2.5,
            }}
          >
            <DiamondOutlinedIcon sx={{ color: brandColors.secondary, fontSize: 16 }} />
            <Typography
              variant="caption"
              sx={{
                color: brandColors.secondary,
                fontWeight: 700,
                letterSpacing: '0.12em',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
              }}
            >
              Haute Joaillerie Atelier • Đẳng Cấp Chế Tác
            </Typography>
          </Box>

          <Typography
            variant="h1"
            sx={{
              color: brandColors.primary,
              mb: 2.5,
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: { xs: '2.2rem', md: '3.25rem' },
              fontWeight: 500,
              lineHeight: 1.18,
              letterSpacing: '-0.02em',
            }}
          >
            {t('catalog:title', 'Bộ Sưu Tập Trang Sức Cao Cấp')}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: brandColors.textSecondary,
              maxWidth: 620,
              mx: 'auto',
              fontSize: { xs: '0.95rem', md: '1.05rem' },
              lineHeight: 1.7,
              mb: 3.5,
            }}
          >
            {t('catalog:subtitle', 'Tuyệt tác chế tác tinh xảo từ vàng nguyên chất, kim cương tự nhiên và đá quý cao cấp với dịch vụ giữ chỗ vật lý tại showroom.')}
          </Typography>

          {/* 3 Trust Pillars */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: { xs: 1.5, sm: 3 },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <VerifiedOutlinedIcon sx={{ color: brandColors.secondary, fontSize: 18 }} />
              <Typography variant="caption" sx={{ fontWeight: 600, color: brandColors.textPrimary }}>
                100% Vàng Đủ Tuổi
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <SecurityOutlinedIcon sx={{ color: brandColors.secondary, fontSize: 18 }} />
              <Typography variant="caption" sx={{ fontWeight: 600, color: brandColors.textPrimary }}>
                Kiểm Định Quốc Tế
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <TimerOutlinedIcon sx={{ color: brandColors.secondary, fontSize: 18 }} />
              <Typography variant="caption" sx={{ fontWeight: 600, color: brandColors.textPrimary }}>
                Giữ Chỗ 15 Phút Tại Quầy
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Container */}
      <Container maxWidth="lg">
        {/* GAP-02 VIP Membership Privilege Card for Unauthenticated Guests */}
        {!isAuthenticated && (
          <Card
            sx={{
              mb: 4.5,
              borderRadius: 3.5,
              border: `1.5px solid ${brandColors.borderStrong}`,
              background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF8F5 100%)',
              boxShadow: '0 8px 24px -6px rgba(47, 41, 37, 0.08)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: 5,
                height: '100%',
                backgroundColor: brandColors.secondary,
              }}
            />
            <CardContent sx={{ p: { xs: 2.5, sm: 3.5 }, pl: { xs: 3.5, sm: 4.5 } }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  alignItems: { md: 'center' },
                  justifyContent: 'space-between',
                  gap: 2.5,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2.5,
                      backgroundColor: brandColors.warningBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: brandColors.secondary,
                      flexShrink: 0,
                    }}
                  >
                    <LockOutlinedIcon sx={{ fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="h3" sx={{ fontSize: '1.15rem', fontWeight: 700, color: brandColors.primary, mb: 0.5 }}>
                      Đặc Quyền Thành Viên Showroom Kim Hoàn
                    </Typography>
                    <Typography variant="body2" sx={{ color: brandColors.textSecondary, maxWidth: 600, lineHeight: 1.6 }}>
                      {t('auth:guestNotice', 'Vui lòng đăng nhập hoặc đăng ký tài khoản để chiêm ngưỡng bảng giá niêm yết độc quyền và đặt lịch giữ chỗ trang sức tại showroom.')}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1.5, flexShrink: 0, ml: { xs: 0, md: 'auto' } }}>
                  <Button
                    component={RouterLink}
                    to="/login"
                    variant="contained"
                    color="primary"
                    size="medium"
                    sx={{ borderRadius: 2.5, px: 2.5 }}
                  >
                    {t('common:nav.login', 'Đăng Nhập')}
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="outlined"
                    size="medium"
                    sx={{ borderRadius: 2.5, px: 2.5 }}
                  >
                    {t('common:nav.register', 'Đăng Ký')}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Filter & Search Bar Floating Dock */}
        <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Categories Horizontal Dock */}
          <CategoryFilter />

          {/* Search & Sort Controls Row */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              justifyContent: 'space-between',
              alignItems: { sm: 'center' },
            }}
          >
            <TextField
              placeholder={t('catalog:searchPlaceholder', 'Tìm kiếm theo tên hoặc chất liệu trang sức...')}
              value={searchQuery}
              onChange={handleSearchChange}
              size="small"
              sx={{
                width: { xs: '100%', sm: 380 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2.5,
                  backgroundColor: brandColors.surface,
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: brandColors.textSecondary, fontSize: 20 }} />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              select
              size="small"
              label={t('catalog:sortBy', 'Sắp xếp')}
              value={sortBy}
              onChange={handleSortChange}
              sx={{
                width: { xs: '100%', sm: 220 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2.5,
                  backgroundColor: brandColors.surface,
                },
              }}
            >
              <MenuItem value="newest">{t('catalog:sortOptions.newest', 'Mới nhất')}</MenuItem>
              <MenuItem value="priceAsc">{t('catalog:sortOptions.priceAsc', 'Giá: Thấp đến Cao')}</MenuItem>
              <MenuItem value="priceDesc">{t('catalog:sortOptions.priceDesc', 'Giá: Cao đến Thấp')}</MenuItem>
              <MenuItem value="nameAsc">{t('catalog:sortOptions.nameAsc', 'Tên: A đến Z')}</MenuItem>
            </TextField>
          </Box>
        </Box>

        {/* Catalog Grid State Handling */}
        {isLoading ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
              gap: 3,
            }}
          >
            {Array.from({ length: 8 }).map((_, idx) => (
              <ProductCardSkeleton key={idx} />
            ))}
          </Box>
        ) : error ? (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={() => refetch()}>
                {t('common:actions.retry', 'Thử Lại')}
              </Button>
            }
            sx={{ borderRadius: 3 }}
          >
            Không thể tải danh mục sản phẩm từ máy chủ. Vui lòng kiểm tra lại kết nối.
          </Alert>
        ) : filteredProducts.length === 0 ? (
          <Box
            sx={{
              py: 10,
              px: 3,
              textAlign: 'center',
              backgroundColor: brandColors.surface,
              borderRadius: 4,
              border: `1px solid ${brandColors.border}`,
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                backgroundColor: brandColors.surfaceSubtle,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: brandColors.secondary,
                mb: 2,
              }}
            >
              <DiamondOutlinedIcon sx={{ fontSize: 32 }} />
            </Box>
            <Typography variant="h3" sx={{ mb: 1, color: brandColors.textPrimary }}>
              {t('catalog:emptyCatalog', 'Không tìm thấy món trang sức nào phù hợp.')}
            </Typography>
            <Typography variant="body2" sx={{ color: brandColors.textSecondary, mb: 3, maxWidth: 440, mx: 'auto' }}>
              Vui lòng thử điều chỉnh lại từ khóa hoặc chuyển sang thể loại khác.
            </Typography>
            <Button
              variant="outlined"
              onClick={() => {
                setSearchParams({})
              }}
              sx={{ borderRadius: 2.5 }}
            >
              {t('catalog:resetFilters', 'Xóa bộ lọc')}
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
              gap: 3,
            }}
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.productId} product={product} />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  )
}
