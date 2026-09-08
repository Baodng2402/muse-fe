"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/src/shared/components/ui/button";
import { useMockSession } from "@/src/shared/store/mock-session";
import {
  EnvelopeSimpleIcon,
  LockSimpleIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react/dist/ssr";

export function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/posts";
  const { session, hydrated, login } = useMockSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hydrated && session) {
      router.replace(redirectTo);
    }
  }, [hydrated, session, redirectTo, router]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const ok = login(email, password);
    if (!ok) {
      setError("Email hoặc mật khẩu không đúng.");
      return;
    }
    setError(null);
    router.push(redirectTo);
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
            href="/"
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
          {/* Logo (mobile only — desktop shows on image side) */}
          <Link
            href="/"
            className="mb-8 text-xl font-bold tracking-tight text-foreground lg:hidden"
          >
            Muse
          </Link>

          <div className="flex flex-col gap-1.5">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Đăng nhập
            </h1>
            <p className="text-sm leading-6 text-muted-foreground">
              Đăng nhập để xem số điện thoại và liên hệ trực tiếp với thợ, mẫu
              hoặc khách hàng trên Muse.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="mt-8 flex flex-col gap-4"
          >
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
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  placeholder="••••••"
                  className="w-full rounded-lg border border-input bg-background py-2.5 pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
                />
              </div>
            </div>

            {error ? (
              <p
                role="alert"
                className="flex items-center gap-1.5 text-sm text-destructive"
              >
                <WarningCircleIcon className="size-4" />
                {error}
              </p>
            ) : null}

            <Button type="submit" size="lg" nativeButton className="mt-2 w-full">
              Đăng nhập
            </Button>
          </form>

          <div className="mt-6 rounded-lg border border-border bg-muted/30 p-3 text-center text-xs text-muted-foreground">
            Tài khoản demo:{" "}
            <span className="font-medium text-foreground">
              demo@muse.com
            </span>{" "}
            / <span className="font-medium text-foreground">123456</span>
          </div>

          <Link
            href="/"
            className="mt-6 block text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
