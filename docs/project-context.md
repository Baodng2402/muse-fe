# Muse: Nền tảng kết nối Thợ làm đẹp/Nhiếp ảnh với Mẫu & Khách hàng

## 1. Tổng quan dự án

### 1.1 Bối cảnh
Hiện tại, các thợ (và người đang học nghề) makeup, nail, photographer tại Việt Nam chủ yếu dùng Facebook để đăng bài tìm mẫu thực hành hoặc tìm khách hàng booking. Cách làm này có nhiều hạn chế: tin đăng dễ trôi, khó tìm kiếm/lọc theo nhu cầu, không có nơi tập trung portfolio đáng tin cậy để đánh giá tay nghề.

### 1.2 Mục tiêu sản phẩm
Xây dựng một web app đóng vai trò nền tảng trung gian **hai chiều** (2-sided marketplace), nơi bất kỳ bên nào cũng có thể chủ động đăng tin tìm bên còn lại — không chỉ chờ được liên hệ:
- Thợ/học viên có thể đăng tin **tìm mẫu** để thực hành tay nghề (chiều: provider → tìm customer/mẫu).
- Thợ chuyên nghiệp có thể đăng tin **nhận booking** để khách hàng đặt dịch vụ (chiều: provider → tìm customer, khách chủ động tìm/đặt ngược lại qua search).
- **Mẫu/freelancer** có thể đăng tin **rảnh lịch làm mẫu** để chủ động tìm thợ/brand thuê mình — không còn giới hạn ở "làm mẫu thực hành miễn phí", mà bao gồm cả **nhận freelance có trả phí** (chiều: mẫu → tìm provider/brand).
- Portfolio của từng người được trình bày chuyên nghiệp, giúp tăng độ tin cậy và thu hút đối tác ở cả 2 chiều.

### 1.3 Phạm vi giai đoạn đầu
- Chỉ triển khai **web app** (responsive, dùng được trên di động qua trình duyệt).
- Chưa phát triển native app — mục tiêu là giảm effort, validate nhu cầu thị trường trước khi đầu tư thêm.

## 2. Đối tượng người dùng

| Nhóm | Mô tả | Nhu cầu chính |
|---|---|---|
| Thợ/Học viên | Người làm hoặc đang học makeup, nail, photography | Tìm mẫu thực hành miễn phí/giá ưu đãi; xây dựng portfolio |
| Thợ chuyên nghiệp | Người đã hành nghề, muốn nhận khách trả phí | Đăng dịch vụ, nhận booking, trưng bày portfolio |
| Mẫu/Freelancer | Người muốn làm mẫu — vừa thực hành (miễn phí/giảm giá) vừa **nhận freelance kiếm tiền** | Tìm cơ hội làm đẹp/chụp ảnh miễn phí/giá rẻ để có portfolio; **và/hoặc** chủ động rao lịch rảnh để thợ/brand thuê trả phí |
| Khách hàng | Người cần thuê dịch vụ chuyên nghiệp | Tìm thợ uy tín theo khu vực, xem portfolio, đặt lịch |

*Lưu ý: Một tài khoản có thể vừa là "thợ" vừa là "khách hàng" tuỳ ngữ cảnh sử dụng.*

## 3. Phạm vi chức năng (Functional Requirements)

### 3.1 Quản lý tài khoản & Profile
- Đăng ký/đăng nhập (email hoặc SĐT).
- Thiết lập vai trò: cung cấp dịch vụ (thợ/học viên) và/hoặc khách hàng.
- Thông tin profile: tên, ảnh đại diện, khu vực, chuyên ngành, mô tả, cấp độ (đang học/có kinh nghiệm/chuyên nghiệp).

### 3.2 Portfolio
- Upload nhiều ảnh, gắn tag theo loại dịch vụ.
- Hỗ trợ ảnh before/after.
- Hiển thị dạng gallery, xem chi tiết ảnh.

### 3.3 Đăng tin
- **Loại A — Tìm mẫu** (provider đăng): dịch vụ cần thực hành, thời gian, khu vực, mức ưu đãi, yêu cầu với mẫu, số lượng slot.
- **Loại B — Nhận booking** (provider đăng): danh sách dịch vụ, giá tham khảo, lịch rảnh cơ bản (theo ngày trong tuần).
- **Loại C — Rảnh lịch / Tìm freelance** (mẫu/freelancer đăng, đảo chiều so với Loại A): mẫu tự rao lịch rảnh + loại hình muốn làm (mẫu ảnh, mẫu makeup, mẫu nail...) để thợ/brand chủ động liên hệ mời — bao gồm cả kỳ vọng **được trả phí** (mức giá mong muốn), không chỉ làm mẫu thực hành miễn phí. Đây là chiều còn thiếu để nền tảng thực sự 2 chiều: mẫu cũng là một bên "chào dịch vụ" chứ không chỉ bị động chờ được mời.

### 3.4 Tìm kiếm & Khám phá
- Filter theo dịch vụ, khu vực, loại tin, mức giá.
- Trang chủ hiển thị tin theo khu vực người dùng.
- Trang chi tiết profile kèm portfolio và tin đang đăng.

### 3.5 Kết nối
- Nút liên hệ (dẫn ra Zalo/Messenger/gọi điện) — chưa cần chat trong app ở bản đầu.
- Lưu/quan tâm tin đăng.

### 3.6 Đánh giá & Tin cậy
- Đánh giá sao + nhận xét hai chiều sau khi hoàn thành dịch vụ.
- Báo cáo (report) tin đăng/profile vi phạm.

### 3.7 Quản trị (Admin)
- Duyệt/ẩn tin vi phạm.
- Xử lý report.

## 4. Ngoài phạm vi (Out of Scope) — giai đoạn MVP
- Thanh toán/booking tự động trong app.
- Chat real-time trong app.
- Xác minh danh tính nâng cao (CCCD, chứng chỉ hành nghề).
- Native mobile app (iOS/Android).
- Gợi ý cá nhân hoá, tìm kiếm theo bản đồ.

## 5. Yêu cầu phi chức năng (Non-Functional Requirements)
- **Hiệu năng:** trang danh sách/tìm kiếm tải nhanh dù có nhiều ảnh portfolio (cần tối ưu ảnh, lazy loading).
- **Responsive:** giao diện dùng tốt trên mobile browser vì phần lớn user Việt Nam thao tác qua điện thoại.
- **Khả năng mở rộng:** kiến trúc cho phép thêm tính năng chat/booking/payment ở giai đoạn sau mà không phải viết lại từ đầu.
- **Bảo mật dữ liệu cơ bản:** mã hoá mật khẩu, giới hạn quyền truy cập dữ liệu cá nhân.
- **Ngôn ngữ:** giao diện tiếng Việt là chính.

## 6. Giả định & Rủi ro

### Giả định
- Người dùng có sẵn Zalo/Facebook Messenger để liên hệ trực tiếp sau khi kết nối qua nền tảng.
- Giai đoạn đầu tập trung vào một số thành phố lớn (HCM, Hà Nội...) để dễ đạt mật độ người dùng.

### Rủi ro
- **Bài toán con gà - quả trứng:** cần đủ cả hai phía (thợ và mẫu/khách hàng) để nền tảng có giá trị. Đề xuất: seed thủ công một phía trước khi mở rộng.
- **Cạnh tranh với thói quen dùng Facebook:** cần tạo lý do đủ mạnh để người dùng chuyển sang nền tảng mới (VD: portfolio tốt hơn, tìm kiếm dễ hơn).
- **Tin cậy & an toàn:** dịch vụ liên quan đến gặp mặt trực tiếp, cần cơ chế review và report từ sớm dù đơn giản.

## 7. Thứ tự triển khai đề xuất
1. Tài khoản & Profile
2. Portfolio
3. Đăng tin loại A (Tìm mẫu) — ưu tiên vì đây là pain point mạnh nhất
4. Tìm kiếm & Filter
5. Kết nối (liên hệ ngoài app)
6. Đánh giá
7. Đăng tin loại B (Nhận booking) — sau khi đã có lượng thợ/portfolio đủ dày

## 8. Các bước tiếp theo
- [ ] Thiết kế data model (users, portfolio, posts, reviews...)
- [ ] Wireframe các màn hình chính
- [ ] Chọn tech stack
- [ ] Xác định phạm vi thành phố/khu vực launch đầu tiên
