import React, { useState } from 'react';
import { Gift, Plane, Copy, Check } from 'lucide-react';
import flowers from '../assets/flowers_optimized.webp';

const GiftList = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('11969677883');
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2500);
  };

  return (
    <section id="presentes" className="py-24 px-4 bg-paper relative overflow-hidden">
      {/* Decorative Flowers */}
      <div className="absolute -left-20 -bottom-20 w-64 h-64 opacity-20 pointer-events-none transform rotate-45 z-0">
        <img src={flowers} alt="" className="w-full h-full object-contain" />
      </div>
      <div className="absolute -right-20 -top-20 w-64 h-64 opacity-20 pointer-events-none transform -rotate-90 z-0">
        <img src={flowers} alt="" className="w-full h-full object-contain" />
      </div>
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="font-cursive text-5xl md:text-6xl text-blue-accent mb-6">Lista de Presentes</h2>
        <p className="font-sans text-navy/80 font-light text-lg mb-12 max-w-2xl mx-auto">
          Sua presença é o nosso maior presente! Mas se desejar nos presentear, 
          disponibilizamos algumas opções abaixo para nos ajudar a construir nosso lar e nossa lua de mel.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Cota Lua de Mel / PIX */}
          <div className="bg-white p-10 rounded-2xl shadow-sm border border-blue-accent/10 flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-accent/10 rounded-full flex items-center justify-center mb-6">
              <Plane className="w-8 h-8 text-blue-accent" strokeWidth={1.5} />
            </div>
            <h3 className="font-sans font-medium text-2xl text-navy mb-2">Mimos para os Noivos</h3>
            <p className="font-sans text-navy/60 text-sm mb-8 text-center">
              Contribua com qualquer valor para a nossa viagem inesquecível através do PIX.
            </p>
            
            <div className="w-full bg-gray-50 rounded-lg p-4 mb-4 font-mono text-sm text-navy break-all border border-gray-200">
              11969677883
            </div>
            
            <button 
              onClick={handleCopy}
              className={`w-full flex items-center justify-center space-x-2 font-sans font-medium uppercase tracking-wide text-sm py-3 rounded-lg transition-all duration-300 ${
                copied 
                  ? 'bg-green-500/10 text-green-700 border border-green-500/20' 
                  : 'bg-blue-accent/10 hover:bg-blue-accent/20 text-blue-accent'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Chave Copiada!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar Chave PIX</span>
                </>
              )}
            </button>
          </div>

          {/* Lista em Loja */}
          <div className="bg-white p-10 rounded-2xl shadow-sm border border-blue-accent/10 flex flex-col items-center justify-between">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-navy/5 rounded-full flex items-center justify-center mb-6">
                <Gift className="w-8 h-8 text-navy" strokeWidth={1.5} />
              </div>
              <h3 className="font-sans font-medium text-2xl text-navy mb-2">Lista Virtual</h3>
              <p className="font-sans text-navy/60 text-sm mb-8 text-center">
                Escolha um presente na nossa lista virtual de itens para a casa.
              </p>
            </div>
            
            <a 
              href="https://www.querodecasamento.com.br/lista-de-casamento/miriam--reginaldo"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center bg-navy hover:bg-navy/90 text-white font-sans font-medium uppercase tracking-wide text-sm py-3 rounded-lg transition-colors shadow-md"
            >
              Acessar Lista
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};

export default GiftList;
