import React, { useState } from 'react';
import { EventItem, Profile } from '../types';
import { ArrowLeft, Calendar, Clock, MapPin, Users, CheckCircle, AlertCircle, Share2, Sparkles, BookOpen } from 'lucide-react';

interface EventDetailViewProps {
  event: EventItem;
  onBack: () => void;
  onRegisterClick: (event: EventItem) => void;
  currentUser: Profile | null;
  isRegistered?: boolean;
}

export const EventDetailView: React.FC<EventDetailViewProps> = ({
  event,
  onBack,
  onRegisterClick,
  currentUser,
  isRegistered = false
}) => {
  const [copied, setCopied] = useState(false);
  const spotsRemaining = event.capacity - event.registered_count;
  const isFull = spotsRemaining <= 0;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="space-y-12 pb-24">
      {/* 1. Breadcrumb navigation */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <button
          id="back-to-events-btn"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#57534E] hover:text-[#1C1917] bg-[#FAF7F2] px-3.5 py-1.5 rounded border border-[#E7E2DA] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Retour à l'agenda complet</span>
        </button>
      </div>

      {/* 2. Hero Header of the event */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 bg-[#EAE2D7] text-[#2E4036] rounded-full text-xs font-semibold uppercase tracking-wide">
              {event.category === 'atelier' && 'Atelier d’écriture'}
              {event.category === 'masterclass' && 'Masterclass d’auteur'}
              {event.category === 'marathon' && 'Marathon littéraire'}
              {event.category === 'lecture' && 'Scène ouverte & lecture'}
            </span>
            <span className="text-xs font-mono text-[#78716C]">
              Réf : {event.slug}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1C1917] font-normal leading-[1.18] tracking-tight">
            {event.title}
          </h1>

          {event.subtitle && (
            <p className="font-serif text-xl sm:text-2xl text-[#994D2B] font-normal italic">
              {event.subtitle}
            </p>
          )}

          <p className="text-sm sm:text-base text-[#57534E] leading-relaxed pt-1">
            {event.description}
          </p>
        </div>
      </section>

      {/* 3. Main layout: 2 columns (Content & Side Booking Panel) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main content column (8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Visual banner */}
            <div className="rounded-xl overflow-hidden border border-[#E7E2DA] bg-[#EAE2D7] aspect-video sm:aspect-21/9 max-h-96">
              <img
                src={event.image_url}
                alt={event.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Detailed Description */}
            <div className="bg-[#FAF7F2] p-8 sm:p-10 rounded-xl border border-[#E7E2DA] space-y-6">
              <h2 className="font-serif text-2xl text-[#1C1917] font-medium border-b border-[#EAE2D7] pb-3">
                Déroulement et intentions de la séance
              </h2>

              <div className="prose text-sm text-[#44403C] leading-relaxed whitespace-pre-line space-y-4">
                {event.full_description}
              </div>
            </div>

            {/* Practical information: Prerequisites & Materials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-[#FAF7F2] p-6 rounded-lg border border-[#E7E2DA] space-y-2.5">
                <h3 className="font-serif text-lg font-medium text-[#1C1917]">Prérequis</h3>
                <p className="text-xs text-[#57534E] leading-relaxed">
                  {event.prerequisites || 'Aucun prérequis. Ouvert à toutes et tous, sans condition de niveau.'}
                </p>
              </div>

              <div className="bg-[#FAF7F2] p-6 rounded-lg border border-[#E7E2DA] space-y-2.5">
                <h3 className="font-serif text-lg font-medium text-[#1C1917]">Matériel suggéré</h3>
                <ul className="text-xs text-[#57534E] space-y-1.5 list-disc list-inside">
                  {event.materials && event.materials.length > 0 ? (
                    event.materials.map((mat, idx) => (
                      <li key={idx}>{mat}</li>
                    ))
                  ) : (
                    <li>Votre carnet habituel et un stylo agréable à manier.</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Animator Bio */}
            <div className="bg-[#F5EFE8] p-6 sm:p-8 rounded-xl border border-[#D5CABE] space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#994D2B]">
                Animation de la séance
              </span>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#2E4036] text-[#FAF7F2] flex items-center justify-center font-serif text-lg font-bold shrink-0">
                  {event.animator.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-serif text-lg font-semibold text-[#1C1917]">
                    {event.animator.name}
                  </h4>
                  <p className="text-xs text-[#994D2B] font-medium">
                    {event.animator.role}
                  </p>
                </div>
              </div>
              <p className="text-xs text-[#57534E] leading-relaxed pt-1">
                {event.animator.bio}
              </p>
            </div>

          </div>

          {/* Sticky Side Booking Panel (4 cols) */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 bg-[#FAF7F2] p-6 sm:p-7 rounded-xl border border-[#D5CABE] shadow-xs space-y-6">
              
              {/* Date, Time, Location summary */}
              <div className="space-y-4 border-b border-[#EAE2D7] pb-5">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-[#994D2B] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#78716C]">Date</div>
                    <div className="text-sm font-medium text-[#1C1917]">{event.formatted_date}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#994D2B] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#78716C]">Horaires</div>
                    <div className="text-sm font-medium text-[#1C1917]">{event.start_time} - {event.end_time}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#994D2B] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#78716C]">Lieu</div>
                    <div className="text-sm font-medium text-[#1C1917]">{event.location}</div>
                    <div className="text-xs text-[#78716C] mt-0.5">{event.address}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-[#994D2B] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#78716C]">Capacité d'accueil</div>
                    <div className="text-sm font-medium text-[#1C1917]">
                      {event.registered_count} inscrits sur {event.capacity} places
                    </div>
                    <div className="text-xs text-[#78716C] mt-0.5 font-mono">
                      {isFull ? (
                        <span className="text-[#B91C1C] font-semibold">Atelier complet</span>
                      ) : (
                        <span className="text-[#2E4036] font-semibold">{spotsRemaining} place{spotsRemaining > 1 ? 's' : ''} disponible{spotsRemaining > 1 ? 's' : ''}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing detail */}
              {event.price && (
                <div className="bg-[#F5EFE8] p-3 rounded-md text-xs text-[#57534E] space-y-1">
                  <span className="font-semibold text-[#1C1917]">Tarifs de la séance :</span>
                  <p>{event.price}</p>
                </div>
              )}

              {/* Action Button: Inscription */}
              <div className="space-y-3">
                {isRegistered ? (
                  <div className="p-3 bg-[#E8F0EC] border border-[#C5D9CE] rounded-md text-xs text-[#2E4036] flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0 text-[#2E4036]" />
                    <span>Vous êtes pré-inscrit(e) à cet atelier.</span>
                  </div>
                ) : (
                  <button
                    id="register-cta-btn"
                    disabled={isFull}
                    onClick={() => onRegisterClick(event)}
                    className={`w-full py-3 px-4 rounded-md text-sm font-semibold transition-all shadow-xs flex items-center justify-center gap-2 ${
                      isFull
                        ? 'bg-[#E7E2DA] text-[#78716C] cursor-not-allowed'
                        : 'bg-[#2E4036] hover:bg-[#1E2D25] text-[#FAF7F2]'
                    }`}
                  >
                    <span>{isFull ? 'Atelier complet (liste d’attente)' : 'S’inscrire à cet atelier'}</span>
                  </button>
                )}

                <p className="text-[11px] text-[#78716C] text-center leading-relaxed">
                  Étape 1 : Inscription préparatoire. Vos informations sont enregistrées sans transaction bancaire immédiate.
                </p>
              </div>

              {/* Share button */}
              <div className="pt-2 border-t border-[#EAE2D7]">
                <button
                  onClick={handleShare}
                  className="w-full inline-flex items-center justify-center gap-2 py-2 text-xs font-medium text-[#57534E] hover:text-[#1C1917] hover:bg-[#F2ECE4] rounded border border-[#E7E2DA] transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copied ? 'Lien de l’atelier copié !' : 'Partager cet atelier'}</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </section>
    </div>
  );
};
