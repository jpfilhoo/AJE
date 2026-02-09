
import React, { useState } from 'react';
import { Member } from '../types';
import { Search, Globe, Instagram, Linkedin, Phone, MapPin } from 'lucide-react';

interface MemberDirectoryProps {
  members: Member[];
}

const MemberDirectory: React.FC<MemberDirectoryProps> = ({ members }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = members.filter(m => 
    m.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Nossos Associados</h1>
          <p className="text-slate-500 mt-2">Conecte-se com empreendedores do Amazonas.</p>
        </div>
        
        <div className="relative max-w-sm w-full">
          <span className="absolute left-3 top-2.5 text-slate-400"><Search className="w-5 h-5" /></span>
          <input 
            type="text" 
            placeholder="Buscar por nome ou área..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-[#179939]/10 focus:border-[#179939] outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
          <p className="text-slate-400 text-lg">Nenhum associado encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(member => (
            <div key={member.id} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="h-16 w-16 rounded-xl border border-slate-100 overflow-hidden bg-slate-50 flex items-center justify-center p-1">
                    <img src={member.logo} alt={member.companyName} className="h-full w-full object-contain" />
                  </div>
                  <div className="flex gap-2">
                    {member.website && (
                      <a href={member.website} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-[#179939] hover:bg-[#179939]/10 transition-colors">
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2">{member.companyName}</h3>
                <p className="text-slate-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                  {member.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {member.socials.instagram && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-pink-50 text-pink-700">
                      <Instagram className="w-3 h-3" /> Instagram
                    </span>
                  )}
                  {member.socials.linkedin && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      <Linkedin className="w-3 h-3" /> LinkedIn
                    </span>
                  )}
                  {member.socials.whatsapp && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                      <Phone className="w-3 h-3" /> WhatsApp
                    </span>
                  )}
                </div>
              </div>
              
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Membro desde {new Date(member.createdAt).getFullYear()}
                </span>
                <button className="text-[#179939] text-sm font-semibold hover:text-[#179939]/80 flex items-center gap-1">
                  Ver Detalhes
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemberDirectory;
