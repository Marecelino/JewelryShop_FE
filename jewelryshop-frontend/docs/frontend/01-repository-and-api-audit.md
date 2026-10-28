# 01. Báo Cáo Kiểm Tra Kho Mã Nguồn & Kiểm Toán API (Repository & API Audit)

> **Dự án**: JewelryShop Frontend & API Integration  
> **Trạng thái**: Kế hoạch & Phân tích kiến trúc (Planning Only)  
> **Ngày lập báo cáo**: 28/10/2026  
> **Tác giả**: Senior React Architect, UI/UX Designer & API Integration Engineer  
> **Môi trường backend kiểm toán**: Kho lưu trữ `D:\java\JewelryShop`

---

## 1. Tổng Quan Kiểm Kê Hệ Thống Kho Mã Nguồn (Repository Inventory)

Kiểm tra thực tế cấu trúc thư mục tại `D:\java\JewelryShop` cho thấy hệ thống backend bao gồm 5 dịch vụ Maven / Spring Boot độc lập (không sử dụng cấu trúc Maven aggregator đa module root), đi kèm các bộ tài liệu, cấu hình kiểm thử Postman và script SQL Server. 

### 1.1. Danh mục dịch vụ và cấu hình thực tế

| Tên Dịch Vụ | Thư Mục | Cổng (Port) | Cơ Sở Dữ Liệu SQL Server | Java / Spring Boot | Package Prefix | Trách Nhiệm Nghiệp Vụ |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **API Gateway** | `api-gateway/` | **8085** *(ghi chú: AGENTS.md ban đầu dự kiến 8080, cấu hình thực tế `server.port=8085`)* | Không dùng CSDL riêng | Java 21 / Spring Boot 3.4.x (WebFlux Gateway) | `com.example.gateway` | Điểm vào duy nhất (Reverse Proxy), xác thực tập trung JWT RS256, phân quyền Role, chặn truy cập trực tiếp |
| **Login Service** | `login-service/` | **8083** | `JewelryLoginDemo` | Java 21 / Spring Boot 4.1.1 | `com.example.login` | Đăng ký, đăng nhập người dùng, cấp phát JWT ký RSA-256 (khóa riêng tư PEM), thông tin tài khoản hiện tại |
| **Product Service** | `product-service/` | **8082** | `JewelryStoreDemo` | Java 21 / Spring Boot 4.1.1 | `com.example.product` | Quản lý danh mục sản phẩm trang sức (CRUD), tra cứu sản phẩm, tích hợp dữ liệu tồn kho tổng hợp từ Inventory Service |
| **Inventory Service** | `inventory-service/` | **8081** | `JewelryInventoryDemo` | Java 21 / Spring Boot 4.1.1 | `com.example.inventory` | Quản lý món trang sức vật lý (barcode, serial, trọng lượng, độ tinh khiết), tóm tắt tồn kho, giữ chỗ (Reservation) nội bộ |
| **Order Service** | `order-service/` | **8084** | `JewelryOrderDemo` | Java 21 / Spring Boot 4.1.1 | `com.example.order` | Đặt hàng với Idempotency Key, phối hợp giữ chỗ vật lý với Inventory Service, hủy đơn giải phóng giữ chỗ, quét phục hồi định kỳ |

### 1.2. Hiện trạng mã nguồn Frontend

- **Tại thư mục làm việc hiện tại (`D:\java\JewelryShop`)**: Chưa tồn tại thư mục frontend.
- **Tại thư mục lân cận (`D:\java\JewelryShop_FE\jewelryshop-frontend`)**: Đã được khởi tạo sẵn khung dự án mẫu sử dụng:
  - Vite `^8.3.5` + React `^19.3.1` + TypeScript `~7.0.2`
  - MUI Material `^9.5.0` + Emotion (`@emotion/react` `^11.14.0`, `@emotion/styled` `^11.14.1`)
  - TanStack Query `^5.105.0`
  - React Router DOM `^7.18.5`
  - React Hook Form `^7.91.0` + Zod `^4.6.7` + `@hookform/resolvers` `^6.0.2`
  - i18next `^26.5.11` + react-i18next `^17.1.9` + i18next-browser-languagedetector `^8.2.3`
  - Oxlint `^1.89.0`
- **Ranh giới thực thi**: Không sửa đổi mã backend, không chạy lệnh thay đổi database, không tạo file mã nguồn UI trong pha lập kế hoạch này.

---

## 2. Kiểm Toán Tuyến Đường Gateway & Cơ Chế Chuyển Tiếp (Gateway Routing & Path Rewrites)

Tệp cấu hình căn cứ: `D:\java\JewelryShop\api-gateway\src\main\resources\application.properties`.

### 2.1. Bảng cấu hình tuyến đường Gateway (Route Definitions)

| Route ID | Đường dẫn nhận (Predicate) | URI Đích (Downstream URI) | Bộ lọc Rewrite | Phơi bày ra ngoài Browser? | Ghi chú & Rủi ro |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `login-service` | `/api/v1/auth/**` | `http://localhost:8083` | **Không có** (Giữ nguyên path) | **CÓ** | Chuyển tiếp trực tiếp đến Login Service. |
| `product-service` | `/api/v1/products/**` | `http://localhost:8082` | **Không có** (Giữ nguyên path) | **CÓ** | Chuyển tiếp trực tiếp đến Product Service. |
| `inventory-items-service` | `/api/v1/inventory-items`, `/api/v1/inventory-items/**` | `http://localhost:8081` | **Không có** (Giữ nguyên path) | **CÓ (ADMIN ONLY)** | Chỉ cho phép tài khoản có quyền `ROLE_ADMIN`. |
| `order-service` | `/api/v1/orders`, `/api/v1/orders/**` | `http://localhost:8084` | **Không có** (Giữ nguyên path) | **CÓ** | Chuyển tiếp trực tiếp đến Order Service. |

### 2.2. Các dịch vụ và endpoint nội bộ bị Gateway chặn hoặc không định tuyến

1. **Endpoint tóm tắt tồn kho (`/api/v1/inventory-summaries/**`)**:
   - Được định nghĩa tại Inventory Service (`InventorySummaryController.java`).
   - Tại Gateway `SecurityConfig.java` (dòng 124–127), cấu hình:
     ```java
     .pathMatchers("/api/v1/inventory-summaries", "/api/v1/inventory-summaries/**").denyAll()
     ```
   - **Kết luận**: Browser tuyệt đối không thể gọi trực tiếp endpoint này. Endpoint này chỉ dành cho Product Service gọi nội bộ qua mạng máy chủ (`http://localhost:8081/api/v1/inventory-summaries?productIds=...`).
2. **Endpoint giữ chỗ nội bộ (`/internal/api/v1/inventory/reservations/**`)**:
   - Định nghĩa tại Inventory Service (`InventoryReservationController.java`).
   - Tuyến đường này **hoàn toàn không được khai báo trong Gateway**.
   - Được bảo vệ bằng bộ lọc `InternalApiSecurityFilter.java`, kiểm tra tiêu đề `X-Internal-Service-Key`.
   - **Kết luận**: Chỉ Order Service được phép gọi trực tiếp qua URL nội bộ `http://localhost:8081`. Trình duyệt không có quyền truy cập.
3. **Endpoint phân trang Product V2 (`/api/v2/products`)**:
   - Tồn tại trong mã nguồn Product Service (`ProductV2Controller.java`).
   - Tuy nhiên, Gateway chỉ cấu hình `predicates[0]=Path=/api/v1/products/**`.
   - Gateway từ chối mọi yêu cầu đến `/api/v2/products` với mã lỗi `401 Unauthorized` hoặc `403 Forbidden` (`anyExchange().denyAll()`).
4. **Cơ chế Fail-Closed của Gateway**:
   - Dòng 149 của `SecurityConfig.java`: `.anyExchange().denyAll()`.
   - Bất kỳ URL nào không nằm trong danh sách tường minh đều bị từ chối triệt để.

---

## 3. Ma Trận Năng Lực API Toàn Diện (API Capability Matrix)

Ma trận dưới đây ghi nhận toàn bộ các API thực tế có thể tiếp cận từ phía client thông qua API Gateway (cổng `8085`).

| HTTP Method | Gateway Path | Service Đích | Xác thực | Quyền hạn (Role) | Payload Yêu Cầu | DTO Phản Hồi | Mã HTTP | Side Effects & Idempotency | Tệp Mã Nguồn / Phương Thức Căn Cứ |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | `login-service` | Public | Không yêu cầu | `RegisterRequest` (`username`, `email`, `password`) | `UserResponse` | `201`, `400`, `409` | Tạo bản ghi người dùng mới trong DB với `role = 'USER'`, hash mật khẩu BCrypt. Không idempotent. | `AuthController.java#register` (`login-service`) |
| `POST` | `/api/v1/auth/login` | `login-service` | Public | Không yêu cầu | `LoginRequest` (`email`, `password`) | `LoginResponse` | `200`, `400`, `401` | Kiểm tra BCrypt, sinh JWT Token RS256 có hạn 15 phút. Không thay đổi DB (Read-only). | `AuthController.java#login` (`login-service`) |
| `GET` | `/api/v1/auth/me` | `login-service` | Bearer JWT | Bất kỳ đã xác thực | Không | `UserResponse` | `200`, `401`, `404` | Tra cứu thông tin người dùng theo subject ID trong token. Idempotent. | `AuthController.java#getCurrentUser` (`login-service`) |
| `GET` | `/api/v1/products` | `product-service` | Bearer JWT | `ROLE_USER`, `ROLE_ADMIN` *(Rủi ro chặn khách vãng lai)* | Không | `List<ProductResponse>` | `200`, `401`, `403`, `503` | Đọc toàn bộ sản phẩm active/inactive, gọi batch sang Inventory Service để bổ sung tồn kho. Idempotent. | `ProductController.java#getAllProducts` (`product-service`) |
| `GET` | `/api/v1/products/{id}` | `product-service` | Bearer JWT | `ROLE_USER`, `ROLE_ADMIN` | Không | `ProductResponse` | `200`, `401`, `403`, `404`, `503` | Đọc chi tiết sản phẩm theo ID kèm số lượng tồn kho. Idempotent. | `ProductController.java#getProductById` (`product-service`) |
| `GET` | `/api/v1/products/search?category=...` | `product-service` | Bearer JWT | `ROLE_USER`, `ROLE_ADMIN` | Query param `category` | `List<ProductResponse>` | `200`, `401`, `403`, `503` | Lọc sản phẩm theo danh mục và bổ sung tồn kho. Idempotent. | `ProductController.java#searchProducts` (`product-service`) |
| `GET` | `/api/v1/products/test-pagination?page=0&size=3` | `product-service` | Bearer JWT | `ROLE_USER`, `ROLE_ADMIN` | Query `page`, `size` | `Page<ProductResponse>` | `200`, `401`, `403`, `503` | Phân trang danh mục sản phẩm (Page Spring Data). Idempotent. | `ProductController.java#getAllProductsPaged` (`product-service`) |
| `POST` | `/api/v1/products` | `product-service` | Bearer JWT | `ROLE_ADMIN` | `CreateProductRequest` (`productName`, `category`, `material`, `gemstone`, `price`, `description`) | `ProductResponse` | `201`, `400`, `401`, `403` | Tạo bản ghi catalog sản phẩm mới, `inventory` ban đầu là `null`. Không idempotent. | `ProductController.java#createProduct` (`product-service`) |
| `PUT` | `/api/v1/products/{id}` | `product-service` | Bearer JWT | `ROLE_ADMIN` | `UpdateProductRequest` (`productName`, `category`, `material`, `gemstone`, `price`, `description`, `active`) | `ProductResponse` | `200`, `400`, `401`, `403`, `404` | Cập nhật thông tin catalog và trạng thái active. Idempotent. | `ProductController.java#updateProduct` (`product-service`) |
| `DELETE` | `/api/v1/products/{id}` | `product-service` | Bearer JWT | `ROLE_ADMIN` | Không | Không (`204 No Content`) | `204`, `401`, `403`, `404` | Soft delete: đặt `active = false` để không làm mồ côi inventory items. Idempotent. | `ProductController.java#deleteProduct` (`product-service`) |
| `GET` | `/api/v1/inventory-items?pageNumber=0&size=10` | `inventory-service` | Bearer JWT | `ROLE_ADMIN` | Query `pageNumber`, `size` | `PagedModel<InventoryItemResponse>` | `200`, `400`, `401`, `403` | Lấy danh sách các món trang sức vật lý phân trang. Idempotent. | `InventoryItemController.java#getAllItems` (`inventory-service`) |
| `GET` | `/api/v1/inventory-items/{id}` | `inventory-service` | Bearer JWT | `ROLE_ADMIN` | Không | `InventoryItemResponse` | `200`, `401`, `403`, `404` | Chi tiết món trang sức vật lý theo ID. Idempotent. | `InventoryItemController.java#getItemById` (`inventory-service`) |
| `POST` | `/api/v1/inventory-items` | `inventory-service` | Bearer JWT | `ROLE_ADMIN` | `CreateInventoryItemRequest` (`productId`, `barcode`, `serialNumber`, `actualWeightGrams`, `actualGoldPurityPercent`, `certificateNumber`, `locationCode`) | `InventoryItemResponse` | `201`, `400`, `401`, `403`, `404`, `409` | Tạo món vật lý mới với trạng thái `AVAILABLE`. Kiểm tra `productId` tồn tại bên Product Service. Không idempotent. | `InventoryItemController.java#createItem` (`inventory-service`) |
| `POST` | `/api/v1/orders` | `order-service` | Bearer JWT | `ROLE_USER`, `ROLE_ADMIN` | Header `Idempotency-Key` (bắt buộc, max 100). Body `CreateOrderRequest` (`items`: `[{productId, quantity}]`) | `OrderResponse` | `201`, `200`, `202`, `400`, `401`, `403`, `404`, `409`, `503` | **Idempotent an toàn với Idempotency-Key**. Khởi tạo đơn, giữ chỗ từng món vật lý qua Inventory Service, chuyển sang `AWAITING_PAYMENT`. | `OrderController.java#createOrder` (`order-service`) |
| `GET` | `/api/v1/orders` | `order-service` | Bearer JWT | `ROLE_USER`, `ROLE_ADMIN` | Query `page`, `size`, `sort`, `status` | `Page<OrderResponse>` | `200`, `400`, `401`, `403` | Phân trang danh sách đơn hàng. Nếu `ROLE_USER`, chỉ xem đơn của mình. Nếu `ROLE_ADMIN`, xem toàn bộ. Idempotent. | `OrderController.java#listOrders` (`order-service`) |
| `GET` | `/api/v1/orders/{orderReference}` | `order-service` | Bearer JWT | `ROLE_USER`, `ROLE_ADMIN` | Không | `OrderResponse` | `200`, `401`, `403`, `404` | Chi tiết đơn hàng và các item giữ chỗ. Kiểm tra sở hữu đơn hàng (Ownership check). Idempotent. | `OrderController.java#getOrderByReference` (`order-service`) |
| `POST` | `/api/v1/orders/{orderReference}/cancellation` | `order-service` | Bearer JWT | `ROLE_USER`, `ROLE_ADMIN` | Không | `OrderResponse` | `200`, `202`, `401`, `403`, `404`, `409` | Hủy đơn hàng, giải phóng toàn bộ các item giữ chỗ trong Inventory Service. Idempotent. | `OrderController.java#cancelOrder` (`order-service`) |

---

## 4. Cơ Chế Xác Thực & Phân Quyền Chi Tiết (Auth & Role Behavior)

### 4.1. Kiến trúc JWT và Mã Hóa Bất Đối Xứng (RS256)
- **Thuật toán ký**: RSA with SHA-256 (`RS256`).
- **Nơi phát hành (Issuer)**: `login-service` (`http://localhost:8083`).
- **Khóa ký (Key Pair)**:
  - Khóa riêng tư (`private_key.pem`) nằm tại `login-service/keys/private_key.pem`.
  - Khóa công khai (`public_key.pem`) nằm tại `login-service/keys/public_key.pem` và được `api-gateway` đọc qua thuộc tính `app.jwt.public-key-location=file:D:/java/JewelryShop/login-service/keys/public_key.pem`.
- **Audience**: `jewelryshop-api`.
- **Thời hạn Token (TTL)**: `PT15M` (15 phút).
- **Cấu trúc Payload Claim**:
  - `sub`: ID người dùng dạng chuỗi số (ví dụ `"1"`).
  - `username`: Tên người dùng (ví dụ `"user1"`).
  - `roles`: Mảng quyền hạn từ cơ sở dữ liệu (ví dụ `["USER"]` hoặc `["ADMIN"]`).
  - `iss`, `aud`, `iat`, `exp`, `jti`.

### 4.2. Chuyển đổi quyền hạn tại Gateway
- Tại `SecurityConfig.java` của `api-gateway`:
  ```java
  JwtGrantedAuthoritiesConverter authoritiesConverter = new JwtGrantedAuthoritiesConverter();
  authoritiesConverter.setAuthoritiesClaimName("roles");
  authoritiesConverter.setAuthorityPrefix("ROLE_");
  ```
- Dẫn đến quy tắc kiểm tra quyền:
  - Giá trị claim `"USER"` được chuyển đổi thành `ROLE_USER`.
  - Giá trị claim `"ADMIN"` được chuyển đổi thành `ROLE_ADMIN`.

### 4.3. Các hạn chế bảo mật đã xác minh từ mã nguồn
1. **Không có Refresh Token**: `login-service` chỉ trả về `accessToken`, `tokenType` (`Bearer`), và `expiresAt`. Khi hết hạn sau 15 phút, người dùng bị buộc phải đăng nhập lại trừ khi hệ thống có giải pháp mở rộng backend.
2. **Không có cơ chế Đăng xuất phía máy chủ (Server-side Revocation)**: Không có danh sách đen token (Blacklist) hay Redis cache. Đăng xuất hoàn toàn là hành động xóa token ở phía client (Client-side clear).
3. **Chưa có cấu hình CORS trên API Gateway**:
   - `api-gateway` không khai báo `CorsWebFilter` hoặc cấu hình `spring.cloud.gateway.globalcors`.
   - Nếu trình duyệt từ `http://localhost:5173` gọi trực tiếp `http://localhost:8085`, yêu cầu preflight `OPTIONS` sẽ bị chặn (CORS Error). Frontend bắt buộc phải chạy qua proxy của Vite (`server.proxy`) hoặc API Gateway phải bổ sung CORS.
4. **Hạn chế đối với khách vãng lai (Anonymous Access Block)**:
   - Trong `api-gateway/src/main/java/com/example/gateway/config/SecurityConfig.java`:
     ```java
     .pathMatchers(HttpMethod.GET, "/api/v1/products", "/api/v1/products/**").hasAnyRole("USER", "ADMIN")
     ```
   - Điều này đồng nghĩa khách chưa đăng nhập **không thể xem danh mục sản phẩm** thông qua Gateway. Đây là một phát hiện kiểm toán mang tính quyết định cho kế hoạch UI.

---

## 5. Bảng Phân Định: Thực Tế Xác Minh vs. Suy Luận Kỹ Thuật vs. Điểm Mù (Fact vs. Inference vs. Unknowns)

| Hạng Mục | Thực Tế Đã Xác Minh Từ Mã Nguồn (Confirmed Facts) | Suy Luận Kiến Trúc (Engineering Inferences) | Điểm Mù / Chưa Được Hỗ Trợ (Unknowns / Unsupported Gaps) |
| :--- | :--- | :--- | :--- |
| **Cổng kết nối Gateway** | Cổng thực tế là `8085` (`application.properties` dòng 2). | Client cấu hình `VITE_API_URL` trỏ vào `http://localhost:8085` hoặc dùng Vite Proxy trỏ về đây. | Tài liệu `AGENTS.md` ghi nhận port 8080 là dự kiến ban đầu, thực tế mã nguồn là 8085. |
| **Xác thực danh mục** | Gateway bắt buộc `ROLE_USER` hoặc `ROLE_ADMIN` để `GET /api/v1/products`. | Khách chưa đăng nhập vào trang chủ cần thấy thông báo yêu cầu đăng nhập, hoặc Frontend dev proxy tạm thời giả lập token để xem thử. | Chưa rõ ban quản trị có muốn mở public cho endpoint đọc sản phẩm hay không. |
| **Hình ảnh sản phẩm** | Thực thể `Product.java` chỉ có `productId`, `productName`, `category`, `material`, `gemstone`, `price`, `description`, `createdAt`, `active`. **Không có cột ảnh**. | Giao diện UI phải dùng cơ chế fallback: ảnh mockup tĩnh nội bộ dựa theo danh mục hoặc icon sang trọng. | Backend chưa có bảng lưu URL ảnh, chưa có dịch vụ tải file ảnh (S3 / Cloudinary / Local upload). |
| **Giỏ hàng (Cart)** | Backend **hoàn toàn không có** bảng Cart, CartItem hay Controller nào cho giỏ hàng. | Toàn bộ giỏ hàng phải lưu trữ Client-side (Local Storage / React State) và chỉ đẩy lên server tại thời điểm đặt hàng. | Rủi ro: Khách đổi thiết bị sẽ mất giỏ hàng; tồn kho giỏ hàng có thể biến động trước khi bấm đặt hàng. |
| **Thanh toán (Payment)** | Trạng thái đơn dừng lại ở `AWAITING_PAYMENT`. Không có bảng thanh toán hay tích hợp VNPay/Momo/Stripe. | Màn hình thanh toán chỉ dừng lại ở bước "Xác nhận đặt hàng & giữ chỗ thành công", hiển thị mã đơn và trạng thái chờ thanh toán. | Không được tự ý đưa form nhập thẻ tín dụng hay workflow thanh toán giả định vào UI. |
| **Vận chuyển (Shipping)** | Tuyệt đối không có bảng, cột hay API nào về địa chỉ giao hàng, phí ship hay đối tác vận chuyển. | Tuân thủ nghiêm ngặt chỉ thị: **JewelryShop không có luồng giao hàng**. Mua và nhận hàng trực tiếp tại tiệm vàng/showroom. | Nghiêm cấm đưa form nhập địa chỉ giao hàng hoặc màn hình theo dõi hành trình đơn hàng. |
| **Đánh giá / Yêu thích** | Không có thực thể Review, Rating, Wishlist. | Loại bỏ hoàn toàn các tab Review, Rating stars có thể submit, Wishlist button khỏi scope khả dụng. | Nếu cần hiển thị trên UI, phải đánh dấu là "Tính năng đang chờ API". |
| **Tài liệu DESIGN.md & Stitch** | `DESIGN.md` và các file mockup Google Stitch không tồn tại trong toàn bộ workspace. | Phải tự xây dựng hệ thống thiết kế cao cấp (Luxury Jewelry Design System) tuân thủ triệt để token, bảng màu trang sức và các chuẩn mực WCAG. | Nêu trung thực việc không tìm thấy file để tránh ngộ nhận. |

