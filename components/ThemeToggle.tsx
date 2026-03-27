'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="relative p-2 rounded-full border border-accent/20 bg-background/50 backdrop-blur-md hover:border-accent/50 transition-colors duration-300 group"
      aria-label="Toggle Theme"
    >
      <div className="relative w-6 h-6 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          {theme === 'dark' ? (
            <motion.div
              key="sun"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Sun size={20} className="text-accent group-hover:rotate-45 transition-transform duration-500" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Moon size={20} className="text-accent group-hover:-rotate-12 transition-transform duration-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </button>
  );
}
