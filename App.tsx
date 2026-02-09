
import React, { useState, useEffect } from 'react';
import { ViewType, Member, AuthState, UserRole, News } from './types';
import MemberDirectory from './components/MemberDirectory';
import MemberForm from './components/MemberForm';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import AssociateProfile from './components/AssociateProfile';
import NewsSection from './components/NewsSection';
import { LayoutDashboard, Users, UserPlus, Building2, LogIn, LogOut, User as UserIcon, Lock, Megaphone } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('LOGIN');
  const [members, setMembers] = useState<Member[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [auth, setAuth] = useState<AuthState>({
    role: 'GUEST',
    user: null,
    isAuthenticated: false
  });

  // Initial load
  useEffect(() => {
    try {
      // Members data
      const savedMembers = localStorage.getItem('aje_amazonas_members');
      if (savedMembers) {
        setMembers(JSON.parse(savedMembers));
      } else {
        const initialMembers: Member[] = [
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
        setMembers(initialMembers);
        localStorage.setItem('aje_amazonas_members', JSON.stringify(initialMembers));
      }

      // News data
      const savedNews = localStorage.getItem('aje_amazonas_news');
      if (savedNews) {
        setNews(JSON.parse(savedNews));
      } else {
        const initialNews: News[] = [
          {
            id: 'n1',
            title: 'Seja bem-vindo à nova plataforma AJE!',
            content: 'Lançamos nosso novo portal para facilitar a conexão entre jovens empreendedores do Amazonas. Explore o diretório e fique atento aos informativos.',
            createdAt: new Date().toISOString()
          }
        ];
        setNews(initialNews);
        localStorage.setItem('aje_amazonas_news', JSON.stringify(initialNews));
      }

      // Auth state
      const savedAuth = localStorage.getItem('aje_session');
      if (savedAuth) {
        const parsedAuth: AuthState = JSON.parse(savedAuth);
        setAuth(parsedAuth);
        if (parsedAuth.isAuthenticated) {
          setCurrentView(parsedAuth.role === 'ADMIN' ? 'ADMIN' : 'NEWS');
        }
      }
    } catch (e) {
      console.error("Error loading data", e);
    }
  }, []);

  const saveMembers = (newMembers: Member[]) => {
    setMembers(newMembers);
    localStorage.setItem('aje_amazonas_members', JSON.stringify(newMembers));
  };

  const saveNews = (newNews: News[]) => {
    setNews(newNews);
    localStorage.setItem('aje_amazonas_news', JSON.stringify(newNews));
  };

  const handleAddMember = (member: Member) => {
    const updated = [...members, member];
    saveMembers(updated);
    setCurrentView('LOGIN');
    alert('Cadastro enviado com sucesso! Aguarde a aprovação administrativa.');
  };

  const handleUpdateStatus = (id: string, status: 'ACTIVE' | 'REJECTED' | 'PENDING') => {
    const updated = members.map(m => m.id === id ? { ...m, status } : m);
    saveMembers(updated);
  };

  const handleAddNews = (item: News) => {
    const updated = [item, ...news];
    saveNews(updated);
  };

  const handleDeleteNews = (id: string) => {
    if (confirm('Deseja realmente excluir este informativo?')) {
      const updated = news.filter(n => n.id !== id);
      saveNews(updated);
    }
  };

  const handleLogin = (role: UserRole, user: Member | null) => {
    const newAuth: AuthState = { role, user, isAuthenticated: true };
    setAuth(newAuth);
    localStorage.setItem('aje_session', JSON.stringify(newAuth));
    setCurrentView(role === 'ADMIN' ? 'ADMIN' : 'NEWS');
  };

  const handleLogout = () => {
    const guestAuth: AuthState = { role: 'GUEST', user: null, isAuthenticated: false };
    setAuth(guestAuth);
    localStorage.removeItem('aje_session');
    setCurrentView('LOGIN');
  };

  // Middleware Logic
  const canAccess = (view: ViewType) => {
    if (view === 'LOGIN' || view === 'REGISTER') return true;
    if (!auth.isAuthenticated) return false;
    if (view === 'ADMIN' && auth.role !== 'ADMIN') return false;
    if (view === 'PROFILE' && auth.role !== 'ASSOCIATE') return false;
    return true;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => setCurrentView(auth.isAuthenticated ? (auth.role === 'ADMIN' ? 'ADMIN' : 'NEWS') : 'LOGIN')}>
            <Building2 className="w-8 h-8 text-[#179939]" />
            <span className="text-xl font-bold text-slate-900 tracking-tight hidden sm:inline">AJE <span className="text-[#179939]">Amazonas</span></span>
          </div>
          
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar ml-4">
            {auth.isAuthenticated && (
              <>
                <button 
                  onClick={() => setCurrentView('NEWS')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${currentView === 'NEWS' ? 'bg-[#179939]/10 text-[#179939]' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  <Megaphone className="w-4 h-4" />
                  <span className="hidden lg:inline">Informativos</span>
                </button>
                <button 
                  onClick={() => setCurrentView('DIRECTORY')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${currentView === 'DIRECTORY' ? 'bg-[#179939]/10 text-[#179939]' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  <Users className="w-4 h-4" />
                  <span className="hidden lg:inline">Diretório</span>
                </button>
              </>
            )}
            
            {!auth.isAuthenticated && currentView !== 'REGISTER' && (
              <button 
                onClick={() => setCurrentView('REGISTER')}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-100 whitespace-nowrap"
              >
                <UserPlus className="w-4 h-4" />
                <span>Associar-se</span>
              </button>
            )}

            {auth.role === 'ADMIN' && (
              <button 
                onClick={() => setCurrentView('ADMIN')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${currentView === 'ADMIN' ? 'bg-[#179939]/10 text-[#179939]' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden lg:inline">Administração</span>
              </button>
            )}

            {auth.role === 'ASSOCIATE' && (
              <button 
                onClick={() => setCurrentView('PROFILE')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${currentView === 'PROFILE' ? 'bg-[#179939]/10 text-[#179939]' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                <UserIcon className="w-4 h-4" />
                <span className="hidden lg:inline">Meu Perfil</span>
              </button>
            )}

            <div className="w-px h-6 bg-slate-200 mx-1 shrink-0"></div>

            {!auth.isAuthenticated ? (
              <button 
                onClick={() => setCurrentView('LOGIN')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${currentView === 'LOGIN' ? 'bg-[#179939] text-white' : 'bg-slate-100 text-[#179939]'}`}
              >
                <LogIn className="w-4 h-4" />
                <span>Entrar</span>
              </button>
            ) : (
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-all whitespace-nowrap"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {!canAccess(currentView) ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-lg mx-auto">
              <Lock className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-slate-800">Acesso Restrito</h2>
              <p className="text-slate-500 mt-2">Você precisa estar logado para acessar esta área.</p>
              <button onClick={() => setCurrentView('LOGIN')} className="mt-6 px-6 py-2 bg-[#179939] text-white rounded-xl font-bold hover:bg-[#179939]/90 transition-all shadow-lg shadow-[#179939]/20">Fazer Login Agora</button>
          </div>
        ) : (
          <>
            {currentView === 'LOGIN' && <Login members={members} onLogin={handleLogin} />}
            {currentView === 'REGISTER' && <MemberForm onSubmit={handleAddMember} />}
            {currentView === 'NEWS' && <NewsSection news={news} />}
            {currentView === 'DIRECTORY' && <MemberDirectory members={members.filter(m => m.status === 'ACTIVE')} />}
            {currentView === 'ADMIN' && <AdminPanel members={members} onUpdateStatus={handleUpdateStatus} news={news} onAddNews={handleAddNews} onDeleteNews={handleDeleteNews} />}
            {currentView === 'PROFILE' && auth.user && <AssociateProfile member={auth.user} />}
          </>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} AJE Amazonas - Associação de Jovens Empreendedores.</p>
      </footer>
    </div>
  );
};

export default App;
