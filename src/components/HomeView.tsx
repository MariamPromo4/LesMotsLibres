import React from 'react';
import { EventItem, ActivePage } from '../types';
import { ArrowRight, Calendar, Users, Sparkles, BookOpen, Clock, MapPin, Compass, CheckCircle } from 'lucide-react';

interface HomeViewProps {
  events: EventItem[];
  onSelectEvent: (event: EventItem) => void;
  setActivePage: (page: ActivePage) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  events,
  onSelectEvent,
  setActivePage
}) => {
  const upcomingEvents = events.slice(0, 3);

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION : IDENTITÉ & MANIFESTE */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-[#E7E2DA]">
        {/* Subtle background paper grain texture effect */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE2D7] text-[#2E4036] text-xs font-semibold tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-[#994D2B]"></span>
                Association culturelle d’écriture créative • Paris 20e
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1C1917] font-normal leading-[1.15] tracking-tight">
                L’écriture n’est pas un don solitaire, c’est un <span className="italic font-medium text-[#994D2B]">atelier vivant</span>.
              </h1>

              <p className="text-lg text-[#57534E] leading-relaxed max-w-2xl font-normal">
                Les Mots Libres réunit des curieux, débutants et passionnés autour du plaisir de poser des mots sur la page.
                Sans concours ni jugement, nous désacralisons le geste d’écrire pour réveiller la voix propre de chacun.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  id="hero-explore-events-btn"
                  onClick={() => setActivePage('events')}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#2E4036] hover:bg-[#1E2D25] text-[#FAF7F2] rounded-md font-medium text-sm transition-all shadow-xs group"
                >
                  <span>Découvrir les prochains ateliers</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  id="hero-about-btn"
                  onClick={() => setActivePage('about')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-transparent hover:bg-[#F2ECE4] text-[#1C1917] border border-[#D5CABE] rounded-md font-medium text-sm transition-all"
                >
                  <span>Comprendre notre démarche</span>
                </button>
              </div>

              {/* Mini reassurance badges */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-[#78716C]">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#2E4036]" />
                  <span>Petits groupes de 10 à 14 personnes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#2E4036]" />
                  <span>Aucun prérequis ni niveau exigé</span>
                </div>
              </div>
            </div>

            {/* Editorial Visual Composition */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Paper sheet frame */}
                <div className="bg-[#FAF7F2] p-6 sm:p-8 rounded-lg shadow-sm border border-[#E7E2DA] relative">
                  <div className="w-8 h-1 bg-[#994D2B] mb-6 rounded-full"></div>
                  <h3 className="font-serif text-xl font-medium text-[#1C1917] mb-3">
                    L’esprit des lieux
                  </h3>
                  <p className="text-sm text-[#57534E] leading-relaxed mb-6 font-serif italic text-base">
                    « Trouver son style, ce n’est pas apprendre à bien imiter les grands maîtres. C’est oser balbutier sa propre langue jusqu’à ce qu’elle sonne juste. »
                  </p>
                  <div className="pt-4 border-t border-[#EAE2D7] text-xs text-[#78716C] flex items-center justify-between">
                    <span>Atelier des Mots Libres</span>
                    <span className="font-mono text-[11px] text-[#994D2B]">Édition 2026</span>
                  </div>
                </div>
                
                {/* Secondary accent card overlapping */}
                <div className="mt-4 bg-[#EAE2D7] p-4 rounded-md border border-[#D5CABE] flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-[#2E4036] text-[#FAF7F2] flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-[#1C1917]">Un lieu dédié à Belleville</p>
                    <p className="text-[#57534E]">Grandes tables en chêne, bibliothèque partagée & théières fumantes.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. COMPRENDRE : CE QU’EST L’ASSOCIATION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#994D2B]">
            Ce qu’est Les Mots Libres
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1917] mt-2 font-normal">
            Une maison ouverte pour apprivoiser la page blanche
          </h2>
          <p className="text-[#57534E] text-base mt-3 leading-relaxed">
            Fondée en 2021 par des passionnés de littérature et de transmission, Les Mots Libres est une association à but non lucratif qui crée des passerelles entre la lecture passionnée et la création littéraire intime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#FAF7F2] p-6 rounded-lg border border-[#E7E2DA] space-y-3">
            <div className="w-10 h-10 rounded bg-[#EAE2D7] text-[#2E4036] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-medium text-[#1C1917]">Désacraliser l’écriture</h3>
            <p className="text-sm text-[#57534E] leading-relaxed">
              Nous cassons l’illusion qu'il faut être « écrivain » pour commencer à noircir un carnet. Écrire est une expérience accessible, vivifiante et profondément humaine.
            </p>
          </div>

          <div className="bg-[#FAF7F2] p-6 rounded-lg border border-[#E7E2DA] space-y-3">
            <div className="w-10 h-10 rounded bg-[#EAE2D7] text-[#2E4036] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-medium text-[#1C1917]">La force du collectif</h3>
            <p className="text-sm text-[#57534E] leading-relaxed">
              L’énergie du groupe décuple l’inspiration. Écouter les textes des autres aiguise l’oreille, nourrit la réflexion et libère son propre regard.
            </p>
          </div>

          <div className="bg-[#FAF7F2] p-6 rounded-lg border border-[#E7E2DA] space-y-3">
            <div className="w-10 h-10 rounded bg-[#EAE2D7] text-[#2E4036] flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-medium text-[#1C1917]">Bienveillance & exigence</h3>
            <p className="text-sm text-[#57534E] leading-relaxed">
              Aucun classement ni notation. Des retours constructifs, attentifs au potentiel de chaque récit et respectueux de la vulnérabilité de chacun.
            </p>
          </div>
        </div>
      </section>

      {/* 3. À QUI S’ADRESSE L’ASSOCIATION ? */}
      <section className="bg-[#F4EFEA] py-16 border-y border-[#E7E2DA]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#994D2B]">
              Public & Participants
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1917] mt-2 font-normal">
              À qui s’adressent nos ateliers ?
            </h2>
            <p className="text-[#57534E] text-base mt-2">
              Chaque parcours d’écriture est singulier. Il n’y a pas de profil type dans nos ateliers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#FAF7F2] p-6 rounded-lg border border-[#D5CABE] space-y-3">
              <span className="text-xs font-mono font-medium text-[#994D2B]">01 / Découverte</span>
              <h3 className="font-serif text-xl font-medium text-[#1C1917]">
                Les intimidés de la page blanche
              </h3>
              <p className="text-sm text-[#57534E] leading-relaxed">
                Vous avez toujours eu envie d’écrire sans jamais oser franchir le pas, ou vous vous sentez bloqué par une autocensure trop pesante. Nos amorces ludiques vous débloquent dès la première heure.
              </p>
            </div>

            <div className="bg-[#FAF7F2] p-6 rounded-lg border border-[#D5CABE] space-y-3">
              <span className="text-xs font-mono font-medium text-[#994D2B]">02 / Approfondissement</span>
              <h3 className="font-serif text-xl font-medium text-[#1C1917]">
                Les plumes en quête de rythme
              </h3>
              <p className="text-sm text-[#57534E] leading-relaxed">
                Vous écrivez déjà dans votre coin, mais vous manquez de régularité, de contraintes stimulantes et de retours extérieurs lucides pour structurer votre univers de fiction ou vos récits.
              </p>
            </div>

            <div className="bg-[#FAF7F2] p-6 rounded-lg border border-[#D5CABE] space-y-3">
              <span className="text-xs font-mono font-medium text-[#994D2B]">03 / Exploration</span>
              <h3 className="font-serif text-xl font-medium text-[#1C1917]">
                Les curieux de formes littéraires
              </h3>
              <p className="text-sm text-[#57534E] leading-relaxed">
                Poésie contemporaine, carnet d'observation urbain, récit de voyage, autofiction ou écriture dramatique : vous venez pour expérimenter des registres neufs dans un cadre chaleureux.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CE QUE NOUS PROPOSONS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#994D2B]">
            Formats & Programmation
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1917] mt-2 font-normal">
            Quatre manières de faire résonner vos récits
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 bg-[#FAF7F2] rounded-lg border border-[#E7E2DA] space-y-2">
            <span className="text-xs font-semibold text-[#2E4036] uppercase tracking-wide">Ateliers hebdomadaires</span>
            <h4 className="font-serif text-lg font-medium text-[#1C1917]">Séances de 3 heures</h4>
            <p className="text-xs text-[#57534E] leading-relaxed">
              Des rendez-vous thématiques le samedi après-midi pour explorer un motif (mémoire, ville, corps, dialogue).
            </p>
          </div>

          <div className="p-5 bg-[#FAF7F2] rounded-lg border border-[#E7E2DA] space-y-2">
            <span className="text-xs font-semibold text-[#2E4036] uppercase tracking-wide">Masterclasses</span>
            <h4 className="font-serif text-lg font-medium text-[#1C1917]">Avec auteurs invités</h4>
            <p className="text-xs text-[#57534E] leading-relaxed">
              Une demi-journée de transmission animée par un écrivain ou dramaturge contemporain sur sa méthode de travail.
            </p>
          </div>

          <div className="p-5 bg-[#FAF7F2] rounded-lg border border-[#E7E2DA] space-y-2">
            <span className="text-xs font-semibold text-[#2E4036] uppercase tracking-wide">Marathons nocturnes</span>
            <h4 className="font-serif text-lg font-medium text-[#1C1917]">Nuits de l'Écritoire</h4>
            <p className="text-xs text-[#57534E] leading-relaxed">
              Des sessions immersives du crépuscule à minuit, scandées par des contraintes stylistiques et des tisanes chaudes.
            </p>
          </div>

          <div className="p-5 bg-[#FAF7F2] rounded-lg border border-[#E7E2DA] space-y-2">
            <span className="text-xs font-semibold text-[#2E4036] uppercase tracking-wide">Apéros-Lectures</span>
            <h4 className="font-serif text-lg font-medium text-[#1C1917]">Scène ouverte fraternelle</h4>
            <p className="text-xs text-[#57534E] leading-relaxed">
              Chaque premier jeudi du mois, venez lire un fragment à voix haute ou simplement écouter avec un verre.
            </p>
          </div>
        </div>
      </section>

      {/* 5. PROCHAINS ÉVÉNEMENTS / ATELIERS À L’AFFICHE */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#994D2B]">
              Agenda à venir
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1917] mt-1 font-normal">
              Les prochains ateliers programmés
            </h2>
          </div>
          <button
            onClick={() => setActivePage('events')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#994D2B] hover:text-[#7F3F23] transition-colors"
          >
            <span>Voir tout l'agenda</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingEvents.map((evt) => {
            const spotsRemaining = evt.capacity - evt.registered_count;
            return (
              <div
                key={evt.id}
                className="bg-[#FAF7F2] rounded-lg border border-[#E7E2DA] overflow-hidden flex flex-col hover:border-[#C5BCB0] transition-all hover:shadow-xs group"
              >
                <div className="h-44 relative overflow-hidden bg-[#EAE2D7]">
                  <img
                    src={evt.image_url}
                    alt={evt.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-[#FAF7F2]/90 backdrop-blur-xs px-2.5 py-1 rounded text-xs font-medium text-[#2E4036]">
                    {evt.category === 'atelier' && 'Atelier'}
                    {evt.category === 'masterclass' && 'Masterclass'}
                    {evt.category === 'marathon' && 'Marathon nocturne'}
                    {evt.category === 'lecture' && 'Scène ouverte'}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-[#24211E]/85 text-[#FAF7F2] px-2 py-0.5 rounded text-[11px] font-mono">
                    {spotsRemaining > 0 ? `${spotsRemaining} places restantes` : 'Complet'}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-[#78716C]">
                      <Calendar className="w-3.5 h-3.5 text-[#994D2B]" />
                      <span>{evt.formatted_date}</span>
                      <span>•</span>
                      <Clock className="w-3.5 h-3.5 text-[#78716C]" />
                      <span>{evt.start_time} - {evt.end_time}</span>
                    </div>

                    <h3 className="font-serif text-lg font-medium text-[#1C1917] leading-snug group-hover:text-[#994D2B] transition-colors">
                      {evt.title}
                    </h3>

                    <p className="text-xs text-[#57534E] line-clamp-2 leading-relaxed">
                      {evt.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#EAE2D7] flex items-center justify-between">
                    <div className="text-xs text-[#78716C]">
                      Par <span className="font-medium text-[#1C1917]">{evt.animator.name}</span>
                    </div>

                    <button
                      id={`home-view-event-${evt.id}`}
                      onClick={() => onSelectEvent(evt)}
                      className="text-xs font-semibold text-[#2E4036] hover:text-[#994D2B] inline-flex items-center gap-1"
                    >
                      <span>Fiche & Inscription</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. COMMENT PARTICIPER OU REJOINDRE L’ASSOCIATION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#2E4036] text-[#FAF7F2] rounded-xl p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-2xl space-y-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#E29578]">
              Comment participer ?
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#FAF7F2] font-normal leading-snug">
              Rejoindre l’association en trois étapes simples
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
              <div className="space-y-2 border-t border-[#445D4F] pt-4">
                <span className="font-mono text-sm text-[#E29578]">01. Choisir</span>
                <h4 className="font-medium text-sm text-[#FAF7F2]">Sélectionnez un atelier</h4>
                <p className="text-xs text-[#D1DCD6] leading-relaxed">
                  Consultez notre agenda public et inscrivez-vous à la séance de votre choix.
                </p>
              </div>

              <div className="space-y-2 border-t border-[#445D4F] pt-4">
                <span className="font-mono text-sm text-[#E29578]">02. Venir</span>
                <h4 className="font-medium text-sm text-[#FAF7F2]">Prenez juste un carnet</h4>
                <p className="text-xs text-[#D1DCD6] leading-relaxed">
                  Rendez-vous à l'atelier à Belleville. Le thé, les amorces et la convivialité vous attendent.
                </p>
              </div>

              <div className="space-y-2 border-t border-[#445D4F] pt-4">
                <span className="font-mono text-sm text-[#E29578]">03. Adhérer</span>
                <h4 className="font-medium text-sm text-[#FAF7F2]">Optionnel & solidaire</h4>
                <p className="text-xs text-[#D1DCD6] leading-relaxed">
                  L'adhésion annuelle permet de soutenir le projet et de bénéficier de tarifs réduits sur tous les ateliers.
                </p>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={() => setActivePage('events')}
                className="px-5 py-2.5 bg-[#FAF7F2] text-[#2E4036] hover:bg-[#EAE2D7] rounded-md text-xs font-semibold transition-colors"
              >
                Parcourir tous les ateliers
              </button>
              <button
                onClick={() => setActivePage('contact')}
                className="px-5 py-2.5 bg-transparent border border-[#5F826F] text-[#FAF7F2] hover:bg-[#395043] rounded-md text-xs font-semibold transition-colors"
              >
                Une question ? Contactez-nous
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
