
import React, { useState } from 'react';
import { Member, SocialLinks } from '../types';
import { validateCNPJ, formatCNPJ } from '../utils/validation';
import { Upload, Instagram, Linkedin, Phone, Globe, Info, CheckCircle2, AlertCircle, UserPlus } from 'lucide-react';

interface MemberFormProps {
  onSubmit: (member: Member) => void;
}

const MemberForm: React.FC<MemberFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    cnpj: '',
    description: '',
    website: '',
    instagram: '',
    linkedin: '',
    whatsapp: ''
  });
  const [logo, setLogo] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, logo: 'Logo deve ter no máximo 2MB' }));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
        setErrors(prev => {
          const n = { ...prev };
          delete n.logo;
          return n;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.companyName) newErrors.companyName = 'Nome da empresa é obrigatório';
    if (!validateCNPJ(formData.cnpj)) newErrors.cnpj = 'CNPJ inválido';
    if (!formData.description) newErrors.description = 'Breve descrição é obrigatória';
    if (!logo) newErrors.logo = 'Logotipo é obrigatório';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const member: Member = {
      id: Math.random().toString(36).substr(2, 9),
      companyName: formData.companyName,
      cnpj: formData.cnpj,
      description: formData.description,
      website: formData.website,
      logo: logo || '',
      socials: {
        instagram: formData.instagram,
        linkedin: formData.linkedin,
        whatsapp: formData.whatsapp
      },
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    onSubmit(member);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 bg-slate-50 border-b border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <UserPlus className="text-[#179939]" />
          Seja um Associado AJE Amazonas
        </h2>
        <p className="text-slate-500 mt-1">Fortaleça o empreendedorismo jovem na nossa região.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {/* Basic Info Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Informações da Empresa</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome da Empresa *</label>
              <input 
                type="text" 
                value={formData.companyName}
                onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 outline-none transition-all ${errors.companyName ? 'border-red-300 focus:ring-red-100' : 'border-slate-300 focus:ring-[#179939]/10 focus:border-[#179939]'}`}
                placeholder="Ex: Minha Empresa"
              />
              {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">CNPJ *</label>
              <input 
                type="text" 
                value={formData.cnpj}
                onChange={e => setFormData({ ...formData, cnpj: formatCNPJ(e.target.value) })}
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 outline-none transition-all ${errors.cnpj ? 'border-red-300 focus:ring-red-100' : 'border-slate-300 focus:ring-[#179939]/10 focus:border-[#179939]'}`}
                placeholder="00.000.000/0000-00"
              />
              {errors.cnpj && <p className="text-red-500 text-xs mt-1">{errors.cnpj}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descrição do Negócio *</label>
            <textarea 
              rows={3}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg border focus:ring-2 outline-none transition-all ${errors.description ? 'border-red-300 focus:ring-red-100' : 'border-slate-300 focus:ring-[#179939]/10 focus:border-[#179939]'}`}
              placeholder="O que sua empresa faz?"
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Logotipo *</label>
            <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-colors ${errors.logo ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-[#179939]'}`}>
              <div className="space-y-1 text-center">
                {logo ? (
                  <div className="relative inline-block">
                    <img src={logo} alt="Preview" className="h-32 w-32 object-contain rounded-md border" />
                    <button 
                      type="button"
                      onClick={() => setLogo(null)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-sm"
                    >
                      <AlertCircle className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto h-12 w-12 text-slate-400" />
                    <div className="flex text-sm text-slate-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-[#179939] hover:text-[#179939]/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#179939]">
                        <span>Carregar logotipo</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleLogoChange} />
                      </label>
                      <p className="pl-1">ou arraste e solte</p>
                    </div>
                    <p className="text-xs text-slate-500">PNG, JPG, GIF até 2MB</p>
                  </>
                )}
              </div>
            </div>
            {errors.logo && <p className="text-red-500 text-xs mt-1">{errors.logo}</p>}
          </div>
        </div>

        {/* Links Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Links e Redes Sociais</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400"><Globe className="w-4 h-4" /></span>
              <input 
                type="text" 
                value={formData.website}
                onChange={e => setFormData({ ...formData, website: e.target.value })}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#179939]/10 focus:border-[#179939] outline-none transition-all"
                placeholder="Website"
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400"><Instagram className="w-4 h-4" /></span>
              <input 
                type="text" 
                value={formData.instagram}
                onChange={e => setFormData({ ...formData, instagram: e.target.value })}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#179939]/10 focus:border-[#179939] outline-none transition-all"
                placeholder="Instagram"
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400"><Linkedin className="w-4 h-4" /></span>
              <input 
                type="text" 
                value={formData.linkedin}
                onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#179939]/10 focus:border-[#179939] outline-none transition-all"
                placeholder="LinkedIn"
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400"><Phone className="w-4 h-4" /></span>
              <input 
                type="text" 
                value={formData.whatsapp}
                onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#179939]/10 focus:border-[#179939] outline-none transition-all"
                placeholder="WhatsApp"
              />
            </div>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-[#179939] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#179939]/90 focus:ring-4 focus:ring-[#179939]/10 transition-all flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-5 h-5" />
          Enviar Cadastro
        </button>
      </form>
    </div>
  );
};

export default MemberForm;
