// app/ripple-demo/page.tsx
"use client";

import RippleClient from "@/components/rippleClient";
import Link from "next/link";

export default function RippleDemoPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-green-900 overflow-hidden">
      {/* Ripple in the background */}
      <RippleClient
        mainCircleSize={280}
        mainCircleOpacity={0.8}
        numCircles={10}
        className="z-0 text-blue-500"
        style={{ color: "#ff6b6b" }}
      />

      {/* Foreground content */}
      <div className="z-10 flex flex-col items-center">
        <h1 className="mb-6 text-center text-4xl font-bold tracking-tight text-white">
          Global Resource FootPrint
        </h1>

        <Link
          href="/main"
          className="rounded-lg bg-blue-600 px-6 py-3 text-white font-medium shadow hover:bg-blue-500 transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
