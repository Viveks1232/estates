'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Properties from '@/components/Properties';
import { motion } from 'motion/react';

function PropertiesContent() {
  const searchParams = useSearchParams();
  const city = searchParams.get('city');

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <span className="text-[#C5A059] text-xs uppercase tracking-[0.4em] mb-4 block">Destination</span>
            <h1 className="text-5xl md:text-7xl font-serif leading-tight">
              Properties in <br />
              <span className="italic">{city || 'Multiple Cities'}</span>
            </h1>
          </motion.div>
        </div>
      </div>

      <Properties initialCity={city || 'All'} />
      <Footer />
    </main>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-foreground">Loading...</div>}>
      <PropertiesContent />
    </Suspense>
  );
}
