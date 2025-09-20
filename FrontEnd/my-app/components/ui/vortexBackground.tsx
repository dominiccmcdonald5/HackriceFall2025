"use client";
import React from "react";
import { Vortex } from "../ui/vortex";

export default function VortexBackground() {
  return (
    <div className="fixed inset-0 -z-10 w-full h-full overflow-hidden">
      <Vortex
        backgroundColor="black"
        rangeY={800}
        particleCount={500}
        baseHue={120}
        className="w-full h-full"
      />
    </div>
  );
}