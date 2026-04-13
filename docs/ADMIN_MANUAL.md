# Sổ Tay Hướng Dẫn Quản Trị Hệ Thống Giao Diện (CMS)

Chào mừng bạn đến với Muka Bakery & Cooking Classes. Tài liệu này được thiết kế đặc biệt dựa trên **Góc nhìn Thực Tế của Website (Frontend)**. Nếu bạn muốn thay đổi bất kỳ thành phần nào trên trang chủ, trang khóa học hay bài viết, hãy tìm đến đúng phần được đánh dấu dưới đây để biết chính xác bạn cần click vào mục nào trong Admin Dashboard.

> **ĐĂNG NHẬP VÀO HỆ THỐNG:** 
> Vui lòng truy cập đường dẫn `/admin-login` (hoặc `/login`) bằng tài khoản Quản trị viên của bạn. Hệ thống sẽ ngay lập tức đẩy bạn đến bảng điều khiển nội bộ `/admin`. Mọi thay đổi trong Admin sẽ hiển thị tức khắc ra Website.

---

## 🏠 CHƯƠNG 1: THAY ĐỔI DỮ LIỆU TRANG CHỦ (HOME PAGE)

### 1.1 Khối Banner Quảng Cáo (Hero Header Slider)
*Khối ảnh lớn, chiếm toàn màn hình ở đầu trang chủ, có chữ nổi bật và nút "Enroll Now". Cùng với đồng hồ đếm ngược.*

* **Mục tiêu sửa đổi:** Thay đổi ảnh/bài nào được nằm ở Banner, hoặc lấy khóa học mới nhất ra trưng bày.
* **Nơi thao tác trong Admin:** `Manage Sliders`
* **Cách thực hiện:**
  - Kéo xuống danh sách `Available Programs` (Các khóa học đang chưa lên top).
  - Chọn nút màu xanh lục **[Add to Slider]** ở dưới ảnh một khóa học. 
* **Lưu ý đặc biệt (Quy Tắc):**
  - Khóa đó sẽ LẬP TỨC lên đầu Slider ở Trang Chủ.
  - Tuy nhiên, chỉ được Tối Đa 3 Khóa chễm chệ trên Slider, bạn phải bấm `[Remove from Slider]` ở khóa cũ nếu muốn chỗ cho khóa mới.
  - **Slider dùng đồng hồ đếm ngược:** Do đó, Khóa Học được lên Slider BẮT BUỘC phải có *Lớp Học (Class Session)* đang ghim lịch trong tương lai (Ví dụ lịch là ngày mai). Nếu đã quá hạn khai giảng, hệ thống sẽ khoá lại ghi nhãn màu vàng `Started/No Date` và không cho lên mâm!

### 1.2 Khối Lịch Đào Tạo (Timetable of Classes)
*Cái khối rất to ở giữa Trang Chủ có 7 Tab (Sunday, Monday...)*

* **Nơi thao tác trong Admin:** `Manage Programs` -> Bấm nút Sửa (Cây bút chì) khóa học cần mở lớp.
* **Cách thực hiện:**
  - Ở trang Sửa Toàn Màn Hình, cuộn chuột xuống khối **Class Cohorts & Schedules**.
  - Nhập **Day of Week** cho Lịch (Ví dụ: Tuesday).
  - Bấm `[Save Program]`.
* **Kết quả:** Ở trang chủ, ngay trong Tab Thứ 3 (Tuesday), một Card khóa học với hình ảnh của Khóa đó, giờ, tên giảng viên sẽ được sinh ra từ thinh không một cách đẹp đẽ. Nếu bạn xóa lịch đó ở Admin, Card trên lịch Trang Chủ cũng tự động biến mất!

### 1.3 Form Đăng Ký Nhanh (Quick Enrollment) cuối Trang Chủ
*Form chữ to có các trường: Full Name, Email, Phone, Tên Khóa Học.*

* **Cách hoạt động:** Khi người dùng ở trên trang **Chi tiết một Khoá Học** và lựa chọn Lớp Học cho họ (Ví dụ: Lớp Thứ 2), và ấn **Enroll Now**, hệ thống tự cuộn xuống đây.
* **Hiệu ứng:** Ô Dropdown Khóa Học sẽ tự động Autocomplete (chọn sẵn) đúng Lịch và Tên mà ng dùng vừa coi. Gửi Form ngay!
* **Dữ liệu bay đi đâu?:** Đọc `Chương 4`.

---

## 🎓 CHƯƠNG 2: TRANG KHÓA HỌC (PROGRAMS LIST & DETAIL)

### 2.1 Thay đổi Ảnh, Giá, Và Lời Mô Tả ngắn
* **Nơi thao tác trong Admin:** `Manage Programs` -> Khối đầu tiên `General Details`.
* **Tham số nổi bật:** Bạn có thể upload URL Ảnh bìa. Tên `Instructor Name` có thể là tên Đầu Bếp bạn muốn tự đánh chữ vào (Alexander Lamb...). Ngay khi bạn sửa, hệ thống thay mới toàn bộ.

### 2.2 Đổi Thanh Tiến Trình (You Will Learn)
*Đây là các thanh vạch chạy ngang (Progress Bar) từ 0% lên 100% khi vào trang Detail của Course.*

* **Nơi thao tác trong Admin:** `Manage Programs` -> Khối `You Will Learn`.
* **Tiện ích cực chất:** Bấm nút `[+] Add Skill` để nhét thêm hàng loạt các kiến thức (Ví dụ: Mixing - 40%, Baking - 80%). Cột màu đỏ là để xoá. Mọi thanh Bar đó sẽ sinh ra thành giao diện cực trực quan dưới phần Description trang Detail.

### 2.3 Sửa Lược Đồ Bài Giảng (Curriculum Accordion)
*Đây là giao diện khối nếp gấp, bấm vào Module 1 thì nội dung Module 1 xòe xuống, nội dung Module khác thu vỏ lại.*

* **Nơi thao tác trong Admin:** `Manage Programs` -> Khối `Curriculum Overview`.
* **Thực hiện:** Đừng hoảng sợ vì viết code HTML gấp khúc! Cứ bấm `[+] Add Module`, viết Tiêu đề và Mô tả bài học. Máy chủ tự phân cực và gói nó vào FrontEnd cực mượt giống như Designer thiết kế!

### 2.4 Thanh Toán Cột Phải (Select Cohort Dropdown)
*EndUser nhìn thấy 1 bảng Menu đăng ký bên phải màn hình.*

* **Nguyên lý hoạt động:** Cột bên phải chỉ hiện các khóa học nào được nhập ngày `Start Date` lớn hơn ngày hôm nay ở khoang **Class Cohorts & Schedules** (Manage Programs). Các khóa bị hết hạn ngày sẽ auto cất đi khỏi Menu.

---

## 📝 CHƯƠNG 3: BÀI VIẾT (BLOG & JOURNALS)

### 3.1 Giao diện bài viết chi tiết
*Bài viết blog đẹp như giao diện Báo Chí có in đậm và ảnh xòe.*

* **Nơi thao tác trong Admin:** `Manage Posts`.
* **Kỹ năng cần có:** Ngôn ngữ `Markdown`. Soạn thảo thẳng vào ô nội dung như sau:
  - **Làm đậm chữ:** Dùng thẻ `**Tên Bạn**`.
  - **In nghiêng:** Dùng thẻ `*Tên Bạn*`.
  - **Thêm Cân ảnh đính kèm:** `![Tên alt ảnh](http://duongdananh.com)`.
  - Bạn cũng có thể kéo Status từ `DRAFT` (Lưu Nháp) qua `PUBLISHED` (Cầm để public lên thanh Blog) một cách dễ dàng.

### 3.2 Khối Đọc Thêm (Related Posts)
*Nằm dưới chân bài đọc là 4 bài đọc kèm.*
* **Cơ chế Máy Chủ:** Khi bạn chọn 1 `Category` (Ví dụ: Lớp Dạy). Thì cột bên dưới sẽ tự lục 4 bài mới nhất ở mục `Lớp Dạy` lên cho khách để giữ khách nán lại đọc trang! Không cần tự chọn thủ công.

---

## 👥 CHƯƠNG 4: DANH SÁCH ĐĂNG KÝ (ENROLLMENTS & CONTACTS)

### 4.1 Khách Đăng Ký Khóa Học
*Khách vừa chốt Form ở cuối Trang Chủ (Home Page) hoặc Từ Nút Enroll Sidebar.*

* **Nơi thao tác trong Admin:** `Course Enrollments` (Ở thẻ Menu Trái).
* **Quản trị dòng tiền:**
  - Khách đăng ký sẽ bắn về với trạng thái **PENDING** (Chưa đóng tiền/xác minh).
  - Tên Khóa Học được tách chẻ rất sâu: *Ví dụ: Khóa Bánh Dâu Tây (Thứ 4 • 25/11)*.
  - Sau khi nhân sự Sale của bạn chốt Khách hàng đã nhận Lớp và Đặt Cọc Tiền Mặt/Chuyển khoản $\rightarrow$ Click trực tiếp Lên Nút màu Vàng! Nó sẽ chuyển trạng thái chốt xanh **CONFIRMED**. Cực kỳ rõ ràng!
  - Xóa đi những bài rác do Hacker đúp Form mà không lo gây hư hệ thống lưu trữ lớp học nào.

### 4.2 Lời nhắn chung (Generic Mails)
*Khách điền ở View Contact.jsx hoặc trang Giới Thiệu (About.jsx)*

* **Nơi thao tác trong Admin:** `Contact Messages`.
* **Cách quản lý:** Rất độc lập. Bạn có thể reply qua mail ngoài và Clear Delete các hộp thư này thường xuyên để nhường chỗ trống cho Database Cột Sống của máy chủ.

***

Tài liệu được phát triển phục vụ người xây dựng content - Muka Baking Flow. Đội ngũ Editor không cần động tay tới mã code. Chúc anh/chị quản lý hệ thống thành công!
