# Kế hoạch Chi tiết: Phase 2 - Các Trang Công Khai (Public Pages)

Mục tiêu: Dịch toàn bộ Hardcoded text còn sót lại ở Homepage và các trang thông tin phụ trợ.

### 1. Trang Chủ (`src/pages/Home.jsx` & `src/components/Home/`)
- Mặc dù một phần lớn trang chủ đã dùng hàm `t()` từ trước, cần rà lại:
- [ ] `HomeSlider.jsx`: Các nút bấm như "View details".
- [ ] `HomeClasses.jsx`: Nhãn "Premium", "Lessons", nút điều hướng.
- [ ] `HomeAbout.jsx`: Đảm bảo toàn bộ nội dung khối vĩ mô (Who we are, Our philosophy) nằm trong i18n JSON.
- [ ] `HomeFAQ.jsx`, `HomeTimetables.jsx`, `HomeContacts.jsx`: Các tựa đề và Placeholder form.
- [ ] `HomeBlog.jsx`: Phần lọc Categories (đã sửa nhưng kiểm tra xem dòng "Admin" hay "Uncategorized" và "All Categories" đã `t()` hết chưa).

### 2. Trang Phụ (`src/pages/About.jsx`, `Contact.jsx`, `NotFound.jsx`)
- [ ] `About.jsx`: Dịch toàn bộ History, Vision đoạn Text cứng.
- [ ] `Contact.jsx`: Placeholder "Your Name", "Message", Nút "Send Message".
- [ ] `NotFound.jsx`: "404", "Page not found", Nút "Go back to Home".
