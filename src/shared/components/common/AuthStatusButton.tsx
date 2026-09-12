"use client";

import Link from "next/link";
import { Button } from "@/src/shared/components/ui/button";
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/shared/components/ui/alert-dialog";
import { useAuthStore } from "@/src/shared/store/use-auth-store";
import { useLogout } from "@/src/features/auth/hooks/use-auth";
import { cn } from "@/src/shared/utils";

export function AuthStatusButton({
  className,
  onAction,
}: {
  className?: string;
  onAction?: () => void;
}) {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);
  const logout = useLogout();

  if (hasHydrated && isAuthenticated && user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/profile"
          onClick={onAction}
          className="rounded-full border border-border/80 bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
        >
          {user.display_name || "Tài khoản"}
        </Link>
        <AlertDialog>
          <AlertDialogTrigger
            render={<Button size="sm" variant="ghost" className={cn(className, "text-xs text-muted-foreground hover:text-destructive")} />}
          >
            Đăng xuất
          </AlertDialogTrigger>
          <AlertDialogPopup>
            <div className="flex flex-col gap-2">
              <AlertDialogTitle>Đăng xuất khỏi Muse?</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn sẽ cần đăng nhập lại để xem số điện thoại và liên hệ với
                người đăng tin.
              </AlertDialogDescription>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <AlertDialogClose render={<Button variant="outline" />}>
                Ở lại
              </AlertDialogClose>
              <AlertDialogClose
                render={
                  <Button
                    variant="destructive"
                    onClick={() => {
                      logout();
                      onAction?.();
                    }}
                  />
                }
              >
                Đăng xuất
              </AlertDialogClose>
            </div>
          </AlertDialogPopup>
        </AlertDialog>
      </div>
    );
  }

  return (
    <Button
      size="sm"
      variant="outline"
      nativeButton={false}
      render={<Link href="/auth" onClick={onAction} />}
      className={cn(className)}
    >
      Đăng nhập
    </Button>
  );
}
