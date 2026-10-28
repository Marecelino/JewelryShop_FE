# 03. Kế Hoạch Thiết Kế UI/UX & Bản Thiết Kế Giao Diện (UI/UX Design Plan)

> **Dự án**: JewelryShop Frontend Experience  
> **Trạng thái**: Kế hoạch & Thiết kế chi tiết (Planning Only)  
> **Thư viện UI nền tảng**: MUI Material v9 (`@mui/material`), Emotion (`@emotion/react`, `@emotion/styled`)  
> **Ngôn ngữ thiết kế**: Hệ thống thiết kế trang sức cao cấp (Luxury Jewelry Design System)

---

## 1. Định Hướng Thẩm Mỹ & Căn Cứ Thiết Kế (Design Direction & Aesthetic Positioning)

### 1.1. Hiện trạng tài liệu và định hướng
- **Kiểm tra thực tế kho mã nguồn**: Tệp `DESIGN.md` và các tệp mockup Google Stitch không tồn tại trong workspace `D:\java\JewelryShop` cũng như máy trạm.
- **Giải pháp chuyên nghiệp**: Thay vì tự ý bịa đặt hoặc phụ thuộc vào giả định, chúng tôi kiến tạo hệ thống thiết kế lấy cảm hứng từ các thương hiệu kim hoàn cao cấp quốc tế (Cartier, Tiffany & Co., Van Cleef & Arpels) kết hợp với các nguyên tắc trải nghiệm người dùng từ kỹ năng `ui-ux-pro-max` và `design-system`.
- **Tôn chỉ thẩm mỹ**: *"Tối Giản Sang Trọng, Đậm Chất Thủ Công & Chuẩn Mực Số Liệu Vật Lý"* (Quiet Luxury, Artisanal Elegance & Physical Precision). Giao diện tập trung tôn vinh giá trị của từng món trang sức (chất liệu vàng, giác cắt kim cương, độ tinh khiết) và sự minh bạch tuyệt đối về tình trạng giữ chỗ tại quầy.

---

## 2. Hệ Thống Token Thiết Kế (Design Token System)

### 2.1. Bảng màu chủ đạo (Color Palette Tokens)

Hệ thống màu sắc được chia thành 3 lớp: **Primitive -> Semantic -> Component**:

```
Primitive (Màu gốc)        -->  Semantic (Ý nghĩa nghiệp vụ)  -->  Component (Áp dụng UI)
#D4AF37 (Gold 500)         -->  var(--color-primary-gold)     -->  Button Background / Border
#0F0F11 (Obsidian 900)     -->  var(--surface-canvas-dark)    -->  Page Background
#2E7D32 (Emerald Green)    -->  var(--status-available)       -->  Stock Available Badge
#C62828 (Ruby Red)         -->  var(--status-sold-damaged)    -->  Error Alert / Sold Out
```

#### Bảng thông số màu chi tiết:

| Token Name | Mã Hex | Tên Gọi Ngành Kim Hoàn | Mục Đích Sử Dụng | Tiêu Chuẩn Tương Phản (WCAG) |
| :--- | :--- | :--- | :--- | :--- |
| `primary.main` | `#D4AF37` | **Metallic Gold** (Vàng Kim Hoàng Gia) | Nút bấm chính, viền active, điểm nhấn thương hiệu | Đạt 4.6:1 trên nền đen obsidian |
| `primary.light` | `#E5C158` | **Champagne Shimmer** (Vàng Sâm-panh) | Hover state, gradient ánh kim | Đạt tương phản trên nền tối |
| `primary.dark` | `#996515` | **Antique Bronze** (Vàng Đồng Cổ Điển) | Nút bấm trạng thái Active/Pressed | Sử dụng cho viền và điểm nhấn phụ |
| `background.default` (Dark) | `#0F0F11` | **Obsidian Jet Black** (Đá Hắc Ngà) | Nền tổng thể trang web (giao diện tối sang trọng) | Nền chuẩn cho trang sức |
| `background.paper` (Dark) | `#1A1A1E` | **Charcoal Slate** (Xám Than Đậm) | Nền thẻ sản phẩm (Card), hộp thoại Modal, Drawer | Phân tách lớp thị giác (Elevation 1) |
| `background.default` (Light)| `#FBFBF9` | **Pearl White Ivory** (Trắng Ngọc Trai) | Nền tổng thể khi người dùng chọn giao diện sáng | Nhẹ nhàng, trang nhã, không chói |
| `background.paper` (Light)  | `#FFFFFF` | **Pure Porcelain** (Trắng Sứ Tinh Khiết) | Nền thẻ sản phẩm giao diện sáng | Đổ bóng nhẹ nhàng |
| `text.primary` (Dark) | `#F5F5F0` | **Warm Alabaster** (Trắng Ngà Ấm) | Tiêu đề, thông số giá tiền, tên trang sức | Tương phản 14.8:1 trên nền `#0F0F11` |
| `text.secondary` (Dark) | `#A3A3A0` | **Muted Platinum** (Bạch Kim Mờ) | Mô tả chất liệu, nhãn phụ, ngày tháng | Tương phản 5.2:1 trên nền `#0F0F11` |
| `success.main` | `#2E7D32` | **Emerald Green** (Ngọc Lục Bảo) | Huy hiệu "Còn hàng tại quầy", Đơn xác nhận | Đạt chuẩn thông báo tích cực |
| `warning.main` | `#D97706` | **Amber Topaz** (Hoàng Ngọc Hổ Phách) | Huy hiệu "Đang giữ chỗ", "Chờ thanh toán" | Cảnh báo trạng thái tạm thời |
| `error.main` | `#C62828` | **Ruby Crimson** (Hồng Ngọc Đỏ) | Huy hiệu "Hết hàng", "Đơn đã hủy", Lỗi API | Cảnh báo trạng thái tiêu cực |

### 2.2. Hệ thống kiểu chữ (Typography Tokens)

- **Font tiêu đề (Display & Heading)**: Sử dụng font chữ có chân cổ điển, thanh lịch `Playfair Display` (hoặc `Cormorant Garamond`, fallback `Georgia, serif`). Đem lại cảm giác di sản kim hoàn lâu đời.
- **Font nội dung & dữ liệu số (Body & Data)**: Sử dụng font không chân hiện đại, tối ưu cho màn hình kỹ thuật số `Plus Jakarta Sans` hoặc `Inter` (fallback `system-ui, -apple-system, sans-serif`).
- **Quy tắc số liệu tiền tệ & trọng lượng**: Bắt buộc áp dụng thuộc tính CSS `font-variant-numeric: tabular-nums` cho toàn bộ các cột giá tiền VND, trọng lượng gram và tỷ lệ vàng nhằm đảm bảo các con số thẳng hàng hoàn hảo khi hiển thị trên bảng.

| Cấp Bậc (Scale) | Font Family | Kích Thước (Size) | Line Height | Letter Spacing | Font Weight | Áp Dụng Thực Tế |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `h1` | Serif Heading | `2.5rem` (40px) | 1.2 | `-0.02em` | 600 | Tiêu đề Hero Banner Trang chủ |
| `h2` | Serif Heading | `2.0rem` (32px) | 1.25 | `-0.01em` | 600 | Tiêu đề Tên Món Trang Sức (Product Detail) |
| `h3` | Serif Heading | `1.5rem` (24px) | 1.3 | `0em` | 600 | Tiêu đề Section Bộ Sưu Tập, Tiêu đề Modal |
| `h4` | Sans Body | `1.25rem` (20px) | 1.4 | `0.01em` | 600 | Tên sản phẩm trên Product Card |
| `body1` | Sans Body | `1.0rem` (16px) | 1.6 | `0.01em` | 400 | Văn bản mô tả sản phẩm, nội dung thông báo |
| `body2` | Sans Body | `0.875rem` (14px)| 1.5 | `0.01em` | 400 | Chữ phụ, bảng thông số kỹ thuật |
| `caption` | Sans Body | `0.75rem` (12px) | 1.4 | `0.02em` | 500 | Nhãn phụ, mã barcode, thời gian giữ chỗ |

### 2.3. Quy chuẩn khoảng cách & nhịp điệu không gian (Spacing & 8dp Rhythm)

Tuân thủ nguyên tắc không gian 8dp: Mọi padding, margin, khoảng cách cột (gap) đều là bội số của 8px:
- `theme.spacing(1)` = `8px`: Khoảng cách giữa icon và label, padding chip nhỏ.
- `theme.spacing(2)` = `16px`: Padding trong thẻ sản phẩm, khoảng cách giữa các input form.
- `theme.spacing(3)` = `24px`: Gutter cột lưới sản phẩm trên máy tính bảng.
- `theme.spacing(4)` = `32px`: Padding modal, khoảng cách giữa các khối nội dung.
- `theme.spacing(6)` = `48px`: Padding section trên trang chủ.
- `theme.spacing(8)` = `64px`: Khoảng cách giữa các phân đoạn lớn trên desktop.

---

## 3. Kiến Trúc Thông Tin & Điều Hướng (Information Architecture & Navigation)

```
[ Root Layout ]
   │
   ├── [ Top Header Bar ]
   │      ├── Logo "JEWELRY SHOP" (Trang trọng, ánh vàng kim)
   │      ├── Menu điều hướng: [Bộ Sưu Tập] [Về Showroom]
   │      ├── Ô tìm kiếm theo Thể loại / Chất liệu
   │      ├── Nút chọn ngôn ngữ: [VI | EN]
   │      ├── Nút Giỏ Hàng (Kèm Badge số lượng món <= 20)
   │      └── Khu vực Tài Khoản:
   │             ├── Chưa đăng nhập: [Đăng Nhập] [Đăng Ký]
   │             └── Đã đăng nhập: Avatar Menu -> [Hồ Sơ] [Đơn Hàng Của Tôi] [Quản Trị (Nếu Admin)] [Đăng Xuất]
   │
   ├── [ Main Content Canvas ]
   │      ├── Tuyến Khách Hàng: Catalog (/) -> Product Detail (/products/:id) -> Cart -> Checkout -> Order Detail
   │      └── Tuyến Quản Trị: Admin Products (/admin/products) -> Admin Inventory (/admin/inventory) -> Admin Orders
   │
   └── [ Luxury Footer ]
          ├── Thông điệp thương hiệu: "Cam kết vàng đủ tuổi & kim cương kiểm định quốc tế"
          ├── Giờ mở cửa Showroom & Địa chỉ đón tiếp khách hàng trực tiếp
          └── Tuyên bố bản quyền & Bảo mật thông tin
```

---

## 4. Thiết Kế Bố Cục Từng Trang & Ánh Xạ Component MUI (Page Layouts & MUI Mapping)

### 4.1. Trang Danh Mục Trang Sức & Bộ Lọc (Catalog Page - `/`)
- **Bố cục**: Giao diện hai cột dạng Split Screen trên Desktop (Cột trái: Bộ lọc danh mục 280px; Cột phải: Lưới sản phẩm dạng responsive grid). Trên Mobile, bộ lọc được thu vào một thanh `Drawer` trượt từ đáy màn hình.
- **Thẻ sản phẩm (Product Card - Component trọng tâm)**:
  - Do cơ sở dữ liệu `Product` **không có cột ảnh**, thiết kế thẻ trang bị **khối minh họa trang sức chuyên dụng (Curated Jewelry Illustration Box)**:
    - Nền gradient ánh xám bạc/than chì sang trọng (`linear-gradient(135deg, #1f1f24 0%, #141416 100%)`).
    - Biểu tượng vector ánh vàng kim tương ứng với danh mục:
      - Nhẫn (`Rings`): Biểu tượng nhẫn solitaire kim cương lấp lánh.
      - Dây chuyền (`Necklaces`): Biểu tượng mặt dây chuyền quý phái.
      - Bông tai (`Earrings`): Biểu tượng đôi hoa tai đá quý.
      - Vòng tay (`Bracelets`): Biểu tượng vòng vàng kiềng tinh xảo.
  - Phía trên góc phải thẻ: `MUI Chip` hiển thị tồn kho:
    - Nếu `availableQuantity > 0`: Chip màu xanh ngọc bích `Còn X món tại showroom`.
    - Nếu `availableQuantity == 0`: Chip màu xám than `Tạm hết hàng`.
    - Nếu `inventory == null` (do lỗi downstream 503): Chip màu vàng amber `Đang cập nhật tồn kho`.
  - Phía dưới thẻ: Tên sản phẩm, dòng chất liệu (`18K Gold • Diamond`), Giá tiền VND nổi bật, và nút `Thêm Vào Giỏ` (`MUI Button` viền vàng kim `outlined`).

### 4.2. Trang Chi Tiết Món Trang Sức (Product Detail - `/products/:id`)
- **Bố cục**: Khung hiển thị lớn dạng 2 cột (50% - 50% trên desktop):
  - Cột trái: Khung trưng bày sản phẩm sang trọng khổ lớn, cho phép phóng to chi tiết minh họa.
  - Cột phải: Bảng thông tin chế tác chi tiết:
    - Tiêu đề sản phẩm font Serif cỡ lớn.
    - Bảng thông số kỹ thuật (`MUI Table` viền siêu mỏng):
      - Chất liệu chính: `18K Gold` (Vàng 18K)
      - Đá quý đính kèm: `Diamond` (Kim cương tự nhiên)
      - Trạng thái kinh doanh: `Active`
      - Giá bán niêm yết: Định dạng tiền VND rõ ràng (VD: `5.500.000 ₫`)
    - Khối trạng thái kho vật lý:
      - Số lượng sẵn sàng phục vụ tại quầy (`availableQuantity`).
      - Số lượng đang được khách khác giữ chỗ (`reservedQuantity`).
    - Nút bấm chính: `MUI Button` nền vàng kim phủ bóng, chữ đen obsidian đậm: **"GIỮ CHỖ & TRẢI NGHIỆM TẠI SHOWROOM"**.

### 4.3. Giỏ Hàng & Modal Xác Nhận Giữ Chỗ (Cart & Checkout Flow)
- **Giỏ hàng trượt (Slide-over Cart Drawer)**:
  - Sử dụng `MUI Drawer` mở từ bên phải.
  - Danh sách từng món hàng: Tên, chất liệu, đơn giá, bộ đếm số lượng (`- 1 +`).
  - Ràng buộc trực quan: Tối đa 10 cái cho 1 món; tổng giỏ hàng hiển thị thanh tiến trình dung lượng (Ví dụ: `Đã chọn: 3/20 món`).
- **Modal Xác Nhận Đặt Hàng (Checkout Dialog)**:
  - Sử dụng `MUI Dialog` với viền vàng kim tinh tế (`border: 1px solid #D4AF37`).
  - Hộp thoại nhấn mạnh thông điệp nghiệp vụ:
    > **Cam kết giữ chỗ tại Showroom**:  
    > Món trang sức vật lý sẽ được hệ thống khóa và giữ riêng cho bạn tại quầy trong vòng **15 phút**. Vui lòng đến cửa hàng hoặc chuẩn bị thông tin thanh toán khi nhân viên liên hệ xác nhận.
  - Nút bấm: "XÁC NHẬN GIỮ CHỖ MÓN TRANG SỨC" (Kèm spinner khi đang gọi API).

### 4.4. Bảng Tra Cứu Đơn Hàng & Hủy Đơn (Order History & Cancellation)
- **Danh sách đơn hàng**: `MUI Table` với các cột: Mã tham chiếu đơn (`orderReference`), Ngày tạo, Tổng tiền, Trạng thái đơn, Thao tác.
- **Hộp thoại Hủy đơn hàng**:
  - `MUI Dialog` cảnh báo màu đỏ ruby:
    > **Xác nhận hủy đơn hàng**:  
    > Bạn có chắc chắn muốn hủy đơn hàng này không? Ngay sau khi hủy, các món trang sức đang được giữ chỗ sẽ được giải phóng và đưa trở lại tủ trưng bày để phục vụ khách hàng khác.

### 4.5. Bảng Ánh Xạ Thành Phần MUI Chi Tiết (MUI Component Mapping Table)

| Khái Niệm UI (UI Concept) | Component MUI Material v9 | Tùy Biến Style / Props | Trạng Thái Tiếp Cận (Accessibility) |
| :--- | :--- | :--- | :--- |
| **Thanh Header Trên Cùng** | `<AppBar>`, `<Toolbar>` | `position="sticky"`, nền `#0F0F11`, viền đáy `#26262B` | `role="banner"`, semantic `<header>` |
| **Lưới Thẻ Sản Phẩm** | `<Box sx={{ display: 'grid' }}>` | CSS Grid responsive: `1fr` -> `repeat(2, 1fr)` -> `repeat(3, 1fr)` | `role="region"`, `aria-label="Danh mục trang sức"` |
| **Thẻ Món Trang Sức** | `<Card>`, `<CardContent>`, `<CardActions>` | Bo góc `8px`, nền `#1A1A1E`, hover shadow ánh vàng nhẹ | `role="article"`, thẻ có focus outline rõ nét |
| **Huy Hiệu Tồn Kho** | `<Chip>` | Size `small`, bo góc `4px`, màu tương ứng với status | `aria-label="Tình trạng tồn kho"` |
| **Nút Bấm Chính (CTA)** | `<Button variant="contained">` | Màu nền `#D4AF37`, màu chữ `#0F0F11`, font-weight 600 | Chiều cao tối thiểu `48px`, tap target an toàn |
| **Hộp Thoại Xác Nhận / Hủy**| `<Dialog>`, `<DialogTitle>`, `<DialogContent>`, `<DialogActions>` | Hiệu ứng mờ nền (`backdropFilter: 'blur(4px)'`), Focus Trap tự động | `role="alertdialog"`, `aria-modal="true"` |
| **Bảng Quản Trị / Đơn Hàng** | `<Table>`, `<TableHead>`, `<TableBody>`, `<TableRow>`, `<TableCell>` | `size="medium"`, viền `#26262B`, chữ số `tabular-nums` | Semantic `<table>`, có `<th>` với `scope="col"` |
| **Thông Báo Kết Quả / Lỗi**| `<Alert>`, `<Snackbar>` | `variant="filled"`, bo góc `6px` | `aria-live="polite"` cho thông báo thường, `"assertive"` cho lỗi |
| **Trạng Thái Đang Tải** | `<Skeleton>`, `<CircularProgress>` | Skeleton hiệu ứng sóng mượt (`animation="wave"`), tông ấm xám | `aria-busy="true"` |

---

## 5. Chiến Lược Đa Ngôn Ngữ Tiếng Việt - Tiếng Anh (Localization Strategy)

### 5.1. Cấu hình i18next & react-i18next
- **Ngôn ngữ mặc định**: Tiếng Việt (`vi-VN`), cho phép chuyển đổi sang Tiếng Anh (`en-US`).
- **Phân chia Namespace**:
  - `common`: Các từ khóa giao diện chung (Đăng nhập, Đăng ký, Đăng xuất, Đóng, Xác nhận, Hủy bỏ, Đang xử lý).
  - `catalog`: Danh mục sản phẩm, bộ lọc chất liệu (Vàng 18K, Bạc, Bạch kim), đá quý (Kim cương, Ruby, Sapphire), tình trạng tồn kho.
  - `order`: Đặt hàng, giữ chỗ vật lý, mã đơn hàng, trạng thái đơn (Chờ thanh toán, Đã xác nhận, Đã hủy).
  - `inventory`: Thuật ngữ kho (Mã vạch barcode, Mã kiểm định, Trọng lượng gram, Độ tinh khiết, Vị trí khay).
  - `errors`: Thông báo lỗi API (Sai mật khẩu, Hết hàng, Hệ thống bảo trì).

### 5.2. Chuẩn hóa định dạng Tiền tệ & Thời gian
- **Tiền tệ (VND)**:
  - Tiếng Việt: `new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(5500000)` -> `5.500.000 ₫`
  - Tiếng Anh: `new Intl.NumberFormat('en-US', { style: 'currency', currency: 'VND' }).format(5500000)` -> `₫5,500,000`
- **Thời gian (ISO Instant / LocalDateTime)**:
  - Hiển thị theo múi giờ địa phương của người dùng (Việt Nam UTC+7):
  - Định dạng: `28/10/2026, 15:30` (Tiếng Việt) và `Oct 28, 2026, 3:30 PM` (Tiếng Anh).
- **Trọng lượng & Tỷ lệ**:
  - Trọng lượng: `3.750 g` (khoảng 1 chỉ vàng) - luôn giữ 3 chữ số thập phân theo chuẩn ngành kim hoàn.
  - Tuổi vàng: `99.99 %` (Vàng 24K ta) hoặc `75.00 %` (Vàng 18K).

