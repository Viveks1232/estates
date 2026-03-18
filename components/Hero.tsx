'use client';

import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';

const TOTAL_FRAMES = 90;

export default function Hero() {
  const [currentFrame, setCurrentFrame] = useState(1);
  const [isAnimating, setIsAnimating] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  const nextFrame = useCallback(() => {
    setCurrentFrame((prev) => {
      if (prev >= TOTAL_FRAMES) {
        setIsAnimating(false);
        return prev;
      }
      return prev + 1;
    });
  }, []);

  useEffect(() => {
    if (!isAnimating) {
      const timeout = setTimeout(() => {
        setShowSplash(false);
      }, 500);
      return () => clearTimeout(timeout);
    }

    const interval = setInterval(() => {
      nextFrame();
    }, 50);

    return () => clearInterval(interval);
  }, [isAnimating, nextFrame]);

  const frameNumber = String(currentFrame).padStart(3, '0');

  if (showSplash) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden">
        {/* Frame Animation Background */}
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFrame}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.04 }}
              className="absolute inset-0"
            >
              <Image
                src={`/realestate/ezgif-frame-${frameNumber}.jpg`}
                alt="Loading"
                fill
                className="object-cover"
                priority
                unoptimized
              />
            </motion.div>
          </AnimatePresence>
          
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/30" />
        </div>



        {/* Skip Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          onClick={() => setShowSplash(false)}
          className="absolute bottom-8 right-8 px-6 py-2 border border-white/20 text-white/60 text-[10px] uppercase tracking-[0.2em] hover:border-[#C5A059] hover:text-[#C5A059] transition-all duration-300"
        >
          Skip
        </motion.button>
      </div>
    );
  }

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-[#0A0A0A]">
      {/* Hero Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={`/realestate/ezgif-frame-${String(TOTAL_FRAMES).padStart(3, '0')}.jpg`}
          alt="IVIGIL ESTATES"
          fill
          className="object-cover brightness-[0.4]"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/30 via-transparent to-[#0A0A0A]" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl flex flex-col items-center">
        <div className="overflow-hidden mb-6">
          <motion.span 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-[#C5A059] text-xs md:text-sm uppercase tracking-[0.5em] block font-sans"
          >
            Redefining Luxury Living
          </motion.span>
        </div>

        <div className="mb-8">
          <div className="overflow-hidden pb-2">
            <motion.h1 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl md:text-8xl font-serif leading-tight"
            >
              The Art of
            </motion.h1>
          </div>
          <div className="overflow-hidden pb-4">
            <motion.h1 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl md:text-8xl font-serif leading-tight italic"
            >
              Exquisite Estates
            </motion.h1>
          </div>
        </div>

        <div className="overflow-hidden mb-12 max-w-2xl mx-auto p-1">
          <motion.p 
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-white/60 text-sm md:text-lg font-light tracking-wide leading-relaxed font-sans"
          >
            Experience unparalleled elegance and sophistication with IVIGIL ESTATES. 
            We curate the world&rsquo;s most prestigious properties for those who demand nothing but the best.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
          className="flex flex-col md:flex-row items-center justify-center gap-6"
        >
          <button 
            type="button"
            suppressHydrationWarning
            className="px-10 py-4 bg-[#C5A059] text-[#0A0A0A] text-xs uppercase tracking-[0.3em] font-bold hover:bg-white transition-all duration-500 w-full md:w-auto font-sans"
          >
            View Collection
          </button>
          <button 
            type="button"
            suppressHydrationWarning
            className="px-10 py-4 border border-[#C5A059]/40 text-white text-xs uppercase tracking-[0.3em] font-bold hover:border-white transition-all duration-500 w-full md:w-auto font-sans"
          >
            Our Story
          </button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 rotate-90 mb-8">Scroll</span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-[#C5A059] to-transparent" />
      </motion.div>
    </section>
  );
}
