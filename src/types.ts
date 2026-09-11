export type UserRole = 'member' | 'admin';

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at?: string;
  bio?: string;
  avatar_url?: string;
}

export type EventStatus = 'published' | 'draft' | 'cancelled' | 'archived';
export type EventCategory = 'atelier' | 'masterclass' | 'marathon' | 'lecture';

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  description: string;
  full_description: string;
  date: string; // YYYY-MM-DD
  formatted_date: string;
  start_time: string; // HH:MM
  end_time: string; // HH:MM
  location: string;
  address: string;
  capacity: number;
  registered_count: number;
  image_url: string;
  status: EventStatus;
  category: EventCategory;
  animator: {
    name: string;
    role: string;
    bio: string;
  };
  prerequisites?: string;
  materials?: string[];
  price?: string;
  created_at: string;
  updated_at?: string;
}

export type RegistrationStatus = 'confirmed' | 'waitlist' | 'cancelled';

export interface Registration {
  id: string;
  event_id: string;
  user_id: string;
  status: RegistrationStatus;
  registered_at: string;
  participant_name?: string;
  participant_email?: string;
}

export type ActivePage = 'home' | 'about' | 'events' | 'event-detail' | 'contact' | 'connexion';
