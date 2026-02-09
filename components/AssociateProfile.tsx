
import React from 'react';
import { Member } from '../types';
import { Building2, Globe, Instagram, Linkedin, Phone, Calendar, ShieldCheck, Mail } from 'lucide-react';

interface AssociateProfileProps {
  member: Member;
}

const AssociateProfile: React.FC<AssociateProfileProps> = ({ member }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-[#179939] to-emerald-600"></div>
        <div className="px-8 pb-8">
          <div className="relative flex flex-col md:flex-row items-center md:items-end gap-6 -mt-12">
            <div className="w-32 h-32 bg-white rounded-2xl shadow-lg border-4 border-white overflow-hidden p-2 flex items-center justify-center">
              <img src={member.logo} alt={member.companyName} className="w-full h-full object-contain" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-extrabold text-slate-900">{member.companyName}</h1>
              <p className="text-[#179939] font-medium flex items-center justify-center md:justify-start gap-1">
                <ShieldCheck className="w-4 h-4" /> Associado Ativo
              </p>
            </div>
            <button className="px-6 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors text-sm">
              Editar Perfil
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-slate-400" /> Sobre o Negócio
                </h3>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-2xl">
                  {member.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="p-4 bg-white border border-slate-100 rounded-2xl">
                    <span className="text-xs text-slate-400 uppercase font-bold block mb-1">CNPJ</span>
                    <span className="text-slate-900 font-medium">{member.cnpj}</span>
                 </div>
                 <div className="p-4 bg-white border border-slate-100 rounded-2xl">
                    <span className="text-xs text-slate-400 uppercase font-bold block mb-1">Membro desde</span>
                    <span className="text-slate-900 font-medium flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-[#179939]" />
                      {new Date(member.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                 </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Globe className="w-5 h-5 text-slate-400" /> Presença Digital
              </h3>
              <div className="space-y-3">
                {member.website && (
                  <a href={member.website} target="_blank" className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 transition-colors group">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-slate-400 group-hover:text-[#179939]">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-bold block">Website</span>
                      <span className="text-sm font-medium text-slate-700 truncate block max-w-[150px]">{member.website.replace('https://', '')}</span>
                    </div>
                  </a>
                )}
                {member.socials.instagram && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-pink-500">
                      <Instagram className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-bold block">Instagram</span>
                      <span className="text-sm font-medium text-slate-700">{member.socials.instagram}</span>
                    </div>
                  </div>
                )}
                {member.socials.whatsapp && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-green-600">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-bold block">WhatsApp</span>
                      <span className="text-sm font-medium text-slate-700">{member.socials.whatsapp}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssociateProfile;
