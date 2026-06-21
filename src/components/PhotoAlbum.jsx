import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

// Import all images with their correct extensions
import img8 from '../assets/M_R-8.webp';
import img20 from '../assets/M_R-20.webp';
import img26 from '../assets/M_R-26.jpg';
import img28 from '../assets/M_R-28.jpg';
import img39 from '../assets/M_R-39.jpg';
import img48 from '../assets/M_R-48.webp';
import img50 from '../assets/M_R-50.webp';
import img73 from '../assets/M_R-73.jpg';
import img88 from '../assets/M_R-88.jpg';
import img89 from '../assets/M_R-89.jpg';
import img103 from '../assets/M_R-103.webp';
import img159 from '../assets/M_R-159.jpg';
import img176 from '../assets/M_R-176.webp';
import img180 from '../assets/M_R-180.jpg';
import img141 from '../assets/M_R-141.jpg';
import img181 from '../assets/M_R-181.jpeg';

const PhotoAlbum = () => {
  const images = [
    img8, img20, img26, img28, img39, img48, img50, img73, img88, img89, img103, img159, img176, img180, img141, img181
  ];

  const [activeIdx, setActiveIdx] = useState(null);

  const openLightbox = (index) => {
    setActiveIdx(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setActiveIdx(null);
    document.body.style.overflow = '';
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="album" className="py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-cursive text-5xl md:text-6xl text-blue-accent mb-4">Álbum de Fotos</h2>
          <p className="font-sans text-navy/70 tracking-widest uppercase text-sm">Momentos do nosso ensaio</p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img, idx) => (
            <div 
              key={idx}
              onClick={() => openLightbox(idx)}
              className="group aspect-square overflow-hidden rounded-2xl bg-gray-100 cursor-pointer relative shadow-sm hover:shadow-md transition-all duration-300"
            >
              <img 
                src={img} 
                alt={`Foto do ensaio ${idx + 1}`} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-navy/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white font-sans text-xs uppercase tracking-wider font-medium bg-blue-accent/90 px-4 py-2 rounded-full shadow-sm">
                  Visualizar
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeIdx !== null && (
        <div 
          onClick={closeLightbox}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 transition-opacity duration-300"
        >
          {/* Close button */}
          <button 
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all duration-200 z-55"
            aria-label="Fechar visualização"
          >
            <X size={24} />
          </button>

          {/* Previous button */}
          <button 
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all duration-200 z-55 active:scale-95"
            aria-label="Foto anterior"
          >
            <ChevronLeft size={28} />
          </button>

          {/* Active Image */}
          <div className="max-w-4xl max-h-[80vh] flex items-center justify-center relative select-none">
            <img 
              src={images[activeIdx]} 
              alt="Foto ampliada do ensaio" 
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            />
            {/* Image Counter */}
            <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 text-white/70 font-sans text-sm font-light">
              {activeIdx + 1} / {images.length}
            </div>
          </div>

          {/* Next button */}
          <button 
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all duration-200 z-55 active:scale-95"
            aria-label="Próxima foto"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      )}
    </section>
  );
};

export default PhotoAlbum;
