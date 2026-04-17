# Kế hoạch Chi tiết: Hệ thống BE & Database Thuần Việt

Mục tiêu: Đảm bảo toàn bộ Database Seed và API responses được viết bằng tiếng Việt chuẩn.

### 1. `backend/prisma/seed.js`
- Xóa Data hiện tại và dùng `npx prisma db push --force-reset` hoặc `npx prisma db seed`.
- [ ] Dịch Tên/Tiêu đề của 9 Khóa học (Ví dụ: "Basic Bread Making" -> "Làm bánh mì cơ bản").
- [ ] Dịch Tiểu sử của các Giảng viên (Chiefs).
- [ ] Dịch Tên Danh mục (Ví dụ "Bread", "Cake" -> "Bánh mì", "Bánh ngọt").
- [ ] Dịch Tiêu đề & Nội dung mẫu của Blog.
- [ ] Dịch các Feedback của Testimonials.

### 2. Dịch Messages trong `backend/src/controllers/`
*Dò tìm toàn bộ `res.status(xx).json({ message: "..." })`*
- [ ] `authController.js`: "Tài khoản không tồn tại", "Sai mật khẩu", v.v.
- [ ] `chiefController.js`, `programController.js`, `postController.js`: "Không tìm thấy dữ liệu".
- [ ] `enrollmentController.js`: "Bạn đã đăng ký khóa học này rồi".
- [ ] `orderController.js`, `paymentConfigController.js`: "Lỗi tạo hóa đơn".
- [ ] Các logic validate Input: "Thiếu trường bắt buộc".
