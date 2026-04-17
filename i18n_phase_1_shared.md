# Kế hoạch Chi tiết: Phase 1 - Global Layouts & Shared Components

Mục tiêu: Chuyển đổi ngôn ngữ cấu hình cốt lõi và các bộ phận hiển thị xuyên suốt website.

### 1. Thay đổi Cốt lõi
- [ ] Mở `frontend/src/i18n/LanguageContext.jsx`, sửa `DEFAULT_LANG` thành `'vi'`.
- [ ] Dọn dẹp sơ bộ `vi.json` và `en.json`. Đảm bảo file cấu trúc đúng theo cây màn hình.

### 2. Header (`src/components/Header/Header.jsx`)
- [ ] Menu chính: Home, About, Classes, Blog, Contacts, Instructors.
- [ ] Nút "Login/Register" và "Dashboard" khi đã đăng nhập.
- [ ] Text giỏ hàng (Cart) và "View Cart".

### 3. Footer (`src/components/Footer/Footer.jsx` hoặc tương tự)
- [ ] Tiêu đề các khối (Quick Links, Information, Contact Us).
- [ ] Chuỗi Copyright: "© Copyright 2026 Bakery...".
- [ ] Đoạn Text Newsletter: "Subscribe to our newsletter".

### 4. Các Shared Components (`src/components/Shared/`)
- [ ] `PageTitle.jsx`: Các text Breadcrumbs (Trang chủ / Danh mục / Tiêu đề).
- [ ] `TestimonialsSlider.jsx`: Dịch "What they say about us", "Customer Testimonials".
