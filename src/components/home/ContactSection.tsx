import React from 'react';
import { motion } from 'framer-motion';
import { useData } from '../../context/DataContext';
import { Instagram, MessageCircle, Mail } from 'lucide-react';

export default function ContactSection() {
  const { support, profile } = useData();

  if (!support || !support.isVisible) return null;

  const whatsappLink = support.whatsappLink || `https://wa.me/${support.whatsappNumber || profile?.social.whatsapp}`;
  const instagramLink = support.instagramUrl || profile?.social.instagram;
  const emailAddress = support.email || profile?.social.email;

  return (
    <section id="apoie" className="py-24 bg-dark-800 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-gold-500/5 blur-[120px] pointer-events-none" />
      
      {support.imageUrl && (
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-dark-900/70 z-10 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark-900/80 via-transparent to-dark-900/80 z-10" />
          <img 
            src={support.imageUrl} 
            alt="Support background" 
            className="w-full h-full object-cover object-center"
          />
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-sm font-bold text-gold-500 tracking-widest uppercase mb-2">{support.subtitle || 'Faça Parte'}</h2>
          <h3 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
            {support.title.split(' ').map((word, i, arr) => (
              <React.Fragment key={i}>
                {i === arr.length - 1 ? <span className="text-gradient-gold">{word}</span> : word}{' '}
              </React.Fragment>
            ))}
          </h3>
          
          <p className="text-lg text-gray-300 font-light mb-12 max-w-2xl mx-auto leading-relaxed whitespace-pre-line">
            {support.description}
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            {support.primaryButtonText && (
              <a 
                href={support.primaryButtonLink || whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-gold-500 hover:bg-gold-400 text-dark-900 font-bold uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]"
              >
                <MessageCircle size={20} />
                <span>{support.primaryButtonText}</span>
              </a>
            )}
            
            {support.secondaryButtonText && (
              <a 
                href={support.secondaryButtonLink || instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 glass-panel hover:bg-white/10 text-white font-bold uppercase tracking-wider transition-all duration-300 border border-white/10 hover:border-white/30"
              >
                <Instagram size={20} />
                <span>{support.secondaryButtonText}</span>
              </a>
            )}
          </div>

          {emailAddress && (
            <div className="mt-12 pt-8 border-t border-white/10 inline-flex items-center gap-3 text-gray-400">
              <Mail size={16} />
              <a href={`mailto:${emailAddress}`} className="hover:text-gold-500 transition-colors">
                {emailAddress}
              </a>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
