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

export default function Properties({ initialCity = 'All' }: { initialCity?: string }) {
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
  const [selectedCity, setSelectedCity] = useState<string>(initialCity);
  const [selectedBudget, setSelectedBudget] = useState<string>('');
  const [selectedPropType, setSelectedPropType] = useState<string>('');
  const [selectedPurpose, setSelectedPurpose] = useState<string>('');
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
    let filtered = [...allProperties];

    // Filter by Tab (Category)
    if (filter !== 'All') {
      filtered = filtered.filter(p => p.forType === filter || p.category === filter);
    }

    // Filter by City (New Location Section)
    if (selectedCity !== 'All') {
      filtered = filtered.filter(p => {
        const loc = p.location.toLowerCase();
        const city = selectedCity.toLowerCase();
        // "Delhi NCR" should match Delhi, New Delhi, NCR, and surrounding areas
        if (city === 'delhi ncr') {
          return loc.includes('delhi') || loc.includes('ncr') || loc.includes('new delhi');
        }
        return loc.includes(city);
      });
    }

    // Filter by Purpose
    if (selectedPurpose) {
      filtered = filtered.filter(p => p.forType.toLowerCase() === selectedPurpose.toLowerCase());
    }

    // Filter by Property Type
    if (selectedPropType) {
      filtered = filtered.filter(p => p.type.toLowerCase() === selectedPropType.toLowerCase());
    }

    // Filter by Budget
    if (selectedBudget) {
      filtered = filtered.filter(p => {
        const priceStr = p.price.replace(/[₹,]/g, '');
        let priceValue = parseFloat(priceStr);
        
        // Handle "Cr" unit
        if (p.price.includes('Cr')) {
          priceValue = priceValue * 10000000;
        } else if (p.price.toLowerCase().includes('l')) {
           // Handle "L" unit if any
           priceValue = priceValue * 100000;
        }

        switch (selectedBudget) {
          case 'below-50l': return priceValue < 5000000;
          case '50l-1cr': return priceValue >= 5000000 && priceValue <= 10000000;
          case '1cr-2cr': return priceValue > 10000000 && priceValue <= 20000000;
          case '2cr-5cr': return priceValue > 20000000 && priceValue <= 50000000;
          case '5cr-10cr': return priceValue > 50000000 && priceValue <= 100000000;
          case 'above-10cr': return priceValue > 100000000;
          default: return true;
        }
      });
    }

    // Filter by search query
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
  }, [allProperties, filter, searchQuery, selectedCity, selectedPurpose, selectedPropType, selectedBudget]);

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
    <section id="properties" className="py-24 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <div className="max-w-2xl">
            <span className="text-accent text-xs uppercase tracking-[0.4em] mb-4 block">Our Properties</span>
            <h2 className="text-4xl md:text-6xl font-serif leading-tight text-foreground">
              Exclusive Property <br />
              <span className="italic">Listings</span>
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => fetchProperties(true)}
              disabled={isRefreshing}
              className="flex items-center gap-2 text-accent hover:text-foreground transition-colors text-[10px] uppercase tracking-widest"
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
              {isRefreshing ? 'Syncing...' : 'New Property'}
            </button>
            {lastUpdated && (
              <span className="text-muted-custom/40 text-[9px] hidden md:block">
                Updated: {lastUpdated}
              </span>
            )}
            <p className="text-muted-custom/40 text-[10px] uppercase tracking-widest hidden md:block">
              Showing {displayProperties.length} of {sortedProperties.length} listings
            </p>
          </div>
        </div>

        <div className="w-full mb-16">
          <div className="bg-card border border-border-custom rounded-xl overflow-hidden shadow-2xl">
            {/* Tabs */}
            <div className="flex border-b border-border-custom">
              <button className="flex-1 py-4 text-center font-bold text-[10px] uppercase tracking-widest bg-accent text-background">
                Residential
              </button>
              <button className="flex-1 py-4 text-center font-bold text-[10px] uppercase tracking-widest bg-transparent text-foreground/50 hover:text-foreground transition-colors">
                Commercial
              </button>
            </div>
            
            <div className="p-6 md:p-10">
              <h3 className="text-foreground text-xl md:text-2xl font-serif mb-8 text-center">Search Residential property in India</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {/* Row 1 */}
                <select 
                  value={selectedPurpose}
                  onChange={(e) => setSelectedPurpose(e.target.value)}
                  className="w-full p-4 bg-foreground/5 border border-border-custom rounded text-foreground text-xs uppercase tracking-wider focus:outline-none focus:border-accent appearance-none cursor-pointer"
                >
                  <option value="" className="bg-card">Purpose</option>
                  <option value="buy" className="bg-card">Buy</option>
                  <option value="rent" className="bg-card">Rent</option>
                </select>
                <select 
                  value={selectedPropType}
                  onChange={(e) => setSelectedPropType(e.target.value)}
                  className="w-full p-4 bg-foreground/5 border border-border-custom rounded text-foreground text-xs uppercase tracking-wider focus:outline-none focus:border-accent appearance-none cursor-pointer"
                >
                  <option value="" className="bg-card">Property Type</option>
                  <option value="Flat / Apartment" className="bg-card">Flat / Apartment</option>
                  <option value="Villa" className="bg-card">Villa</option>
                  <option value="Independent House" className="bg-card">Independent House</option>
                  <option value="Plot / Land" className="bg-card">Plot / Land</option>
                  <option value="Commercial" className="bg-card">Commercial</option>
                </select>
                <select 
                  value={selectedBudget}
                  onChange={(e) => setSelectedBudget(e.target.value)}
                  className="w-full p-4 bg-foreground/5 border border-border-custom rounded text-foreground text-xs uppercase tracking-wider focus:outline-none focus:border-accent appearance-none cursor-pointer"
                >
                  <option value="" className="bg-card">Select Budget</option>
                  <option value="below-50l" className="bg-card">Below 50L</option>
                  <option value="50l-1cr" className="bg-card">50L - 1Cr</option>
                  <option value="1cr-2cr" className="bg-card">1Cr - 2Cr</option>
                  <option value="2cr-5cr" className="bg-card">2Cr - 5Cr</option>
                  <option value="5cr-10cr" className="bg-card">5Cr - 10Cr</option>
                  <option value="above-10cr" className="bg-card">Above 10Cr</option>
                </select>
                <select 
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full p-4 bg-foreground/5 border border-border-custom rounded text-foreground text-xs uppercase tracking-wider focus:outline-none focus:border-accent appearance-none cursor-pointer"
                >
                  <option value="All" className="bg-card">All State / Cities</option>
                  <option value="Gurgaon" className="bg-card">Gurgaon</option>
                  <option value="Noida" className="bg-card">Noida</option>
                  <option value="Delhi NCR" className="bg-card">Delhi NCR</option>
                </select>
                
                {/* Row 2 */}
                <select className="w-full p-4 bg-foreground/5 border border-border-custom rounded text-foreground text-xs uppercase tracking-wider focus:outline-none focus:border-accent appearance-none cursor-pointer">
                  <option value="" className="bg-card">Select Facing</option>
                  <option value="east" className="bg-card">East</option>
                  <option value="north" className="bg-card">North</option>
                </select>
                <select className="w-full p-4 bg-foreground/5 border border-border-custom rounded text-foreground text-xs uppercase tracking-wider focus:outline-none focus:border-accent appearance-none cursor-pointer">
                  <option value="" className="bg-card">Bedrooms</option>
                  <option value="1" className="bg-card">1 BHK</option>
                  <option value="2" className="bg-card">2 BHK</option>
                  <option value="3" className="bg-card">3+ BHK</option>
                </select>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Locations"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-4 bg-foreground/5 border border-border-custom rounded text-foreground text-xs placeholder:text-foreground/40 uppercase tracking-wider focus:outline-none focus:border-accent"
                  />
                  <Search size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40" />
                </div>
                <select className="w-full p-4 bg-foreground/5 border border-border-custom rounded text-foreground text-xs uppercase tracking-wider focus:outline-none focus:border-accent appearance-none cursor-pointer">
                  <option value="" className="bg-card">Posted By</option>
                  <option value="owner" className="bg-card">Owner</option>
                  <option value="builder" className="bg-card">Builder</option>
                  <option value="agent" className="bg-card">Agent</option>
                </select>
              </div>

              <div className="mt-8 flex justify-center">
                <button 
                  className="bg-accent text-background px-12 py-4 uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-foreground hover:text-background transition-colors duration-300"
                  onClick={() => setVisibleCount(ITEMS_PER_PAGE)}
                >
                  Find Property
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col mb-24">
          <div className="max-w-2xl mb-12">
            <span className="text-accent text-xs uppercase tracking-[0.4em] mb-4 block">Destination</span>
            <h2 className="text-4xl md:text-6xl font-serif leading-tight text-foreground">
              Explore Top <br />
              <span className="italic">Localities</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Gurgaon', image: '/city-gurgaon.png', count: '150+' },
              { name: 'Noida', image: '/city-noida.png', count: '120+' },
              { name: 'Delhi NCR', image: '/city-delhi.png', count: '200+' },
            ].map((city) => (
              <div 
                key={city.name}
                onClick={() => {
                  window.location.href = `/properties?city=${city.name}`;
                }}
                className="group relative h-[400px] overflow-hidden cursor-pointer rounded-2xl border border-border-custom"
              >
                <Image
                  src={city.image}
                  alt={city.name}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <span className="text-accent text-[10px] uppercase tracking-[0.3em] font-bold mb-2 block">Premium Properties</span>
                  <h3 className="text-3xl font-serif text-foreground mb-2">{city.name}</h3>
                  <div className="flex items-center gap-2 text-muted-custom text-xs tracking-widest uppercase">
                    <span>{city.count} Listings</span>
                    <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-serif mb-6 leading-tight text-foreground">
              Exclusive <span className="text-accent italic">Property</span> Listings
            </h2>
            <p className="text-muted-custom font-light leading-relaxed">
              Discover unparalleled luxury across India's most prestigious locations.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-12">
          {filters.map(f => (
            <button
              key={f}
              type="button"
              onClick={() => { setFilter(f); setVisibleCount(ITEMS_PER_PAGE); }}
              className={`px-5 py-2.5 text-[10px] uppercase tracking-[0.25em] font-semibold border transition-all duration-300 ${
                filter === f
                  ? 'bg-accent border-accent text-background'
                  : 'border-border-custom text-foreground/50 hover:border-accent/50 hover:text-foreground'
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
                  className="relative aspect-[3/4] overflow-hidden mb-5 border border-border-custom transition-colors duration-500 group-hover:border-accent/30"
                  onClick={() => {
                    setSelectedProperty(property);
                    setCurrentImageIndex(0);
                  }}
                >
                  {property.images.length > 1 && (
                    <div className="absolute top-4 right-4 z-10 px-3 py-1.5 bg-background/60 backdrop-blur-md border border-border-custom text-[9px] text-foreground uppercase tracking-[0.1em] pointer-events-none font-medium flex items-center gap-1.5">
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
                      <div className="image-placeholder absolute inset-0 bg-background/20 flex-col items-center justify-center hidden">
                        <Maximize size={32} className="text-foreground/30 mb-2" />
                        <p className="text-[10px] text-foreground/30 uppercase tracking-wider">Image unavailable</p>
                      </div>
                      <div className="absolute inset-0 bg-background/20 group-hover:bg-accent/10 transition-colors duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-background/20 flex items-center justify-center border border-border-custom group-hover:border-accent/20 transition-colors">
                      <div className="text-center text-muted-custom">
                        <Maximize size={48} className="mx-auto mb-2 opacity-50 text-accent" />
                        <p className="text-xs uppercase tracking-widest text-accent">No Image Available</p>
                      </div>
                    </div>
                  )}

                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-accent text-background text-[9px] uppercase tracking-wider font-bold">
                      {property.forType}
                    </span>
                    <span className="px-3 py-1 bg-background/60 backdrop-blur-sm text-foreground text-[9px] uppercase tracking-wider font-medium border border-border-custom">
                      {property.type}
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-out">
                    <div className="space-y-2 mb-4">
                      {property.area && (
                        <div className="flex items-center gap-2 text-foreground/80 text-[10px]">
                          <Maximize size={12} className="text-accent" />
                          <span>{property.area}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-foreground/80 text-[10px]">
                        <Sofa size={12} className="text-accent" />
                        <span>{property.furnishing}</span>
                      </div>
                      {property.floor && (
                        <div className="flex items-center gap-2 text-foreground/80 text-[10px]">
                          <Home size={12} className="text-accent" />
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
                      className="w-full py-3.5 bg-foreground text-background text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-accent hover:text-background transition-colors duration-300"
                    >
                      View All {property.images.length} Photos
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-base font-serif leading-snug group-hover:text-accent transition-colors line-clamp-1 text-foreground">
                      {property.title}
                    </h3>
                    <div className="flex flex-col items-end">
                      <span className="text-accent text-base font-bold tracking-tight bg-accent/10 px-3 py-1 border border-accent/30 font-serif whitespace-nowrap shadow-[0_0_15px_rgba(197,160,89,0.1)]">
                        {property.price}
                      </span>
                    </div>
                  </div>
                  {property.location && (() => {
                    const parts = property.location.split(',');
                    const city = parts[parts.length - 1].trim();
                    return (
                      <div className="flex items-start gap-1.5 text-muted-custom text-[10px] items-center">
                        <MapPin size={10} className="text-accent mt-0.5 shrink-0" />
                        <span>{city}</span>
                      </div>
                    );
                  })()}
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <span className="px-2 py-0.5 bg-foreground/5 border border-border-custom text-muted-custom text-[9px] uppercase tracking-wider">
                    {property.config}
                  </span>
                  <span className="px-2 py-0.5 bg-foreground/5 border border-border-custom text-muted-custom text-[9px] uppercase tracking-wider">
                    {property.category}
                  </span>
                  {property.images.length > 1 && (
                    <span className="px-2 py-0.5 bg-accent/10 border border-accent/20 text-accent text-[9px] uppercase tracking-wider flex items-center gap-1">
                      <Camera size={8} />
                      {property.images.length}
                    </span>
                  )}
                </div>
              </div>
            ))}
        </div>

        <div ref={ref} className="mt-20 flex flex-col items-center justify-center gap-4">

          {!hasMore && sortedProperties.length > 0 && (
            <p className="text-[10px] uppercase tracking-[0.4em] text-muted-custom/40 border-t border-border-custom pt-8 w-full text-center">
              You have viewed all {sortedProperties.length} properties
            </p>
          )}
          {sortedProperties.length === 0 && (
            <p className="text-[10px] uppercase tracking-[0.4em] text-muted-custom/40 pt-8 w-full text-center">
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
              className="absolute inset-0 bg-background/95 backdrop-blur-xl"
            />

            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-6xl max-h-[90vh] bg-card border border-border-custom overflow-hidden flex flex-col md:flex-row shadow-2xl"
            >
              <button
                onClick={() => setSelectedProperty(null)}
                className="absolute top-6 right-6 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-background/50 text-foreground hover:bg-accent hover:text-background transition-all duration-300 backdrop-blur-md border border-border-custom"
              >
                <X size={20} />
              </button>

              <div className="relative w-full md:w-[55%] h-[40vh] md:h-auto overflow-hidden bg-background flex-shrink-0 group">
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
                            className="w-12 h-12 flex items-center justify-center rounded-full bg-background/40 text-foreground hover:bg-accent hover:text-background transition-all border border-border-custom backdrop-blur-sm"
                          >
                            <ChevronLeft size={24} />
                          </button>
                          <button
                            onClick={nextImage}
                            className="w-12 h-12 flex items-center justify-center rounded-full bg-background/40 text-foreground hover:bg-accent hover:text-background transition-all border border-border-custom backdrop-blur-sm"
                          >
                            <ChevronRight size={24} />
                          </button>
                        </div>

                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-2 bg-background/30 backdrop-blur-md rounded-full border border-border-custom">
                          {selectedProperty.images.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentImageIndex(idx)}
                              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                idx === currentImageIndex
                                  ? "w-6 bg-accent" 
                                  : "bg-foreground/30 hover:bg-foreground/60"
                              }`}
                            />
                          ))}
                        </div>

                        <div className="absolute bottom-6 right-6 px-3 py-1.5 bg-background/60 backdrop-blur-md border border-border-custom text-[10px] text-foreground/90 uppercase tracking-wider flex items-center gap-1.5">
                          <Camera size={12} />
                          {currentImageIndex + 1} / {selectedProperty.images.length}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 bg-background/20 flex items-center justify-center">
                    <div className="text-center text-muted-custom">
                      <Maximize size={64} className="mx-auto mb-3 opacity-50" />
                      <p className="text-xs uppercase tracking-widest">No Images Available</p>
                    </div>
                  </div>
                )}

                <div className="absolute top-6 left-6 flex gap-3 pointer-events-none">
                  <span className="px-4 py-1.5 bg-accent text-background text-[10px] uppercase tracking-[0.2em] font-bold shadow-lg">
                    {selectedProperty.forType}
                  </span>
                  <span className="px-4 py-1.5 bg-background/40 backdrop-blur-md text-foreground/90 text-[10px] uppercase tracking-[0.2em] font-medium border border-border-custom shadow-lg">
                    {selectedProperty.type}
                  </span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 md:p-12 scrollbar-thin scrollbar-thumb-foreground/10">
                <div className="max-w-xl">
                  <div className="mb-8">
                    <h2 className="text-3xl md:text-5xl font-serif mb-6 leading-tight text-foreground">
                      {selectedProperty.title}
                    </h2>
                    <div className="inline-block px-6 py-3 bg-accent/10 border border-accent/30 shadow-[0_0_30px_rgba(197,160,89,0.15)]">
                      <span className="text-3xl md:text-4xl text-accent font-serif font-bold tracking-tight">
                        {selectedProperty.price}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-y-8 gap-x-12 mb-10 border-y border-border-custom py-10">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 text-muted-custom/60 mb-1">
                        <Maximize size={16} />
                        <span className="text-[10px] uppercase tracking-widest font-bold">Total Area</span>
                      </div>
                      <p className="text-lg font-serif text-foreground">{selectedProperty.area || "N/A"}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 text-muted-custom/60 mb-1">
                        <Sofa size={16} />
                        <span className="text-[10px] uppercase tracking-widest font-bold">Furnishing</span>
                      </div>
                      <p className="text-lg font-serif text-foreground">{selectedProperty.furnishing}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 text-muted-custom/60 mb-1">
                        <Home size={16} />
                        <span className="text-[10px] uppercase tracking-widest font-bold">Configuration</span>
                      </div>
                      <p className="text-lg font-serif text-foreground">{selectedProperty.config}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 text-muted-custom/60 mb-1">
                        <Loader2 size={16} />
                        <span className="text-[10px] uppercase tracking-widest font-bold">Floor Level</span>
                      </div>
                      <p className="text-lg font-serif text-foreground">{selectedProperty.floor || "Ground"}</p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-muted-custom/60 text-[10px] uppercase tracking-[0.3em] font-bold mb-6">Property Overview</h4>
                    <p className="text-foreground/80 leading-relaxed font-light text-lg">
                      {selectedProperty.description}
                    </p>
                  </div>


                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      const msg = encodeURIComponent(`Hi, I am interested in viewing the property: ${selectedProperty.title} in ${selectedProperty.location}. Please provide more details.`);
                      window.open(`https://wa.me/919799160909?text=${msg}`, '_blank');
                    }}
                    className="w-full flex items-center justify-between px-8 py-6 bg-foreground text-background hover:bg-accent hover:text-background transition-all duration-500 group/btn"
                  >
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
