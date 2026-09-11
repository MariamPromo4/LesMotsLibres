import React, { useState } from 'react';
import { Mail, MapPin, Clock, Send, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export const ContactView: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('Question sur un atelier');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic validation
    if (!name.trim()) {
      setErrorMessage('Veuillez renseigner votre nom.');
      return;
    }
    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setErrorMessage('Veuillez renseigner une adresse e-mail valide.');
      return;
    }
    if (!message.trim() || message.trim().length < 10) {
      setErrorMessage('Votre message doit contenir au moins 10 caractères.');
      return;
    }

    setIsSubmitting(true);

    // Simulated network latency (step 1 interface preparation)
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
    }, 900);
  };

  return (
    <div className="space-y-16 pb-24">
      {/* 1. Header Contact */}
      <section className="pt-12 pb-10 border-b border-[#E7E2DA] max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#994D2B]">
            Écrire à l'association
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#1C1917] font-normal tracking-tight">
            Contactez Les Mots Libres
          </h1>
          <p className="text-sm sm:text-base text-[#57534E] leading-relaxed">
            Une question sur le déroulement d'un atelier, un besoin d'adaptation ou une idée de partenariat d'écriture ? Notre équipe bénévole vous répond avec plaisir sous 48 heures.
          </p>
        </div>
      </section>

      {/* 2. Main 2 columns: Contact Details & Interactive Form */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left: Contact Info & Access (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-6">
              <h2 className="font-serif text-2xl text-[#1C1917] font-medium">
                Nos coordonnées & accès
              </h2>

              <div className="space-y-4 text-sm text-[#44403C]">
                {/* Email */}
                <div className="flex items-start gap-3.5 p-4 bg-[#FAF7F2] rounded-lg border border-[#E7E2DA]">
                  <Mail className="w-5 h-5 text-[#994D2B] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#78716C]">Courriel</div>
                    <a href="mailto:contact@lesmotslibres.fr" className="font-medium text-[#1C1917] hover:text-[#994D2B] transition-colors">
                      contact@lesmotslibres.fr
                    </a>
                    <div className="text-xs text-[#78716C] mt-0.5">Réponse garantie du mardi au samedi</div>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3.5 p-4 bg-[#FAF7F2] rounded-lg border border-[#E7E2DA]">
                  <MapPin className="w-5 h-5 text-[#994D2B] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#78716C]">L'Atelier permanent</div>
                    <div className="font-medium text-[#1C1917]">18 rue des Cascades, 75020 Paris</div>
                    <div className="text-xs text-[#78716C] mt-1">
                      Métro : Jourdain (Ligne 11) ou Pyrénées (Ligne 11)<br />
                      Bus : Lignes 26 et 96 (Arrêt Pyrénées - Ménilmontant)
                    </div>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-3.5 p-4 bg-[#FAF7F2] rounded-lg border border-[#E7E2DA]">
                  <Clock className="w-5 h-5 text-[#994D2B] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#78716C]">Permanence d'accueil</div>
                    <div className="font-medium text-[#1C1917]">Le samedi de 13h30 à 18h30</div>
                    <div className="text-xs text-[#78716C] mt-0.5">
                      Passez feuilleter notre bibliothèque associative ou discuter autour d'une tisane.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Note on Step 1 architecture */}
            <div className="p-4 rounded-lg bg-[#EAE2D7]/70 border border-[#D5CABE] text-xs text-[#57534E] space-y-1">
              <span className="font-semibold text-[#1C1917] block">Note d'architecture (Étape 1) :</span>
              <p>
                Le formulaire de contact valide rigoureusement les données saisies côté client. La connexion avec un service d'envoi réel (Resend, SendGrid ou Edge Function Supabase) est anticipée pour les étapes suivantes.
              </p>
            </div>
          </div>

          {/* Right: The Contact Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-[#FAF7F2] p-8 sm:p-10 rounded-xl border border-[#E7E2DA] shadow-xs space-y-6">
              <div className="border-b border-[#EAE2D7] pb-4">
                <h3 className="font-serif text-2xl text-[#1C1917] font-medium">
                  Envoyez-nous un message
                </h3>
                <p className="text-xs text-[#57534E] mt-1">
                  Tous les champs marqués d’un astérisque (*) sont obligatoires.
                </p>
              </div>

              {submittedSuccess ? (
                <div className="p-6 bg-[#E8F0EC] border border-[#C5D9CE] rounded-lg text-[#2E4036] space-y-3 animate-in fade-in">
                  <div className="flex items-center gap-2.5 font-serif text-lg font-semibold">
                    <CheckCircle2 className="w-5 h-5 text-[#2E4036]" />
                    <span>Votre message a été transmis avec succès !</span>
                  </div>
                  <p className="text-xs text-[#2E4036] leading-relaxed">
                    Merci pour votre mot. Un membre bénévole de l'association Les Mots Libres prendra connaissance de votre message et vous répondra par e-mail dans les plus brefs délais.
                  </p>
                  <button
                    onClick={() => setSubmittedSuccess(false)}
                    className="mt-2 text-xs font-semibold text-[#2E4036] underline hover:text-[#1E2D25]"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {errorMessage && (
                    <div className="p-3 bg-[#FEE2E2] border border-[#FECACA] rounded-md text-xs text-[#B91C1C] flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Nom & Prénom */}
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1.5">
                      Nom & Prénom *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="ex. Marguerite Duras"
                      className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-[#D5CABE] rounded-md text-sm text-[#1C1917] placeholder:text-[#A8A196] focus:outline-none focus:ring-1 focus:ring-[#2E4036] focus:border-[#2E4036]"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1.5">
                      Adresse e-mail *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre.adresse@exemple.fr"
                      className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-[#D5CABE] rounded-md text-sm text-[#1C1917] placeholder:text-[#A8A196] focus:outline-none focus:ring-1 focus:ring-[#2E4036] focus:border-[#2E4036]"
                    />
                  </div>

                  {/* Objet */}
                  <div>
                    <label htmlFor="contact-subject" className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1.5">
                      Sujet de votre demande
                    </label>
                    <select
                      id="contact-subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-[#D5CABE] rounded-md text-sm text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#2E4036] focus:border-[#2E4036]"
                    >
                      <option value="Question sur un atelier">Question sur un atelier spécifique</option>
                      <option value="Adhésion association">Adhésion & soutien à l'association</option>
                      <option value="Proposition d'animation">Proposition d'animation ou masterclass</option>
                      <option value="Partenariat culturel">Partenariat culturel ou scolaire</option>
                      <option value="Autre">Autre demande</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1.5">
                      Votre message *
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Écrivez-nous librement ici..."
                      className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-[#D5CABE] rounded-md text-sm text-[#1C1917] placeholder:text-[#A8A196] focus:outline-none focus:ring-1 focus:ring-[#2E4036] focus:border-[#2E4036] resize-y"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    id="submit-contact-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 bg-[#2E4036] hover:bg-[#1E2D25] text-[#FAF7F2] rounded-md text-sm font-semibold transition-all shadow-xs disabled:opacity-70 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="inline-block w-4 h-4 border-2 border-[#FAF7F2] border-t-transparent rounded-full animate-spin"></span>
                        <span>Envoi en cours...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Envoyer mon message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};
