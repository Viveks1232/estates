'use client';

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
import Image from 'next/image';
import { Loader2, MapPin, Home, Maximize, Sofa, X, ChevronLeft, ChevronRight, ArrowRight, RefreshCw, Search, Camera } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

interface Property {
  id: number;
  title: string;
  location: string;
  price: string;
  images: string[];
  type: string;
  category: string;
  forType: string;
  area: string;
  furnishing: string;
  config: string;
  floor: string;
  description: string;
  ownerName: string;
  contact: string;
}

function handleImageError(e: React.SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget;
  img.style.display = 'none';
  const placeholder = img.parentElement?.querySelector('.image-placeholder') as HTMLElement | null;
  if (placeholder) placeholder.style.display = 'flex';
}

const ITEMS_PER_PAGE = 8;

export default function Properties() {
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filter, setFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const gridRef = useRef<HTMLDivElement>(null);

  const handleModalImageError = useCallback((src: string) => {
    setFailedImages((prev: Set<string>) => new Set(prev).add(src));
  }, [setFailedImages]);

  useEffect(() => {
    if (!selectedProperty) {
      setFailedImages(new Set());
    }
  }, [selectedProperty]);

  const fetchProperties = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setIsRefreshing(true);
      else setIsLoading(true);
      
      const response = await fetch('/api/properties', { cache: 'no-store' });
      const data = await response.json();
      
      if (data.properties) {
        setAllProperties(data.properties);
        if (data.lastUpdated) {
          setLastUpdated(new Date(data.lastUpdated).toLocaleTimeString());
        }
      }
    } catch (error) {
      console.error('Failed to fetch properties:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
    
    const interval = setInterval(() => {
      fetchProperties(true);
    }, 30000);
    
    return () => clearInterval(interval);
  }, [fetchProperties]);

  useEffect(() => {
    if (selectedProperty) {
      document.body.style.overflow = 'hidden';
      setCurrentImageIndex(0);
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedProperty]);

  const nextImage = useCallback(() => {
    if (!selectedProperty) return;
    setCurrentImageIndex(prev => 
      prev === selectedProperty.images.length - 1 ? 0 : prev + 1
    );
  }, [selectedProperty]);

  const prevImage = useCallback(() => {
    if (!selectedProperty) return;
    setCurrentImageIndex(prev => 
      prev === 0 ? selectedProperty.images.length - 1 : prev - 1
    );
  }, [selectedProperty]);

  const cities = useMemo(() => {
    const citySet = new Set<string>();
    allProperties.forEach(p => {
      const parts = p.location.split(',');
      parts.forEach(part => {
        const city = part.trim();
        if (city && city.length > 2) {
          citySet.add(city);
        }
      });
    });
    return Array.from(citySet).sort();
  }, [allProperties]);

  const sortedProperties = useMemo(() => {
    let filtered = filter === 'All'
      ? [...allProperties]
      : allProperties.filter(p => p.forType === filter || p.category === filter);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.location.toLowerCase().includes(query) ||
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }

    return filtered.sort((a, b) => {
      const aHasImages = a.images.length > 0;
      const bHasImages = b.images.length > 0;
      if (aHasImages && !bHasImages) return -1;
      if (!aHasImages && bHasImages) return 1;
      return 0;
    });
  }, [allProperties, filter, searchQuery]);

  const displayProperties = sortedProperties.slice(0, visibleCount);
  const hasMore = visibleCount < sortedProperties.length;



  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setVisibleCount(prev => prev + ITEMS_PER_PAGE);
    setIsLoading(false);
  }, [isLoading, hasMore]);

  const { ref } = useInView({
    threshold: 0.1,
    triggerOnce: false,
    onChange: (inView) => {
      if (inView && hasMore && !isLoading) {
        loadMore();
      }
    },
  });

  const filters = ['All', 'Rent', 'Sale', 'Residential', 'Commercial'];



  return (
    <section id="properties" className="py-24 px-6 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <div className="max-w-2xl">
            <span className="text-[#C5A059] text-xs uppercase tracking-[0.4em] mb-4 block">Our Properties</span>
            <h2 className="text-4xl md:text-6xl font-serif leading-tight">
              Exclusive Property <br />
              <span className="italic">Listings</span>
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => fetchProperties(true)}
              disabled={isRefreshing}
              className="flex items-center gap-2 text-[#C5A059] hover:text-white transition-colors text-[10px] uppercase tracking-widest"
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
              {isRefreshing ? 'Syncing...' : 'New Property'}
            </button>
            {lastUpdated && (
              <span className="text-white/20 text-[9px] hidden md:block">
                Updated: {lastUpdated}
              </span>
            )}
            <p className="text-white/30 text-[10px] uppercase tracking-widest hidden md:block">
              Showing {displayProperties.length} of {sortedProperties.length} listings
            </p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="Search by city, location, or property name..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(ITEMS_PER_PAGE); }}
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 text-white placeholder-white/30 text-[11px] uppercase tracking-wider focus:border-[#C5A059] focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(''); setVisibleCount(ITEMS_PER_PAGE); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {cities.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-white/30 text-[10px] uppercase tracking-wider mr-2 py-2">Popular Cities:</span>
              {cities.slice(0, 12).map(city => (
                <button
                  key={city}
                  onClick={() => { setSearchQuery(city); setVisibleCount(ITEMS_PER_PAGE); }}
                  className={`px-3 py-1.5 text-[9px] uppercase tracking-wider border transition-all duration-300 ${
                    searchQuery.toLowerCase() === city.toLowerCase()
                      ? 'bg-[#C5A059] border-[#C5A059] text-black'
                      : 'border-white/10 text-white/40 hover:border-[#C5A059]/50 hover:text-white'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3 mb-12">
          {filters.map(f => (
            <button
              key={f}
              type="button"
              onClick={() => { setFilter(f); setVisibleCount(ITEMS_PER_PAGE); }}
              className={`px-5 py-2.5 text-[10px] uppercase tracking-[0.25em] font-semibold border transition-all duration-300 ${
                filter === f
                  ? 'bg-[#C5A059] border-[#C5A059] text-black'
                  : 'border-white/10 text-white/50 hover:border-[#C5A059]/50 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayProperties.map((property) => (
              <div
                key={property.id}
                className="property-card group cursor-pointer hover:-translate-y-2 transition-all duration-300 ease-out"
              >
                <div 
                  className="relative aspect-[3/4] overflow-hidden mb-5 border border-white/5 transition-colors duration-500 group-hover:border-[#C5A059]/30"
                  onClick={() => {
                    setSelectedProperty(property);
                    setCurrentImageIndex(0);
                  }}
                >
                  {property.images.length > 1 && (
                    <div className="absolute top-4 right-4 z-10 px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 text-[9px] text-white/90 uppercase tracking-[0.1em] pointer-events-none font-medium flex items-center gap-1.5">
                      <Camera size={10} />
                      {property.images.length} Photos
                    </div>
                  )}

                  {property.images.length > 0 ? (
                    <>
                      <Image
                        src={property.images[0]}
                        alt={property.title}
                        fill
                        className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        unoptimized
                        onError={handleImageError}
                      />
                      <div className="image-placeholder absolute inset-0 bg-[#1a1a1a] flex-col items-center justify-center hidden">
                        <Maximize size={32} className="text-white/30 mb-2" />
                        <p className="text-[10px] text-white/30 uppercase tracking-wider">Image unavailable</p>
                      </div>
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-[#C5A059]/10 transition-colors duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-[#1a1a1a] flex items-center justify-center border border-white/5 group-hover:border-[#C5A059]/20 transition-colors">
                      <div className="text-center text-white/30">
                        <Maximize size={48} className="mx-auto mb-2 opacity-50 text-[#C5A059]" />
                        <p className="text-xs uppercase tracking-widest text-[#C5A059]">No Image Available</p>
                      </div>
                    </div>
                  )}

                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-[#C5A059] text-black text-[9px] uppercase tracking-wider font-bold">
                      {property.forType}
                    </span>
                    <span className="px-3 py-1 bg-black/60 backdrop-blur-sm text-white/90 text-[9px] uppercase tracking-wider font-medium border border-white/10">
                      {property.type}
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-out">
                    <div className="space-y-2 mb-4">
                      {property.area && (
                        <div className="flex items-center gap-2 text-white/80 text-[10px]">
                          <Maximize size={12} className="text-[#C5A059]" />
                          <span>{property.area}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-white/80 text-[10px]">
                        <Sofa size={12} className="text-[#C5A059]" />
                        <span>{property.furnishing}</span>
                      </div>
                      {property.floor && (
                        <div className="flex items-center gap-2 text-white/80 text-[10px]">
                          <Home size={12} className="text-[#C5A059]" />
                          <span>{property.floor}</span>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      suppressHydrationWarning
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProperty(property);
                        setCurrentImageIndex(0);
                      }}
                      className="w-full py-3.5 bg-white text-black text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-[#C5A059] hover:text-white transition-colors duration-300"
                    >
                      View All {property.images.length} Photos
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-base font-serif leading-snug group-hover:text-[#C5A059] transition-colors line-clamp-2">
                      {property.title}
                    </h3>
                    <div className="flex flex-col items-end">
                      <span className="text-[#C5A059] text-base font-bold tracking-tight bg-[#C5A059]/10 px-3 py-1 border border-[#C5A059]/30 font-serif whitespace-nowrap shadow-[0_0_15px_rgba(197,160,89,0.1)]">
                        {property.price}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={11} className="text-white/30 shrink-0" />
                    <p className="text-white/40 text-[10px] uppercase tracking-widest truncate">{property.location}</p>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-white/50 text-[9px] uppercase tracking-wider">
                      {property.config}
                    </span>
                    <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-white/50 text-[9px] uppercase tracking-wider">
                      {property.category}
                    </span>
                    {property.images.length > 1 && (
                      <span className="px-2 py-0.5 bg-[#C5A059]/10 border border-[#C5A059]/20 text-[#C5A059] text-[9px] uppercase tracking-wider flex items-center gap-1">
                        <Camera size={8} />
                        {property.images.length}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div ref={ref} className="mt-20 flex flex-col items-center justify-center gap-4">

          {!hasMore && sortedProperties.length > 0 && (
            <p className="text-[10px] uppercase tracking-[0.4em] text-white/20 border-t border-white/5 pt-8 w-full text-center">
              You have viewed all {sortedProperties.length} properties
            </p>
          )}
          {sortedProperties.length === 0 && (
            <p className="text-[10px] uppercase tracking-[0.4em] text-white/20 pt-8 w-full text-center">
              No properties found for this search
            </p>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedProperty && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 md:px-10 py-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProperty(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl"
            />

            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-6xl max-h-[90vh] bg-[#0F0F0F] border border-white/5 overflow-hidden flex flex-col md:flex-row shadow-2xl"
            >
              <button
                onClick={() => setSelectedProperty(null)}
                className="absolute top-6 right-6 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-[#C5A059] hover:text-black transition-all duration-300 backdrop-blur-md border border-white/10"
              >
                <X size={20} />
              </button>

              <div className="relative w-full md:w-[55%] h-[40vh] md:h-auto overflow-hidden bg-black flex-shrink-0 group">
                {selectedProperty.images.length > 0 && !failedImages.has(selectedProperty.images[currentImageIndex]) ? (
                  <>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentImageIndex}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="relative w-full h-full"
                      >
                        <Image
                          src={selectedProperty.images[currentImageIndex]}
                          alt={`${selectedProperty.title} - ${currentImageIndex + 1}`}
                          fill
                          className="object-cover"
                          unoptimized
                          onError={() => handleModalImageError(selectedProperty.images[currentImageIndex])}
                        />
                      </motion.div>
                    </AnimatePresence>

                    {selectedProperty.images.length > 1 && (
                      <>
                        <div className="absolute inset-0 flex items-center justify-between px-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button
                            onClick={prevImage}
                            className="w-12 h-12 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-[#C5A059] hover:text-black transition-all border border-white/10 backdrop-blur-sm"
                          >
                            <ChevronLeft size={24} />
                          </button>
                          <button
                            onClick={nextImage}
                            className="w-12 h-12 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-[#C5A059] hover:text-black transition-all border border-white/10 backdrop-blur-sm"
                          >
                            <ChevronRight size={24} />
                          </button>
                        </div>

                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-2 bg-black/30 backdrop-blur-md rounded-full border border-white/10">
                          {selectedProperty.images.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentImageIndex(idx)}
                              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                idx === currentImageIndex
                                  ? "w-6 bg-[#C5A059]" 
                                  : "bg-white/30 hover:bg-white/60"
                              }`}
                            />
                          ))}
                        </div>

                        <div className="absolute bottom-6 right-6 px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 text-[10px] text-white/90 uppercase tracking-wider flex items-center gap-1.5">
                          <Camera size={12} />
                          {currentImageIndex + 1} / {selectedProperty.images.length}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 bg-[#1a1a1a] flex items-center justify-center">
                    <div className="text-center text-white/30">
                      <Maximize size={64} className="mx-auto mb-3 opacity-50" />
                      <p className="text-xs uppercase tracking-widest">No Images Available</p>
                    </div>
                  </div>
                )}

                <div className="absolute top-6 left-6 flex gap-3 pointer-events-none">
                  <span className="px-4 py-1.5 bg-[#C5A059] text-black text-[10px] uppercase tracking-[0.2em] font-bold shadow-lg">
                    {selectedProperty.forType}
                  </span>
                  <span className="px-4 py-1.5 bg-black/40 backdrop-blur-md text-white/90 text-[10px] uppercase tracking-[0.2em] font-medium border border-white/10 shadow-lg">
                    {selectedProperty.type}
                  </span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 md:p-12 scrollbar-thin scrollbar-thumb-white/10">
                <div className="max-w-xl">
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin size={14} className="text-[#C5A059]" />
                      <span className="text-white/40 text-[10px] uppercase tracking-[0.3em]">{selectedProperty.location}</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-serif mb-6 leading-tight">
                      {selectedProperty.title}
                    </h2>
                    <div className="inline-block px-6 py-3 bg-[#C5A059]/10 border border-[#C5A059]/30 shadow-[0_0_30px_rgba(197,160,89,0.15)]">
                      <span className="text-3xl md:text-4xl text-[#C5A059] font-serif font-bold tracking-tight">
                        {selectedProperty.price}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-y-8 gap-x-12 mb-10 border-y border-white/5 py-10">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 text-white/30 mb-1">
                        <Maximize size={16} />
                        <span className="text-[10px] uppercase tracking-widest font-bold">Total Area</span>
                      </div>
                      <p className="text-lg font-serif">{selectedProperty.area || "N/A"}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 text-white/30 mb-1">
                        <Sofa size={16} />
                        <span className="text-[10px] uppercase tracking-widest font-bold">Furnishing</span>
                      </div>
                      <p className="text-lg font-serif">{selectedProperty.furnishing}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 text-white/30 mb-1">
                        <Home size={16} />
                        <span className="text-[10px] uppercase tracking-widest font-bold">Configuration</span>
                      </div>
                      <p className="text-lg font-serif">{selectedProperty.config}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 text-white/30 mb-1">
                        <Loader2 size={16} />
                        <span className="text-[10px] uppercase tracking-widest font-bold">Floor Level</span>
                      </div>
                      <p className="text-lg font-serif">{selectedProperty.floor || "Ground"}</p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold mb-6">Property Overview</h4>
                    <p className="text-white/60 leading-relaxed font-light text-lg">
                      {selectedProperty.description}
                    </p>
                  </div>

                  {selectedProperty.contact && (
                    <div className="mb-8 p-4 bg-white/5 border border-white/10">
                      <p className="text-white/40 text-[10px] uppercase tracking-widest mb-2">Contact Owner</p>
                      <p className="text-white text-lg font-serif">{selectedProperty.ownerName}</p>
                      <p className="text-[#C5A059] text-sm">{selectedProperty.contact}</p>
                    </div>
                  )}

                  <button className="w-full flex items-center justify-between px-8 py-6 bg-white text-black hover:bg-[#C5A059] hover:text-white transition-all duration-500 group/btn">
                    <span className="text-xs uppercase tracking-[0.4em] font-bold">Schedule A Viewing</span>
                    <ArrowRight size={20} className="group-hover/btn:translate-x-2 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
