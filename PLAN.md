# Muse Frontend — Plan: zero mock data, test coverage, và redesign UI/UX triệt để

> Viết bởi Claude sau 1 phiên làm việc dài đọc/sửa trực tiếp toàn bộ codebase này (không chỉ đọc lướt) + audit song song backend (`muse-backend`, xem `muse-backend/PLAN.md` — đọc cả 2 file để có bức tranh đầy đủ, 2 bên tham chiếu nhau). Repo: `muse-fe` (Next.js 16, React 19, Tailwind v4, TanStack Query, Zustand, shadcn "base-lyra" trên `@base-ui/react`).
>
> **Người thực thi plan này là Antigravity, không phải Claude.** Vì vậy tài liệu này viết đủ chi tiết để người/agent chưa từng thấy phiên làm việc trước đó vẫn hiểu được: cái gì **đã xong và đã test bằng tay trên browser thật** (đừng làm lại, đừng phá), cái gì **còn thiếu** (backend chưa có API, hoặc frontend chưa nối), và **hướng thiết kế UI/UX cụ thể** cần theo khi làm lại giao diện.

---

## 0. Đã xong trong phiên trước — ĐỌC KỸ TRƯỚC KHI ĐỘNG VÀO BẤT CỨ FILE NÀO

Toàn bộ mục này đã được test tay trên browser thật (đăng ký tài khoản thật, tạo bài đăng thật, upload ảnh, click filter, v.v.), `tsc --noEmit` và `eslint` sạch tại thời điểm viết plan. Không phải suy đoán.

### 0.1 Component nền dùng chung — đã có, PHẢI tái dùng, đừng tạo lại
Ở `src/shared/components/ui/`: `button.tsx` (đã có từ đầu), và mới thêm: `input.tsx`, `textarea.tsx`, `field.tsx` (Field/FieldLabel/FieldDescription/FieldError — label-above, error-below chuẩn), `select.tsx` (bọc `@base-ui/react/select`, **bắt buộc truyền prop `items={[{value,label}]}` vào `<Select>` nếu không trigger sẽ hiện raw value/UUID thay vì label — đã có bug thật kiểu này, đã fix, đừng lặp lại**), `badge.tsx`, `avatar.tsx` (`Avatar`/`AvatarImage`/`AvatarFallback` — dùng cho MỌI avatar trong app, fallback là initials qua `getInitials()` ở `src/shared/utils/get-initials.ts`, không dùng ảnh stock giả làm avatar nữa), `dialog.tsx` (modal căn giữa, desktop), `sheet.tsx` (bottom-sheet vuốt để đóng, dùng `@base-ui/react/drawer`, mobile), `modal.tsx` (`Modal`/`ModalContent`/... — tự chuyển Dialog/Sheet theo viewport qua `use-media-query.ts`, **đây là component modal chuẩn duy nhất nên dùng**, đã thay thế mọi `fixed inset-0 bg-black/60` tự chế ở booking modal, report modal, admin region modal, portfolio upload/edit modal). `image-upload.tsx` — upload ảnh thật lên **Cloudinary** (kéo-thả, nhiều ảnh, preview, sắp xếp lại, xóa) qua `src/shared/utils/cloudinary.ts`, cần biến env `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`/`NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` (xem `.env.example`) — **cloud name/preset thật chưa được điền, cần chủ dự án tạo unsigned upload preset trên Cloudinary Console rồi điền vào `.env`, nếu không upload ảnh sẽ báo lỗi "chưa cấu hình"**.

### 0.2 Đã bỏ TOÀN BỘ mock/dữ liệu giả tìm được — đây là phần trực tiếp trả lời yêu cầu "không mock" của bạn
Đã audit và fix triệt để, không phải chỉ landing page:
- `src/features/posts/utils/normalize-post.ts`: trước đây **bịa cứng** `rating: 4.9`, `reviewCount: 12` cho MỌI tác giả, và nghiêm trọng hơn: **`phone: '0901234567'` cho MỌI tin đăng** (khiến nút "Gọi trực tiếp" gọi nhầm số này cho tất cả nghệ nhân trên toàn hệ thống — bug chức năng thật, không chỉ hiển thị). Đã sửa: các field này giờ optional, để trống khi backend chưa có, UI ẩn gọn phần rating/gọi điện khi thiếu dữ liệu thay vì hiện số giả. **Khi backend có API review thật (xem `muse-backend/PLAN.md` mục 2), chỉ cần backend trả đúng field `rating`/`review_count`, UI sẽ tự hiện lại đúng chỗ — không cần sửa gì thêm ở đây.**
- `avatarId` (cycling qua 4 ảnh stock Unsplash giả làm avatar của người dùng thật) → đã bỏ hoàn toàn, dùng `post.author.avatarUrl` thật (`author_avatar` từ backend) + `AvatarFallback` initials khi thiếu.
- `timeSlot` hardcode `'09:00 - 12:00'` cho mọi tin → dùng `practice_time` thật từ backend, để trống nếu thiếu (card tự fallback sang ngày tạo thật).
- Toàn bộ hệ thống category/city **giả** (`CATEGORIES`/`CITIES` hardcode trong `src/features/posts/types.ts`, suy đoán category bằng cách match từ khóa trong title — vd. thấy chữ "nail" trong tiêu đề thì gán category=nail) → đã xóa, thay bằng `specialty_id`/`specialty_name`/`region_id` **thật** từ API `/specialties`, `/regions`. Filter ở trang `/posts` giờ gọi API thật với `specialty_id`/`region_id` (server-side filter, xem `muse-backend/PLAN.md` mục 0 — filter này **đã hoạt động đúng ở backend**, đã verify bằng code, không phải giả).
- `src/features/search/components/search-discovery-hub.tsx`: bỏ `FEATURED_ARTISTS` (3 người bịa hoàn toàn: tên giả, rating giả, bio giả, link `/profile/username-không-tồn-tại`) → nối API thật. Bỏ mục "Xu hướng thịnh hành" (numbered rank 1-2-3 giả vờ là trending thật trong khi chỉ là mảng cứng) → đổi thành "Gợi ý tìm kiếm" không gắn nhãn ranking giả. `EXPLORE_TILES` → dùng specialty thật từ API thay vì 4 category cứng lệch với backend.
- `src/features/landing/components/story-categories-bar.tsx`: 6 category cứng (kèm href `?category=makeup` — param này **không còn được đọc ở đâu cả**, dead link) → dùng specialty thật + 1 shortcut "Thợ Pro" trỏ `?tab=nhan-booking` (route param có thật, đã verify hoạt động).
- `src/shared/components/common/site-footer.tsx`: "Dịch vụ phổ biến" từng có 6 label trong đó 2 cặp trùng lặp trỏ cùng 1 category giả (vd. "Trang điểm dự tiệc" và "Trang điểm cô dâu" cùng trỏ `?category=makeup`), "Khu vực" chỉ có 3/4 tỉnh thành thật (thiếu Cần Thơ) → giờ cả 2 cột render động từ API `/specialties`/`/regions` thật.
- `src/features/search/page/index.tsx`: "Lịch sử tìm kiếm gần đây" từng **seed sẵn 3 câu tìm kiếm giả** cho MỌI user mới (kể cả user chưa từng tìm gì) → giờ bắt đầu rỗng thật, lưu localStorage thật (`STORAGE_KEYS.SEARCH_HISTORY` — key này tồn tại sẵn trong `storage-keys.ts` từ trước nhưng chưa từng được dùng, giờ đã nối).
- **Bug URL-param đã fix, cẩn thận không lặp lại pattern này ở chỗ khác**: gọi 2 lần `setParam()`/`resetPage()` riêng rẽ trong cùng 1 event handler sẽ **ghi đè nhau** (cả 2 đọc cùng 1 snapshot `searchParams` cũ vì React chưa kịp re-render giữa 2 lời gọi) — phải gộp thành 1 lời gọi `setParams({ key1: ..., key2: ..., page: null })` duy nhất. Xem `src/features/posts/page/index.tsx` để lấy pattern chuẩn. Nếu thêm filter mới ở đâu đó, tuân theo pattern này.

### 0.3 Trang đã redesign theo hướng Instagram, có kiểm tra tay trên browser
- **Profile/Account**: `src/shared/components/common/profile-hero.tsx` — component hero dùng chung (cover + avatar chờm lên + stats 3 cột) cho cả `account/page` (hồ sơ của tôi) và `profile/page` (xem người khác), trước đây 2 trang lệch pattern hoàn toàn.
- **Portfolio**: `src/features/portfolio/components/portfolio-gallery.tsx` — lưới IG thật (`grid-cols-3 gap-0.5`, ảnh vuông, không bo góc, không viền — **đây là ngoại lệ có chủ đích duy nhất với hệ bo góc chung của app, xem comment trong `src/app/globals.css`**), modal upload hỗ trợ nhiều ảnh thật qua Cloudinary.
- **Tạo/sửa tin đăng**: `src/features/posts/page/create-post.tsx` là wizard 3 bước (ảnh & loại tin → chi tiết → xem lại), `edit-post.tsx` là form 1 trang (có lý do — sửa tin không nên ép qua từng bước như tạo mới) — cả 2 đã có upload ảnh thật, dùng `Select`/`Field`/`Input` chuẩn.
- **Feed card**: tỷ lệ ảnh chuẩn hóa `4:5` cho card lưới (`post-card-compact.tsx`, `urgent-model-feed.tsx`), có nút tim lưu tin với animation "nổ tim" bằng `motion/react` khi bấm lưu.

### 0.4 Component/trang CHƯA động tới trong phiên trước (không có nghĩa là ổn, chỉ là chưa xem)
`src/features/bookings/*`, `src/features/reports/*` (ngoài modal đã đổi), toàn bộ `src/features/admin/*` ngoài 2 chỗ đã liệt ở trên, `src/features/auth/*`, header/nav (`site-header.tsx`, `mobile-nav-menu.tsx`, `mobile-bottom-nav.tsx`), landing hero (`editorial-hero-banner.tsx`, `why-muse-bento.tsx` — bento đã sửa từ pattern "3 card đều nhau" sang bất đối xứng 1 lớn + 2 nhỏ, nhưng phần còn lại của landing chưa được nhìn lại tổng thể).

---

## 1. Phần còn thiếu để "zero mock" — phụ thuộc backend

Không thể tự làm ở frontend, phải đợi `muse-backend/PLAN.md` mục 1-3 xong trước hoặc làm song song:

1.1 **Booking UI** (`src/features/bookings/page/bookings-page.tsx`, `src/features/bookings/hooks/use-bookings.ts`) — hiện gọi `listClient`/`listProvider` nhưng **2 endpoint này chưa tồn tại ở backend** (xem `muse-backend/PLAN.md` mục 1). Kiểm tra lại UI này đang render gì khi API 404 — rất có thể đang hiện empty state trông giống như "đã hoạt động nhưng chưa có dữ liệu" trong khi thực ra API còn chưa được implement, dễ gây hiểu lầm là bug frontend. Sau khi backend xong mục 1, nối `PATCH /bookings/:id/status` cho nút hủy/xác nhận lịch hẹn (hiện UI có thể chưa có nút này — cần thêm nếu thiếu, theo state machine thật `scheduled → completed | cancelled | no_show`).

1.2 **Reviews UI** — chưa tồn tại ở đâu trong `muse-fe`. Cần xây mới sau khi backend xong mục 2: form đánh giá sao (1-5) + comment sau khi booking `completed`, hiển thị rating trung bình thật trên profile/post card (chỗ đã ẩn sẵn rating giả — field đã sẵn sàng nhận dữ liệu thật, chỉ cần build UI submit + hiển thị danh sách review).

1.3 **Search text** — `src/features/search/page/index.tsx` gửi `search` param tới `GET /posts` nhưng **backend hiện bỏ qua param này hoàn toàn** (xem `muse-backend/PLAN.md` mục 3.2). Kết quả: gõ tìm kiếm hiện tại trả về **toàn bộ post, không lọc theo từ khóa** — trông như hoạt động nhưng thực ra sai. Không sửa được ở frontend, chỉ ghi chú và chờ backend.

1.4 **"Bài đăng của tôi"** (`account-my-posts-tab.tsx`) — backend hiện hardcode `status='published'` ở list endpoint (mục 3.3 bên kia), nghĩa là **tin nháp/ẩn của chính mình không hiện trong tab này**. Sau khi backend sửa, kiểm tra lại tab này hiện đúng mọi trạng thái tin của chủ tài khoản.

---

## 2. Test — hiện tại là 0%, cần dựng từ đầu

`package.json` xác nhận: **không có bất kỳ thư viện test nào** (không Vitest/Jest, không Testing Library, không Playwright/Cypress). Yêu cầu của bạn là "test cho mọi nút bấm xem có hoạt động ổn không" — cụ thể hóa thành:

### 2.1 Unit/component test — Vitest + React Testing Library
```
pnpm add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom
```
Test theo 2 lớp:
- **Component nền** (`src/shared/components/ui/*`): mỗi primitive 1 file test — `Button` (variant/size/disabled render đúng class, onClick gọi đúng), `Select` (chọn item → `onValueChange` nhận đúng value, **và quan trọng: trigger hiện đúng LABEL không phải raw value** — đây là bug thật đã xảy ra 1 lần, phải có test chặn tái diễn), `Modal` (mở/đóng, ESC đóng, click backdrop đóng), `ImageUpload` (chọn file → gọi upload → hiện preview → xóa ảnh → gọi `onChange` đúng mảng URL).
- **Tương tác theo tính năng** (mọi nút submit/toggle quan trọng): nút lưu tin (heart) ở `post-card-compact.tsx` gọi đúng mutation với đúng `postId`/`isCurrentlySaved`; wizard tạo tin (`create-post.tsx`) — validate chặn "Tiếp theo" khi thiếu tiêu đề/khu vực đúng như mô tả, không cho submit khi thiếu field bắt buộc; form đăng nhập/đăng ký; toggle filter chip ở `posts-quick-filters.tsx` gọi đúng callback; nút xác nhận/hủy trong mọi modal (booking, report, admin region).

Mock `apiClient`/TanStack Query bằng `QueryClientProvider` test wrapper + MSW (`msw`) để giả lập response backend thay vì gọi API thật trong unit test — cài thêm `pnpm add -D msw`.

### 2.2 E2E — Playwright
```
pnpm create playwright
```
Test các luồng người dùng thật đầu-cuối chạy trên `pnpm dev` thật (không mock), theo đúng cách phiên trước đã test tay:
- Đăng ký (role provider) → đăng nhập → tạo tin đăng qua wizard 3 bước (kèm chọn khu vực/chuyên ngành thật từ dropdown) → xác nhận tin xuất hiện ở `/posts` → sửa tin → xóa tin.
- Lưu tin (bấm tim) khi đã đăng nhập → xác nhận tin xuất hiện ở tab "Đã lưu".
- Filter theo chuyên ngành/khu vực ở `/posts` → xác nhận kết quả thực sự thay đổi (test này sẽ bắt được nếu bug filter-không-hoạt-động ở link phía trên tái diễn).
- Upload portfolio (cần mock Cloudinary response trong CI, hoặc dùng test preset riêng — đừng gọi Cloudinary thật trong CI).
- Admin: đăng nhập tài khoản admin → duyệt report → toggle trạng thái khu vực.

### 2.3 CI
Thêm `pnpm lint`, `pnpm exec tsc --noEmit`, `vitest run`, `playwright test` vào pipeline (tạo `.github/workflows/ci.yml` nếu chưa có — kiểm tra trước).

---

## 3. UI/UX — redesign lại, hướng dẫn cụ thể cho Antigravity

Bạn (chủ dự án) nói vẫn thấy "quá AI" dù đã qua 1 vòng redesign — đây là brief để làm **triệt để hơn**, không phải patch tiếp. Đọc hết mục này trước khi bắt đầu, đây là phần quan trọng nhất của toàn bộ tài liệu.

### 3.0 Bối cảnh sản phẩm (đừng thiết kế generic SaaS)
Muse là sàn 2 chiều kết nối **thợ làm đẹp/nhiếp ảnh Việt Nam** (makeup, nail, chụp ảnh) với **mẫu thực hành** và **khách hàng**, thay thế thói quen đăng tin trên Facebook. Đối tượng dùng chủ yếu qua điện thoại, tiếng Việt là ngôn ngữ chính. Đây **không phải** app B2B SaaS, **không phải** fintech, **không phải** dev tool — thiết kế phải cảm thấy như 1 app tiêu dùng ấm áp, đáng tin cậy, gắn với ngành làm đẹp Việt Nam, KHÔNG phải template "AI startup" chung chung.

### 3.1 Giữ nguyên — đã có chủ đích, đừng đổi vì đổi
- Màu chủ đạo warm rose (`--primary: #b83d55` light / `#e07090` dark) — đây là 1 trong số ít quyết định KHÔNG mang dấu "AI slop" mặc định (không phải tím/xanh gradient AI-purple kinh điển), đã khớp với hướng "beauty/social" thật. **Đừng đổi màu chỉ vì muốn "mới hoàn toàn"** — nếu đổi, phải có lý do rõ ràng hơn "cho khác".
- Font `Be Vietnam Pro` — đã có cá tính riêng, hỗ trợ tiếng Việt tốt, không phải Inter mặc định.
- Alias import `@/*` trỏ root, dependency rule `app → features → shared → core` (đọc `docs/folder-structure.md`).
- Toàn bộ component nền ở mục 0.1 — đây là phần đầu tư lớn, tái dùng, chỉ **restyle bằng cách đổi class trong chính các file đó** nếu cần đổi diện mạo, đừng viết lại từ đầu.

### 3.2 Vấn đề cụ thể đã tìm thấy — đây là lý do UI vẫn "cảm giác AI" dù đã sửa nhiều chỗ
Đọc kỹ — đây là chẩn đoán thật từ việc đọc toàn bộ codebase, không phải phỏng đoán chung chung:

1. **Lặp lại 1 công thức "card" ở MỌI nơi, không phân biệt mức độ quan trọng.** Gần như toàn bộ app dùng đúng 1 recipe: `rounded-2xl border border-border/80 bg-card shadow-xs` (hoặc biến thể `shadow-2xs`/`rounded-3xl`) — từ card bài đăng, đến bento landing, đến card admin, đến card thống kê, đến mọi modal. Khi 1 pattern lặp lại không phân biệt (feed card thật sự cần viền để tách biệt trong lưới, nhưng 1 khối text đơn lẻ trong trang chi tiết không cần viền + shadow riêng) → cảm giác "template", đúng như redesign-skill mô tả ("generic card look... dùng khi elevation thực sự cần thiết, không thì bỏ viền/shadow, chỉ dùng spacing hoặc `border-t`/`divide-y`"). **Việc cần làm**: audit lại từng chỗ dùng card, hỏi "cái này có thực sự là 1 khối tách biệt trong danh sách nhiều khối giống nhau không?" — nếu không, bỏ viền/shadow, chỉ giữ spacing hoặc divider mảnh.
2. **Chữ nhỏ khắp nơi, thiếu phân cấp thị giác rõ ràng.** Rất nhiều chỗ dùng `text-[10px]`/`text-[11px]`/`text-xs` làm cỡ chữ MẶC ĐỊNH cho cả tiêu đề phụ lẫn nội dung, kể cả ở heading section (`text-xs font-bold uppercase tracking-wider` lặp lại ở gần như mọi section label). Landing hero là chỗ DUY NHẤT có type scale thật sự lớn/có sức nặng. Việc cần làm: kéo scale chữ lên ở heading cấp section (không cần to như hero, nhưng phải rõ ràng hơn size body), giảm số lượng label viết hoa+tracking-wider lặp lại (đây chính xác là pattern "eyebrow" mà taste-skill cảnh báo — nếu mọi section đều có 1 label viết hoa nhỏ phía trên, tối đa chỉ nên giữ ở khoảng 1/3 số section, phần còn lại bỏ hẳn label, để heading tự nói).
3. **Phụ thuộc ảnh stock Unsplash quốc tế, không có bản sắc Việt Nam.** Toàn bộ ảnh minh họa (hero, category tile, avatar fallback cũ, portfolio placeholder) đều là link Unsplash ảnh phương Tây generic. Với 1 sản phẩm định vị rõ "ngành làm đẹp Việt Nam", ảnh generic quốc tế làm mất bản sắc và góp phần vào cảm giác "AI tạo cho có". Việc cần làm: khi có ảnh thật từ user (portfolio thật, avatar thật) → ưu tiên tuyệt đối dùng ảnh đó (đã làm ở avatar). Với ảnh trang trí bắt buộc phải có placeholder (category tile, hero khi chưa có ảnh), cân nhắc: (a) đặt hàng/generate ảnh phong cách salon/studio Việt Nam thay vì Unsplash tây, hoặc (b) tối thiểu chọn ảnh Unsplash có tông màu/ngữ cảnh trung tính hơn thay vì rõ ràng phương Tây.
4. **Motion gần như bằng 0** ngoài `active:translate-y-px` ở Button và animation tim mới thêm. App đã cài sẵn `motion` (Framer Motion) nhưng gần như không dùng. 1 app "feed ảnh" mà load danh sách không có stagger-in, chuyển tab không có transition, filter đổi không có skeleton mượt — cảm giác cứng, tĩnh, không có sự sống dù nội dung là ảnh động.
5. **Badge/pill hình tròn dùng cho MỌI trạng thái** (status booking, status report, tab counter, benefit tag, role badge) — không sai về mặt chức năng, nhưng khi dùng đồng nhất 1 kiểu cho mọi loại thông tin khác nhau (trạng thái hệ thống vs tag mô tả vs số đếm), mắt người dùng mất khả năng phân biệt nhanh cái nào quan trọng.

### 3.3 Định hướng thiết kế — dùng skill sẵn có
Antigravity nên tự đọc kỹ 3 skill sau trước khi bắt đầu (nếu có quyền truy cập skill tương tự Claude Code, hoặc áp dụng nguyên tắc tương đương nếu không):
- **`redesign-skill`**: checklist audit generic pattern (typography/color/layout/interactivity/content/component), "Fix Priority" thứ tự: font → color cleanup → hover/active state → layout/spacing → thay component cliché → thêm loading/empty/error state → polish typography scale.
- **`taste-skill`**: dial hệ thống `DESIGN_VARIANCE`/`MOTION_INTENSITY`/`VISUAL_DENSITY` — với Muse, đọc brief là "app tiêu dùng nội dung-trước, mobile-first, Việt Nam", gợi ý dial khởi điểm: **VARIANCE 6-7** (đã có phá đối xứng ở hero/share-poster, cần thêm ở landing/admin), **MOTION 5-6** (thêm stagger/transition có chủ đích, không cần agency-level phức tạp), **DENSITY 4-5** (feed nội dung dày vừa phải, hợp lý với hành vi user Việt Nam lướt điện thoại). Tuyệt đối tránh: AI-purple gradient (không áp dụng ở đây do đã dùng rose), 3-card-đều-nhau (đã sửa ở bento, kiểm tra còn chỗ nào khác), em-dash trong copy, "eyebrow" lặp ở mọi section.
- **`ui-ux-pro-max`**: dùng để tra cứu palette/typography/UX pattern cụ thể khi cần quyết định (vd. `python search.py "beauty social mobile app" --design-system`), nhưng **ưu tiên brief trong tài liệu này hơn kết quả chung chung của tool** nếu 2 bên mâu thuẫn — sản phẩm này có bối cảnh rất cụ thể (Việt Nam, 2 chiều, beauty) mà tool tra cứu chung không biết.

### 3.4 Việc cần làm theo từng khu vực (ưu tiên cao → thấp)

1. **Component nền** (mục 0.1): audit lại mọi variant, áp fix ở mục 3.2 điểm 1 (bớt border/shadow mặc định trừ khi thực sự cần elevation), tăng type scale mặc định 1 bậc cho heading trong `Field`/section.
2. **Landing page** (`src/features/landing/*`): `editorial-hero-banner.tsx` đã ổn (bất đối xứng, ảnh full-bleed), giữ nguyên cấu trúc, có thể tăng scale H1. `story-categories-bar.tsx` đã nối data thật, giữ. `urgent-model-feed.tsx`/`featured-artists-section.tsx` đã nối data thật, tập trung sửa visual: bớt border/shadow theo mục 3.2. `why-muse-bento.tsx` đã phá "3 card đều nhau", kiểm tra còn hợp lý không sau khi đổi type scale toàn site.
3. **Feed & khám phá** (`src/features/posts/*`, `src/features/search/*`): đã nối data thật, tập trung 100% vào visual — card recipe, type scale, thêm motion stagger khi load lưới ảnh (dùng `motion/react` đã có sẵn, `whileInView` cho từng card, tôn trọng `prefers-reduced-motion`).
4. **Profile/Account/Portfolio**: đã có `ProfileHero` dùng chung + IG-grid, tập trung polish thêm chi tiết (stat row, tab underline) theo type scale mới.
5. **Admin** (`src/features/admin/*`): chưa được nhìn kỹ ở phiên trước, đang dùng y hệt card recipe của trang tiêu dùng — cân nhắc mật độ cao hơn (`DENSITY` dial cao hơn cho riêng khu vực admin, khác với trang tiêu dùng), có thể chuyển sang dạng bảng/danh sách gọn hơn thay vì card lớn cho mỗi hàng.
6. **Auth** (`src/features/auth/*`): đã là màn hình có chủ đích nhất (split-screen editorial) theo audit trước, polish theo type scale mới là đủ, không cần đổi cấu trúc.
7. **Header/Nav** (`site-header.tsx`, `mobile-nav-menu.tsx`, `mobile-bottom-nav.tsx`): chưa được xem kỹ, audit riêng theo checklist `redesign-skill`.

### 3.5 Ràng buộc bắt buộc khi redesign (đừng phá những gì đã đúng)
- Không đổi route/URL, không đổi tên field form (ảnh hưởng payload API), không đổi copy tiếng Việt trừ khi đang sửa lỗi rõ ràng — đây là quy tắc "preservation" đã áp dụng nhất quán ở phiên trước, giữ nguyên.
- Mọi trang phải test cả light/dark mode nếu đổi token màu (app hiện **chưa có cơ chế bật dark mode dù token dark đã tồn tại trong CSS** — đây là gap có thật, ghi chú lại nhưng không bắt buộc phải làm trong phần redesign này trừ khi được yêu cầu riêng).
- Mọi filter/nút bấm mới phải tuân theo pattern `setParams` gộp 1 lần ở mục 0.2 (tránh bug race URL).
- Test tay trên browser thật sau mỗi khu vực hoàn thành (không chỉ tin vào code đọc) — mở `pnpm dev`, đăng ký tài khoản test, đi qua golden path, chụp lại kết quả để đối chiếu.
