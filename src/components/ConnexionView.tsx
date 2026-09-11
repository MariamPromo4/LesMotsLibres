import React, { useState } from 'react';
import { Profile, ActivePage } from '../types';
import { supabase } from '../lib/supabase';
import {
  ShieldCheck,
  Check,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  Calendar,
  MailCheck
} from 'lucide-react';

interface ConnexionViewProps {
  currentUser: Profile | null;
  onLogin: (profile: Profile) => void;
  onLogout: () => void;
  setActivePage: (page: ActivePage) => void;
}

export const ConnexionView: React.FC<ConnexionViewProps> = ({
  currentUser,
  onLogin,
  onLogout,
  setActivePage
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [authFeedback, setAuthFeedback] = useState<{ message: string; isError?: boolean } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthFeedback(null);

    try {
      if (mode === 'signin') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          throw error;
        }

        if (data.user) {
          // Retrieve member profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          const profile: Profile = profileData || {
            id: data.user.id,
            first_name: data.user.user_metadata?.first_name || email.split('@')[0],
            last_name: data.user.user_metadata?.last_name || '',
            email: data.user.email || email,
            role: email.includes('admin') ? 'admin' : 'member',
            created_at: data.user.created_at || new Date().toISOString()
          };

          onLogin(profile);
          setAuthFeedback({
            message: 'Connexion réussie ! Bienvenue à l’Atelier.',
            isError: false
          });
          const targetPage: ActivePage = profile.role === 'admin' ? 'admin-dashboard' : 'member-dashboard';
          setTimeout(() => setActivePage(targetPage), 600);
        }
      } else {
        // Sign up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName
            }
          }
        });

        if (error) {
          throw error;
        }

        if (data.user) {
          // If Supabase requires email confirmation (or session is null), prompt to verify email
          if (data.session) {
            const profile: Profile = {
              id: data.user.id,
              first_name: firstName || 'Nouveau',
              last_name: lastName || 'Membre',
              email,
              role: 'member',
              created_at: new Date().toISOString()
            };
            onLogin(profile);
            setAuthFeedback({
              message: 'Votre compte a été créé. Consultez votre boîte mail pour confirmer votre adresse avant de vous connecter.',
              isError: false
            });
            setTimeout(() => setActivePage('events'), 1500);
          } else {
            // Email confirmation required by Supabase Auth
            setMode('signin');
            setPassword('');
            setAuthFeedback({
              message: 'Votre compte a été créé. Consultez votre boîte mail pour confirmer votre adresse avant de vous connecter.',
              isError: false
            });
          }
        }
      }
    } catch (err: any) {
      let friendlyError = 'Une erreur est survenue lors de l’authentification.';
      if (err?.message?.includes('Invalid login credentials')) {
        friendlyError = 'Adresse e-mail ou mot de passe incorrect.';
      } else if (err?.message?.includes('User already registered')) {
        friendlyError = 'Un compte existe déjà avec cette adresse e-mail.';
      } else if (err?.message?.includes('Password should be at least')) {
        friendlyError = 'Le mot de passe doit comporter au moins 6 caractères.';
      } else if (err?.message) {
        friendlyError = err.message;
      }

      setAuthFeedback({
        message: friendlyError,
        isError: true
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10 pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      {/* Back button */}
      <div>
        <button
          onClick={() => setActivePage('home')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#57534E] hover:text-[#1C1917] bg-[#FAF7F2] px-3.5 py-1.5 rounded border border-[#E7E2DA] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Retour à l'accueil</span>
        </button>
      </div>

      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#994D2B]">
          Espace Membre
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#1C1917] font-normal">
          {currentUser ? 'Votre espace personnel' : 'Bienvenue à l’Atelier'}
        </h1>
        <p className="text-xs sm:text-sm text-[#57534E]">
          {currentUser
            ? `Vous êtes connecté en tant que ${currentUser.role === 'admin' ? 'responsable d’animation' : 'adhérent de l’association'}.`
            : 'Retrouvez le suivi de vos ateliers d’écriture et vos pré-inscriptions.'}
        </p>
      </div>

      {currentUser ? (
        /* Connected Profile Card */
        <div className="max-w-md mx-auto bg-[#FAF7F2] p-8 rounded-xl border border-[#D5CABE] shadow-xs space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-[#2E4036] text-[#FAF7F2] font-serif text-2xl font-bold flex items-center justify-center mx-auto shadow-2xs">
            {currentUser.first_name.charAt(0)}{currentUser.last_name.charAt(0)}
          </div>

          <div>
            <h3 className="font-serif text-xl font-medium text-[#1C1917]">
              {currentUser.first_name} {currentUser.last_name}
            </h3>
            <p className="text-xs text-[#78716C] font-mono mt-0.5">{currentUser.email}</p>
            <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EAE2D7] text-[#2E4036]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#994D2B]" />
              <span>{currentUser.role === 'admin' ? 'Équipe d’animation' : 'Adhérent de l’association'}</span>
            </div>
          </div>

          {currentUser.bio && (
            <p className="text-xs text-[#57534E] italic font-serif bg-[#F5EFE8] p-3 rounded border border-[#E7E2DA]">
              « {currentUser.bio} »
            </p>
          )}

          <div className="pt-4 border-t border-[#EAE2D7] flex flex-col gap-2.5">
            {currentUser.role === 'admin' && (
              <button
                onClick={() => setActivePage('admin-dashboard')}
                className="w-full py-2.5 px-4 bg-[#2E4036] hover:bg-[#1E2D25] text-[#FAF7F2] rounded-md text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-2xs"
              >
                <ShieldCheck className="w-4 h-4 text-[#C5D9CE]" />
                <span>Accéder à l'Espace Administrateur</span>
              </button>
            )}
            <button
              onClick={() => setActivePage('member-dashboard')}
              className={`w-full py-2.5 px-4 text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-2 ${
                currentUser.role === 'admin'
                  ? 'bg-[#EAE2D7] hover:bg-[#E1D7C9] text-[#2E4036] border border-[#D5CABE]'
                  : 'bg-[#2E4036] hover:bg-[#1E2D25] text-[#FAF7F2] shadow-2xs'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Accéder à mon Espace Membre</span>
            </button>
            <button
              onClick={() => setActivePage('events')}
              className="w-full py-2 px-4 text-xs font-medium text-[#44403C] hover:bg-[#F2ECE4] rounded-md border border-[#E7E2DA] transition-colors"
            >
              Consulter l'agenda public des ateliers
            </button>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                onLogout();
              }}
              className="w-full py-2 px-4 border border-[#C5BCB0] hover:bg-[#F2ECE4] text-[#78716C] hover:text-[#1C1917] rounded-md text-xs font-medium transition-colors"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      ) : (
        /* Login / Signup Form */
        <div className="max-w-md mx-auto space-y-6">
          {/* Tab Selector: Se connecter vs Créer un compte */}
          <div className="flex border-b border-[#EAE2D7] text-xs font-semibold">
            <button
              onClick={() => {
                setMode('signin');
                setAuthFeedback(null);
              }}
              className={`flex-1 py-3 text-center border-b-2 transition-colors ${
                mode === 'signin'
                  ? 'border-[#2E4036] text-[#2E4036]'
                  : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              Se connecter
            </button>
            <button
              onClick={() => {
                setMode('signup');
                setAuthFeedback(null);
              }}
              className={`flex-1 py-3 text-center border-b-2 transition-colors ${
                mode === 'signup'
                  ? 'border-[#2E4036] text-[#2E4036]'
                  : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              Créer un compte
            </button>
          </div>

          {authFeedback && (
            <div
              className={`p-3 rounded-md text-xs flex items-center gap-2 border ${
                authFeedback.isError
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : 'bg-[#E8F0EC] border-[#C5D9CE] text-[#2E4036]'
              }`}
            >
              {authFeedback.isError ? (
                <AlertCircle className="w-4 h-4 shrink-0" />
              ) : (
                <Check className="w-4 h-4 shrink-0" />
              )}
              <span>{authFeedback.message}</span>
            </div>
          )}

          {/* Form */}
          <div className="bg-[#FAF7F2] p-6 sm:p-8 rounded-xl border border-[#E7E2DA] shadow-xs space-y-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                      Prénom
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Marguerite"
                      className="w-full px-3 py-2 bg-[#FDFBF7] border border-[#D5CABE] rounded-md text-xs text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#2E4036]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                      Nom
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Duras"
                      className="w-full px-3 py-2 bg-[#FDFBF7] border border-[#D5CABE] rounded-md text-xs text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#2E4036]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                  Adresse e-mail
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre.email@exemple.fr"
                  className="w-full px-3 py-2 bg-[#FDFBF7] border border-[#D5CABE] rounded-md text-xs text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#2E4036]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                  Mot de passe
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-[#FDFBF7] border border-[#D5CABE] rounded-md text-xs text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#2E4036]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-[#2E4036] hover:bg-[#1E2D25] disabled:opacity-50 text-[#FAF7F2] rounded-md text-xs font-semibold transition-colors shadow-2xs mt-2 flex items-center justify-center gap-2"
              >
                {isSubmitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>{mode === 'signin' ? 'Se connecter' : 'Créer mon compte'}</span>
              </button>
            </form>

            <div className="pt-2 text-center">
              <p className="text-[11px] text-[#78716C] leading-relaxed">
                {mode === 'signin' ? (
                  <>
                    Pas encore adhérent(e) ?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signup');
                        setAuthFeedback(null);
                      }}
                      className="text-[#994D2B] font-semibold hover:underline"
                    >
                      Créer un compte
                    </button>
                  </>
                ) : (
                  <>
                    Déjà inscrit(e) ?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signin');
                        setAuthFeedback(null);
                      }}
                      className="text-[#994D2B] font-semibold hover:underline"
                    >
                      Se connecter
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
