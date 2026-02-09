
import React, { useState } from 'react';
import { UserRole, Member } from '../types';
import { Lock, User, Building2, AlertCircle, ArrowRight } from 'lucide-react';

interface LoginProps {
  members: Member[];
  onLogin: (role: UserRole, user: Member | null) => void;
}

const Login: React.FC<LoginProps> = ({ members, onLogin }) => {
  const [loginType, setLoginType] = useState<'ADMIN' | 'ASSOCIATE'>('ADMIN');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (loginType === 'ADMIN') {
      if (username === 'admin' && password === '123') {
        onLogin('ADMIN', null);
      } else {
        setError('Usuário ou senha administrativo incorretos.');
      }
    } else {
      // For MVP, associate login is CNPJ (username) and 123 (fixed password)
      const foundMember = members.find(m => m.cnpj.replace(/\D/g, '') === username.replace(/\D/g, ''));
      if (foundMember && password === '123') {
        if (foundMember.status !== 'ACTIVE') {
          setError('Seu cadastro ainda não foi aprovado ou está inativo.');
          return;
        }
        onLogin('ASSOCIATE', foundMember);
      } else {
        setError('CNPJ não encontrado ou senha incorreta.');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-[#179939] p-8 text-center text-white">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4 backdrop-blur-sm">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold">Acesso Restrito</h2>
          <p className="text-white/80 text-sm mt-1">Entre para gerenciar seus dados ou a associação</p>
        </div>

        <div className="p-8">
          <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
            <button 
              onClick={() => { setLoginType('ADMIN'); setError(''); }}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${loginType === 'ADMIN' ? 'bg-white text-[#179939] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Administrador
            </button>
            <button 
              onClick={() => { setLoginType('ASSOCIATE'); setError(''); }}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${loginType === 'ASSOCIATE' ? 'bg-white text-[#179939] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Associado
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                {loginType === 'ADMIN' ? 'Usuário' : 'CNPJ do Associado'}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-slate-400">
                  {loginType === 'ADMIN' ? <User className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                </span>
                <input 
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder={loginType === 'ADMIN' ? 'Ex: admin' : '00.000.000/0000-00'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#179939]/10 focus:border-[#179939] outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Senha</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input 
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#179939]/10 focus:border-[#179939] outline-none transition-all"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-medium animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-[#179939] text-white font-bold py-3 px-4 rounded-xl hover:bg-[#179939]/90 focus:ring-4 focus:ring-[#179939]/10 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#179939]/20"
            >
              Entrar
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-400 text-xs">
              Esqueceu sua senha? Entre em contato com a secretaria da AJE Amazonas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
