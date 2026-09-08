# Muse — Frontend

Web app kết nối Thợ làm đẹp/Nhiếp ảnh với Mẫu & Khách hàng. Xem bối cảnh và phạm vi sản phẩm đầy đủ tại [docs/project-context.md](docs/project-context.md).

## Tech stack

- **[Next.js 16](https://nextjs.org)** (App Router) + React 19 + TypeScript
- **Tailwind CSS v4** + [tw-animate-css](https://www.npmjs.com/package/tw-animate-css)
- **[shadcn/ui](https://ui.shadcn.com)** (style `base-lyra`) trên nền **[@base-ui/react](https://base-ui.com)** làm headless primitives
- **[Phosphor Icons](https://phosphoricons.com)** làm icon library mặc định
- **class-variance-authority** cho variant/size của component
- Package manager: **pnpm**

## Cấu trúc dự án

Dự án tổ chức theo mô hình **App / Core / Shared / Feature** — chi tiết đầy đủ tại [docs/folder-structure.md](docs/folder-structure.md).

```
src/
├── app/        # Next.js App Router — chỉ định nghĩa route
├── core/       # Hạ tầng dùng chung: API client, config
├── shared/     # UI/hook/state/util dùng chung nhiều feature (design-system components...)
└── features/   # Logic nghiệp vụ theo domain (auth, landing, ...)
```

## Getting Started

```bash
pnpm install
pnpm dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem kết quả.

Thêm component từ shadcn/ui:

```bash
pnpm dlx shadcn add <component>
```

Các script khác:

```bash
pnpm build   # build production
pnpm start   # chạy bản build
pnpm lint    # eslint
```

## Tài liệu dự án

- [docs/project-context.md](docs/project-context.md) — PRD: bối cảnh, đối tượng người dùng, phạm vi chức năng
- [docs/folder-structure.md](docs/folder-structure.md) — quy ước cấu trúc thư mục, dependency rule, alias import
- [docs/data-model.md](docs/data-model.md) — thiết kế database (PostgreSQL), ERD, các quyết định thiết kế

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/docs)
- [Base UI Documentation](https://base-ui.com/react/overview/quick-start)
