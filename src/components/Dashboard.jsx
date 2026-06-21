import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Users, CheckCircle, XCircle, HelpCircle, MessageSquare, Search, RefreshCw, ArrowLeft } from 'lucide-react';

const Dashboard = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'messages'

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('convidados')
        .select('*')
        .order('nome', { ascending: true });

      if (err) throw err;
      setGuests(data || []);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar os dados. Verifique a conexão com o Supabase.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter guests
  const filteredGuests = guests.filter((guest) => {
    const matchesSearch = guest.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' ? true : guest.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter messages
  const messages = guests.filter((guest) => guest.mensagem_noivos && guest.mensagem_noivos.trim() !== '');

  // Calculate stats
  const total = guests.length;
  const confirmed = guests.filter(g => g.status === 'confirmado').length;
  const declined = guests.filter(g => g.status === 'recusado').length;
  const pending = guests.filter(g => g.status === 'pendente').length;

  const handleBackToSite = () => {
    window.location.hash = '';
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8] text-navy py-12 px-4 md:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <button 
              onClick={handleBackToSite}
              className="flex items-center space-x-2 text-sm font-semibold text-blue-accent hover:text-navy transition-colors mb-2"
            >
              <ArrowLeft size={16} />
              <span>Voltar para o site</span>
            </button>
            <h1 className="text-3xl font-bold tracking-tight text-navy">Painel de Confirmações</h1>
            <p className="text-sm text-navy/60">Acompanhe quem já confirmou presença no casamento</p>
          </div>
          
          <button 
            onClick={fetchData} 
            disabled={loading}
            className="flex items-center space-x-2 bg-white hover:bg-gray-50 border border-gray-200 text-navy font-semibold px-4 py-2 rounded-xl transition-all shadow-sm active:scale-98 disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span>Atualizar Dados</span>
          </button>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total na Lista', value: total, icon: Users, color: 'text-blue-accent bg-blue-500/10' },
            { label: 'Confirmados', value: confirmed, icon: CheckCircle, color: 'text-green-700 bg-green-500/10' },
            { label: 'Não Irão', value: declined, icon: XCircle, color: 'text-red-700 bg-red-500/10' },
            { label: 'Pendentes', value: pending, icon: HelpCircle, color: 'text-yellow-700 bg-yellow-500/10' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
              <div className={`p-3.5 rounded-xl ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-xs text-navy/50 uppercase tracking-wider font-semibold">{stat.label}</p>
                <p className="text-2xl font-bold text-navy mt-0.5">{loading ? '...' : stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button 
            onClick={() => setActiveTab('list')}
            className={`py-3 px-6 font-semibold text-sm border-b-2 transition-all ${
              activeTab === 'list' 
                ? 'border-blue-accent text-blue-accent' 
                : 'border-transparent text-navy/60 hover:text-navy'
            }`}
          >
            Lista de Convidados ({filteredGuests.length})
          </button>
          <button 
            onClick={() => setActiveTab('messages')}
            className={`py-3 px-6 font-semibold text-sm border-b-2 transition-all flex items-center space-x-2 ${
              activeTab === 'messages' 
                ? 'border-blue-accent text-blue-accent' 
                : 'border-transparent text-navy/60 hover:text-navy'
            }`}
          >
            <MessageSquare size={16} />
            <span>Recados Recebidos ({messages.length})</span>
          </button>
        </div>

        {/* Tab Content: Guest List */}
        {activeTab === 'list' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            
            {/* Filters bar */}
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:max-w-md">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/40" />
                <input 
                  type="text" 
                  placeholder="Pesquisar por nome..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-blue-accent/20 focus:border-blue-accent transition-all text-sm"
                />
              </div>

              <div className="flex space-x-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                {[
                  { id: 'all', label: 'Todos' },
                  { id: 'confirmado', label: 'Confirmados' },
                  { id: 'recusado', label: 'Não Irão' },
                  { id: 'pendente', label: 'Pendentes' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setStatusFilter(tab.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap ${
                      statusFilter === tab.id 
                        ? 'bg-navy text-white border-navy' 
                        : 'bg-white text-navy/70 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Guests Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-xs font-semibold text-navy/50 uppercase border-b border-gray-100">
                    <th className="py-4 px-6">Nome do Convidado</th>
                    <th className="py-4 px-6">Status de Confirmação</th>
                    <th className="py-4 px-6">Mensagem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {loading ? (
                    <tr>
                      <td colSpan="3" className="py-8 text-center text-navy/40 font-light">Carregando convidados...</td>
                    </tr>
                  ) : filteredGuests.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="py-8 text-center text-navy/40 font-light">Nenhum convidado encontrado.</td>
                    </tr>
                  ) : (
                    filteredGuests.map((guest) => (
                      <tr key={guest.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-6 font-medium text-navy">{guest.nome}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            guest.status === 'confirmado' 
                              ? 'bg-green-100 text-green-700' 
                              : guest.status === 'recusado' 
                                ? 'bg-red-100 text-red-700' 
                                : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {guest.status === 'confirmado' 
                              ? 'Confirmado' 
                              : guest.status === 'recusado' 
                                ? 'Não Comparecerá' 
                                : 'Pendente'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-navy/70 max-w-xs truncate italic">
                          {guest.mensagem_noivos || <span className="text-gray-300 font-sans not-italic">—</span>}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: Messages */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            {loading ? (
              <div className="bg-white p-8 rounded-3xl text-center text-navy/40 font-light shadow-sm">
                Carregando mensagens...
              </div>
            ) : messages.length === 0 ? (
              <div className="bg-white p-8 rounded-3xl text-center text-navy/40 font-light shadow-sm">
                Nenhum convidado deixou recados ainda.
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {messages.map((guest) => (
                  <div key={guest.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-sans font-bold text-navy">{guest.nome}</h4>
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                          guest.status === 'confirmado' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {guest.status === 'confirmado' ? 'Confirmado' : 'Não irá'}
                        </span>
                      </div>
                      <p className="text-sm italic text-navy/80 font-light bg-gray-50/50 p-4 rounded-xl border border-gray-100/50">
                        "{guest.mensagem_noivos}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
