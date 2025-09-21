"use client";

// rippleClient.tsx
"use client";

import dynamic from "next/dynamic";
import type { RippleProps } from "@/components/ui/ripple";

// Simplified dynamic import without the complex typing
const Ripple = dynamic(
  () => import("@/components/ui/ripple").then((mod) => mod.Ripple),
  { ssr: false }
);

export default function RippleClient(props: RippleProps) {
  return <Ripple {...props} />;
}
