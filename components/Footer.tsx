'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Instagram, Linkedin, Twitter, Facebook } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const elementsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(elementsRef.current,
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1, 
          stagger: 0.15, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 85%',
          }
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer className="py-20 px-6 bg-[#0A0A0A] border-t border-white/5 relative overflow-hidden" ref={footerRef}>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C5A059]/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="lg:col-span-2" ref={el => { elementsRef.current[0] = el; }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 border border-[#C5A059] flex items-center justify-center rotate-45 group hover:border-white transition-colors duration-500 cursor-pointer">
                <span className="text-sm font-serif text-[#C5A059] -rotate-45 group-hover:text-white transition-colors duration-500">IV</span>
              </div>
              <span className="text-2xl font-serif tracking-widest uppercase text-white">
                IVIGIL <span className="text-[#C5A059]">ESTATES</span>
              </span>
            </div>
            <p className="text-white/40 text-sm max-w-md leading-relaxed font-light mb-8">
              Redefining the standards of luxury real estate through a commitment to excellence, 
              discretion, and unparalleled market expertise. Your vision, our masterpiece.
            </p>
            <div className="flex gap-6">
              {[Instagram, Linkedin, Twitter, Facebook].map((Icon, i) => (
                <a 
                  suppressHydrationWarning
                  key={i} 
                  href="#" 
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-[#C5A059] hover:border-[#C5A059] hover:bg-[#C5A059]/10 transition-all duration-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div ref={el => { elementsRef.current[1] = el; }}>
            <h4 className="text-white text-xs uppercase tracking-[0.3em] font-bold mb-8 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#C5A059] rounded-full" />
              Quick Links
            </h4>
            <ul className="space-y-4">
              {['Home', 'Properties', 'Services', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <a 
                    suppressHydrationWarning
                    href="#" 
                    className="text-white/40 text-sm hover:text-[#C5A059] hover:translate-x-2 transition-all duration-300 font-light inline-block"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div ref={el => { elementsRef.current[2] = el; }}>
            <h4 className="text-white text-xs uppercase tracking-[0.3em] font-bold mb-8 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#C5A059] rounded-full" />
              Legal
            </h4>
            <ul className="space-y-4">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Fair Housing'].map((item) => (
                <li key={item}>
                  <a 
                    suppressHydrationWarning
                    href="#" 
                    className="text-white/40 text-sm hover:text-[#C5A059] hover:translate-x-2 transition-all duration-300 font-light inline-block"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div ref={el => { elementsRef.current[3] = el; }} className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/20 text-[10px] uppercase tracking-widest">
            © 2026 IVIGIL ESTATES. All Rights Reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-white/20 text-[10px] uppercase tracking-widest">Designed by</span>
            <span className="text-[#C5A059] text-[10px] uppercase tracking-widest font-bold tracking-[0.2em] relative group cursor-pointer">
              Luxury Digital
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#C5A059] transition-all duration-300 group-hover:w-full" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
