// app/ripple-demo/page.tsx
import RippleClient from "@/components/rippleClient";

export default function RippleDemoPage() {
  const handleButtonClick = () => {
    console.log("Button clicked!");
    // Add your button click logic here
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <RippleClient
        mainCircleSize={280}
        mainCircleOpacity={0.3}
        numCircles={10}
        className="text-blue-500"
        style={{
          color: '#ff6b6b',
        }}
        title="Ripple Effect Demo"
      />
    </div>
  );
}