import React, { useState, useEffect } from 'react';
import { Profile, EventItem } from '../../types';
import { fetchMemberHistoryForAdmin, updateMemberProfileByAdmin } from '../../lib/supabase';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  RefreshCw,
  User,
  Mail,
  BookOpen,
  Edit2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface AdminMemberDetailModalProps {
  member: (Profile & { registrations_count?: number }) | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectEvent?: (event: EventItem) => void;
  onMemberUpdated?: (updatedMember: Profile & { registrations_count?: number }) => void;
}

export const AdminMemberDetailModal: React.FC<AdminMemberDetailModalProps> = ({
  member,
  isOpen,
  onClose,
  onSelectEvent,
  onMemberUpdated
}) => {
  const [currentMember, setCurrentMember] = useState<(Profile & { registrations_count?: number }) | null>(member);
  const [history, setHistory] = useState<
    Array<{
      id: string;
      status: string;
      registered_at: string;
      event: EventItem;
    }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  useEffect(() => {
    if (member && isOpen) {
      setCurrentMember(member);
      setFirstName(member.first_name || '');
      setLastName(member.last_name || '');
      setIsEditing(false);
      setFeedbackMessage(null);
      setIsLoading(true);
      fetchMemberHistoryForAdmin(member.id)
        .then((res) => setHistory(res))
        .finally(() => setIsLoading(false));
    }
  }, [member, isOpen]);

  if (!isOpen || !currentMember) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const upcoming = history.filter((h) => h.event.date >= todayStr);
  const past = history.filter((h) => h.event.date < todayStr);

  const handleStartEdit = () => {
    setFirstName(currentMember.first_name || '');
    setLastName(currentMember.last_name || '');
    setFeedbackMessage(null);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setFirstName(currentMember.first_name || '');
    setLastName(currentMember.last_name || '');
    setIsEditing(false);
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      setFeedbackMessage({ text: 'Veuillez renseigner le prénom.', isError: true });
      return;
    }

    setIsSaving(true);
    setFeedbackMessage(null);

    const result = await updateMemberProfileByAdmin(currentMember.id, {
      first_name: firstName,
      last_name: lastName
    });

    setIsSaving(false);
    if (result.success) {
      const updated: Profile & { registrations_count?: number } = {
        ...currentMember,
        first_name: firstName.trim(),
        last_name: lastName.trim()
      };
      setCurrentMember(updated);
      setIsEditing(false);
      setFeedbackMessage({ text: 'Le profil du membre a bien été mis à jour.', isError: false });
      if (onMemberUpdated) {
        onMemberUpdated(updated);
      }
    } else {
      setFeedbackMessage({
        text: result.error || "Impossible d'enregistrer les modifications. Veuillez réessayer.",
        isError: true
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1917]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] rounded-xl border border-[#D5CABE] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E7E2DA] flex items-center justify-between bg-[#F5EFE8]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#EAE2D7] text-[#2E4036] flex items-center justify-center font-serif text-base font-semibold">
              {currentMember.first_name?.[0] || 'M'}
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#994D2B]">
                Fiche Adhérent
              </span>
              <h2 className="font-serif text-xl text-[#1C1917] font-medium leading-tight">
                {currentMember.first_name} {currentMember.last_name}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#78716C] hover:text-[#1C1917] p-1.5 rounded-md hover:bg-[#EAE2D7] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Feedback message banner */}
          {feedbackMessage && (
            <div
              className={`p-3.5 rounded-lg text-xs flex items-center gap-2.5 border ${
                feedbackMessage.isError
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : 'bg-[#E8F0EC] border-[#C5D9CE] text-[#2E4036]'
              }`}
            >
              {feedbackMessage.isError ? (
                <AlertCircle className="w-4 h-4 shrink-0" />
              ) : (
                <CheckCircle className="w-4 h-4 shrink-0" />
              )}
              <span className="font-medium">{feedbackMessage.text}</span>
            </div>
          )}

          {/* Member Card / Edit Section */}
          {!isEditing ? (
            /* MODE CONSULTATION */
            <div className="bg-[#F5EFE8] p-5 rounded-xl border border-[#E7E2DA] space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-[#2E4036] uppercase tracking-wider">
                  Informations de l'adhérent
                </div>
                <button
                  type="button"
                  onClick={handleStartEdit}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2E4036] hover:bg-[#1E2D25] text-[#FAF7F2] rounded-md text-xs font-semibold transition-colors shadow-2xs"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Modifier le membre</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-[#FAF7F2] p-3 rounded-lg border border-[#EAE2D7]">
                  <span className="text-[#78716C] uppercase font-semibold text-[10px] block mb-0.5">
                    Prénom
                  </span>
                  <span className="text-[#1C1917] font-medium text-sm">
                    {currentMember.first_name || '—'}
                  </span>
                </div>

                <div className="bg-[#FAF7F2] p-3 rounded-lg border border-[#EAE2D7]">
                  <span className="text-[#78716C] uppercase font-semibold text-[10px] block mb-0.5">
                    Nom
                  </span>
                  <span className="text-[#1C1917] font-medium text-sm">
                    {currentMember.last_name || '—'}
                  </span>
                </div>

                <div className="bg-[#FAF7F2] p-3 rounded-lg border border-[#EAE2D7]">
                  <span className="text-[#78716C] uppercase font-semibold text-[10px] block mb-0.5">
                    Adresse e-mail
                  </span>
                  <span className="text-[#1C1917] font-medium break-all">
                    {currentMember.email}
                  </span>
                </div>

                <div className="bg-[#FAF7F2] p-3 rounded-lg border border-[#EAE2D7]">
                  <span className="text-[#78716C] uppercase font-semibold text-[10px] block mb-0.5">
                    Date d’adhésion
                  </span>
                  <span className="text-[#1C1917]">
                    {currentMember.created_at
                      ? new Date(currentMember.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })
                      : '—'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* MODE ÉDITION */
            <form
              onSubmit={handleSaveMember}
              className="bg-[#F5EFE8] p-5 rounded-xl border border-[#D5CABE] space-y-4 shadow-xs"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#E7E2DA]">
                <div>
                  <h3 className="text-sm font-semibold text-[#1C1917]">
                    Modifier les coordonnées de l'adhérent
                  </h3>
                  <p className="text-xs text-[#78716C]">
                    Mettez à jour le prénom et le nom du membre.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                    Prénom
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5CABE] rounded-md text-xs text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#2E4036]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5CABE] rounded-md text-xs text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#2E4036]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                  Adresse e-mail
                </label>
                <input
                  type="email"
                  disabled
                  value={currentMember.email}
                  className="w-full px-3 py-2 bg-[#EAE2D7]/50 border border-[#D5CABE] rounded-md text-xs text-[#78716C] cursor-not-allowed"
                />
                <span className="text-[11px] text-[#78716C] mt-1 block">
                  L'adresse e-mail n'est pas modifiable dans cette version.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={handleCancelEdit}
                  className="px-3.5 py-2 text-xs font-medium text-[#78716C] hover:text-[#1C1917] rounded-md border border-[#D5CABE] hover:bg-[#EAE2D7] transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-[#2E4036] hover:bg-[#1E2D25] disabled:opacity-50 text-[#FAF7F2] rounded-md text-xs font-semibold transition-colors shadow-2xs flex items-center gap-2"
                >
                  {isSaving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isSaving ? 'Modification en cours...' : 'Enregistrer les modifications'}</span>
                </button>
              </div>
            </form>
          )}

          {isLoading ? (
            <div className="py-8 text-center text-xs text-[#78716C] flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-[#2E4036]" />
              <span>Chargement de l'activité de l'adhérent...</span>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Inscriptions à venir */}
              <div className="space-y-3">
                <h4 className="font-serif text-base text-[#1C1917] font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#994D2B]" />
                  <span>Inscriptions à venir ({upcoming.length})</span>
                </h4>

                {upcoming.length === 0 ? (
                  <p className="text-xs text-[#78716C] italic p-3 bg-[#FDFBF7] rounded-md border border-[#E7E2DA]">
                    Aucun atelier futur programmé pour ce membre.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {upcoming.map((u) => (
                      <div
                        key={u.id}
                        className="p-3 bg-[#FDFBF7] rounded-lg border border-[#E7E2DA] flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <span className="text-[11px] text-[#994D2B] font-semibold capitalize block">
                            {u.event.formatted_date}
                          </span>
                          <span className="font-medium text-[#1C1917] block">
                            {u.event.title}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-[#E8F0EC] text-[#2E4036] text-[11px] font-medium border border-[#C5D9CE]">
                          Confirmé
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Historique passé */}
              <div className="space-y-3 pt-4 border-t border-[#E7E2DA]">
                <h4 className="font-serif text-base text-[#1C1917] font-medium flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#78716C]" />
                  <span>Historique des inscriptions ({past.length})</span>
                </h4>

                {past.length === 0 ? (
                  <p className="text-xs text-[#78716C] italic p-3 bg-[#FDFBF7] rounded-md border border-[#E7E2DA]">
                    Aucune participation passée enregistrée.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {past.map((p) => (
                      <div
                        key={p.id}
                        className="p-3 bg-[#FDFBF7]/60 rounded-lg border border-[#E7E2DA] flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <span className="text-[11px] text-[#78716C] capitalize block">
                            {p.event.formatted_date}
                          </span>
                          <span className="text-[#1C1917]">{p.event.title}</span>
                        </div>
                        <span className="text-[11px] text-[#78716C]">Séance terminée</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E7E2DA] bg-[#F5EFE8] flex justify-between items-center">
          <div>
            {!isEditing && (
              <button
                type="button"
                onClick={handleStartEdit}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#2E4036] hover:bg-[#EAE2D7] rounded-md border border-[#D5CABE] transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Modifier le membre</span>
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#FAF7F2] bg-[#2E4036] hover:bg-[#1E2D25] rounded-md transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
