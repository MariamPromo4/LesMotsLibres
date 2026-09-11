import React, { useState } from 'react';
import { EventItem, EventCategory } from '../types';
import { Calendar, Clock, MapPin, ArrowRight, Filter, Sparkles, Inbox } from 'lucide-react';

interface EventsListViewProps {
  events: EventItem[];
  onSelectEvent: (event: EventItem) => void;
}

export const EventsListView: React.FC<EventsListViewProps> = ({
  events,
  onSelectEvent
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'Tous les formats' },
    { id: 'atelier', label: 'Ateliers d’écriture' },
    { id: 'masterclass', label: 'Masterclasses' },
    { id: 'marathon', label: 'Marathons nocturnes' },
    { id: 'lecture', label: 'Scènes ouvertes' },
  ];

  const filteredEvents = events.filter((evt) => {
    if (selectedCategory === 'all') return true;
    return evt.category === selectedCategory;
  });

  return (
    <div className="space-y-12 pb-20">
      {/* Header section */}
      <section className="pt-12 pb-8 border-b border-[#E7E2DA] max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#994D2B]">
            Agenda public des rendez-vous
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#1C1917] font-normal tracking-tight">
            Ateliers, rencontres et soirées littéraires
          </h1>
          <p className="text-sm sm:text-base text-[#57534E] leading-relaxed">
            Chaque séance se déroule en comité restreint (10 à 18 participants maximum) pour garantir le confort d’écoute et la qualité des retours. Les inscriptions sont ouvertes à tous.
          </p>
        </div>

        {/* Category switcher */}
        <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-[#78716C] shrink-0 mr-1 hidden sm:inline" />
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#2E4036] text-[#FAF7F2] shadow-2xs font-semibold'
                  : 'bg-[#FAF7F2] text-[#57534E] hover:text-[#1C1917] border border-[#E7E2DA] hover:bg-[#F2ECE4]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Events List / Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredEvents.length === 0 ? (
          /* Empty State */
          <div className="p-12 text-center bg-[#FAF7F2] border border-[#E7E2DA] rounded-lg max-w-md mx-auto space-y-4 my-8">
            <div className="w-12 h-12 rounded-full bg-[#EAE2D7] text-[#78716C] flex items-center justify-center mx-auto">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl text-[#1C1917]">Aucun événement dans cette catégorie</h3>
            <p className="text-xs text-[#57534E] leading-relaxed">
              La programmation du trimestre suivant est en cours d'élaboration. Vous pouvez réinitialiser le filtre ou nous contacter pour toute demande d'atelier sur-mesure.
            </p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="px-4 py-2 bg-[#2E4036] text-[#FAF7F2] text-xs font-semibold rounded-md hover:bg-[#1E2D25] transition-colors"
            >
              Afficher tous les ateliers
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((evt) => {
              const spotsRemaining = evt.capacity - evt.registered_count;
              const isFull = spotsRemaining <= 0;

              return (
                <article
                  key={evt.id}
                  id={`event-card-${evt.id}`}
                  className="bg-[#FAF7F2] rounded-lg border border-[#E7E2DA] overflow-hidden flex flex-col justify-between hover:border-[#C5BCB0] transition-all hover:shadow-sm group"
                >
                  <div>
                    {/* Visual Banner */}
                    <div className="h-48 relative overflow-hidden bg-[#EAE2D7]">
                      <img
                        src={evt.image_url}
                        alt={evt.title}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 left-3 bg-[#FAF7F2]/95 backdrop-blur-xs px-2.5 py-1 rounded text-xs font-medium text-[#2E4036] shadow-2xs">
                        {evt.category === 'atelier' && 'Atelier d’écriture'}
                        {evt.category === 'masterclass' && 'Masterclass'}
                        {evt.category === 'marathon' && 'Marathon nocturne'}
                        {evt.category === 'lecture' && 'Scène ouverte'}
                      </div>

                      <div className="absolute bottom-3 right-3 bg-[#24211E]/85 text-[#FAF7F2] px-2.5 py-0.5 rounded text-[11px] font-mono backdrop-blur-xs">
                        {isFull ? 'Complet' : `${spotsRemaining} place${spotsRemaining > 1 ? 's' : ''} libre${spotsRemaining > 1 ? 's' : ''}`}
                      </div>
                    </div>

                    {/* Body Content */}
                    <div className="p-6 space-y-3">
                      {/* Date & Time */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-[#994D2B]">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{evt.formatted_date}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-[#78716C]">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{evt.start_time} - {evt.end_time}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h2 className="font-serif text-xl font-medium text-[#1C1917] leading-snug group-hover:text-[#994D2B] transition-colors">
                        {evt.title}
                      </h2>

                      {/* Short description */}
                      <p className="text-xs text-[#57534E] leading-relaxed line-clamp-3">
                        {evt.description}
                      </p>

                      {/* Location snippet */}
                      <div className="pt-2 flex items-start gap-1.5 text-xs text-[#78716C]">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-[#2E4036] mt-0.5" />
                        <span className="truncate">{evt.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer card */}
                  <div className="px-6 py-4 bg-[#F5EFE8]/70 border-t border-[#EAE2D7] flex items-center justify-between">
                    <div className="text-xs text-[#57534E]">
                      Par <span className="font-medium text-[#1C1917]">{evt.animator.name}</span>
                    </div>

                    <button
                      id={`event-btn-${evt.slug}`}
                      onClick={() => onSelectEvent(evt)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2E4036] group-hover:text-[#994D2B] transition-colors"
                    >
                      <span>Voir la fiche</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Information box at the bottom */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 bg-[#FAF7F2] rounded-lg border border-[#E7E2DA] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-serif text-lg text-[#1C1917]">Vous souhaitez proposer un thème d’atelier ?</h4>
            <p className="text-xs text-[#57534E]">
              Nous accueillons volontiers des propositions de partenariats, résidences d'écriture et cycles spécifiques pour les associations locales.
            </p>
          </div>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              window.location.hash = 'contact';
            }}
            className="text-xs font-semibold text-[#994D2B] hover:text-[#7F3F23] whitespace-nowrap"
          >
            Nous écrire →
          </a>
        </div>
      </section>
    </div>
  );
};
