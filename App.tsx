
import React, { useState, useEffect } from 'react';
import { ViewType, Member, AuthState, UserRole } from './types';
import MemberDirectory from './components/MemberDirectory';
import MemberForm from './components/MemberForm';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import AssociateProfile from './components/AssociateProfile';
import { LayoutDashboard, Users, UserPlus, Building2, LogIn, LogOut, User as UserIcon } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('DIRECTORY');
  const [members, setMembers] = useState<Member[]>([]);
  const [auth, setAuth] = useState<AuthState>({
    role: 'GUEST',
    user: null,
    isAuthenticated: false
  });

  // Load members from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('aje_amazonas_members');
    if (saved) {
      try {
        setMembers(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse members", e);
      }
    } else {
      const initial: Member[] = [
        {
          id: '1',
          companyName: 'AJE Amazonas',
          cnpj: '00.000.000/0000-00',
          logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3v5K8D0-4m-w0pW9n-N9wH8t-5s8_Xq1_5A&s',
          description: 'Associação de Jovens Empreendedores do Amazonas.',
          website: 'https://ajeamazonas.com.br',
          socials: { instagram: '@ajeamazonas', linkedin: 'aje-amazonas' },
          status: 'ACTIVE',
          createdAt: new Date().toISOString()
        }
      ];
      setMembers(initial);
      localStorage.setItem('aje_amazonas_members', JSON.stringify(initial));
    }

    // Check session
    const savedAuth = localStorage.getItem('aje_session');
    if (savedAuth) {
      setAuth(JSON.parse(savedAuth));
    }
  }, []);

  const saveMembers = (newMembers: Member[]) => {
    setMembers(newMembers);
    localStorage.setItem('aje_amazonas_members', JSON.stringify(newMembers));
  };

  const handleAddMember = (member: Member) => {
    const updated = [...members, member];
    saveMembers(updated);
    setCurrentView('DIRECTORY');
    alert('Cadastro enviado com sucesso! Aguarde a aprovação do administrador.');
  };

  const handleUpdateStatus = (id: string, status: 'ACTIVE' | 'REJECTED') => {
    const updated = members.map(m => m.id === id ? { ...m, status } : m);
    saveMembers(updated);
  };

  const handleLogin = (role: UserRole, user: Member | null) => {
    const newAuth: AuthState = { role, user, isAuthenticated: true };
    setAuth(newAuth);
    localStorage.setItem('aje_session', JSON.stringify(newAuth));
    
    if (role === 'ADMIN') {
      setCurrentView('ADMIN');
    } else {
      setCurrentView('PROFILE');
    }
  };

  const handleLogout = () => {
    const guestAuth: AuthState = { role: 'GUEST', user: null, isAuthenticated: false };
    setAuth(guestAuth);
    localStorage.removeItem('aje_session');
    setCurrentView('DIRECTORY');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => setCurrentView('DIRECTORY')}>
            <Building2 className="w-8 h-8 text-[#179939]" />
            <span className="text-xl font-bold text-slate-900 tracking-tight hidden xs:inline">AJE <span className="text-[#179939]">Amazonas</span></span>
          </div>
          
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setCurrentView('DIRECTORY')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentView === 'DIRECTORY' ? 'bg-[#179939]/10 text-[#179939]' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <Users className="w-4 h-4" />
              <span className="hidden lg:inline">Diretório</span>
            </button>
            
            {auth.role === 'GUEST' && (
              <button 
                onClick={() => setCurrentView('REGISTER')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentView === 'REGISTER' ? 'bg-[#179939]/10 text-[#179939]' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden lg:inline">Associar-se</span>
              </button>
            )}

            {auth.role === 'ADMIN' && (
              <button 
                onClick={() => setCurrentView('ADMIN')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentView === 'ADMIN' ? 'bg-[#179939]/10 text-[#179939]' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden lg:inline">Administração</span>
              </button>
            )}

            {auth.role === 'ASSOCIATE' && (
              <button 
                onClick={() => setCurrentView('PROFILE')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentView === 'PROFILE' ? 'bg-[#179939]/10 text-[#179939]' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                <UserIcon className="w-4 h-4" />
                <span className="hidden lg:inline">Meu Perfil</span>
              </button>
            )}

            <div className="w-px h-6 bg-slate-200 mx-1"></div>

            {!auth.isAuthenticated ? (
              <button 
                onClick={() => setCurrentView('LOGIN')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${currentView === 'LOGIN' ? 'bg-[#179939] text-white' : 'bg-slate-100 text-[#179939] hover:bg-[#179939]/10'}`}
              >
                <LogIn className="w-4 h-4" />
                <span>Entrar</span>
              </button>
            ) : (
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'DIRECTORY' && (
          <MemberDirectory members={members.filter(m => m.status === 'ACTIVE')} />
        )}
        {currentView === 'REGISTER' && (
          <MemberForm onSubmit={handleAddMember} />
        )}
        {currentView === 'LOGIN' && (
          <Login members={members} onLogin={handleLogin} />
        )}
        {currentView === 'ADMIN' && auth.role === 'ADMIN' && (
          <AdminPanel members={members} onUpdateStatus={handleUpdateStatus} />
        )}
        {currentView === 'PROFILE' && auth.role === 'ASSOCIATE' && auth.user && (
          <AssociateProfile member={auth.user} />
        )}
        
        {/* Security check for protected views */}
        {(currentView === 'ADMIN' && auth.role !== 'ADMIN') || (currentView === 'PROFILE' && auth.role !== 'ASSOCIATE') ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
                <Lock className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-slate-800">Acesso Negado</h2>
                <p className="text-slate-500 mt-2">Você não tem permissão para acessar esta área.</p>
                <button onClick={() => setCurrentView('LOGIN')} className="mt-6 text-[#179939] font-bold underline">Fazer Login</button>
            </div>
        ) : null}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} AJE Amazonas - Associação de Jovens Empreendedores. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default App;
