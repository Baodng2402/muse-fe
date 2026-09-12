"use client";

import dynamic from "next/dynamic";

/**
 * feral-blob's mascot seeds its idle fidgets with `Math.random()`, so it
 * cannot be server-rendered without a hydration mismatch. Load it
 * client-only; every usage site should import from here, not `feral-blob`
 * directly.
 */
export const JellyBlobMascot = dynamic(
  () => import("feral-blob").then((mod) => mod.JellyBlobMascot),
  { ssr: false }
);
