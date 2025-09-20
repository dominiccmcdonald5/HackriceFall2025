// pages/index.tsx
import Head from 'next/head';
import { useCallback } from 'react';
import Particles from '@tsparticles/react';
import { loadFull } from 'tsparticles';
import type { Container, Engine } from '@tsparticles/engine';

export default function Home() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <Head>
        <title>Vortex Background</title>
        <meta name="description" content="Vortex particle background with Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Particles Background */}
      <div className="absolute inset-0 z-0">
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            background: {
              color: {
                value: "transparent",
              },
            },
            fpsLimit: 120,
            particles: {
              color: {
                value: "#ffffff",
              },
              links: {
                color: "#ffffff",
                distance: 150,
                enable: true,
                opacity: 0.3,
                width: 1,
              },
              move: {
                direction: "none",
                enable: true,
                outModes: {
                  default: "bounce",
                },
                random: false,
                speed: 2,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                },
                value: 80,
              },
              opacity: {
                value: 0.3,
              },
              shape: {
                type: "circle",
              },
              size: {
                value: { min: 1, max: 3 },
              },
            },
            detectRetina: true,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">Welcome to the Vortex</h1>
        <p className="text-xl mb-8 max-w-2xl">
          The vortex is just the background, and all of this is on top.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105">
            Order now
          </button>
          <button className="border-2 border-white hover:bg-white hover:text-black text-white font-bold py-3 px-8 rounded-full transition duration-300">
            Watch trailer
          </button>
        </div>
        
        <div className="text-4xl font-bold">
          N
        </div>
      </div>
    </div>
  );
}