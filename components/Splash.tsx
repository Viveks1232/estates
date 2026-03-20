'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState, useRef } from 'react';

const FRAME_COUNT = 90;
const FPS = 30;
const FRAME_DURATION = 1000 / FPS;

export default function Splash() {
  const [isVisible, setIsVisible] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
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
          // Finished animation, show Enter button
          setIsReady(true);
          return; // Stop animation loop
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => cancelAnimationFrame(animationFrameId);
  }, [imagesLoaded]);

  const handleMouseMove = (e: React.MouseEvent) => {
    // Parallax logic: map mouse position to a small translation
    // Mouse relative to center: -1 to 1
    const x = ((e.clientX / window.innerWidth) - 0.5) * -30; // 30px max movement
    const y = ((e.clientY / window.innerHeight) - 0.5) * -30;
    setMousePos({ x, y });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] bg-[#0A0A0A] flex flex-col items-center justify-center overflow-hidden"
          onMouseMove={handleMouseMove}
        >
          {/* Canvas for the fast frame sequence with Parallax */}
          <motion.div 
            animate={{ 
              x: mousePos.x, 
              y: mousePos.y 
            }}
            transition={{ type: "spring", damping: 30, stiffness: 200, mass: 0.5 }}
            className="absolute inset-[-50px] z-0"
          >
            <canvas
              ref={canvasRef}
              className={`w-full h-full object-cover transition-opacity duration-500 transform scale-[1.05] ${imagesLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
          </motion.div>
          
          {/* Gradient Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 z-10 pointer-events-none" />

          {/* Interactive UI Overlay */}
          <div className="relative z-20 flex flex-col items-center justify-center h-full w-full pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="flex flex-col items-center gap-8 pointer-events-auto mt-[40vh]"
            >
              <h1 className="text-white text-4xl md:text-6xl font-serif text-center drop-shadow-2xl font-light">
                Discover Luxury <br /> <span className="italic text-[#C5A059]">Estates</span>
              </h1>
              
              <button
                onClick={() => setIsVisible(false)}
                className="group relative px-8 py-4 bg-transparent overflow-hidden border border-white/30 hover:border-[#C5A059] transition-colors duration-500 cursor-pointer"
              >
                <div className="absolute inset-0 bg-[#C5A059] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
                <span className="relative z-10 text-white text-[11px] uppercase tracking-[0.4em] font-bold group-hover:text-black transition-colors duration-500">
                  Enter Experience
                </span>
              </button>
            </motion.div>
          </div>
          
        </motion.div>
      )}
    </AnimatePresence>
  );
}
