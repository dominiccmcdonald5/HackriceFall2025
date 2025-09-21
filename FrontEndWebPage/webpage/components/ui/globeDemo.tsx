"use client";

import Globe from "./globe";
import type { MyMarker } from "./globe";

interface GlobeDemoProps {
  onMarkerClick?: (marker: MyMarker) => void;
}

export default function GlobeDemo({ onMarkerClick }: GlobeDemoProps) {
  return (
    <div className="relative flex w-full max-w-lg items-center justify-center rounded-lg p-8 bg-white/10">
      <Globe onMarkerClick={onMarkerClick} />
    </div>
  );
}
