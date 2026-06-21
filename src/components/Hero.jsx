import React, { useState, useEffect } from 'react';
import { CalendarDays, Heart, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

// Import images from assets folder
import img1 from '../assets/M_R-8.webp';
import img2 from '../assets/M_R-20.webp';
import img3 from '../assets/M_R-48.webp';
import img4 from '../assets/M_R-50.webp';
import img5 from '../assets/M_R-103.webp';
import img6 from '../assets/M_R-176.webp';

const Hero = () => {
  // You can customize the alignment/position of each image here!
  // Options: 'bg-center', 'bg-top', 'bg-bottom', or custom like 'bg-[position:center_30%]' (crops higher/lower)
  const images = [
    { src: img1, position: 'bg-center' },
    { src: img2, position: 'bg-center' },
    { src: img3, position: 'bg-center' },
    { src: img4, position: 'bg-center' },
    { src: img5, position: 'bg-center' },
    { src: img6, position: 'bg-center' },
  ];
  const [currentIdx, setCurrentIdx] = useState(0);

  // Auto-slide every 6 seconds
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(slideInterval);
  }, [images.length]);

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % images.length);
  };

  // Countdown timer logic
  const calculateTimeLeft = () => {
    const weddingDate = new Date('2026-08-15T00:00:00-03:00'); // Brasília/São Paulo time
    const now = new Date();
    const difference = weddingDate - now;

    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
        horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutos: Math.floor((difference / 1000 / 60) % 60),
        segundos: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = { dias: 0, horas: 0, opacity: 0, minutos: 0, segundos: 0 };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-navy">
      {/* Background Image Slideshow */}
      <div className="absolute inset-0 z-0">
        {images.map((item, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 bg-cover transition-opacity duration-1500 ease-in-out ${item.position} ${
              idx === currentIdx ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
            style={{ backgroundImage: `url(${item.src})` }}
          >
            {idx === currentIdx && (
              <div 
                className={`absolute inset-0 animate-kenburns bg-cover ${item.position}`} 
                style={{ backgroundImage: `url(${item.src})` }} 
              />
            )}
          </div>
        ))}
        {/* Soft overlay gradient to ensure readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/55 to-navy/70 z-20" />
      </div>

      {/* Manual Slide Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 text-white/60 hover:text-white transition-all active:scale-95"
        aria-label="Foto anterior"
      >
        <ChevronLeft size={36} />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 text-white/60 hover:text-white transition-all active:scale-95"
      >
        <ChevronRight size={36} />
      </button>

      {/* Main Content Area */}
      <div className="relative z-30 max-w-4xl mx-auto px-4 py-16 md:py-24 text-center flex flex-col items-center justify-center min-h-screen">
        
        {/* Intro tag */}
        <div className="mb-3 md:mb-6 animate-fade-in-up">
          <p className="font-sans text-xs md:text-base lg:text-lg text-white uppercase tracking-[0.3em] font-semibold">
            Bem-vindo ao nosso casamento
          </p>
        </div>

        {/* Couple Names */}
        <div className="mb-6 md:mb-10 animate-fade-in-up">
          <h1 className="font-cursive text-5xl sm:text-7xl md:text-[8rem] text-white leading-none tracking-wide drop-shadow-md">
            Miriam & Reginaldo
          </h1>
        </div>

        {/* Date and Location Badge */}
        <div className="mb-8 md:mb-12 flex flex-col items-center animate-fade-in-up">
          <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/15 shadow-md">
            <CalendarDays className="w-5 h-5 text-blue-accent" />
            <span className="font-sans text-sm md:text-base text-white font-medium tracking-wide">
              15 de Agosto de 2026 • São Paulo, SP
            </span>
          </div>
        </div>

        {/* Active Countdown Timer */}
        <div className="mb-8 md:mb-14 w-full max-w-xl animate-fade-in-up">
          <div className="grid grid-cols-4 gap-2 md:gap-4">
            {[
              { label: 'Dias', value: timeLeft.dias },
              { label: 'Horas', value: timeLeft.horas },
              { label: 'Minutos', value: timeLeft.minutos },
              { label: 'Segundos', value: timeLeft.segundos },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 md:p-5 flex flex-col items-center justify-center shadow-lg transition-transform hover:scale-[1.02]"
              >
                <span className="font-sans text-2xl md:text-4xl font-semibold text-white tracking-tight leading-none mb-1 md:mb-2">
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="font-sans text-[10px] md:text-xs text-blue-accent uppercase tracking-widest font-medium">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md px-4 animate-fade-in-up">
          <a
            href="#rsvp"
            className="w-full sm:w-auto px-10 py-4 bg-blue-accent text-white hover:bg-blue-accent/90 font-sans text-sm font-semibold tracking-wider uppercase rounded-xl transition-all shadow-md active:scale-95 text-center"
          >
            Confirmar Presença
          </a>
          <a
            href="#local"
            className="w-full sm:w-auto px-10 py-4 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 font-sans text-sm font-semibold tracking-wider uppercase rounded-xl border border-white/25 transition-all shadow-md active:scale-95 text-center"
          >
            Local do Evento
          </a>
        </div>

        {/* Slideshow progress indicators (dots) */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2.5 z-30">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIdx(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                idx === currentIdx ? 'bg-blue-accent w-6' : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Ir para foto ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Hero;

