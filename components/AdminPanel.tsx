
import React, { useState } from 'react';
import { Member, MemberStatus, News } from '../types';
import { Check, X, ExternalLink, ShieldCheck, Filter, Users, Megaphone, Plus, Trash2, Calendar } from 'lucide-react';

interface AdminPanelProps {
  members: Member[];
  onUpdateStatus: (id: string, status: 'ACTIVE' | 'REJECTED' | 'PENDING') => void;
  news: News[];
  onAddNews: (news: News) => void;
  onDeleteNews: (id: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ members, onUpdateStatus, news, onAddNews, onDeleteNews }) => {
  const [activeTab, setActiveTab] = useState<'MEMBERS' | 'NEWS'>('MEMBERS');
  const [memberFilter, setMemberFilter] = useState<MemberStatus | 'ALL'>('PENDING');
  
  // News Form State
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [newNews, setNewNews] = useState({ title: '', content: '' });

  const filteredMembers = members.filter(m => memberFilter === 'ALL' ? true : m.status === memberFilter);

  const getStatusBadge = (status: MemberStatus) => {
    switch (status) {
      case 'PENDING': return <span className="px-2 py-1 bg-amber-50 text-amber-600 rounded-md text-xs font-bold border border-amber-200">PENDENTE</span>;
      case 'ACTIVE': return <span className="px-2 py-1 bg-green-50 text-green-600 rounded-md text-xs font-bold border border-green-200">ATIVO</span>;
      case 'REJECTED': return <span className="px-2 py-1 bg-red-50 text-red-600 rounded-md text-xs font-bold border border-red-200">REJEITADO</span>;
    }
  };

  const handleCreateNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNews.title || !newNews.content) return;
    
    onAddNews({
      id: Math.random().toString(36).substr(2, 9),
      title: newNews.title,
      content: newNews.content,
      createdAt: new Date().toISOString()
    });
    
    setNewNews({ title: '', content: '' });
    setShowNewsForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#179939] rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg shadow-[#179939]/20">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ShieldCheck className="w-8 h-8" />
            Gestão AJE Amazonas
          </h1>
          <p className="mt-2 text-white/80">Painel administrativo para controle total da plataforma.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center min-w-[120px] border border-white/20">
            <span className="block text-2xl font-bold">{members.filter(m => m.status === 'PENDING').length}</span>
            <span className="text-xs uppercase font-medium opacity-80">Pendentes</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center min-w-[120px] border border-white/20">
            <span className="block text-2xl font-bold">{news.length}</span>
            <span className="text-xs uppercase font-medium opacity-80">Informativos</span>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('MEMBERS')}
          className={`px-6 py-4 font-bold text-sm transition-all flex items-center gap-2 border-b-2 ${activeTab === 'MEMBERS' ? 'border-[#179939] text-[#179939]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          <Users className="w-4 h-4" />
          Aprovação de Membros
        </button>
        <button 
          onClick={() => setActiveTab('NEWS')}
          className={`px-6 py-4 font-bold text-sm transition-all flex items-center gap-2 border-b-2 ${activeTab === 'NEWS' ? 'border-[#179939] text-[#179939]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          <Megaphone className="w-4 h-4" />
          Módulo de Informativos
        </button>
      </div>

      {activeTab === 'MEMBERS' ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <Filter className="w-5 h-5 text-slate-400" />
            <div className="flex gap-2">
              {['ALL', 'PENDING', 'ACTIVE', 'REJECTED'].map(s => (
                <button 
                  key={s}
                  onClick={() => setMemberFilter(s as any)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${memberFilter === s ? 'bg-[#179939] text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                >
                  {s === 'ALL' ? 'Todos' : s === 'PENDING' ? 'Pendentes' : s === 'ACTIVE' ? 'Ativos' : 'Rejeitados'}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Empresa</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">CNPJ</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">Nenhum registro encontrado.</td>
                    </tr>
                  ) : (
                    filteredMembers.map(member => (
                      <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={member.logo} alt="" className="w-10 h-10 rounded-lg border object-contain bg-white" />
                            <div className="font-bold text-slate-900">{member.companyName}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{member.cnpj}</td>
                        <td className="px-6 py-4">{getStatusBadge(member.status)}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            {member.status === 'PENDING' ? (
                              <>
                                <button onClick={() => onUpdateStatus(member.id, 'ACTIVE')} className="p-2 text-[#179939] hover:bg-green-50 rounded-lg border border-transparent hover:border-green-100"><Check className="w-5 h-5" /></button>
                                <button onClick={() => onUpdateStatus(member.id, 'REJECTED')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100"><X className="w-5 h-5" /></button>
                              </>
                            ) : (
                              <button onClick={() => onUpdateStatus(member.id, 'PENDING')} className="text-xs font-bold text-[#179939] hover:underline">Revisar</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800">Informativos Publicados</h2>
            <button 
              onClick={() => setShowNewsForm(true)}
              className="bg-[#179939] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#179939]/90 shadow-lg shadow-[#179939]/10"
            >
              <Plus className="w-4 h-4" /> Novo Informativo
            </button>
          </div>

          {showNewsForm && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-6">
              <form onSubmit={handleCreateNews} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Título do Informativo</label>
                  <input 
                    type="text" 
                    value={newNews.title}
                    onChange={e => setNewNews({...newNews, title: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#179939]/10 focus:border-[#179939] outline-none"
                    placeholder="Ex: Novo benefício para associados"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Conteúdo</label>
                  <textarea 
                    rows={4}
                    value={newNews.content}
                    onChange={e => setNewNews({...newNews, content: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#179939]/10 focus:border-[#179939] outline-none"
                    placeholder="Descreva o comunicado em detalhes..."
                    required
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setShowNewsForm(false)} className="px-4 py-2 text-slate-500 font-bold hover:text-slate-700">Cancelar</button>
                  <button type="submit" className="bg-[#179939] text-white px-6 py-2 rounded-xl font-bold shadow-md">Publicar Agora</button>
                </div>
              </form>
            </div>
          )}

          <div className="grid gap-4">
            {news.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400">Nenhum informativo postado ainda.</div>
            ) : (
              news.map(item => (
                <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-2 uppercase">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">{item.title}</h3>
                    <p className="text-slate-600 text-sm mt-2 line-clamp-2">{item.content}</p>
                  </div>
                  <button 
                    onClick={() => onDeleteNews(item.id)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Excluir informativo"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
