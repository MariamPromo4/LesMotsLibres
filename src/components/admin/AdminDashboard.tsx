import React, { useState, useEffect } from 'react';
import { Profile, EventItem, AdminRegistrationItem, ActivePage, Writing } from '../../types';
import {
  fetchAdminMetrics,
  fetchAdminEvents,
  fetchAdminMembers,
  fetchAdminRegistrations,
  deleteAdminEvent,
  updateMemberProfile,
  fetchAdminWritings,
  deleteWriting
} from '../../lib/supabase';
import { AdminEventModal } from './AdminEventModal';
import { AdminEventDetailModal } from './AdminEventDetailModal';
import { AdminMemberDetailModal } from './AdminMemberDetailModal';
import {
  BarChart3,
  Calendar,
  Users,
  ClipboardList,
  Plus,
  RefreshCw,
  Edit2,
  Trash2,
  Eye,
  FileSpreadsheet,
  AlertTriangle,
  ArrowLeft,
  LogOut,
  ShieldCheck,
  ShieldAlert,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Clock,
  MapPin,
  User,
  Feather,
  X
} from 'lucide-react';

interface AdminDashboardProps {
  currentUser: Profile | null;
  onNavigate: (page: ActivePage) => void;
  onLogout: () => void;
  onSelectEventPublic?: (event: EventItem) => void;
  onProfileUpdated?: (updatedProfile: Profile) => void;
  onSelectWriting?: (writing: Writing) => void;
}

type AdminTab = 'metrics' | 'events' | 'members' | 'registrations' | 'writings' | 'profile';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  onNavigate,
  onLogout,
  onProfileUpdated,
  onSelectWriting
}) => {
  // Access Control: check if current user is admin
  const isAdmin = currentUser?.role === 'admin';

  const [activeTab, setActiveTab] = useState<AdminTab>('metrics');
  const [isLoading, setIsLoading] = useState(true);

  // Admin profile state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [adminFirstName, setAdminFirstName] = useState(currentUser?.first_name || '');
  const [adminLastName, setAdminLastName] = useState(currentUser?.last_name || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  useEffect(() => {
    if (currentUser) {
      setAdminFirstName(currentUser.first_name || '');
      setAdminLastName(currentUser.last_name || '');
    }
  }, [currentUser]);

  // Metrics state
  const [metrics, setMetrics] = useState({
    totalMembers: 0,
    totalEvents: 0,
    upcomingEvents: 0,
    totalRegistrations: 0,
    upcomingRegistrations: 0
  });

  // Data states
  const [events, setEvents] = useState<EventItem[]>([]);
  const [members, setMembers] = useState<Array<Profile & { registrations_count: number }>>([]);
  const [registrations, setRegistrations] = useState<AdminRegistrationItem[]>([]);
  const [writings, setWritings] = useState<Writing[]>([]);

  // Writings admin states
  const [searchWritingQuery, setSearchWritingQuery] = useState('');
  const [writingCategoryFilter, setWritingCategoryFilter] = useState<string>('all');
  const [writingToDelete, setWritingToDelete] = useState<Writing | null>(null);
  const [isDeletingWriting, setIsDeletingWriting] = useState(false);
  const [writingActionMessage, setWritingActionMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  // Modals state
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  const [selectedEventDetail, setSelectedEventDetail] = useState<EventItem | null>(null);
  const [selectedMemberDetail, setSelectedMemberDetail] = useState<
    (Profile & { registrations_count?: number }) | null
  >(null);

  // Deletion confirmation state
  const [eventToDelete, setEventToDelete] = useState<EventItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filters for registrations view
  const [regFilterEvent, setRegFilterEvent] = useState<string>('all');
  const [regFilterTime, setRegFilterTime] = useState<'all' | 'upcoming' | 'past'>('all');
  const [searchMemberQuery, setSearchMemberQuery] = useState('');

  // Load all admin data
  const loadAdminData = async () => {
    if (!isAdmin) return;
    setIsLoading(true);
    try {
      const [met, evs, mems, regs, wrs] = await Promise.all([
        fetchAdminMetrics(),
        fetchAdminEvents(),
        fetchAdminMembers(),
        fetchAdminRegistrations(),
        fetchAdminWritings()
      ]);
      setMetrics(met);
      setEvents(evs);
      setMembers(mems);
      setRegistrations(regs);
      setWritings(wrs);
    } catch (err) {
      console.error('Error loading admin dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDeleteWriting = async () => {
    if (!writingToDelete) return;
    setIsDeletingWriting(true);
    const res = await deleteWriting(writingToDelete.id);
    setIsDeletingWriting(false);
    if (res.success) {
      setWritingActionMessage({ text: 'La publication a bien été supprimée.', isError: false });
      setWritingToDelete(null);
      // Actualiser les écrits
      const updatedWritings = await fetchAdminWritings();
      setWritings(updatedWritings);
    } else {
      setWritingActionMessage({
        text: res.error || 'Erreur lors de la suppression.',
        isError: true
      });
      setWritingToDelete(null);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  // If unauthorized:
  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h2 className="font-serif text-2xl text-[#1C1917] font-medium">
          Accès réservé à l'administration
        </h2>
        <p className="text-xs sm:text-sm text-[#57534E] max-w-md mx-auto">
          Votre compte ne dispose pas des droits nécessaires pour accéder à cet espace de gestion.
        </p>
        <div className="pt-2">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#FAF7F2] bg-[#2E4036] hover:bg-[#1E2D25] px-4 py-2.5 rounded-md transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retourner au site public</span>
          </button>
        </div>
      </div>
    );
  }

  const todayStr = new Date().toISOString().split('T')[0];

  // Upcoming events for dashboard table
  const upcomingEventsList = events
    .filter((e) => e.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date));

  // Handle Event deletion
  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;
    setIsDeleting(true);
    const res = await deleteAdminEvent(eventToDelete.id);
    setIsDeleting(false);
    if (res.success) {
      setEventToDelete(null);
      loadAdminData();
    } else {
      alert(res.error || 'Erreur lors de la suppression de l’atelier.');
    }
  };

  // Filter registrations
  const filteredRegistrations = registrations.filter((r) => {
    if (regFilterEvent !== 'all' && r.event_id !== regFilterEvent) {
      return false;
    }
    if (regFilterTime === 'upcoming' && r.event && r.event.date < todayStr) {
      return false;
    }
    if (regFilterTime === 'past' && r.event && r.event.date >= todayStr) {
      return false;
    }
    return true;
  });

  // Filter members by search query
  const filteredMembers = members.filter((m) => {
    if (!searchMemberQuery.trim()) return true;
    const q = searchMemberQuery.toLowerCase();
    return (
      m.first_name.toLowerCase().includes(q) ||
      m.last_name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q)
    );
  });

  // Export registrations as CSV
  const handleExportRegistrationsCSV = () => {
    if (filteredRegistrations.length === 0) return;
    const headers = ['Prénom', 'Nom', 'Email', 'Atelier', 'Date de l’atelier', 'Statut d’inscription'];
    const rows = filteredRegistrations.map((r) => [
      `"${r.profile?.first_name || ''}"`,
      `"${r.profile?.last_name || ''}"`,
      `"${r.profile?.email || ''}"`,
      `"${r.event?.title || ''}"`,
      `"${r.event?.date || ''}"`,
      `"${r.status === 'confirmed' ? 'Confirmé' : r.status}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((row) => row.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `inscriptions_les_mots_libres_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveAdminProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!adminFirstName.trim()) {
      setProfileMessage({ text: 'Veuillez renseigner votre prénom.', isError: true });
      return;
    }
    setIsSavingProfile(true);
    setProfileMessage(null);

    const result = await updateMemberProfile(currentUser.id, {
      first_name: adminFirstName,
      last_name: adminLastName
    });

    setIsSavingProfile(false);
    if (result.success) {
      setProfileMessage({ text: 'Votre profil a bien été mis à jour.', isError: false });
      setIsEditingProfile(false);
      if (onProfileUpdated) {
        onProfileUpdated({
          ...currentUser,
          first_name: adminFirstName.trim(),
          last_name: adminLastName.trim()
        });
      }
    } else {
      setProfileMessage({
        text: result.error || "Impossible d'enregistrer les modifications. Veuillez réessayer.",
        isError: true
      });
    }
  };

  const handleCancelAdminEdit = () => {
    setAdminFirstName(currentUser?.first_name || '');
    setAdminLastName(currentUser?.last_name || '');
    setIsEditingProfile(false);
    setProfileMessage(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-8">
      {/* Admin Header */}
      <div className="bg-[#FAF7F2] p-6 sm:p-8 rounded-xl border border-[#D5CABE] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#2E4036] text-[#FAF7F2] tracking-wide">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C5D9CE]" />
            <span>Pilotage & Administration</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1C1917] font-normal">
            Espace Administrateur
          </h1>
          <p className="text-xs sm:text-sm text-[#57534E]">
            Supervision globale de l'association, des adhésions, des ateliers et des inscriptions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => loadAdminData()}
            disabled={isLoading}
            className="inline-flex items-center gap-2 text-xs font-medium text-[#44403C] hover:text-[#1C1917] bg-[#F5EFE8] hover:bg-[#EAE2D7] px-3.5 py-2.5 rounded-md border border-[#D5CABE] transition-colors"
            title="Actualiser les données"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#2E4036]' : ''}`} />
            <span>Actualiser</span>
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 text-xs font-medium text-[#44403C] hover:text-[#1C1917] bg-[#F5EFE8] hover:bg-[#EAE2D7] px-3.5 py-2.5 rounded-md border border-[#D5CABE] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Retour au site</span>
          </button>
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-2 text-xs font-medium text-rose-800 hover:text-rose-950 bg-rose-50 hover:bg-rose-100 px-3.5 py-2.5 rounded-md border border-rose-200 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Se déconnecter</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-[#E7E2DA] gap-2 overflow-x-auto scrollbar-none text-xs font-semibold">
        <button
          onClick={() => setActiveTab('metrics')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'metrics'
              ? 'border-[#2E4036] text-[#2E4036]'
              : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Tableau de bord</span>
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'events'
              ? 'border-[#2E4036] text-[#2E4036]'
              : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Ateliers ({events.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('members')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'members'
              ? 'border-[#2E4036] text-[#2E4036]'
              : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Membres ({members.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('registrations')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'registrations'
              ? 'border-[#2E4036] text-[#2E4036]'
              : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>Inscriptions ({registrations.length})</span>
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
          <span>Publications ({writings.length})</span>
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

      {isLoading ? (
        <div className="py-16 text-center text-xs text-[#78716C] flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-[#2E4036]" />
          <span>Calcul des données et synchronisation...</span>
        </div>
      ) : (
        <>
          {/* TAB 1: TABLEAU DE BORD (METRICS & NEXT ATELIERS) */}
          {activeTab === 'metrics' && (
            <div className="space-y-8">
              {/* Synthèse en haut: 4 Blocs d'indicateurs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Membres */}
                <div className="bg-[#FAF7F2] p-5 rounded-xl border border-[#E7E2DA] space-y-1">
                  <div className="flex items-center justify-between text-xs text-[#78716C] uppercase font-semibold">
                    <span>Membres</span>
                    <Users className="w-4 h-4 text-[#2E4036]" />
                  </div>
                  <div className="text-3xl font-serif text-[#1C1917] font-medium">
                    {metrics.totalMembers}
                  </div>
                  <p className="text-xs text-[#57534E]">
                    Adhérents inscrits à l'association
                  </p>
                </div>

                {/* 2. Ateliers Total & À venir */}
                <div className="bg-[#FAF7F2] p-5 rounded-xl border border-[#E7E2DA] space-y-1">
                  <div className="flex items-center justify-between text-xs text-[#78716C] uppercase font-semibold">
                    <span>Ateliers</span>
                    <Calendar className="w-4 h-4 text-[#994D2B]" />
                  </div>
                  <div className="text-3xl font-serif text-[#2E4036] font-medium">
                    {metrics.totalEvents}
                  </div>
                  <p className="text-xs text-[#57534E]">
                    <strong className="text-[#994D2B]">{metrics.upcomingEvents}</strong> atelier(s) à venir
                  </p>
                </div>

                {/* 3. Inscriptions totales */}
                <div className="bg-[#FAF7F2] p-5 rounded-xl border border-[#E7E2DA] space-y-1">
                  <div className="flex items-center justify-between text-xs text-[#78716C] uppercase font-semibold">
                    <span>Inscriptions</span>
                    <ClipboardList className="w-4 h-4 text-[#2E4036]" />
                  </div>
                  <div className="text-3xl font-serif text-[#1C1917] font-medium">
                    {metrics.totalRegistrations}
                  </div>
                  <p className="text-xs text-[#57534E]">
                    Toutes séances confondues
                  </p>
                </div>

                {/* 4. Inscriptions à venir */}
                <div className="bg-[#FAF7F2] p-5 rounded-xl border border-[#E7E2DA] space-y-1">
                  <div className="flex items-center justify-between text-xs text-[#78716C] uppercase font-semibold">
                    <span>À venir</span>
                    <Clock className="w-4 h-4 text-[#994D2B]" />
                  </div>
                  <div className="text-3xl font-serif text-[#994D2B] font-medium">
                    {metrics.upcomingRegistrations}
                  </div>
                  <p className="text-xs text-[#57534E]">
                    Réservations pour les prochains ateliers
                  </p>
                </div>
              </div>

              {/* Section: Prochains ateliers avec jauges & taux de remplissage */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="font-serif text-xl text-[#1C1917] font-medium">
                      Prochains ateliers
                    </h3>
                    <p className="text-xs text-[#57534E]">
                      Capacité, participants confirmés et taux de remplissage calculés en direct.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingEvent(null);
                      setIsEventModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FAF7F2] bg-[#2E4036] hover:bg-[#1E2D25] px-3.5 py-2 rounded-md transition-colors shadow-2xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Créer un atelier</span>
                  </button>
                </div>

                {upcomingEventsList.length === 0 ? (
                  <div className="p-8 bg-[#FAF7F2] rounded-xl border border-[#E7E2DA] text-center text-xs text-[#57534E]">
                    Aucun atelier programmé pour les semaines à venir.
                  </div>
                ) : (
                  <div className="border border-[#E7E2DA] rounded-xl overflow-hidden shadow-2xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#EAE2D7] text-[#44403C] uppercase text-[10px] tracking-wider font-semibold">
                          <tr>
                            <th className="px-5 py-3">Atelier</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Capacité</th>
                            <th className="px-4 py-3">Inscrits</th>
                            <th className="px-4 py-3">Places restantes</th>
                            <th className="px-5 py-3">Taux de remplissage</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#EAE2D7] bg-[#FAF7F2]">
                          {upcomingEventsList.map((event) => {
                            const count = event.registered_count;
                            const placesLeft = Math.max(0, event.capacity - count);
                            const fillRate =
                              event.capacity > 0
                                ? Math.min(100, Math.round((count / event.capacity) * 100))
                                : 0;

                            return (
                              <tr key={event.id} className="hover:bg-[#F5EFE8] transition-colors">
                                <td className="px-5 py-3.5">
                                  <div className="font-medium text-[#1C1917] line-clamp-1">
                                    {event.title}
                                  </div>
                                  <div className="text-[11px] text-[#78716C] line-clamp-1">
                                    {event.animator.name} — {event.location}
                                  </div>
                                </td>
                                <td className="px-4 py-3.5 capitalize text-[#44403C] whitespace-nowrap">
                                  {event.formatted_date}
                                </td>
                                <td className="px-4 py-3.5 font-medium text-[#1C1917]">
                                  {event.capacity} places
                                </td>
                                <td className="px-4 py-3.5 font-medium text-[#2E4036]">
                                  {count} inscrit(s)
                                </td>
                                <td className="px-4 py-3.5">
                                  <span
                                    className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                                      placesLeft === 0
                                        ? 'bg-rose-100 text-rose-800'
                                        : 'bg-[#E8F0EC] text-[#2E4036]'
                                    }`}
                                  >
                                    {placesLeft === 0 ? 'Complet' : `${placesLeft} libre(s)`}
                                  </span>
                                </td>
                                <td className="px-5 py-3.5">
                                  <div className="w-36 space-y-1">
                                    <div className="flex items-center justify-between text-[11px] text-[#57534E]">
                                      <span>{fillRate} %</span>
                                      <span>
                                        {count} / {event.capacity}
                                      </span>
                                    </div>
                                    <div className="w-full h-2 bg-[#EAE2D7] rounded-full overflow-hidden">
                                      <div
                                        className={`h-full transition-all duration-300 ${
                                          fillRate >= 100 ? 'bg-[#994D2B]' : 'bg-[#2E4036]'
                                        }`}
                                        style={{ width: `${fillRate}%` }}
                                      />
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3.5 text-right whitespace-nowrap">
                                  <button
                                    onClick={() => setSelectedEventDetail(event)}
                                    className="text-xs font-semibold text-[#2E4036] hover:underline px-2 py-1"
                                  >
                                    Voir la fiche
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: GESTION DES ATELIERS */}
          {activeTab === 'events' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif text-xl text-[#1C1917] font-medium">
                    Tous les ateliers & séances
                  </h3>
                  <p className="text-xs text-[#57534E]">
                    Consultez, modifiez, créez ou supprimez les événements du catalogue.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingEvent(null);
                    setIsEventModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FAF7F2] bg-[#2E4036] hover:bg-[#1E2D25] px-4 py-2.5 rounded-md transition-colors shadow-2xs self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Créer un atelier</span>
                </button>
              </div>

              <div className="border border-[#E7E2DA] rounded-xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#EAE2D7] text-[#44403C] uppercase text-[10px] tracking-wider font-semibold">
                      <tr>
                        <th className="px-5 py-3">Titre</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Lieu</th>
                        <th className="px-4 py-3">Capacité</th>
                        <th className="px-4 py-3">Inscrits</th>
                        <th className="px-4 py-3">Statut</th>
                        <th className="px-5 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAE2D7] bg-[#FAF7F2]">
                      {events.map((event) => (
                        <tr key={event.id} className="hover:bg-[#F5EFE8] transition-colors">
                          <td className="px-5 py-3.5">
                            <div className="font-medium text-[#1C1917] line-clamp-1">
                              {event.title}
                            </div>
                            <div className="text-[11px] text-[#78716C]">{event.animator.name}</div>
                          </td>
                          <td className="px-4 py-3.5 capitalize text-[#44403C] whitespace-nowrap">
                            {event.formatted_date}
                          </td>
                          <td className="px-4 py-3.5 text-[#57534E] max-w-xs truncate">
                            {event.location}
                          </td>
                          <td className="px-4 py-3.5 font-medium text-[#1C1917]">
                            {event.capacity} places
                          </td>
                          <td className="px-4 py-3.5 font-medium text-[#2E4036]">
                            {event.registered_count}
                          </td>
                          <td className="px-4 py-3.5">
                            <span
                              className={`text-[11px] px-2 py-0.5 rounded font-medium border ${
                                event.status === 'published'
                                  ? 'bg-[#E8F0EC] text-[#2E4036] border-[#C5D9CE]'
                                  : event.status === 'draft'
                                  ? 'bg-[#F0EBE4] text-[#78716C] border-[#D5CABE]'
                                  : 'bg-rose-50 text-rose-800 border-rose-200'
                              }`}
                            >
                              {event.status === 'published'
                                ? 'Publié'
                                : event.status === 'draft'
                                ? 'Brouillon'
                                : event.status === 'cancelled'
                                ? 'Annulé'
                                : 'Archivé'}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-2">
                              <button
                                onClick={() => setSelectedEventDetail(event)}
                                title="Voir la fiche et les participants"
                                className="p-1.5 text-[#2E4036] hover:bg-[#EAE2D7] rounded transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingEvent(event);
                                  setIsEventModalOpen(true);
                                }}
                                title="Modifier l’atelier"
                                className="p-1.5 text-[#78716C] hover:text-[#1C1917] hover:bg-[#EAE2D7] rounded transition-colors"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setEventToDelete(event)}
                                title="Supprimer l’atelier"
                                className="p-1.5 text-rose-700 hover:text-rose-900 hover:bg-rose-50 rounded transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GESTION DES MEMBRES */}
          {activeTab === 'members' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif text-xl text-[#1C1917] font-medium">
                    Annuaire des membres ({members.length})
                  </h3>
                  <p className="text-xs text-[#57534E]">
                    Consultez les informations et l'historique de chaque participant de l'association.
                  </p>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Rechercher un membre..."
                    value={searchMemberQuery}
                    onChange={(e) => setSearchMemberQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-[#FAF7F2] border border-[#D5CABE] rounded-md text-xs text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#2E4036]"
                  />
                </div>
              </div>

              <div className="border border-[#E7E2DA] rounded-xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#EAE2D7] text-[#44403C] uppercase text-[10px] tracking-wider font-semibold">
                      <tr>
                        <th className="px-5 py-3">Membre</th>
                        <th className="px-4 py-3">Adresse e-mail</th>
                        <th className="px-4 py-3">Date d’adhésion</th>
                        <th className="px-4 py-3">Ateliers inscrits</th>
                        <th className="px-5 py-3 text-right">Fiche</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAE2D7] bg-[#FAF7F2]">
                      {filteredMembers.map((member) => (
                        <tr key={member.id} className="hover:bg-[#F5EFE8] transition-colors">
                          <td className="px-5 py-3.5 font-medium text-[#1C1917]">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-[#EAE2D7] text-[#2E4036] flex items-center justify-center font-serif text-xs font-semibold">
                                {member.first_name?.[0] || 'M'}
                              </div>
                              <span>
                                {member.first_name} {member.last_name}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-[#57534E]">{member.email}</td>
                          <td className="px-4 py-3.5 text-[#78716C]">
                            {member.created_at
                              ? new Date(member.created_at).toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })
                              : '—'}
                          </td>
                          <td className="px-4 py-3.5 font-medium text-[#2E4036]">
                            {member.registrations_count} atelier(s)
                          </td>
                          <td className="px-5 py-3.5 text-right whitespace-nowrap">
                            <button
                              onClick={() => setSelectedMemberDetail(member)}
                              className="text-xs font-semibold text-[#2E4036] hover:underline"
                            >
                              Voir l'historique
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GESTION DES INSCRIPTIONS & EXPORT CSV */}
          {activeTab === 'registrations' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif text-xl text-[#1C1917] font-medium">
                    Suivi transversal des inscriptions ({filteredRegistrations.length})
                  </h3>
                  <p className="text-xs text-[#57534E]">
                    Toutes les réservations enregistrées avec filtrage et export au format tableur.
                  </p>
                </div>
                <button
                  onClick={handleExportRegistrationsCSV}
                  disabled={filteredRegistrations.length === 0}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#FAF7F2] bg-[#2E4036] hover:bg-[#1E2D25] disabled:opacity-50 px-4 py-2.5 rounded-md transition-colors shadow-2xs self-start sm:self-auto"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Exporter en CSV</span>
                </button>
              </div>

              {/* Filtres */}
              <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E7E2DA] flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-[#78716C]" />
                  <span className="font-semibold text-[#44403C]">Filtrer par :</span>
                </div>

                {/* Filtre par atelier */}
                <div>
                  <select
                    value={regFilterEvent}
                    onChange={(e) => setRegFilterEvent(e.target.value)}
                    className="px-3 py-1.5 bg-[#FDFBF7] border border-[#D5CABE] rounded-md text-xs text-[#1C1917]"
                  >
                    <option value="all">Tous les ateliers</option>
                    {events.map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        {ev.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filtre à venir / passé */}
                <div>
                  <select
                    value={regFilterTime}
                    onChange={(e: any) => setRegFilterTime(e.target.value)}
                    className="px-3 py-1.5 bg-[#FDFBF7] border border-[#D5CABE] rounded-md text-xs text-[#1C1917]"
                  >
                    <option value="all">Toutes les dates</option>
                    <option value="upcoming">Séances à venir</option>
                    <option value="past">Séances passées</option>
                  </select>
                </div>
              </div>

              {/* Tableau des inscriptions */}
              <div className="border border-[#E7E2DA] rounded-xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#EAE2D7] text-[#44403C] uppercase text-[10px] tracking-wider font-semibold">
                      <tr>
                        <th className="px-5 py-3">Adhérent</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Atelier</th>
                        <th className="px-4 py-3">Date de l'atelier</th>
                        <th className="px-4 py-3">Date d'inscription</th>
                        <th className="px-5 py-3">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAE2D7] bg-[#FAF7F2]">
                      {filteredRegistrations.map((reg) => (
                        <tr key={reg.id} className="hover:bg-[#F5EFE8] transition-colors">
                          <td className="px-5 py-3.5 font-medium text-[#1C1917]">
                            {reg.profile?.first_name} {reg.profile?.last_name}
                          </td>
                          <td className="px-4 py-3.5 text-[#57534E]">{reg.profile?.email}</td>
                          <td className="px-4 py-3.5 font-medium text-[#1C1917] max-w-xs truncate">
                            {reg.event?.title}
                          </td>
                          <td className="px-4 py-3.5 text-[#78716C] capitalize whitespace-nowrap">
                            {reg.event?.formatted_date || '—'}
                          </td>
                          <td className="px-4 py-3.5 text-[#78716C] whitespace-nowrap">
                            {new Date(reg.registered_at).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-[#E8F0EC] text-[#2E4036] font-medium border border-[#C5D9CE]">
                              <CheckCircle className="w-3 h-3" />
                              <span>Confirmé</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PUBLICATIONS (ÉCRITS DES MEMBRES) */}
          {activeTab === 'writings' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif text-2xl text-[#1C1917] font-normal">
                    Publications des membres
                  </h3>
                  <p className="text-xs text-[#57534E]">
                    Consultez l’ensemble des textes soumis par les adhérents et modérez si nécessaire.
                  </p>
                </div>
              </div>

              {/* Message de notification d'action admin */}
              {writingActionMessage && (
                <div
                  className={`p-3.5 rounded-lg text-xs flex items-center gap-2.5 border ${
                    writingActionMessage.isError
                      ? 'bg-rose-50 border-rose-200 text-rose-800'
                      : 'bg-[#E8F0EC] border-[#C5D9CE] text-[#2E4036]'
                  }`}
                >
                  {writingActionMessage.isError ? (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  ) : (
                    <CheckCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span className="font-medium">{writingActionMessage.text}</span>
                </div>
              )}

              {/* Filtres de recherche et de catégorie */}
              <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E7E2DA] flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-80">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#78716C]" />
                  <input
                    type="text"
                    placeholder="Rechercher par titre, auteur..."
                    value={searchWritingQuery}
                    onChange={(e) => setSearchWritingQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-[#FDFBF7] border border-[#D5CABE] rounded-md text-xs text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#2E4036]"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Filter className="w-3.5 h-3.5 text-[#78716C]" />
                  <select
                    value={writingCategoryFilter}
                    onChange={(e) => setWritingCategoryFilter(e.target.value)}
                    className="w-full sm:w-auto px-3 py-2 bg-[#FDFBF7] border border-[#D5CABE] rounded-md text-xs text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#2E4036]"
                  >
                    <option value="all">Toutes les catégories</option>
                    <option value="Nouvelle">Nouvelle</option>
                    <option value="Poésie">Poésie</option>
                    <option value="Récit">Récit</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
              </div>

              {/* Liste des publications */}
              {writings.length === 0 ? (
                <div className="bg-[#FAF7F2] p-10 rounded-xl border border-[#E7E2DA] text-center space-y-2">
                  <Feather className="w-8 h-8 text-[#994D2B] mx-auto opacity-75" />
                  <h4 className="font-serif text-lg text-[#1C1917]">Aucune publication enregistrée</h4>
                  <p className="text-xs text-[#57534E]">
                    Les membres n'ont pas encore publié d'écrits sur la plateforme.
                  </p>
                </div>
              ) : (
                <div className="bg-[#FAF7F2] rounded-xl border border-[#E7E2DA] overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-[#E7E2DA] bg-[#F2ECE4]/60 text-[#44403C] uppercase tracking-wider font-semibold">
                          <th className="p-3.5">Titre</th>
                          <th className="p-3.5">Catégorie</th>
                          <th className="p-3.5">Auteur</th>
                          <th className="p-3.5">Date de publication</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EAE2D7]">
                        {writings
                          .filter((w) => {
                            const matchCategory =
                              writingCategoryFilter === 'all' || w.category === writingCategoryFilter;
                            const query = searchWritingQuery.toLowerCase().trim();
                            const authorName = `${w.author?.first_name || ''} ${w.author?.last_name || ''} ${w.author?.email || ''}`.toLowerCase();
                            const matchQuery =
                              !query ||
                              w.title.toLowerCase().includes(query) ||
                              w.content.toLowerCase().includes(query) ||
                              authorName.includes(query);
                            return matchCategory && matchQuery;
                          })
                          .map((w) => {
                            const formattedDate = new Date(w.created_at).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            });
                            const authorFullName = w.author
                              ? `${w.author.first_name || ''} ${w.author.last_name || ''}`.trim() || w.author.email || 'Anonyme'
                              : 'Membre';

                            return (
                              <tr key={w.id} className="hover:bg-[#FDFBF7] transition-colors">
                                <td className="p-3.5 font-medium text-[#1C1917] max-w-xs">
                                  <div className="truncate font-serif text-sm">{w.title}</div>
                                  <div className="text-[11px] text-[#78716C] truncate font-serif italic">
                                    « {w.content.slice(0, 70)}... »
                                  </div>
                                </td>

                                <td className="p-3.5">
                                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#EAE2D7] text-[#2E4036]">
                                    {w.category}
                                  </span>
                                </td>

                                <td className="p-3.5 text-[#57534E]">
                                  <div className="font-medium text-[#1C1917]">{authorFullName}</div>
                                  {w.author?.email && (
                                    <div className="text-[11px] text-[#78716C]">{w.author.email}</div>
                                  )}
                                </td>

                                <td className="p-3.5 text-[#78716C] whitespace-nowrap">
                                  {formattedDate}
                                </td>

                                <td className="p-3.5 text-right whitespace-nowrap">
                                  <div className="flex items-center justify-end gap-1.5">
                                    {onSelectWriting && (
                                      <button
                                        onClick={() => onSelectWriting(w)}
                                        className="p-1.5 text-[#2E4036] hover:bg-[#EAE2D7] rounded-md transition-colors"
                                        title="Lire le texte complet"
                                      >
                                        <Eye className="w-3.5 h-3.5" />
                                      </button>
                                    )}

                                    <button
                                      onClick={() => setWritingToDelete(w)}
                                      className="p-1.5 text-rose-700 hover:text-rose-900 hover:bg-rose-50 rounded-md transition-colors"
                                      title="Supprimer la publication"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: MON PROFIL (ADMINISTRATEUR) */}
          {activeTab === 'profile' && currentUser && (
            <div className="max-w-xl mx-auto space-y-6">
              <div className="space-y-1 text-center">
                <h3 className="font-serif text-2xl text-[#1C1917] font-normal">
                  Mon profil
                </h3>
                <p className="text-xs text-[#57534E]">
                  Consultez et modifiez les informations de votre compte administrateur.
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
                    <div className="w-14 h-14 rounded-full bg-[#2E4036] text-[#FAF7F2] flex items-center justify-center font-serif text-xl font-medium">
                      {currentUser.first_name?.[0] || 'A'}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif text-xl text-[#1C1917] font-medium leading-tight">
                          {currentUser.first_name} {currentUser.last_name}
                        </h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#2E4036] text-[#FAF7F2]">
                          Administrateur
                        </span>
                      </div>
                      <span className="text-xs text-[#78716C] block">{currentUser.email}</span>
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

                    <div className="bg-[#FDFBF7] p-3.5 rounded-lg border border-[#EAE2D7] space-y-1 sm:col-span-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#78716C] block">
                        Rôle dans l'association
                      </span>
                      <span className="text-xs font-medium text-[#2E4036] block">
                        Administrateur (gestionnaire de l'association — non modifiable)
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setAdminFirstName(currentUser.first_name || '');
                        setAdminLastName(currentUser.last_name || '');
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
                  onSubmit={handleSaveAdminProfile}
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
                        value={adminFirstName}
                        onChange={(e) => setAdminFirstName(e.target.value)}
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
                        value={adminLastName}
                        onChange={(e) => setAdminLastName(e.target.value)}
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

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1.5">
                      Rôle
                    </label>
                    <input
                      type="text"
                      disabled
                      value="Administrateur (non modifiable)"
                      className="w-full px-3 py-2.5 bg-[#EAE2D7]/50 border border-[#D5CABE] rounded-md text-xs text-[#78716C] cursor-not-allowed"
                    />
                  </div>

                  <div className="pt-3 flex flex-col sm:flex-row items-center justify-end gap-3">
                    <button
                      type="button"
                      disabled={isSavingProfile}
                      onClick={handleCancelAdminEdit}
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

      {/* MODALE 1: Formulaire de Création / Modification d'atelier */}
      <AdminEventModal
        isOpen={isEventModalOpen}
        eventToEdit={editingEvent}
        onClose={() => {
          setIsEventModalOpen(false);
          setEditingEvent(null);
        }}
        onSaved={() => loadAdminData()}
      />

      {/* MODALE 2: Fiche détaillée Atelier (avec Participants) */}
      <AdminEventDetailModal
        event={selectedEventDetail}
        isOpen={Boolean(selectedEventDetail)}
        onClose={() => setSelectedEventDetail(null)}
        onEditClick={(ev) => {
          setSelectedEventDetail(null);
          setEditingEvent(ev);
          setIsEventModalOpen(true);
        }}
      />

      {/* MODALE 3: Fiche détaillée Membre (avec Inscriptions) */}
      <AdminMemberDetailModal
        member={selectedMemberDetail}
        isOpen={Boolean(selectedMemberDetail)}
        onClose={() => setSelectedMemberDetail(null)}
        onMemberUpdated={(updated) => {
          setSelectedMemberDetail((prev) => (prev ? { ...prev, ...updated } : null));
          setMembers((prev) =>
            prev.map((m) =>
              m.id === updated.id
                ? { ...m, first_name: updated.first_name, last_name: updated.last_name }
                : m
            )
          );
          loadAdminData();
        }}
      />

      {/* MODALE 4: Confirmation de suppression d'atelier */}
      {eventToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1917]/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#FAF7F2] rounded-xl border border-rose-200 p-6 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex items-center gap-3 text-rose-800">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-700" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-medium text-[#1C1917]">
                  Supprimer cet atelier ?
                </h3>
                <span className="text-xs text-[#57534E]">Cette action est irréversible.</span>
              </div>
            </div>

            <p className="text-xs text-[#57534E] leading-relaxed">
              Vous êtes sur le point de supprimer définitivement l'atelier «{' '}
              <strong className="text-[#1C1917]">{eventToDelete.title}</strong> ». Les inscriptions associées seront également supprimées.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEventToDelete(null)}
                className="px-4 py-2 text-xs font-medium text-[#78716C] hover:text-[#1C1917] rounded-md border border-[#D5CABE] hover:bg-[#EAE2D7] transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 disabled:opacity-50 rounded-md transition-colors flex items-center gap-2"
              >
                {isDeleting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>Confirmer la suppression</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODALE DE SUPPRESSION D'UNE PUBLICATION PAR L'ADMIN */}
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
                Supprimer cette publication ?
              </h4>
              <p className="text-xs text-[#57534E] leading-relaxed">
                En tant qu'administrateur, vous vous apprêtez à supprimer « <span className="font-semibold text-[#1C1917]">{writingToDelete.title}</span> » rédigé par <span className="font-semibold text-[#1C1917]">{writingToDelete.author?.first_name || 'un membre'} {writingToDelete.author?.last_name || ''}</span>. Cette action est irréversible.
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
                <span>{isDeletingWriting ? 'Suppression...' : 'Supprimer définitivement'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
