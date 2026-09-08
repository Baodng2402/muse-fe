# Tính năng chính — Muse

Tài liệu này chốt lại **các feature chính** của sản phẩm, đối chiếu với phạm vi chức năng đã định trong [project-context.md](project-context.md) (mục 3) và tình trạng code hiện tại trong `src/features/`. Dùng để theo dõi tiến độ và làm cơ sở chia việc implement.

Chú thích trạng thái: ✅ đã có khung code · 🟡 có UI một phần (view-only / mock data) · ⬜ chưa code.

## 1. Auth & Account — ✅ có khung code

- **Mô tả:** Đăng ký/đăng nhập bằng email hoặc SĐT, thiết lập vai trò tài khoản (thợ/học viên và/hoặc khách hàng). Một tài khoản có thể vừa là thợ vừa là khách.
- **Actor:** Tất cả user.
- **Code hiện tại:** `src/features/auth` (`page/index.tsx`) — có trang login, chưa rõ đã nối API thật hay chỉ UI tĩnh.
- **Bảng dữ liệu:** `users`.
- **Độ ưu tiên:** 1 (nền tảng, cần xong trước mọi feature khác).

## 2. Profile — ⬜ chưa code

- **Mô tả:** Thông tin cá nhân: tên hiển thị, ảnh đại diện, khu vực, chuyên ngành (makeup/nail/photography...), mô tả, cấp độ (đang học/có kinh nghiệm/chuyên nghiệp).
- **Actor:** Thợ/học viên, thợ chuyên nghiệp (khách hàng không bắt buộc có profile đầy đủ).
- **Bảng dữ liệu:** `profiles`, `profile_specialties`, `specialties`, `regions`.
- **Độ ưu tiên:** 1 (cùng nhóm với Auth, theo thứ tự triển khai PRD mục 7).

## 3. Portfolio — ⬜ chưa code

- **Mô tả:** Upload nhiều ảnh, gắn tag theo loại dịch vụ, hỗ trợ ảnh before/after, hiển thị dạng gallery + xem chi tiết ảnh.
- **Actor:** Thợ/học viên, thợ chuyên nghiệp.
- **Bảng dữ liệu:** `portfolio_images`.
- **Độ ưu tiên:** 2.

## 4. Đăng tin — 🟡 có UI xem tin, chưa có tạo tin

- **Mô tả:** Ba loại tin, đăng từ hai phía khác nhau của thị trường:
  - **Loại A — Tìm mẫu:** Thợ/học viên đăng cần mẫu thực hành — dịch vụ, thời gian, khu vực, mức ưu đãi, yêu cầu với mẫu, số lượng slot.
  - **Loại B — Nhận booking:** Thợ chuyên nghiệp đăng danh sách dịch vụ, giá tham khảo, lịch rảnh cơ bản (theo ngày trong tuần) để khách đặt.
  - **Loại C — Rảnh lịch / Tìm cơ hội (mới, đảo chiều so với Loại A):** Mẫu/freelancer tự đăng lịch rảnh của mình (vd. "rảnh ngày 10-12/9, có thể làm mẫu chụp ảnh sản phẩm, mẫu makeup, mẫu nail...") để thợ hoặc brand chủ động liên hệ mời, thay vì chỉ chờ được thợ đăng tin mời.
- **Actor:** Loại A/B — thợ/học viên/thợ chuyên nghiệp. Loại C — mẫu/freelancer (có thể là user chưa từng có profile "thợ").
- **Code hiện tại:** `src/features/posts` — đã có `page/index.tsx` (list) và `page/detail.tsx` (chi tiết) dùng `mock/posts.ts`; **chưa có form tạo tin** cho cả 3 loại.
- **Bảng dữ liệu:** `posts`, `post_services` (Loại B).
  - ⚠️ **Follow-up cần chốt riêng:** `posts.type` trong [data-model.md](data-model.md) hiện chỉ có enum `find_model` / `booking` — cần bổ sung giá trị thứ ba (vd. `available` hoặc `freelance_offer`) cho Loại C, và xác định `specialty_id` của Loại C có tái dùng bảng `specialties` (loại hình mẫu: mẫu ảnh/mẫu makeup/mẫu nail...) hay cần cột riêng. Chưa sửa `data-model.md` trong tài liệu này.
- **Độ ưu tiên:** 3 (Loại A ưu tiên cao nhất — pain point mạnh nhất theo PRD; Loại C nên làm cùng đợt với Loại A vì cùng bản chất "tìm cơ hội thực hành/booking không chính thức"; Loại B làm sau khi đã có đủ thợ/portfolio).

## 5. Tìm kiếm & Khám phá — 🟡 có UI list, chưa có filter

- **Mô tả:** Filter theo dịch vụ, khu vực, loại tin, mức giá. Trang chủ hiển thị tin theo khu vực người dùng. Trang chi tiết profile kèm portfolio và tin đang đăng.
- **Code hiện tại:** `src/features/posts/page/index.tsx` có list tin (mock), chưa có filter/search thật.
- **Bảng dữ liệu:** `posts` (index `idx_posts_feed`, `idx_posts_price`), `regions`, `specialties`.
- **Độ ưu tiên:** 4.

## 6. Kết nối — ⬜ chưa code

- **Mô tả:** Nút liên hệ dẫn ra Zalo/Messenger/gọi điện (chưa cần chat trong app ở bản đầu). Lưu/quan tâm tin đăng.
- **Bảng dữ liệu:** `interactions` (ghi nhận lượt bấm liên hệ), `saved_posts`.
- **Độ ưu tiên:** 5.

## 7. Đánh giá & Tin cậy — ⬜ chưa code

- **Mô tả:** Đánh giá sao + nhận xét hai chiều sau khi hoàn thành dịch vụ (gắn với `bookings` đã `completed`). Báo cáo (report) tin đăng/profile vi phạm.
- **Bảng dữ liệu:** `reviews`, `reports`, `bookings`.
- **Độ ưu tiên:** 6.

## 8. Quản trị (Admin) — ⬜ chưa code

- **Mô tả:** Duyệt/ẩn tin vi phạm, xử lý report.
- **Actor:** Admin (`users.is_admin`).
- **Bảng dữ liệu:** `posts.status`, `reports`.
- **Độ ưu tiên:** 7 (sau khi các feature core đã ổn định, cần khi lượng tin đủ lớn để phát sinh vi phạm).

## Ngoài 8 feature core: Landing page

- **Mô tả:** Trang marketing/giới thiệu sản phẩm, không thuộc phạm vi chức năng cốt lõi trong PRD nhưng đã có trong code.
- **Code hiện tại:** `src/features/landing` — ✅ đã có.
- **Không có bảng dữ liệu riêng** (trang tĩnh).

## Ngoài phạm vi (MVP)

Theo [project-context.md](project-context.md) mục 4 — chưa làm ở giai đoạn này: thanh toán/booking tự động trong app, chat real-time trong app, xác minh danh tính nâng cao, native mobile app, gợi ý cá nhân hoá/tìm theo bản đồ. Data model cho `bookings`/`conversations`/`messages` đã có sẵn ở nhóm mở rộng trong data-model.md để không phải viết lại khi làm sau.
