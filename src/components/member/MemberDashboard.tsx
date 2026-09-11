import React, { useState, useEffect } from 'react';
import { Profile, EventItem, MemberRegistrationItem, ActivePage, Writing, WritingCategory } from '../../types';
import {
  fetchMemberRegistrations,
  updateMemberProfile,
  fetchEventsFromSupabase,
  fetchMemberWritings,
  createWriting,
  updateWriting,
  deleteWriting
} from '../../lib/supabase';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  BookOpen,
  User,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  LogOut,
  RefreshCw,
  Compass,
  History,
  Info,
  Feather,
  Plus,
  Edit2,
  Trash2,
  Eye,
  X
} from 'lucide-react';

interface MemberDashboardProps {
  currentUser: Profile;
  onSelectEvent: (event: EventItem) => void;
  onNavigate: (page: ActivePage) => void;
  onLogout: () => void;
  onProfileUpdated?: (updatedProfile: Profile) => void;
  onSelectWriting?: (writing: Writing) => void;
}

type MemberTab = 'overview' | 'writings' | 'registrations' | 'recommended' | 'profile';

export const MemberDashboard: React.FC<MemberDashboardProps> = ({
  currentUser,
  onSelectEvent,
  onNavigate,
  onLogout,
  onProfileUpdated,
  onSelectWriting
}) => {
  const [activeTab, setActiveTab] = useState<MemberTab>('overview');
  const [registrations, setRegistrations] = useState<MemberRegistrationItem[]>([]);
  const [allEvents, setAllEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Writings state
  const [memberWritings, setMemberWritings] = useState<Writing[]>([]);
  const [isLoadingWritings, setIsLoadingWritings] = useState(false);
  const [isCreatingWriting, setIsCreatingWriting] = useState(false);
  const [editingWriting, setEditingWriting] = useState<Writing | null>(null);
  const [writingTitle, setWritingTitle] = useState('');
  const [writingCategory, setWritingCategory] = useState<WritingCategory>('Autre');
  const [writingContent, setWritingContent] = useState('');
  const [isSubmittingWriting, setIsSubmittingWriting] = useState(false);
  const [writingMessage, setWritingMessage] = useState<{ text: string; isError?: boolean } | null>(null);
  const [writingToDelete, setWritingToDelete] = useState<Writing | null>(null);
  const [isDeletingWriting, setIsDeletingWriting] = useState(false);

  // Profile edit form state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [firstName, setFirstName] = useState(currentUser.first_name || '');
  const [lastName, setLastName] = useState(currentUser.last_name || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  // Sync inputs if currentUser updates
  useEffect(() => {
    setFirstName(currentUser.first_name || '');
    setLastName(currentUser.last_name || '');
  }, [currentUser]);

  // Load writings
  const loadWritings = async () => {
    setIsLoadingWritings(true);
    const data = await fetchMemberWritings(currentUser.id);
    setMemberWritings(data);
    setIsLoadingWritings(false);
  };

  // Load member's data from Supabase
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [userRegs, events, writings] = await Promise.all([
        fetchMemberRegistrations(currentUser.id),
        fetchEventsFromSupabase(),
        fetchMemberWritings(currentUser.id)
      ]);
      setRegistrations(userRegs);
      setAllEvents(events);
      setMemberWritings(writings);
    } catch (err) {
      console.error('Error loading member dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser.id]);

  // Separate registrations into upcoming and past based on today's date
  const todayStr = new Date().toISOString().split('T')[0];

  const upcomingRegistrations = registrations
    .filter((r) => r.event.date >= todayStr)
    .sort((a, b) => a.event.date.localeCompare(b.event.date));

  const pastRegistrations = registrations
    .filter((r) => r.event.date < todayStr)
    .sort((a, b) => b.event.date.localeCompare(a.event.date));

  const nextRegistration = upcomingRegistrations.length > 0 ? upcomingRegistrations[0] : null;

  // Recommended events: upcoming, published, with places left, not yet registered
  const registeredEventIds = new Set(registrations.map((r) => r.event.id));
  const recommendedEvents = allEvents
    .filter(
      (e) =>
        e.date >= todayStr &&
        e.status === 'published' &&
        !registeredEventIds.has(e.id) &&
        e.registered_count < e.capacity
    )
    .slice(0, 3);

  // Handle profile save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      setProfileMessage({ text: 'Veuillez renseigner votre prénom.', isError: true });
      return;
    }
    setIsSavingProfile(true);
    setProfileMessage(null);

    const result = await updateMemberProfile(currentUser.id, {
      first_name: firstName,
      last_name: lastName
    });

    setIsSavingProfile(false);
    if (result.success) {
      setProfileMessage({ text: 'Votre profil a bien été mis à jour.', isError: false });
      setIsEditingProfile(false);
      if (onProfileUpdated) {
        onProfileUpdated({
          ...currentUser,
          first_name: firstName.trim(),
          last_name: lastName.trim()
        });
      }
    } else {
      setProfileMessage({
        text: result.error || "Impossible d'enregistrer les modifications. Veuillez réessayer.",
        isError: true
      });
    }
  };

  const handleCancelEdit = () => {
    setFirstName(currentUser.first_name || '');
    setLastName(currentUser.last_name || '');
    setIsEditingProfile(false);
    setProfileMessage(null);
  };

  // Handlers pour les écrits
  const handleOpenCreateWriting = () => {
    setEditingWriting(null);
    setWritingTitle('');
    setWritingCategory('Autre');
    setWritingContent('');
    setWritingMessage(null);
    setIsCreatingWriting(true);
  };

  const handleStartEditWriting = (writing: Writing) => {
    setIsCreatingWriting(false);
    setEditingWriting(writing);
    setWritingTitle(writing.title);
    setWritingCategory(writing.category);
    setWritingContent(writing.content);
    setWritingMessage(null);
  };

  const handleCancelWritingForm = () => {
    setIsCreatingWriting(false);
    setEditingWriting(null);
    setWritingTitle('');
    setWritingCategory('Autre');
    setWritingContent('');
    setWritingMessage(null);
  };

  const handleSaveNewWriting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!writingTitle.trim() || !writingContent.trim()) {
      setWritingMessage({ text: 'Veuillez renseigner un titre et le contenu de votre écrit.', isError: true });
      return;
    }

    setIsSubmittingWriting(true);
    setWritingMessage(null);

    const res = await createWriting({
      title: writingTitle,
      category: writingCategory,
      content: writingContent,
      author_id: currentUser.id
    });

    setIsSubmittingWriting(false);
    if (res.success && res.data) {
      setWritingMessage({ text: 'Votre écrit a bien été publié.', isError: false });
      setIsCreatingWriting(false);
      setWritingTitle('');
      setWritingContent('');
      setWritingCategory('Autre');
      loadWritings();
    } else {
      setWritingMessage({
        text: res.error || "Impossible de publier l'écrit. Veuillez réessayer.",
        isError: true
      });
    }
  };

  const handleSaveEditedWriting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWriting) return;
    if (!writingTitle.trim() || !writingContent.trim()) {
      setWritingMessage({ text: 'Veuillez renseigner un titre et le contenu de votre écrit.', isError: true });
      return;
    }

    setIsSubmittingWriting(true);
    setWritingMessage(null);

    const res = await updateWriting(editingWriting.id, {
      title: writingTitle,
      category: writingCategory,
      content: writingContent
    });

    setIsSubmittingWriting(false);
    if (res.success) {
      setWritingMessage({ text: 'Votre écrit a bien été modifié.', isError: false });
      setEditingWriting(null);
      setWritingTitle('');
      setWritingContent('');
      setWritingCategory('Autre');
      loadWritings();
    } else {
      setWritingMessage({
        text: res.error || "Impossible d'enregistrer les modifications.",
        isError: true
      });
    }
  };

  const handleConfirmDeleteWriting = async () => {
    if (!writingToDelete) return;
    setIsDeletingWriting(true);

    const res = await deleteWriting(writingToDelete.id);
    setIsDeletingWriting(false);
    if (res.success) {
      setWritingToDelete(null);
      setWritingMessage({ text: 'Votre écrit a bien été supprimé.', isError: false });
      loadWritings();
    } else {
      setWritingMessage({
        text: res.error || "Impossible de supprimer l'écrit.",
        isError: true
      });
      setWritingToDelete(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Member Header */}
      <div className="bg-[#FAF7F2] p-6 sm:p-8 rounded-xl border border-[#E7E2DA] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EAE2D7] text-[#2E4036] tracking-wide">
            <BookOpen className="w-3.5 h-3.5 text-[#994D2B]" />
            <span>Adhérent de l'Atelier</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1C1917] font-normal">
            Bonjour {currentUser.first_name}
          </h1>
          <p className="text-xs sm:text-sm text-[#57534E]">
            Retrouvez le suivi de vos ateliers littéraires, vos réservations et les prochaines séances de création.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigate('events')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#FAF7F2] bg-[#2E4036] hover:bg-[#1E2D25] px-4 py-2.5 rounded-md transition-colors shadow-2xs"
          >
            <Compass className="w-4 h-4" />
            <span>Découvrir les ateliers</span>
          </button>
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-2 text-xs font-medium text-[#78716C] hover:text-[#1C1917] bg-[#F5EFE8] hover:bg-[#EAE2D7] px-3.5 py-2.5 rounded-md border border-[#D5CABE] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Se déconnecter</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-[#E7E2DA] gap-2 overflow-x-auto scrollbar-none text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-[#2E4036] text-[#2E4036]'
              : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Mon espace</span>
        </button>

        <button
          onClick={() => setActiveTab('writings')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'writings'
              ? 'border-[#2E4036] text-[#2E4036]'
              : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
          }`}
        >
          <Feather className="w-4 h-4" />
          <span>Mes écrits ({memberWritings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('registrations')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'registrations'
              ? 'border-[#2E4036] text-[#2E4036]'
              : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Mes inscriptions ({upcomingRegistrations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('recommended')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'recommended'
              ? 'border-[#2E4036] text-[#2E4036]'
              : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Vous pourriez aussi aimer</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'profile'
              ? 'border-[#2E4036] text-[#2E4036]'
              : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Mon profil</span>
        </button>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="py-16 text-center text-xs text-[#78716C] flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-[#2E4036]" />
          <span>Chargement de votre espace personnel...</span>
        </div>
      ) : (
        <>
          {/* TAB 1: ACCUEIL DU MEMBRE (OVERVIEW) */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Synthèse 3 cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#FAF7F2] p-5 rounded-xl border border-[#E7E2DA] space-y-1">
                  <span className="text-xs uppercase tracking-wider text-[#78716C] font-semibold">
                    Ateliers à venir
                  </span>
                  <div className="text-3xl font-serif text-[#2E4036] font-medium">
                    {upcomingRegistrations.length}
                  </div>
                  <p className="text-xs text-[#57534E]">
                    {upcomingRegistrations.length > 0
                      ? 'Séance(s) programmée(s) dans votre calendrier'
                      : 'Aucune inscription à venir'}
                  </p>
                </div>

                <div className="bg-[#FAF7F2] p-5 rounded-xl border border-[#E7E2DA] space-y-1">
                  <span className="text-xs uppercase tracking-wider text-[#78716C] font-semibold">
                    Prochaine séance
                  </span>
                  <div className="text-lg font-serif text-[#1C1917] font-medium truncate">
                    {nextRegistration ? nextRegistration.event.formatted_date : 'Aucune date'}
                  </div>
                  <p className="text-xs text-[#57534E] truncate">
                    {nextRegistration ? nextRegistration.event.title : 'Consultez les dates ouvertes'}
                  </p>
                </div>

                <div className="bg-[#FAF7F2] p-5 rounded-xl border border-[#E7E2DA] space-y-1">
                  <span className="text-xs uppercase tracking-wider text-[#78716C] font-semibold">
                    Ateliers suivis
                  </span>
                  <div className="text-3xl font-serif text-[#994D2B] font-medium">
                    {pastRegistrations.length}
                  </div>
                  <p className="text-xs text-[#57534E]">
                    {pastRegistrations.length > 0
                      ? 'Séance(s) passée(s) et partages littéraires'
                      : 'Premier pas à l’Atelier des Mots Libres'}
                  </p>
                </div>
              </div>

              {/* Bloc: Votre prochain atelier OU Message d'accueil chaleureux */}
              {nextRegistration ? (
                <div className="bg-[#FAF7F2] border border-[#2E4036]/30 rounded-xl p-6 sm:p-8 space-y-6 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#994D2B]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Votre prochain atelier</span>
                    </span>
                    <span className="text-xs font-medium px-2.5 py-1 rounded bg-[#E8F0EC] text-[#2E4036] border border-[#C5D9CE]">
                      Inscription confirmée
                    </span>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-serif text-2xl text-[#1C1917] font-medium leading-snug">
                      {nextRegistration.event.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed max-w-3xl">
                      {nextRegistration.event.description}
                    </p>
                  </div>

                  {/* Date, Time, Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#EAE2D7] text-xs text-[#44403C]">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#994D2B] shrink-0" />
                      <span className="capitalize">{nextRegistration.event.formatted_date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#994D2B] shrink-0" />
                      <span>
                        {nextRegistration.event.start_time} - {nextRegistration.event.end_time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#994D2B] shrink-0" />
                      <span className="truncate">{nextRegistration.event.location}</span>
                    </div>
                  </div>

                  {/* Additional info or materials */}
                  {nextRegistration.event.materials && nextRegistration.event.materials.length > 0 && (
                    <div className="p-3 bg-[#F5EFE8] rounded-md border border-[#E7E2DA] text-xs text-[#57534E] flex items-start gap-2">
                      <Info className="w-4 h-4 text-[#994D2B] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-[#1C1917]">À apporter pour la séance :</strong>{' '}
                        {nextRegistration.event.materials.join(', ')}.
                      </span>
                    </div>
                  )}

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => onSelectEvent(nextRegistration.event)}
                      className="inline-flex items-center gap-2 text-xs font-semibold text-[#FAF7F2] bg-[#2E4036] hover:bg-[#1E2D25] px-4 py-2.5 rounded-md transition-colors"
                    >
                      <span>Voir la fiche complète de l'atelier</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Message accueillant si aucune inscription */
                <div className="bg-[#FAF7F2] border border-[#E7E2DA] rounded-xl p-8 sm:p-12 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#EAE2D7] text-[#2E4036] flex items-center justify-center mx-auto">
                    <Compass className="w-6 h-6 text-[#994D2B]" />
                  </div>
                  <div className="space-y-1.5 max-w-md mx-auto">
                    <h3 className="font-serif text-xl font-medium text-[#1C1917]">
                      Aucun atelier programmé pour le moment
                    </h3>
                    <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
                      Explorez l’agenda de la saison, choisissez la formule qui vous inspire (initiation, nouvelle littéraire ou marathon nocturne) et réservez votre place en quelques clics.
                    </p>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => onNavigate('events')}
                      className="inline-flex items-center gap-2 text-xs font-semibold text-[#FAF7F2] bg-[#2E4036] hover:bg-[#1E2D25] px-5 py-2.5 rounded-md transition-colors shadow-2xs"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Découvrir les prochains ateliers</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Suggestions rapides si recommandées */}
              {recommendedEvents.length > 0 && (
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-xl text-[#1C1917] font-medium">
                      Quelques suggestions pour vous
                    </h3>
                    <button
                      onClick={() => onNavigate('events')}
                      className="text-xs font-semibold text-[#994D2B] hover:underline inline-flex items-center gap-1"
                    >
                      <span>Voir tout l'agenda</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {recommendedEvents.map((event) => (
                      <div
                        key={event.id}
                        className="bg-[#FAF7F2] p-5 rounded-xl border border-[#E7E2DA] flex flex-col justify-between space-y-4 hover:border-[#D5CABE] transition-all"
                      >
                        <div className="space-y-2">
                          <span className="text-[11px] font-medium text-[#994D2B] capitalize">
                            {event.formatted_date}
                          </span>
                          <h4 className="font-serif text-base font-medium text-[#1C1917] line-clamp-2">
                            {event.title}
                          </h4>
                          <p className="text-xs text-[#57534E] line-clamp-3">
                            {event.description}
                          </p>
                        </div>
                        <div className="pt-2 flex items-center justify-between border-t border-[#EAE2D7] text-xs">
                          <span className="text-[11px] text-[#78716C]">
                            {event.capacity - event.registered_count} place(s) disponible(s)
                          </span>
                          <button
                            onClick={() => onSelectEvent(event)}
                            className="font-semibold text-[#2E4036] hover:underline"
                          >
                            Découvrir
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: MES ÉCRITS */}
          {activeTab === 'writings' && (
            <div className="space-y-6">
              {/* En-tête de section avec bouton d'action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif text-2xl text-[#1C1917] font-normal">
                    Mes écrits
                  </h3>
                  <p className="text-xs text-[#57534E]">
                    Retrouvez et gérez les textes que vous avez partagés avec les membres de l'atelier.
                  </p>
                </div>

                {!isCreatingWriting && !editingWriting && (
                  <button
                    onClick={handleOpenCreateWriting}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2E4036] hover:bg-[#1E2D25] text-[#FAF7F2] rounded-md text-xs font-semibold transition-colors shadow-2xs self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Publier un écrit</span>
                  </button>
                )}
              </div>

              {/* Message de confirmation / erreur */}
              {writingMessage && (
                <div
                  className={`p-3.5 rounded-lg text-xs flex items-center gap-2.5 border ${
                    writingMessage.isError
                      ? 'bg-rose-50 border-rose-200 text-rose-800'
                      : 'bg-[#E8F0EC] border-[#C5D9CE] text-[#2E4036]'
                  }`}
                >
                  {writingMessage.isError ? (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  ) : (
                    <CheckCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span className="font-medium">{writingMessage.text}</span>
                </div>
              )}

              {/* FORMULAIRE DE PUBLICATION / ÉDITION */}
              {(isCreatingWriting || editingWriting) && (
                <form
                  onSubmit={isCreatingWriting ? handleSaveNewWriting : handleSaveEditedWriting}
                  className="bg-[#FAF7F2] p-6 sm:p-8 rounded-xl border border-[#E7E2DA] shadow-xs space-y-5"
                >
                  <div className="space-y-1 pb-3 border-b border-[#EAE2D7]">
                    <h4 className="font-serif text-xl text-[#1C1917] font-medium">
                      {isCreatingWriting ? 'Publier un écrit' : 'Modifier mon écrit'}
                    </h4>
                    <p className="text-xs text-[#78716C]">
                      {isCreatingWriting
                        ? "Partagez votre nouvelle, poésie ou fragment d'écriture. Il sera automatiquement signé à votre nom."
                        : "Modifiez le titre, la catégorie ou le contenu de votre publication."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Titre (obligatoire) */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1.5">
                        Titre <span className="text-[#994D2B]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={writingTitle}
                        onChange={(e) => setWritingTitle(e.target.value)}
                        placeholder="Le titre de votre écrit..."
                        className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-[#D5CABE] rounded-md text-xs text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#2E4036]"
                      />
                    </div>

                    {/* Catégorie (facultative) */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1.5">
                        Catégorie
                      </label>
                      <select
                        value={writingCategory}
                        onChange={(e) => setWritingCategory(e.target.value as WritingCategory)}
                        className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-[#D5CABE] rounded-md text-xs text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#2E4036]"
                      >
                        <option value="Nouvelle">Nouvelle</option>
                        <option value="Poésie">Poésie</option>
                        <option value="Récit">Récit</option>
                        <option value="Autre">Autre</option>
                      </select>
                    </div>
                  </div>

                  {/* Contenu (obligatoire) */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1.5">
                      Contenu de l'écrit <span className="text-[#994D2B]">*</span>
                    </label>
                    <textarea
                      required
                      rows={10}
                      value={writingContent}
                      onChange={(e) => setWritingContent(e.target.value)}
                      placeholder="Tapez ou collez ici votre texte..."
                      className="w-full px-3.5 py-3 bg-[#FDFBF7] border border-[#D5CABE] rounded-md text-xs text-[#1C1917] font-serif text-sm leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#2E4036]"
                    />
                  </div>

                  {/* Boutons d'actions du formulaire */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
                    <button
                      type="button"
                      disabled={isSubmittingWriting}
                      onClick={handleCancelWritingForm}
                      className="w-full sm:w-auto px-4 py-2.5 text-xs font-medium text-[#78716C] hover:text-[#1C1917] rounded-md border border-[#D5CABE] hover:bg-[#EAE2D7] transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingWriting}
                      className="w-full sm:w-auto px-5 py-2.5 bg-[#2E4036] hover:bg-[#1E2D25] disabled:opacity-50 text-[#FAF7F2] rounded-md text-xs font-semibold transition-colors shadow-2xs flex items-center justify-center gap-2"
                    >
                      {isSubmittingWriting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                      <span>
                        {isSubmittingWriting
                          ? isCreatingWriting
                            ? 'Publication en cours...'
                            : 'Enregistrement...'
                          : isCreatingWriting
                          ? 'Publier'
                          : 'Enregistrer les modifications'}
                      </span>
                    </button>
                  </div>
                </form>
              )}

              {/* LISTE DES ÉCRITS DU MEMBRE */}
              {isLoadingWritings ? (
                <div className="py-12 text-center text-xs text-[#78716C] flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#2E4036]" />
                  <span>Chargement de vos écrits...</span>
                </div>
              ) : memberWritings.length === 0 ? (
                <div className="bg-[#FAF7F2] p-10 rounded-xl border border-[#E7E2DA] text-center space-y-3">
                  <Feather className="w-8 h-8 text-[#994D2B] mx-auto opacity-75" />
                  <h4 className="font-serif text-lg text-[#1C1917]">Vous n'avez pas encore publié d'écrit</h4>
                  <p className="text-xs text-[#57534E] max-w-md mx-auto">
                    Partagez votre première nouvelle, poème ou fragment d'atelier pour le rendre visible auprès des membres et sur la page d'accueil de l'association.
                  </p>
                  <button
                    onClick={handleOpenCreateWriting}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#2E4036] hover:bg-[#1E2D25] text-[#FAF7F2] rounded-md text-xs font-semibold transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Publier un premier écrit</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {memberWritings.map((w) => {
                    const formattedDate = new Date(w.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    });

                    return (
                      <div
                        key={w.id}
                        className="bg-[#FAF7F2] p-5 sm:p-6 rounded-xl border border-[#E7E2DA] hover:border-[#D5CABE] transition-all space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span className="px-2.5 py-0.5 rounded text-[11px] font-medium bg-[#EAE2D7] text-[#2E4036]">
                              {w.category}
                            </span>
                            <span className="text-xs text-[#78716C] flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-[#994D2B]" />
                              <span>Publié le {formattedDate}</span>
                            </span>
                          </div>

                          {/* Boutons d'action : Lire, Modifier, Supprimer */}
                          <div className="flex items-center gap-2 self-end sm:self-auto">
                            {onSelectWriting && (
                              <button
                                onClick={() => onSelectWriting(w)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium text-[#2E4036] bg-[#EAE2D7] hover:bg-[#D5CABE] transition-colors"
                                title="Lire la publication complète"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Lire</span>
                              </button>
                            )}

                            <button
                              onClick={() => handleStartEditWriting(w)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium text-[#57534E] hover:text-[#1C1917] bg-[#F5EFE8] hover:bg-[#EAE2D7] border border-[#D5CABE] transition-colors"
                              title="Modifier cet écrit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Modifier</span>
                            </button>

                            <button
                              onClick={() => setWritingToDelete(w)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
                              title="Supprimer cet écrit"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Supprimer</span>
                            </button>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-serif text-lg text-[#1C1917] font-medium">
                            {w.title}
                          </h4>
                          <p className="text-xs text-[#57534E] font-serif italic mt-1.5 line-clamp-3 leading-relaxed">
                            « {w.content} »
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MES INSCRIPTIONS */}
          {activeTab === 'registrations' && (
            <div className="space-y-8">
              {/* Section À VENIR */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xl text-[#1C1917] font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#994D2B]" />
                    <span>Inscriptions à venir ({upcomingRegistrations.length})</span>
                  </h3>
                </div>

                {upcomingRegistrations.length === 0 ? (
                  <div className="bg-[#FAF7F2] p-8 rounded-xl border border-[#E7E2DA] text-center space-y-3">
                    <p className="text-xs text-[#57534E]">
                      Vous n’avez aucune inscription active pour les semaines à venir.
                    </p>
                    <button
                      onClick={() => onNavigate('events')}
                      className="inline-flex items-center gap-2 text-xs font-semibold text-[#2E4036] hover:underline"
                    >
                      <span>Consulter l'agenda des ateliers</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcomingRegistrations.map((reg) => (
                      <div
                        key={reg.id}
                        className="bg-[#FAF7F2] p-5 sm:p-6 rounded-xl border border-[#E7E2DA] flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#D5CABE] transition-all"
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-medium px-2.5 py-0.5 rounded bg-[#E8F0EC] text-[#2E4036] border border-[#C5D9CE]">
                              {reg.status === 'confirmed' ? 'Confirmé' : reg.status}
                            </span>
                            <span className="text-xs text-[#78716C] capitalize">
                              {reg.event.formatted_date}
                            </span>
                          </div>
                          <h4 className="font-serif text-lg text-[#1C1917] font-medium">
                            {reg.event.title}
                          </h4>
                          <div className="flex flex-wrap items-center gap-4 text-xs text-[#57534E] pt-1">
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-[#994D2B]" />
                              {reg.event.start_time} - {reg.event.end_time}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-[#994D2B]" />
                              {reg.event.location}
                            </span>
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center">
                          <button
                            onClick={() => onSelectEvent(reg.event)}
                            className="w-full sm:w-auto px-4 py-2 bg-[#2E4036] hover:bg-[#1E2D25] text-[#FAF7F2] rounded-md text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                          >
                            <span>Voir l'atelier</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Section PASSÉS */}
              <div className="space-y-4 pt-6 border-t border-[#E7E2DA]">
                <h3 className="font-serif text-xl text-[#1C1917] font-medium flex items-center gap-2">
                  <History className="w-4 h-4 text-[#78716C]" />
                  <span>Historique des ateliers passés ({pastRegistrations.length})</span>
                </h3>

                {pastRegistrations.length === 0 ? (
                  <p className="text-xs text-[#78716C] italic">
                    Aucun atelier passé enregistré dans votre historique.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {pastRegistrations.map((reg) => (
                      <div
                        key={reg.id}
                        className="bg-[#FAF7F2]/70 p-4 sm:p-5 rounded-xl border border-[#E7E2DA] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#EAE2D7] text-[#57534E]">
                              Séance passée
                            </span>
                            <span className="text-[#78716C] capitalize">
                              {reg.event.formatted_date}
                            </span>
                          </div>
                          <h4 className="font-serif text-base text-[#1C1917] font-medium">
                            {reg.event.title}
                          </h4>
                          <p className="text-[11px] text-[#78716C]">
                            Lieu : {reg.event.location}
                          </p>
                        </div>

                        <button
                          onClick={() => onSelectEvent(reg.event)}
                          className="text-xs font-semibold text-[#2E4036] hover:underline self-start md:self-center"
                        >
                          Revoir la fiche
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ATELIERS RECOMMANDÉS */}
          {activeTab === 'recommended' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="font-serif text-2xl text-[#1C1917] font-normal">
                  Vous pourriez aussi aimer
                </h3>
                <p className="text-xs sm:text-sm text-[#57534E]">
                  Sélection d’ateliers d'écriture et masterclasses à venir, ouverts aux inscriptions et compatibles avec votre parcours.
                </p>
              </div>

              {recommendedEvents.length === 0 ? (
                <div className="bg-[#FAF7F2] p-8 rounded-xl border border-[#E7E2DA] text-center space-y-3">
                  <p className="text-xs text-[#57534E]">
                    Aucune nouvelle proposition disponible pour le moment.
                  </p>
                  <button
                    onClick={() => onNavigate('events')}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#2E4036] hover:underline"
                  >
                    <span>Consulter le calendrier complet</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {recommendedEvents.map((event) => {
                    const placesLeft = Math.max(0, event.capacity - event.registered_count);
                    return (
                      <div
                        key={event.id}
                        className="bg-[#FAF7F2] rounded-xl border border-[#E7E2DA] p-6 flex flex-col justify-between space-y-4 hover:border-[#D5CABE] transition-all shadow-2xs"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="capitalize font-semibold text-[#994D2B]">
                              {event.formatted_date}
                            </span>
                            <span className="text-[11px] px-2 py-0.5 rounded bg-[#EAE2D7] text-[#44403C]">
                              {placesLeft} place{placesLeft > 1 ? 's' : ''} libre{placesLeft > 1 ? 's' : ''}
                            </span>
                          </div>

                          <h4 className="font-serif text-lg font-medium text-[#1C1917] leading-snug">
                            {event.title}
                          </h4>

                          <p className="text-xs text-[#57534E] leading-relaxed line-clamp-3">
                            {event.description}
                          </p>

                          <div className="pt-2 text-xs text-[#78716C] flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-[#994D2B] shrink-0" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-[#EAE2D7] flex items-center justify-between">
                          <span className="text-xs font-medium text-[#2E4036]">
                            {event.price || 'Tarif adhérent'}
                          </span>
                          <button
                            onClick={() => onSelectEvent(event)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#FAF7F2] bg-[#2E4036] hover:bg-[#1E2D25] px-3 py-1.5 rounded transition-colors"
                          >
                            <span>Découvrir</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: MON PROFIL */}
          {activeTab === 'profile' && (
            <div className="max-w-xl mx-auto space-y-6">
              <div className="space-y-1 text-center">
                <h3 className="font-serif text-2xl text-[#1C1917] font-normal">
                  Mon profil
                </h3>
                <p className="text-xs text-[#57534E]">
                  Consultez et modifiez les coordonnées associées à votre adhésion.
                </p>
              </div>

              {profileMessage && (
                <div
                  className={`p-3.5 rounded-lg text-xs flex items-center gap-2.5 border ${
                    profileMessage.isError
                      ? 'bg-rose-50 border-rose-200 text-rose-800'
                      : 'bg-[#E8F0EC] border-[#C5D9CE] text-[#2E4036]'
                  }`}
                >
                  {profileMessage.isError ? (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  ) : (
                    <CheckCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span className="font-medium">{profileMessage.text}</span>
                </div>
              )}

              {!isEditingProfile ? (
                /* MODE CONSULTATION */
                <div className="bg-[#FAF7F2] p-6 sm:p-8 rounded-xl border border-[#E7E2DA] shadow-xs space-y-6">
                  <div className="flex items-center gap-4 pb-5 border-b border-[#EAE2D7]">
                    <div className="w-14 h-14 rounded-full bg-[#EAE2D7] text-[#2E4036] flex items-center justify-center font-serif text-xl font-medium">
                      {currentUser.first_name?.[0] || 'A'}
                    </div>
                    <div>
                      <h4 className="font-serif text-xl text-[#1C1917] font-medium leading-tight">
                        {currentUser.first_name} {currentUser.last_name}
                      </h4>
                      <span className="text-xs text-[#78716C]">{currentUser.email}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="bg-[#FDFBF7] p-3.5 rounded-lg border border-[#EAE2D7] space-y-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#78716C] block">
                        Prénom
                      </span>
                      <span className="text-sm font-medium text-[#1C1917] block">
                        {currentUser.first_name || '—'}
                      </span>
                    </div>

                    <div className="bg-[#FDFBF7] p-3.5 rounded-lg border border-[#EAE2D7] space-y-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#78716C] block">
                        Nom
                      </span>
                      <span className="text-sm font-medium text-[#1C1917] block">
                        {currentUser.last_name || '—'}
                      </span>
                    </div>

                    <div className="bg-[#FDFBF7] p-3.5 rounded-lg border border-[#EAE2D7] space-y-1 sm:col-span-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#78716C] block">
                        Adresse e-mail
                      </span>
                      <span className="text-sm font-medium text-[#1C1917] block">
                        {currentUser.email}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setFirstName(currentUser.first_name || '');
                        setLastName(currentUser.last_name || '');
                        setProfileMessage(null);
                        setIsEditingProfile(true);
                      }}
                      className="px-4 py-2.5 bg-[#2E4036] hover:bg-[#1E2D25] text-[#FAF7F2] rounded-md text-xs font-semibold transition-colors shadow-2xs flex items-center gap-2"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Modifier mon profil</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* MODE ÉDITION */
                <form
                  onSubmit={handleSaveProfile}
                  className="bg-[#FAF7F2] p-6 sm:p-8 rounded-xl border border-[#E7E2DA] shadow-xs space-y-5"
                >
                  <div className="space-y-1 pb-2 border-b border-[#EAE2D7]">
                    <h4 className="font-serif text-lg text-[#1C1917] font-medium">
                      Modifier mes coordonnées
                    </h4>
                    <p className="text-xs text-[#78716C]">
                      Renseignez votre prénom et votre nom d'usage.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1.5">
                        Prénom
                      </label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Votre prénom"
                        className="w-full px-3 py-2.5 bg-[#FDFBF7] border border-[#D5CABE] rounded-md text-xs text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#2E4036]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1.5">
                        Nom
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Votre nom"
                        className="w-full px-3 py-2.5 bg-[#FDFBF7] border border-[#D5CABE] rounded-md text-xs text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#2E4036]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1.5">
                      Adresse e-mail
                    </label>
                    <input
                      type="email"
                      disabled
                      value={currentUser.email}
                      className="w-full px-3 py-2.5 bg-[#EAE2D7]/50 border border-[#D5CABE] rounded-md text-xs text-[#78716C] cursor-not-allowed"
                    />
                    <span className="text-[11px] text-[#78716C] mt-1.5 block">
                      L'adresse e-mail n'est pas modifiable dans cette version.
                    </span>
                  </div>

                  <div className="pt-3 flex flex-col sm:flex-row items-center justify-end gap-3">
                    <button
                      type="button"
                      disabled={isSavingProfile}
                      onClick={handleCancelEdit}
                      className="w-full sm:w-auto px-4 py-2.5 text-xs font-medium text-[#78716C] hover:text-[#1C1917] rounded-md border border-[#D5CABE] hover:bg-[#EAE2D7] transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingProfile}
                      className="w-full sm:w-auto px-5 py-2.5 bg-[#2E4036] hover:bg-[#1E2D25] disabled:opacity-50 text-[#FAF7F2] rounded-md text-xs font-semibold transition-colors shadow-2xs flex items-center justify-center gap-2"
                    >
                      {isSavingProfile && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                      <span>{isSavingProfile ? 'Modification en cours...' : 'Enregistrer les modifications'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </>
      )}

      {/* MODALE DE CONFIRMATION DE SUPPRESSION D'UN ÉCRIT */}
      {writingToDelete && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] max-w-md w-full p-6 rounded-xl border border-[#E7E2DA] shadow-xl space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <button
                onClick={() => setWritingToDelete(null)}
                className="text-[#78716C] hover:text-[#1C1917] p-1 rounded-md hover:bg-[#EAE2D7]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-serif text-lg text-[#1C1917] font-medium">
                Supprimer cet écrit ?
              </h4>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Êtes-vous sûr de vouloir supprimer définitivement « <span className="font-semibold text-[#1C1917]">{writingToDelete.title}</span> » ? Cette action est irréversible.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={isDeletingWriting}
                onClick={() => setWritingToDelete(null)}
                className="px-4 py-2 text-xs font-medium text-[#57534E] hover:text-[#1C1917] bg-[#F5EFE8] hover:bg-[#EAE2D7] rounded-md border border-[#D5CABE] transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={isDeletingWriting}
                onClick={handleConfirmDeleteWriting}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 disabled:opacity-50 rounded-md transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                {isDeletingWriting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>{isDeletingWriting ? 'Suppression...' : 'Confirmer la suppression'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
