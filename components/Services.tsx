'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Shield, TrendingUp, Key, Globe } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const services = [
  {
    icon: <Shield size={32} />,
    title: 'Asset Protection',
    description: 'Strategic management to preserve and enhance your real estate wealth across generations.',
  },
  {
    icon: <TrendingUp size={32} />,
    title: 'Investment Advisory',
    description: 'Data-driven insights for high-yield property investments in global emerging markets.',
  },
  {
    icon: <Key size={32} />,
    title: 'Private Brokerage',
    description: 'Discreet and personalized representation for the acquisition and sale of elite properties.',
  },
  {
    icon: <Globe size={32} />,
    title: 'Global Relocation',
    description: 'Seamless transition services for international clients moving to the world&rsquo;s most desirable cities.',
  },
];

export default function Services() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(cardsRef.current,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="services" className="py-24 px-6 bg-background" ref={containerRef}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#C5A059]/10 blur-[50px] rounded-full pointer-events-none" />
          <span className="text-[#C5A059] text-xs uppercase tracking-[0.4em] mb-4 block relative z-10">Our Expertise</span>
          <h2 className="text-4xl md:text-6xl font-serif relative z-10">Bespoke Services</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {services.map((service, index) => (
            <div
              key={service.title}
              ref={(el) => { cardsRef.current[index] = el; }}
              className="p-10 border border-border-custom hover:border-accent/30 transition-all duration-500 group bg-card relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#C5A059]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="text-[#C5A059] mb-8 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(197,160,89,0.5)] transition-all duration-500">
                  {service.icon}
                </div>
                <h3 className="text-xl font-serif mb-4 group-hover:text-[#C5A059] transition-colors">{service.title}</h3>
                <p className="text-muted-custom text-sm leading-relaxed font-light">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
