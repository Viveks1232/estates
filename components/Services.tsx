'use client';

import { motion } from 'motion/react';
import { Shield, TrendingUp, Key, Globe } from 'lucide-react';

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
  return (
    <section id="services" className="py-24 px-6 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-[#C5A059] text-xs uppercase tracking-[0.4em] mb-4 block">Our Expertise</span>
          <h2 className="text-4xl md:text-6xl font-serif">Bespoke Services</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
              className="p-10 border border-white/5 hover:border-[#C5A059]/30 transition-all duration-500 group bg-[#0F0F0F]"
            >
              <div className="text-[#C5A059] mb-8 group-hover:scale-110 transition-transform duration-500">
                {service.icon}
              </div>
              <h3 className="text-xl font-serif mb-4 group-hover:text-[#C5A059] transition-colors">{service.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed font-light">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
