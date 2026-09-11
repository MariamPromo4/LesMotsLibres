import { EventItem } from '../types';

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'evt-01',
    title: 'Déjouer la page blanche : amorces et premiers jets',
    slug: 'dejouer-la-page-blanche',
    subtitle: 'Atelier d’initiation à l’écriture spontanée',
    description: 'Une séance conviviale pour désamorcer l’autocensure, explorer des déclencheurs sensoriels et laisser émerger une écriture libre et vibrante.',
    full_description: `Cet atelier propose une immersion douce et stimulante dans l’acte d’écrire. Trop souvent, l’envie de bien faire paralyse le geste initial. Ici, nous coupons court au jugement critique pour renouer avec le plaisir du jaillissement textuel.

Au programme :
• Échauffement par micro-exercices d'association libre et découpage surréaliste.
• Écriture guidée à partir d’un objet du quotidien et d’un souvenir sensoriel (odeurs, sons de la ville).
• Phase d'écriture silencieuse en atelier (45 minutes).
• Partage des textes à voix haute pour ceux qui le souhaitent, dans un cadre de bienveillance absolue.

Aucune expérience préalable n'est nécessaire. L’atelier s’adresse à toute personne désireuse d'oser poser ses premiers mots sans crainte.`,
    date: '2026-09-26',
    formatted_date: 'Samedi 26 septembre 2026',
    start_time: '14:30',
    end_time: '17:30',
    location: 'L’Atelier des Mots Libres — Salle des Reliures',
    address: '18 rue des Cascades, 75020 Paris (Métro Jourdain ou Pyrénées)',
    capacity: 12,
    registered_count: 9,
    image_url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
    status: 'published',
    category: 'atelier',
    animator: {
      name: 'Clémence Valéry',
      role: 'Romancière & animatrice d’ateliers depuis 8 ans',
      bio: 'Autrice de deux romans publiés aux éditions Verticales, Clémence anime des espaces d’écriture où l’expérimentation ludique prime sur le dogme académique.'
    },
    prerequisites: 'Aucun prérequis. Ouvert à tous les niveaux, débutants bienvenus.',
    materials: [
      'Votre carnet ou cahier favori',
      'Un stylo agréable au tracé (plume, roller ou feutre)',
      'Une phrase ou citation qui vous hante en ce moment'
    ],
    price: 'Adhérents : 15 € / Non-adhérents : 25 €',
    created_at: '2026-08-15T10:00:00Z',
    updated_at: '2026-08-15T10:00:00Z'
  },
  {
    id: 'evt-02',
    title: 'Donner chair aux personnages : voix, failles et silences',
    slug: 'donner-chair-aux-personnages',
    subtitle: 'Masterclass de dramaturgie narrative',
    description: 'Comment inventer des êtres de papier crédibles sans tomber dans l’archétype ? Travail sur le monologue intérieur et le sous-texte.',
    full_description: `Un personnage marquant ne se résume pas à une fiche signalétique (taille, couleur des yeux, métier). Il vit par ses contradictions, ses non-dits, ses manies et la cadence singulière de sa voix intérieure.

Durant cette séance approfondie, nous disséquerons les ressorts de l’incarnation littéraire :
• Créer un conflit interne plutôt qu’un simple obstacle extérieur.
• Travailler le dialogue elliptique : faire entendre ce que les personnages taisent.
• Écriture d’une scène de confrontation feutrée entre deux êtres qui se connaissent trop bien.
• Restitution critique constructive et analyse d’extraits (Marguerite Duras, Annie Ernaux, Emmanuel Carrère).`,
    date: '2026-10-03',
    formatted_date: 'Samedi 3 octobre 2026',
    start_time: '10:00',
    end_time: '13:00',
    location: 'L’Atelier des Mots Libres — La Verrière',
    address: '18 rue des Cascades, 75020 Paris',
    capacity: 10,
    registered_count: 8,
    image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
    status: 'published',
    category: 'masterclass',
    animator: {
      name: 'Julien Darzac',
      role: 'Scénariste & nouvelliste',
      bio: 'Julien a écrit pour le théâtre contemporain et la radio publique avant de publier un recueil de nouvelles remarqué aux éditions de Minuit.'
    },
    prerequisites: 'Avoir déjà une petite pratique de l’écriture de fiction ou un projet en cours.',
    materials: [
      'Une ébauche de personnage (une ligne ou une image mentale)',
      'Support d’écriture au choix (carnet ou ordinateur portable)'
    ],
    price: 'Adhérents : 20 € / Non-adhérents : 32 €',
    created_at: '2026-08-20T11:00:00Z',
    updated_at: '2026-08-20T11:00:00Z'
  },
  {
    id: 'evt-03',
    title: 'La Nuit de l’Écritoire : marathon d’écriture nocturne',
    slug: 'nuit-de-l-ecritoire-marathon',
    subtitle: 'Expérience immersive du crépuscule à minuit',
    description: 'Six heures d’écriture collective scandées par des contraintes stylistiques surprises, des pauses tisane et des lectures à la bougie.',
    full_description: `Lorsque la ville s’apaise, l’esprit s’ouvre à d’autres résonances. La Nuit de l’Écritoire est notre grand rendez-vous trimestriel : un moment suspendu où une vingtaine de passionnés s’enferment dans l’atelier tamisé pour écrire ensemble.

Rythme de la soirée :
• 18h30 : Accueil, thé chaud et tirage au sort des défis d’écriture (contraintes Oulipo, variations de points de vue).
• 19h15 - 21h00 : Premier bloc d’écriture continue dans un silence recueilli.
• 21h00 - 21h45 : Buffet partagé (auberge espagnole douce) et échanges informels.
• 21h45 - 23h30 : Deuxième bloc d’écriture et fignolage d’un texte court complet.
• 23h30 - 00h30 : Cercle de lecture finale à la lumière des lampes de bureau.`,
    date: '2026-10-16',
    formatted_date: 'Vendredi 16 octobre 2026',
    start_time: '18:30',
    end_time: '00:30',
    location: 'L’Atelier des Mots Libres — Espace Général',
    address: '18 rue des Cascades, 75020 Paris',
    capacity: 18,
    registered_count: 14,
    image_url: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1200&q=80',
    status: 'published',
    category: 'marathon',
    animator: {
      name: 'Sarah Benali & Marc Vauthier',
      role: 'Co-fondateurs des Mots Libres',
      bio: 'Tous deux passionnés par les aventures littéraires collectives et les résidences d’écriture populaires.'
    },
    prerequisites: 'Ouvert à tous. Être prêt à vivre une expérience de concentration prolongée.',
    materials: [
      'Carnet d’écriture ou ordinateur chargé',
      'Un mets salé ou sucré simple à partager'
    ],
    price: 'Tarif unique : 20 € (boissons chaudes et encas offerts)',
    created_at: '2026-08-25T14:00:00Z',
    updated_at: '2026-08-25T14:00:00Z'
  },
  {
    id: 'evt-04',
    title: 'Écrire le réel : l’atelier du carnet et du récit intime',
    slug: 'ecrire-le-reel-recit-intime',
    subtitle: 'Mémoire, autofiction et fragments du quotidien',
    description: 'Partir de ses propres archives — photographies jaunies, tickets oubliés, bribes de souvenirs — pour façonner un texte littéraire.',
    full_description: `Comment faire de son expérience singulière une matière poétique et universelle ? Écrire le réel ne consiste pas à tenir un journal passif, mais à creuser la mémoire pour y déceler la musique des détails.

Points abordés :
• Observer le souvenir comme un archéologue : zoomer sur la texture d’un lieu, la couleur d’un vêtement.
• Le pacte autobiographique et le jeu avec la fiction.
• Exercice pratique : réécrire un même événement d’enfance sous trois angles émotionnels différents.
• Discussion collective sur l’éthique de l’écriture intime (parler de soi sans trahir les proches).`,
    date: '2026-10-24',
    formatted_date: 'Samedi 24 octobre 2026',
    start_time: '14:00',
    end_time: '17:00',
    location: 'L’Atelier des Mots Libres — Salle des Reliures',
    address: '18 rue des Cascades, 75020 Paris',
    capacity: 12,
    registered_count: 11,
    image_url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
    status: 'published',
    category: 'atelier',
    animator: {
      name: 'Marc Vauthier',
      role: 'Éditeur & essayiste',
      bio: 'Marc travaille depuis quinze ans dans l’édition indépendante et anime des résidences d’écriture autour des écritures mémorielles et de l’autofiction.'
    },
    prerequisites: 'Aucun. Chacun vient avec son histoire et son tempo.',
    materials: [
      'Une photo personnelle ou un objet modeste porteur d’un souvenir',
      'Votre matériel d’écriture habituel'
    ],
    price: 'Adhérents : 15 € / Non-adhérents : 25 €',
    created_at: '2026-09-01T09:00:00Z',
    updated_at: '2026-09-01T09:00:00Z'
  },
  {
    id: 'evt-05',
    title: 'Apéro-Lecture : voix chuchotées et textes en chantier',
    slug: 'apero-lecture-textes-en-chantier',
    subtitle: 'Scène ouverte intimiste et bienveillante',
    description: 'Un moment d’écoute et d’encouragement pour tester un extrait devant un public attentif, ou simplement venir écouter avec un verre.',
    full_description: `L’écriture naît souvent dans le secret, mais elle prend toute sa vibration lorsqu’elle rencontre une oreille fraternelle. L’Apéro-Lecture mensuel est l’instant convivial par excellence de notre association.

Principe :
• Chacun a 4 minutes maximum pour lire à voix haute un fragment de son choix (poème, début de nouvelle, lettre, note de carnet).
• Pas de jugement de valeur, uniquement des retours d'émotions (« Ce passage m'a touché parce que... »).
• Dégustation de jus artisanaux, tisanes et vins de vignerons indépendants.
• Inscription des lecteurs sur place le soir même dans la limite de 12 passages.`,
    date: '2026-11-05',
    formatted_date: 'Jeudi 5 novembre 2026',
    start_time: '19:30',
    end_time: '21:30',
    location: 'L’Atelier des Mots Libres — Le Salon',
    address: '18 rue des Cascades, 75020 Paris',
    capacity: 30,
    registered_count: 22,
    image_url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80',
    status: 'published',
    category: 'lecture',
    animator: {
      name: 'Équipe Les Mots Libres',
      role: 'Membres du collectif',
      bio: 'Une équipe bénévole de passionnés de littérature, typographes et relieurs d’art.'
    },
    prerequisites: 'Entrée libre et gratuite, adhésion de soutien conseillée.',
    materials: ['Votre texte imprimé ou manuscrit (si vous souhaitez lire)'],
    price: 'Entrée libre (consommations à prix associatif doux)',
    created_at: '2026-09-05T10:30:00Z',
    updated_at: '2026-09-05T10:30:00Z'
  }
];
