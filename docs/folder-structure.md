# Cấu trúc thư mục (Folder/File Structure)

Dự án theo mô hình **App / Core / Shared / Feature**, tách biệt giữa lớp routing (Next.js App Router), lớp hạ tầng dùng chung (core), lớp UI/tiện ích dùng chung (shared) và lớp nghiệp vụ theo domain (feature).

```
src/
├── app/            # Next.js App Router — chỉ định nghĩa route, KHÔNG chứa logic nghiệp vụ
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── auth/       # route segment /auth — import & render page từ features/auth
│   └── landing/    # route segment /landing — import & render page từ features/landing
│
├── core/           # Hạ tầng & tiện ích dùng chung toàn app, không phụ thuộc vào feature/shared nào
│   ├── api/        # API client, axios/fetch instance, interceptor, endpoint chung
│   └── config/     # Cấu hình app: env, constants toàn cục, theme, route map...
│
├── shared/         # Lớp UI & tiện ích dùng chung giữa nhiều feature, không chứa logic nghiệp vụ riêng của domain nào
│   ├── components/
│   │   ├── ui/       # Design-system components (shadcn/ui, base-ui primitives) — button, input, dialog...
│   │   └── common/   # Component ghép từ ui/ nhưng vẫn dùng chung nhiều feature (vd. EmptyState, PageHeader...)
│   ├── hooks/        # Custom hook dùng chung, không thuộc riêng feature nào (vd. useDebounce, useMediaQuery)
│   ├── store/        # State management dùng chung toàn app (vd. auth session, theme)
│   └── utils/        # Hàm tiện ích thuần (formatters, cn/classnames merge...)
│
└── features/       # Logic nghiệp vụ, tách theo domain
    ├── auth/
    │   ├── components/   # UI component riêng của feature auth
    │   ├── constants/    # Hằng số riêng của feature (message, enum, key...)
    │   ├── hooks/        # Custom hooks riêng của feature
    │   ├── store/        # State management riêng của feature (zustand/context/...)
    │   └── page/         # Page component hoàn chỉnh, được app/ import vào route
    └── landing/
        ├── components/
        └── page/
```

## Tech stack UI hiện tại

- **shadcn/ui** (style `base-lyra`, xem `components.json`) làm generator cho design-system components, sinh ra dưới `shared/components/ui/`.
- **[@base-ui/react](https://base-ui.com/)** làm headless primitive bên dưới shadcn components (vd. `Button` trong `shared/components/ui/button.tsx` bọc `@base-ui/react/button`).
- **class-variance-authority (cva)** để định nghĩa variant/size cho component (`buttonVariants`...).
- **Phosphor Icons** (`@phosphor-icons/react`) làm icon library mặc định (`iconLibrary: "phosphor"` trong `components.json`).
- **Tailwind CSS v4** + `tw-animate-css`, theme token khai báo trong `src/app/globals.css`.

## Quy ước từng lớp

### `app/` — Routing layer
- Chỉ chứa file quy ước của Next.js (`layout.tsx`, `page.tsx`, `loading.tsx`, `error.tsx`, `route.ts`...) và cấu trúc thư mục tương ứng với URL.
- Mỗi route segment (`app/auth`, `app/landing`, ...) **không tự viết UI/logic** mà import `page` tương ứng từ `features/<tên-feature>/page` rồi render ra.
- Không đặt component dùng chung, hook, hay gọi API trực tiếp ở đây.

### `core/` — Shared infrastructure
- Chứa code hạ tầng dùng chung cho **toàn bộ app**: gọi API, cấu hình, env — không chứa UI.
- Không thuộc riêng feature/shared nào và không được phép import ngược từ `features/` hay `shared/`.
- `core/api`: khởi tạo client gọi API (base URL, interceptor, xử lý lỗi/token chung), các hàm gọi API dùng chung.
- `core/config`: biến môi trường, hằng số toàn cục, cấu hình theme/route...
- Có thể mở rộng thêm khi cần, ví dụ: `core/types` (type dùng chung).

### `shared/` — Shared UI layer
- Chứa **UI, hook, state, util dùng chung nhiều feature** nhưng không gắn với 1 domain nghiệp vụ cụ thể nào — khác với `core/` (thuần hạ tầng, không UI).
- `shared/components/ui`: component sinh bởi shadcn CLI (`npx shadcn add ...`), là lớp design-system thuần (button, input, dialog...), hạn chế sửa tay trực tiếp — nên tuỳ biến qua `variant`/props hoặc bọc thêm ở `shared/components/common`.
- `shared/components/common`: component ghép từ `ui/` nhưng vẫn generic, dùng được ở nhiều feature (vd. `EmptyState`, `PageHeader`, `ConfirmDialog`).
- `shared/hooks`: hook thuần UI dùng chung, không thuộc riêng feature (vd. `useDebounce`, `useMediaQuery`).
- `shared/store`: state dùng chung toàn app (vd. auth session, theme) — state riêng của 1 feature vẫn để trong `features/<feature>/store`.
- `shared/utils`: hàm tiện ích thuần, không phụ thuộc React (formatters, `cn`...).
- Được phép dùng `core/` (vd. 1 hook trong `shared/hooks` gọi `core/api`), nhưng `core/` không được import ngược lại `shared/`.

### `features/` — Domain logic
- Mỗi thư mục con là một domain/nghiệp vụ độc lập (`auth`, `landing`, sau này có thể thêm `portfolio`, `posting`, `search`...).
- Cấu trúc bên trong một feature (thêm folder khi cần, không bắt buộc phải có đủ):
  | Thư mục | Vai trò |
  |---|---|
  | `components/` | Component UI chỉ dùng trong feature này |
  | `hooks/` | Custom hook riêng của feature |
  | `store/` | State management riêng của feature |
  | `constants/` | Hằng số, enum, message riêng của feature |
  | `page/` | Page hoàn chỉnh (compose từ components/hooks/store), được `app/` import |
- Một feature được phép dùng `core/` và `shared/`, nhưng **không import chéo** sang feature khác — nếu 2 feature cần dùng chung logic, đưa phần dùng chung lên `shared/` (nếu là UI/hook/state) hoặc `core/` (nếu là hạ tầng thuần).

## Alias import
`tsconfig.json` khai báo alias `@/*` trỏ về **thư mục gốc project** (không phải `src/`):
```json
"paths": { "@/*": ["./*"] }
```
Vì vậy import đúng phải luôn có tiền tố `src/`, ví dụ:
```ts
import { apiClient } from "@/src/core/api";
import { LoginPage } from "@/src/features/auth/page";
import { Button } from "@/src/shared/components/ui/button";
```

> ✅ **Đã đồng bộ với `components.json`:** alias shadcn dùng đúng tiền tố `@/src/shared/...` (components, utils, ui, lib, hooks), khớp với `tsconfig.json` (`@/* → ./*`). Hàm `cn` dùng chung được đặt tại `src/shared/utils/index.ts` (re-export từ package `cn`) — import qua `@/src/shared/utils`, không còn `lib/utils.ts` rời ở root nữa.

## Nguyên tắc phụ thuộc (dependency rule)
```
app/  ──depends on──>  features/  ──depends on──>  shared/  ──depends on──>  core/
```
- `core/` không phụ thuộc `shared/`, `features/` hay `app/` — là lớp thấp nhất.
- `shared/` được phép dùng `core/`, nhưng không phụ thuộc `features/` hay `app/`.
- `features/` không phụ thuộc `app/`, và không phụ thuộc feature khác.
- `app/` chỉ đóng vai trò lắp ráp (compose) route từ `features/`.
