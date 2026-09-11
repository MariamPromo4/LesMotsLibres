import React from 'react';
import { ActivePage } from '../types';
import { ArrowRight, BookOpen, Compass, Heart, Feather, Sparkles, Coffee, Users, ShieldCheck } from 'lucide-react';

interface AboutViewProps {
  setActivePage: (page: ActivePage) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ setActivePage }) => {
  return (
    <div className="space-y-16 pb-20">
      {/* 1. Header Présentation */}
      <section className="pt-12 pb-12 border-b border-[#E7E2DA] max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE2D7] text-[#2E4036] text-xs font-semibold tracking-wide">
            <Compass className="w-3.5 h-3.5 text-[#994D2B]" />
            <span>Présentation & Démarche</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl text-[#1C1917] font-normal tracking-tight leading-[1.18]">
            Une communauté littéraire pour ceux qui veulent <span className="italic text-[#994D2B] font-medium">mettre le monde en mots</span>.
          </h1>

          <p className="text-lg text-[#57534E] leading-relaxed font-serif italic">
            « Il n'y a pas de mauvaise page lorsque l'intention est sincère. Il n'y a que des chemins d'exploration. »
          </p>
        </div>
      </section>

      {/* 2. Notre Histoire & Raison d'être */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5 text-sm text-[#44403C] leading-relaxed">
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1C1917] font-normal">
              Comment est née l'association ?
            </h2>

            <p>
              Créée à l'automne 2021 dans l'Est parisien, <strong className="font-medium text-[#1C1917]">Les Mots Libres</strong> est née d'un constat partagé par un groupe d'enseignants, d'éditeurs et d'écrivains : l'écriture créative souffre en France d'un culte étouffant du « génie solitaire ».
            </p>

            <p>
              On imagine souvent l'écrivain comme une figure d'exception qui reçoit l'inspiration d'en haut. Ce mythe paralyse des milliers de personnes qui n'osent pas noircir un carnet ou qui abandonnent dès le deuxième paragraphe par peur de ne pas être « à la hauteur ».
            </p>

            <p className="p-4 bg-[#FAF7F2] rounded-md border-l-3 border-[#994D2B] text-[#1C1917] italic font-serif">
              Notre vocation est d'offrir un refuge chaleureux où l'on vient écrire comme on va à l'atelier de poterie ou de peinture : pour fabriquer, tester, raturer et écouter ce qui résonne.
            </p>

            <p>
              Depuis cinq ans, nous avons accueilli plus de 600 participants d'horizons variés : lycéens, retraités, soignants, artisans, étudiants et professionnels en reconversion. Tous réunis par le goût du verbe.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-[#FAF7F2] p-8 rounded-lg border border-[#E7E2DA] space-y-6">
              <h3 className="font-serif text-xl font-medium text-[#1C1917] border-b border-[#EAE2D7] pb-3">
                L'Association en quelques repères
              </h3>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="font-serif text-3xl text-[#2E4036] font-semibold">100 %</div>
                  <div className="text-xs text-[#78716C] mt-1">Loi 1901 à but non lucratif et gestion bénévole</div>
                </div>
                <div>
                  <div className="font-serif text-3xl text-[#2E4036] font-semibold">12 max</div>
                  <div className="text-xs text-[#78716C] mt-1">Participants par séance pour garantir l'écoute</div>
                </div>
                <div>
                  <div className="font-serif text-3xl text-[#2E4036] font-semibold">4 formats</div>
                  <div className="text-xs text-[#78716C] mt-1">Ateliers, masterclasses, marathons, scènes ouvertes</div>
                </div>
                <div>
                  <div className="font-serif text-3xl text-[#2E4036] font-semibold">Paris 20e</div>
                  <div className="text-xs text-[#78716C] mt-1">Atelier permanent rue des Cascades (Belleville)</div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#EAE2D7] flex items-center justify-between text-xs text-[#78716C]">
                <span>Agrément jeunesse et éducation populaire en cours</span>
                <span className="font-mono text-[#994D2B]">Adhésion : 15 €/an</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Nos 4 Valeurs Fondamentales */}
      <section className="bg-[#F4EFEA] py-16 border-y border-[#E7E2DA]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#994D2B]">
              Éthique & Pédagogie
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1917] mt-1 font-normal">
              Nos piliers éditoriaux et humains
            </h2>
            <p className="text-sm text-[#57534E] mt-2">
              Ces principes garantissent un espace sécurisé où chacun peut partager sa sensibilité sans crainte.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#FAF7F2] p-6 rounded-lg border border-[#D5CABE] space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-[#EAE2D7] text-[#994D2B] flex items-center justify-center font-bold font-serif">
                  1
                </div>
                <h3 className="font-serif text-lg font-medium text-[#1C1917]">Bienveillance absolue</h3>
              </div>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Les retours sur les textes ne portent jamais sur la personne qui écrit, mais sur le texte lui-même. On s'interdit les jugements péremptoires (« C'est bien », « C'est raté ») au profit d'observations précises (« Cette image visuelle crée une tension forte », « Le rythme ralentit ici »).
              </p>
            </div>

            <div className="bg-[#FAF7F2] p-6 rounded-lg border border-[#D5CABE] space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-[#EAE2D7] text-[#994D2B] flex items-center justify-center font-bold font-serif">
                  2
                </div>
                <h3 className="font-serif text-lg font-medium text-[#1C1917]">La contrainte libératrice</h3>
              </div>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Paradoxalement, la liberté totale bloque. Donner un cadre strict (un temps limité, une phrase imposée, une ellipse temporelle) canalise l'esprit et court-circuite le perfectionnisme pour libérer l'inattendu.
              </p>
            </div>

            <div className="bg-[#FAF7F2] p-6 rounded-lg border border-[#D5CABE] space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-[#EAE2D7] text-[#994D2B] flex items-center justify-center font-bold font-serif">
                  3
                </div>
                <h3 className="font-serif text-lg font-medium text-[#1C1917]">L'artisanat du style</h3>
              </div>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Nous considérons l'écriture comme un travail de menuiserie ou de poterie fine : on taille le bois mort, on ajuste les chevilles syntaxiques, on soigne la cadence. Écrire s'apprend et s'affine par la pratique assidue.
              </p>
            </div>

            <div className="bg-[#FAF7F2] p-6 rounded-lg border border-[#D5CABE] space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-[#EAE2D7] text-[#994D2B] flex items-center justify-center font-bold font-serif">
                  4
                </div>
                <h3 className="font-serif text-lg font-medium text-[#1C1917]">Hospitalité et écoute</h3>
              </div>
              <p className="text-xs text-[#57534E] leading-relaxed">
                La parole littéraire est précieuse. Dans nos ateliers, l'écoute des autres est aussi centrale que l'écriture personnelle. Écouter une voix singulière ouvre nos propres paysages intérieurs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. L'Équipe d'animation */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#994D2B]">
            Transmission
          </span>
          <h2 className="font-serif text-3xl text-[#1C1917] mt-1 font-normal">
            Qui anime les ateliers ?
          </h2>
          <p className="text-sm text-[#57534E] mt-2">
            Des praticiens en exercice qui partagent leur expérience avec passion et simplicité.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#FAF7F2] p-6 rounded-lg border border-[#E7E2DA] space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#EAE2D7] text-[#2E4036] flex items-center justify-center font-serif text-xl font-bold">
              CV
            </div>
            <div>
              <h4 className="font-serif text-lg font-semibold text-[#1C1917]">Clémence Valéry</h4>
              <p className="text-xs text-[#994D2B] font-medium">Romancière & Animatrice principale</p>
            </div>
            <p className="text-xs text-[#57534E] leading-relaxed">
              Autrice de deux fictions explorant les paysages méditerranéens et les liens familiaux. Elle anime des ateliers depuis 2018 avec une approche centrée sur l'éveil sensoriel.
            </p>
          </div>

          <div className="bg-[#FAF7F2] p-6 rounded-lg border border-[#E7E2DA] space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#EAE2D7] text-[#2E4036] flex items-center justify-center font-serif text-xl font-bold">
              MV
            </div>
            <div>
              <h4 className="font-serif text-lg font-semibold text-[#1C1917]">Marc Vauthier</h4>
              <p className="text-xs text-[#994D2B] font-medium">Éditeur & Secrétaire de l'association</p>
            </div>
            <p className="text-xs text-[#57534E] leading-relaxed">
              Éditeur de littérature contemporaine et de poésie. Passionné par l'autofiction et la micro-édition d'art, il accompagne le travail de réécriture et d'élagage.
            </p>
          </div>

          <div className="bg-[#FAF7F2] p-6 rounded-lg border border-[#E7E2DA] space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#EAE2D7] text-[#2E4036] flex items-center justify-center font-serif text-xl font-bold">
              SB
            </div>
            <div>
              <h4 className="font-serif text-lg font-semibold text-[#1C1917]">Sarah Benali</h4>
              <p className="text-xs text-[#994D2B] font-medium">Dramaturge & Coordinatrice</p>
            </div>
            <p className="text-xs text-[#57534E] leading-relaxed">
              Formée au Conservatoire et en dramaturgie. Elle guide les participants vers l'art du dialogue, le rythme des répliques et l'incarnation vive des personnages.
            </p>
          </div>
        </div>
      </section>

      {/* 5. CTA vers l'agenda */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF7F2] p-8 sm:p-10 rounded-xl border border-[#D5CABE] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-serif text-2xl text-[#1C1917] font-medium">
              Envie de vous joindre à une séance d'écriture ?
            </h3>
            <p className="text-xs sm:text-sm text-[#57534E]">
              Consultez les dates des prochains ateliers à Belleville ou envoyez-nous vos questions.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActivePage('events')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2E4036] hover:bg-[#1E2D25] text-[#FAF7F2] rounded-md text-xs font-semibold transition-colors"
            >
              <span>Consulter l'agenda</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActivePage('contact')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-transparent border border-[#C5BCB0] hover:bg-[#F2ECE4] text-[#1C1917] rounded-md text-xs font-semibold transition-colors"
            >
              <span>Nous poser une question</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
