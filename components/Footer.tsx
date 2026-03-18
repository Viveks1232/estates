'use client';

import { Instagram, Linkedin, Twitter, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-20 px-6 bg-[#0A0A0A] border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 border border-[#C5A059] flex items-center justify-center rotate-45">
                <span className="text-sm font-serif text-[#C5A059] -rotate-45">IV</span>
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
                  className="text-white/40 hover:text-[#C5A059] transition-colors"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white text-xs uppercase tracking-[0.3em] font-bold mb-8">Quick Links</h4>
            <ul className="space-y-4">
              {['Home', 'Properties', 'Services', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <a 
                    suppressHydrationWarning
                    href="#" 
                    className="text-white/40 text-sm hover:text-[#C5A059] transition-colors font-light"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-xs uppercase tracking-[0.3em] font-bold mb-8">Legal</h4>
            <ul className="space-y-4">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Fair Housing'].map((item) => (
                <li key={item}>
                  <a 
                    suppressHydrationWarning
                    href="#" 
                    className="text-white/40 text-sm hover:text-[#C5A059] transition-colors font-light"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/20 text-[10px] uppercase tracking-widest">
            © 2026 IVIGIL ESTATES. All Rights Reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-white/20 text-[10px] uppercase tracking-widest">Designed by</span>
            <span className="text-[#C5A059] text-[10px] uppercase tracking-widest font-bold">Luxury Digital</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
