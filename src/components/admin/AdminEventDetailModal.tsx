import React, { useState, useEffect } from 'react';
import { EventItem } from '../../types';
import { fetchEventParticipants } from '../../lib/supabase';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  RefreshCw,
  Mail,
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';

interface AdminEventDetailModalProps {
  event: EventItem | null;
  isOpen: boolean;
  onClose: () => void;
  onEditClick: (event: EventItem) => void;
}

export const AdminEventDetailModal: React.FC<AdminEventDetailModalProps> = ({
  event,
  isOpen,
  onClose,
  onEditClick
}) => {
  const [participants, setParticipants] = useState<
    Array<{
      id: string;
      status: string;
      registered_at: string;
      first_name: string;
      last_name: string;
      email: string;
    }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (event && isOpen) {
      setIsLoading(true);
      fetchEventParticipants(event.id)
        .then((res) => setParticipants(res))
        .finally(() => setIsLoading(false));
    }
  }, [event, isOpen]);

  if (!isOpen || !event) return null;

  const count = participants.length > 0 ? participants.length : event.registered_count;
  const capacity = event.capacity;
  const placesLeft = Math.max(0, capacity - count);
  const fillRate = capacity > 0 ? Math.min(100, Math.round((count / capacity) * 100)) : 0;

  // Export participants list to CSV
  const handleExportCSV = () => {
    if (participants.length === 0) return;
    const headers = ['Prénom', 'Nom', 'Email', 'Date d’inscription', 'Statut'];
    const rows = participants.map((p) => [
      p.first_name,
      p.last_name,
      p.email,
      new Date(p.registered_at).toLocaleDateString('fr-FR'),
      p.status === 'confirmed' ? 'Confirmé' : p.status
    ]);
    const csvContent =
      '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `participants_${event.slug || 'atelier'}_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1917]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] rounded-xl border border-[#D5CABE] w-full max-w-3xl max-h-[90vh] flex flex-col shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E7E2DA] flex items-center justify-between bg-[#F5EFE8]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#994D2B]">
                Fiche d’organisation
              </span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded font-medium border ${
                  event.status === 'published'
                    ? 'bg-[#E8F0EC] text-[#2E4036] border-[#C5D9CE]'
                    : 'bg-[#F0EBE4] text-[#78716C] border-[#D5CABE]'
                }`}
              >
                {event.status === 'published' ? 'Publié' : event.status}
              </span>
            </div>
            <h2 className="font-serif text-xl text-[#1C1917] font-medium mt-0.5">
              {event.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#78716C] hover:text-[#1C1917] p-1.5 rounded-md hover:bg-[#EAE2D7] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Métriques d'inscription et de jauge */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F5EFE8] p-4 rounded-xl border border-[#E7E2DA]">
            <div>
              <span className="text-[11px] text-[#78716C] uppercase tracking-wider font-semibold block">
                Inscrits
              </span>
              <span className="font-serif text-2xl text-[#2E4036] font-medium">
                {count}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-[#78716C] uppercase tracking-wider font-semibold block">
                Capacité totale
              </span>
              <span className="font-serif text-2xl text-[#1C1917] font-medium">
                {capacity}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-[#78716C] uppercase tracking-wider font-semibold block">
                Places restantes
              </span>
              <span className="font-serif text-2xl text-[#994D2B] font-medium">
                {placesLeft}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-[#78716C] uppercase tracking-wider font-semibold block">
                Remplissage
              </span>
              <span className="font-serif text-2xl text-[#1C1917] font-medium">
                {fillRate} %
              </span>
            </div>
          </div>

          {/* Jauge visuelle */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-[#57534E]">
              <span>Jauge de participation</span>
              <span>
                {count} / {capacity} places ({fillRate} %)
              </span>
            </div>
            <div className="w-full h-2.5 bg-[#EAE2D7] rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  fillRate >= 100 ? 'bg-[#994D2B]' : 'bg-[#2E4036]'
                }`}
                style={{ width: `${fillRate}%` }}
              />
            </div>
          </div>

          {/* Informations détaillées */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#44403C] pt-2 border-t border-[#EAE2D7]">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#994D2B] shrink-0" />
                <span className="font-medium capitalize">{event.formatted_date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#994D2B] shrink-0" />
                <span>
                  {event.start_time} - {event.end_time}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#994D2B] shrink-0" />
                <span>
                  {event.location}
                  {event.address ? ` (${event.address})` : ''}
                </span>
              </div>
            </div>

            <div className="space-y-1.5 bg-[#FDFBF7] p-3 rounded-lg border border-[#E7E2DA]">
              <span className="text-[11px] text-[#78716C] font-semibold uppercase tracking-wider block">
                Animation
              </span>
              <div className="font-medium text-[#1C1917]">{event.animator.name}</div>
              <div className="text-[11px] text-[#57534E]">{event.animator.role}</div>
            </div>
          </div>

          {/* Liste des participants inscrits */}
          <div className="space-y-3 pt-4 border-t border-[#EAE2D7]">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg text-[#1C1917] font-medium flex items-center gap-2">
                <Users className="w-4 h-4 text-[#2E4036]" />
                <span>Liste des participants inscrits ({participants.length})</span>
              </h3>
              {participants.length > 0 && (
                <button
                  onClick={handleExportCSV}
                  className="text-xs font-semibold text-[#2E4036] hover:text-[#1E2D25] inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-[#D5CABE] bg-[#F5EFE8] hover:bg-[#EAE2D7] transition-colors"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Exporter la liste</span>
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="py-8 text-center text-xs text-[#78716C] flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-[#2E4036]" />
                <span>Chargement des participants inscrits...</span>
              </div>
            ) : participants.length === 0 ? (
              <div className="p-6 bg-[#F5EFE8] rounded-lg border border-[#E7E2DA] text-center text-xs text-[#57534E]">
                Aucun participant n’est encore enregistré pour cet atelier.
              </div>
            ) : (
              <div className="border border-[#E7E2DA] rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#EAE2D7] text-[#44403C] uppercase text-[10px] tracking-wider font-semibold">
                    <tr>
                      <th className="px-4 py-2.5">Participant</th>
                      <th className="px-4 py-2.5">Email</th>
                      <th className="px-4 py-2.5">Date inscription</th>
                      <th className="px-4 py-2.5">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE2D7] bg-[#FAF7F2]">
                    {participants.map((p) => (
                      <tr key={p.id} className="hover:bg-[#F5EFE8] transition-colors">
                        <td className="px-4 py-2.5 font-medium text-[#1C1917]">
                          {p.first_name} {p.last_name}
                        </td>
                        <td className="px-4 py-2.5 text-[#57534E]">{p.email}</td>
                        <td className="px-4 py-2.5 text-[#78716C]">
                          {new Date(p.registered_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="px-4 py-2.5">
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
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-[#EAE2D7] bg-[#F5EFE8] flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onEditClick(event);
            }}
            className="px-4 py-2 text-xs font-semibold text-[#2E4036] hover:bg-[#EAE2D7] rounded-md border border-[#D5CABE] transition-colors"
          >
            Modifier cet atelier
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#FAF7F2] bg-[#2E4036] hover:bg-[#1E2D25] rounded-md transition-colors"
          >
            Fermer la fiche
          </button>
        </div>
      </div>
    </div>
  );
};
