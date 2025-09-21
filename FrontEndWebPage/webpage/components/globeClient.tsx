"use client";

import dynamic from "next/dynamic";
import type { MyMarker } from "@/components/ui/globe";

const GlobeDemo = dynamic(() => import("@/components/ui/globe"), { ssr: false });

interface GlobeClientProps {
  onMarkerClick: (marker: MyMarker) => void;
}

export default function GlobeClient({ onMarkerClick }: GlobeClientProps) {
  return <GlobeDemo onMarkerClick={onMarkerClick} />;
}
