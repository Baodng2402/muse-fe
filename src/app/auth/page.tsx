import { Suspense } from "react";
import { AuthPage } from "@/src/features/auth/page";

export default function Auth() {
  return (
    <Suspense fallback={null}>
      <AuthPage />
    </Suspense>
  );
}
