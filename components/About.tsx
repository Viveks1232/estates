'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax effect for the image
      gsap.fromTo(imageRef.current,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            end: 'center center',
            scrub: 1,
          }
        }
      );

      // Staggered text reveal
      if (textRef.current) {
        const textElements = textRef.current.children;
        gsap.fromTo(textElements,
          { x: 50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: textRef.current,
              start: 'top 85%',
            }
          }
        );
      }

      // Badge pop-in
      gsap.fromTo(badgeRef.current,
        { scale: 0, rotation: -45, opacity: 0 },
        {
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'back.out(1.5)',
          scrollTrigger: {
            trigger: imageRef.current,
            start: 'center 80%',
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" className="py-24 px-6 bg-background overflow-hidden" ref={containerRef}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="relative">
          <div ref={imageRef} className="relative aspect-[4/5] w-full max-w-md mx-auto lg:mx-0">
            <Image
              src="https://picsum.photos/seed/luxury-interior/800/1000"
              alt="Luxury Interior"
              fill
              className="object-cover z-10"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -top-10 -left-10 w-full h-full border border-accent/30 -z-0 hidden md:block" />
            <div ref={badgeRef} className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent flex items-center justify-center z-20 hidden md:flex">
              <div className="text-center text-background">
                <span className="block text-4xl font-serif font-bold">15+</span>
                <span className="text-[10px] uppercase tracking-widest font-bold">Years of Excellence</span>
              </div>
            </div>
          </div>
        </div>

        <div ref={textRef}>
          <span className="text-accent text-xs uppercase tracking-[0.4em] mb-6 block">Our Legacy</span>
          <h2 className="text-4xl md:text-6xl font-serif leading-tight mb-8 text-foreground">
            Crafting the Future of <br />
            <span className="italic">Luxury</span> Real Estate
          </h2>
          <p className="text-muted-custom text-sm md:text-lg font-light leading-relaxed mb-8">
            At IVIGIL ESTATES, we believe that a home is more than just a place to live&mdash;it&rsquo;s a masterpiece of personal expression. 
            Founded on the principles of integrity, exclusivity, and unparalleled service, we have become the trusted partner for 
            discerning clients seeking the world&rsquo;s most extraordinary residences.
          </p>
          <div className="grid grid-cols-2 gap-8 mb-12">
            <div>
              <h4 className="text-accent font-serif text-xl mb-2">Exclusivity</h4>
              <p className="text-muted-custom text-xs leading-relaxed">Access to off-market listings and private collections.</p>
            </div>
            <div>
              <h4 className="text-accent font-serif text-xl mb-2">Expertise</h4>
              <p className="text-muted-custom text-xs leading-relaxed">Deep market insights and strategic investment advice.</p>
            </div>
          </div>
          <button 
            type="button"
            suppressHydrationWarning
            className="px-10 py-4 border border-accent text-accent text-xs uppercase tracking-[0.3em] hover:bg-accent hover:text-background transition-all duration-500"
          >
            Learn More About Us
          </button>
        </div>
      </div>
    </section>
  );
}
