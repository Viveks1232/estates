'use client';

import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Properties', href: '#properties' },
    { name: 'Services', href: '#services' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? 'bg-[#0A0A0A]/90 backdrop-blur-md py-4' : 'bg-transparent py-8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 border border-[#C5A059] flex items-center justify-center rotate-45">
            <span className="text-sm font-serif text-[#C5A059] -rotate-45">IV</span>
          </div>
          <span className="text-xl font-serif tracking-widest uppercase text-white">
            IVIGIL <span className="text-[#C5A059]">ESTATES</span>
          </span>
        </motion.div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link, index) => (
            <motion.a
              suppressHydrationWarning
              key={link.name}
              href={link.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-xs uppercase tracking-[0.2em] text-white/70 hover:text-[#C5A059] transition-colors"
            >
              {link.name}
            </motion.a>
          ))}
          <motion.button
            type="button"
            suppressHydrationWarning
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-6 py-2 border border-[#C5A059] text-[#C5A059] text-xs uppercase tracking-widest hover:bg-[#C5A059] hover:text-black transition-all duration-300"
          >
            Inquire
          </motion.button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button 
            type="button"
            suppressHydrationWarning
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="text-white"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: isMobileMenuOpen ? 1 : 0, height: isMobileMenuOpen ? 'auto' : 0 }}
        className="md:hidden bg-[#0A0A0A] overflow-hidden"
      >
        <div className="px-6 py-10 flex flex-col gap-6 items-center">
          {navLinks.map((link) => (
            <a
              suppressHydrationWarning
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm uppercase tracking-[0.3em] text-white/70 hover:text-[#C5A059]"
            >
              {link.name}
            </a>
          ))}
          <button 
            type="button"
            suppressHydrationWarning
            className="w-full py-4 border border-[#C5A059] text-[#C5A059] text-xs uppercase tracking-widest"
          >
            Inquire Now
          </button>
        </div>
      </motion.div>
    </nav>
  );
}
