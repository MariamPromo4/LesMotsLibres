import React, { useState, useEffect } from 'react';
import { Profile, ActivePage } from '../types';
import {
  supabase,
  isSupabaseConfigured,
  DEMO_PROFILES,
  SUPABASE_SQL_SCHEMA,
  checkSupabaseTables,
  SUPABASE_URL
} from '../lib/supabase';
import {
  LogIn,
  UserPlus,
  ShieldCheck,
  Database,
  Copy,
  Check,
  AlertCircle,
  ExternalLink,
  ArrowLeft,
  KeyRound,
  RefreshCw
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
  const [mode, setMode] = useState<'signin' | 'signup' | 'sql'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);
  const [authFeedback, setAuthFeedback] = useState<{ message: string; isError?: boolean } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dbStatus, setDbStatus] = useState<{
    loading: boolean;
    connected: boolean;
    tablesExist: boolean;
    message: string;
  }>({
    loading: false,
    connected: true,
    tablesExist: false,
    message: 'Vérification en cours...'
  });

  const checkDb = async () => {
    setDbStatus((prev) => ({ ...prev, loading: true }));
    const res = await checkSupabaseTables();
    setDbStatus({
      loading: false,
      connected: res.connected,
      tablesExist: res.tablesExist,
      message: res.message
    });
  };

  useEffect(() => {
    checkDb();
  }, []);

  const handleCopySql = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2500);
    }
  };

  const handleDemoLogin = (role: 'member' | 'admin') => {
    const profile = DEMO_PROFILES[role];
    onLogin(profile);
    setAuthFeedback({
      message: `Connecté en mode aperçu en tant que ${role === 'admin' ? 'Administrateur' : 'Membre Adhérent'}.`,
      isError: false
    });
    setTimeout(() => {
      setActivePage('events');
    }, 1000);
  };

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
          // Fetch user profile from public.profiles
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
          setAuthFeedback({ message: 'Connexion réussie à votre compte Supabase !', isError: false });
          setTimeout(() => setActivePage('events'), 900);
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
            message: 'Compte créé avec succès dans Supabase !',
            isError: false
          });
          setTimeout(() => setActivePage('events'), 900);
        }
      }
    } catch (err: any) {
      setAuthFeedback({
        message: err?.message || 'Une erreur est survenue lors de l’authentification.',
        isError: true
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const projectRef = 'tycsmuvtaopolmgcstmo';
  const sqlEditorUrl = `https://supabase.com/dashboard/project/${projectRef}/sql/new`;

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
          Espace Membre & Administration
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#1C1917] font-normal">
          {currentUser ? 'Votre session' : 'Connexion à l’Atelier'}
        </h1>
        <p className="text-xs sm:text-sm text-[#57534E]">
          {currentUser
            ? `Vous êtes authentifié en tant que ${currentUser.role === 'admin' ? 'Administrateur' : 'Membre Adhérent'}.`
            : 'Accédez à vos inscriptions, vos textes d’atelier et la gestion des événements.'}
        </p>
      </div>

      {/* Supabase Connection Banner */}
      <div className="max-w-2xl mx-auto bg-[#FAF7F2] border border-[#D5CABE] rounded-xl p-4 sm:p-5 space-y-3 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EAE2D7] pb-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
            </span>
            <span className="text-xs font-bold text-[#1C1917]">
              Supabase connecté
            </span>
            <span className="text-[11px] font-mono text-[#78716C] hidden sm:inline">
              ({SUPABASE_URL})
            </span>
          </div>

          <button
            onClick={checkDb}
            disabled={dbStatus.loading}
            className="text-[11px] font-medium text-[#2E4036] hover:text-[#1E2D25] flex items-center gap-1 bg-[#EAE2D7] hover:bg-[#DDD3C5] px-2.5 py-1 rounded transition-colors"
          >
            <RefreshCw className={`w-3 h-3 ${dbStatus.loading ? 'animate-spin' : ''}`} />
            <span>Tester la base</span>
          </button>
        </div>

        <div className="text-xs text-[#57534E] flex items-start gap-2 leading-relaxed">
          {dbStatus.tablesExist ? (
            <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-[#994D2B] shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <span className="font-semibold text-[#1C1917]">
              {dbStatus.tablesExist ? 'Base de données active : ' : 'Initialisation des tables : '}
            </span>
            <span>{dbStatus.message}</span>
            {!dbStatus.tablesExist && (
              <p className="mt-1.5 text-[11px] text-[#78716C]">
                Si ce n'est pas encore fait, copiez le script SQL ci-dessous et exécutez-le dans l'Éditeur SQL de votre console Supabase pour créer les tables <code className="text-[#1C1917] font-mono">events</code>, <code className="text-[#1C1917] font-mono">profiles</code> et <code className="text-[#1C1917] font-mono">registrations</code>.
              </p>
            )}
          </div>
        </div>

        {!dbStatus.tablesExist && (
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={handleCopySql}
              className="px-3 py-1.5 bg-[#2E4036] hover:bg-[#1E2D25] text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSql ? 'Script SQL copié !' : 'Copier le script SQL complet'}</span>
            </button>
            <a
              href={sqlEditorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#F2ECE4] text-[#1C1917] border border-[#C5BCB0] rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Ouvrir l'Éditeur SQL Supabase</span>
            </a>
          </div>
        )}
      </div>

      {currentUser ? (
        /* Connected Profile Card */
        <div className="max-w-md mx-auto bg-[#FAF7F2] p-8 rounded-xl border border-[#D5CABE] shadow-xs space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-[#2E4036] text-[#FAF7F2] font-serif text-2xl font-bold flex items-center justify-center mx-auto">
            {currentUser.first_name.charAt(0)}{currentUser.last_name.charAt(0)}
          </div>

          <div>
            <h3 className="font-serif text-xl font-medium text-[#1C1917]">
              {currentUser.first_name} {currentUser.last_name}
            </h3>
            <p className="text-xs text-[#78716C] font-mono mt-0.5">{currentUser.email}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EAE2D7] text-[#2E4036]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#994D2B]" />
              <span>Rôle : {currentUser.role === 'admin' ? 'Administrateur' : 'Membre Adhérent'}</span>
            </div>
          </div>

          {currentUser.bio && (
            <p className="text-xs text-[#57534E] italic font-serif bg-[#F5EFE8] p-3 rounded border border-[#E7E2DA]">
              « {currentUser.bio} »
            </p>
          )}

          <div className="pt-4 border-t border-[#EAE2D7] flex flex-col gap-2.5">
            <button
              onClick={() => setActivePage('events')}
              className="w-full py-2.5 px-4 bg-[#2E4036] hover:bg-[#1E2D25] text-[#FAF7F2] rounded-md text-xs font-semibold transition-colors"
            >
              Consulter l'agenda des ateliers
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
        /* Not logged in */
        <div className="max-w-md mx-auto space-y-6">
          {/* Quick Demo Switcher */}
          <div className="p-4 bg-[#F2ECE4] rounded-lg border border-[#D5CABE] space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1C1917]">
              <KeyRound className="w-3.5 h-3.5 text-[#994D2B]" />
              <span>Test rapide (connexion locale sans mot de passe) :</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('member')}
                className="p-2.5 bg-[#FAF7F2] hover:bg-[#FFFFFF] border border-[#C5BCB0] rounded text-left transition-colors"
              >
                <div className="text-xs font-bold text-[#1C1917]">Profil Membre</div>
                <div className="text-[11px] text-[#78716C]">Camille Rousseau</div>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="p-2.5 bg-[#FAF7F2] hover:bg-[#FFFFFF] border border-[#C5BCB0] rounded text-left transition-colors"
              >
                <div className="text-xs font-bold text-[#994D2B]">Profil Admin</div>
                <div className="text-[11px] text-[#78716C]">Sarah Benali</div>
              </button>
            </div>
          </div>

          {/* Tab Selector: Connexion vs Inscription vs Schéma Supabase */}
          <div className="flex border-b border-[#EAE2D7] text-xs font-semibold">
            <button
              onClick={() => {
                setMode('signin');
                setAuthFeedback(null);
              }}
              className={`flex-1 py-2.5 text-center border-b-2 transition-colors ${
                mode === 'signin'
                  ? 'border-[#2E4036] text-[#2E4036]'
                  : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              Connexion Supabase
            </button>
            <button
              onClick={() => {
                setMode('signup');
                setAuthFeedback(null);
              }}
              className={`flex-1 py-2.5 text-center border-b-2 transition-colors ${
                mode === 'signup'
                  ? 'border-[#2E4036] text-[#2E4036]'
                  : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              Créer un compte
            </button>
            <button
              onClick={() => setMode('sql')}
              className={`flex-1 py-2.5 text-center border-b-2 transition-colors ${
                mode === 'sql'
                  ? 'border-[#994D2B] text-[#994D2B]'
                  : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              Schéma SQL
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

          {mode === 'sql' ? (
            /* SQL Schema Viewer */
            <div className="bg-[#1C1917] text-[#FAF7F2] p-5 rounded-xl border border-[#38332E] space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-[#38332E] pb-3">
                <span className="text-[#994D2B] font-bold flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5" />
                  supabase/migrations/schema.sql
                </span>
                <button
                  onClick={handleCopySql}
                  className="px-2.5 py-1 bg-[#2E4036] hover:bg-[#1E2D25] text-white rounded text-[11px] font-sans flex items-center gap-1 transition-colors"
                >
                  {copiedSql ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSql ? 'Copié !' : 'Copier SQL'}</span>
                </button>
              </div>

              <p className="text-[11px] text-[#A8A196] leading-relaxed font-sans">
                Ce script contient la création des tables <code className="text-[#FAF7F2]">profiles</code>, <code className="text-[#FAF7F2]">events</code>, <code className="text-[#FAF7F2]">registrations</code>, les politiques de sécurité <strong>Row Level Security (RLS)</strong>, le trigger utilisateur et les 5 ateliers d'exemple.
              </p>

              <pre className="max-h-64 overflow-y-auto p-3 bg-[#0F0E0D] rounded border border-[#2E2A27] text-[11px] leading-relaxed text-[#D5CABE]">
                {SUPABASE_SQL_SCHEMA}
              </pre>
            </div>
          ) : (
            /* Auth Form (SignIn or SignUp) */
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
                  <span>{mode === 'signin' ? 'Se connecter via Supabase' : 'Créer mon compte Supabase'}</span>
                </button>
              </form>

              <div className="pt-3 border-t border-[#EAE2D7] text-center">
                <span className="text-xs text-[#78716C]">
                  Authentification gérée par Supabase Auth (sécurisée)
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
