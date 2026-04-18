import React from 'react';
import { motion } from 'framer-motion';
import { useData } from '../../context/DataContext';

export default function TrajectorySection() {
  const { timeline, profile } = useData();

  const visibleTimeline = timeline.filter(t => t.isVisible).sort((a, b) => a.displayOrder - b.displayOrder);

  if (visibleTimeline.length === 0 && !profile?.trajectoryText) return null;

  return (
    <section id="trajetoria" className="py-24 bg-dark-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-gold-500 tracking-widest uppercase mb-2">História</h2>
          <h3 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            A <span className="text-gradient-gold">Trajetória</span>
          </h3>
          {profile?.trajectoryText && (
            <p className="text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
              {profile.trajectoryText}
            </p>
          )}
        </div>

        {visibleTimeline.length > 0 && (
          <div className="relative max-w-4xl mx-auto">
            {/* Line */}
            <div className="absolute left-[15px] md:left-1/2 top-0 bottom-0 w-px bg-white/10 md:-translate-x-1/2" />

            {visibleTimeline.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Dot */}
                <div className="absolute left-0 md:left-1/2 w-8 h-8 bg-dark-900 border-2 border-gold-500 rounded-full md:-translate-x-1/2 flex items-center justify-center z-10 shadow-[0_0_10px_rgba(212,175,55,0.5)]">
                  <div className="w-2 h-2 bg-gold-500 rounded-full" />
                </div>

                {/* Content */}
                <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pl-12' : 'md:pr-12 md:text-right'}`}>
                  <div className="glass-panel p-6 hover:border-gold-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                    <span className="text-gold-500 font-display text-2xl font-bold">{item.yearLabel}</span>
                    <h4 className="text-xl font-bold text-white mt-1 mb-2">{item.title}</h4>
                    {item.description && (
                      <p className="text-gray-400 font-light text-sm">{item.description}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
