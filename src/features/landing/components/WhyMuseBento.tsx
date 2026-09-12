import {
  LightningIcon,
  ShieldCheckIcon,
  GiftIcon,
} from '@phosphor-icons/react/dist/ssr';

/**
 * Bento bất đối xứng 3 ô (1 ô lớn + 2 ô nhỏ) — tránh pattern "3 card đều nhau" kinh điển của AI.
 * Nền có sắc thái riêng cho từng ô (primary/emerald/blue) thay vì trắng đồng loạt.
 */
export function WhyMuseBento() {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-3 rounded-2xl border border-border/80 bg-card p-6 shadow-xs sm:col-span-2 sm:flex-row sm:items-center sm:gap-6 hover:border-primary/30 transition-colors">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <LightningIcon weight="fill" className="size-6" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-foreground">
            Đăng bài & Ứng tuyển tức thì
          </h3>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed max-w-xl">
            Không lo trôi bài hay spam như hội nhóm mạng xã hội. Thông tin ca làm, địa chỉ studio và số slot tuyển mẫu được chuẩn hóa minh bạch.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-2xl border border-border/80 bg-card p-5 shadow-xs hover:border-primary/30 transition-colors">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <ShieldCheckIcon weight="fill" className="size-5" />
        </div>
        <h3 className="text-sm sm:text-base font-bold text-foreground mt-1">
          Trao đổi trực tiếp Zalo / Số điện thoại
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Mở khóa liên hệ sau khi đăng nhập an toàn. Thỏa thuận yêu cầu và chốt giờ hẹn trực tiếp mà không qua trung gian.
        </p>
      </div>

      <div className="flex flex-col gap-2 rounded-2xl border border-border/80 bg-card p-5 shadow-xs hover:border-primary/30 transition-colors">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <GiftIcon weight="fill" className="size-5" />
        </div>
        <h3 className="text-sm sm:text-base font-bold text-foreground mt-1">
          100% Miễn phí cho thực hành tay nghề
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Không thu phí kết nối đối với học viên trang điểm, làm móng và các mẫu ảnh hỗ trợ thực hành nâng cao kỹ năng.
        </p>
      </div>
    </section>
  );
}
