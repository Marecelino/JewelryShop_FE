# 04. Kiến Trúc Kỹ Thuật Frontend (Frontend Architecture)

> **Dự án**: JewelryShop Frontend Client  
> **Trạng thái**: Kế hoạch & Kiến trúc kỹ thuật (Planning Only)  
> **Ngăn xếp công nghệ mục tiêu**: Vite `^8.3.5` + React `^19.3.1` + TypeScript `~7.0.2`  
> **Thư viện UI & Styling**: MUI Material `^9.5.0` + Emotion `^11.14`  
> **Quản lý Server State**: TanStack Query (React Query) `^5.105.0`  
> **Biểu mẫu & Xác thực**: React Hook Form `^7.91.0` + Zod `^4.6.7`  
> **Điều hướng & Đa ngôn ngữ**: React Router DOM `^7.18.5` + i18next `^26.5.11` + react-i18next `^17.1.9`

---

## 1. Cấu Trúc Thư Mục Dự Án Hướng Tính Năng (Feature-Based Directory Structure)

Dự án frontend được tổ chức tại thư mục `jewelryshop-frontend/` (hoàn toàn tách biệt khỏi các dịch vụ Maven backend), tuân thủ mô hình **Feature-Driven Architecture**:

```
jewelryshop-frontend/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── api/                              # Tầng giao tiếp mạng & cấu hình HTTP client
│   │   ├── client.ts                     # Axios client, cấu hình baseURL, interceptors
│   │   ├── endpoints.ts                  # Hằng số đường dẫn API qua Gateway
│   │   └── errorHandler.ts               # Bộ chuyển đổi ApiErrorResponse từ backend
│   ├── assets/                           # Tài nguyên tĩnh (Placeholder trang sức, vector)
│   │   ├── illustrations/                # Vector minh họa trang sức theo danh mục
│   │   └── brands/                       # Logo thương hiệu
│   ├── components/                       # UI components dùng chung toàn ứng dụng
│   │   ├── feedback/                     # LoadingSkeleton, ErrorAlert, ConfirmDialog
│   │   ├── layout/                       # AppHeader, AppFooter, Sidebar, Navigation
│   │   ├── display/                      # PriceTag, StatusChip, StockBadge
│   │   └── guards/                       # ProtectedRoute, RoleGuard
│   ├── features/                         # Các module tính năng nghiệp vụ độc lập
│   │   ├── auth/                         # Đăng ký, Đăng nhập, Hồ sơ cá nhân
│   │   │   ├── api/                      # Các hooks useLogin, useRegister, useCurrentUser
│   │   │   ├── components/               # LoginForm, RegisterForm, UserProfileCard
│   │   │   ├── schemas/                  # Zod schema auth (validation rules)
│   │   │   └── store/                    # useAuthStore (lưu trữ token, claims)
│   │   ├── catalog/                      # Danh mục & Chi tiết trang sức
│   │   │   ├── api/                      # useProductsQuery, useProductDetailQuery
│   │   │   ├── components/               # ProductGrid, ProductCard, CategoryFilter
│   │   │   └── types/                    # Kiểu dữ liệu bổ trợ cho catalog
│   │   ├── cart/                         # Giỏ hàng Client-side
│   │   │   ├── components/               # CartDrawer, CartItemRow, CartSummary
│   │   │   └── store/                    # useCartStore (LocalStorage sync, max 20 items)
│   │   ├── orders/                       # Đặt hàng, Xem lịch sử, Hủy đơn
│   │   │   ├── api/                      # useCreateOrderMutation, useOrdersQuery, useCancelOrderMutation
│   │   │   ├── components/               # OrderListTable, OrderDetailCard, CancelOrderModal
│   │   │   └── utils/                    # generateIdempotencyKey (UUID v4)
│   │   └── inventory/                    # Quản trị kho món vật lý (Admin)
│   │       ├── api/                      # useInventoryItemsQuery, useCreateInventoryItemMutation
│   │       └── components/               # InventoryTable, CreateItemModal, ItemDetailDrawer
│   ├── hooks/                            # Custom React Hooks dùng chung
│   │   ├── useDebounce.ts                # Hoãn gõ phím khi tìm kiếm
│   │   └── useNotification.ts            # Quản lý hiển thị Snackbar thông báo
│   ├── i18n/                             # Cấu hình đa ngôn ngữ Tiếng Việt & Tiếng Anh
│   │   ├── config.ts                     # Khởi tạo i18next instance
│   │   └── locales/
│   │       ├── vi/                       # Bản dịch Tiếng Việt (common, catalog, order,...)
│   │       └── en/                       # Bản dịch Tiếng Anh
│   ├── layouts/                          # Khung giao diện chính
│   │   ├── RootLayout.tsx                # Layout bao ngoài kèm Header, Footer, Toast
│   │   ├── StorefrontLayout.tsx          # Layout dành cho khách mua sắm
│   │   └── AdminLayout.tsx               # Layout dành cho bảng điều khiển quản trị
│   ├── routes/                           # Hệ thống định tuyến ứng dụng
│   │   └── index.tsx                     # React Router v7 Route tree
│   ├── theme/                            # Hệ thống Theme MUI & Token thẩm mỹ
│   │   ├── palette.ts                    # Bảng màu Dark/Light Luxury
│   │   ├── typography.ts                 # Font Playfair Display & Plus Jakarta Sans
│   │   ├── components.ts                 # Override style mặc định của Button, Card, Dialog
│   │   └── index.ts                      # createTheme instance
│   ├── types/                            # Kiểu dữ liệu TypeScript đồng bộ 1:1 với DTO Backend
│   │   ├── auth.types.ts
│   │   ├── product.types.ts
│   │   ├── order.types.ts
│   │   ├── inventory.types.ts
│   │   └── api.types.ts                  # ApiErrorResponse, PagedResult
│   ├── utils/                            # Các hàm tiện ích thuần túy
│   │   ├── formatCurrency.ts             # Định dạng tiền tệ VND chuẩn quốc tế
│   │   └── formatDate.ts                 # Định dạng ngày giờ UTC+7
│   ├── App.tsx                           # Provider Container (QueryClient, Theme, Router)
│   ├── main.tsx                          # Điểm gắn kết React DOM
│   └── vite-env.d.ts
├── .oxlintrc.json
├── package.json
├── tsconfig.json
└── vite.config.ts                        # Cấu hình dev server proxy đến Gateway :8085
```

---

## 2. Phân Tầng Trách Nhiệm Thành Phần (Component Responsibilities & Composition)

1. **Page Components (Tầng Trang - Nằm tại thư mục `routes/` hoặc `features/*/pages`)**:
   - Trách nhiệm duy nhất: Đọc tham số URL (`useParams`, `useSearchParams`), kích hoạt các hook TanStack Query, xử lý trạng thái Loading/Error cấp trang, truyền dữ liệu sạch xuống các Presentational Components.
   - Không chứa mã JSX styling phức tạp hay logic render thẻ chi tiết.
2. **Feature Components (Tầng Thành Phần Tính Năng)**:
   - Các khối giao diện cụ thể như `ProductCard`, `CartDrawer`, `OrderListTable`.
   - Đảm nhận việc trình bày dữ liệu, lắng nghe sự kiện của người dùng và gọi các hàm callback được truyền vào từ Container hoặc Store.
3. **Shared Primitive Components (Tầng Dùng Chung)**:
   - Được xây dựng trên nền MUI: `PriceTag`, `StockBadge`, `ConfirmDialog`.
   - Là các **Pure Functional Components**: Không phụ thuộc vào trạng thái server, không gọi API, hoàn toàn kiểm thử được bằng Unit Test độc lập.

---

## 3. Kiến Trúc Quản Lý Trạng Thái Toàn Diện (State Management Taxonomy)

Hệ thống phân tách rạch ròi 4 loại trạng thái theo khuyến nghị kỹ thuật hiện đại:

| Loại Trạng Thái | Công Nghệ Quản Lý | Phạm Vi Áp Dụng | Chiến Lược Lưu Trữ & Đồng Bộ |
| :--- | :--- | :--- | :--- |
| **Server State** | **TanStack Query (React Query v5)** | Danh mục sản phẩm, chi tiết sản phẩm, tồn kho, danh sách đơn hàng, danh mục kho vật lý | Caching tự động, stale-time 5 phút cho catalog, background refetch, cơ chế retry thông minh, quản lý trạng thái pending/error |
| **Client Auth State** | **`useAuthStore`** (External Store / Zustand) | Access Token, thời điểm hết hạn `expiresAt`, thông tin giải mã từ claims (`userId`, `username`, `roles`) | Lưu trong bộ nhớ runtime và đồng bộ vào `localStorage` để duy trì phiên khi F5; xóa sạch khi đăng xuất |
| **Client Cart State** | **`useCartStore`** (External Store / Zustand) | Danh sách sản phẩm trong giỏ (`productId`, `quantity`, snapshot `productName`, `price`) | Lưu trong `localStorage` do backend không có API giỏ hàng. Kiểm tra ràng buộc tối đa 10 cái/món và tổng số lượng <= 20 món |
| **URL State** | **React Router (`useSearchParams`)** | Từ khóa tìm kiếm, thể loại lọc (`category`), số trang (`page`), kích thước trang (`size`), thứ tự sắp xếp (`sort`) | Nguồn sự thật duy nhất (Single Source of Truth) cho trạng thái duyệt catalog, cho phép người dùng chia sẻ link hoặc bookmark |
| **Form State** | **React Hook Form + Zod** | Biểu mẫu đăng ký, đăng nhập, tạo sản phẩm, tạo món kho vật lý | Quản lý giá trị input, touched state, hiển thị lỗi validation tức thì trước khi submit lên server |

---

## 4. Tầng Mạng & Tích Hợp API Gateway (Networking & Gateway Integration)

### 4.1. Giải pháp vượt rào cản CORS trong môi trường phát triển (Vite Reverse Proxy)
Do API Gateway (`api-gateway`) hiện tại **chưa bật CORS**, nếu trình duyệt từ cổng `5173` gửi trực tiếp đến `http://localhost:8085`, yêu cầu preflight `OPTIONS` sẽ bị trình duyệt chặn ngay lập tức.
Giải pháp tối ưu và an toàn: Cấu hình Reverse Proxy trực tiếp trong `vite.config.ts`:

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8085', // Trỏ trực tiếp về API Gateway
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
```

### 4.2. Khởi tạo Axios Client & Cơ Chế Interceptors
Tệp `src/api/client.ts` đóng vai trò cổng trung chuyển duy nhất cho toàn bộ HTTP request:

```typescript
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../features/auth/store/authStore';
import { ApiErrorResponse } from '../types/api.types';

export const apiClient = axios.create({
  baseURL: '/api/v1', // Đi qua Vite proxy chuyển tiếp đến Gateway
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Tự động đính kèm Bearer Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Chuẩn hóa phản hồi lỗi và xử lý 401
apiClient.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ -> Xóa phiên và chuyển về /login
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);
```

### 4.3. Quản lý Idempotency Key khi tạo đơn hàng
Để đảm bảo nguyên tắc idempotency an toàn mạng của Order Service (`POST /api/v1/orders`), frontend xây dựng helper chuyên dụng:
- Sử dụng chuẩn `crypto.randomUUID()` để sinh chuỗi UUID v4 (độ dài 36 ký tự, thỏa mãn điều kiện `length <= 100` của `OrderController.java`).
- Gắn vào tiêu đề `Idempotency-Key` mỗi khi gọi mutation tạo đơn hàng.

---

## 5. Hệ Thống Định Kiểu TypeScript Đồng Bộ 1:1 Với Backend DTOs

Mọi kiểu dữ liệu trong thư mục `src/types/` đều phản ánh chính xác cấu trúc Java Record / Class của backend.

### 5.1. Kiểu dữ liệu Xác thực (`src/types/auth.types.ts`)
```typescript
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string; // 3 - 50 chars
  email: string;
  password: string; // 6 - 72 chars
}

export interface LoginResponse {
  accessToken: string;
  tokenType: 'Bearer';
  expiresAt: string; // ISO 8601 Instant (ví dụ: "2026-10-28T08:15:00Z")
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### 5.2. Kiểu dữ liệu Sản phẩm & Tồn kho (`src/types/product.types.ts`)
```typescript
export interface InventorySummary {
  availableQuantity: number;
  reservedQuantity: number;
  soldQuantity: number;
  damagedQuantity: number;
}

export interface ProductResponse {
  productId: number;
  productName: string;
  category: string;
  material: string;
  gemstone?: string | null;
  price: number;
  description?: string | null;
  createdAt: string;
  active: boolean;
  inventory: InventorySummary | null; // Null nghĩa là lỗi kết nối tồn kho, không phải hết hàng
}

export interface CreateProductRequest {
  productName: string;
  category: string;
  material: string;
  gemstone?: string;
  price: number;
  description?: string;
}

export interface UpdateProductRequest extends CreateProductRequest {
  active: boolean;
}
```

### 5.3. Kiểu dữ liệu Đơn hàng (`src/types/order.types.ts`)
```typescript
export type OrderStatus =
  | 'PENDING_RESERVATION'
  | 'AWAITING_PAYMENT'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'RESERVATION_FAILED'
  | 'CANCELLATION_PENDING'
  | 'RESERVATION_EXPIRED'
  | 'RECONCILIATION_REQUIRED';

export type OrderItemStatus =
  | 'PENDING_RESERVATION'
  | 'RESERVED'
  | 'COMMITTED'
  | 'RELEASED'
  | 'RESERVATION_FAILED'
  | 'EXPIRED'
  | 'RECONCILIATION_REQUIRED';

export interface OrderItemRequest {
  productId: number;
  quantity: number; // 1..10
}

export interface CreateOrderRequest {
  items: OrderItemRequest[]; // Tổng items <= 20
}

export interface OrderItemResponse {
  orderItemId: number;
  orderItemReference: string;
  productId: number;
  productNameSnapshot: string;
  unitPrice: number;
  reservationId?: number | null;
  inventoryItemId?: number | null;
  status: OrderItemStatus;
  retryCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderResponse {
  orderId: number;
  orderReference: string;
  userId: number;
  status: OrderStatus;
  totalAmount: number;
  idempotencyKey?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItemResponse[];
}
```

### 5.4. Kiểu dữ liệu Món kho vật lý & Phản hồi lỗi API (`src/types/inventory.types.ts`, `src/types/api.types.ts`)
```typescript
export type InventoryItemStatus = 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'DAMAGED';

export interface InventoryItemResponse {
  inventoryItemId: number;
  productId: number;
  barcode: string;
  serialNumber?: string;
  actualWeightGrams?: number;
  actualGoldPurityPercent?: number;
  certificateNumber?: string;
  locationCode?: string;
  status: InventoryItemStatus;
  reservationReference?: string;
  reservedUntil?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInventoryItemRequest {
  productId: number;
  barcode: string;
  serialNumber?: string;
  actualWeightGrams?: number;
  actualGoldPurityPercent?: number;
  certificateNumber?: string;
  locationCode?: string;
}

export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  validationErrors?: Record<string, string>; // Map các lỗi trường cụ thể từ backend
}
```

---

## 6. Chiến Lược Kiểm Thử Toàn Diện (Testing Strategy)

1. **Unit & Component Testing (Vitest + Testing Library)**:
   - Kiểm thử tính thuần túy của các hàm tiện ích (`formatCurrency`, `formatDate`, `generateIdempotencyKey`).
   - Kiểm thử Render UI, kiểm tra tương tác bàn phím, khả năng đóng mở Modal, và kiểm tra tính hợp lệ của Zod schemas.
2. **API Mocking (Mock Service Worker - MSW)**:
   - Giả lập chính xác phản hồi của API Gateway trên cổng `8085` cho môi trường test mà không cần khởi động toàn bộ 5 dịch vụ Spring Boot và SQL Server.
   - Giả lập các tình huống biên: Downstream Inventory Service lỗi `503`, Hết hàng `409 Conflict`, Giữ chỗ chậm `202 Accepted`.
3. **End-to-End Testing (Playwright)**:
   - Kịch bản E2E số 1: Khách hàng Đăng nhập -> Duyệt Catalog -> Xem chi tiết trang sức -> Thêm vào giỏ -> Tạo đơn giữ chỗ -> Nhận mã tham chiếu đơn -> Hủy đơn hàng.
   - Kịch bản E2E số 2: Quản trị viên Đăng nhập -> Tạo sản phẩm mới -> Đăng ký mã vạch món vật lý vào kho -> Kiểm tra sản phẩm xuất hiện trên Catalog kèm số lượng khả dụng.

---

## 7. Tác Động Của Quy Tắc React & Kỹ Năng Đến Quyết Định Kiến Trúc

1. **Tuân thủ Official React Rules (React 19)**:
   - **Tính thuần túy (Component Purity)**: Không thay đổi biến nằm ngoài phạm vi component khi đang render.
   - **Kỷ luật `useEffect`**: Không dùng Effect để tính toán giá trị phát sinh (Derived State - ví dụ tổng tiền giỏ hàng tính trực tiếp từ mảng items trong component).
   - **Quy tắc Hooks**: Không gọi Hook trong vòng lặp hoặc câu lệnh điều kiện.
2. **Quy tắc Thiết kế Giao diện Web (Vercel Web Interface Guidelines)**:
   - Loại bỏ giật giật giao diện (Layout Shifts): Đặt chiều cao cố định cho khối Skeleton sản phẩm trước khi dữ liệu trả về.
   - Hiển thị rõ tiêu điểm bàn phím (Focus Ring Visible): Không bao giờ ẩn `outline: none` mà luôn cung cấp viền focus tương phản cao.
   - Tính ổn định khi thao tác: Nút bấm khi click chuyển sang trạng thái pending không làm nhảy vị trí các nút lân cận.

