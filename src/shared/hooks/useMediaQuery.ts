"use client"

import { useEffect, useState } from "react"

/**
 * Đọc trạng thái 1 CSS media query, cập nhật lại khi viewport đổi.
 * `false` ở lần render đầu trên server (SSR) — tránh mismatch, không đoán trước kích thước màn hình.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query)
    setMatches(mediaQueryList.matches)

    const listener = (event: MediaQueryListEvent) => setMatches(event.matches)
    mediaQueryList.addEventListener("change", listener)
    return () => mediaQueryList.removeEventListener("change", listener)
  }, [query])

  return matches
}
