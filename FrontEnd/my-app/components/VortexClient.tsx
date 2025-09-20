"use client";
import dynamic from "next/dynamic";

const VortexDemo = dynamic(() => import("@/components/ui/vortexDemo"), {
  ssr: false,
});

export default function VortexClient() {
  return <VortexDemo />;
}
