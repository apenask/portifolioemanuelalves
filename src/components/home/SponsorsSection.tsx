import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../../context/DataContext';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function SponsorsSection() {
  const { sponsors } = useData();
  const visibleSponsors = sponsors.filter(s => s.isVisible).sort((a, b) => a.displayOrder - b.displayOrder);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: true,
    dragFree: true,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (visibleSponsors.length === 0) return null;

  return (
    <section id="patrocinadores" className="py-24 bg-dark-900 relative border-y border-white/5 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-sm font-bold text-gold-500 tracking-widest uppercase mb-2">Apoio</h2>
            <h3 className="text-4xl md:text-5xl font-display font-bold text-white">
              Parceiros <span className="text-gradient-gold">Oficiais</span>
            </h3>
          </div>
          
          {visibleSponsors.length > 3 && (
            <div className="hidden md:flex gap-2">
              <button 
                onClick={scrollPrev}
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:border-gold-500 transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={scrollNext}
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:border-gold-500 transition-colors"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          )}
        </div>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {visibleSponsors.map((sponsor, index) => (
                <motion.div
                  key={sponsor.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex-[0_0_80%] sm:flex-[0_0_45%] md:flex-[0_0_30%] lg:flex-[0_0_25%] min-w-0"
                >
                  <a
                    href={sponsor.link || '#'}
                    target={sponsor.link ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className="glass-panel p-8 flex flex-col items-center text-center group hover:border-gold-500/50 transition-all duration-500 h-full rounded-lg hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(212,175,55,0.15)]"
                  >
                    <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-2 border-white/10 group-hover:border-gold-500 transition-colors bg-white/5 p-4 flex items-center justify-center">
                      {sponsor.logoUrl ? (
                        <img 
                          src={sponsor.logoUrl} 
                          alt={sponsor.name} 
                          className="max-w-full max-h-full object-contain transition-all duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"></div>
                      )}
                    </div>
                    <h4 className="text-xl font-display font-bold text-white uppercase mb-2">{sponsor.name}</h4>
                    {sponsor.description && (
                      <p className="text-sm text-gray-400 font-light line-clamp-3">{sponsor.description}</p>
                    )}
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Mobile fade edges */}
          <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-dark-900 to-transparent pointer-events-none md:hidden" />
          <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-dark-900 to-transparent pointer-events-none md:hidden" />
        </div>
      </div>
    </section>
  );
}
