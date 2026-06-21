import React from 'react';

const OurStory = () => {
  return (
    <section id="historia" className="py-24 px-4 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-cursive text-5xl md:text-6xl text-blue-accent mb-8">Nossa História</h2>
        
        <div className="space-y-6 text-navy/80 font-sans text-lg md:text-xl leading-relaxed font-light">
          <p>
            Tudo começou com um olhar, um sorriso tímido e uma conversa que parecia não ter fim. 
            Desde aquele dia, sabíamos que havia algo especial entre nós.
          </p>
          <p>
            Construímos nossa história com base no amor, no respeito e em muitos sonhos compartilhados. 
            Passamos por desafios que nos fortaleceram e momentos de alegria que guardaremos para sempre.
          </p>
          <p>
            Agora, estamos prestes a dar o passo mais importante de nossas vidas, 
            e não poderíamos estar mais felizes em compartilhar esse momento único com as pessoas que mais amamos.
          </p>
        </div>

        <div className="mt-16 flex justify-center">
          <div className="h-px w-24 bg-blue-accent/30"></div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
