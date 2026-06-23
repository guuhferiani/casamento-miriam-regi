import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { 
  Users, CheckCircle, XCircle, HelpCircle, Search, RefreshCw, ArrowLeft, 
  Plus, Trash2, Edit3, Download, Lock, Key, X, Save, AlertTriangle 
} from 'lucide-react';

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  
  // Data states
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Form states
  const [formName, setFormName] = useState('');
  const [formStatus, setFormStatus] = useState('pendente');
  const [formMessage, setFormMessage] = useState('');
  const [selectedGuest, setSelectedGuest] = useState(null);

  // Check auth in sessionStorage on mount
  useEffect(() => {
    const isAuth = sessionStorage.getItem('admin_authenticated');
    if (isAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const correctPasscode = import.meta.env.VITE_ADMIN_PASSCODE || 'admin123';
    
    if (passcode === correctPasscode) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      setAuthError('');
    } else {
      setAuthError('Senha incorreta. Tente novamente.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
    setPasscode('');
  };

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
      setError('Erro ao carregar dados do Supabase. Verifique a configuração.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  // Guest actions
  const handleAddGuest = async (e) => {
    e.preventDefault();
    if (!formName.trim()) return;

    setActionLoading(true);
    try {
      const { data, error: err } = await supabase
        .from('convidados')
        .insert([
          { 
            nome: formName.trim(), 
            status: formStatus,
            mensagem_noivos: formMessage.trim() || null,
            confirmado_em: formStatus !== 'pendente' ? new Date().toISOString() : null
          }
        ])
        .select();

      if (err) throw err;
      
      // Update local state
      if (data) {
        setGuests(prev => [...prev, data[0]].sort((a, b) => a.nome.localeCompare(b.nome)));
      } else {
        await fetchData();
      }
      
      // Reset form & close
      setFormName('');
      setFormStatus('pendente');
      setFormMessage('');
      setIsAddModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Erro ao adicionar convidado. Tente novamente.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditGuest = async (e) => {
    e.preventDefault();
    if (!selectedGuest || !formName.trim()) return;

    setActionLoading(true);
    try {
      const { error: err } = await supabase
        .from('convidados')
        .update({
          nome: formName.trim(),
          status: formStatus,
          mensagem_noivos: formMessage.trim() || null,
          confirmado_em: formStatus !== selectedGuest.status && formStatus !== 'pendente' 
            ? new Date().toISOString() 
            : selectedGuest.confirmado_em
        })
        .eq('id', selectedGuest.id);

      if (err) throw err;

      // Update state locally
      setGuests(prev => prev.map(g => {
        if (g.id === selectedGuest.id) {
          return { 
            ...g, 
            nome: formName.trim(), 
            status: formStatus, 
            mensagem_noivos: formMessage.trim() || null 
          };
        }
        return g;
      }).sort((a, b) => a.nome.localeCompare(b.nome)));

      setIsEditModalOpen(false);
      setSelectedGuest(null);
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar convidado.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteGuest = async () => {
    if (!selectedGuest) return;

    setActionLoading(true);
    try {
      const { error: err } = await supabase
        .from('convidados')
        .delete()
        .eq('id', selectedGuest.id);

      if (err) throw err;

      setGuests(prev => prev.filter(g => g.id !== selectedGuest.id));
      setIsDeleteModalOpen(false);
      setSelectedGuest(null);
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir convidado.');
    } finally {
      setActionLoading(false);
    }
  };

  const openEditModal = (guest) => {
    setSelectedGuest(guest);
    setFormName(guest.nome);
    setFormStatus(guest.status);
    setFormMessage(guest.mensagem_noivos || '');
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (guest) => {
    setSelectedGuest(guest);
    setIsDeleteModalOpen(true);
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (guests.length === 0) return;
    
    // CSV headers & rows
    const headers = ['ID', 'Nome', 'Status', 'Mensagem', 'Data Confirmacao'];
    const rows = guests.map(g => [
      g.id,
      `"${g.nome.replace(/"/g, '""')}"`,
      g.status,
      `"${(g.mensagem_noivos || '').replace(/"/g, '""')}"`,
      g.confirmado_em || ''
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `lista_convidados_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtering
  const filteredGuests = guests.filter(guest => {
    const matchesSearch = guest.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' ? true : guest.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const total = guests.length;
  const confirmed = guests.filter(g => g.status === 'confirmado').length;
  const declined = guests.filter(g => g.status === 'recusado').length;
  const pending = guests.filter(g => g.status === 'pendente').length;

  const handleBackToSite = () => {
    window.location.hash = '';
    window.location.reload();
  };

  // 1. Password Lock screen style
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
        {/* Subtle decorative background circles */}
        <div className="absolute w-[500px] h-[500px] bg-blue-accent/5 rounded-full -top-40 -left-40 blur-3xl pointer-events-none" />
        <div className="absolute w-[500px] h-[500px] bg-navy/5 rounded-full -bottom-40 -right-40 blur-3xl pointer-events-none" />

        <div className="max-w-md w-full space-y-8 bg-white/70 backdrop-blur-md p-10 rounded-3xl shadow-xl border border-gray-100 relative z-10">
          <div className="text-center">
            <div className="mx-auto h-14 w-14 bg-navy/10 rounded-2xl flex items-center justify-center text-navy mb-4">
              <Lock size={28} />
            </div>
            <h2 className="text-3xl font-extrabold text-navy tracking-tight">Acesso Restrito</h2>
            <p className="mt-2 text-sm text-navy/60">
              Digite a senha administrativa para gerenciar os convidados.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-navy/40">
                  <Key size={18} />
                </span>
                <input
                  type="password"
                  required
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="appearance-none rounded-xl relative block w-full pl-11 pr-4 py-3.5 border border-gray-200 placeholder-gray-400 text-navy focus:outline-none focus:ring-2 focus:ring-blue-accent/30 focus:border-blue-accent sm:text-sm transition-all"
                  placeholder="Senha Administrativa"
                />
              </div>
            </div>

            {authError && (
              <div className="text-red-600 text-sm text-center bg-red-50/50 py-2 rounded-lg border border-red-100">
                {authError}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-navy hover:bg-navy/95 transition-all shadow-md active:scale-98"
              >
                Entrar no Painel
              </button>
              
              <button
                type="button"
                onClick={handleBackToSite}
                className="w-full text-center text-xs font-semibold text-blue-accent hover:text-navy transition-colors py-2"
              >
                Voltar para o site principal
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 2. Main Admin Dashboard Panel UI
  return (
    <div className="min-h-screen bg-[#f0f4f8] text-navy py-12 px-4 md:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-2 text-sm font-semibold text-blue-accent hover:text-navy transition-colors mb-2"
            >
              <ArrowLeft size={16} />
              <span>Sair do Painel Admin</span>
            </button>
            <h1 className="text-3xl font-bold tracking-tight text-navy flex items-center gap-2">
              Painel Administrativo 
              <span className="text-xs bg-navy text-white px-2 py-0.5 rounded-md font-normal">Modo Edição</span>
            </h1>
            <p className="text-sm text-navy/60">Gerencie (adicione, altere e remova) os convidados da lista.</p>
          </div>
          
          <div className="flex space-x-3 w-full md:w-auto">
            <button 
              onClick={handleExportCSV}
              disabled={guests.length === 0}
              className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-white hover:bg-gray-50 border border-gray-250 text-navy font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-98 disabled:opacity-50 text-sm"
            >
              <Download size={16} />
              <span>Exportar Excel/CSV</span>
            </button>

            <button 
              onClick={() => {
                setFormName('');
                setFormStatus('pendente');
                setFormMessage('');
                setIsAddModalOpen(true);
              }}
              className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-navy hover:bg-navy/95 text-white font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-98 text-sm"
            >
              <Plus size={16} />
              <span>Novo Convidado</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Convidados', value: total, icon: Users, color: 'text-blue-accent bg-blue-500/10' },
            { label: 'Confirmados', value: confirmed, icon: CheckCircle, color: 'text-green-700 bg-green-500/10' },
            { label: 'Recusaram', value: declined, icon: XCircle, color: 'text-red-700 bg-red-500/10' },
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

        {/* List Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Filters & Search bar */}
          <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:max-w-md">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/40" />
              <input 
                type="text" 
                placeholder="Pesquisar convidado na base..." 
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
              
              <button 
                onClick={fetchData}
                disabled={loading}
                className="p-2 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 text-navy disabled:opacity-50 flex items-center justify-center transition-colors"
                title="Recarregar dados"
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-xs font-semibold text-navy/50 uppercase border-b border-gray-100">
                  <th className="py-4 px-6">Nome do Convidado</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Recado</th>
                  <th className="py-4 px-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-navy/40 font-light">
                      Carregando dados da nuvem...
                    </td>
                  </tr>
                ) : filteredGuests.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-navy/40 font-light">
                      Nenhum convidado encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredGuests.map((guest) => (
                    <tr key={guest.id} className="hover:bg-gray-50/40 transition-colors">
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
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => openEditModal(guest)}
                            className="p-2 text-navy/60 hover:text-navy hover:bg-gray-100 rounded-lg transition-all"
                            title="Editar convidado"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => openDeleteModal(guest)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Remover convidado"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: ADD GUEST */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-100 animate-scale-up">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-lg text-navy">Adicionar Novo Convidado</h3>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 rounded-lg text-navy/40 hover:text-navy hover:bg-gray-100 transition-all"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleAddGuest} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-navy/70 uppercase tracking-wider mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ex: Maria Souza"
                    className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4 py-3 text-navy text-sm focus:outline-none focus:ring-2 focus:ring-blue-accent/20 focus:border-blue-accent transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-navy/70 uppercase tracking-wider mb-2">
                    Status de Confirmação
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4 py-3 text-navy text-sm focus:outline-none focus:ring-2 focus:ring-blue-accent/20 focus:border-blue-accent transition-all"
                  >
                    <option value="pendente">Pendente</option>
                    <option value="confirmado">Confirmado</option>
                    <option value="recusado">Não Comparecerá</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy/70 uppercase tracking-wider mb-2">
                    Mensagem (Opcional)
                  </label>
                  <textarea
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    placeholder="Mensagem deixada pelo convidado..."
                    rows="3"
                    className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4 py-3 text-navy text-sm focus:outline-none focus:ring-2 focus:ring-blue-accent/20 focus:border-blue-accent transition-all resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 text-navy font-semibold hover:bg-gray-50 transition-colors text-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-5 py-2.5 rounded-xl bg-navy hover:bg-navy/95 text-white font-semibold transition-all shadow-md active:scale-98 disabled:opacity-50 text-sm flex items-center space-x-1"
                  >
                    {actionLoading ? 'Salvando...' : 'Salvar Convidado'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: EDIT GUEST */}
        {isEditModalOpen && selectedGuest && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-100 animate-scale-up">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-lg text-navy">Editar Convidado</h3>
                <button 
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedGuest(null);
                  }}
                  className="p-1 rounded-lg text-navy/40 hover:text-navy hover:bg-gray-100 transition-all"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleEditGuest} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-navy/70 uppercase tracking-wider mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4 py-3 text-navy text-sm focus:outline-none focus:ring-2 focus:ring-blue-accent/20 focus:border-blue-accent transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-navy/70 uppercase tracking-wider mb-2">
                    Status de Confirmação
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4 py-3 text-navy text-sm focus:outline-none focus:ring-2 focus:ring-blue-accent/20 focus:border-blue-accent transition-all"
                  >
                    <option value="pendente">Pendente</option>
                    <option value="confirmado">Confirmado</option>
                    <option value="recusado">Não Comparecerá</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy/70 uppercase tracking-wider mb-2">
                    Mensagem dos Noivos
                  </label>
                  <textarea
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    rows="3"
                    className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4 py-3 text-navy text-sm focus:outline-none focus:ring-2 focus:ring-blue-accent/20 focus:border-blue-accent transition-all resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setSelectedGuest(null);
                    }}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 text-navy font-semibold hover:bg-gray-50 transition-colors text-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-5 py-2.5 rounded-xl bg-navy hover:bg-navy/95 text-white font-semibold transition-all shadow-md active:scale-98 disabled:opacity-50 text-sm flex items-center space-x-1"
                  >
                    {actionLoading ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: CONFIRM DELETE */}
        {isDeleteModalOpen && selectedGuest && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-gray-100 animate-scale-up">
              <div className="p-6 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 text-red-600 mb-4">
                  <AlertTriangle size={24} />
                </div>
                <h3 className="text-lg font-bold text-navy mb-2">Excluir Convidado?</h3>
                <p className="text-sm text-navy/60 mb-6">
                  Tem certeza que deseja remover <strong>{selectedGuest.nome}</strong> da lista? Essa ação não pode ser desfeita.
                </p>
                <div className="flex justify-center space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDeleteModalOpen(false);
                      setSelectedGuest(null);
                    }}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 text-navy font-semibold hover:bg-gray-50 transition-colors text-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDeleteGuest}
                    disabled={actionLoading}
                    className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-all shadow-md active:scale-98 disabled:opacity-50 text-sm"
                  >
                    {actionLoading ? 'Excluindo...' : 'Sim, Excluir'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
