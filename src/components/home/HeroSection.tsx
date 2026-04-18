import React from 'react';
import { motion } from 'framer-motion';
import { useData } from '../../context/DataContext';
import { ChevronDown } from 'lucide-react';

export default function HeroSection() {
  const { profile } = useData();

  if (!profile) return null;

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-dark-900/70 z-10 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-900/80 via-transparent to-dark-900/80 z-10" />
        {profile.heroImageUrl && (
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            src={profile.heroImageUrl} 
            alt={profile.name}
            className="w-full h-full object-cover object-center"
          />
        )}
      </div>

      <div className="relative z-20 text-center px-4 max-w-5xl mx-auto mt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        >
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-bold tracking-tighter mb-4 text-white drop-shadow-2xl">
            {profile.name.split(' ').map((word, i) => (
              <span key={i} className={i === profile.name.split(' ').length - 1 ? "text-gradient-gold" : ""}>
                {word}{' '}
              </span>
            ))}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
        >
          <p className="text-xl md:text-2xl font-light text-gray-300 mb-4 max-w-2xl mx-auto uppercase tracking-widest">
            {profile.subtitle}
          </p>
          {profile.heroDescription && (
            <p className="text-sm md:text-base text-gray-400 mb-8 max-w-xl mx-auto font-light leading-relaxed">
              {profile.heroDescription}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a href="#conquistas" className="px-8 py-4 bg-gold-500 hover:bg-gold-400 text-dark-900 font-bold uppercase tracking-wider transition-all duration-300 w-full sm:w-auto text-center shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]">
            Ver Conquistas
          </a>
          <a href="#apoie" className="px-8 py-4 glass-panel hover:bg-white/10 text-white font-bold uppercase tracking-wider transition-all duration-300 w-full sm:w-auto text-center border border-white/10 hover:border-white/30">
            Patrocinar
          </a>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce"
      >
        <a href="#sobre" className="text-gray-400 hover:text-gold-500 transition-colors flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest font-bold">Descubra</span>
          <ChevronDown size={24} />
        </a>
      </motion.div>
    </section>
  );
}
