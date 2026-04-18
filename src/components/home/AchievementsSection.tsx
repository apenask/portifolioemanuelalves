import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../../context/DataContext';
import { MapPin, Calendar, Medal, ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';

export default function AchievementsSection() {
  const { achievements } = useData();
  const visibleAchievements = achievements.filter(a => a.isVisible).sort((a, b) => a.displayOrder - b.displayOrder);
  
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: false,
    dragFree: true,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const getMedalColor = (medal: string) => {
    switch (medal) {
      case 'gold': return 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]';
      case 'silver': return 'text-gray-300 drop-shadow-[0_0_8px_rgba(209,213,219,0.5)]';
      case 'bronze': return 'text-amber-600 drop-shadow-[0_0_8px_rgba(217,119,6,0.5)]';
      default: return 'text-gray-500';
    }
  };

  if (visibleAchievements.length === 0) return null;

  return (
    <section id="conquistas" className="py-24 bg-dark-900 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-sm font-bold text-gold-500 tracking-widest uppercase mb-2">Glória</h2>
            <h3 className="text-4xl md:text-5xl font-display font-bold text-white">
              Principais <span className="text-gradient-gold">Conquistas</span>
            </h3>
          </div>
          
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
        </div>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {visibleAchievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_30%] min-w-0"
                >
                  <div className="glass-panel group overflow-hidden flex flex-col h-full rounded-lg border border-white/5 hover:border-gold-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
                    {achievement.imageUrl && (
                      <div className="h-56 overflow-hidden relative">
                        <img 
                          src={achievement.imageUrl} 
                          alt={achievement.title} 
                          className="w-full h-full object-cover transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent" />
                        {achievement.featured && (
                          <div className="absolute top-4 left-4 bg-gold-500 text-dark-900 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-[0_0_10px_rgba(212,175,55,0.5)]">
                            Destaque
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="p-6 flex-grow flex flex-col relative z-10 -mt-8">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-xl font-display font-bold text-white uppercase drop-shadow-md">{achievement.title}</h4>
                      </div>
                      
                      <div className="space-y-2 mb-4 text-sm text-gray-300 font-light">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gold-500" />
                          <span>{achievement.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gold-500" />
                          <span>{achievement.date}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 mb-4">
                        {achievement.category && (
                          <div className="flex items-center gap-2">
                            <Medal className={`w-4 h-4 ${getMedalColor(achievement.medal)}`} />
                            <span className="px-2 py-1 bg-white/5 border border-white/10 text-[10px] uppercase tracking-wider text-gray-300 rounded">
                              {achievement.category}
                            </span>
                          </div>
                        )}
                        {achievement.category2 && (
                          <div className="flex items-center gap-2">
                            <Medal className={`w-4 h-4 ${getMedalColor(achievement.medal2 || 'none')}`} />
                            <span className="px-2 py-1 bg-white/5 border border-white/10 text-[10px] uppercase tracking-wider text-gray-300 rounded">
                              {achievement.category2}
                            </span>
                          </div>
                        )}
                        {achievement.category3 && (
                          <div className="flex items-center gap-2">
                            <Medal className={`w-4 h-4 ${getMedalColor(achievement.medal3 || 'none')}`} />
                            <span className="px-2 py-1 bg-white/5 border border-white/10 text-[10px] uppercase tracking-wider text-gray-300 rounded">
                              {achievement.category3}
                            </span>
                          </div>
                        )}
                        {achievement.weight && (
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-white/5 border border-white/10 text-[10px] uppercase tracking-wider text-gray-300 rounded">
                              {achievement.weight}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="mt-auto pt-4 border-t border-white/10">
                        <p className="text-gold-500 font-bold uppercase tracking-wider text-sm mb-2">
                          {achievement.result}
                        </p>
                        {achievement.description && (
                          <p className="text-gray-400 text-sm font-light line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                            {achievement.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
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
