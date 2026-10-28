# 07. Sổ Đăng Ký Rủi Ro & Lỗ Hổng Backend (Backend Gaps & Risk Register)

> **Dự án**: JewelryShop Frontend Architecture & API Integration  
> **Trạng thái**: Sổ đăng ký rủi ro kỹ thuật (Planning Only)  
> **Nguyên tắc phân định**: Phân biệt rạch ròi giữa **Hiện Trạng Đang Tồn Tại Của Backend** và **Đề Xuất Cải Tiến Kỹ Thuật (Recommendations)**. Không tự ý sửa đổi mã backend trong pha này.

---

## 1. Danh Mục Lỗ Hổng API Chặn Luồng Giao Diện (Minimum API Gaps Blocking UI Flows)

Dưới đây là các điểm nghẽn kỹ thuật thực tế được kiểm toán từ mã nguồn backend gây ảnh hưởng trực tiếp đến trải nghiệm người dùng phía frontend:

| Mã Lỗ Hổng | Tên Lỗ Hổng Kỹ Thuật | Hiện Trạng Mã Nguồn Backend Đã Xác Minh | Tác Động Trực Tiếp Đến Giao Diện Frontend | Giải Pháp Tạm Thời Ở Frontend (Workaround) | Đề Xuất Cải Tiến Backend Lâu Dài (Backend Recommendation) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **GAP-01** | **Chưa cấu hình CORS trên API Gateway** | `api-gateway` không có bất kỳ cấu hình `CorsWebFilter` hay `globalcors` nào trong `application.properties` và `SecurityConfig.java`. | Mọi yêu cầu từ trình duyệt (`http://localhost:5173`) gửi trực tiếp tới `http://localhost:8085` sẽ bị chặn lỗi CORS preflight `OPTIONS`. | Cấu hình Vite Dev Server Reverse Proxy (`server.proxy` chuyển tiếp `/api` sang `http://localhost:8085`). | Bổ sung `CorsWebFilter` vào `SecurityConfig.java` của API Gateway cho phép các domain frontend được chỉ định. |
| **GAP-02** | **Chặn khách vãng lai xem danh mục sản phẩm** | `api-gateway/SecurityConfig.java` (dòng 92–96): `.pathMatchers(HttpMethod.GET, "/api/v1/products", "/api/v1/products/**").hasAnyRole("USER", "ADMIN")`. | Khách chưa đăng nhập vào trang chủ không thể xem bất kỳ sản phẩm nào (bị Gateway trả về `401 Unauthorized`). Giảm tỷ lệ chuyển đổi khách hàng nghiêm trọng. | Hiển thị màn hình chào mừng sang trọng yêu cầu đăng nhập/đăng ký trước khi xem bộ sưu tập. | Chuyển `GET /api/v1/products` và `GET /api/v1/products/**` sang `permitAll()` trên API Gateway để khách vãng lai duyệt được catalog. |
| **GAP-03** | **Không có cột lưu trữ ảnh và API tải ảnh** | Bảng `dbo.Products` và thực thể `Product.java` chỉ có các trường: `productId`, `productName`, `category`, `material`, `gemstone`, `price`, `description`, `createdAt`, `active`. **Không có cột `imageUrl`**. | Thẻ sản phẩm không có hình ảnh thật của món trang sức từ cơ sở dữ liệu. | Xây dựng hệ thống minh họa vector trang sức cao cấp (Jewelry Illustration Box) fallback theo danh mục (`Rings`, `Necklaces`,...). | Bổ sung cột `image_url VARCHAR(500)` vào bảng `dbo.Products` và hỗ trợ endpoint upload ảnh (S3 / Cloudinary). |
| **GAP-04** | **Không có API lưu trữ giỏ hàng (Cart Persistence)** | Toàn bộ 5 microservice không có bảng `carts`, `cart_items` hay Controller nào phục vụ giỏ hàng. | Khách hàng chuyển đổi giữa điện thoại và máy tính sẽ bị mất giỏ hàng; rủi ro sản phẩm trong giỏ bị người khác mua mất trước khi checkout. | Quản lý giỏ hàng hoàn toàn phía Client qua `localStorage`, kiểm tra giới hạn <= 10 cái/món và tổng <= 20 món trước khi gửi. | Xây dựng module Cart Service hoặc lưu giỏ hàng vào Redis/Database gắn theo `userId`. |
| **GAP-05** | **Thiếu API và quy trình thanh toán (Payment Workflow)** | `order-service` dừng lại ở trạng thái `AWAITING_PAYMENT`. Không có bảng thanh toán, không có webhook cổng thanh toán (VNPAY, Momo). | Không thể xây dựng bước thanh toán trực tuyến trên web. | Dừng luồng Checkout ở bước: *"Xác nhận giữ chỗ tại showroom thành công, vui lòng đến quầy thanh toán trong 15 phút"*. | Tích hợp cổng thanh toán trực tuyến (VNPAY / ZaloPay) và endpoint xác nhận thanh toán (`POST /api/v1/orders/{orderRef}/payments`). |
| **GAP-06** | **Thời hạn Access Token ngắn (15 phút) và thiếu Refresh Token** | `login-service` cấu hình `app.jwt.access-token-ttl=PT15M` và chỉ trả về `accessToken`. Không cấp `refreshToken`. | Người dùng bị đăng xuất đột ngột sau 15 phút sử dụng web, gây gián đoạn trải nghiệm khi đang chọn trang sức. | Hiển thị cảnh báo sắp hết phiên khi còn 2 phút; nếu token hết hạn, lưu URL hiện tại để chuyển hướng lại sau khi login. | Bổ sung cơ chế Refresh Token xoay vòng (Rotating Refresh Token) lưu trong HttpOnly Cookie với thời hạn 7 - 30 ngày. |
| **GAP-07** | **Endpoint phân trang V2 không được định tuyến qua Gateway** | `ProductV2Controller.java` (`/api/v2/products`) cung cấp phân trang `PagedModel`, nhưng Gateway chỉ định tuyến `/api/v1/products/**`. | Frontend không gọi được `/api/v2/products` qua Gateway (bị `401/403 denyAll`). | Sử dụng endpoint V1: `GET /api/v1/products` (lấy danh sách đầy đủ) hoặc `GET /api/v1/products/test-pagination?page=0&size=10`. | Thêm route cho `/api/v2/products/**` vào `api-gateway/application.properties` và `SecurityConfig.java`. |
| **GAP-08** | **Thiếu API cập nhật thông tin cá nhân và đổi mật khẩu** | `login-service` chỉ có endpoint đọc `GET /api/v1/auth/me`. Không có API `PUT /api/v1/auth/me` hay `POST /api/v1/auth/change-password`. | Màn hình Profile của người dùng chỉ ở chế độ Read-Only, không thể đổi mật khẩu hay cập nhật thông tin liên hệ. | Giao diện Profile chỉ hiển thị thông tin dạng thẻ cố định, ẩn các nút chỉnh sửa thông tin. | Bổ sung API cập nhật hồ sơ và đổi mật khẩu kèm xác thực mật khẩu cũ trong `login-service`. |

---

## 2. Sổ Đăng Ký Rủi Ro Bảo Mật & Kỹ Thuật (Security & Technical Risk Register)

| Mã Rủi Ro | Rủi Ro Kỹ Thuật / Bảo Mật | Mức Độ Nghiêm Trọng | Khả Năng Xảy Ra | Phân Tích Chi Tiết | Biện Pháp Kiểm Soát & Giảm Thiểu Phía Frontend |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **RSK-01** | **Lưu trữ JWT trong trình duyệt (LocalStorage)** | **Trung bình - Cao** | Trung bình | Token lưu trong `localStorage` có nguy cơ bị tấn công đọc trộm nếu ứng dụng dính lỗ hổng XSS từ thư viện bên thứ ba. | 1. Vệ sinh (Sanitize) toàn bộ dữ liệu đầu vào và hiển thị.<br>2. Cấu hình Content Security Policy (CSP) chặt chẽ.<br>3. Không bao giờ lưu trữ thông tin nhạy cảm (mật khẩu) trong storage. |
| **RSK-02** | **Xung đột Idempotency Key khi tạo đơn (409 Conflict)** | **Trung bình** | Thấp | Nếu người dùng bấm tạo đơn, sau đó sửa giỏ hàng và gửi lại với cùng một Idempotency Key cũ, `order-service` sẽ ném `IdempotencyConflictException` (409). | Mỗi lần người dùng thay đổi giỏ hàng hoặc mở lại popup checkout, frontend **bắt buộc sinh một UUID v4 mới hoàn toàn** cho tiêu đề `Idempotency-Key`. |
| **RSK-03** | **Lỗi Downstream Service 503 khi Inventory sập** | **Cao** | Trung bình | `ProductService.java` khi không kết nối được sang `inventory-service` sẽ ném `ResponseStatusException(503, "Inventory Service is currently unavailable")`. | Frontend bắt mã lỗi 503 tại Axios Interceptor, hiển thị banner cảnh báo hệ thống kiểm tra tồn kho đang bận, không làm trắng trang web. |
| **RSK-04** | **Lệch cấu trúc Error Response giữa Gateway và Service con** | **Thấp - Trung bình** | Cao | Khi lỗi từ Gateway trả về (`GatewayApiErrorResponse`), cấu trúc có thể hơi khác so với `ApiErrorResponse` từ Spring Boot MVC. | `src/api/errorHandler.ts` xây dựng parser linh hoạt, kiểm tra cả hai cấu trúc trường `message`, `error`, và `validationErrors` để hiển thị lỗi chính xác. |
| **RSK-05** | **Giữ chỗ quá 15 phút bị scheduler hủy tự động** | **Trung bình** | Cao | `InventoryReservationExpirationScheduler` chạy mỗi 60 giây quét các giữ chỗ hết hạn và giải phóng vật lý. Nếu khách hàng thanh toán muộn, đơn bị hủy. | Đặt đồng hồ đếm ngược (Countdown Timer 15 phút) nổi bật trên màn hình chi tiết đơn hàng để thông báo trực quan cho khách hàng. |

---

## 3. Các Khuyến Nghị Kỹ Thuật Tối Cần Thiết Cho Giai Đoạn Tiếp Theo

Để hệ thống JewelryShop có thể vận hành một cách thương mại và trơn tru nhất, chúng tôi đề xuất các ưu tiên nâng cấp backend sau khi giai đoạn lập kế hoạch này được phê duyệt:

1. **Ưu tiên 1 (Cực kỳ khẩn cấp)**: Bổ sung cấu hình CORS cho API Gateway và chuyển quyền xem danh mục sản phẩm (`GET /api/v1/products/**`) sang Public (`permitAll()`).
2. **Ưu tiên 2 (Cần thiết cho trải nghiệm UI)**: Thêm cột `image_url` vào bảng `dbo.Products` của Product Service và cung cấp ít nhất các đường dẫn ảnh demo trang sức chất lượng cao.
3. **Ưu tiên 3 (Cần thiết cho bảo mật phiên làm việc)**: Xây dựng cơ chế Refresh Token xoay vòng (Rotating Refresh Token) trong `login-service` để kéo dài phiên làm việc hợp lệ của khách hàng mà không làm giảm tính an toàn.
4. **Ưu tiên 4 (Cần thiết cho quy trình kinh doanh)**: Mở rộng định tuyến Gateway cho endpoint phân trang `/api/v2/products` để tối ưu tải trang khi danh mục sản phẩm tăng lên hàng nghìn món.

