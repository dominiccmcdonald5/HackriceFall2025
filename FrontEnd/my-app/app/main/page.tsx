import VortexBackground from "@/components/ui/vortexBackground";

export default function MainPage() {
  return (
    <main className="relative min-h-screen text-white bg-black overflow-hidden">
      {/* Background */}
      <VortexBackground />

      {/* Foreground content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center">
        <h1 className="text-4xl md:text-6xl font-bold">Welcome to the Vortex 🌌</h1>
        <p className="mt-4 text-lg md:text-2xl max-w-xl">
          Now the vortex is just the background, and all of this is on top.
        </p>
        <div className="mt-6 flex gap-4">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg">
            Order now
          </button>
          <button className="px-4 py-2">Watch trailer</button>
        </div>
      </div>
    </main>
  );
}
