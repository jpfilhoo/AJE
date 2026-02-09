
import React from 'react';
import { News } from '../types';
import { Megaphone, Calendar, ChevronRight } from 'lucide-react';

interface NewsSectionProps {
  news: News[];
}

const NewsSection: React.FC<NewsSectionProps> = ({ news }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <Megaphone className="text-[#179939] w-8 h-8" />
            Informativos AJE
          </h1>
          <p className="text-slate-500 mt-2">Fique por dentro das últimas notícias e comunicados da associação.</p>
        </div>
      </div>

      {news.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
          <p className="text-slate-400 text-lg">Nenhum informativo publicado no momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {[...news].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(item => (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2 text-xs font-bold text-[#179939] uppercase tracking-wider mb-3">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(item.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {item.content}
                </p>
              </div>
              <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button className="text-[#179939] text-sm font-bold flex items-center gap-1 hover:underline">
                  Marcar como lido <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsSection;
