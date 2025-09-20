import Link from "next/link";
import VortexClient from "@/components/VortexClient";

export default function MainPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white relative z-20" style={{ color: '#fff' }}>
      <VortexClient />
    </main>
  );
}
