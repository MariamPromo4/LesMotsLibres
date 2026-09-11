import React, { useState, useEffect } from 'react';
import { EventItem } from '../../types';
import { createAdminEvent, updateAdminEvent } from '../../lib/supabase';
import { X, RefreshCw, AlertCircle, Check } from 'lucide-react';

interface AdminEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventToEdit?: EventItem | null;
  onSaved: () => void;
}

export const AdminEventModal: React.FC<AdminEventModalProps> = ({
  isOpen,
  onClose,
  eventToEdit,
  onSaved
}) => {
  const isEditing = Boolean(eventToEdit);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('14:30');
  const [endTime, setEndTime] = useState('17:30');
  const [location, setLocation] = useState('L’Atelier des Mots Libres — Salle des Reliures');
  const [address, setAddress] = useState('18 rue des Cascades, 75020 Paris');
  const [capacity, setCapacity] = useState(12);
  const [status, setStatus] = useState<'published' | 'draft' | 'cancelled' | 'archived'>('published');
  const [category, setCategory] = useState<'atelier' | 'masterclass' | 'marathon' | 'lecture'>('atelier');
  const [animatorName, setAnimatorName] = useState('Clémence Valéry');
  const [animatorRole, setAnimatorRole] = useState('Romancière & animatrice d’ateliers');
  const [animatorBio, setAnimatorBio] = useState('');
  const [prerequisites, setPrerequisites] = useState('');
  const [materialsText, setMaterialsText] = useState('Carnet, Stylo au tracé fluide');
  const [price, setPrice] = useState('Adhérents : 15 € / Non-adhérents : 25 €');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title);
      setSubtitle(eventToEdit.subtitle || '');
      setDescription(eventToEdit.description);
      setFullDescription(eventToEdit.full_description || eventToEdit.description);
      setDate(eventToEdit.date);
      setStartTime(eventToEdit.start_time);
      setEndTime(eventToEdit.end_time);
      setLocation(eventToEdit.location);
      setAddress(eventToEdit.address || '');
      setCapacity(eventToEdit.capacity);
      setStatus(eventToEdit.status);
      setCategory(eventToEdit.category);
      setAnimatorName(eventToEdit.animator.name);
      setAnimatorRole(eventToEdit.animator.role || '');
      setAnimatorBio(eventToEdit.animator.bio || '');
      setPrerequisites(eventToEdit.prerequisites || '');
      setMaterialsText(eventToEdit.materials ? eventToEdit.materials.join(', ') : '');
      setPrice(eventToEdit.price || '');
      setImageUrl(eventToEdit.image_url || '');
    } else {
      // Defaults for new event
      setTitle('');
      setSubtitle('');
      setDescription('');
      setFullDescription('');
      setDate(new Date().toISOString().split('T')[0]);
      setStartTime('14:30');
      setEndTime('17:30');
      setLocation('L’Atelier des Mots Libres — Salle des Reliures');
      setAddress('18 rue des Cascades, 75020 Paris');
      setCapacity(12);
      setStatus('published');
      setCategory('atelier');
      setAnimatorName('');
      setAnimatorRole('');
      setAnimatorBio('');
      setPrerequisites('');
      setMaterialsText('Votre carnet, Un stylo');
      setPrice('Adhérents : 15 € / Non-adhérents : 25 €');
      setImageUrl('https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80');
    }
    setErrorMessage(null);
  }, [eventToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const materials = materialsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      title,
      subtitle,
      description,
      full_description: fullDescription || description,
      date,
      start_time: startTime.length === 5 ? `${startTime}:00` : startTime,
      end_time: endTime.length === 5 ? `${endTime}:00` : endTime,
      location,
      address,
      capacity: Number(capacity) || 12,
      status,
      category,
      animator_name: animatorName,
      animator_role: animatorRole,
      animator_bio: animatorBio,
      prerequisites,
      materials,
      price,
      image_url: imageUrl
    };

    let result;
    if (isEditing && eventToEdit) {
      result = await updateAdminEvent(eventToEdit.id, payload);
    } else {
      result = await createAdminEvent(payload);
    }

    setIsSubmitting(false);

    if (result.success) {
      onSaved();
      onClose();
    } else {
      setErrorMessage(result.error || 'Une erreur est survenue lors de l’enregistrement.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1917]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] rounded-xl border border-[#D5CABE] w-full max-w-3xl max-h-[90vh] flex flex-col shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E7E2DA] flex items-center justify-between bg-[#F5EFE8]">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#994D2B]">
              Gestion des Ateliers
            </span>
            <h2 className="font-serif text-xl text-[#1C1917] font-medium">
              {isEditing ? 'Modifier l’atelier' : 'Créer un nouvel atelier'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#78716C] hover:text-[#1C1917] p-1.5 rounded-md hover:bg-[#EAE2D7] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-md bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Main Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                Titre de l'atelier *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex. Déjouer la page blanche..."
                className="w-full px-3 py-2 bg-[#FDFBF7] border border-[#D5CABE] rounded-md text-xs text-[#1C1917] focus:ring-1 focus:ring-[#2E4036]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                  Sous-titre
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Ex. Atelier d'initiation..."
                  className="w-full px-3 py-2 bg-[#FDFBF7] border border-[#D5CABE] rounded-md text-xs text-[#1C1917]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                  Catégorie
                </label>
                <select
                  value={category}
                  onChange={(e: any) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FDFBF7] border border-[#D5CABE] rounded-md text-xs text-[#1C1917]"
                >
                  <option value="atelier">Atelier d'écriture</option>
                  <option value="masterclass">Masterclass intensive</option>
                  <option value="marathon">Marathon nocturne</option>
                  <option value="lecture">Scène ouverte & lecture</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                Description courte *
              </label>
              <textarea
                required
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Présentation synthétique pour les fiches et l'agenda..."
                className="w-full px-3 py-2 bg-[#FDFBF7] border border-[#D5CABE] rounded-md text-xs text-[#1C1917]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                Description détaillée
              </label>
              <textarea
                rows={4}
                value={fullDescription}
                onChange={(e) => setFullDescription(e.target.value)}
                placeholder="Déroulé de la séance, objectifs littéraires, démarche..."
                className="w-full px-3 py-2 bg-[#FDFBF7] border border-[#D5CABE] rounded-md text-xs text-[#1C1917]"
              />
            </div>
          </div>

          {/* Date, Time, Capacity, Status */}
          <div className="pt-4 border-t border-[#EAE2D7] grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-[#FDFBF7] border border-[#D5CABE] rounded-md text-xs text-[#1C1917]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                Début
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 bg-[#FDFBF7] border border-[#D5CABE] rounded-md text-xs text-[#1C1917]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                Fin
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 bg-[#FDFBF7] border border-[#D5CABE] rounded-md text-xs text-[#1C1917]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                Capacité (places) *
              </label>
              <input
                type="number"
                min={1}
                max={100}
                required
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#FDFBF7] border border-[#D5CABE] rounded-md text-xs text-[#1C1917]"
              />
            </div>
          </div>

          {/* Location & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                Lieu *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex. L'Atelier des Mots Libres"
                className="w-full px-3 py-2 bg-[#FDFBF7] border border-[#D5CABE] rounded-md text-xs text-[#1C1917]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                Adresse
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="18 rue des Cascades, 75020 Paris"
                className="w-full px-3 py-2 bg-[#FDFBF7] border border-[#D5CABE] rounded-md text-xs text-[#1C1917]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                Statut
              </label>
              <select
                value={status}
                onChange={(e: any) => setStatus(e.target.value)}
                className="w-full px-3 py-2 bg-[#FDFBF7] border border-[#D5CABE] rounded-md text-xs text-[#1C1917]"
              >
                <option value="published">Publié (visible au public)</option>
                <option value="draft">Brouillon (invisible)</option>
                <option value="cancelled">Annulé</option>
                <option value="archived">Archivé</option>
              </select>
            </div>
          </div>

          {/* Animator */}
          <div className="pt-4 border-t border-[#EAE2D7] grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                Nom de l'intervenant(e) *
              </label>
              <input
                type="text"
                required
                value={animatorName}
                onChange={(e) => setAnimatorName(e.target.value)}
                placeholder="Ex. Clémence Valéry"
                className="w-full px-3 py-2 bg-[#FDFBF7] border border-[#D5CABE] rounded-md text-xs text-[#1C1917]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                Titre / Rôle de l'intervenant
              </label>
              <input
                type="text"
                value={animatorRole}
                onChange={(e) => setAnimatorRole(e.target.value)}
                placeholder="Ex. Romancière & animatrice"
                className="w-full px-3 py-2 bg-[#FDFBF7] border border-[#D5CABE] rounded-md text-xs text-[#1C1917]"
              />
            </div>
          </div>

          {/* Tarifs & Matériel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                Tarif affiché
              </label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Ex. Adhérents : 15 € / Non-adhérents : 25 €"
                className="w-full px-3 py-2 bg-[#FDFBF7] border border-[#D5CABE] rounded-md text-xs text-[#1C1917]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                Matériel conseillé (séparé par des virgules)
              </label>
              <input
                type="text"
                value={materialsText}
                onChange={(e) => setMaterialsText(e.target.value)}
                placeholder="Carnet, Stylo à bille, Feutre"
                className="w-full px-3 py-2 bg-[#FDFBF7] border border-[#D5CABE] rounded-md text-xs text-[#1C1917]"
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#EAE2D7] bg-[#F5EFE8] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[#78716C] hover:text-[#1C1917] rounded-md border border-[#D5CABE] hover:bg-[#EAE2D7] transition-colors"
          >
            Annuler
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="px-5 py-2 text-xs font-semibold text-[#FAF7F2] bg-[#2E4036] hover:bg-[#1E2D25] disabled:opacity-50 rounded-md transition-colors flex items-center gap-2 shadow-2xs"
          >
            {isSubmitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
            <span>{isEditing ? 'Enregistrer les modifications' : 'Créer l’atelier'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
