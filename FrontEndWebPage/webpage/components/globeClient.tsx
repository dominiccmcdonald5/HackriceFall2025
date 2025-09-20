"use client";
import dynamic from "next/dynamic";

const GlobeDemo = dynamic(() => import("@/components/ui/globeDemo"), {
  ssr: false,
});

export default function GlobeClient() {
  return <GlobeDemo />;
}
