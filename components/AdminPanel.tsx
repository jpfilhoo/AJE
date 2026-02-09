
import React, { useState } from 'react';
import { Member, MemberStatus } from '../types';
import { Check, X, Clock, ExternalLink, ShieldCheck, Filter } from 'lucide-react';

interface AdminPanelProps {
  members: Member[];
  onUpdateStatus: (id: string, status: 'ACTIVE' | 'REJECTED') => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ members, onUpdateStatus }) => {
  const [filter, setFilter] = useState<MemberStatus | 'ALL'>('PENDING');

  const filtered = members.filter(m => filter === 'ALL' ? true : m.status === filter);

  const getStatusBadge = (status: MemberStatus) => {
    switch (status) {
      case 'PENDING': return <span className="px-2 py-1 bg-amber-50 text-amber-600 rounded-md text-xs font-bold border border-amber-200">PENDENTE</span>;
      case 'ACTIVE': return <span className="px-2 py-1 bg-green-50 text-green-600 rounded-md text-xs font-bold border border-green-200">ATIVO</span>;
      case 'REJECTED': return <span className="px-2 py-1 bg-red-50 text-red-600 rounded-md text-xs font-bold border border-red-200">REJEITADO</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#179939] rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ShieldCheck className="w-8 h-8" />
            Gestão AJE
          </h1>
          <p className="mt-2 text-white/80">Painel administrativo para controle e moderação de membros.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center min-w-[120px]">
            <span className="block text-2xl font-bold">{members.filter(m => m.status === 'PENDING').length}</span>
            <span className="text-xs uppercase font-medium opacity-80">Pendentes</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center min-w-[120px]">
            <span className="block text-2xl font-bold">{members.filter(m => m.status === 'ACTIVE').length}</span>
            <span className="text-xs uppercase font-medium opacity-80">Ativos</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <Filter className="w-5 h-5 text-slate-400" />
        <div className="flex gap-2">
          {['ALL', 'PENDING', 'ACTIVE', 'REJECTED'].map(s => (
            <button 
              key={s}
              onClick={() => setFilter(s as any)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${filter === s ? 'bg-[#179939] text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
            >
              {s === 'ALL' ? 'Todos' : s === 'PENDING' ? 'Pendentes' : s === 'ACTIVE' ? 'Ativos' : 'Rejeitados'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Empresa</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">CNPJ</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Data</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">Nenhum registro encontrado.</td>
                </tr>
              ) : (
                filtered.map(member => (
                  <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={member.logo} alt="" className="w-10 h-10 rounded-lg border object-contain bg-white" />
                        <div>
                          <div className="font-bold text-slate-900">{member.companyName}</div>
                          <div className="text-xs text-slate-500">
                            {member.website && (
                              <a href={member.website} target="_blank" className="hover:text-[#179939] flex items-center gap-1">
                                {member.website} <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{member.cnpj}</td>
                    <td className="px-6 py-4">{getStatusBadge(member.status)}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{new Date(member.createdAt).toLocaleDateString('pt-BR')}</td>
                    <td className="px-6 py-4 text-right">
                      {member.status === 'PENDING' && (
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => onUpdateStatus(member.id, 'ACTIVE')}
                            className="p-2 text-[#179939] hover:bg-[#179939]/10 rounded-lg transition-colors"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => onUpdateStatus(member.id, 'REJECTED')}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                      {member.status !== 'PENDING' && (
                        <button 
                          onClick={() => onUpdateStatus(member.id, 'PENDING')}
                          className="text-xs font-semibold text-[#179939] hover:underline"
                        >
                          Revisar
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
