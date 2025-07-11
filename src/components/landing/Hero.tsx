
"use client";

// this is a client component
import { Link } from "react-router-dom";
import { ArrowRight, Plus, Radio } from 'lucide-react';

import { Suspense, lazy } from 'react';
const CanvasAnimation = lazy(() => import('@/components/ui/CanvasAnimation'));

import { Button } from "@/components/ui/button";

export function Hero() {

  return (
    <section id="home" className="pt-20">
      <div className="animation-delay-8 animate-fadeIn flex flex-col items-center justify-center px-4 text-center">
        <div className="z-10 mb-6 sm:justify-center md:mb-8">
          <Link to="/auth" className="block">
            <div className="flex items-center whitespace-nowrap rounded-full border border-white/20 bg-slate-900/80 backdrop-blur-sm px-4 py-2 text-sm leading-6 text-white hover:bg-slate-800/80 transition-colors shadow-lg">
              <Radio className="h-5 p-1 text-sky-400" />
              <span className="ml-2">Introducing Sound Vibe Connect Hub.</span>
              <span className="ml-2 font-semibold text-sky-400">Explore</span>
              <ArrowRight className="ml-1 h-4 w-4 text-sky-400" />
            </div>
          </Link>
        </div>

        <div className="mb-10 mt-6">
          <div className="px-2">
            <div className="border-ali relative mx-auto h-full max-w-7xl border p-6 [mask-image:radial-gradient(800rem_96rem_at_center,white,transparent)] md:px-12 md:py-20">
              <h1 className="relative select-none px-3 py-2 text-center text-5xl font-semibold leading-none tracking-tight md:text-8xl">
                <Plus
                  strokeWidth={4}
                  className="text-ali absolute -left-5 -top-5 h-10 w-10"
                />
                <Plus
                  strokeWidth={4}
                  className="text-ali absolute -bottom-5 -left-5 h-10 w-10"
                />
                <Plus
                  strokeWidth={4}
                  className="text-ali absolute -right-5 -top-5 h-10 w-10"
                />
                <Plus
                  strokeWidth={4}
                  className="text-ali absolute -bottom-5 -right-5 h-10 w-10"
                />
                <div>Your complete platform for Music Collaboration.</div>
              </h1>
              <div className="flex items-center justify-center gap-1">
                <span className="relative flex h-3 w-3 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                </span>
                <p className="text-xs text-green-500">Available Now</p>
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl text-white [text-shadow:0_4px_8px_rgba(0,0,0,0.5)]">
            Welcome to the future of music creation!
          </h1>

          <p className="max-w-xl mt-4 mx-auto text-center text-base text-neutral-200 md:text-lg [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">
            Connect with artists, producers, and songwriters to create amazing tracks together.
          </p>
          <div className="mt-8 flex justify-center gap-2">
            <Link to={"/profile-setup"}>
              <Button variant="default" size="lg">
                Start Creating
              </Button>
            </Link>
            <Link to={"/discover"}>
              <Button variant="outline" size="lg">
                Discover Talent
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Suspense fallback={<div className="bg-skin-base pointer-events-none absolute inset-0 mx-auto" />}>
        <CanvasAnimation />
      </Suspense>
    </section>
  );
};
