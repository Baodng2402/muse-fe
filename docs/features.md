# Tính năng chính — Muse

Tài liệu này chốt lại **các feature chính** của sản phẩm, đối chiếu với phạm vi chức năng đã định trong [project-context.md](project-context.md) (mục 3) và tình trạng code hiện tại trong `src/features/`. Dùng để theo dõi tiến độ và làm cơ sở chia việc implement.

Chú thích trạng thái: ✅ đã có khung code · 🟡 có UI một phần (view-only / mock data) · ⬜ chưa code.

## 1. Auth & Account — ✅ có khung code

- **Mô tả:** Đăng ký/đăng nhập bằng email hoặc SĐT, thiết lập vai trò tài khoản (thợ/học viên và/hoặc khách hàng). Một tài khoản có thể vừa là thợ vừa là khách.
- **Actor:** Tất cả user.
- **Code hiện tại:** `src/features/auth` — `page/index.tsx` + `api/auth.api.ts`, `hooks/use-auth.ts` nối API thật (login/register/refresh/logout qua `API_ENDPOINTS.auth`), token lưu ở `useAuthStore` (xem [client.ts](../src/core/api/client.ts)).
- **Bảng dữ liệu:** `users`.
- **Độ ưu tiên:** 1 (nền tảng, cần xong trước mọi feature khác).

## 2. Profile — ✅ có khung code

- **Mô tả:** Thông tin cá nhân: tên hiển thị, ảnh đại diện, khu vực, chuyên ngành (makeup/nail/photography...), mô tả, cấp độ (đang học/có kinh nghiệm/chuyên nghiệp).
- **Actor:** Thợ/học viên, thợ chuyên nghiệp (khách hàng không bắt buộc có profile đầy đủ).
- **Code hiện tại:** `src/features/account` (header, settings tab — sửa profile của chính mình) và `src/features/profile` (xem profile người khác qua `/profile/[username]`).
- **Bảng dữ liệu:** `profiles`, `profile_specialties`, `specialties`, `regions`.
- **Độ ưu tiên:** 1 (cùng nhóm với Auth, theo thứ tự triển khai PRD mục 7).

## 3. Portfolio — ✅ có khung code

- **Mô tả:** Upload nhiều ảnh, gắn tag theo loại dịch vụ, hỗ trợ ảnh before/after, hiển thị dạng gallery + xem chi tiết ảnh.
- **Actor:** Thợ/học viên, thợ chuyên nghiệp.
- **Code hiện tại:** `src/features/portfolio` (`portfolio-gallery.tsx`, `use-portfolio.ts`, API like/unlike) + tab riêng trong `account-portfolio-tab.tsx`.
- **Bảng dữ liệu:** `portfolio_images`.
- **Độ ưu tiên:** 2.

## 4. Đăng tin — 🟡 có API + form tạo/sửa tin, cần xác nhận nối đủ 3 loại

- **Mô tả:** Ba loại tin, đăng từ **cả 2 chiều** của thị trường (nền tảng là 2-sided marketplace, không chỉ provider mời mẫu):
  - **Loại A — Tìm mẫu** (provider đăng, provider → tìm customer/mẫu): dịch vụ cần thực hành, thời gian, khu vực, mức ưu đãi, yêu cầu với mẫu, số lượng slot.
  - **Loại B — Nhận booking** (provider đăng, provider → tìm customer): danh sách dịch vụ, giá tham khảo, lịch rảnh cơ bản (theo ngày trong tuần) để khách đặt; khách hàng ở chiều ngược lại chủ động tìm/đặt qua Tìm kiếm & Khám phá (mục 5).
  - **Loại C — Rảnh lịch / Tìm freelance** (mẫu/freelancer đăng, đảo chiều Loại A — mẫu → tìm provider/brand): mẫu tự đăng lịch rảnh + loại hình muốn làm (mẫu ảnh, mẫu makeup, mẫu nail...) để thợ/brand chủ động liên hệ mời. Không chỉ làm mẫu thực hành miễn phí — bao gồm cả **nhận freelance có trả phí** (mẫu ghi mức giá mong muốn).
- **Actor:** Loại A/B — thợ/học viên/thợ chuyên nghiệp. Loại C — mẫu/freelancer (có thể là user chưa từng có profile "thợ").
- **Code hiện tại:** `src/features/posts` — đã có `page/index.tsx` (list), `page/detail.tsx`, `page/create-post.tsx`, `page/edit-post.tsx` nối API thật qua `posts.api.ts`. `core/api/types.ts` đã có `PostType = 'find_model' | 'booking' | 'model_available'` — enum 3 giá trị của Loại A/B/C đã tồn tại ở tầng API.
  - ⚠️ Còn `src/features/posts/types.ts` (mock cũ, `PostType = 'tim-mau' | 'nhan-booking'`, chưa có Loại C) — file mock này lệch với `core/api/types.ts` thật, cần rà lại xem còn được UI nào dùng để dọn hoặc đồng bộ.
  - ⚠️ Cần xác nhận `create-post.tsx`/`edit-post.tsx` đã có UI riêng cho Loại C (lịch rảnh + mức giá mong muốn của mẫu) hay mới chỉ cover Loại A/B.
- **Bảng dữ liệu:** `posts` (3 loại dùng chung, xem [data-model.md](data-model.md)), `post_services` (Loại B).
- **Độ ưu tiên:** 3 (Loại A ưu tiên cao nhất — pain point mạnh nhất theo PRD; Loại C nên làm cùng đợt với Loại A vì đây là chiều còn thiếu để nền tảng thực sự 2 chiều; Loại B làm sau khi đã có đủ thợ/portfolio).

## 5. Tìm kiếm & Khám phá — 🟡 có UI list + quick filters, cần xác nhận filter theo giá/loại tin

- **Mô tả:** Filter theo dịch vụ, khu vực, loại tin, mức giá. Trang chủ hiển thị tin theo khu vực người dùng. Trang chi tiết profile kèm portfolio và tin đang đăng.
- **Code hiện tại:** `src/features/search` (`search-discovery-hub.tsx`) + `src/features/posts/components/posts-filter-drawer.tsx`, `posts-quick-filters.tsx` nối API qua `use-posts.ts`.
- **Bảng dữ liệu:** `posts` (index `idx_posts_feed`, `idx_posts_price`), `regions`, `specialties`.
- **Độ ưu tiên:** 4.

## 6. Kết nối — ✅ có khung code

- **Mô tả:** Nút liên hệ dẫn ra Zalo/Messenger/gọi điện (chưa cần chat trong app ở bản đầu). Lưu/quan tâm tin đăng.
- **Code hiện tại:** contact link trong `post-detail-sidebar.tsx`/`post-share-modal.tsx`; lưu tin qua `posts.save/unsave` API + tab `account-saved-posts-tab.tsx`.
- **Bảng dữ liệu:** `interactions` (ghi nhận lượt bấm liên hệ — chưa thấy code gọi API ghi nhận interaction, mới có link tĩnh), `saved_posts`.
- **Độ ưu tiên:** 5.

## 7. Đánh giá & Tin cậy — 🟡 Report đã có, Review (sao) chưa code

- **Mô tả:** Đánh giá sao + nhận xét hai chiều sau khi hoàn thành dịch vụ (gắn với `bookings` đã `completed`). Báo cáo (report) tin đăng/profile vi phạm.
- **Code hiện tại:** `src/features/reports` (`create-report-modal.tsx`, `use-reports.ts`, API đủ CRUD) — phần **report** đã có khung code đầy đủ. Phần **review/rating sao** chưa thấy feature riêng nào trong `src/features/` — vẫn ⬜ chưa code.
- **Bảng dữ liệu:** `reviews` (chưa dùng), `reports` (đã dùng), `bookings`.
- **Độ ưu tiên:** 6.

## 8. Quản trị (Admin) — ✅ có khung code

- **Mô tả:** Duyệt/ẩn tin vi phạm, xử lý report, quản lý `regions`/`specialties`.
- **Actor:** Admin (`users.is_admin` / role `admin` trong RBAC array — xem `hasRole()` ở [user-roles.ts](../src/shared/utils/user-roles.ts)).
- **Code hiện tại:** `src/features/admin` (`admin-guard.tsx` chặn route theo role, `regions/regions-dashboard.tsx`, `reports/reports-dashboard.tsx`), route `/admin/regions`, `/admin/reports`.
- **Bảng dữ liệu:** `posts.status`, `reports`, `regions`, `specialties`.
- **Độ ưu tiên:** 7 (sau khi các feature core đã ổn định, cần khi lượng tin đủ lớn để phát sinh vi phạm).

## 9. Booking / Đặt lịch hẹn thật — ✅ có khung code (vượt phạm vi MVP ban đầu)

- **Mô tả:** Sau khi Loại B kết nối, 2 bên chốt lịch hẹn cụ thể (giờ bắt đầu/kết thúc, ghi chú). [project-context.md](project-context.md) mục 4 liệt "booking tự động trong app" **ngoài scope MVP**, nhưng code hiện tại đã triển khai khung tính năng này sớm hơn dự kiến ban đầu.
- **Code hiện tại:** `src/features/bookings` (`create-booking-modal.tsx`, `use-bookings.ts`, `bookings.api.ts` — `create`/`listClient`/`listProvider`), route `/bookings`.
- **Bảng dữ liệu:** `bookings` (nhóm "mở rộng" trong data-model.md).
- **Ghi chú:** Vì đây là scope mở rộng đã lên code trước — khi rà soát nên xác nhận với sản phẩm liệu có chính thức đưa vào MVP hay vẫn giữ ngoài phạm vi ban đầu, để tránh lệch kỳ vọng với PRD.

## Ngoài 9 feature core: Landing page

- **Mô tả:** Trang marketing/giới thiệu sản phẩm, không thuộc phạm vi chức năng cốt lõi trong PRD nhưng đã có trong code.
- **Code hiện tại:** `src/features/landing` — ✅ đã có.
- **Không có bảng dữ liệu riêng** (trang tĩnh).

## Ngoài phạm vi (MVP) — vẫn còn hiệu lực trừ phần đã lên code sớm

Theo [project-context.md](project-context.md) mục 4 — chưa làm ở giai đoạn này: **thanh toán** trong app, chat real-time trong app, xác minh danh tính nâng cao, native mobile app, gợi ý cá nhân hoá/tìm theo bản đồ.

⚠️ Riêng "booking tự động trong app" (đặt lịch hẹn thật, không phải thanh toán) ban đầu cũng nằm trong nhóm ngoài scope này, nhưng **đã được code trước** — xem mục 9. Cần đồng bộ lại với sản phẩm: giữ nguyên "ngoài scope" (bỏ/ẩn feature khỏi bản MVP đầu) hay chính thức đưa vào scope MVP luôn vì đã có code. Chat (`conversations`/`messages`) thì vẫn đúng là ngoài scope, chưa có code — data model đã có sẵn ở nhóm mở rộng để không phải viết lại khi làm sau.
