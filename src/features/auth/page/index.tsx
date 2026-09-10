"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/src/shared/components/ui/button";
import { useAuthStore } from "@/src/shared/store/use-auth-store";
import { useLoginMutation, useRegisterMutation } from "@/src/features/auth/hooks/use-auth";
import {
  EnvelopeSimpleIcon,
  LockSimpleIcon,
  UserIcon,
  WarningCircleIcon,
  SpinnerGapIcon,
} from "@phosphor-icons/react";
import { ROUTES } from "@/src/core/config/routes";

export function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || ROUTES.home;

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);

  const [mode, setMode] = useState<"login" | "register">("login");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isProvider, setIsProvider] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();

  const isPending = loginMutation.isPending || registerMutation.isPending;

  useEffect(() => {
    if (hasHydrated && isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [hasHydrated, isAuthenticated, redirectTo, router]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage("Vui lòng điền đầy đủ email và mật khẩu.");
      return;
    }

    if (mode === "login") {
      loginMutation.mutate(
        { email: email.trim(), password },
        {
          onError: (err) => {
            setErrorMessage(err.message || "Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.");
          },
        }
      );
    } else {
      if (!displayName.trim()) {
        setErrorMessage("Vui lòng nhập tên hiển thị của bạn.");
        return;
      }

      registerMutation.mutate(
        {
          email: email.trim(),
          password,
          display_name: displayName.trim(),
          is_provider: isProvider,
          is_customer: true,
        },
        {
          onError: (err) => {
            setErrorMessage(err.message || "Đăng ký không thành công. Vui lòng thử lại.");
          },
        }
      );
    }
  }

  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] flex-1">
      {/* Left — Editorial image (hidden on mobile) */}
      <div className="relative hidden w-1/2 lg:block">
        <Image
          src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&h=1600&fit=crop&q=80&auto=format"
          alt="Thợ trang điểm đang làm việc"
          fill
          sizes="50vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-10">
          <Link
            href={ROUTES.home}
            className="text-2xl font-bold tracking-tight text-white"
          >
            Muse
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-6 text-white/80">
            Nơi thợ làm đẹp và nhiếp ảnh gia kết nối với mẫu thực hành và
            khách hàng — xây dựng portfolio, nhận booking, tất cả trên một nền
            tảng.
          </p>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex w-full flex-1 flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          {/* Logo (mobile only) */}
          <Link
            href={ROUTES.home}
            className="mb-8 text-xl font-bold tracking-tight text-foreground lg:hidden"
          >
            Muse
          </Link>

          {/* Tab Selector: Login vs Register */}
          <div className="flex items-center rounded-xl bg-muted p-1 mb-6">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setErrorMessage(null);
              }}
              className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                mode === "login"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setErrorMessage(null);
              }}
              className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                mode === "register"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Tạo tài khoản mới
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              {mode === "login" ? "Chào mừng trở lại" : "Tham gia cộng đồng Muse"}
            </h1>
            <p className="text-sm leading-6 text-muted-foreground">
              {mode === "login"
                ? "Đăng nhập để xem số điện thoại và liên hệ trực tiếp trên Muse."
                : "Tạo tài khoản để đăng tin tuyển mẫu hoặc nhận booking ngay."}
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="mt-6 flex flex-col gap-4"
          >
            {mode === "register" && (
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="displayName"
                  className="text-sm font-medium text-foreground"
                >
                  Tên hiển thị / Tên thợ
                </label>
                <div className="relative">
                  <UserIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="displayName"
                    name="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    placeholder="Ví dụ: Hoàng My Makeup"
                    className="w-full rounded-lg border border-input bg-background py-2.5 pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email
              </label>
              <div className="relative">
                <EnvelopeSimpleIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-input bg-background py-2.5 pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Mật khẩu
              </label>
              <div className="relative">
                <LockSimpleIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-input bg-background py-2.5 pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
                />
              </div>
            </div>

            {mode === "register" && (
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isProvider}
                  onChange={(e) => setIsProvider(e.target.checked)}
                  className="size-4 rounded border-input text-primary focus:ring-primary/20"
                />
                <span className="text-xs text-muted-foreground">
                  Tôi là thợ làm đẹp / nhiếp ảnh (muốn nhận booking, tuyển mẫu)
                </span>
              </label>
            )}

            {errorMessage ? (
              <p
                role="alert"
                className="flex items-center gap-1.5 text-sm text-destructive"
              >
                <WarningCircleIcon className="size-4 shrink-0" />
                <span>{errorMessage}</span>
              </p>
            ) : null}

            <Button
              type="submit"
              size="lg"
              nativeButton
              disabled={isPending}
              className="mt-2 w-full inline-flex items-center justify-center gap-2"
            >
              {isPending && <SpinnerGapIcon className="size-4 animate-spin" />}
              {mode === "login" ? "Đăng nhập" : "Đăng ký ngay"}
            </Button>
          </form>

          <Link
            href={ROUTES.home}
            className="mt-6 block text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
