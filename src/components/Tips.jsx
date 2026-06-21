import React from 'react';
import flowers from '../assets/flowers_optimized.webp';

const Tips = () => {
  return (
    <section id="dicas" className="py-24 px-4 bg-white relative overflow-hidden">
      {/* Decorative Flowers */}
      <div className="absolute -left-20 -bottom-20 w-64 h-64 opacity-15 pointer-events-none transform -rotate-12">
        <img src={flowers} alt="" className="w-full h-full object-contain" />
      </div>
      <div className="absolute -right-20 -top-20 w-64 h-64 opacity-15 pointer-events-none transform rotate-45">
        <img src={flowers} alt="" className="w-full h-full object-contain" />
      </div>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-cursive text-5xl md:text-6xl text-blue-accent mb-4">Dicas</h2>
          <p className="font-sans text-navy/70 tracking-widest uppercase text-sm">Informações Úteis</p>
        </div>

        <div className="max-w-2xl mx-auto">
          
          {/* Dress Code */}
          <div className="flex flex-col items-center text-center p-8 bg-paper rounded-2xl">
            <h3 className="font-sans font-medium text-2xl text-navy mb-4 border-b border-blue-accent/20 pb-4 inline-block">Dress Code</h3>
            <p className="font-sans text-navy/80 font-light leading-relaxed">
              Sugerimos o traje <strong>Passeio Completo</strong>. 
              <br/><br/>
              Para celebrar este dia tão especial conosco, sugerimos o uso de roupas sociais (como terno para os homens e vestidos ou trajes sociais elegantes para as mulheres). Nosso desejo é que todos se sintam lindos e confortáveis para comemorar, sorrir e dançar a noite toda com a gente!
            </p>
          </div>

        </div>
      </div>
      
      {/* Footer / Encerramento */}
      <div className="mt-32 text-center pb-8">
        <h2 className="font-cursive text-4xl text-blue-accent mb-2">Com amor,</h2>
        <p className="font-sans text-navy tracking-[0.2em] uppercase text-sm font-medium">Miriam e Reginaldo</p>
      </div>
    </section>
  );
};

export default Tips;
