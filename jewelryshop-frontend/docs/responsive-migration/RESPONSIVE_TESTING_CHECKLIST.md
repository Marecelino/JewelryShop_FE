# CHECKLIST KIỂM THỬ RESPONSIVE DÀNH CHO DEVELOPER VÀ QA (REACT 19 + MUI v9)

> **Mã tài liệu:** `RTC-REACT-04`  
> **Dự án áp dụng:** `SOURCE_REACT` (`D:\java\JewelryShop_FE\jewelryshop-frontend`)  
> **Mục tiêu:** Cung cấp ma trận kiểm thử chi tiết, kịch bản kiểm thử biên (edge cases) và tiêu chí nghiệm thu (Acceptance Criteria) để Developer và QA rà soát toàn diện trước khi bàn giao tính năng.

---

## 1. Ma trận Kích thước Viewport Kiểm Thử Chuẩn (Device Coverage Matrix)

Toàn bộ các màn hình chính (Storefront Layout, Catalog, Product Detail, Cart Drawer, Checkout, Admin Portal) bắt buộc phải vượt qua kiểm tra hiển thị trên 12 kích thước chuẩn sau:

| STT | Phân nhóm Thiết bị | Viewport (Width × Height) | Thiết bị Đại diện | Điểm kiểm tra trọng yếu | Kết quả (Pass/Fail) |
|---|---|---|---|---|---|
| **1** | **Small Mobile** | $320 \times 568$ | iPhone SE (Gen 1) | Tiêu đề H1 không tràn, Nút bấm không bị chèn ép, Drawer co giãn vừa vặn | [ ] |
| **2** | **Standard Mobile** | $360 \times 800$ | Samsung Galaxy S20/A54 | Không tràn ngang form tìm kiếm (khắc phục lỗi 350px của Vue cũ) | [ ] |
| **3** | **Modern Mobile** | $375 \times 812$ | iPhone 12/13 Mini, iPhone X | Grid 2 cột sản phẩm đều đặn, tỷ lệ ảnh 4:5 giữ nguyên | [ ] |
| **4** | **Mainstream Mobile**| $390 \times 844$ | iPhone 13 / 14 / 15 / 16 | Header Sticky không che nội dung, Drawer mở mượt | [ ] |
| **5** | **Large Mobile** | $414 \times 896$ | iPhone 11 Pro Max, XR | Banner Hero căn giữa cân đối, font chữ không bị giãn quá mức | [ ] |
| **6** | **Small Tablet / Fold**| $600 \times 960$ | Galaxy Fold (Mở), Nexus 7 | Form chuyển từ 1 cột sang 2 cột, Grid sản phẩm mở rộng 2-3 cột | [ ] |
| **7** | **Tablet Portrait** | $768 \times 1024$ | iPad 9.7", 10.2", iPad Mini | Kiểm tra điểm bẻ gãy 768px: Không xung đột giữa Desktop và Mobile nav | [ ] |
| **8** | **Tablet Landscape**| $1024 \times 768$ | iPad ngang, iPad Pro 11" | Desktop navigation hiển thị ngang đầy đủ, Menu không bị ngắt dòng | [ ] |
| **9** | **Small Laptop** | $1280 \times 720$ | Macbook Air 11", HD Laptop | Layout 4 cột bắt đầu kích hoạt, Sidebar Admin hiển thị cố định | [ ] |
| **10**| **Mainstream Desktop**| $1366 \times 768$ | Laptop phổ thông 14-15.6" | Container căn giữa, không có khoảng trắng thừa kỳ lạ | [ ] |
| **11**| **FHD Desktop** | $1440 \times 900$ | MacBook Pro 14", FHD 1080p | Trải nghiệm tiêu chuẩn hoàn hảo, typography sắc nét | [ ] |
| **12**| **Ultra-wide Desktop**| $1920 \times 1080+$| Màn hình máy bàn 24-32", 2K | Container khống chế tối đa 1440px, lề 2 bên cân xứng | [ ] |

---

## 2. Kịch bản Kiểm Thử Các Tình Huống Biên (Edge Cases & Stress Testing)

### 2.1. Kiểm thử Xoay Màn hình (Orientation Changes)
- [ ] Xoay từ **Portrait sang Landscape** trên điện thoại:
  - Header sticky giảm chiều cao thích hợp, không chiếm quá 20% chiều cao màn hình.
  - Dialog modal không bị che mất nút "Xác Nhận" hoặc "Đóng" ở đáy màn hình.
- [ ] Xoay trên máy tính bảng:
  - Grid sản phẩm tự động chuyển từ 2 cột sang 3 hoặc 4 cột ngay lập tức không cần tải lại trang.

### 2.2. Kiểm thử Chiều dài Dữ liệu Bất thường (Content Stress Test)
- [ ] **Tên sản phẩm siêu dài:**
  - Tên trang sức dài hơn 80 ký tự (ví dụ: *"Nhẫn Kim Cương Nữ Vàng Trắng 18K Đính Đá Sapphire Tự Nhiên Độc Quyền Kim Ngân Phát"*).
  - *Yêu cầu:* Card sản phẩm sử dụng `WebkitLineClamp: 2` kèm dấu ba chấm `...`, không đẩy lệch độ cao các card bên cạnh trong cùng một hàng.
- [ ] **Giá tiền chữ số lớn:**
  - Giá trị hàng trăm triệu hoặc hàng tỷ đồng (`1.250.000.000 ₫`).
  - *Yêu cầu:* Số tiền không bị nhảy dòng kỳ lạ hoặc đè lên badge tình trạng kho.
- [ ] **Ảnh sản phẩm bị lỗi hoặc thiếu:**
  - Khi `primaryImageUrl` bị null hoặc URL hỏng (404).
  - *Yêu cầu:* Component fallback [JewelryIllustration](file:///D:/java/JewelryShop_FE/jewelryshop-frontend/src/components/common/JewelryIllustration.tsx) tự động hiển thị, giữ đúng tỷ lệ 4:5, không làm xô lệch card.

### 2.3. Kiểm thử Thu phóng Màn hình (Browser Zoom)
- [ ] **Zoom 125% và 150% trên Desktop:**
  - Layout tự động chuyển xuống breakpoint nhỏ hơn (ví dụ từ `lg` về `md` hoặc `sm`) mà không gây tràn ngang (horizontal scrollbar).
- [ ] **Zoom 200% (Tiêu chuẩn Trợ năng WCAG 2.1 AA):**
  - Toàn bộ văn bản vẫn đọc được, menu tự động chuyển sang dạng hamburger drawer để bảo vệ không gian.

---

## 3. Kiểm thử Trải nghiệm Cảm ứng & Khả năng Truy cập (Touch & Accessibility)

- [ ] **Kích thước Touch Target:**
  - Dùng công cụ inspect đo mọi nút bấm, icon button: chiều cao $\ge 44\text{px}$, chiều rộng $\ge 44\text{px}$.
  - Khoảng cách giữa 2 nút bấm liền kề tối thiểu 8px để tránh bấm nhầm.
- [ ] **Không bẫy Hover (No Hover Traps):**
  - Mọi thao tác mua hàng, xem chi tiết, chọn size đều thực hiện được bằng một lần chạm (tap).
  - Không có nội dung nào bị ẩn hoàn toàn nếu thiếu con trỏ chuột.
- [ ] **Điều hướng bằng bàn phím (Keyboard Navigation):**
  - Nhấn phím `Tab` duyệt qua toàn bộ link, nút, ô input.
  - Vòng sáng chỉ thị tiêu điểm (`:focus-visible`) hiển thị rõ ràng với viền vàng kim (`outline: 2px solid #B08D57`).
- [ ] **Tai thỏ và Thanh Home ảo (Safe Area Insets):**
  - Trên thiết bị iOS (iPhone có Dynamic Island hoặc tai thỏ): Kiểm tra phần đáy của Cart Drawer và Bottom Modal có khoảng đệm `env(safe-area-inset-bottom)`.

---

## 4. Tiêu chí Nghiệm Thu Responsive (Acceptance Criteria - Definition of Done)

Một trang hoặc component chỉ được nghiệm thu đạt chuẩn khi đáp ứng **100% các tiêu chí bắt buộc sau**:

1. **Không Tràn Ngang (Zero Horizontal Overflow):**  
   Thanh cuộn ngang tuyệt đối không được xuất hiện ở cấp độ `body` hoặc `window` ở bất kỳ kích thước nào từ $320\text{px}$ đến $2560\text{px}$. Ngoại trừ các container được chỉ định cuộn ngang có chủ đích (như Chips Filter hoặc TableContainer).
2. **Không Vỡ Khung Hình Card Sản Phẩm:**  
   Tất cả các card trong cùng một hàng trên Grid phải có chiều cao bằng nhau (`alignItems: 'stretch'`), ảnh giữ đúng tỷ lệ 4:5, không méo hình.
3. **Typography Dễ Đọc:**  
   Văn bản body tối thiểu 14px trên mobile, tiêu đề H1 không bị ngắt quãng vụn vặt, không che khuất các phần tử khác.
4. **Form Nhập Liệu Thân Thiện:**  
   Các ô `TextField` tự động chiếm 100% bề rộng trên mobile, nút bấm "Xác Nhận" hoặc "Thanh Toán" nằm ở vị trí dễ chạm bằng ngón tay cái.
5. **Modal & Dialog Hoạt Động Mượt Mà:**  
   Modal không vượt quá chiều cao viewport ($100\text{dvh}$ trên mobile, $\le 85\text{vh}$ trên desktop), phần thân có thanh cuộn riêng khi nội dung dài.
6. **Không Giật Layout (CLS < 0.1):**  
   Khi hình ảnh và font chữ tải xong, layout không bị nhảy giật bất thình lình nhờ việc đã định sẵn tỷ lệ `aspect-ratio` và khung xương tải trang (`LoadingSkeleton`).

---

## 5. Quy trình Kiểm thử Tự động với Công cụ Hiện Có

Dự án hiện có các công cụ kiểm thử tích hợp sẵn trong `package.json`:
- **Kiểm tra cú pháp Type TypeScript:**  
  `npm run typecheck` (`tsc -b --noEmit`)
- **Kiểm tra Linter siêu tốc:**  
  `npm run lint` (`oxlint`)
- **Kiểm tra Unit Test:**  
  `npm run test` (`node --test tests/unit.test.mjs`)

Trước khi bàn giao bất kỳ thay đổi nào liên quan đến Responsive, hãy chạy kiểm tra đảm bảo:
1. `npm run typecheck` không có lỗi Type nào.
2. `npm run lint` không có cảnh báo về cú pháp hoặc unused variables.
3. `npm run test` vượt qua toàn bộ các bài kiểm thử tiện ích format và idempotency.

---
*Tài liệu Checklist này là căn cứ chính thức để QA và Tech Lead phê duyệt Pull Request.*

