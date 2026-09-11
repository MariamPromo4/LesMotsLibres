import React, { useState, useEffect } from 'react';
import { Writing, WritingCategory, ActivePage } from '../../types';
import { fetchPublicWritings } from '../../lib/supabase';
import { BookOpen, Calendar, ArrowRight, RefreshCw, Feather } from 'lucide-react';

interface WritingsListViewProps {
  onSelectWriting: (writing: Writing) => void;
  onNavigate: (page: ActivePage) => void;
}

export const WritingsListView: React.FC<WritingsListViewProps> = ({
  onSelectWriting,
  onNavigate
}) => {
  const [writings, setWritings] = useState<Writing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadWritings();
  }, []);

  const loadWritings = async () => {
    setIsLoading(true);
    const data = await fetchPublicWritings();
    setWritings(data);
    setIsLoading(false);
  };

  const categories = ['all', 'Nouvelle', 'Poésie', 'Récit', 'Autre'];

  const filteredWritings = selectedCategory === 'all'
    ? writings
    : writings.filter((w) => w.category === selectedCategory);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* En-tête éditoriale */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE2D7] text-[#2E4036] text-xs font-semibold tracking-wide">
          <Feather className="w-3.5 h-3.5 text-[#994D2B]" />
          <span>Publications des membres • Les Mots Libres</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl text-[#1C1917] font-normal tracking-tight">
          Les écrits de l'atelier
        </h1>

        <p className="text-base text-[#57534E] leading-relaxed">
          Découvrez les textes nés au fil des séances d'écriture, des marathons nocturnes et des élans solitaires des adhérents. Nouvelles, poèmes et fragments partagés en toute liberté.
        </p>
      </div>

      {/* Filtres de catégories */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E7E2DA] pb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
              selectedCategory === cat
                ? 'bg-[#2E4036] text-[#FAF7F2]'
                : 'bg-[#FAF7F2] text-[#57534E] hover:bg-[#EAE2D7] border border-[#E7E2DA]'
            }`}
          >
            {cat === 'all' ? 'Tous les écrits' : cat}
          </button>
        ))}
      </div>

      {/* Contenu */}
      {isLoading ? (
        <div className="py-20 text-center text-xs text-[#78716C] flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-[#2E4036]" />
          <span>Chargement des publications...</span>
        </div>
      ) : filteredWritings.length === 0 ? (
        <div className="bg-[#FAF7F2] border border-[#E7E2DA] rounded-xl p-12 text-center space-y-3 max-w-lg mx-auto">
          <BookOpen className="w-8 h-8 text-[#994D2B] mx-auto opacity-75" />
          <h3 className="font-serif text-lg text-[#1C1917]">Aucun écrit pour le moment</h3>
          <p className="text-xs text-[#57534E]">
            {selectedCategory === 'all'
              ? "Les adhérents n'ont pas encore publié de textes. Rejoignez un atelier pour partager vos premiers mots."
              : `Aucun texte dans la catégorie « ${selectedCategory} ».`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWritings.map((writing) => {
            const formattedDate = new Date(writing.created_at).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            });
            const authorName = writing.author
              ? `${writing.author.first_name || ''} ${writing.author.last_name || ''}`.trim() || 'Auteur anonyme'
              : 'Membre';

            return (
              <article
                key={writing.id}
                className="bg-[#FAF7F2] p-6 rounded-xl border border-[#E7E2DA] flex flex-col justify-between hover:border-[#C5BCB0] transition-all hover:shadow-xs group space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#78716C]">
                    <span className="px-2 py-0.5 rounded bg-[#EAE2D7] text-[#2E4036] font-medium text-[11px]">
                      {writing.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#994D2B]" />
                      <span>{formattedDate}</span>
                    </div>
                  </div>

                  <h2 className="font-serif text-xl text-[#1C1917] font-medium leading-snug group-hover:text-[#994D2B] transition-colors">
                    {writing.title}
                  </h2>

                  <p className="text-xs text-[#57534E] leading-relaxed line-clamp-4 font-serif italic">
                    « {writing.content} »
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EAE2D7] flex items-center justify-between">
                  <div className="text-xs text-[#78716C]">
                    Par <span className="font-medium text-[#1C1917]">{authorName}</span>
                  </div>

                  <button
                    onClick={() => onSelectWriting(writing)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#2E4036] hover:text-[#994D2B] transition-colors"
                  >
                    <span>Lire</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
