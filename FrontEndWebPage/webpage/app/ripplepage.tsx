// app/ripple-demo/page.tsx
import RippleClient from "@/components/rippleClient";

export default function RippleDemoPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      <div className="relative flex h-[500px] w-full max-w-4xl flex-col items-center justify-center overflow-hidden rounded-lg border bg-background shadow-xl">
        <p className="z-10 whitespace-pre-wrap text-center text-5xl font-medium tracking-tighter text-foreground">
          Ripple Effect Demo
        </p>
        <RippleClient
          mainCircleSize={210}
          mainCircleOpacity={0.24}
          numCircles={8}
        />
      </div>
      
      <div className="mt-8 text-center max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4">Ripple Component</h2>
        <p className="text-muted-foreground">
          This demonstrates the animated ripple effect component with configurable
          circle size, opacity, and number of circles.
        </p>
      </div>
    </div>
  );
}