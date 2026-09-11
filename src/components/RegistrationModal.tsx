import React, { useState } from 'react';
import { EventItem, Profile } from '../types';
import { X, Calendar, Clock, MapPin, CheckCircle2, User, Mail, AlertCircle, Bookmark } from 'lucide-react';

interface RegistrationModalProps {
  event: EventItem | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser: Profile | null;
  onConfirmRegistration: (event: EventItem, details: { firstName: string; lastName: string; email: string }) => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  event,
  isOpen,
  onClose,
  currentUser,
  onConfirmRegistration
}) => {
  if (!isOpen || !event) return null;

  const [firstName, setFirstName] = useState(currentUser?.first_name || '');
  const [lastName, setLastName] = useState(currentUser?.last_name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!firstName.trim() || !lastName.trim()) {
      setError('Veuillez renseigner votre prénom et nom.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Veuillez renseigner une adresse e-mail valide.');
      return;
    }

    onConfirmRegistration(event, { firstName, lastName, email });
    setConfirmed(true);
  };

  const handleClose = () => {
    setConfirmed(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1917]/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[#FAF7F2] rounded-xl border border-[#D5CABE] shadow-xl max-w-lg w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#EAE2D7] flex items-center justify-between bg-[#F5EFE8]">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-[#994D2B]" />
            <h3 className="font-serif text-lg font-medium text-[#1C1917]">
              {confirmed ? 'Confirmation de pré-inscription' : 'Inscription à un atelier'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-md text-[#78716C] hover:text-[#1C1917] hover:bg-[#EAE2D7] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Event recap pill */}
          <div className="p-4 bg-[#F2ECE4] rounded-lg border border-[#E7E2DA] space-y-1.5">
            <h4 className="font-serif text-base font-semibold text-[#1C1917]">
              {event.title}
            </h4>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#57534E]">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#994D2B]" />
                {event.formatted_date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#994D2B]" />
                {event.start_time} - {event.end_time}
              </span>
            </div>
            <div className="text-xs text-[#78716C] flex items-center gap-1 pt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#994D2B]" />
              <span className="truncate">{event.location}</span>
            </div>
          </div>

          {confirmed ? (
            <div className="space-y-4 py-2 text-center">
              <div className="w-12 h-12 rounded-full bg-[#E8F0EC] text-[#2E4036] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="font-serif text-xl text-[#1C1917] font-medium">
                Votre place est réservée !
              </h4>
              <p className="text-xs text-[#57534E] leading-relaxed max-w-sm mx-auto">
                Un récapitulatif a été préparé pour <strong>{email}</strong>. Vous recevrez les détails d'accès et les amorces d'écriture 48h avant la séance.
              </p>

              <div className="p-3 bg-[#EAE2D7]/50 rounded-md border border-[#D5CABE] text-[11px] text-[#78716C] text-left">
                <strong>Information pratique :</strong> Les modalités pratiques et le rappel du matériel recommandé vous seront également rappelés avant la date de la séance.
              </div>

              <button
                onClick={handleClose}
                className="w-full py-2.5 px-4 bg-[#2E4036] hover:bg-[#1E2D25] text-[#FAF7F2] rounded-md text-xs font-semibold transition-colors"
              >
                Fermer
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-2.5 bg-[#FEE2E2] border border-[#FECACA] rounded text-xs text-[#B91C1C] flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Jean"
                    className="w-full px-3 py-2 bg-[#FDFBF7] border border-[#D5CABE] rounded-md text-xs text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#2E4036]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                    Nom *
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Valjean"
                    className="w-full px-3 py-2 bg-[#FDFBF7] border border-[#D5CABE] rounded-md text-xs text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#2E4036]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                  Adresse e-mail de confirmation *
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

              <div className="text-[11px] text-[#78716C] leading-normal pt-1">
                Paiement ou règlement de l'adhésion sur place à l'accueil de l'atelier (espèces, chèque ou carte bancaire).
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-xs font-medium text-[#57534E] hover:text-[#1C1917] transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#2E4036] hover:bg-[#1E2D25] text-[#FAF7F2] rounded-md text-xs font-semibold transition-colors shadow-2xs"
                >
                  Confirmer ma pré-inscription
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
