'use client';

import { useEffect } from 'react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('[Global Root Error]:', error);
  }, [error]);

  return (
    <html lang="vi">
      <body className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900 p-4 font-sans antialiased">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-200 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Lỗi hệ thống nghiêm trọng</h1>
          <p className="text-sm text-slate-500 mb-6">
            Rất tiếc đã có sự cố ngoài dự tính xảy ra tại tầng giao diện chính của ứng dụng.
          </p>
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium transition"
          >
            Tải lại ứng dụng
          </button>
        </div>
      </body>
    </html>
  );
}
