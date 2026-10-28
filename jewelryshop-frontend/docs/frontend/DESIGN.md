---
name: JewelryShop — Quiet Luxury
version: 1.0
purpose: Shared visual design language for the JewelryShop web experience and Google Stitch mockups.
platform: responsive-web
brand:
  name: JewelryShop
  personality: refined, warm, trustworthy, contemporary, product-first
  principles:
    - Product imagery leads; decoration never competes with jewelry.
    - Luxury comes from proportion, typography, whitespace, and material detail—not visual noise.
    - Shopping interactions stay clear, calm, and predictable.
    - Customer storefront and staff/admin tools use the same design tokens but distinct layouts.
colors:
  primary: "#2F2925"
  primary-hover: "#211D1A"
  secondary: "#B08D57"
  secondary-hover: "#927142"
  accent: "#D8C3A5"
  background: "#FAF8F5"
  surface: "#FFFFFF"
  surface-subtle: "#F2EEE8"
  text-primary: "#292521"
  text-secondary: "#6F675F"
  text-inverse: "#FFFFFF"
  border: "#E4DDD4"
  border-strong: "#C9BFB3"
  success: "#35664A"
  success-background: "#EAF3EC"
  warning: "#8B5E1A"
  warning-background: "#FAF0DC"
  error: "#A33B32"
  error-background: "#FBECEA"
  info: "#315C78"
  info-background: "#EAF2F7"
typography:
  display:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(2.5rem, 5vw, 4.75rem)"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-0.035em"
  h1:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(2.25rem, 4vw, 3.5rem)"
    fontWeight: 500
    lineHeight: 1.12
  h2:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(1.8rem, 3vw, 2.5rem)"
    fontWeight: 500
    lineHeight: 1.2
  h3:
    fontFamily: "DM Sans, Arial, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.35
  body:
    fontFamily: "DM Sans, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  bodySmall:
    fontFamily: "DM Sans, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "DM Sans, Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.06em"
  button:
    fontFamily: "DM Sans, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.2
rounded:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "18px"
  pill: "999px"
spacing:
  1: "4px"
  2: "8px"
  3: "12px"
  4: "16px"
  5: "20px"
  6: "24px"
  8: "32px"
  10: "40px"
  12: "48px"
  16: "64px"
  20: "80px"
breakpoints:
  mobile: "0–599px"
  tablet: "600–899px"
  desktop: "900–1199px"
  wide: "1200px and above"
shadows:
  subtle: "0 2px 8px rgba(41, 37, 33, 0.05)"
  cardHover: "0 12px 28px rgba(41, 37, 33, 0.10)"
  popover: "0 12px 32px rgba(41, 37, 33, 0.14)"
layout:
  contentMaxWidth: "1280px"
  textMaxWidth: "720px"
  desktopPageGutter: "48px"
  tabletPageGutter: "28px"
  mobilePageGutter: "20px"
components:
  buttonHeight: "48px"
  inputHeight: "48px"
  productImageRatio: "4:5"
  cardBorder: "1px solid #E4DDD4"
  focusRing: "0 0 0 3px rgba(176, 141, 87, 0.35)"
  tableRowMinHeight: "56px"
accessibility:
  minimumBodyFontSize: "14px"
  focusVisible: true
  respectReducedMotion: true
  doNotUseColorAloneForStatus: true
---

# JewelryShop Design Language

## 1. Visual concept

**Quiet luxury for a modern jewelry shop.** The interface should feel like a thoughtfully curated jewelry boutique: warm ivory surfaces, dark espresso typography, muted brushed-gold accents, editorial serif headlines, and generous whitespace. Product photography is the visual hero. Avoid a flashy luxury aesthetic, black-and-gold overload, excessive gradients, glassmorphism, or oversized decorative effects.

The interface should communicate **craft, clarity, and trust**. It should feel premium without making basic tasks difficult. Use warm materials and a careful grid, not decoration, to create distinction.

## 2. Color usage

- **Primary (`#2F2925`)**: main navigation text, primary buttons, strong headings, and high-priority actions.
- **Secondary (`#B08D57`)**: small accents, selected indicators, icons, thin rules, and restrained highlights. Do not use muted gold for small body text on ivory because contrast may be insufficient.
- **Background (`#FAF8F5`)**: the overall storefront canvas and quiet page sections.
- **Surface (`#FFFFFF`)**: product cards, forms, dialogs, menus, and content surfaces.
- **Surface subtle (`#F2EEE8`)**: filter panels, secondary bands, and low-emphasis sections.
- **Text primary (`#292521`)**: body copy and important content.
- **Text secondary (`#6F675F`)**: secondary labels and explanatory content.
- **Border (`#E4DDD4`)**: dividers, input outlines, and card boundaries.
- **Semantic colors**: use success, warning, error, and info tokens consistently. Always pair a semantic color with a label or icon; never communicate state by color alone.

Favor large quiet areas and a restrained accent ratio. A page should not look gold-colored; gold is a detail, not the canvas.

## 3. Typography

Use **Playfair Display** for editorial display headlines and selected section titles. Use **DM Sans** for navigation, body copy, product metadata, form labels, buttons, tables, and administrative screens. Use Georgia and Arial as graceful fallbacks. If these fonts are not available in the mockup environment, use a similar readable serif/sans-serif pairing rather than delaying the design.

- Headings should be concise, calm, and editorial.
- Product names should remain readable and may use a medium-weight sans-serif for scanability.
- Price is a key decision point: make it easy to find and visually clear without making it louder than the product name.
- Labels should not rely on uppercase alone to convey hierarchy.
- Keep line lengths comfortable and body text at least 14px.

## 4. Storefront layout

Use a centered responsive content grid with a maximum content width of approximately 1280px. On desktop, use spacious side gutters and clear horizontal alignment. On mobile, reduce gutters while keeping product images and controls comfortably tappable.

The storefront header should be restrained and purposeful: wordmark, a small set of primary navigation links, search if supported by the actual API, locale switcher, and account/cart actions only when their underlying flows exist. Avoid packing every possible action into the header.

Use editorial sections and product-led layouts. The homepage hero should combine one strong jewelry image with a short headline, one brief supporting sentence, and one clear CTA. Avoid carousels by default; a static hero is preferred unless there is a specific content reason to rotate imagery.

## 5. Product cards and jewelry imagery

- Use a consistent **4:5 portrait image ratio** for product tiles.
- Images should be large, clean, sharp, and evenly framed. Use neutral warm-gray, ivory, stone, or soft natural backgrounds.
- Show one product per card with enough whitespace to appreciate material and craftsmanship.
- Place product name, available material/category metadata, and price in a predictable order.
- Use restrained hover states: subtle image zoom or a soft shadow; respect reduced-motion preferences.
- Keep product imagery visually consistent in lighting and cropping.
- Mockup imagery and sample product copy are illustrative placeholders unless verified against the actual repository. Do not imply that image upload, image URLs, color/size variants, ratings, wishlist, or inventory detail fields exist in the API unless the backend audit confirms them.

## 6. Buttons and interactions

- **Primary action**: espresso-filled button with white text; use for the most important action on the page.
- **Secondary action**: white or transparent surface with an espresso border and text.
- **Text action**: simple text button for low-priority navigation.
- **Destructive action**: use the semantic error color and require confirmation when the action is destructive or difficult to reverse.
- Use sentence case, clear verbs, and consistent button heights.
- Buttons need visible hover, pressed, disabled, keyboard-focus, and loading states.
- Do not make a decorative surface look clickable unless it performs a real action.

## 7. Forms, feedback, and data views

Forms should feel calm and straightforward. Place a visible label above each input, explain requirements before submission where helpful, and show field-level validation near the relevant field. Preserve user input after recoverable errors. Use a clear summary for form-level API errors.

Use snackbars for brief non-blocking feedback, inline alerts for persistent or contextual errors, and dialogs only for decisions that genuinely require focus. Loading states should preserve layout dimensions to avoid visual jumps. Empty states should explain what is absent and provide a relevant next step when one exists.

For staff/admin screens (only when supported by actual APIs), reuse the brand tokens but prioritize information density, scanability, table clarity, filters, pagination, and explicit status text. Do not force editorial storefront layouts into management tables.

## 8. MUI implementation intent

When translated to React, use Material UI as the component base while customizing its theme to match this design language. Likely primitives include `AppBar`, `Toolbar`, `Container`, `Grid`, `Stack`, `Box`, `Typography`, `Button`, `TextField`, `Select`, `Card`, `CardMedia`, `Chip`, `Breadcrumbs`, `Dialog`, `Snackbar`, `Alert`, `Skeleton`, `Pagination`, `Drawer`, and table components. Use only the components relevant to confirmed page requirements.

Prefer theme tokens and reusable variants over ad-hoc inline styling. Use semantic HTML and accessible labels. Do not build a parallel design system on top of MUI without a clear reason.

## 9. Responsive behavior

- **Mobile (0–599px):** one- or two-column product grids depending on image size; compact navigation; filters in a drawer or bottom sheet; full-width form controls; minimum comfortable touch targets around 44px.
- **Tablet (600–899px):** two- or three-column product grid; balanced page gutters; navigation may simplify.
- **Desktop (900px+):** three- or four-column catalog grid according to available width; persistent filter sidebar only if it improves actual browsing; generous product-detail split layout.
- Prevent horizontal overflow. Let long product names and translated labels wrap gracefully.
- Do not hide critical actions on mobile. Maintain keyboard access for drawers, menus, dialogs, and language switching.

## 10. Accessibility and motion

Target WCAG 2.2 AA where practical. Maintain sufficient text and control contrast, keyboard navigation, visible focus, meaningful accessible names, correct heading order, properly associated form labels, alt text for meaningful product images, and focus management for dialogs and drawers. Do not use color alone to signal availability, errors, or order/reservation status.

Use transitions sparingly (roughly 150–220ms for small UI changes). Respect `prefers-reduced-motion`. Avoid parallax, auto-playing motion, and attention-grabbing animation that distracts from product discovery.

## 11. Internationalization

Design for Vietnamese and English from the beginning. Vietnamese is the default mockup language unless the user explicitly requests English. Allow text to expand by approximately 30% without breaking controls. Do not bake text into images. Leave room for a visible language selector and use locale-aware date, number, and currency formatting in the eventual implementation. Do not hardcode unverified currency or business policies into shared components.

## 12. Product and business integrity constraints

- JewelryShop does **not** provide shipping or delivery. Do not create shipping, delivery tracking, shipping-address, or delivery-method UI.
- Do not assume checkout, payment processing, discount codes, reviews, wishlist, account profile editing, product image upload, or admin permissions exist. Include these only after the repository/API audit confirms the necessary support.
- Do not design customer-facing controls for internal service-to-service APIs.
- Product availability, reservation state, pricing, order state, and permissions must be confirmed by the backend. The interface must not present a success state before a successful API response.
- Any sample data in Stitch is for visual exploration only, not a declaration of actual API fields or production data.

## 13. Mockup generation guardrails

Use this file as the source of truth for visual style. Create a coherent set of screens that clearly belong to the same product. Before creating detailed workflow screens, consult the backend capability matrix and include only supported actions. If the matrix is unavailable, restrict the first mockup pass to visual exploration of the public product-discovery experience and label any sample details as illustrative.

Do not generate implementation code in this design pass. Focus on screen composition, hierarchy, states, components, and user journeys. Keep screens plausible for implementation with React, TypeScript, Material UI, and `react-i18next`.
