'use client';

import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

const TOTAL_FRAMES = 90;

export default function Hero() {
  const [currentFrame, setCurrentFrame] = useState(1);
  const [isAnimating, setIsAnimating] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const keyRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const bgImageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frameInterval = setInterval(() => {
      setCurrentFrame(prev => {
        if (prev >= TOTAL_FRAMES) {
          clearInterval(frameInterval);
          setIsAnimating(false);
          return prev;
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(frameInterval);
  }, []);

  useEffect(() => {
    if (!isAnimating) {
      const tl = gsap.timeline();

      tl.to(loaderRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.inOut',
      });

      tl.to(bgImageRef.current, {
        scale: 1.05,
        duration: 1.5,
        ease: 'power2.out',
        onComplete: () => {
          gsap.to(bgImageRef.current, {
            scale: 1.15,
            duration: 20,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut',
          });
        }
      }, 0);

      if (contentRef.current) {
        const elements = contentRef.current.querySelectorAll('.animate-in');
        gsap.set(elements, { y: 60, opacity: 0 }); // Intialize immediately to avoid flash
        tl.to(elements,
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out' },
          0.2
        );
      }

      tl.to(loaderRef.current, {
        display: 'none',
        duration: 0,
      });
    }
  }, [isAnimating]);

  const frameNumber = String(currentFrame).padStart(3, '0');

  return (
    <>
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[9999] bg-[#0A0A0A] flex items-center justify-center overflow-hidden"
          >
            <div className="absolute inset-0">
              <Image
                src={`/realestate/ezgif-frame-${frameNumber}.jpg`}
                alt="Loading"
                fill
                className="object-cover opacity-60"
                priority
                unoptimized
              />
              <div className="absolute inset-0 bg-black/50" />
            </div>

            <div className="relative z-10 text-center px-6 flex flex-col items-center">
              <div className="overflow-hidden">
                <motion.div
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="text-white text-2xl md:text-4xl font-serif tracking-[0.2em]"
                >
                  IVIGIL ESTATES
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section ref={bgRef} className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-[#0A0A0A]">
        <div ref={bgImageRef} className="absolute inset-0 z-0 origin-center w-full h-full scale-100">
          <Image
            src={`/realestate/ezgif-frame-${String(TOTAL_FRAMES).padStart(3, '0')}.jpg`}
            alt="IVIGIL ESTATES"
            fill
            className="object-cover brightness-[0.35]"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/50 via-transparent to-[#0A0A0A]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/80 via-transparent to-[#0A0A0A]/80" />
        </div>

        <div ref={contentRef} className="relative z-10 text-center px-6 max-w-5xl flex flex-col items-center">
            <div className="overflow-hidden mb-6">
              <span className="animate-in text-[#C5A059] text-xs md:text-sm uppercase tracking-[0.5em] block font-sans">
                Redefining Luxury Living
              </span>
            </div>

            <div className="mb-8 relative">
              <div className="absolute -inset-10 bg-[#C5A059]/20 blur-[100px] rounded-full pointer-events-none" />
              <div className="overflow-hidden pb-2 relative z-10">
                <h1 className="animate-in text-5xl md:text-8xl font-serif leading-tight">
                  The Art of
                </h1>
              </div>
              <div className="overflow-hidden pb-4">
                <h1 className="animate-in text-5xl md:text-8xl font-serif leading-tight italic">
                  Exquisite Estates
                </h1>
              </div>
            </div>

            <div className="overflow-hidden mb-12 max-w-2xl mx-auto p-1">
              <p className="animate-in text-white/60 text-sm md:text-lg font-light tracking-wide leading-relaxed font-sans">
                Experience unparalleled elegance and sophistication with IVIGIL ESTATES.
                We curate the world&apos;s most prestigious properties for those who demand nothing but the best.
              </p>
            </div>

            <div className="animate-in flex flex-col md:flex-row items-center justify-center gap-6">
              <button
                type="button"
                className="group relative px-10 py-4 bg-[#C5A059] text-[#0A0A0A] text-xs uppercase tracking-[0.3em] font-bold overflow-hidden hover:bg-white transition-all duration-500 w-full md:w-auto font-sans"
              >
                <span className="relative z-10">View Collection</span>
              </button>
              <button
                type="button"
                className="group px-10 py-4 border border-[#C5A059]/40 text-white text-xs uppercase tracking-[0.3em] font-bold hover:border-white transition-all duration-500 w-full md:w-auto font-sans relative overflow-hidden"
              >
                <span className="relative z-10">Our Story</span>
              </button>
            </div>
          </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
          <span className="animate-in text-[10px] uppercase tracking-[0.3em] text-white/40 rotate-90 mb-8">Scroll</span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-[#C5A059] to-transparent" />
        </div>
      </section>

      <div
        ref={loaderRef}
        className="fixed inset-0 z-[9998] bg-[#0A0A0A] flex items-center justify-center pointer-events-none"
        style={{ display: 'flex' }}
      >
        <div className="text-center">
          <div className="overflow-hidden mb-4">
            <div
              className="text-white/90 text-2xl md:text-4xl font-serif tracking-[0.2em]"
            >
              IVIGIL ESTATES
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
