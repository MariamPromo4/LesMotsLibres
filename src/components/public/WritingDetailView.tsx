import React from 'react';
import { Writing, ActivePage } from '../../types';
import { ArrowLeft, Calendar, Tag, User, BookOpen, Share2 } from 'lucide-react';

interface WritingDetailViewProps {
  writing: Writing | null;
  onBack: () => void;
  onNavigate: (page: ActivePage) => void;
}

export const WritingDetailView: React.FC<WritingDetailViewProps> = ({
  writing,
  onBack,
  onNavigate
}) => {
  if (!writing) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl text-[#1C1917]">Écrit introuvable</h2>
        <p className="text-sm text-[#57534E]">
          Le texte demandé n'existe pas ou n'est plus disponible.
        </p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#2E4036] text-[#FAF7F2] rounded-md text-xs font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux écrits</span>
        </button>
      </div>
    );
  }

  const formattedDate = new Date(writing.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const authorDisplayName = writing.author
    ? `${writing.author.first_name || ''} ${writing.author.last_name || ''}`.trim() || 'Auteur anonyme'
    : 'Membre des Mots Libres';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-10">
      {/* Navigation retour */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#57534E] hover:text-[#2E4036] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux publications</span>
        </button>
      </div>

      {/* Entête éditoriale */}
      <header className="space-y-4 pb-8 border-b border-[#E7E2DA]">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-[#EAE2D7] text-[#2E4036]">
            {writing.category}
          </span>
          <span className="text-xs text-[#78716C] flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#994D2B]" />
            <span>Publié le {formattedDate}</span>
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl text-[#1C1917] font-normal tracking-tight leading-tight">
          {writing.title}
        </h1>

        <div className="flex items-center gap-3 pt-2">
          <div className="w-9 h-9 rounded-full bg-[#2E4036] text-[#FAF7F2] flex items-center justify-center font-serif text-sm font-medium">
            {writing.author?.first_name?.[0] || 'A'}
          </div>
          <div>
            <div className="text-sm font-medium text-[#1C1917]">
              {authorDisplayName}
            </div>
            <div className="text-xs text-[#78716C]">
              Membre de l'atelier d'écriture
            </div>
          </div>
        </div>
      </header>

      {/* Corps du texte - Présentation éditoriale raffinée pour la lecture */}
      <article className="prose prose-stone max-w-none text-[#292524] font-serif text-lg sm:text-xl leading-relaxed whitespace-pre-wrap selection:bg-[#EAE2D7]">
        {writing.content}
      </article>

      {/* Pied de page de l'article */}
      <footer className="pt-10 border-t border-[#E7E2DA] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#78716C]">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#994D2B]" />
          <span>Publication des adhérents • Les Mots Libres</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('writings')}
            className="px-4 py-2 border border-[#D5CABE] text-[#1C1917] hover:bg-[#EAE2D7] rounded-md transition-colors"
          >
            Découvrir tous les écrits
          </button>
          <button
            onClick={() => onNavigate('events')}
            className="px-4 py-2 bg-[#2E4036] text-[#FAF7F2] hover:bg-[#1E2D25] rounded-md font-medium transition-colors"
          >
            Participer à un atelier
          </button>
        </div>
      </footer>
    </div>
  );
};
