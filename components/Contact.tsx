'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Phone, MapPin } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textGroupRef = useRef<HTMLDivElement>(null);
  const formGroupRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    interest: 'Acquisition',
    message: ''
  });

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoUrl = `mailto:hello@example.com?subject=New Property Inquiry from ${encodeURIComponent(formData.name)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nInterest: ${formData.interest}\n\nMessage:\n${formData.message}`)}`;
    window.location.href = mailtoUrl;
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
        }
      });

      tl.fromTo(textGroupRef.current,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: 'power3.out' }
      )
      .fromTo(formGroupRef.current,
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: 'power3.out' },
        '-=0.8'
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" className="py-24 px-6 bg-[#0F0F0F]" ref={containerRef}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div ref={textGroupRef}>
            <span className="text-[#C5A059] text-xs uppercase tracking-[0.4em] mb-6 block drop-shadow-[0_0_5px_rgba(197,160,89,0.5)]">Get In Touch</span>
            <h2 className="text-4xl md:text-6xl font-serif leading-tight mb-8">
              Begin Your <br />
              <span className="italic text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">Journey</span> With Us
            </h2>
            <p className="text-white/60 text-sm md:text-lg font-light leading-relaxed mb-12">
              Whether you are looking to acquire a new residence or sell a prestigious asset, 
              our team of experts is ready to provide the discreet and professional service you deserve.
            </p>

            <div className="space-y-8">
              <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#C5A059] group-hover:bg-[#C5A059]/10 transition-all duration-300">
                  <Mail size={20} className="text-[#C5A059] group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Email Us</p>
                  <p className="text-lg font-serif group-hover:text-[#C5A059] transition-colors duration-300">concierge@ivigilestates.com</p>
                </div>
              </div>
              <div 
                className="flex items-center gap-6 group cursor-pointer"
                onClick={() => window.open('https://wa.me/919876543210', '_blank')}
              >
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#C5A059] group-hover:bg-[#C5A059]/10 transition-all duration-300">
                  <Phone size={20} className="text-[#C5A059] group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Call Us</p>
                  <p className="text-lg font-serif group-hover:text-[#C5A059] transition-colors duration-300">+1 (800) IVIGIL-01</p>
                </div>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#C5A059] group-hover:bg-[#C5A059]/10 transition-all duration-300">
                  <MapPin size={20} className="text-[#C5A059] group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Visit Us</p>
                  <p className="text-lg font-serif group-hover:text-[#C5A059] transition-colors duration-300">7th Avenue, Manhattan, NY</p>
                </div>
              </div>
            </div>
          </div>

          <div
            ref={formGroupRef}
            className="bg-[#0A0A0A] p-10 md:p-16 border border-white/5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/5 blur-[80px] rounded-full pointer-events-none" />
            <form onSubmit={handleEmailSubmit} className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2 group">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 group-focus-within:text-[#C5A059] transition-colors">Full Name</label>
                  <input 
                    required
                    suppressHydrationWarning
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-transparent border-b border-white/10 py-2 focus:border-[#C5A059] outline-none transition-colors" 
                  />
                </div>
                <div className="space-y-2 group">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 group-focus-within:text-[#C5A059] transition-colors">Email Address</label>
                  <input 
                    required
                    suppressHydrationWarning
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-transparent border-b border-white/10 py-2 focus:border-[#C5A059] outline-none transition-colors" 
                  />
                </div>
              </div>
              <div className="space-y-2 group">
                <label className="text-[10px] uppercase tracking-widest text-white/40 group-focus-within:text-[#C5A059] transition-colors">Interest</label>
                <select 
                  suppressHydrationWarning
                  value={formData.interest}
                  onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                  className="w-full bg-transparent border-b border-white/10 py-2 focus:border-[#C5A059] outline-none transition-colors appearance-none"
                >
                  <option className="bg-[#0A0A0A]">Acquisition</option>
                  <option className="bg-[#0A0A0A]">Sale</option>
                  <option className="bg-[#0A0A0A]">Investment</option>
                  <option className="bg-[#0A0A0A]">Other</option>
                </select>
              </div>
              <div className="space-y-2 group">
                <label className="text-[10px] uppercase tracking-widest text-white/40 group-focus-within:text-[#C5A059] transition-colors">Message</label>
                <textarea 
                  required
                  suppressHydrationWarning
                  rows={4} 
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-transparent border-b border-white/10 py-2 focus:border-[#C5A059] outline-none transition-colors resize-none"
                ></textarea>
              </div>
              <button 
                type="submit"
                suppressHydrationWarning
                className="w-full py-5 bg-[#C5A059] text-black text-xs uppercase tracking-[0.3em] font-bold hover:bg-white transition-all duration-500 hover:shadow-[0_0_20px_rgba(197,160,89,0.3)]"
              >
                Send Inquiry
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
