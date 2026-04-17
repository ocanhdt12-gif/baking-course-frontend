# Kế hoạch Chi tiết: Phase 4 & 5 - Luồng Thanh Toán & Portal Người dùng

Mục tiêu: Dịch toàn bộ hệ thống nhạy cảm (Thanh toán, Xác thực, Quản trị).

### 1. Payment Flow (`Checkout.jsx`, `PaymentResult.jsx`, `Receipt.jsx`)
- [ ] Nhãn nhập liệu thanh toán: "Given Name", "Email Address".
- [ ] Box thông tin: "Order Summary", "Total", "Discount", Nút "Proceed to Payment".
- [ ] Thông điệp VNPAY/VietQR: "Đang quét mã", "Giao dịch thành công", "Hệ thống đang xử lý, vui lòng không tắt trang...".
- [ ] Receipt: "Invoice ID", "Date issued".

### 2. Authentication (`Auth.jsx`)
- [ ] "Sign In", "Create an Account", "Forgot Password".
- [ ] Placeholder Form, cờ cảnh báo lỗi validation (v.d. "Email is required").

### 3. Dashboard (`UserDashboard.jsx`, `AdminDashboard.jsx`, etc.)
- [ ] Thanh Sidebar của Account: "My Courses", "Profile", "Certificates", "Logout".
- [ ] Admin: Toàn bộ Header Bảng và menu "Manage Classes", "Manage Users", Thống kê Doanh thu ("Total Revenue", "Sales").
