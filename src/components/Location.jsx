import React from 'react';
import { MapPin, Clock, CalendarDays } from 'lucide-react';
import flowers from '../assets/flowers_optimized.webp';

const Location = () => {
  return (
    <section id="local" className="py-24 px-4 bg-paper relative overflow-hidden">
      {/* Decorative Flowers */}
      <div className="absolute -left-20 -top-20 w-64 h-64 opacity-20 pointer-events-none transform -rotate-45 z-0">
        <img src={flowers} alt="" className="w-full h-full object-contain" />
      </div>
      <div className="absolute -right-20 bottom-10 w-64 h-64 opacity-20 pointer-events-none transform rotate-90 z-0">
        <img src={flowers} alt="" className="w-full h-full object-contain" />
      </div>
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-cursive text-5xl md:text-6xl text-blue-accent mb-4">Cerimônia e Festa</h2>
          <p className="font-sans text-navy/70 tracking-widest uppercase text-sm">Onde celebraremos nosso amor</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Details Card */}
          <div className="bg-white p-10 rounded-2xl shadow-sm border border-blue-accent/10 flex flex-col space-y-8">
            <div className="flex items-start space-x-4">
              <CalendarDays className="w-8 h-8 text-blue-accent shrink-0 mt-1" strokeWidth={1.5} />
              <div>
                <h3 className="font-sans font-medium text-xl text-navy mb-1">Data</h3>
                <p className="font-sans font-light text-navy/80">15 de Agosto de 2026</p>
                <p className="font-sans font-light text-navy/80">Sábado</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Clock className="w-8 h-8 text-blue-accent shrink-0 mt-1" strokeWidth={1.5} />
              <div>
                <h3 className="font-sans font-medium text-xl text-navy mb-1">Horário</h3>
                <p className="font-sans font-light text-navy/80">19:30</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <MapPin className="w-8 h-8 text-blue-accent shrink-0 mt-1" strokeWidth={1.5} />
              <div>
                <h3 className="font-sans font-medium text-xl text-navy mb-1">Local</h3>
                <p className="font-sans font-light text-navy/80">Buffet Prince</p>
                <p className="font-sans font-light text-navy/80 text-sm mt-1">
                  Rua Ulisses Cruz n° 800, Tatuapé, São Paulo<br/>
                  CEP 03077-000
                </p>
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=Buffet+Prince+Rua+Ulisses+Cruz+800+Tatuape+Sao+Paulo" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-sm text-blue-accent font-medium hover:text-navy transition-colors underline underline-offset-4"
                >
                  Ver no Google Maps
                </a>
              </div>
            </div>
          </div>

          {/* Map iframe */}
          <div className="h-[400px] bg-gray-100 rounded-2xl overflow-hidden relative shadow-md border border-gray-200">
             <iframe
               title="Mapa do Local"
               src="https://maps.google.com/maps?q=Buffet%20Prince,%20Rua%20Ulisses%20Cruz,%20800,%20Tatuap%C3%A9,%20S%C3%A3o%20Paulo&t=&z=15&ie=UTF8&iwloc=&output=embed"
               width="100%"
               height="100%"
               style={{ border: 0 }}
               allowFullScreen=""
               loading="lazy"
               referrerPolicy="no-referrer-when-downgrade"
             ></iframe>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Location;
