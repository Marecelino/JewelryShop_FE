# REVERSE ENGINEERING RESPONSIVE DESIGN: NGUYÊN BẢN SOURCE VUEJS (IHOUZZ-COM)

> **Mã tài liệu:** `REV-RESP-VUE-01`  
> **Dự án nguồn:** `SOURCE_VUE` (`D:\tutor\ihouzz-com`)  
> **Dự án đích tham chiếu:** `SOURCE_REACT` (`D:\java\JewelryShop_FE\jewelryshop-frontend`)  
> **Vai trò:** Senior Frontend Engineer & UI/UX Architect  
> **Mục tiêu:** Báo cáo kỹ thuật chi tiết toàn diện về hiện trạng responsive, hệ thống breakpoints, layout behavior, UI components và đánh giá chất lượng responsive trong source code VueJS cũ.

---

## 1. Khảo sát kiến trúc Frontend của Source VueJS

### 1.1. Core Framework & Build Tools
- **Framework & Core Version:** `Nuxt 3` (`"nuxt": "^3.5.0"`) chạy trên nền **Vue 3** (`"vue": "^3.x"`) với TypeScript (`"typescript": "^5.2.2"`).
- **Kiểu render (Rendering Mode):** Single Page Application (SPA / Client-Side Rendering).  
  Dẫn chứng: Trong [nuxt.config.ts](file:///D:/tutor/ihouzz-com/nuxt.config.ts#L62), cấu hình toàn cục `ssr: false`, và toàn bộ các route chính (`/home`, `/sp-ihouzz`, `/news`, `/group`, `/post`, `/profile`, `/agent`, `/schedule`) đều được đặt `{ ssr: false }` trong `nitro.routeRules` (dòng 104-124).
- **CSS Preprocessor:** Sass/SCSS (`"sass": "^1.62.0"`).
- **CSS Framework & UI Component Libraries:**
  1. **Bootstrap 5.2.3:** (`"bootstrap": "^5.2.3"`). Cả compiled CSS (`bootstrap.min.css`) và SCSS nguồn (`assets/scss/vendors/bootstrap/...`) đều hiện diện. Bootstrap JS được nạp qua Nuxt plugin client-side [usebootstrap.client.ts](file:///D:/tutor/ihouzz-com/plugins/usebootstrap.client.ts).
  2. **Element Plus (1.1.0-beta.12):** Thư viện UI component dùng cho Dialog (`el-dialog`), Drawer (`el-drawer`), Tabs (`el-tabs`), Form controls (`el-input`, `el-select`, `el-radio-group`), Breadcrumbs (`el-breadcrumb`).
  3. **Sheltos Real Estate Template (Pixelstrap):** Toàn bộ giao diện storefront kế thừa từ theme thương mại Sheltos (`assets/scss/color1.scss`, `assets/scss/template/_responsive.scss`, `assets/scss/template/_admin-responsive.scss`).
  4. **Swiper Slider (`swiper: ^9.4.1`):** Sử dụng cho toàn bộ carousels, banner slider và gallery bất động sản.
  5. **Thư viện viewport & thiết bị:**
     - `@nuxtjs/device` (`^3.1.1`): Cung cấp object `$device` (xác định thiết bị dựa trên User-Agent string của HTTP request / browser headers).
     - `vue3-mq` (`3.1.0`): Thư viện định nghĩa Media Query trong Vue template/script.

### 1.2. Cấu trúc nạp CSS & Responsive Stylesheets
Stylesheets được nạp từ [nuxt.config.ts](file:///D:/tutor/ihouzz-com/nuxt.config.ts#L61):
```typescript
css: ['~/assets/scss/app.scss']
```
Chuỗi nạp stylesheet trong [app.scss](file:///D:/tutor/ihouzz-com/assets/scss/app.scss#L1-L16) bao gồm:
1. `color1.scss`: Khai báo CSS Custom Properties (`:root`), SCSS variables, mixins và import toàn bộ modules (`base/`, `components/`, `layout/`, `pages/`, `template/`).
2. `bootstrap.min.css`: Core grid 12 cột, utilities của Bootstrap 5.
3. `styles/index.scss` & `styles/_variables.scss`: Global overrides do đội ngũ dự án viết thêm (độ cao header `$appHeaderHeight: 60px`, biến z-index `$appZindexHeader: 20`, v.v.).
4. `template/_responsive.scss`: **File responsive khổng lồ với 13,911 dòng CSS**, chứa 39 khối `@media` xử lý ghi đè (override) giao diện từ 1883px xuống đến 320px.
5. `template/_admin-responsive.scss`: File responsive riêng cho các trang portal/admin quản trị (1,600+ dòng CSS với 22 khối `@media`).

---

## 2. Phân tích hệ thống Breakpoints thực tế trong Source VueJS

### 2.1. Chiến lược Responsive: Desktop-First Heavy Override
Khác với khuyến nghị chuẩn hiện đại là Mobile-First (`min-width`), source VueJS kế thừa template Sheltos áp dụng triệt để **Desktop-First (`max-width`)**.
- Các component được thiết kế mặc định cho màn hình desktop lớn (1440px - 1920px).
- Khi viewport thu hẹp, các khối `@media (max-width: ...)` liên tục ghi đè margin, padding, font-size, width và display.
- Hệ quả: Độ đặc hiệu (specificity) bị đẩy lên rất cao, xuất hiện hàng trăm khai báo `!important` để ép layout thay đổi trên mobile.

### 2.2. Bảng tổng hợp Breakpoints thực tế được phát hiện

| Nhóm Viewport | Breakpoint phát hiện | File nguồn tiêu biểu | Thành phần bị ảnh hưởng | Behavior & Đánh giá |
|---|---|---|---|---|
| **Ultra Wide** | `max-width: 1883px` | `template/_responsive.scss:4` | Top bar, banner padding | Thu hẹp container padding và khoảng cách icon |
| **Ultra Wide** | `max-width: 1800px` | `template/_responsive.scss:16` | Slider, property box | Giảm padding-right của banner slider |
| **Ultra Wide** | `max-width: 1740px` | `template/_responsive.scss:29` | Parallax layout, header | Điều chỉnh sub-menu position |
| **Wide Desktop**| `max-width: 1660px` | `template/_responsive.scss:60` | Banner search tab | Giảm padding ngang từ 100px xuống 70px |
| **Desktop High**| `max-width: 1544px` | `template/_responsive.scss:295`| Grid listing, property cards | Điều chỉnh width của cột search lọc |
| **Desktop Wide**| `min-width: 1461px` | `template/_responsive.scss:324`| `.container` toàn cục | Ép `.container { max-width: 1400px; }` (override Bootstrap chuẩn 1320px) |
| **Desktop Std** | `max-width: 1460px` | `template/_responsive.scss:437`| Property details, headers | Hơn 1,000 dòng override typography & padding |
| **Desktop Base**| `max-width: 1399px` | `template/_responsive.scss:1456`| Bootstrap xxl boundary | Chuyển layout 4 cột sang 3 cột hẹp |
| **Laptop Std**  | `max-width: 1366px` | `template/_responsive.scss:2063`| Video banner, sidebar | Giảm banner height từ 850px xuống 680px |
| **Desktop Low** | `max-width: 1199px` | `template/_responsive.scss:2317`<br>`layout/_header.scss:1834` | **Navigation Header chính** | **Điểm bẻ gãy chính 1:** Desktop nav biến mất, chuyển thành mobile drawer trượt từ phải sang trái (`right: -300px` -> `right: 0`) |
| **Tablet Landscape** | `max-width: 1024px` | `styles/_html-render.scss:103`<br>`post/ListCrossSellComponent.vue:138` | Rich text render, Modal Dialog | Modal width co từ 50% lên 70% |
| **Tablet Portrait**  | `max-width: 991px` | `template/_responsive.scss:3928`<br>`layout/_header.scss:2195` | **Grid & Container chính** | **Điểm bẻ gãy chính 2:** Bootstrap `lg`. 3 cột chuyển thành 2 cột; hero banner thu gọn |
| **Tablet Hybrid**    | `max-width: 768px` | `layout/sidebar/index.vue:462`<br>`RegionalRealEstate.vue:114` | Sidebar admin, Project list | Sidebar fixed biến thành drawer ẩn bên phải (`right: -100%`); JS chuyển data desktop -> mobile |
| **Mobile Landscape** | `max-width: 767px` | `template/_responsive.scss:6448`<br>`_property.scss:8249` | **Grid, Footer, Card** | **Điểm bẻ gãy chính 3:** Bootstrap `md`. 2 cột chuyển thành 1 cột; footer chuyển sang dạng accordion; padding section giảm 50% |
| **Mobile Hybrid**    | `max-width: 576px` | `template/_responsive.scss:8655` | Search tab, Filter form | Nút search chuyển full-width |
| **Mobile Standard**  | `max-width: 575px` | `template/_responsive.scss:8729`<br>`HomeSearchtab.vue:120` | Hero Title, Tabs, Dialogs | **Điểm bẻ gãy chính 4:** Bootstrap `sm`. Modal thành 100% full-screen; font size H1 giảm từ 33px xuống 22px |
| **Ad-hoc Micro**    | `max-width: 480px` | `template/_responsive.scss:11579`| Buttons, Icon box | Nút bấm stack dọc, touch padding tối thiểu |
| **Ad-hoc Micro**    | `max-width: 420px` | `template/_responsive.scss:12413`| Property price badge | Điều chỉnh khoảng cách icon và text |
| **Small Mobile**     | `max-width: 375px` | `template/_responsive.scss:13012`| Tag list, user badge | Tránh tràn màn hình iPhone SE |
| **Small Mobile**     | `max-width: 360px` | `template/_responsive.scss:13061`| Form inputs, card actions | Thu nhỏ font input xuống 12px |
| **Ultra-small**      | `max-width: 350px` | `HomeSearchtab.vue:123, 187` | Tab container, search bar | Cưỡng chế `width: calc(100vw - 48px);` do bị vỡ layout ở 350px |
| **Minimum Bound**    | `max-width: 320px` | `template/_responsive.scss:13874`| Breadcrumb, pagination | Mức hỗ trợ thấp nhất |

### 2.3. Nhận xét về kiến trúc Breakpoints của Vue
1. **Quá nhiều micro-breakpoints phân mảnh:** Có tới hơn 20 breakpoint tùy tiện (`1883px`, `1740px`, `1544px`, `1460px`, `719px`, `544px`, `526px`, `518px`, `502px`, `437px`, `420px`, `413px`, `404px`, `391px`, `388px`, `350px`, `339px`, `334px`, `327px`). Đây là bằng chứng của việc fix lỗi giao diện cục bộ (patch-work) thay vì xây dựng một hệ thống fluid layout nhất quán.
2. **Xung đột giữa 768px và 767px:** 
   - Bootstrap chuẩn dùng `@media (max-width: 767.98px)` (hoặc `767px`) cho mobile.
   - Nhiều component Vue tự viết (`sidebar/index.vue`, `RegionalRealEstate.vue`) lại dùng `@media (max-width: 768px)` và JS `window.innerWidth <= 768`. Ở đúng độ rộng 768px (iPad dọc), CSS của Bootstrap coi là Tablet (`md`), trong khi component lại kích hoạt giao diện Mobile, gây ra xung đột giật layout.

---

## 3. Phân tích chi tiết Responsive theo từng khu vực UI

### 3.1. Global Layout & Containers
- **File nguồn:** [color1.scss](file:///D:/tutor/ihouzz-com/assets/scss/color1.scss), [styles/index.scss](file:///D:/tutor/ihouzz-com/assets/scss/styles/index.scss), [template/_responsive.scss](file:///D:/tutor/ihouzz-com/assets/scss/template/_responsive.scss#L324).
- **Quy tắc Container:**
  - Viewport $\ge 1461\text{px}$: `.container` có `max-width: 1400px;` (override giá trị 1320px của Bootstrap 5).
  - Viewport $1200\text{px} - 1460\text{px}$: `.container` nhận max-width 1140px.
  - Viewport $992\text{px} - 1199\text{px}$: `.container` nhận max-width 960px.
  - Viewport $768\text{px} - 991\text{px}$: `.container` nhận max-width 720px.
  - Viewport $576\text{px} - 767\text{px}$: `.container` nhận max-width 540px.
  - Viewport $< 576\text{px}$: `.container` chuyển thành `width: 100%; padding-left: 15px; padding-right: 15px;`.
- **Viewport Height Fix:** Trong [styles/index.scss:42-45](file:///D:/tutor/ihouzz-com/assets/scss/styles/index.scss#L42-L45):
  ```scss
  #app {
    min-height: 100vh;
    min-height: calc(var(--vh, 1vh) * 100);
  }
  ```
  Đây là kỹ thuật tốt để xử lý thanh URL tự động co giãn trên trình duyệt di động (iOS Safari & Chrome Android).
- **Cấu trúc Admin Layout:** [components/layout/sidebar/index.vue](file:///D:/tutor/ihouzz-com/components/layout/sidebar/index.vue):
  - Desktop: Sidebar bên trái có 2 trạng thái: mở rộng `width: 216px;` hoặc thu gọn `width: 64px;`. Main header và body co giãn bằng công thức CSS:
    `width: calc(100vw - 216px); margin-left: 216px;` (hoặc `margin-left: 64px;`).
  - Mobile ($\le 768\text{px}$): Sidebar bị đẩy ra ngoài màn hình (`right: -100%; position: fixed;`). Khi người dùng ấn toggle, class `.menu-visible` được gán để trượt menu ra (`right: 0; width: 300px;`) đi kèm backdrop `.overlay` (`background: rgba(0,0,0,0.5); z-index: 1;`). Header và content co về `width: 100vw; margin-left: 0;`.

### 3.2. Header & Navigation
- **File nguồn:** [assets/scss/layout/_header.scss](file:///D:/tutor/ihouzz-com/assets/scss/layout/_header.scss), [components/layout/elements/headerElement/navmenu.vue](file:///D:/tutor/ihouzz-com/components/layout/elements/headerElement/navmenu.vue).
- **Desktop Behavior ($> 1199\text{px}$):**
  - Navigation dạng ngang (`.nav-menu > li { display: inline-block; }`).
  - Dropdown đa cấp kích hoạt bằng hover/click.
  - Nút hamburger ẩn (`.toggle-nav { display: none; }`).
- **Mobile/Tablet Transition Breakpoint ($1199\text{px}$):**
  - Khác với nhiều trang web chuyển menu ở 768px hay 991px, source VueJS chuyển sang Mobile Navigation ngay từ **$1199\text{px}$** (đầu dải Laptop/Tablet Landscape).
  - Dẫn chứng tại [layout/_header.scss:1854-1875](file:///D:/tutor/ihouzz-com/assets/scss/layout/_header.scss#L1854-L1875):
    ```scss
    @media (max-width: 1199px) {
      .main-navbar {
        .nav-menu {
          position: fixed;
          background-color: $white;
          width: 300px;
          top: 0;
          height: 100vh;
          right: -300px;
          z-index: 99;
          transition: all 0.3s ease;
          overflow-y: scroll;
          &.open {
            right: 0;
          }
          .back-btn {
            display: block; // Nút bấm "Back" ở đỉnh drawer mobile
          }
        }
      }
    }
    ```
- **Mobile Interaction:**
  - Nút mở menu: `.toggle-nav` với icon 3 sọc (`octicon:three-bars`).
  - Khi mở: Menu dạng Off-canvas trượt từ mép phải (`right: 0`), kèm overlay làm mờ nền màn hình.
  - Sub-menu: Chuyển từ dropdown bay (floating) sang dạng Accordion xổ dọc có dấu `+` và `-` (`.according-menu`).

### 3.3. Hero Section & Search Banner
- **File nguồn:** [components/home/ihouzz/HomeSearchtab.vue](file:///D:/tutor/ihouzz-com/components/home/ihouzz/HomeSearchtab.vue).
- **Phân tích vấn đề đặc trưng:**
  - Tiêu đề Hero: [HomeSearchtab.vue:115-126](file:///D:/tutor/ihouzz-com/components/home/ihouzz/HomeSearchtab.vue#L115-L126):
    - Desktop: `font-size: 33px; font-weight: 600;`
    - $\le 575\text{px}$: `font-size: 22px;`
    - $\le 350\text{px}$: `font-size: 18px;`
  - Vấn đề Hardcoded Width (Điểm trừ nghiêm trọng):
    Tại [HomeSearchtab.vue:178-207](file:///D:/tutor/ihouzz-com/components/home/ihouzz/HomeSearchtab.vue#L178-L207):
    ```scss
    .home-tabs {
      width: 500px;
      @media (max-width: 575px) {
        width: 350px; // Cố định 350px!
      }
      @media (max-width: 350px) {
        width: calc(100vw - 48px);
      }
    }
    .home-search {
      width: 500px;
      @media (max-width: 575px) {
        width: 350px; // Cố định 350px!
      }
      @media (max-width: 350px) {
        width: calc(100vw - 24px);
        width: calc(100vw - 48px); // Khai báo thừa đè lên nhau
      }
    }
    ```
    *Hậu quả thực tế:* Trên thiết bị có viewport 360px (hầu hết điện thoại Samsung Galaxy, Xiaomi giá rẻ), khung search chiếm 350px, chỉ còn dư đúng 10px cho 2 bên lề, khiến toàn bộ form bị lệch sang phải hoặc chạm viền khi có padding!

### 3.4. Grid & Card Layout (Thẻ Sản Phẩm / Bất Động Sản)
- **File nguồn:** [assets/scss/components/_property.scss](file:///D:/tutor/ihouzz-com/assets/scss/components/_property.scss), [assets/scss/template/_responsive.scss](file:///D:/tutor/ihouzz-com/assets/scss/template/_responsive.scss#L8249).
- **Hệ thống Grid cột:**
  - Viewport $\ge 1200\text{px}$: 4 cột (`col-xl-3`) hoặc 3 cột (`col-xl-4`).
  - Viewport $992\text{px} - 1199\text{px}$: 3 cột (`col-lg-4`) hoặc 2 cột (`col-lg-6`).
  - Viewport $768\text{px} - 991\text{px}$: 2 cột (`col-md-6`).
  - Viewport $< 768\text{px}$: 1 cột duy nhất (`col-12`).
- **Aspect Ratio của Hình Ảnh Card:**
  - Không sử dụng thuộc tính CSS hiện đại `aspect-ratio: 16/9` hay `aspect-ratio: 4/3`.
  - Thay vào đó, áp dụng kỹ thuật padding-top cổ điển: [template/_responsive.scss:8264-8267](file:///D:/tutor/ihouzz-com/assets/scss/template/_responsive.scss#L8264-L8267):
    ```scss
    .property-image {
      .bg-size {
        &:before {
          padding-top: 60%; // Giả lập tỷ lệ 5:3
        }
      }
    }
    ```
  - Thẻ `img` bị ẩn bằng class `.d-none`, hình ảnh được gán vào `background-image` thông qua inline style:
    `<div class="feature-image back-image" :style="'background-image: url(' + item.img + ')'">`.
    *Nhược điểm:* Trình duyệt không thể tận dụng native lazy loading (`loading="lazy"`), không có `srcset` cho màn hình retina hay mobile tiết kiệm dữ liệu.

### 3.5. Typography & Fluid Text
- **File nguồn:** [assets/scss/base/_typography.scss](file:///D:/tutor/ihouzz-com/assets/scss/base/_typography.scss#L118-L126).
- **Điểm sáng: Kỹ thuật CSS Lock Fluid Typography cho Tiêu đề chính H1:**
  ```scss
  h1 {
    font-size: calc(
      26px + (55 - 26) * ((100vw - 320px) / (1920 - 320))
    ) !important;
    font-weight: 700;
    line-height: 1.3;
  }
  ```
  - Tại viewport 320px: $font = 26\text{px}$.
  - Tại viewport 1920px: $font = 55\text{px}$.
  - Ở khoảng giữa: Tự động mượt mà tăng tỷ lệ theo độ rộng màn hình mà không cần bất kỳ media query nào.
- **Tiêu đề phụ và Body:**
  - `h2`: 30px (desktop), thu về 24px trên mobile thông qua `@media (max-width: 767px)`.
  - `h3`: 24px (desktop), tính toán động `calc(18px + (22 - 18) * ((100vw - 320px) / (1920 - 320)))` trong card properties ([_property.scss:100](file:///D:/tutor/ihouzz-com/assets/scss/components/_property.scss#L100)).
  - Body paragraph: `font-size: 15px; line-height: 1.6;` (desktop) giảm nhẹ xuống `14px; line-height: 1.5;` trên mobile.

### 3.6. Forms, Filters & Inputs
- **File nguồn:** [components/sell/SingleSelectDialog.vue](file:///D:/tutor/ihouzz-com/components/sell/SingleSelectDialog.vue), [components/post/ListCrossSellComponent.vue](file:///D:/tutor/ihouzz-com/components/post/ListCrossSellComponent.vue).
- **Mẫu thiết kế Adaptive Dialog (Rất tốt):**
  Trong [SingleSelectDialog.vue:1-28](file:///D:/tutor/ihouzz-com/components/sell/SingleSelectDialog.vue#L1-L28):
  - Trên Desktop (`d-none d-sm-flex`): Bộ lọc hiển thị dạng Dropdown Card nhỏ gọn gắn ngay dưới input.
  - Trên Mobile (`d-block d-sm-none`): Bộ lọc tự động chuyển sang `el-dialog` toàn màn hình (`width="100%"`), có nút Hủy/Xác nhận cố định dưới chân, giúp ngón tay thao tác dễ dàng trên màn hình cảm ứng.
- **Horizontal Chips Filter Scroll:**
  Trong [ListCrossSellComponent.vue:156-165](file:///D:/tutor/ihouzz-com/components/post/ListCrossSellComponent.vue#L156-L165):
  ```scss
  .app-filter {
    display: flex;
    flex-direction: row;
    column-gap: 10px;
    overflow-x: auto;
    scroll-behavior: smooth;
    scrollbar-width: none; // Ẩn scrollbar trên Firefox & Chrome
  }
  ```
  Thanh filter dạng chip cuộn ngang trên điện thoại giúp tiết kiệm diện tích chiều dọc tối đa.

### 3.7. Tables & Quản lý Dữ liệu lớn
- **File nguồn:** [components/post/ListCrossSellComponent.vue](file:///D:/tutor/ihouzz-com/components/post/ListCrossSellComponent.vue#L125), `ag-grid-vue3`.
- Trên desktop, bảng sử dụng thư viện AG Grid (`ag-grid-vue3`) với cố định cột và phân trang.
- Trên tablet/mobile: AG Grid gặp tình trạng co kéo cột nếu dữ liệu văn bản quá dài, nhà phát triển xử lý bằng cách bọc modal dialog phóng to tỷ lệ:
  [ListCrossSellComponent.vue:136-147](file:///D:/tutor/ihouzz-com/components/post/ListCrossSellComponent.vue#L136-L147):
  - Viewport $> 1024\text{px}$: Modal width 50%.
  - Viewport $\le 1024\text{px}$: Modal width 70%.
  - Viewport $\le 769\text{px}$: Modal width 90%.
  - Viewport $\le 575\text{px}$: Modal width 100%.

### 3.8. Modals, Drawers & Z-Index Management
- **File nguồn:** [assets/scss/styles/_variables.scss](file:///D:/tutor/ihouzz-com/assets/scss/styles/_variables.scss#L33-L36), [assets/scss/styles/index.scss](file:///D:/tutor/ihouzz-com/assets/scss/styles/index.scss#L465-L518).
- **Hệ thống Z-Index trong Vue:**
  - Header sticky: `$appZindexSticky: 10;`
  - Header app: `$appZindexHeader: 20;`
  - Dropdown menu user: `z-index: 1111;`
  - Sidebar mobile: `z-index: 1112;`
  - Element Plus Modal overlay: `z-index: 2000+` (mặc định của thư viện).
- **Mobile Modal Overrides:**
  - Modal content được khống chế chiều cao để tránh tràn màn hình di động:
    [styles/index.scss:631](file:///D:/tutor/ihouzz-com/assets/scss/styles/index.scss#L631): `max-height: 65vh; overflow: auto;`.

### 3.9. Footer
- **File nguồn:** [assets/scss/template/_responsive.scss:7765-7870](file:///D:/tutor/ihouzz-com/assets/scss/template/_responsive.scss#L7765-L7870).
- **Desktop:** Footer 4 hoặc 5 cột thông tin dàn trải đều (`col-xl-3`, `col-lg-3`), padding dọc 90px.
- **Mobile ($\le 767\text{px}$):**
  - Padding dọc rút gọn xuống 50px: `.footer { padding: 50px 0; }`.
  - Toàn bộ các cột chuyển thành xếp chồng (stack) 1 cột 100% width.
  - Tiêu đề cột footer (`.footer-title`) chuyển thành dạng Accordion có icon xổ xuống: `cursor: pointer; h5 { line-height: 1.2; margin-bottom: 0; }`.
  - Toàn bộ bản quyền và icon mạng xã hội ở Sub-footer chuyển từ căn phải (`text-end`) sang căn giữa màn hình (`text-align: center !important; margin-top: 5px;`).

---

## 4. Phân tích các trường hợp Responsive phụ thuộc JavaScript

Trong source VueJS, việc responsive không hoàn toàn do CSS đảm nhiệm mà có nhiều đoạn logic JS can thiệp trực tiếp:

### 4.1. Resize Listener không Debounce/Throttle
Tại [components/home/ihouzz/RegionalRealEstate.vue:113-124](file:///D:/tutor/ihouzz-com/components/home/ihouzz/RegionalRealEstate.vue#L113-L124):
```typescript
const updateData = () => {
  currentData.value = window.innerWidth <= 768 ? dataMobile : dataDesktop;
};

onMounted(() => {
  updateData();
  window.addEventListener('resize', updateData);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateData);
});
```
*Đánh giá:* Mỗi khi người dùng xoay màn hình hoặc resize cửa sổ, sự kiện `resize` bắn liên tục hàng chục lần mỗi giây, kích hoạt cập nhật biến phản ứng `currentData` gây re-render component không cần thiết vì thiếu hàm `debounce` hoặc `requestAnimationFrame`.

### 4.2. Xung đột giữa User-Agent `@nuxtjs/device` và CSS Media Queries
Tại [components/features/group/GroupCarouselComponent.vue:277-278](file:///D:/tutor/ihouzz-com/components/features/group/GroupCarouselComponent.vue#L277-L278) và [components/features/elearning/PropskillCourseCarouselComponent.vue:383](file:///D:/tutor/ihouzz-com/components/features/elearning/PropskillCourseCarouselComponent.vue#L383):
```typescript
slideNumber.value = base.device.isMobile ? 1 : 4;
isMobile.value = base.device.isMobile ? true : false;
```
*Phân tích rủi ro:*
- `base.device.isMobile` lấy từ User-Agent headers lúc tải trang.
- Nếu người dùng sử dụng máy tính bảng (iPad Pro có màn hình lớn như laptop), hoặc mở DevTools kiểm tra chế độ responsive, hoặc chia đôi màn hình (Split Screen trên iPad/Galaxy Tab), `base.device.isMobile` vẫn giữ giá trị tĩnh lúc load trang, không phản ánh đúng chiều rộng viewport hiện tại. Trong khi đó CSS Swiper vẫn co theo media queries, dẫn đến việc Swiper tính toán sai chiều rộng slide (`slidesPerView`), làm vỡ layout hiển thị ảnh.

---

## 5. Bảng tổng hợp đánh giá chất lượng Responsive (Audit Matrix)

| Hạng mục kiểm tra | Trạng thái | Bằng chứng mã nguồn | Nhận xét chi tiết & Hướng xử lý khi sang React |
|---|---|---|---|
| **Fluid Typography cho H1** | **GOOD** | `assets/scss/base/_typography.scss:119` | Công thức CSS Lock hoạt động trơn tru. Cần chuyển thành `clamp()` trong theme React. |
| **Adaptive Dialog / Filter** | **GOOD** | `components/sell/SingleSelectDialog.vue:1` | Pattern chuyển Popover sang Full Modal trên mobile rất thân thiện. Cần tái sử dụng trong React với MUI Dialog/Drawer. |
| **Chips Filter Horizontal Scroll** | **GOOD** | `components/post/ListCrossSellComponent.vue:162` | Tối ưu không gian dọc trên mobile xuất sắc. Áp dụng cho danh mục sản phẩm React. |
| **Mobile 100vh Fix** | **GOOD** | `assets/scss/styles/index.scss:44` | Tránh tràn màn hình khi xuất hiện thanh địa chỉ Safari. Cần dùng CSS `100dvh` hiện đại trong React. |
| **Touch Targets cho Icon/Buttons** | **NEED IMPROVEMENT** | `components/layout/sidebar/index.vue:8` | Một số icon chỉ có kích thước 24x24px, thiếu vùng đệm (padding) đạt chuẩn 44x44px của Apple/Google. |
| **Aspect Ratio Hình ảnh** | **NEED IMPROVEMENT** | `assets/scss/template/_responsive.scss:8266` | Dùng hack `padding-top: 60%`. Khi sang React, phải chuẩn hóa bằng `aspect-ratio: 4/5` hoặc `1/1` với `object-fit: cover`. |
| **Phân cấp Breakpoints** | **BAD** | `assets/scss/template/_responsive.scss` | Hơn 40 breakpoint rời rạc, file 13,900 dòng không thể bảo trì. Cần quy hoạch dứt khoát về 5 breakpoint chuẩn MUI. |
| **Hardcoded Widths** | **BAD** | `components/home/ihouzz/HomeSearchtab.vue:185` | `width: 350px` gây tràn lề trên thiết bị 360px. Cần triệt tiêu hoàn toàn fixed pixel width, thay bằng `width: 100%; max-width: ...`. |
| **Resize Event thiếu Throttling** | **BAD** | `components/home/ihouzz/RegionalRealEstate.vue:119` | Gây lag và giật khung hình khi người dùng xoay điện thoại hoặc đổi kích thước cửa sổ. |
| **User-Agent Device Sniffing** | **BAD** | `components/features/group/GroupCarouselComponent.vue:277` | `@nuxtjs/device` không đồng bộ với CSS media query khi chia đôi màn hình hoặc xoay máy. Phải dùng CSS hoặc React `useMediaQuery`. |

---
*Tài liệu được sinh ra từ quá trình reverse-engineering thực tế trên source code `D:\tutor\ihouzz-com`.*

