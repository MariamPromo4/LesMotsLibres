# Les Mots Libres — Plateforme Associative d'Écriture Créative

Application web moderne pour l'association culturelle **Les Mots Libres** (loi 1901), dédiée à la pratique vivante de l'écriture littéraire : ateliers réguliers, masterclasses avec auteurs invités, marathons nocturnes et scènes ouvertes à Paris 20e.

---

## 🎯 Périmètre Réalisé : Étape 1

Conformément au cahier des charges et au PRD validé, l'**Étape 1** met en place les fondations complètes du site public et la préparation technique de la base de données :

1. **Page d'Accueil (`/` ou `#accueil`)** :
   - Manifeste éditorial et identité visuelle littéraire soignée (palette feutrée, typographie Newsreader & Plus Jakarta Sans).
   - Présentation de la philosophie et des 4 formats de rendez-vous.
   - Sélection des prochains ateliers à l'affiche avec jauges de places restantes.
   - Appel à l'action pour rejoindre les ateliers.

2. **Présentation de l'Association (`/association` ou `#association`)** :
   - Histoire, raison d'être et lutte contre le mythe du « génie solitaire ».
   - Les 4 valeurs fondamentales : Bienveillance absolue, Contrainte libératrice, Artisanat du style, Hospitalité.
   - Présentation de l'équipe d'animation (romancière, éditeur, dramaturge).
   - Repères clés (loi 1901, 12 participants max, atelier permanent à Belleville).

3. **Agenda & Liste des Événements (`/evenements` ou `#evenements`)** :
   - Catalogue des ateliers, masterclasses, marathons nocturnes et lectures.
   - Filtre doux par catégorie.
   - Cartes avec date, créneau horaire, lieu, animateur et places restantes.
   - État vide géré avec élégance.

4. **Fiche Détail d'un Événement (`/evenements/[slug]` ou `#evenement/[slug]`)** :
   - Titre, sous-titre, date, horaires détaillés, lieu et adresse complète.
   - Description complète de la séance et déroulement.
   - Prérequis pédagogiques et matériel suggéré.
   - Notice biographique de l'animateur.
   - Panneau latéral avec récapitulatif pratique, statut des places et bouton d'action d'inscription.
   - Partage d'URL en un clic.

5. **Formulaire de Contact (`/contact` ou `#contact`)** :
   - Coordonnées directes (courriel, adresse de l'atelier, accès métro, horaires de permanence).
   - Formulaire complet (nom, email, sujet, message) avec validation client rigoureuse.
   - Retours d'états (chargement, succès, message d'erreur).
   - Documentation de branchement d'API de messagerie.

6. **Préparation Supabase & Authentification (`/connexion` ou `#connexion`)** :
   - Client Supabase configuré avec détection automatique des clés d'environnement (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
   - Bascule immédiate entre mode Démo et mode connecté.
   - Sélecteur de profil de test (Adhérent membre vs Administrateur).
   - Visualiseur et exportateur du schéma SQL de migration Supabase avec politiques RLS (Row Level Security).

---

## 🛠️ Stack Technique

- **Framework** : React 18 avec TypeScript
- **Bundler / Dev Server** : Vite
- **Styles** : Tailwind CSS avec configuration typographique et palettes personnalisées
- **Iconographie** : Lucide React
- **Base de données & Auth** : Supabase JS SDK (PostgreSQL avec Row Level Security)
- **Typographie** : Newsreader (titres littéraires) & Plus Jakarta Sans (corps de texte lisible)

---

## 🚀 Installation et Démarrage Local

### 1. Cloner et installer les dépendances
```bash
git clone <url-du-repo>
cd les-mots-libres
npm install
```

### 2. Configurer les variables d'environnement
Dupliquez `.env.example` en `.env` :
```bash
cp .env.example .env
```
Renseignez vos clés Supabase (disponibles dans *Project Settings > API* sur [supabase.com](https://supabase.com)) :
```env
VITE_SUPABASE_URL="https://votre-projet.supabase.co"
VITE_SUPABASE_ANON_KEY="votre-cle-anon"
```
*(Remarque : l'application fonctionne immédiatement en mode démo interactif même si aucune clé Supabase n'est fournie).*

### 3. Lancer le serveur de développement
```bash
npm run dev
```
L'application est accessible sur `http://localhost:3000`.

### 4. Build de production
```bash
npm run build
```

---

## 🗄️ Schéma de Base de Données Supabase (Migration)

Le script SQL complet est situé dans :
`supabase/migrations/20260911_initial_schema.sql`

Pour l'appliquer :
1. Rendez-vous dans la console Supabase de votre projet.
2. Ouvrez l'onglet **SQL Editor**.
3. Collez le contenu du fichier `supabase/migrations/20260911_initial_schema.sql` (ou copiez-le directement depuis l'onglet « Schéma Supabase » de la page `/connexion` du site).
4. Cliquez sur **Run**.

Ce script configure :
- La table `profiles` avec association automatique via trigger sur `auth.users`.
- La table `events` avec les statuts (`draft`, `published`, `cancelled`, `archived`) et RLS pour lecture publique et écriture réservée aux administrateurs.
- La table `registrations` avec unicité `(event_id, user_id)` et contrôle des droits.

---

## 🧭 Prochaines Étapes (Feuille de route PRD)

- **Étape 2** : Finalisation de la synchronisation en temps réel Supabase, inscriptions authentifiées, profil adhérent et historique des séances.
- **Étape 3** : Espace d'administration complet pour la publication et l'édition des ateliers, export des listes d'émargement et modération.
- **Étape 4** : Adhésions annuelles, galerie des textes d'atelier et billetterie.
