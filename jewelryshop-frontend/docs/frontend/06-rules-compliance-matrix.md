# 06. Ma Trận Tuân Thủ Quy Chuẩn & Kỹ Năng Kỹ Thuật (Rules Compliance Matrix)

> **Dự án**: JewelryShop Frontend Architecture & Design Plan  
> **Trạng thái**: Báo cáo kiểm toán quy chuẩn kỹ thuật (Planning Only)  
> **Nguyên tắc trung thực**: Báo cáo chính xác tình trạng cài đặt thực tế của từng kỹ năng (Skill), liên kết nguồn, phiên bản và phương pháp giải quyết xung đột kỹ thuật.

---

## 1. Bảng Kiểm Toán Trạng Thái Cài Đặt Kỹ Năng (Skill Inventory & Installation Audit)

Theo chỉ dẫn kiểm tra: *"Nếu một kỹ năng bị thiếu hoặc không thể tiếp cận, hãy tuyên bố điều đó một cách trung thực. Không được tuyên bố là đã đọc kỹ năng đó."*

| Tên Kỹ Năng / Tài Liệu Quy Chuẩn | Nguồn Quy Chiếu | Tình Trạng Thực Tế Trong Workspace | Đường Dẫn Tệp Nếu Có | Đánh Giá Áp Dụng Cho Dự Án |
| :--- | :--- | :--- | :--- | :--- |
| **Official React Rules** | https://react.dev/reference/rules | **Sẵn sàng (Tài liệu chính thức React 19)** | `react.dev` | **Áp dụng bắt buộc**: Tính thuần túy của component, quy tắc Hooks, kỷ luật useEffect. |
| **`web-design-guidelines`** | https://github.com/vercel-labs/agent-skills | **ĐÃ CÀI ĐẶT** | `D:\java\JewelryShop_FE\jewelryshop-frontend\.agents\skills\web-design-guidelines\SKILL.md` | **Áp dụng toàn diện**: Tiếp cận bàn phím, tương phản màu, ngăn chặn layout shift, aria-labels. |
| **`ui-ux-pro-max`** | Kỹ năng thiết kế UI/UX đa nền tảng | **ĐÃ CÀI ĐẶT** | `D:\java\JewelryShop_FE\jewelryshop-frontend\.agents\skills\ui-ux-pro-max\SKILL.md` | **Áp dụng toàn diện**: Thiết kế Luxury Jewelry, bảng màu sang trọng, chuẩn vùng chạm >= 44x44px. |
| **`design-system`** | Token architecture & systematic design | **ĐÃ CÀI ĐẶT** | `D:\java\JewelryShop_FE\jewelryshop-frontend\.agents\skills\design-system\SKILL.md` | **Áp dụng toàn diện**: Kiến trúc Token 3 lớp (Primitive -> Semantic -> Component), Spacing 8dp rhythm. |
| **`ui-styling`** | UI Styling & references | **ĐÃ CÀI ĐẶT** | `D:\java\JewelryShop_FE\jewelryshop-frontend\.agents\skills\ui-styling\SKILL.md` | **Áp dụng tham khảo**: Kỹ thuật CSS Variables và cấu trúc layout. |
| **`brand`** | Brand guidelines extraction | **ĐÃ CÀI ĐẶT** | `D:\java\JewelryShop_FE\jewelryshop-frontend\.agents\skills\brand\SKILL.md` | **Áp dụng**: Định vị thương hiệu trang sức cao cấp. |
| **`react-best-practices`** | https://github.com/vercel-labs/agent-skills | **CHƯA CÀI ĐẶT (MISSING)** | Không tìm thấy trong workspace | Áp dụng theo các tiêu chuẩn React 19 và SPA best practices chính thống. |
| **`react`, `typescript`, `ui-design`, `feature-arch`, `tanstack-query`, `react-hook-form`, `zod`, `vitest`, `playwright`, `vercel-composition-patterns`** | https://github.com/PyModel/react-frontend-skills | **CHƯA CÀI ĐẶT (MISSING)** | Không tìm thấy trong workspace | Áp dụng theo tài liệu chuẩn của từng thư viện (TanStack Query v5 docs, React Hook Form docs, Zod docs). |
| **`frontend-design`** | Antigravity Awesome Skills | **CHƯA CÀI ĐẶT (MISSING)** | Không tìm thấy trong workspace | Không áp dụng tài liệu này; thay thế bằng kỹ năng `ui-ux-pro-max` đã có sẵn. |
| **`DESIGN.md` & Google Stitch Mockups** | Workspace Design Assets | **CHƯA CÓ (MISSING)** | Không tồn tại trong kho mã nguồn | Thay thế bằng Hệ thống Thiết kế Trang Sức Cao Cấp (Luxury Jewelry Design System) được xây dựng trong tài liệu 03. |

---

## 2. Ma Trận Tuân Thủ Quy Chuẩn & Quyết Định Dự Án (Compliance Matrix)

| Quy Chuẩn Kỹ Thuật (Rule / Skill) | Tóm Tắt Nguyên Tắc Cốt Lõi | Mức Độ Tương Thích Với Stack (Vite + React + MUI) | Quyết Định Thiết Kế Cụ Thể Trong Dự Án | Phương Pháp Xác Minh (Verification Method) |
| :--- | :--- | :--- | :--- | :--- |
| **React Rules: Component Purity** (`react.dev`) | Components phải là hàm thuần túy (Pure Functions), không làm thay đổi biến ngoài phạm vi khi đang render (No side-effects in render). | Tuyệt đối tương thích với React 19. | Không thay đổi mảng items của giỏ hàng hay gọi mutation trong quá trình render JSX; mọi hành động phụ đưa vào Event Handlers hoặc Query Mutations. | Kiểm tra bằng React StrictMode và Oxlint (`react/rules-of-hooks`). |
| **React Rules: Hooks Discipline** (`react.dev`) | Chỉ gọi Hook ở cấp cao nhất của Functional Component, không gọi trong vòng lặp `for` hay câu lệnh `if`. | Tuyệt đối tương thích. | Sử dụng các Custom Hooks (`useProductsQuery`, `useCartStore`) chuẩn mực; quản lý điều kiện bằng câu lệnh nội bộ trong hook. | Kiểm tra tự động bằng công cụ Oxlint tích hợp trong dự án frontend (`npm run lint`). |
| **React Rules: Avoid Derived State in Effects** | Không sử dụng `useEffect` để tính toán giá trị có thể suy ra từ Props hoặc State khác (Derived State). | Tuyệt đối tương thích. | Tổng tiền đơn hàng (`totalAmount`), tổng số món trong giỏ (`totalQuantity`) được tính trực tiếp từ mảng items (`items.reduce(...)`), không dùng State hay Effect thừa. | Code review kiến trúc tại `CartDrawer.tsx` và `CheckoutModal.tsx`. |
| **Vercel Web Interface Guidelines: Keyboard Navigation** | Mọi thành phần tương tác phải điều khiển được bằng bàn phím (Tab, Enter, Space, Escape, Arrows). | Rất tương thích với MUI Material. | Đảm bảo mọi Modal (`MUI Dialog`) có cơ chế Focus Trap tự động, phím `Escape` đóng popup, và không bao giờ tắt `outline: none` trên phần tử có focus. | Kiểm thử thực tế bằng cách duyệt toàn bộ website chỉ bằng bàn phím (Tab / Shift+Tab). |
| **Vercel Web Interface Guidelines: Layout Stability** | Ngăn chặn hiện tượng giật cục giao diện khi dữ liệu đang tải (Cumulative Layout Shift - CLS). | Rất tương thích. | Thiết kế khung `Skeleton` có cùng chiều cao và tỷ lệ khung hình chính xác với thẻ sản phẩm thật (`ProductCard`); danh sách bảng có kích thước hàng cố định. | Đo đạc chỉ số CLS qua công cụ Google Lighthouse (mục tiêu CLS < 0.1). |
| **ui-ux-pro-max: Mobile Touch Target Minimum** | Diện tích chạm của mọi phần tử tương tác trên thiết bị di động phải đạt tối thiểu **44x44px** (iOS) hoặc **48x48dp** (Android). | Rất tương thích. | Mọi nút tăng giảm số lượng giỏ hàng (`IconButton`), nút đóng modal, menu toggle đều có `minHeight: 44px, minWidth: 44px` với padding trong suốt mở rộng. | Kiểm tra kích thước bounding box trên màn hình mô phỏng iPhone 15 (393px width). |
| **ui-ux-pro-max: Text & Non-text Contrast** | Văn bản thông thường phải đạt tỷ lệ tương phản tối thiểu **4.5:1**; văn bản lớn và icon chức năng đạt tối thiểu **3:1**. | Rất tương thích với Theme MUI. | Chọn màu chữ trắng ngà `#F5F5F0` trên nền tối `#0F0F11` (tương phản 14.8:1); chữ xám phụ `#A3A3A0` (5.2:1); không dùng chữ xám mờ khó đọc. | Quét tự động bằng tiện ích Axe DevTools / WAVE Accessibility Checker. |
| **ui-ux-pro-max: No Emoji as Structural Icons** | Không sử dụng emoji (💎, 🛒, ⚙️) làm icon chức năng hoặc điều hướng vì không đồng nhất giữa các hệ điều hành và không thể kiểm soát bằng token. | Rất tương thích. | Sử dụng 100% SVG Vector Icons từ gói `@mui/icons-material` hoặc Phosphor Icons, đồng bộ độ dày nét và màu vàng kim theo theme. | Kiểm tra mã JSX loại bỏ hoàn toàn các ký tự emoji trong thẻ HTML và icon container. |
| **design-system: Three-Layer Token Architecture** | Kiến trúc token 3 lớp: Primitive (Giá trị thô) -> Semantic (Ý nghĩa nghiệp vụ) -> Component (Áp dụng cụ thể). | Tuyệt đối tương thích. | Xây dựng tệp `src/theme/palette.ts` với đầy đủ 3 lớp; không viết mã cứng (hardcode) mã màu hex trong các component riêng lẻ. | Kiểm tra qua công cụ linting và kiểm tra style token. |

---

## 3. Giải Quyết Các Điểm Xung Đột & Giao Thoa Giữa Các Quy Chuẩn (Conflict Resolution)

### Xung Đột 1: Quy chuẩn Tailwind CSS / Utility-first vs. Ngăn Xếp Dự Án (MUI Material + Emotion)
- **Nguồn gốc xung đột**: Nhiều tài liệu hướng dẫn từ Vercel Labs và cộng đồng web hiện đại mặc định sử dụng Tailwind CSS (`className="flex p-4 ..."`). Tuy nhiên, ngăn xếp kỹ thuật của dự án đã được ấn định là **MUI Material v9 + Emotion**.
- **Giải pháp dứt khoát**:
  - Không cài đặt thêm Tailwind CSS để tránh làm phình kích thước bundle và xung đột bộ máy styling của Emotion.
  - Áp dụng các quy tắc về nhịp điệu không gian, khoảng cách 8dp và token màu thông qua hệ thống `theme` của MUI và thuộc tính `sx` (`sx={{ display: 'flex', p: 2, gap: 1 }}`).
  - Toàn bộ các quy tắc về UX/Accessibility của Vercel vẫn được giữ nguyên vẹn 100%.

### Xung Đột 2: Mẫu Next.js Server Components / Server Actions vs. Ứng Dụng Vite SPA (Client-Side Rendering)
- **Nguồn gốc xung đột**: Các tài liệu thiết kế từ Vercel thường hướng tới kiến trúc Next.js App Router với Server Components và Server Actions. Dự án JewelryShop Frontend là **Single Page Application (SPA) xây dựng bằng Vite**.
- **Giải pháp dứt khoát**:
  - Mọi thao tác lấy dữ liệu (Data Fetching), biến đổi dữ liệu (Mutations), và quản lý cache được chuyển giao trọn vẹn cho **TanStack Query (React Query v5)** hoạt động phía client.
  - Toàn bộ bảo mật token JWT diễn ra ở client (gắn Bearer token) và được xác thực tập trung tại API Gateway Spring Cloud.

### Xung Đột 3: Quy Trình Thương Mại Điện Tử Tiêu Chuẩn (Có Giao Hàng) vs. Ràng Buộc Nghiệp Vụ Của JewelryShop (Không Có Vận Chuyển)
- **Nguồn gốc xung đột**: Các mẫu thiết kế e-commerce thông thường luôn bao gồm các bước: Nhập địa chỉ giao hàng, chọn đơn vị vận chuyển (Giao Hàng Nhanh, Viettel Post), tính phí ship.
- **Giải pháp dứt khoát**:
  - **Triệt để loại bỏ** mọi thành phần liên quan đến vận chuyển.
  - Thay thế toàn bộ luồng Checkout bằng: **Xác Nhận Giữ Chỗ Món Đồ Tại Quầy Trong 15 Phút (Showroom Physical Reservation)**.
  - Việc này vừa bảo toàn tính toàn vẹn của mã nguồn backend (không có bảng shipping), vừa đáp ứng tuyệt đối yêu cầu kinh doanh.

