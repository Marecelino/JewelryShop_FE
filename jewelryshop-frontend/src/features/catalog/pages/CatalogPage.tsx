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
  Breadcrumbs,
  Link,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined'
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined'
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined'
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Link as RouterLink, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useProductsQuery } from '../api/useProductsQuery'
import { ProductCard } from '../components/ProductCard'
import { CategoryFilter } from '../components/CategoryFilter'
import { CategoryCircles } from '../components/CategoryCircles'
import { SectionHeader } from '../components/SectionHeader'
import { ProductCarousel } from '../components/ProductCarousel'
import { MiddleBanner } from '../components/MiddleBanner'
import { TrustPillars } from '../components/TrustPillars'
import { ShowroomMapSection } from '../components/ShowroomMapSection'
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

  // Is user in dedicated search or single category view?
  const isFilteredView = Boolean(searchQuery.trim() || (category && category !== 'all'))

  const { data: products, isLoading, error, refetch } = useProductsQuery(isFilteredView ? category : undefined)

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

  // Category subsets for Section-based Homepage Mode
  const { featuredItems, ringItems, necklaceItems, braceletItems, earringItems } = useMemo(() => {
    if (!products) {
      return {
        featuredItems: [],
        ringItems: [],
        necklaceItems: [],
        braceletItems: [],
        earringItems: [],
      }
    }

    const rings = products.filter((p) => p.category.toLowerCase().includes('ring') || p.category.toLowerCase().includes('nhẫn'))
    const necklaces = products.filter((p) => p.category.toLowerCase().includes('neck') || p.category.toLowerCase().includes('dây'))
    const bracelets = products.filter((p) => p.category.toLowerCase().includes('brace') || p.category.toLowerCase().includes('vòng') || p.category.toLowerCase().includes('lắc'))
    const earrings = products.filter((p) => p.category.toLowerCase().includes('ear') || p.category.toLowerCase().includes('bông') || p.category.toLowerCase().includes('tai'))

    // Most recent overall items for Featured
    const featured = [...products].sort((a, b) => b.productId - a.productId)

    return {
      featuredItems: featured,
      ringItems: rings,
      necklaceItems: necklaces,
      braceletItems: bracelets,
      earringItems: earrings,
    }
  }, [products])

  return (
    <Box sx={{ pb: 10 }}>
      {/* 2026 Haute Joaillerie Masterpiece Hero Section (Asymmetric Editorial Showcase) */}
      <Box
        component="section"
        aria-label="Khám phá bộ sưu tập Kim Ngân Phát"
        sx={{
          background: 'radial-gradient(ellipse at 50% -10%, rgba(216, 195, 165, 0.45) 0%, rgba(250, 248, 245, 0.95) 55%, #FAF8F5 100%)',
          pt: { xs: 4, sm: 6, md: 8 },
          pb: { xs: 5, sm: 6, md: 8 },
          borderBottom: `1px solid ${brandColors.hairline}`,
          mb: { xs: 3.5, md: 5 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle Ambient Gold Dust / Shimmer Orbs */}
        <Box
          sx={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: { xs: 300, md: 550 },
            height: { xs: 300, md: 550 },
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(176, 141, 87, 0.12) 0%, rgba(250, 248, 245, 0) 70%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '-15%',
            left: '-5%',
            width: { xs: 240, md: 400 },
            height: { xs: 240, md: 400 },
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(216, 195, 165, 0.18) 0%, rgba(250, 248, 245, 0) 70%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, px: { xs: 2, sm: 3 } }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1.15fr 0.85fr' },
              gap: { xs: 4, sm: 5, md: 6 },
              alignItems: 'center',
            }}
          >
            {/* Left Column: Brand Storytelling, Campaign Headline & CTAs */}
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              {/* Atelier Brand Tag Badge */}
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 0.65,
                  borderRadius: 4,
                  backgroundColor: 'rgba(255, 255, 255, 0.92)',
                  border: '1px solid rgba(176, 141, 87, 0.35)',
                  boxShadow: '0 4px 14px rgba(47, 41, 37, 0.05)',
                  mb: 2.5,
                  backdropFilter: 'blur(8px)',
                }}
              >
                <AutoAwesomeIcon sx={{ color: brandColors.secondary, fontSize: 16 }} />
                <Typography
                  variant="caption"
                  sx={{
                    color: brandColors.secondary,
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                    textTransform: 'uppercase',
                  }}
                >
                  Kim Ngân Phát • Haute Joaillerie 2026
                </Typography>
              </Box>

              {/* Subtitle Campaign */}
              <Typography
                variant="subtitle2"
                sx={{
                  color: brandColors.secondary,
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  fontSize: { xs: '0.825rem', sm: '0.925rem' },
                  textTransform: 'uppercase',
                  mb: 1.5,
                  display: 'block',
                }}
              >
                Tuyệt Tác Mùa Cưới &amp; Kim Cương Tự Nhiên
              </Typography>

              {/* Hero Main Heading (Playfair Display) */}
              <Typography
                variant="h1"
                sx={{
                  color: brandColors.primary,
                  mb: 2.25,
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontSize: { xs: '1.95rem', sm: '2.5rem', md: '3.15rem' },
                  fontWeight: 600,
                  lineHeight: 1.16,
                  letterSpacing: '-0.02em',
                }}
              >
                Tinh Hoa Chế Tác
                <Box
                  component="span"
                  sx={{
                    display: 'block',
                    background: 'linear-gradient(135deg, #2F2925 30%, #B08D57 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Kim Hoàn Hoàng Gia
                </Box>
              </Typography>

              {/* Narrative description */}
              <Typography
                variant="body1"
                sx={{
                  color: brandColors.textSecondary,
                  maxWidth: 560,
                  mx: { xs: 'auto', md: 0 },
                  fontSize: { xs: '0.925rem', sm: '1rem', md: '1.025rem' },
                  lineHeight: 1.7,
                  mb: 3.5,
                }}
              >
                Giao thoa hoàn mỹ giữa vàng nguyên chất đúng tuổi, giác cắt kim cương tự nhiên chuẩn quốc tế và tinh hoa bàn tay nghệ nhân kim hoàn. Chiêm ngưỡng và trải nghiệm dịch vụ khóa giữ chỗ 15 phút tại showroom tiệm vàng.
              </Typography>

              {/* Dual CTA Actions (2026 Standard) */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  flexWrap: 'wrap',
                  gap: 2,
                  mb: 4,
                }}
              >
                <Button
                  component="a"
                  href="#all-section"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    px: { xs: 3, sm: 3.5 },
                    py: 1.4,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #2F2925 0%, #463D37 100%)',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    letterSpacing: '0.03em',
                    boxShadow: '0 8px 20px -4px rgba(47, 41, 37, 0.28)',
                    textTransform: 'none',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1F1B18 0%, #2F2925 100%)',
                      boxShadow: '0 12px 28px -6px rgba(47, 41, 37, 0.38)',
                    },
                  }}
                >
                  Chiêm Ngưỡng Tuyệt Tác
                </Button>

                <Button
                  component="a"
                  href="#rings-section"
                  variant="outlined"
                  size="large"
                  sx={{
                    px: { xs: 2.5, sm: 3 },
                    py: 1.35,
                    borderRadius: 3,
                    borderColor: 'rgba(176, 141, 87, 0.5)',
                    color: brandColors.primary,
                    fontWeight: 600,
                    letterSpacing: '0.02em',
                    backgroundColor: 'rgba(255, 255, 255, 0.65)',
                    textTransform: 'none',
                    backdropFilter: 'blur(6px)',
                    '&:hover': {
                      borderColor: brandColors.secondary,
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      color: brandColors.secondaryHover,
                    },
                  }}
                >
                  BST Nhẫn Cưới &amp; Kim Cương
                </Button>
              </Box>

              {/* 3 Pillars of Fine Jewelry Trust */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: { xs: 2, sm: 3 },
                  pt: 2.5,
                  borderTop: `1px solid ${brandColors.hairline}`,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.9 }}>
                  <VerifiedOutlinedIcon sx={{ color: brandColors.success, fontSize: 18 }} />
                  <Typography variant="caption" sx={{ fontWeight: 600, color: brandColors.textPrimary, fontSize: '0.8rem' }}>
                    100% Vàng Đủ Tuổi
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.9 }}>
                  <SecurityOutlinedIcon sx={{ color: brandColors.secondary, fontSize: 18 }} />
                  <Typography variant="caption" sx={{ fontWeight: 600, color: brandColors.textPrimary, fontSize: '0.8rem' }}>
                    Soi Quang Phổ Tại Quầy
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.9 }}>
                  <TimerOutlinedIcon sx={{ color: brandColors.warning, fontSize: 18 }} />
                  <Typography variant="caption" sx={{ fontWeight: 600, color: brandColors.textPrimary, fontSize: '0.8rem' }}>
                    Khóa Giữ Chỗ 15 Phút
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Right Column: 2026 Fine Jewelry Showcase Stage (Wedding Rings & Diamond Solitaire) */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
              }}
            >
              <Card
                elevation={0}
                sx={{
                  width: '100%',
                  maxWidth: { xs: 360, sm: 420, md: 460 },
                  aspectRatio: { xs: '1/1', sm: '4/3.8' },
                  borderRadius: { xs: 4, md: 5 },
                  background: 'radial-gradient(circle at 50% 38%, #FFFFFF 0%, #FAF5EB 50%, #ECE0CB 100%)',
                  border: '1.5px solid rgba(176, 141, 87, 0.35)',
                  boxShadow: '0 24px 60px -12px rgba(47, 41, 37, 0.16), 0 0 0 1px rgba(255, 255, 255, 0.8) inset',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 3,
                }}
              >
                {/* Velvet Tray Concentric Rings */}
                <Box
                  sx={{
                    position: 'absolute',
                    width: '84%',
                    height: '84%',
                    borderRadius: '50%',
                    border: '1px solid rgba(176, 141, 87, 0.22)',
                    boxShadow: 'inset 0 0 40px rgba(176, 141, 87, 0.12), 0 8px 30px rgba(47, 41, 37, 0.06)',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    width: '64%',
                    height: '64%',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(216, 195, 165, 0.35) 0%, rgba(250, 248, 245, 0) 70%)',
                  }}
                />

                {/* Floating Top Badge: Eternal Flame Campaign */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 18,
                    right: 18,
                    px: 1.75,
                    py: 0.6,
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.88)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(176, 141, 87, 0.35)',
                    boxShadow: '0 4px 12px rgba(47, 41, 37, 0.08)',
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                  }}
                >
                  <DiamondOutlinedIcon sx={{ color: brandColors.secondary, fontSize: 16 }} />
                  <Typography variant="caption" sx={{ color: brandColors.primary, fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                    BST Eternal Flame 2026
                  </Typography>
                </Box>

                {/* Center Masterpiece Jewelry Illustration (Gold Wedding Band & Solitaire Diamond Ring) */}
                <Box
                  sx={{
                    position: 'relative',
                    zIndex: 1,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 320 300"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ maxWidth: 280, maxHeight: 280, filter: 'drop-shadow(0 14px 24px rgba(47, 41, 37, 0.16))' }}
                  >
                    <defs>
                      <linearGradient id="goldBandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFF2D6" />
                        <stop offset="25%" stopColor="#E2C17D" />
                        <stop offset="50%" stopColor="#B08D57" />
                        <stop offset="75%" stopColor="#E8CD96" />
                        <stop offset="100%" stopColor="#8C6A34" />
                      </linearGradient>
                      <linearGradient id="solitaireBandGrad" x1="100%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="30%" stopColor="#EAD7BA" />
                        <stop offset="60%" stopColor="#B08D57" />
                        <stop offset="100%" stopColor="#7E5F30" />
                      </linearGradient>
                      <radialGradient id="diamondShine" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="40%" stopColor="#E8F4FD" />
                        <stop offset="80%" stopColor="#B0D5F7" />
                        <stop offset="100%" stopColor="#87BBE8" />
                      </radialGradient>
                      <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* Left Ring: Classic Polished Gold Wedding Band */}
                    <ellipse
                      cx="120"
                      cy="175"
                      rx="65"
                      ry="48"
                      stroke="url(#goldBandGrad)"
                      strokeWidth="16"
                      fill="none"
                      transform="rotate(-20 120 175)"
                    />
                    <ellipse
                      cx="120"
                      cy="175"
                      rx="63"
                      ry="46"
                      stroke="rgba(255, 255, 255, 0.6)"
                      strokeWidth="2"
                      fill="none"
                      transform="rotate(-20 120 175)"
                    />

                    {/* Right Ring: Solitaire Diamond Engagement Ring Interlocking */}
                    <ellipse
                      cx="195"
                      cy="150"
                      rx="62"
                      ry="46"
                      stroke="url(#solitaireBandGrad)"
                      strokeWidth="14"
                      fill="none"
                      transform="rotate(22 195 150)"
                    />

                    {/* Diamond Prong Setting Base */}
                    <path
                      d="M 215 90 L 205 106 L 235 106 Z"
                      fill="url(#goldBandGrad)"
                    />

                    {/* Brilliant Cut Solitaire Diamond */}
                    <g transform="translate(195, 62) scale(0.95)" filter="url(#glowEffect)">
                      {/* Diamond Top Table */}
                      <polygon
                        points="25,5 37,5 44,14 18,14"
                        fill="#FFFFFF"
                      />
                      {/* Diamond Crown Facets */}
                      <polygon
                        points="18,14 25,5 10,14"
                        fill="#D6E8F7"
                      />
                      <polygon
                        points="37,5 44,14 52,14"
                        fill="#BED8F2"
                      />
                      <polygon
                        points="25,5 37,5 31,14"
                        fill="#F2F8FE"
                      />
                      {/* Diamond Pavilion Lower Body */}
                      <polygon
                        points="10,14 52,14 31,44"
                        fill="url(#diamondShine)"
                      />
                      <polygon
                        points="18,14 31,14 31,44"
                        fill="#FFFFFF"
                        opacity="0.85"
                      />
                      <polygon
                        points="31,14 44,14 31,44"
                        fill="#9FC6EE"
                        opacity="0.6"
                      />
                      {/* Sparkle Glint Star */}
                      <path
                        d="M 44 4 L 46 0 L 48 4 L 52 6 L 48 8 L 46 12 L 44 8 L 40 6 Z"
                        fill="#FFFFFF"
                      />
                      <path
                        d="M 12 18 L 13 14 L 14 18 L 18 19 L 14 20 L 13 24 L 12 20 L 8 19 Z"
                        fill="#FFFFFF"
                        opacity="0.9"
                      />
                    </g>
                  </svg>
                </Box>

                {/* Floating Bottom Left Badge: Glassmorphism In-Store Privilege */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    left: 16,
                    right: 16,
                    p: 1.25,
                    px: 1.75,
                    borderRadius: 2.5,
                    background: 'rgba(255, 255, 255, 0.88)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(176, 141, 87, 0.25)',
                    boxShadow: '0 6px 18px rgba(47, 41, 37, 0.08)',
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.25,
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 1.5,
                      backgroundColor: brandColors.surfaceSubtle,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: brandColors.secondary,
                      flexShrink: 0,
                    }}
                  >
                    <TimerOutlinedIcon sx={{ fontSize: 18 }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: brandColors.primary, fontWeight: 700, display: 'block', fontSize: '0.75rem', lineHeight: 1.3 }}>
                      Khóa Giữ Chỗ Vật Lý 15 Phút
                    </Typography>
                    <Typography variant="caption" sx={{ color: brandColors.textSecondary, fontSize: '0.675rem', display: 'block', lineHeight: 1.2 }}>
                      Trải nghiệm thực tế &amp; thử vàng trực tiếp tại tiệm
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Container */}
      <Container maxWidth="lg" sx={{ px: { xs: 1.5, sm: 2.5, md: 3 }, maxWidth: '100vw' }}>
        {/* GAP-02 VIP Membership Privilege Card for Unauthenticated Guests */}
        {!isAuthenticated && (
          <Card
            sx={{
              mb: 5,
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

        {/* Category Circles (Circular Category Highlights like in the inspiration template) */}
        {!isFilteredView && <CategoryCircles />}

        {/* Search & Sort Controls Dock */}
        <Box
          sx={{
            mb: 5,
            p: 2.5,
            borderRadius: 3.5,
            backgroundColor: brandColors.surface,
            border: `1px solid ${brandColors.border}`,
            boxShadow: '0 2px 8px rgba(47, 41, 37, 0.03)',
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
              width: { xs: '100%', sm: 420 },
              '& .MuiOutlinedInput-root': {
                borderRadius: 2.5,
                backgroundColor: brandColors.surfaceSubtle,
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

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                  backgroundColor: brandColors.surfaceSubtle,
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

        {/* Global Loading / Error State Handling */}
        {isLoading ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
              gap: { xs: 1.5, sm: 2.5, md: 3 },
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
        ) : isFilteredView ? (
          /* ==============================================================
             MODE B: DEDICATED SEARCH / FILTERED CATEGORY VIEW
             ============================================================== */
          <Box>
            {/* Breadcrumb & Back to Home */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Breadcrumbs>
                <Link
                  component="button"
                  onClick={() => setSearchParams({})}
                  color="inherit"
                  underline="hover"
                  sx={{ cursor: 'pointer', border: 'none', background: 'none' }}
                >
                  Trang Chủ
                </Link>
                <Typography color="text.primary" sx={{ fontWeight: 600 }}>
                  {category ? `Bộ Sưu Tập ${category}` : `Kết quả tìm kiếm: "${searchQuery}"`}
                </Typography>
              </Breadcrumbs>

              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => setSearchParams({})}
                size="small"
                sx={{ borderRadius: 2 }}
              >
                Về Trang Chủ Đa Phân Khu
              </Button>
            </Box>

            {/* Horizontal Filter Pill Tabs */}
            <Box sx={{ mb: 4 }}>
              <CategoryFilter />
            </Box>

            {filteredProducts.length === 0 ? (
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
                  onClick={() => setSearchParams({})}
                  sx={{ borderRadius: 2.5 }}
                >
                  {t('catalog:resetFilters', 'Xóa bộ lọc & Về trang chủ')}
                </Button>
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
                  gap: { xs: 1.5, sm: 2.5, md: 3 },
                }}
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.productId} product={product} />
                ))}
              </Box>
            )}
          </Box>
        ) : (
          /* ==============================================================
             MODE A: MULTI-SECTION HOMEPAGE (MATCHING JEWELRY BENCHMARK)
             ============================================================== */
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 4, md: 6 } }}>
            {/* Section 1: Tuyệt Tác Mới Nhất (Featured Arrivals) */}
            {featuredItems.length > 0 && (
              <Box id="all-section">
                <SectionHeader
                  subtitle="New Creations"
                  title="Tuyệt Tác Chế Tác Mới Nhất"
                  description="Những sáng tạo kim hoàn độc bản vừa được hoàn thiện tại xưởng chế tác thủ công."
                  viewAllLink="/?category=all"
                  viewAllText="Xem tất cả sản phẩm"
                />
                <ProductCarousel products={featuredItems} />
              </Box>
            )}

            {/* Section 2: Nhẫn Kim Hoàn & Kim Cương (Rings Section) */}
            {ringItems.length > 0 && (
              <Box id="rings-section">
                <SectionHeader
                  subtitle="Solitaire & Diamond Rings"
                  title="Nhẫn Kim Hoàn & Kim Cương Tự Nhiên"
                  description="Tuyệt tác biểu trưng cho tình yêu vĩnh cửu và sự thành đạt, đính kim cương tự nhiên giác cắt chuẩn quốc tế."
                  viewAllLink="/?category=Rings"
                  viewAllText="Xem tất cả Nhẫn"
                />
                <ProductCarousel products={ringItems} />
              </Box>
            )}

            {/* Middle Editorial Breakout Banner (Chế Tác Vàng & Giữ Chỗ 15 Phút) */}
            <MiddleBanner />

            {/* Section 3: Dây Chuyền & Mặt Dây (Necklaces & Pendants Section) */}
            {necklaceItems.length > 0 && (
              <Box id="necklaces-section">
                <SectionHeader
                  subtitle="Haute Necklaces"
                  title="Dây Chuyền & Tuyệt Tác Mặt Đá Quý"
                  description="Nét duyên dáng thanh lịch tôn vinh vẻ đẹp quý phái, chế tác từ vàng 18K và đá quý thiên nhiên tuyển chọn."
                  viewAllLink="/?category=Necklaces"
                  viewAllText="Xem tất cả Dây Chuyền"
                />
                <ProductCarousel products={necklaceItems} />
              </Box>
            )}

            {/* Section 4: Vòng & Lắc Tay (Bracelets & Bangles Section) */}
            {braceletItems.length > 0 && (
              <Box id="bracelets-section">
                <SectionHeader
                  subtitle="Luxury Bangles & Tennis Bracelets"
                  title="Vòng & Lắc Tay Chế Tác Tinh Xảo"
                  description="Thiết kế ôm cổ tay mềm mại, kết hợp vàng đủ tuổi và kim cương tấm lấp lánh phản chiếu ánh sáng."
                  viewAllLink="/?category=Bracelets"
                  viewAllText="Xem tất cả Vòng & Lắc"
                />
                <ProductCarousel products={braceletItems} />
              </Box>
            )}

            {/* Section 5: Bông Tai Quý Phái (Earrings Section) */}
            {earringItems.length > 0 && (
              <Box id="earrings-section">
                <SectionHeader
                  subtitle="Chandelier & Stud Earrings"
                  title="Bông Tai Kim Cương & Khuyên Chùm"
                  description="Điểm nhấn rạng rỡ cho gương mặt với giác cắt đá quý chuẩn xác và cơ cấu chốt đeo an toàn độc quyền."
                  viewAllLink="/?category=Earrings"
                  viewAllText="Xem tất cả Bông Tai"
                />
                <ProductCarousel products={earringItems} />
              </Box>
            )}

            {/* Section 6: Vì Sao Khách Hàng Chọn Tiệm Vàng Kim Ngân Phát (Trust Pillars) */}
            <TrustPillars />

            {/* Section 7: Không Gian Showroom Trải Nghiệm & Bản Đồ Google Maps */}
            <ShowroomMapSection />
          </Box>
        )}
      </Container>
    </Box>
  )
}
