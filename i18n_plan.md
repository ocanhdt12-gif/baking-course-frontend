# Kế hoạch Phủ sóng Ngôn ngữ (Frontend i18n & Backend Thuần Việt)

Mục tiêu mới: 
- **Frontend**: Toàn bộ UI sẽ thiết lập chuẩn `i18n` (hỗ trợ Tiếng Anh và Tiếng Việt), thiết lập Tiếng Việt (`vi`) làm ngôn ngữ mặc định. Việc audit sẽ diễn ra cuốn chiếu theo từng nhóm màn hình.
- **Backend & Database**: Backend KHÔNG dùng i18n. Toàn bộ các API response (thông báo lỗi, thông báo thành công) và dữ liệu Data trong Database (Seed Data) sẽ được dịch hoàn toàn sang Tiếng Việt.

---

## 1. Cập nhật Backend & Database (Thuần Việt)
- [ ] **Data Core (`seed.js`)**: Thay toàn bộ Data mẫu Tiếng Anh (Tên khóa học, Title bài viết, Bio giảng viên) thành Tiếng Việt. Chạy lại Script Seed.
- [ ] **API Response (`controllers/`)**: Dịch toàn bộ Hardcoded Error/Success messages trong API về Tiếng Việt.

---

## 2. Frontend i18n (Trọng tâm)

### Thay đổi Cốt lõi
- [ ] Đổi `DEFAULT_LANG` từ `'en'` sang `'vi'` trong `src/i18n/LanguageContext.jsx`.

### Phase 1: Thành phần dùng chung (Global Layouts & Components)
- [ ] **Header**: Thanh điều hướng, Nút Đăng nhập, Giỏ hàng.
- [ ] **Footer**: Dữ liệu copyright, Liên hệ, Newsletter.
- [ ] **Shared**: Tiêu đề trang (PageTitle), Breadcrumbs, Băng đánh giá.

### Phase 2: Các trang nội dung phổ thông (Public Pages)
- [ ] **Trang chủ (`Home.jsx` & Components)**: Các Sections chính.
- [ ] **Trang Giới thiệu (`About.jsx`)**.
- **Trang Liên hệ (`Contact.jsx`)**.
- [ ] **Trang 404 (`NotFound.jsx`)**.

### Phase 3: Khu vực Khóa học & Giảng viên (Programs & Chiefs)
- [ ] **Danh sách Lớp học (`Program.jsx`)**: Bộ lọc, Card.
- [ ] **Chi tiết Khóa học (`ProgramDetail.jsx`)**: Tab Curriculum, Nút Mua hàng.
- [ ] **Giảng viên (`Chiefs.jsx`, `ChiefDetail.jsx`)**: Kỹ năng, Khóa.
- [ ] **Bài viết Blog (`PostDetail.jsx`)**.

### Phase 4: Thanh toán và Thương mại (Checkout Flow)
- [ ] **Thanh toán (`Checkout.jsx`)**.
- [ ] **Kết quả Giao dịch (`PaymentResult.jsx`)**.
- [ ] **Biên lai (`Receipt.jsx`)**.

### Phase 5: Khu vực Nội bộ & Admin
- [ ] **Xác thực (`Auth.jsx`)**: Form Đăng nhập & Đăng ký.
- [ ] **Học viên (`UserDashboard.jsx`)**: Khóa học, tiến độ.
- [ ] **Admin (`AdminDashboard.jsx`, Editors)**: Menu điều hướng, Form.
