import React, { useRef, useState, useEffect, useCallback } from 'react'
import { Box, IconButton } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import type { ProductResponse } from '../../../types/product.types'
import { ProductCard } from './ProductCard'
import { brandColors } from '../../../theme/palette'

interface ProductCarouselProps {
  products: ProductResponse[]
  autoScrollInterval?: number // default: 2000ms
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({
  products,
  autoScrollInterval = 2000,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  // Check scroll position to update arrow availability
  const checkScrollState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    setCanScrollLeft(scrollLeft > 8)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 8)
  }, [])

  useEffect(() => {
    checkScrollState()
    const el = scrollRef.current
    if (!el) return

    const handleScroll = () => {
      checkScrollState()
    }

    el.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', checkScrollState)

    return () => {
      el.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', checkScrollState)
    }
  }, [checkScrollState, products.length])

  // Get scroll step width (1 item card width + gap)
  const getScrollStep = useCallback((): number => {
    const el = scrollRef.current
    if (!el) return 280
    const firstCard = el.firstElementChild as HTMLElement | null
    if (firstCard) {
      // 1 card width + computed gap
      const style = window.getComputedStyle(el)
      const gap = parseFloat(style.columnGap || style.gap || '16') || 16
      return firstCard.offsetWidth + gap
    }
    return el.clientWidth / 4
  }, [])

  // Manual scroll Left
  const handleScrollLeft = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const step = getScrollStep()
    if (el.scrollLeft <= 10) {
      // Wrap to end
      el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' })
    } else {
      el.scrollBy({ left: -step, behavior: 'smooth' })
    }
  }, [getScrollStep])

  // Manual scroll Right
  const handleScrollRight = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const step = getScrollStep()
    const isAtEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 10
    if (isAtEnd) {
      // Quay lại 4 sản phẩm ban đầu
      el.scrollTo({ left: 0, behavior: 'smooth' })
    } else {
      el.scrollBy({ left: step, behavior: 'smooth' })
    }
  }, [getScrollStep])

  // Auto-scroll every 2 seconds
  useEffect(() => {
    if (isHovered) return
    // Only auto-scroll if there are more products than visible on screen
    if (products.length <= 2) return

    const timer = setInterval(() => {
      const el = scrollRef.current
      if (!el) return

      // Don't auto-scroll if container has no scrollable content
      if (el.scrollWidth <= el.clientWidth + 5) return

      const step = getScrollStep()
      const isAtEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 10

      if (isAtEnd) {
        // Quay lại 4 sản phẩm ban đầu và tiếp tục
        el.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        el.scrollBy({ left: step, behavior: 'smooth' })
      }
    }, autoScrollInterval)

    return () => clearInterval(timer)
  }, [isHovered, products.length, autoScrollInterval, getScrollStep])

  if (!products || products.length === 0) {
    return null
  }

  const hasMultiple = products.length > 2

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: '100%',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => {
        // Resume after 2.5s touch inactivity
        setTimeout(() => setIsHovered(false), 2500)
      }}
    >
      {/* Navigation Arrow Left < */}
      {hasMultiple && (
        <IconButton
          onClick={handleScrollLeft}
          aria-label="Cuộn sang trái"
          sx={{
            position: 'absolute',
            left: { xs: 0, sm: -14, md: -20 },
            top: '46%',
            transform: 'translateY(-50%)',
            zIndex: 4,
            width: { xs: 44, sm: 40, md: 44 },
            height: { xs: 44, sm: 40, md: 44 },
            minWidth: 44,
            minHeight: 44,
            backgroundColor: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(8px)',
            border: `1.5px solid ${brandColors.borderStrong}`,
            color: brandColors.primary,
            boxShadow: '0 4px 14px rgba(47, 41, 37, 0.16)',
            transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
            opacity: { xs: canScrollLeft ? 0.95 : 0.4, sm: 0.9 },
            '&:hover': {
              backgroundColor: '#FFFFFF',
              borderColor: brandColors.secondary,
              color: brandColors.secondary,
              boxShadow: '0 6px 20px rgba(176, 141, 87, 0.28)',
              transform: 'translateY(-50%) scale(1.08)',
              opacity: 1,
            },
          }}
        >
          <ChevronLeftIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
        </IconButton>
      )}

      {/* Horizontal Scrolling Track */}
      <Box
        ref={scrollRef}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: { xs: 1.5, sm: 2, md: 2.5 },
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
          WebkitOverflowScrolling: 'touch',
          py: 1,
          px: { xs: 0.5, sm: 0.75 },
          width: '100%',
        }}
      >
        {products.map((product) => (
          <Box
            key={product.productId}
            sx={{
              scrollSnapAlign: 'start',
              flexShrink: 0,
              minWidth: 0,
              // Responsive widths:
              // Desktop (lg): 4 products at once -> calc((100% - 3*gap) / 4)
              // Tablet landscape (md): 3 products at once -> calc((100% - 2*gap) / 3)
              // Tablet portrait (sm): 2 products at once -> calc((100% - 1*gap) / 2)
              // Mobile (xs): 2 products at once -> calc((100% - 1*gap) / 2)
              width: {
                xs: 'calc((100% - 12px) / 2)',
                sm: 'calc((100% - 16px) / 2)',
                md: 'calc((100% - 32px) / 3)',
                lg: 'calc((100% - 60px) / 4)',
              },
            }}
          >
            <ProductCard product={product} />
          </Box>
        ))}
      </Box>

      {/* Navigation Arrow Right > */}
      {hasMultiple && (
        <IconButton
          onClick={handleScrollRight}
          aria-label="Cuộn sang phải"
          sx={{
            position: 'absolute',
            right: { xs: 0, sm: -14, md: -20 },
            top: '46%',
            transform: 'translateY(-50%)',
            zIndex: 4,
            width: { xs: 44, sm: 40, md: 44 },
            height: { xs: 44, sm: 40, md: 44 },
            minWidth: 44,
            minHeight: 44,
            backgroundColor: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(8px)',
            border: `1.5px solid ${brandColors.borderStrong}`,
            color: brandColors.primary,
            boxShadow: '0 4px 14px rgba(47, 41, 37, 0.16)',
            transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
            opacity: { xs: canScrollRight ? 0.95 : 0.4, sm: 0.9 },
            '&:hover': {
              backgroundColor: '#FFFFFF',
              borderColor: brandColors.secondary,
              color: brandColors.secondary,
              boxShadow: '0 6px 20px rgba(176, 141, 87, 0.28)',
              transform: 'translateY(-50%) scale(1.08)',
              opacity: 1,
            },
          }}
        >
          <ChevronRightIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
        </IconButton>
      )}
    </Box>
  )
}
