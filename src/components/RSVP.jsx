import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Search, CheckCircle2, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import flowers from '../assets/flowers_optimized.webp';

const RSVP = () => {
  const [step, setStep] = useState(1); // 1: Search, 2: Select/Confirm, 3: Success
  const [searchName, setSearchName] = useState('');
  const [guests, setGuests] = useState([]);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form states
  const [status, setStatus] = useState('confirmado'); // 'confirmado' or 'recusado'
  const [message, setMessage] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchName.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('convidados')
        .select('*')
        .ilike('nome', `%${searchName.trim()}%`);

      if (err) throw err;
      setGuests(data);
      if (data.length === 0) {
        setError('Não encontramos nenhum convidado com esse nome. Por favor, tente digitar de outra forma ou fale com os noivos.');
      }
    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro ao buscar. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectGuest = (guest) => {
    setSelectedGuest(guest);
    setStatus(guest.status === 'pendente' ? 'confirmado' : guest.status);
    setMessage(guest.mensagem_noivos || '');
    setStep(2);
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: err } = await supabase
        .from('convidados')
        .update({
          status,
          mensagem_noivos: message.trim() || null,
          confirmado_em: new Date().toISOString()
        })
        .eq('id', selectedGuest.id);

      if (err) throw err;
      setStep(3);
    } catch (err) {
      console.error(err);
      setError('Erro ao enviar confirmação. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setSearchName('');
    setGuests([]);
    setSelectedGuest(null);
    setStatus('confirmado');
    setMessage('');
    setError(null);
  };

  return (
    <section id="rsvp" className="py-24 px-4 bg-white relative overflow-hidden">
      {/* Decorative Flowers */}
      <div className="absolute -left-20 top-10 w-64 h-64 opacity-20 pointer-events-none transform rotate-12">
        <img src={flowers} alt="" className="w-full h-full object-contain" />
      </div>
      <div className="absolute -right-20 bottom-10 w-64 h-64 opacity-20 pointer-events-none transform -rotate-45">
        <img src={flowers} alt="" className="w-full h-full object-contain" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <span className="font-sans text-xs font-semibold tracking-widest text-blue-accent uppercase block mb-2">R.S.V.P</span>
          <h2 className="font-cursive text-5xl md:text-6xl text-blue-accent mb-4">Confirmação de Presença</h2>
          <p className="font-sans text-navy/70 font-light max-w-md mx-auto">
            Queremos muito celebrar este dia tão especial com você. Por favor, confirme sua presença!
          </p>
        </div>

        <div className="bg-paper p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100/50 backdrop-blur-sm transition-all duration-300">
          
          {/* STEP 1: SEARCH GUEST */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in-up">
              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <label htmlFor="search-name" className="block font-sans text-sm font-semibold text-navy mb-3">
                    Pesquise pelo seu nome para começar:
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      id="search-name" 
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl pl-4 pr-12 py-4 text-navy focus:outline-none focus:ring-2 focus:ring-blue-accent/30 focus:border-blue-accent transition-all font-sans text-base"
                      placeholder="Ex: João da Silva"
                      required
                    />
                    <button 
                      type="submit"
                      disabled={loading}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-navy hover:bg-navy/90 text-white p-2.5 rounded-lg transition-colors shadow-sm disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </form>

              {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm font-sans border border-red-100">
                  {error}
                </div>
              )}

              {guests.length > 0 && (
                <div className="space-y-3 pt-4">
                  <h3 className="font-sans text-sm font-semibold text-navy/70">
                    Selecione o seu nome na lista abaixo:
                  </h3>
                  <div className="max-h-60 overflow-y-auto pr-2 space-y-2">
                    {guests.map((guest) => (
                      <button
                        key={guest.id}
                        onClick={() => handleSelectGuest(guest)}
                        className="w-full flex items-center justify-between p-4 bg-white border border-gray-150 rounded-xl hover:border-blue-accent hover:bg-blue-accent/5 transition-all text-left group"
                      >
                        <div>
                          <p className="font-sans font-medium text-navy group-hover:text-navy transition-colors">
                            {guest.nome}
                          </p>
                          {guest.status !== 'pendente' && (
                            <span className={`inline-block text-[10px] uppercase tracking-wider font-semibold mt-1 px-2 py-0.5 rounded-full ${
                              guest.status === 'confirmado' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              Já respondeu: {guest.status === 'confirmado' ? 'Confirmado' : 'Não irá'}
                            </span>
                          )}
                        </div>
                        <span className="text-blue-accent group-hover:translate-x-1 transition-transform">→</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: CONFIRM RSVP */}
          {step === 2 && selectedGuest && (
            <form onSubmit={handleConfirm} className="space-y-6 animate-fade-in-up">
              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="flex items-center space-x-2 text-xs font-semibold text-blue-accent hover:text-navy transition-colors mb-4"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar para busca</span>
              </button>

              <div className="border-b border-gray-100 pb-4 mb-4">
                <span className="text-[10px] tracking-widest text-blue-accent uppercase font-bold">Convidado Selecionado</span>
                <h3 className="font-sans text-2xl font-semibold text-navy mt-1">{selectedGuest.nome}</h3>
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm font-sans border border-red-100">
                  {error}
                </div>
              )}

              {/* Status Radio Buttons */}
              <div className="space-y-3">
                <label className="block font-sans text-sm font-semibold text-navy">
                  Você poderá comparecer ao nosso casamento?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className={`relative flex cursor-pointer rounded-xl border p-4 shadow-sm focus:outline-none transition-all ${
                    status === 'confirmado' 
                      ? 'border-blue-accent bg-blue-accent/5 ring-1 ring-blue-accent' 
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}>
                    <input 
                      type="radio" 
                      name="status" 
                      value="confirmado" 
                      checked={status === 'confirmado'}
                      onChange={() => setStatus('confirmado')}
                      className="sr-only" 
                    />
                    <span className="flex flex-1 items-center justify-center text-navy font-semibold text-sm">
                      Sim, irei confirmar!
                    </span>
                  </label>
                  
                  <label className={`relative flex cursor-pointer rounded-xl border p-4 shadow-sm focus:outline-none transition-all ${
                    status === 'recusado' 
                      ? 'border-red-400 bg-red-50/20 ring-1 ring-red-400' 
                      : 'border-gray-200 bg-white opacity-70 hover:opacity-100 hover:bg-gray-50'
                  }`}>
                    <input 
                      type="radio" 
                      name="status" 
                      value="recusado" 
                      checked={status === 'recusado'}
                      onChange={() => setStatus('recusado')}
                      className="sr-only" 
                    />
                    <span className="flex flex-1 items-center justify-center text-navy font-semibold text-sm">
                      Não poderei ir
                    </span>
                  </label>
                </div>
              </div>

              {/* Message to the Bride and Groom */}
              <div>
                <label htmlFor="message" className="block font-sans text-sm font-semibold text-navy mb-2">
                  Mensagem para os Noivos
                </label>
                <textarea 
                  id="message" 
                  rows="4" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-blue-accent/30 focus:border-blue-accent transition-all resize-none font-sans text-sm"
                  placeholder="Deixe um recado especial para Miriam e Reginaldo..."
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-navy hover:bg-navy/95 text-white font-sans font-semibold tracking-wide uppercase text-sm py-4 rounded-xl transition-all shadow-md active:scale-[0.99] flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Enviar Confirmação</span>
              </button>
            </form>
          )}

          {/* STEP 3: SUCCESS */}
          {step === 3 && (
            <div className="text-center py-6 space-y-6 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 text-green-500 mb-2 relative">
                <CheckCircle2 size={40} className="relative z-10" />
                <Sparkles size={20} className="absolute -top-1 -right-1 text-yellow-400 animate-pulse" />
              </div>
              
              <div className="space-y-2">
                <h3 className="font-sans text-2xl font-bold text-navy">Confirmação Enviada!</h3>
                <p className="font-sans text-navy/70 text-sm font-light max-w-sm mx-auto">
                  {status === 'confirmado' 
                    ? 'Sua presença foi confirmada com sucesso. Muito obrigado por compartilhar esse momento conosco!' 
                    : 'Agradecemos por nos informar. Sua resposta foi registrada.'}
                </p>
              </div>

              {message.trim() && (
                <div className="max-w-md mx-auto p-4 bg-white border border-gray-100 rounded-xl italic text-navy/80 text-sm font-light relative">
                  "{message}"
                </div>
              )}

              <div className="pt-4">
                <button
                  onClick={handleReset}
                  className="font-sans text-xs font-semibold text-blue-accent hover:underline hover:text-navy transition-colors"
                >
                  Confirmar para outra pessoa
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default RSVP;

