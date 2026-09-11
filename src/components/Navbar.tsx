import React, { useState } from 'react';
import { BookOpen, Calendar, Mail, User, Menu, X, Compass, CheckCircle2, Shield } from 'lucide-react';
import { ActivePage, Profile } from '../types';
import { isSupabaseConfigured } from '../lib/supabase';

interface NavbarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  onOpenAuth: () => void;
  currentUser: Profile | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  setActivePage,
  onOpenAuth,
  currentUser,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home' as ActivePage, label: 'Accueil', icon: BookOpen },
    { id: 'about' as ActivePage, label: 'L’Association', icon: Compass },
    { id: 'events' as ActivePage, label: 'Agenda & Ateliers', icon: Calendar },
    { id: 'contact' as ActivePage, label: 'Contact', icon: Mail },
  ];

  const handleNavClick = (page: ActivePage) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#E7E2DA] transition-all">
      {/* Top Banner Notice for Supabase preparation */}
      <div className="bg-[#2E4036] text-[#F3EFE6] text-xs py-1.5 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#E29578] animate-pulse"></span>
            <span className="font-medium">Étape 1 active :</span>
            <span className="opacity-90">Site public, agenda, fiches ateliers & préparation Supabase Auth</span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-[11px] opacity-85">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#E29578]" />
              {isSupabaseConfigured ? 'Supabase configuré' : 'Supabase préparé (mode démo actif)'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <button
            id="brand-logo-btn"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3.5 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-md bg-[#2E4036] text-[#FAF7F2] flex items-center justify-center font-serif text-2xl font-bold tracking-tight shadow-xs group-hover:bg-[#1E2D25] transition-colors">
              M
            </div>
            <div>
              <span className="font-serif text-2xl tracking-tight text-[#1C1917] font-semibold block leading-tight group-hover:text-[#994D2B] transition-colors">
                Les Mots Libres
              </span>
              <span className="text-[11px] tracking-wider uppercase text-[#78716C] block font-medium">
                Ateliers & Écriture Créative
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activePage === item.id || (item.id === 'events' && activePage === 'event-detail');
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                    isActive
                      ? 'text-[#994D2B] font-semibold'
                      : 'text-[#57534E] hover:text-[#1C1917] hover:bg-[#F2ECE4]/60 rounded-md'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#994D2B] rounded-full"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Supabase Auth / Espace Membre */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3 pl-2 border-l border-[#E7E2DA]">
                <div className="text-right">
                  <div className="text-xs font-semibold text-[#1C1917] flex items-center gap-1.5 justify-end">
                    {currentUser.role === 'admin' && (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-[#994D2B]/15 text-[#994D2B] px-1.5 py-0.5 rounded font-medium">
                        <Shield className="w-2.5 h-2.5" /> Admin
                      </span>
                    )}
                    {currentUser.first_name} {currentUser.last_name}
                  </div>
                  <div className="text-[11px] text-[#78716C]">{currentUser.email}</div>
                </div>
                <button
                  id="user-logout-btn"
                  onClick={onLogout}
                  className="px-3 py-1.5 text-xs text-[#78716C] hover:text-[#994D2B] hover:bg-[#F2ECE4] rounded border border-[#E7E2DA] transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <button
                id="open-auth-modal-btn"
                onClick={onOpenAuth}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#2E4036] bg-[#EAE2D7] hover:bg-[#E1D7C9] border border-[#D5CABE] rounded-md transition-all shadow-2xs"
              >
                <User className="w-3.5 h-3.5 text-[#2E4036]" />
                <span>Espace Membre</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              id="mobile-auth-btn"
              onClick={onOpenAuth}
              className="p-2 text-[#2E4036] hover:bg-[#F2ECE4] rounded-md border border-[#E7E2DA]"
              title="Espace Membre"
            >
              <User className="w-4 h-4" />
            </button>
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#57534E] hover:text-[#1C1917] hover:bg-[#F2ECE4] rounded-md focus:outline-none"
              aria-label="Ouvrir le menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E7E2DA] bg-[#FDFBF7] px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2">
          {navItems.map((item) => {
            const isActive = activePage === item.id || (item.id === 'events' && activePage === 'event-detail');
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-left transition-colors ${
                  isActive
                    ? 'bg-[#EAE2D7] text-[#994D2B] font-semibold'
                    : 'text-[#44403C] hover:bg-[#F2ECE4]'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-4 mt-2 border-t border-[#E7E2DA]">
            {currentUser ? (
              <div className="p-3 bg-[#F4EFEA] rounded-md space-y-2">
                <div className="text-xs font-semibold text-[#1C1917]">
                  {currentUser.first_name} {currentUser.last_name} ({currentUser.role})
                </div>
                <div className="text-xs text-[#78716C]">{currentUser.email}</div>
                <button
                  onClick={onLogout}
                  className="w-full text-left text-xs font-medium text-[#994D2B] pt-1"
                >
                  Se déconnecter
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2E4036] text-[#FAF7F2] rounded-md text-sm font-medium hover:bg-[#1E2D25] transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Accéder à l'Espace Membre</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
