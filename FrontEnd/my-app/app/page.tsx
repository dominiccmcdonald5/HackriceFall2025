import Image from "next/image";
import GlobeClient from "@/components/GlobeClient";

export default function Home() {
  return (
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
      <GlobeClient />
      </main>
  );
}
