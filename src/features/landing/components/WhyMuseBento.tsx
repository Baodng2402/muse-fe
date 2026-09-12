import {
  LightningIcon,
  ShieldCheckIcon,
  GiftIcon,
} from '@phosphor-icons/react/dist/ssr';

export function WhyMuseBento() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div className="flex flex-col gap-1.5 rounded-2xl border border-border/80 bg-card p-4">
        <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <LightningIcon weight="fill" className="size-4" />
        </div>
        <h3 className="text-xs sm:text-sm font-bold text-foreground">
          Đăng bài & Ứng tuyển nhanh
        </h3>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Không bị trôi bài như Facebook. Rõ ràng khung giờ, địa điểm và số slot cần tuyển.
        </p>
      </div>

      <div className="flex flex-col gap-1.5 rounded-2xl border border-border/80 bg-card p-4">
        <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
          <ShieldCheckIcon weight="fill" className="size-4" />
        </div>
        <h3 className="text-xs sm:text-sm font-bold text-foreground">
          Liên hệ trực tiếp qua Zalo / SĐT
        </h3>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Xem thông tin liên hệ và trao đổi trực tiếp, chốt lịch tức thì không qua trung gian.
        </p>
      </div>

      <div className="flex flex-col gap-1.5 rounded-2xl border border-border/80 bg-card p-4">
        <div className="flex size-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
          <GiftIcon weight="fill" className="size-4" />
        </div>
        <h3 className="text-xs sm:text-sm font-bold text-foreground">
          100% Miễn phí nền tảng
        </h3>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Không thu phí kết nối đối với học viên và mẫu ảnh thực hành.
        </p>
      </div>
    </section>
  );
}
