'use client';

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Properties from '@/components/Properties';
import About from '@/components/About';
import Services from '@/components/Services';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { motion } from 'motion/react';

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      
      <div className="w-full">
        <Hero />
        <About />
        <Properties />
        <Services />
        <Contact />
        <Footer />
      </div>
    </main>
  );
}
