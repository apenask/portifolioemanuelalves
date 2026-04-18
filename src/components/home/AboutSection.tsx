import React from 'react';
import { motion } from 'framer-motion';
import { useData } from '../../context/DataContext';

export default function AboutSection() {
  const { profile, stats } = useData();

  if (!profile) return null;

  const visibleStats = stats.filter(s => s.isVisible).sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <section id="sobre" className="py-24 bg-dark-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[3/4] relative overflow-hidden rounded-sm group">
              {profile.aboutImageUrl && (
                <img 
                  src={profile.aboutImageUrl} 
                  alt="Sobre o atleta" 
                  className="w-full h-full object-cover transition-all duration-700"
                />
              )}
              <div className="absolute inset-0 border border-gold-500/30 m-4 pointer-events-none transition-all duration-700 group-hover:m-2 group-hover:border-gold-500/50" />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-gold-500/10 blur-3xl rounded-full" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-sm font-bold text-gold-500 tracking-widest uppercase mb-2">A Origem</h2>
            <h3 className="text-4xl md:text-5xl font-display font-bold mb-8 text-white">
              Nascido para <span className="text-gradient-gold">Vencer</span>
            </h3>
            
            <div className="prose prose-invert prose-lg mb-10">
              <p className="text-gray-300 font-light leading-relaxed whitespace-pre-line">
                {profile.bio}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-10">
              {profile.category && (
                <div className="glass-panel p-4 border-l-2 border-l-gold-500 hover:bg-white/5 transition-colors">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Categoria</p>
                  <p className="font-bold text-lg">{profile.category}</p>
                </div>
              )}
              {profile.belt && (
                <div className="glass-panel p-4 border-l-2 border-l-gold-500 hover:bg-white/5 transition-colors">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Faixa</p>
                  <p className="font-bold text-lg">{profile.belt}</p>
                </div>
              )}
              {profile.team && (
                <div className="glass-panel p-4 border-l-2 border-l-gold-500 hover:bg-white/5 transition-colors">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Equipe</p>
                  <p className="font-bold text-lg">{profile.team}</p>
                </div>
              )}
              {(profile.city || profile.state) && (
                <div className="glass-panel p-4 border-l-2 border-l-gold-500 hover:bg-white/5 transition-colors">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Local</p>
                  <p className="font-bold text-lg">{[profile.city, profile.state].filter(Boolean).join(', ')}</p>
                </div>
              )}
            </div>

            {visibleStats.length > 0 && (
              <div className={`grid grid-cols-2 md:grid-cols-${Math.min(visibleStats.length, 4)} gap-4 text-center border-t border-white/10 pt-8`}>
                {visibleStats.map(stat => (
                  <div key={stat.id}>
                    <p className="text-3xl md:text-4xl font-display font-bold text-gold-500">
                      {stat.value}<span className="text-xl">{stat.suffix}</span>
                    </p>
                    <p className="text-xs text-gray-400 uppercase mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
