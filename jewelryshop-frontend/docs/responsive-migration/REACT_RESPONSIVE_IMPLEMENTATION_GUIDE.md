# HƯỚNG DẪN KỸ THUẬT TRIỂN KHAI RESPONSIVE DÀNH CHO CODING AGENT & DEVELOPER (REACT 19 + MUI v9)

> **Mã tài liệu:** `RIG-REACT-03`  
> **Dự án áp dụng:** `SOURCE_REACT` (`D:\java\JewelryShop_FE\jewelryshop-frontend`)  
> **Mục tiêu:** Cung cấp bộ quy chuẩn lập trình, quy trình làm việc và 10 mẫu code component thực tế chuẩn xác, sẵn sàng copy-paste và tích hợp, đảm bảo mọi màn hình tuân thủ triệt để Responsive Design System đã ban hành.

---

## 1. Quy trình chuẩn khi triển khai Responsive trong React

Khi được giao nhiệm vụ tạo mới hoặc tinh chỉnh responsive cho một màn hình/component trong `SOURCE_REACT`, Coding Agent và Developer **bắt buộc tuân thủ 5 bước**:

1. **Khảo sát Component & Phân tầng Viewport:**
   - Xác định rõ hành vi ở 3 trạng thái chính: Mobile (`xs: 0-599px`), Tablet (`sm/md: 600-1199px`), và Desktop (`lg/xl: 1200px+`).
2. **Áp dụng tư duy Mobile-First:**
   - Luôn viết giá trị cơ sở cho `xs` trước, sau đó chỉ bổ sung các override khi màn hình mở rộng sang `sm`, `md`, `lg`.
3. **Sử dụng MUI Responsive Object Syntax (`sx`):**
   - Tuyệt đối không tạo file `.css` hay `.scss` riêng chỉ để viết `@media (max-width: ...)`.
   - Sử dụng cú pháp đối tượng của MUI: `sx={{ property: { xs: val1, md: val2, lg: val3 } }}`.
4. **Kiểm tra Touch Target & Safe Area:**
   - Mọi nút bấm, link trên di động phải có `minHeight: 44px, minWidth: 44px`.
   - Các thanh sticky đáy phải tính đến `env(safe-area-inset-bottom)`.
5. **Kiểm thử đa thiết bị:**
   - Kiểm tra trực tiếp trên DevTools ở các kích thước tối thiểu: 320px, 360px, 390px, 768px, 1024px, 1440px.

---

## 2. Quy tắc Nên làm (DOs) & Cần tránh (DONTs)

### ✅ NÊN LÀM (DOs):
- **DO 1:** Sử dụng `width: '100%'` kết hợp `maxWidth: ...` thay vì gán `width` cứng bằng pixel.
- **DO 2:** Dùng `aspectRatio` CSS cho toàn bộ ảnh sản phẩm (`aspectRatio: '4/5'` hoặc `'1/1'`) đi kèm `objectFit: 'cover'`.
- **DO 3:** Dùng `useMediaQuery(theme.breakpoints.down('sm'))` khi cần render điều kiện cấu trúc DOM khác nhau giữa mobile và desktop (ví dụ Drawer thay cho Header Menu).
- **DO 4:** Dùng đơn vị tương đối (rem, %, clamp, vh/dvh) cho kích thước chữ và chiều cao màn hình.
- **DO 5:** Bọc mọi bảng dữ liệu `<Table>` trong box có `overflowX: 'auto'` với `minWidth: 700px`.

### ❌ CẦN TRÁNH (DONTs):
- **DONT 1 (Lỗi lớn từ Vue cũ):** Không hardcode pixel width (như `width: 500px` hay `width: 350px`) gây tràn viền trên màn hình 360px.
- **DONT 2:** Không dùng User-Agent sniffing để render logic responsive (như `@nuxtjs/device` ở source cũ).
- **DONT 3:** Không gắn `window.addEventListener('resize')` mà thiếu debounce/throttle.
- **DONT 4:** Không dùng `!important` trong cú pháp `sx` trừ khi bắt buộc phải can thiệp vào CSS của bên thứ ba.
- **DONT 5:** Không giấu nút mua hàng hoặc thông tin giá sản phẩm đằng sau hiệu ứng hover của chuột.

---

## 3. Bộ 10 Mẫu Code Component Responsive Thực Tế (Production-Ready)

### Ví dụ 1: Responsive Layout Container
Khung chứa trang thích ứng, co giãn padding viền thông minh theo từng viewport.

```tsx
import React from 'react'
import { Container, ContainerProps } from '@mui/material'

interface ResponsiveContainerProps extends ContainerProps {
  children: React.ReactNode
}

/**
 * ResponsiveContainer chuẩn cho toàn bộ Storefront
 * - xs: padding 16px (2)
 * - sm: padding 24px (3)
 * - md: padding 32px (4)
 * - lg+: padding 40px (5), max-width khống chế 1440px
 */
export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({ children, sx, ...props }) => {
  return (
    <Container
      maxWidth="xl"
      disableGutters
      sx={{
        px: { xs: 2, sm: 3, md: 4, lg: 5 },
        maxWidth: { xl: '1440px' },
        mx: 'auto',
        width: '100%',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Container>
  )
}
```
- **Giải thích hoạt động:** `disableGutters` được bật để loại bỏ padding mặc định 24px cứng nhắc của MUI, thay bằng thang đo 8pt co giãn mượt mà `{ xs: 2, sm: 3, md: 4, lg: 5 }`.
- **Behavior:** Trên iPhone 13 (390px), nội dung cách 2 bên lề đúng 16px, tận dụng tối đa màn hình. Trên màn hình desktop 1920px, nội dung được gom giữa 1440px không bị kéo dài bất thường.

---

### Ví dụ 2: Responsive Header (AppBar)
Thanh điều hướng đỉnh trang với hiệu ứng kính mờ (Frosted glass), tự động co giãn độ cao và ẩn/hiện thành phần.

```tsx
import React from 'react'
import { AppBar, Toolbar, Box, Typography, IconButton, Button } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import { Link as RouterLink } from 'react-router-dom'
import { brandColors } from '../theme/palette'

interface HeaderProps {
  onOpenMobileMenu: () => void
  cartItemCount: number
  onOpenCart: () => void
}

export const ResponsiveHeader: React.FC<HeaderProps> = ({ onOpenMobileMenu, cartItemCount, onOpenCart }) => {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'rgba(250, 248, 245, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${brandColors.hairline}`,
        zIndex: (theme) => theme.zIndex.appBar,
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          height: { xs: 64, md: 76 }, // 64px trên mobile, 76px trên desktop
          px: { xs: 2, sm: 3, md: 5 },
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Nút Hamburger chỉ hiện trên Mobile/Tablet (dưới md) */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconButton
            onClick={onOpenMobileMenu}
            aria-label="Mở menu"
            sx={{
              display: { md: 'none' },
              minWidth: 44,
              minHeight: 44,
              color: brandColors.primary,
            }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            component={RouterLink}
            to="/"
            variant="h1"
            sx={{
              textDecoration: 'none',
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: { xs: '1.2rem', sm: '1.35rem', md: '1.5rem' },
              fontWeight: 700,
              color: brandColors.primary,
              letterSpacing: '0.03em',
            }}
          >
            KIM NGÂN PHÁT
          </Typography>
        </Box>

        {/* Menu ngang chỉ hiện trên Desktop (từ md trở lên) */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 4 }}>
          <Button component={RouterLink} to="/" sx={{ color: brandColors.textPrimary, fontWeight: 500 }}>
            Trang Chủ
          </Button>
          <Button component={RouterLink} to="/collection" sx={{ color: brandColors.textPrimary, fontWeight: 500 }}>
            Bộ Sưu Tập
          </Button>
          <Button component={RouterLink} to="/about" sx={{ color: brandColors.textPrimary, fontWeight: 500 }}>
            Về Chúng Tôi
          </Button>
        </Box>

        {/* Khu vực Action góc phải */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            onClick={onOpenCart}
            aria-label="Giỏ hàng"
            sx={{ minWidth: 44, minHeight: 44, color: brandColors.primary }}
          >
            <ShoppingBagOutlinedIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
```

---

### Ví dụ 3: Mobile Navigation Drawer (Off-Canvas Menu)
Menu trượt an toàn, xử lý kích thước mượt mà trên mọi thiết bị di động mà không gây tràn ngang.

```tsx
import React from 'react'
import { Drawer, Box, Typography, IconButton, List, ListItem, ListItemButton, ListItemText, Divider } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { Link as RouterLink } from 'react-router-dom'
import { brandColors } from '../theme/palette'

interface MobileDrawerProps {
  open: boolean
  onClose: () => void
}

export const MobileNavigationDrawer: React.FC<MobileDrawerProps> = ({ open, onClose }) => {
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: 'min(320px, 85vw)', // Tự co lại nếu màn hình < 320px
            backgroundColor: brandColors.background,
            boxShadow: '0 16px 40px rgba(47, 41, 37, 0.16)',
            pt: 'env(safe-area-inset-top, 0px)',
            pb: 'env(safe-area-inset-bottom, 16px)',
          },
        },
      }}
    >
      <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h3" sx={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700 }}>
          KIM NGÂN PHÁT
        </Typography>
        <IconButton onClick={onClose} aria-label="Đóng menu" sx={{ minWidth: 44, minHeight: 44 }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List sx={{ px: 1, py: 1.5 }}>
        {['Trang Chủ', 'Bộ Sưu Tập Nhẫn', 'Dây Chuyền Kim Cương', 'Vòng & Lắc Tay', 'Liên Hệ'].map((item, idx) => (
          <ListItem key={idx} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={RouterLink}
              to="/"
              onClick={onClose}
              sx={{ minHeight: 48, borderRadius: 2 }}
            >
              <ListItemText primary={item} primaryTypographyProps={{ fontWeight: 500, fontSize: '0.95rem' }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
}
```

---

### Ví dụ 4: Responsive Grid Danh mục Sản phẩm
Grid tự động thích ứng số cột và khoảng cách (gap) theo tỷ lệ vàng.

```tsx
import React from 'react'
import { Box } from '@mui/material'

interface ResponsiveProductGridProps {
  children: React.ReactNode
}

/**
 * Responsive Grid:
 * - xs: 2 cột, gap 12px (1.5)
 * - sm: 2 cột rộng, gap 16px (2)
 * - md: 3 cột, gap 24px (3)
 * - lg+: 4 cột, gap 28px (3.5)
 */
export const ResponsiveProductGrid: React.FC<ResponsiveProductGridProps> = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(2, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
        gap: { xs: 1.5, sm: 2, md: 3, lg: 3.5 },
        width: '100%',
        alignItems: 'stretch',
      }}
    >
      {children}
    </Box>
  )
}
```

---

### Ví dụ 5: Responsive Product Card với Native Aspect Ratio
Thẻ sản phẩm chuẩn tỷ lệ 4:5, loại bỏ hoàn toàn các lỗi méo ảnh của source cũ.

```tsx
import React from 'react'
import { Card, CardContent, Typography, Box, Chip } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { brandColors } from '../theme/palette'
import { formatVND } from '../utils/formatCurrency'

interface ProductCardProps {
  id: number
  name: string
  category: string
  price: number
  imageUrl?: string
  inStock: boolean
}

export const ResponsiveProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  category,
  price,
  imageUrl,
  inStock,
}) => {
  return (
    <Card
      component={RouterLink}
      to={`/products/${id}`}
      sx={{
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: { xs: 2.5, md: 3.5 },
        border: `1px solid ${brandColors.border}`,
        backgroundColor: brandColors.surface,
        transition: 'transform 220ms ease, box-shadow 220ms ease',
        '&:hover': {
          transform: { md: 'translateY(-4px)' },
          boxShadow: { md: '0 12px 24px -6px rgba(47, 41, 37, 0.12)' },
        },
      }}
    >
      {/* Khung chứa ảnh tỷ lệ vàng 4:5 */}
      <Box sx={{ position: 'relative', width: '100%', aspectRatio: '4/5', overflow: 'hidden' }}>
        <Box
          component="img"
          src={imageUrl || '/placeholder-jewelry.jpg'}
          alt={name}
          loading="lazy"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 360ms ease',
            '&:hover': { transform: { md: 'scale(1.05)' } },
          }}
        />
        <Chip
          label={inStock ? 'Sẵn Hàng' : 'Hết Hàng'}
          size="small"
          sx={{
            position: 'absolute',
            top: { xs: 8, md: 12 },
            right: { xs: 8, md: 12 },
            fontSize: '0.7rem',
            height: 22,
            backgroundColor: inStock ? 'rgba(40, 167, 69, 0.9)' : 'rgba(108, 117, 125, 0.9)',
            color: '#FFFFFF',
            backdropFilter: 'blur(4px)',
          }}
        />
      </Box>

      {/* Thông tin card */}
      <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 2.5 }, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="caption" sx={{ color: brandColors.secondary, textTransform: 'uppercase', fontWeight: 600 }}>
          {category}
        </Typography>
        <Typography
          variant="h3"
          sx={{
            fontSize: { xs: '0.875rem', sm: '1rem', md: '1.05rem' },
            fontWeight: 600,
            mt: 0.5,
            mb: 1,
            color: brandColors.textPrimary,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {name}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 700,
            color: brandColors.primary,
            fontSize: { xs: '0.95rem', md: '1.1rem' },
            mt: 'auto',
          }}
        >
          {formatVND(price)}
        </Typography>
      </CardContent>
    </Card>
  )
}
```

---

### Ví dụ 6: Responsive Typography Component
Mẫu tiêu đề trang sử dụng fluid typography, tự động cân đối kích thước mà không làm tràn chữ trên mobile.

```tsx
import React from 'react'
import { Box, Typography } from '@mui/material'
import { brandColors } from '../theme/palette'

interface SectionHeaderProps {
  eyebrow?: string
  title: string
  subtitle?: string
}

export const ResponsiveSectionHeader: React.FC<SectionHeaderProps> = ({ eyebrow, title, subtitle }) => {
  return (
    <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4, md: 6 } }}>
      {eyebrow && (
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            color: brandColors.secondary,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            mb: 0.5,
          }}
        >
          {eyebrow}
        </Typography>
      )}
      <Typography
        variant="h2"
        sx={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontSize: 'clamp(1.5rem, 2.5vw + 0.8rem, 2.5rem)',
          fontWeight: 600,
          color: brandColors.primary,
          lineHeight: 1.2,
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          variant="body1"
          sx={{
            maxWidth: 600,
            mx: 'auto',
            mt: 1.5,
            color: brandColors.textSecondary,
            fontSize: { xs: '0.875rem', md: '1rem' },
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  )
}
```

---

### Ví dụ 7: Responsive Filter & Search Bar
Khắc phục triệt để lỗi hardcoded `width: 350px` của Vue cũ: Form lọc co giãn $100\%$, hỗ trợ cuộn ngang danh mục trên mobile.

```tsx
import React from 'react'
import { Box, TextField, InputAdornment, Chip } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { brandColors } from '../theme/palette'

interface FilterBarProps {
  searchQuery: string
  onSearchChange: (q: string) => void
  categories: string[]
  selectedCategory: string
  onSelectCategory: (cat: string) => void
}

export const ResponsiveFilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      {/* Ô tìm kiếm co giãn 100%, giới hạn tối đa 540px */}
      <Box sx={{ width: '100%', maxWidth: 540, mx: 'auto', mb: 2.5 }}>
        <TextField
          fullWidth
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm kiếm nhẫn, kim cương, vàng 18K..."
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: brandColors.secondary }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              backgroundColor: brandColors.surface,
              height: { xs: 44, md: 48 }, // Chiều cao tối ưu touch
            },
          }}
        />
      </Box>

      {/* Thanh chip danh mục: Cuộn ngang trên mobile, Căn giữa trên desktop */}
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          overflowX: 'auto',
          py: 0.5,
          px: { xs: 1, md: 0 },
          justifyContent: { xs: 'flex-start', md: 'center' },
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat
          return (
            <Chip
              key={cat}
              label={cat}
              onClick={() => onSelectCategory(cat)}
              sx={{
                flexShrink: 0,
                minHeight: 36,
                px: 1,
                fontSize: '0.85rem',
                fontWeight: isSelected ? 700 : 500,
                backgroundColor: isSelected ? brandColors.secondary : brandColors.surface,
                color: isSelected ? brandColors.textInverse : brandColors.textPrimary,
                border: `1px solid ${isSelected ? brandColors.secondary : brandColors.border}`,
                '&:hover': {
                  backgroundColor: isSelected ? brandColors.secondaryHover : 'rgba(176, 141, 87, 0.08)',
                },
              }}
            />
          )
        })}
      </Box>
    </Box>
  )
}
```

---

### Ví dụ 8: Adaptive Responsive Modal (Dialog)
Kế thừa tinh hoa của component Vue `SingleSelectDialog.vue`: Modal full-screen/bottom-sheet trên mobile, và hộp thoại nổi cân đối trên desktop.

```tsx
import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
  Box,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

interface AdaptiveModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  onSubmit: () => void
}

export const AdaptiveResponsiveModal: React.FC<AdaptiveModalProps> = ({
  open,
  onClose,
  title,
  children,
  onSubmit,
}) => {
  const theme = useTheme()
  // Breakpoint kích hoạt chế độ toàn màn hình trên mobile (<600px)
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isMobile}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: isMobile ? 0 : 3.5,
            m: isMobile ? 0 : 2,
            maxHeight: isMobile ? '100dvh' : '85vh',
            display: 'flex',
            flexDirection: 'column',
          },
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
        <Box sx={{ fontWeight: 700, fontSize: '1.25rem' }}>{title}</Box>
        <IconButton onClick={onClose} aria-label="Đóng" sx={{ minWidth: 44, minHeight: 44 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ flexGrow: 1, overflowY: 'auto', p: { xs: 2, sm: 3 } }}>
        {children}
      </DialogContent>

      <DialogActions sx={{ p: { xs: 2, sm: 2.5 }, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" sx={{ flex: { xs: 1, sm: 'none' }, minHeight: 44 }}>
          Hủy Bỏ
        </Button>
        <Button onClick={onSubmit} variant="contained" color="primary" sx={{ flex: { xs: 1, sm: 'none' }, minHeight: 44 }}>
          Xác Nhận
        </Button>
      </DialogActions>
    </Dialog>
  )
}
```

---

### Ví dụ 9: Responsive Data Table Container
Bảo vệ bảng quản trị khỏi tràn ngang hoặc vỡ layout trên thiết bị cảm ứng.

```tsx
import React from 'react'
import { Card, CardContent, Table, TableContainer } from '@mui/material'
import { brandColors } from '../theme/palette'

interface ResponsiveTableWrapperProps {
  children: React.ReactNode
  minWidth?: number
}

export const ResponsiveTableWrapper: React.FC<ResponsiveTableWrapperProps> = ({ children, minWidth = 750 }) => {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: { xs: 2, md: 3.5 },
        border: `1px solid ${brandColors.border}`,
        overflow: 'hidden',
        width: '100%',
      }}
    >
      <TableContainer
        sx={{
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch', // Cuộn quán tính mượt trên iOS
        }}
      >
        <Table sx={{ minWidth: minWidth }}>{children}</Table>
      </TableContainer>
    </Card>
  )
}
```

---

### Ví dụ 10: Responsive Footer
Dàn 4 cột trên desktop, tự động xếp chồng (stack) cân đối và căn giữa trên mobile.

```tsx
import React from 'react'
import { Box, Typography, Grid, Link, Divider } from '@mui/material'
import { brandColors } from '../theme/palette'
import { ResponsiveContainer } from './ResponsiveContainer'

export const ResponsiveFooter: React.FC = () => {
  return (
    <Box component="footer" sx={{ backgroundColor: '#201C19', color: brandColors.textInverse, pt: { xs: 6, md: 8 }, pb: 4 }}>
      <ResponsiveContainer>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',           // 1 cột trên mobile
              sm: 'repeat(2, 1fr)', // 2 cột trên tablet
              md: 'repeat(4, 1fr)', // 4 cột trên desktop
            },
            gap: { xs: 4, sm: 3, md: 4 },
            textAlign: { xs: 'center', sm: 'left' },
          }}
        >
          {/* Cột 1: Thông tin thương hiệu */}
          <Box>
            <Typography variant="h3" sx={{ fontFamily: '"Playfair Display", Georgia, serif', color: brandColors.accent, mb: 1.5 }}>
              KIM NGÂN PHÁT
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
              Tuyệt tác trang sức kim hoàn thủ công tinh xảo, đồng hành cùng đẳng cấp và sự thịnh vượng của bạn.
            </Typography>
          </Box>

          {/* Cột 2: Danh mục */}
          <Box>
            <Typography variant="h4" sx={{ color: '#FFFFFF', mb: 1.5, fontSize: '1rem', fontWeight: 600 }}>
              Bộ Sưu Tập
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {['Nhẫn Cưới & Cầu Hôn', 'Dây Chuyền Kim Cương', 'Bông Tai Quý Phái', 'Vòng Tay Phong Thủy'].map((item, i) => (
                <Link key={i} href="#" underline="hover" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
                  {item}
                </Link>
              ))}
            </Box>
          </Box>

          {/* Cột 3: Hỗ trợ khách hàng */}
          <Box>
            <Typography variant="h4" sx={{ color: '#FFFFFF', mb: 1.5, fontSize: '1rem', fontWeight: 600 }}>
              Dịch Vụ Khách Hàng
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {['Chính Sách Thu Đổi', 'Bảo Hành & Làm Mới', 'Bảng Giá Vàng Hôm Nay', 'Hướng Dẫn Đo Size Nhẫn'].map((item, i) => (
                <Link key={i} href="#" underline="hover" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
                  {item}
                </Link>
              ))}
            </Box>
          </Box>

          {/* Cột 4: Showroom & Liên hệ */}
          <Box>
            <Typography variant="h4" sx={{ color: '#FFFFFF', mb: 1.5, fontSize: '1rem', fontWeight: 600 }}>
              Showroom Trung Tâm
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
              Số 128 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh
            </Typography>
            <Typography variant="body2" sx={{ color: brandColors.accent, fontWeight: 700 }}>
              Hotline: 1900 888 999
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 1.5,
            textAlign: 'center',
          }}
        >
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
            © 2026 Kim Ngân Phát Jewelry. Bảo lưu mọi quyền.
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
            Thiết kế đáp ứng đa nền tảng theo chuẩn RDS-REACT-02
          </Typography>
        </Box>
      </ResponsiveContainer>
    </Box>
  )
}
```

---
*Mọi đoạn mã trong tài liệu này đều đã được kiểm tra cú pháp, tương thích hoàn toàn với React 19, TypeScript và MUI v9 trong `SOURCE_REACT`.*

