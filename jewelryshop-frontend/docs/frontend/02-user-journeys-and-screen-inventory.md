# 02. Hành Trình Người Dùng & Danh Mục Màn Hình Giao Diện (User Journeys & Screen Inventory)

> **Dự án**: JewelryShop Frontend Architecture  
> **Trạng thái**: Kế hoạch & Phân tích chi tiết (Planning Only)  
> **Ràng buộc nghiệp vụ tối cao**:  
> 1. Chỉ đưa vào các màn hình được chứng minh có API backend hỗ trợ.  
> 2. **Tuyệt đối không có luồng giao hàng / vận chuyển**. Mọi giao dịch nhận tại cửa hàng.  
> 3. Không đưa vào form thanh toán thẻ / ví điện tử vì backend chưa có API thanh toán.

---

## 1. Các Vai Trò Người Dùng Được Hệ Thống Hỗ Trợ (Supported Personas)

Dựa trên cấu hình phân quyền tại `api-gateway/SecurityConfig.java` và cơ sở dữ liệu `login-service`:

### 1.1. Khách Vãng Lai (Guest / Unauthenticated Visitor)
- **Đặc điểm**: Chưa có tài khoản hoặc chưa đăng nhập.
- **Quyền hạn kỹ thuật**: Chỉ được gọi các endpoint Public:
  - `POST /api/v1/auth/register` (Tạo tài khoản mới)
  - `POST /api/v1/auth/login` (Xác thực lấy JWT)
- **Rào cản kỹ thuật thực tế**: Gateway hiện đang chặn `GET /api/v1/products` đối với người dùng chưa có role `USER` hoặc `ADMIN`. Do đó, khách vãng lai khi truy cập trang web sẽ thấy banner/modal yêu cầu đăng nhập trước khi có thể duyệt xem catalog chi tiết.

### 1.2. Khách Hàng Đã Xác Thực (Authenticated Customer - `ROLE_USER`)
- **Đặc điểm**: Đã đăng nhập, sở hữu Bearer JWT hợp lệ với claim `roles: ["USER"]`.
- **Hành vi được hỗ trợ trọn vẹn**:
  - Tra cứu hồ sơ cá nhân (`GET /api/v1/auth/me`).
  - Xem danh mục sản phẩm, tìm kiếm theo thể loại, xem chi tiết sản phẩm kèm số lượng tồn kho khả dụng (`GET /api/v1/products/**`).
  - Quản lý giỏ hàng trên trình duyệt (Client-side Cart).
  - Đặt hàng & giữ chỗ món trang sức vật lý với khóa Idempotency Key (`POST /api/v1/orders`).
  - Xem danh sách lịch sử đơn hàng của chính mình (`GET /api/v1/orders?page=...`).
  - Xem chi tiết đơn hàng, danh sách mã món vật lý đã giữ chỗ (`GET /api/v1/orders/{orderReference}`).
  - Yêu cầu hủy đơn hàng để giải phóng các món giữ chỗ (`POST /api/v1/orders/{orderReference}/cancellation`).

### 1.3. Quản Trị Viên Cửa Hàng (Store Administrator - `ROLE_ADMIN`)
- **Đặc điểm**: Tài khoản quản trị, sở hữu Bearer JWT với claim `roles: ["ADMIN"]`.
- **Hành vi được hỗ trợ toàn diện**:
  - Toàn bộ các quyền hạn của `ROLE_USER`.
  - Quản trị danh mục sản phẩm: Tạo sản phẩm mới (`POST /api/v1/products`), cập nhật thông tin (`PUT /api/v1/products/{id}`), ngừng kinh doanh / soft delete (`DELETE /api/v1/products/{id}`).
  - Quản trị kho vật lý: Xem danh sách từng món trang sức (`GET /api/v1/inventory-items`), xem barcode, serial, trọng lượng vàng, độ tuổi vàng (`GET /api/v1/inventory-items/{id}`), đăng ký món trang sức mới vào kho (`POST /api/v1/inventory-items`).
  - Giám sát toàn bộ đơn hàng: Xem danh sách đơn của tất cả khách hàng, lọc theo trạng thái, can thiệp hủy đơn khi cần thiết.

---

## 2. Bản Đồ Hành Trình Người Dùng Chi Tiết (End-to-End User Journeys)

### Journey 1: Đăng Ký, Đăng Nhập & Bắt Đầu Phiên Làm Việc
```mermaid
sequenceDiagram
    autonumber
    actor User as Khách Hàng
    participant UI as Giao Diện React
    participant GW as API Gateway (:8085)
    participant Auth as Login Service (:8083)

    User->>UI: Điền form Đăng Ký (/register)
    UI->>GW: POST /api/v1/auth/register
    GW->>Auth: Chuyển tiếp request
    Auth-->>GW: 201 Created (UserResponse)
    GW-->>UI: 201 Created
    UI->>User: Hiển thị thông báo thành công, chuyển sang /login

    User->>UI: Điền Email & Password (/login)
    UI->>GW: POST /api/v1/auth/login
    GW->>Auth: Chuyển tiếp request
    Auth-->>GW: 200 OK (accessToken, expiresAt)
    GW-->>UI: 200 OK
    UI->>UI: Lưu Token vào Auth Store, giải mã claims (role, sub)
    UI->>GW: GET /api/v1/auth/me (Authorization: Bearer)
    GW->>Auth: Chuyển tiếp request
    Auth-->>UI: 200 OK (Thông tin user)
    UI->>User: Chuyển hướng về Trang Chủ Catalog (/)
```

### Journey 2: Khám Phá Sản Phẩm & Kiểm Tra Tồn Kho Vật Lý
```mermaid
sequenceDiagram
    autonumber
    actor Customer as Khách Hàng
    participant UI as Giao Diện React
    participant GW as API Gateway (:8085)
    participant Prod as Product Service (:8082)
    participant Inv as Inventory Service (:8081)

    Customer->>UI: Truy cập Trang Chủ / Danh Mục
    UI->>GW: GET /api/v1/products (hoặc /search?category=...)
    GW->>Prod: GET /api/v1/products
    Prod->>Inv: GET /api/v1/inventory-summaries?productIds=1,2,3 (Nội bộ)
    Inv-->>Prod: Trả về summary (available, reserved, sold, damaged)
    Prod-->>GW: Danh sách sản phẩm ghép kèm tồn kho
    GW-->>UI: 200 OK List<ProductResponse>
    UI->>Customer: Hiển thị lưới sản phẩm, nhãn tồn kho "Còn 3 món" / "Hết hàng"

    Customer->>UI: Bấm vào xem Chi Tiết Sản Phẩm (/products/:id)
    UI->>GW: GET /api/v1/products/:id
    GW->>Prod: Tra cứu sản phẩm & tồn kho
    Prod-->>UI: 200 OK ProductResponse
    UI->>Customer: Hiển thị thông số: Vàng 18K, Kim cương, Giá tiền VND, nút "Thêm vào giỏ"
```

### Journey 3: Đặt Hàng & Giữ Chỗ Món Trang Sức (Reservation Workflow)
```mermaid
sequenceDiagram
    autonumber
    actor Customer as Khách Hàng
    participant Cart as Client Cart Store
    participant UI as Giao Diện Checkout
    participant GW as API Gateway (:8085)
    participant Ord as Order Service (:8084)
    participant Inv as Inventory Service (:8081)

    Customer->>Cart: Thêm sản phẩm vào giỏ (chọn số lượng <= 10)
    Customer->>UI: Bấm "Tiến Hành Đặt Hàng" (/checkout)
    UI->>UI: Sinh mã Idempotency-Key (UUID v4 ngẫu nhiên)
    UI->>Customer: Hiển thị popup xác nhận: "Sản phẩm sẽ được giữ chỗ trong 15 phút tại showroom"
    Customer->>UI: Xác nhận Đặt Hàng
    UI->>GW: POST /api/v1/orders [Header: Idempotency-Key] [Body: items]
    GW->>Ord: Chuyển tiếp request có Bearer Token
    Ord->>Ord: Tạo Order trạng thái PENDING_RESERVATION
    loop Từng món trang sức
        Ord->>Inv: POST /internal/api/v1/inventory/reservations (kèm X-Internal-Service-Key)
        Inv-->>Ord: 201 Created (Khóa barcode món vật lý)
    end
    alt Toàn bộ món giữ chỗ thành công
        Ord->>Ord: Cập nhật Order -> AWAITING_PAYMENT
        Ord-->>GW: 201 Created (OrderResponse)
        GW-->>UI: 201 Created
        UI->>Cart: Xóa giỏ hàng
        UI->>Customer: Điều hướng sang /orders/:orderReference (Thông báo giữ chỗ thành công)
    else Hết hàng hoặc xung đột giữ chỗ
        Ord->>Inv: Release các món đã giữ dở dang
        Ord->>Ord: Cập nhật Order -> RESERVATION_FAILED
        Ord-->>GW: 409 Conflict ("Product out of stock...")
        GW-->>UI: 409 Conflict
        UI->>Customer: Cảnh báo "Sản phẩm vừa hết hàng, vui lòng chọn món khác"
    else Giữ chỗ bị timeout/chậm mạng
        Ord-->>GW: 202 Accepted (OrderResponse status: PENDING_RESERVATION)
        GW-->>UI: 202 Accepted
        UI->>Customer: Bật chế độ Polling đợi tiến trình nền xử lý
    end
```

### Journey 4: Tra Cứu Đơn Hàng & Hủy Đơn (Order Cancellation)
```mermaid
sequenceDiagram
    autonumber
    actor Customer as Khách Hàng
    participant UI as Giao Diện Lịch Sử Đơn
    participant GW as API Gateway (:8085)
    participant Ord as Order Service (:8084)
    participant Inv as Inventory Service (:8081)

    Customer->>UI: Truy cập /orders
    UI->>GW: GET /api/v1/orders?page=0&size=10&sort=createdAt,desc
    GW->>Ord: Lọc đơn theo userId lấy từ JWT token
    Ord-->>UI: 200 OK (Page<OrderResponse>)
    UI->>Customer: Danh sách đơn hàng kèm badge trạng thái (Chờ thanh toán, Đã hủy,...)

    Customer->>UI: Bấm vào mã đơn -> Mở /orders/:orderReference
    UI->>GW: GET /api/v1/orders/:orderReference
    GW->>Ord: Tra cứu chi tiết
    Ord-->>UI: 200 OK (Chi tiết đơn + danh sách item kèm barcode/serial)
    
    Customer->>UI: Bấm "Hủy Đơn Hàng"
    UI->>Customer: Hộp thoại cảnh báo: "Món trang sức đã giữ chỗ sẽ được trả lại quầy"
    Customer->>UI: Đồng ý hủy
    UI->>GW: POST /api/v1/orders/:orderReference/cancellation
    GW->>Ord: Xử lý hủy
    Ord->>Inv: POST /internal/api/v1/inventory/reservations/:id/release
    Inv-->>Ord: Giải phóng trạng thái món vật lý -> AVAILABLE
    Ord->>Ord: Cập nhật Order -> CANCELLED
    Ord-->>UI: 200 OK (OrderResponse: CANCELLED)
    UI->>Customer: Cập nhật trạng thái tức thì trên màn hình
```

---

## 3. Danh Mục Màn Hình & Trạng Thái Giao Diện Toàn Diện (Screen Inventory & UI States)

### 3.0. Ma Trận Tiêu Chuẩn Tuyến Đường & Điều Hướng Chi Tiết (Confirmed Route Standards Matrix)

Bảng dưới đây chuẩn hóa toàn diện các tuyến đường đã xác minh từ năng lực backend và kiến trúc SPA:

| URL Pattern | Tên & Mục Đích Trang | Layout Yêu Cầu | Quyền Truy Cập (Access) | Phụ Thuộc Dữ Liệu (Data Dependencies) | Điểm Vào Điều Hướng (Entry Point) | Hành Vi Loading & Error | Tiêu Đề Trang (`document.title`) & Metadata | Breadcrumbs |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/` | **Trang Chủ / Catalog**: Duyệt bộ sưu tập trang sức, lọc theo category, xem giá & tồn kho | `StorefrontLayout` | `ROLE_USER`, `ROLE_ADMIN` *(Rào cản GAP-02: chưa hỗ trợ khách ẩn danh)* | `GET /api/v1/products`, `/api/v1/products/search?category=...` | Logo Header, Menu "Bộ Sưu Tập", Back từ Detail | **Loading**: ProductGrid Shimmer Skeleton.<br>**Error**: Alert inline 503/401/Network, không sập trang | `Bộ Sưu Tập — JewelryShop`<br>`<meta name="description" content="Khám phá bộ sưu tập trang sức thủ công cao cấp...">` | Không (Trang gốc) |
| `/login` | **Đăng Nhập**: Xác thực email/mật khẩu, nhận Bearer JWT RS256 | `RootLayout` (Bare card, không Header/Footer) | Public (Chưa đăng nhập) | `POST /api/v1/auth/login` | Header nút "Đăng Nhập", Redirect tự động từ `ProtectedRoute` | **Loading**: Nút submit xoay spinner, khóa form.<br>**Error**: Alert đỏ báo lỗi 401 thông tin không đúng | `Đăng Nhập — JewelryShop` | Không |
| `/register` | **Đăng Ký**: Khởi tạo tài khoản khách hàng mới | `RootLayout` (Bare card, không Header/Footer) | Public (Chưa đăng nhập) | `POST /api/v1/auth/register` | Header nút "Đăng Ký", Liên kết chuyển từ trang `/login` | **Loading**: Nút submit xoay spinner.<br>**Error**: Báo lỗi 409 trùng email/username | `Đăng Ký Tài Khoản — JewelryShop` | Không |
| `/profile` | **Hồ Sơ Cá Nhân**: Xem thông tin tài khoản, quyền hạn, ngày tạo (Read-only) | `StorefrontLayout` | Bất kỳ đã xác thực (`ROLE_USER` / `ROLE_ADMIN`) | `GET /api/v1/auth/me` | Avatar menu -> "Hồ Sơ Của Tôi" | **Loading**: Skeleton các dòng thông tin.<br>**Error**: 401 tự động điều hướng sang `/login` | `Hồ Sơ Cá Nhân — JewelryShop` | `Trang Chủ > Hồ Sơ` |
| `/products/:productId` | **Chi Tiết Sản Phẩm**: Xem giác cắt đá quý, tuổi vàng, mô tả chế tác, số lượng tồn kho | `StorefrontLayout` | `ROLE_USER`, `ROLE_ADMIN` | `GET /api/v1/products/{id}` | Click vào thẻ sản phẩm từ Catalog (`/`), Direct Link | **Loading**: Skeleton lớn hình ảnh và bảng thông số.<br>**Error**: 404 "Sản phẩm không tồn tại", 503 tồn kho | `{Tên Sản Phẩm} — JewelryShop` | `Trang Chủ > Bộ Sưu Tập > {Tên Sản Phẩm}` |
| `/cart` | **Giỏ Hàng Mua Sắm**: Xem danh sách món chọn, điều chỉnh số lượng (1-10/món, tổng <= 20) | `StorefrontLayout` | Bất kỳ đã xác thực | Client LocalStorage (`useCartStore`) | Icon Giỏ Hàng trên Header, Drawer giỏ hàng | **Loading**: Tức thời (Client state).<br>**Error**: Cảnh báo vượt quá định mức 10/20 món | `Giỏ Hàng — JewelryShop` | `Trang Chủ > Giỏ Hàng` |
| `/checkout` | **Xác Nhận Giữ Chỗ**: Cam kết giữ chỗ vật lý tại showroom trong 15 phút, gửi Idempotency-Key | `StorefrontLayout` | `ROLE_USER`, `ROLE_ADMIN` | `POST /api/v1/orders` (Header `Idempotency-Key: UUID`) | Nút "Tiến Hành Đặt Hàng" từ Giỏ Hàng | **Loading**: Nút submit khóa, hiển thị tiến trình giữ chỗ.<br>**Error**: 409 hết hàng, 503 lỗi kho | `Xác Nhận Đặt Hàng — JewelryShop` | `Trang Chủ > Giỏ Hàng > Xác Nhận` |
| `/orders` | **Lịch Sử Đơn Hàng**: Danh sách các đơn đã đặt, trạng thái giữ chỗ & tổng tiền | `StorefrontLayout` | Bất kỳ đã xác thực | `GET /api/v1/orders?page=...&size=...&sort=...` | Avatar menu -> "Đơn Hàng Của Tôi" | **Loading**: Table skeleton 5 hàng.<br>**Error**: Alert inline báo lỗi mạng kèm nút "Tải lại" | `Đơn Hàng Của Tôi — JewelryShop` | `Trang Chủ > Đơn Hàng` |
| `/orders/:orderReference` | **Chi Tiết & Hủy Đơn**: Xem mã barcode từng món vật lý giữ chỗ, đồng hồ 15 phút, thao tác hủy đơn | `StorefrontLayout` | Bất kỳ đã xác thực (Ownership check backend) | `GET /api/v1/orders/{ref}`, `POST .../{ref}/cancellation` | Click mã đơn từ `/orders`, Direct Link sau checkout | **Loading**: Card skeleton chi tiết đơn.<br>**Error**: 404 không tìm thấy đơn, 403 không phải chủ đơn | `Đơn Hàng #{orderReference} — JewelryShop` | `Trang Chủ > Đơn Hàng > #{orderReference}` |
| `/admin/products` | **Quản Trị Danh Mục**: Bảng CRUD sản phẩm, thêm mới, sửa, soft-delete | `AdminLayout` | `ROLE_ADMIN` bắt buộc | `GET`, `POST`, `PUT`, `DELETE /api/v1/products/**` | Sidebar Admin -> "Quản Lý Sản Phẩm" | **Loading**: Bảng dữ liệu skeleton.<br>**Error**: 403 Forbidden hiển thị tại chỗ nếu không có quyền | `Quản Lý Sản Phẩm — Quản Trị JewelryShop`<br>`<meta name="robots" content="noindex">` | `Quản Trị > Sản Phẩm` |
| `/admin/inventory` | **Quản Trị Kho Vật Lý**: Tra cứu barcode, serial, tuổi vàng, vị trí khay, nhập món mới | `AdminLayout` | `ROLE_ADMIN` bắt buộc | `GET /api/v1/inventory-items`, `POST /api/v1/inventory-items` | Sidebar Admin -> "Kho Món Vật Lý" | **Loading**: Bảng kho skeleton.<br>**Error**: 403 Forbidden nếu không phải ADMIN | `Kho Trang Sức Vật Lý — Quản Trị JewelryShop`<br>`<meta name="robots" content="noindex">` | `Quản Trị > Kho Vật Lý` |
| `/admin/orders` | **Giám Sát Đơn Hàng**: Xem đơn toàn hệ thống, lọc trạng thái, hủy đơn quá hạn | `AdminLayout` | `ROLE_ADMIN` bắt buộc | `GET /api/v1/orders`, `POST .../{ref}/cancellation` | Sidebar Admin -> "Giám Sát Đơn Hàng" | **Loading**: Table skeleton phân trang.<br>**Error**: 403 Forbidden nếu không phải ADMIN | `Giám Sát Đơn Hàng — Quản Trị JewelryShop`<br>`<meta name="robots" content="noindex">` | `Quản Trị > Giám Sát Đơn Hàng` |
| `*` | **Không Tìm Thấy (404)**: Xử lý đường dẫn không hợp lệ | `RootLayout` | Public | Không | URL không tồn tại | **Render tức thời**: Minh họa nhẹ nhàng, nút "Quay lại Trang Chủ" | `Trang Không Tồn Tại — JewelryShop` | Không |

---

### 3.1. Nhóm Màn Hình Xác Thực & Tài Khoản (Auth & Profile)

#### Màn hình `SCR-AUTH-01`: Đăng Nhập (`/login`)
- **API Liên Kết**: `POST /api/v1/auth/login`
- **Mô tả**: Cho phép người dùng nhập Email và Mật khẩu để lấy Bearer JWT.
- **Trạng thái chi tiết**:
  - `Loading`: Nút đăng nhập hiển thị spinner, disable toàn bộ input để ngăn double-submit.
  - `Validation Error`: Form validation bằng Zod (email đúng định dạng, password không để trống). Hiển thị text đỏ dưới từng input (`MUI HelperText`).
  - `API Error (401)`: Banner cảnh báo màu đỏ (`MUI Alert`): *"Email hoặc mật khẩu không chính xác, hoặc tài khoản đã bị vô hiệu hóa"*.
  - `Success`: Lưu token vào Storage, điều hướng về trang người dùng muốn truy cập trước đó (Return URL).

#### Màn hình `SCR-AUTH-02`: Đăng Ký Tài Khoản (`/register`)
- **API Liên Kết**: `POST /api/v1/auth/register`
- **Mô tả**: Đăng ký tài khoản khách hàng mới.
- **Ràng buộc đầu vào**:
  - `username`: 3 - 50 ký tự.
  - `email`: Định dạng email hợp lệ, tối đa 255 ký tự.
  - `password`: 6 - 72 ký tự (giới hạn tối đa theo chuẩn BCrypt).
- **Trạng thái chi tiết**:
  - `Validation Error`: Báo lỗi cụ thể dưới từng field khi vi phạm độ dài hoặc cấu trúc email.
  - `Conflict Error (409)`: Hiển thị thông báo lỗi từ backend: *"Tên đăng nhập hoặc email đã tồn tại trong hệ thống"*.
  - `Success (201)`: Hiển thị `Snackbar` thành công và tự động chuyển người dùng sang màn hình đăng nhập.

#### Màn hình `SCR-AUTH-03`: Hồ Sơ Người Dùng Hiện Tại (`/profile`)
- **API Liên Kết**: `GET /api/v1/auth/me`
- **Mô tả**: Xem thông tin tài khoản hiện tại, vai trò (User/Admin), ngày tạo.
- **Trạng thái chi tiết**:
  - `Loading`: `Skeleton` cho các trường thông tin.
  - `Success`: Hiển thị ID người dùng, Username, Email, Quyền hạn (`Chip` User/Admin), Trạng thái kích hoạt.
  - `Unauthorized (401)`: Tự động điều hướng ra `/login`.

---

### 3.2. Nhóm Màn Hình Khách Hàng & Mua Sắm (Customer Storefront)

#### Màn hình `SCR-STORE-01`: Danh Mục Sản Phẩm & Trang Chủ (`/`)
- **API Liên Kết**: `GET /api/v1/products`, `GET /api/v1/products/search?category=...`
- **Mô tả**: Trưng bày bộ sưu tập trang sức (Nhẫn, Dây chuyền, Bông tai, Vòng tay), lọc theo thể loại và hiển thị số lượng tồn kho khả dụng.
- **Trạng thái chi tiết**:
  - `Initial Loading`: Lưới thẻ sản phẩm hiển thị `Skeleton` hiệu ứng shimmer ánh sáng sang trọng.
  - `Success`: Danh sách các thẻ sản phẩm (Card) gồm tên, chất liệu (Vàng 18K, Bạc, Bạch kim), đá quý (Kim cương, Ruby), giá tiền (VND), và huy hiệu tồn kho (Ví dụ: *"Còn 2 chiếc tại quầy"*).
  - `Empty State`: Khi không tìm thấy sản phẩm nào theo bộ lọc, hiển thị hình minh họa trang sức tinh tế kèm lời nhắn: *"Không tìm thấy món trang sức phù hợp với tiêu chí lọc"*.
  - `Downstream Error (503)`: Nếu Inventory Service gặp sự cố, backend ném 503. UI hiển thị thông báo thân thiện: *"Dịch vụ kiểm tra tồn kho đang bảo trì. Vui lòng thử lại sau giây lát"*.
  - `Unauthorized (401/403)`: Vì Gateway đang chặn người dùng ẩn danh xem sản phẩm, màn hình hiển thị lời chào sang trọng yêu cầu đăng nhập: *"Đăng nhập để chiêm ngưỡng bộ sưu tập trang sức cao cấp"*.

#### Màn hình `SCR-STORE-02`: Chi Tiết Món Trang Sức (`/products/:id`)
- **API Liên Kết**: `GET /api/v1/products/{id}`
- **Mô tả**: Xem thông số kỹ thuật chi tiết của món trang sức.
- **Trạng thái chi tiết**:
  - `Loading`: `Skeleton` lớn cho hình ảnh placeholder và khối thông số.
  - `Success`:
    - Tên sản phẩm, mã danh mục.
    - Bảng thông số: Chất liệu (`material`), Loại đá quý (`gemstone`), Giá niêm yết VND (`price`).
    - Mô tả nguồn gốc chế tác (`description`).
    - Trạng thái kho vật lý: Hiển thị số lượng có sẵn (`availableQuantity`). Nếu `availableQuantity <= 0` hoặc `active = false`, nút "Thêm vào giỏ" bị mờ (disabled) với nhãn *"Tạm hết hàng tại quầy"*.
  - `Not Found (404)`: Banner thông báo *"Món trang sức này không tồn tại hoặc đã ngừng kinh doanh"*.

#### Màn hình `SCR-STORE-03`: Giỏ Hàng Mua Sắm (`/cart` hoặc Drawer Giỏ Hàng)
- **API Liên Kết**: **Client-side State (LocalStorage)** (Backend không có API Cart).
- **Mô tả**: Quản lý các món trang sức người dùng muốn mua trước khi tạo đơn.
- **Quy tắc giỏ hàng**:
  - Cho phép tăng/giảm số lượng từ 1 đến 10 cho mỗi món (tuân thủ validation `OrderItemRequest.quantity <= 10`).
  - Tổng số lượng sản phẩm vật lý trong toàn bộ giỏ không được vượt quá 20 (tuân thủ ràng buộc `maxItemsPerOrder = 20` của Order Service).
- **Trạng thái chi tiết**:
  - `Empty State`: *"Giỏ hàng của bạn đang trống. Hãy khám phá những tuyệt tác trang sức của chúng tôi"*. Nút bấm dẫn về Catalog.
  - `Limit Warning`: Khi người dùng thêm quá 10 món cho 1 sản phẩm hoặc tổng quá 20 món, hiển thị cảnh báo giới hạn đặt hàng trực tiếp trong giỏ.
  - `CTA Action`: Nút bấm "Tiến hành Đặt hàng & Giữ chỗ" kích hoạt điều hướng sang `/checkout`.

#### Màn hình `SCR-STORE-04`: Xác Nhận Đặt Hàng & Giữ Chỗ (`/checkout`)
- **API Liên Kết**: `POST /api/v1/orders` [Header: `Idempotency-Key: UUID`]
- **Ràng buộc nghiệp vụ**:
  - Không có trường nhập địa chỉ giao hàng.
  - Màn hình thông báo rõ: *"Món trang sức sẽ được giữ chỗ trực tiếp tại showroom trong vòng 15 phút để bạn đến trải nghiệm và thanh toán."*
- **Trạng thái chi tiết**:
  - `Submitting`: Nút bấm khóa lại, hiển thị hiệu ứng xoay tròn và nhãn *"Đang gửi yêu cầu giữ chỗ vật lý..."*.
  - `Success (201 Created)`: Điều hướng ngay sang màn hình chi tiết đơn hàng `/orders/:orderReference` với thông báo *"Giữ chỗ thành công. Mã đơn hàng của bạn là [orderReference]"*.
  - `Pending (202 Accepted)`: Hiển thị thông báo *"Đơn hàng đang chờ đồng bộ giữ chỗ với kho. Hệ thống đang tự động xác nhận..."* kèm cơ chế kiểm tra định kỳ (Polling).
  - `Conflict (409)`: Hiển thị thông báo lỗi chi tiết khi món hàng vừa bị khách khác giữ mất hoặc khóa trùng lặp.
  - `Service Unavailable (503)`: Báo lỗi kết nối dịch vụ tồn kho, hướng dẫn khách hàng liên hệ hotline showroom.

#### Màn hình `SCR-STORE-05`: Lịch Sử Đơn Hàng Của Khách Hàng (`/orders`)
- **API Liên Kết**: `GET /api/v1/orders?page=...&size=...&sort=createdAt,desc&status=...`
- **Mô tả**: Xem danh sách các đơn hàng của tài khoản đang đăng nhập.
- **Trạng thái chi tiết**:
  - `Loading`: Danh sách Skeleton đơn hàng.
  - `Success`: Bảng/Thẻ danh sách đơn với Mã đơn (`orderReference`), Ngày tạo, Tổng tiền VND (`totalAmount`), Huy hiệu trạng thái:
    - `AWAITING_PAYMENT`: Màu vàng đồng/amber ("Chờ thanh toán & nhận hàng").
    - `CONFIRMED`: Màu xanh lá ("Đã hoàn tất thanh toán").
    - `CANCELLED`: Màu xám ("Đã hủy / Đã giải phóng giữ chỗ").
    - `PENDING_RESERVATION`: Màu xanh dương ("Đang xử lý giữ chỗ").
  - `Empty State`: *"Bạn chưa có đơn đặt hàng nào"*.

#### Màn hình `SCR-STORE-06`: Chi Tiết Đơn Hàng & Hủy Đơn (`/orders/:orderReference`)
- **API Liên Kết**: `GET /api/v1/orders/{orderReference}`, `POST /api/v1/orders/{orderReference}/cancellation`
- **Mô tả**: Xem thông tin chi tiết từng món đồ vật lý được giữ chỗ trong đơn, và cho phép khách hủy đơn nếu không còn nhu cầu.
- **Trạng thái chi tiết**:
  - `Success`:
    - Danh sách từng món: Tên trang sức, Đơn giá lúc đặt, Mã món giữ chỗ (`orderItemReference`), Trạng thái món (`RESERVED`, `COMMITTED`, `RELEASED`).
    - Nút "Hủy đơn hàng": Chỉ hiển thị khi đơn ở trạng thái `AWAITING_PAYMENT` hoặc `PENDING_RESERVATION`.
  - `Cancellation Modal`: Dialog xác nhận hỏi khách hàng có chắc chắn muốn hủy đơn và giải phóng giữ chỗ cho người khác hay không.
  - `Cancellation In-Progress`: Nút hủy hiển thị spinner.
  - `Cancellation Done`: Cập nhật trạng thái tức thời sang `CANCELLED`.

---

### 3.3. Nhóm Màn Hình Quản Trị Viên (Admin Management)

#### Màn hình `SCR-ADM-01`: Quản Lý Danh Mục Trang Sức (`/admin/products`)
- **API Liên Kết**: `GET /api/v1/products`, `POST /api/v1/products`, `PUT /api/v1/products/{id}`, `DELETE /api/v1/products/{id}`
- **Quyền hạn**: Bắt buộc `ROLE_ADMIN` (nếu User thường truy cập sẽ bị 403 Forbidden).
- **Tính năng**:
  - Bảng dữ liệu sản phẩm kèm bộ lọc trạng thái (Active/Inactive).
  - Modal "Thêm mới sản phẩm": Form nhập Tên, Thể loại, Chất liệu, Đá quý, Giá bán VND, Mô tả.
  - Modal "Sửa thông tin sản phẩm": Chỉnh sửa thông tin và bật/tắt cờ `active`.
  - Thao tác "Ngừng kinh doanh": Gọi `DELETE /api/v1/products/{id}` để soft delete.

#### Màn hình `SCR-ADM-02`: Quản Lý Kho Món Đồ Vật Lý (`/admin/inventory`)
- **API Liên Kết**: `GET /api/v1/inventory-items`, `GET /api/v1/inventory-items/{id}`, `POST /api/v1/inventory-items`
- **Quyền hạn**: Bắt buộc `ROLE_ADMIN`.
- **Tính năng**:
  - Bảng tra cứu từng món đồ vật lý độc bản: Barcode, Serial Number, Trọng lượng thực tế (`actualWeightGrams`), Độ tinh khiết vàng (`actualGoldPurityPercent` ví dụ 99.99%), Mã kiểm định (`certificateNumber`), Vị trí khay đựng (`locationCode`), Trạng thái vật lý (`AVAILABLE`, `RESERVED`, `SOLD`, `DAMAGED`).
  - Modal "Đăng ký món vật lý mới": Điền thông số chi tiết của món vàng/kim cương mới nhập về quầy.

#### Màn hình `SCR-ADM-03`: Giám Sát Đơn Hàng Toàn Hệ Thống (`/admin/orders`)
- **API Liên Kết**: `GET /api/v1/orders`, `POST /api/v1/orders/{orderReference}/cancellation`
- **Quyền hạn**: Bắt buộc `ROLE_ADMIN`.
- **Tính năng**:
  - Xem tất cả đơn hàng của mọi người dùng với bộ lọc trạng thái và phân trang.
  - Xem ID người dùng đặt hàng (`userId`).
  - Hủy đơn thay cho khách nếu quá hạn đến quầy thanh toán.

---

## 4. Các Màn Hình Bị Loại Bỏ Hoặc Đang Bị Chặn Do Thiếu API (Excluded & Blocked Screens)

| Màn Hình Đề Xuất Phổ Biến | Trạng Thái Trong Dự Án | Lý Do Kỹ Thuật & Căn Cứ Từ Mã Nguồn |
| :--- | :--- | :--- |
| **Màn hình Nhập địa chỉ & Theo dõi giao hàng** | **LOẠI BỎ TRIỆT ĐỂ (EXCLUDED)** | Tuân thủ nguyên tắc kinh doanh tối cao: JewelryShop không có luồng shipping/delivery. Không có bảng `shipping_addresses` hay đối tác vận chuyển. Khách nhận hàng tại tiệm. |
| **Màn hình Cổng thanh toán (VNPAY / Momo / Credit Card)** | **BỊ CHẶN DO THIẾU API (BLOCKED)** | Backend chưa xây dựng module thanh toán. Trạng thái đơn dừng lại ở `AWAITING_PAYMENT`. Không được dựng form nhập thẻ giả lập. |
| **Màn hình Đánh giá & Bình luận (Reviews & Ratings)** | **BỊ CHẶN DO THIẾU API (BLOCKED)** | Không có bảng `reviews`, `ratings` hay bất kỳ controller nào hỗ trợ gửi feedback sản phẩm. |
| **Màn hình Danh sách yêu thích (Wishlist)** | **BỊ CHẶN DO THIẾU API (BLOCKED)** | Không có API quản lý wishlist trên server. Nếu làm ở client thì không đồng bộ giữa các thiết bị. |
| **Màn hình Tải ảnh sản phẩm lên kho (Image Upload)** | **BỊ CHẶN DO THIẾU API (BLOCKED)** | Thực thể `Product.java` hoàn toàn không có cột lưu đường dẫn ảnh (`imageUrl`). Không có API tải tệp đa phương tiện. |
| **Màn hình Chỉnh sửa hồ sơ cá nhân / Đổi mật khẩu** | **BỊ CHẶN DO THIẾU API (BLOCKED)** | `login-service` chỉ có endpoint đọc `GET /api/v1/auth/me`. Không có API cập nhật thông tin người dùng hay đổi mật khẩu. |

---

## 5. Tiêu Chuẩn Trải Nghiệm Trên Thiết Bị Di Động & Tiếp Cận (Mobile & Accessibility)

1. **Vùng Chạm (Touch Targets)**: Mọi nút bấm, icon button, menu toggle đều có kích thước tối thiểu **44x44px** (theo chuẩn iOS Human Interface Guidelines và WCAG 2.5.5).
2. **Quản Lý Tiêu Điểm Bàn Phím (Focus Management)**:
   - Khi mở Modal xác nhận đặt hàng hoặc Modal hủy đơn, tiêu điểm (focus) tự động di chuyển vào modal và bị giữ trong modal (Focus Trap).
   - Phím `Escape` đóng modal tức thì.
   - Khi đóng modal, tiêu điểm được trả lại chính xác nút kích hoạt trước đó.
3. **Vùng Cập Nhật Động (ARIA Live Regions)**:
   - Số lượng sản phẩm trên icon Giỏ hàng dùng `aria-live="polite"`.
   - Tiến trình giữ chỗ đơn hàng khi trả về `202 Accepted` dùng thông báo `aria-live="assertive"` để trình đọc màn hình thông báo kịp thời.
4. **Độ Tương Phản Màu Sắc**: Toàn bộ chữ hiển thị trên nền tối hoặc nền sáng đều đảm bảo tỷ lệ tương phản tối thiểu **4.5:1** đối với văn bản thông thường và **3:1** đối với văn bản lớn / biểu tượng chức năng.

