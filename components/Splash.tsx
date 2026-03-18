'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState, useRef } from 'react';

const FRAME_COUNT = 90;
const FPS = 30;
const FRAME_DURATION = 1000 / FPS;

export default function Splash() {
  const [isVisible, setIsVisible] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  // Preload images
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      const paddedIndex = String(i).padStart(3, '0');
      img.src = `/realestate/ezgif-frame-${paddedIndex}.jpg`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === FRAME_COUNT) {
          setImagesLoaded(true);
        }
      };
      images.push(img);
    }
    imagesRef.current = images;

    // Fallback in case not all images load perfectly
    const timeout = setTimeout(() => {
      setImagesLoaded(true);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  // Play animation using Canvas
  useEffect(() => {
    if (!imagesLoaded) return;

    let frame = 1;
    let animationFrameId: number;
    let lastTime = performance.now();

    const draw = (time: number) => {
      const deltaTime = time - lastTime;

      if (deltaTime >= FRAME_DURATION) {
        lastTime = time - (deltaTime % FRAME_DURATION);

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        const img = imagesRef.current[frame - 1];

        if (canvas && ctx && img && img.complete) {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          
          // Calculate object-cover dimensions
          const canvasAspect = canvas.width / canvas.height;
          const imgAspect = img.width / img.height;
          let drawWidth, drawHeight, offsetX, offsetY;

          if (canvasAspect > imgAspect) {
            drawWidth = canvas.width;
            drawHeight = canvas.width / imgAspect;
            offsetX = 0;
            offsetY = (canvas.height - drawHeight) / 2;
          } else {
            drawWidth = canvas.height * imgAspect;
            drawHeight = canvas.height;
            offsetX = (canvas.width - drawWidth) / 2;
            offsetY = 0;
          }

          ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        }

        if (frame < FRAME_COUNT) {
          frame++;
        } else {
          // Finished animation 
          setTimeout(() => setIsVisible(false), 200);
          return; // Stop animation loop
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => cancelAnimationFrame(animationFrameId);
  }, [imagesLoaded]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] bg-[#0A0A0A] flex flex-col items-center justify-center"
        >
          {/* Prevent user interaction during loading */}
          <div className="absolute inset-0 z-10 pointer-events-auto" />
          
          {/* Canvas for the fast frame sequence */}
          <canvas
            ref={canvasRef}
            className={`w-full h-full object-cover transition-opacity duration-500 ${imagesLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
          

        </motion.div>
      )}
    </AnimatePresence>
  );
}
