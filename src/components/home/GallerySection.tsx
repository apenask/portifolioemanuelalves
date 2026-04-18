import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../../context/DataContext';
import { X } from 'lucide-react';

export default function GallerySection() {
  const { gallery, galleryCategories } = useData();
  const [filter, setFilter] = useState<string>('todos');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const visibleCategories = galleryCategories.filter(c => c.isVisible).sort((a, b) => a.displayOrder - b.displayOrder);
  const visibleGallery = gallery.filter(img => img.isVisible).sort((a, b) => a.displayOrder - b.displayOrder);

  const filteredGallery = filter === 'todos' 
    ? visibleGallery 
    : visibleGallery.filter(img => img.categoryId === filter);

  if (visibleGallery.length === 0) return null;

  return (
    <section id="galeria" className="py-24 bg-dark-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-sm font-bold text-gold-500 tracking-widest uppercase mb-2">Imagens</h2>
          <h3 className="text-4xl md:text-5xl font-display font-bold text-white mb-8">
            <span className="text-gradient-gold">Galeria</span>
          </h3>

          {visibleCategories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
              <button
                onClick={() => setFilter('todos')}
                className={`px-4 py-2 text-xs sm:text-sm uppercase tracking-wider transition-colors border ${
                  filter === 'todos' 
                    ? 'bg-gold-500 text-dark-900 border-gold-500 font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]' 
                    : 'bg-transparent text-gray-400 border-white/10 hover:border-gold-500/50 hover:text-white'
                }`}
              >
                Todos
              </button>
              {visibleCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setFilter(cat.id)}
                  className={`px-4 py-2 text-xs sm:text-sm uppercase tracking-wider transition-colors border ${
                    filter === cat.id 
                      ? 'bg-gold-500 text-dark-900 border-gold-500 font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]' 
                      : 'bg-transparent text-gray-400 border-white/10 hover:border-gold-500/50 hover:text-white'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
          <AnimatePresence>
            {filteredGallery.map((img) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={img.id}
                className="aspect-square relative overflow-hidden group cursor-pointer rounded-sm"
                onClick={() => setSelectedImage(img.url)}
              >
                {img.url ? (
                  <img 
                    src={img.url} 
                    alt={img.caption || 'Galeria'} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-dark-800 flex items-center justify-center"></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  {img.caption && (
                    <p className="text-white font-display uppercase tracking-wider text-xs sm:text-sm px-2 text-center drop-shadow-md">
                      {img.caption}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-dark-900/95 p-4 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white hover:text-gold-500 transition-colors z-50"
              onClick={() => setSelectedImage(null)}
            >
              <X size={32} />
            </button>
            <motion.img
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              src={selectedImage}
              alt="Ampliada"
              className="max-w-full max-h-[90vh] object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
