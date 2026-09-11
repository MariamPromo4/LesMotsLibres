import React from 'react';
import { ActivePage } from '../types';
import { Mail, MapPin, Feather, Heart } from 'lucide-react';

interface FooterProps {
  setActivePage: (page: ActivePage) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActivePage }) => {
  return (
    <footer className="bg-[#24211E] text-[#EDE8E1] border-t border-[#38332F] pt-16 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-[#38332F]">
          
          {/* Col 1: Editorial statement */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#FAF7F2] text-[#24211E] flex items-center justify-center font-serif text-xl font-bold">
                M
              </div>
              <span className="font-serif text-2xl tracking-tight text-[#FAF7F2] font-semibold">
                Les Mots Libres
              </span>
            </div>
            
            <p className="text-sm text-[#B8B1A8] leading-relaxed max-w-md font-serif italic text-base">
              « Écrire, c'est aussi ne pas parler. C'est se taire. C'est hurler sans bruit. »
              <span className="block text-xs not-italic text-[#8C847B] mt-1 font-sans font-normal">— Marguerite Duras</span>
            </p>

            <p className="text-xs text-[#A8A196] leading-relaxed">
              Association culturelle loi 1901 dédiée à la désacralisation de l'écriture créative,
              au partage d'histoires singulières et aux rencontres littéraires contemporaines.
            </p>
          </div>

          {/* Col 2: Navigation rapide */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#EAE2D7]">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-[#A8A196]">
              <li>
                <button
                  onClick={() => {
                    setActivePage('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#FAF7F2] transition-colors"
                >
                  Accueil & Manifeste
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActivePage('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#FAF7F2] transition-colors"
                >
                  L'Association & Nos valeurs
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActivePage('events');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#FAF7F2] transition-colors"
                >
                  Agenda des ateliers
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActivePage('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#FAF7F2] transition-colors"
                >
                  Nous contacter & Accès
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Informations pratiques & Lieu */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#EAE2D7]">
              L'Atelier & Horaires
            </h4>
            <div className="text-sm text-[#A8A196] space-y-2.5">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C98A6E] shrink-0 mt-0.5" />
                <span>18 rue des Cascades, 75020 Paris<br />
                <span className="text-xs text-[#8C847B]">Métro Jourdain (L11) ou Pyrénées (L11)</span></span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C98A6E] shrink-0" />
                <a href="mailto:contact@lesmotslibres.fr" className="hover:text-[#FAF7F2] transition-colors">
                  contact@lesmotslibres.fr
                </a>
              </div>
              <p className="text-xs text-[#8C847B] pt-1">
                Permanence d'accueil : le samedi de 13h30 à 18h30 pendant les ateliers.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8C847B] gap-4">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Les Mots Libres — Tous droits réservés.</span>
            <span className="hidden sm:inline">•</span>
            <span>Association culturelle déclarée</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-[#A8A196]">
            <span className="inline-flex items-center gap-1">
              <Feather className="w-3 h-3 text-[#C98A6E]" />
              Conçu pour Next.js & Supabase
            </span>
            <span className="inline-flex items-center gap-1">
              <Heart className="w-3 h-3 text-[#C98A6E]" />
              Fait avec rigueur éditoriale
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
