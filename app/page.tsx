'use client';

import Splash from '@/components/Splash';
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
      <Splash />
      <Navbar />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
      >
        <Hero />
        <About />
        <Properties />
        <Services />
        <Contact />
        <Footer />
      </motion.div>
    </main>
  );
}
