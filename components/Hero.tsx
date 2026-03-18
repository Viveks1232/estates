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

        {/* Loader Box - Same style as reference */}
        <div className="relative z-10 text-center px-8 max-w-3xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="loader-box"
          >
            {/* Line 1 */}
            <div className="overflow-hidden mb-2">
              <motion.div
                className="text-white text-lg md:text-2xl font-light tracking-wide"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              >
                Redefining Luxury Living
              </motion.div>
            </div>
            
            {/* Line 2 */}
            <div className="overflow-hidden mb-8">
              <motion.div
                className="text-[#C5A059] text-xl md:text-3xl font-semibold tracking-wide"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
              >
                IVIGIL ESTATES
              </motion.div>
            </div>

            {/* Loader Key Animation */}
            <div className="flex justify-center">
              <motion.div
                className="w-16 h-1 bg-[#C5A059] rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.8,
                  ease: 'easeInOut'
                }}
                style={{ transformOrigin: 'center' }}
              />
            </div>

            {/* Progress indicator */}
            <motion.div 
              className="mt-6 flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <span className="text-white/40 text-[10px] uppercase tracking-[0.3em]">
                {Math.round((currentFrame / TOTAL_FRAMES) * 100)}%
              </span>
            </motion.div>
          </motion.div>
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
      <motion.div 
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute inset-0 z-0"
      >
        <Image
          src={`/realestate/ezgif-frame-${String(TOTAL_FRAMES).padStart(3, '0')}.jpg`}
          alt="IVIGIL ESTATES"
          fill
          className="object-cover brightness-[0.4]"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/30 via-transparent to-[#0A0A0A]" />
      </motion.div>

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
        className="relative z-10 text-center px-6 max-w-5xl"
      >
        <span className="text-[#C5A059] text-xs md:text-sm uppercase tracking-[0.5em] mb-6 block">
          Redefining Luxury Living
        </span>
        <h1 className="text-5xl md:text-8xl font-serif leading-tight mb-8">
          The Art of <br />
          <span className="italic">Exquisite</span> Estates
        </h1>
        <p className="text-white/60 text-sm md:text-lg max-w-2xl mx-auto mb-12 font-light tracking-wide leading-relaxed">
          Experience unparalleled elegance and sophistication with IVIGIL ESTATES. 
          We curate the world&rsquo;s most prestigious properties for those who demand nothing but the best.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <button 
            type="button"
            suppressHydrationWarning
            className="px-10 py-4 bg-[#C5A059] text-white text-xs uppercase tracking-[0.3em] font-medium hover:bg-[#d94a1f] transition-all duration-500 w-full md:w-auto"
          >
            View Collection
          </button>
          <button 
            type="button"
            suppressHydrationWarning
            className="px-10 py-4 border border-white/20 text-white text-xs uppercase tracking-[0.3em] font-medium hover:border-[#C5A059] hover:text-[#C5A059] transition-all duration-500 w-full md:w-auto"
          >
            Our Story
          </button>
        </div>
      </motion.div>

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
