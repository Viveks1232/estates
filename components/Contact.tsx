'use client';

import { motion } from 'motion/react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="py-24 px-6 bg-[#0F0F0F]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <span className="text-[#C5A059] text-xs uppercase tracking-[0.4em] mb-6 block">Get In Touch</span>
            <h2 className="text-4xl md:text-6xl font-serif leading-tight mb-8">
              Begin Your <br />
              <span className="italic">Journey</span> With Us
            </h2>
            <p className="text-white/60 text-sm md:text-lg font-light leading-relaxed mb-12">
              Whether you are looking to acquire a new residence or sell a prestigious asset, 
              our team of experts is ready to provide the discreet and professional service you deserve.
            </p>

            <div className="space-y-8">
              <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#C5A059] transition-colors">
                  <Mail size={20} className="text-[#C5A059]" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Email Us</p>
                  <p className="text-lg font-serif">concierge@ivigilestates.com</p>
                </div>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#C5A059] transition-colors">
                  <Phone size={20} className="text-[#C5A059]" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Call Us</p>
                  <p className="text-lg font-serif">+1 (800) IVIGIL-01</p>
                </div>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#C5A059] transition-colors">
                  <MapPin size={20} className="text-[#C5A059]" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Visit Us</p>
                  <p className="text-lg font-serif">7th Avenue, Manhattan, NY</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="bg-[#0A0A0A] p-10 md:p-16 border border-white/5"
          >
            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/40">Full Name</label>
                  <input 
                    suppressHydrationWarning
                    type="text" 
                    className="w-full bg-transparent border-b border-white/10 py-2 focus:border-[#C5A059] outline-none transition-colors" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/40">Email Address</label>
                  <input 
                    suppressHydrationWarning
                    type="email" 
                    className="w-full bg-transparent border-b border-white/10 py-2 focus:border-[#C5A059] outline-none transition-colors" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40">Interest</label>
                <select 
                  suppressHydrationWarning
                  className="w-full bg-transparent border-b border-white/10 py-2 focus:border-[#C5A059] outline-none transition-colors appearance-none"
                >
                  <option className="bg-[#0A0A0A]">Acquisition</option>
                  <option className="bg-[#0A0A0A]">Sale</option>
                  <option className="bg-[#0A0A0A]">Investment</option>
                  <option className="bg-[#0A0A0A]">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40">Message</label>
                <textarea 
                  suppressHydrationWarning
                  rows={4} 
                  className="w-full bg-transparent border-b border-white/10 py-2 focus:border-[#C5A059] outline-none transition-colors resize-none"
                ></textarea>
              </div>
              <button 
                type="button"
                suppressHydrationWarning
                className="w-full py-5 bg-[#C5A059] text-black text-xs uppercase tracking-[0.3em] font-bold hover:bg-white transition-all duration-500"
              >
                Send Inquiry
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
