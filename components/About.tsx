'use client';

import { motion } from 'motion/react';
import Image from 'next/image';

export default function About() {
  return (
    <section id="about" className="py-24 px-6 bg-[#0F0F0F]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="relative aspect-[4/5] w-full max-w-md mx-auto lg:mx-0">
            <Image
              src="https://picsum.photos/seed/luxury-interior/800/1000"
              alt="Luxury Interior"
              fill
              className="object-cover z-10"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -top-10 -left-10 w-full h-full border border-[#C5A059]/30 -z-0 hidden md:block" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#C5A059] flex items-center justify-center z-20 hidden md:flex">
              <div className="text-center text-black">
                <span className="block text-4xl font-serif font-bold">15+</span>
                <span className="text-[10px] uppercase tracking-widest font-bold">Years of Excellence</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <span className="text-[#C5A059] text-xs uppercase tracking-[0.4em] mb-6 block">Our Legacy</span>
          <h2 className="text-4xl md:text-6xl font-serif leading-tight mb-8">
            Crafting the Future of <br />
            <span className="italic">Luxury</span> Real Estate
          </h2>
          <p className="text-white/60 text-sm md:text-lg font-light leading-relaxed mb-8">
            At IVIGIL ESTATES, we believe that a home is more than just a place to live&mdash;it&rsquo;s a masterpiece of personal expression. 
            Founded on the principles of integrity, exclusivity, and unparalleled service, we have become the trusted partner for 
            discerning clients seeking the world&rsquo;s most extraordinary residences.
          </p>
          <div className="grid grid-cols-2 gap-8 mb-12">
            <div>
              <h4 className="text-[#C5A059] font-serif text-xl mb-2">Exclusivity</h4>
              <p className="text-white/40 text-xs leading-relaxed">Access to off-market listings and private collections.</p>
            </div>
            <div>
              <h4 className="text-[#C5A059] font-serif text-xl mb-2">Expertise</h4>
              <p className="text-white/40 text-xs leading-relaxed">Deep market insights and strategic investment advice.</p>
            </div>
          </div>
          <button 
            type="button"
            suppressHydrationWarning
            className="px-10 py-4 border border-[#C5A059] text-[#C5A059] text-xs uppercase tracking-[0.3em] hover:bg-[#C5A059] hover:text-black transition-all duration-500"
          >
            Learn More About Us
          </button>
        </motion.div>
      </div>
    </section>
  );
}
