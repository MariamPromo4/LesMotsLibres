import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { EventItem, Profile, Writing, WritingCategory } from '../types';
import { INITIAL_EVENTS } from '../data/mockEvents';

// Supabase project credentials (provided by user)
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://tycsmuvtaopolmgcstmo.supabase.co';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_vrzldCQs8FY2YN12LnZXZQ_NuqpTlJ2';

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL &&
  SUPABASE_ANON_KEY &&
  !SUPABASE_URL.includes('your-project') &&
  SUPABASE_URL.startsWith('https://')
);

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

/**
 * Check if the database tables (specifically 'events') are created in Supabase
 */
export async function checkSupabaseTables(): Promise<{
  connected: boolean;
  tablesExist: boolean;
  message: string;
}> {
  try {
    const { data, error } = await supabase.from('events').select('id').limit(1);
    if (error) {
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        return {
          connected: true,
          tablesExist: false,
          message: 'Connecté au projet Supabase, mais les tables ne sont pas encore créées.'
        };
      }
      return {
        connected: false,
        tablesExist: false,
        message: error.message
      };
    }
    return {
      connected: true,
      tablesExist: true,
      message: 'Base de données Supabase connectée et opérationnelle.'
    };
  } catch (err: any) {
    return {
      connected: false,
      tablesExist: false,
      message: err?.message || 'Erreur de connexion à Supabase'
    };
  }
}

export function mapEventRow(row: any): EventItem {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    subtitle: row.subtitle || undefined,
    description: row.description,
    full_description: row.full_description || row.description,
    date: row.date,
    formatted_date: new Date(row.date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }),
    start_time: (row.start_time || '14:00').slice(0, 5),
    end_time: (row.end_time || '17:00').slice(0, 5),
    location: row.location,
    address: row.address || '',
    capacity: Number(row.capacity) || 12,
    registered_count: Number(row.registered_count) || 0,
    image_url: row.image_url || 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
    status: row.status || 'published',
    category: row.category || 'atelier',
    animator: {
      name: row.animator_name || 'Équipe d’animation',
      role: row.animator_role || '',
      bio: row.animator_bio || ''
    },
    prerequisites: row.prerequisites || undefined,
    materials: row.materials || undefined,
    price: row.price || undefined,
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

/**
 * Fetch events from Supabase with graceful fallback to initial events
 */
export async function fetchEventsFromSupabase(): Promise<EventItem[]> {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });

    if (error || !data || data.length === 0) {
      return INITIAL_EVENTS;
    }

    return data.map(mapEventRow);
  } catch {
    return INITIAL_EVENTS;
  }
}

/**
 * Register a user to an event in Supabase
 */
export async function registerInSupabase(
  eventId: string,
  userId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!userId) {
      return { success: false, error: 'Utilisateur non connecté' };
    }

    // Check if already registered
    const { data: existing } = await supabase
      .from('registrations')
      .select('id')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .maybeSingle();

    if (existing) {
      return { success: false, error: 'Vous êtes déjà inscrit(e) à cet atelier.' };
    }

    const { error } = await supabase.from('registrations').insert({
      event_id: eventId,
      user_id: userId,
      status: 'confirmed'
    });

    if (error) {
      if (error.message.includes('duplicate') || error.code === '23505') {
        return { success: false, error: 'Vous êtes déjà inscrit(e) à cet atelier.' };
      }
      return { success: false, error: error.message };
    }

    // Attempt to increment registered_count on events
    try {
      const { data: currentEvent } = await supabase
        .from('events')
        .select('registered_count')
        .eq('id', eventId)
        .single();
      if (currentEvent) {
        await supabase
          .from('events')
          .update({ registered_count: (currentEvent.registered_count || 0) + 1 })
          .eq('id', eventId);
      }
    } catch {
      // Non-blocking
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Erreur lors de l’inscription' };
  }
}

/**
 * Fetch member's registered event IDs
 */
export async function fetchMemberRegistrationIds(userId: string): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('registrations')
      .select('event_id')
      .eq('user_id', userId);

    if (error || !data) return [];
    return data.map((r: any) => r.event_id);
  } catch {
    return [];
  }
}

/**
 * Fetch member's registrations with joined events
 */
export async function fetchMemberRegistrations(userId: string) {
  try {
    const { data, error } = await supabase
      .from('registrations')
      .select('id, status, registered_at, event:events(*)')
      .eq('user_id', userId)
      .order('registered_at', { ascending: false });

    if (error || !data) {
      return [];
    }

    return data
      .filter((r: any) => r.event)
      .map((r: any) => ({
        id: r.id,
        status: r.status,
        registered_at: r.registered_at,
        event: mapEventRow(r.event)
      }));
  } catch {
    return [];
  }
}

/**
 * Update member's or admin's profile (first_name, last_name)
 * Security: strictly updates only first_name, last_name and updated_at.
 * Never touches role, id, or email.
 */
export async function updateMemberProfile(
  userId: string,
  updates: { first_name: string; last_name: string }
): Promise<{ success: boolean; error?: string }> {
  try {
    const trimmedFirst = updates.first_name.trim();
    const trimmedLast = updates.last_name.trim();

    if (!trimmedFirst) {
      return { success: false, error: 'Veuillez renseigner le prénom.' };
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: trimmedFirst,
        last_name: trimmedLast,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) {
      console.warn('Profile update error:', error.message);
      return {
        success: false,
        error: "Impossible d'enregistrer les modifications. Veuillez réessayer."
      };
    }
    return { success: true };
  } catch (err: any) {
    console.warn('Profile update exception:', err);
    return {
      success: false,
      error: "Impossible d'enregistrer les modifications. Veuillez réessayer."
    };
  }
}

/**
 * Admin: Update a member's profile
 */
export async function updateMemberProfileByAdmin(
  memberId: string,
  updates: { first_name: string; last_name: string }
): Promise<{ success: boolean; error?: string }> {
  return updateMemberProfile(memberId, updates);
}

/**
 * Admin: Fetch dashboard summary metrics
 */
export async function fetchAdminMetrics() {
  try {
    const today = new Date().toISOString().split('T')[0];

    // 1. Total members
    const { count: membersCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    // 2. Events metrics
    const { data: allEvents } = await supabase
      .from('events')
      .select('id, date');

    const totalEvents = allEvents?.length || 0;
    const upcomingEvents = allEvents?.filter((e: any) => e.date >= today).length || 0;

    // 3. Registrations metrics
    const { data: allRegistrations } = await supabase
      .from('registrations')
      .select('id, event:events(date)');

    const totalRegistrations = allRegistrations?.length || 0;
    const upcomingRegistrations =
      allRegistrations?.filter((r: any) => r.event?.date && r.event.date >= today).length || 0;

    return {
      totalMembers: membersCount || 0,
      totalEvents,
      upcomingEvents,
      totalRegistrations,
      upcomingRegistrations
    };
  } catch (err) {
    console.error('Error fetching admin metrics:', err);
    return {
      totalMembers: 0,
      totalEvents: 0,
      upcomingEvents: 0,
      totalRegistrations: 0,
      upcomingRegistrations: 0
    };
  }
}

/**
 * Admin: Fetch all events with real registration counts
 */
export async function fetchAdminEvents(): Promise<EventItem[]> {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*, registrations(count)')
      .order('date', { ascending: false });

    if (error || !data) {
      const fallback = await fetchEventsFromSupabase();
      return fallback;
    }

    return data.map((row: any) => {
      const item = mapEventRow(row);
      const realCount =
        Array.isArray(row.registrations) && row.registrations[0]
          ? Number(row.registrations[0].count)
          : item.registered_count;
      return { ...item, registered_count: realCount };
    });
  } catch {
    return fetchEventsFromSupabase();
  }
}

/**
 * Admin: Fetch participants of a specific event
 */
export async function fetchEventParticipants(eventId: string) {
  try {
    const { data, error } = await supabase
      .from('registrations')
      .select('id, status, registered_at, profile:profiles(id, first_name, last_name, email)')
      .eq('event_id', eventId)
      .order('registered_at', { ascending: false });

    if (error || !data) return [];

    return data.map((row: any) => ({
      id: row.id,
      status: row.status,
      registered_at: row.registered_at,
      first_name: row.profile?.first_name || 'Adhérent',
      last_name: row.profile?.last_name || '',
      email: row.profile?.email || '—'
    }));
  } catch {
    return [];
  }
}

/**
 * Admin: Fetch members list with their registrations count
 */
export async function fetchAdminMembers() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email, role, created_at, registrations(count)')
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map((row: any) => ({
      id: row.id,
      first_name: row.first_name,
      last_name: row.last_name,
      email: row.email,
      role: row.role,
      created_at: row.created_at,
      registrations_count:
        Array.isArray(row.registrations) && row.registrations[0]
          ? Number(row.registrations[0].count)
          : 0
    }));
  } catch {
    return [];
  }
}

/**
 * Admin: Fetch member detailed registrations
 */
export async function fetchMemberHistoryForAdmin(userId: string) {
  try {
    const { data, error } = await supabase
      .from('registrations')
      .select('id, status, registered_at, event:events(*)')
      .eq('user_id', userId)
      .order('registered_at', { ascending: false });

    if (error || !data) return [];

    return data
      .filter((r: any) => r.event)
      .map((r: any) => ({
        id: r.id,
        status: r.status,
        registered_at: r.registered_at,
        event: mapEventRow(r.event)
      }));
  } catch {
    return [];
  }
}

/**
 * Admin: Fetch all registrations with event and member details
 */
export async function fetchAdminRegistrations() {
  try {
    const { data, error } = await supabase
      .from('registrations')
      .select('id, status, registered_at, event:events(*), profile:profiles(*)')
      .order('registered_at', { ascending: false });

    if (error || !data) return [];

    return data
      .filter((r: any) => r.event && r.profile)
      .map((r: any) => ({
        id: r.id,
        event_id: r.event.id,
        user_id: r.profile.id,
        status: r.status,
        registered_at: r.registered_at,
        event: mapEventRow(r.event),
        profile: {
          id: r.profile.id,
          first_name: r.profile.first_name,
          last_name: r.profile.last_name,
          email: r.profile.email,
          role: r.profile.role,
          created_at: r.profile.created_at
        }
      }));
  } catch {
    return [];
  }
}

/**
 * Admin: Create an event
 */
export async function createAdminEvent(eventData: any): Promise<{ success: boolean; data?: EventItem; error?: string }> {
  try {
    const slug =
      eventData.slug ||
      eventData.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') +
        '-' +
        Date.now().toString().slice(-4);

    const payload = {
      title: eventData.title,
      slug,
      subtitle: eventData.subtitle || null,
      description: eventData.description,
      full_description: eventData.full_description || eventData.description,
      date: eventData.date,
      start_time: eventData.start_time || '14:00:00',
      end_time: eventData.end_time || '17:00:00',
      location: eventData.location,
      address: eventData.address || null,
      capacity: Number(eventData.capacity) || 12,
      registered_count: 0,
      image_url: eventData.image_url || 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
      status: eventData.status || 'published',
      category: eventData.category || 'atelier',
      animator_name: eventData.animator_name || 'Équipe d’animation',
      animator_role: eventData.animator_role || null,
      animator_bio: eventData.animator_bio || null,
      prerequisites: eventData.prerequisites || null,
      materials: eventData.materials || null,
      price: eventData.price || 'Adhérents : 15 €'
    };

    const { data, error } = await supabase
      .from('events')
      .insert(payload)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: mapEventRow(data) };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Erreur lors de la création de l’atelier' };
  }
}

/**
 * Admin: Update an existing event
 */
export async function updateAdminEvent(
  eventId: string,
  eventData: any
): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = {
      title: eventData.title,
      subtitle: eventData.subtitle || null,
      description: eventData.description,
      full_description: eventData.full_description || eventData.description,
      date: eventData.date,
      start_time: eventData.start_time,
      end_time: eventData.end_time,
      location: eventData.location,
      address: eventData.address || null,
      capacity: Number(eventData.capacity) || 12,
      status: eventData.status,
      category: eventData.category,
      animator_name: eventData.animator_name,
      animator_role: eventData.animator_role || null,
      animator_bio: eventData.animator_bio || null,
      prerequisites: eventData.prerequisites || null,
      materials: eventData.materials || null,
      price: eventData.price || null,
      image_url: eventData.image_url,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('events')
      .update(payload)
      .eq('id', eventId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Erreur lors de la mise à jour' };
  }
}

/**
 * Admin: Delete an event
 */
export async function deleteAdminEvent(eventId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Erreur lors de la suppression' };
  }
}

// ========================================================
// SECTION ÉCRITS / PUBLICATIONS (WRITINGS)
// ========================================================

/**
 * Public: Récupère les derniers écrits publiés (pour la Home)
 */
export async function fetchPublicRecentWritings(limit: number = 3): Promise<Writing[]> {
  try {
    const { data, error } = await supabase
      .from('writings')
      .select(`
        id,
        author_id,
        title,
        category,
        content,
        created_at,
        updated_at,
        author:profiles!author_id (
          id,
          first_name,
          last_name,
          email
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.warn('Writings table may not exist yet or query failed:', error.message);
      return [];
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      author_id: row.author_id,
      title: row.title,
      category: row.category,
      content: row.content,
      created_at: row.created_at,
      updated_at: row.updated_at,
      author: row.author
    }));
  } catch (err) {
    console.warn('Erreur fetchPublicRecentWritings:', err);
    return [];
  }
}

/**
 * Public: Récupère l'ensemble des écrits publiés (pour la page /writings)
 */
export async function fetchPublicWritings(): Promise<Writing[]> {
  try {
    const { data, error } = await supabase
      .from('writings')
      .select(`
        id,
        author_id,
        title,
        category,
        content,
        created_at,
        updated_at,
        author:profiles!author_id (
          id,
          first_name,
          last_name,
          email
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('fetchPublicWritings error:', error.message);
      return [];
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      author_id: row.author_id,
      title: row.title,
      category: row.category,
      content: row.content,
      created_at: row.created_at,
      updated_at: row.updated_at,
      author: row.author
    }));
  } catch (err) {
    console.warn('Erreur fetchPublicWritings:', err);
    return [];
  }
}

/**
 * Public: Récupère un écrit complet par son id (pour la lecture complète)
 */
export async function fetchPublicWritingById(id: string): Promise<Writing | null> {
  try {
    const { data, error } = await supabase
      .from('writings')
      .select(`
        id,
        author_id,
        title,
        category,
        content,
        created_at,
        updated_at,
        author:profiles!author_id (
          id,
          first_name,
          last_name,
          email
        )
      `)
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      author_id: data.author_id,
      title: data.title,
      category: data.category,
      content: data.content,
      created_at: data.created_at,
      updated_at: data.updated_at,
      author: (data as any).author
    };
  } catch (err) {
    console.warn('Erreur fetchPublicWritingById:', err);
    return null;
  }
}

/**
 * Membre: Récupère tous les écrits du membre connecté
 */
export async function fetchMemberWritings(authorId: string): Promise<Writing[]> {
  try {
    const { data, error } = await supabase
      .from('writings')
      .select(`
        id,
        author_id,
        title,
        category,
        content,
        created_at,
        updated_at
      `)
      .eq('author_id', authorId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('fetchMemberWritings error:', error.message);
      return [];
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      author_id: row.author_id,
      title: row.title,
      category: row.category,
      content: row.content,
      created_at: row.created_at,
      updated_at: row.updated_at
    }));
  } catch (err) {
    console.warn('Erreur fetchMemberWritings:', err);
    return [];
  }
}

/**
 * Membre: Publier un écrit associé au compte connecté
 */
export async function createWriting(writing: {
  title: string;
  category: WritingCategory;
  content: string;
  author_id: string;
}): Promise<{ success: boolean; data?: Writing; error?: string }> {
  try {
    const payload = {
      title: writing.title.trim(),
      category: writing.category || 'Autre',
      content: writing.content.trim(),
      author_id: writing.author_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('writings')
      .insert(payload)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      data: data as Writing
    };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Erreur lors de la publication' };
  }
}

/**
 * Membre: Modifier son propre écrit
 */
export async function updateWriting(
  id: string,
  updates: {
    title: string;
    category: WritingCategory;
    content: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = {
      title: updates.title.trim(),
      category: updates.category || 'Autre',
      content: updates.content.trim(),
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('writings')
      .update(payload)
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Erreur lors de la modification' };
  }
}

/**
 * Membre ou Admin: Supprimer un écrit (RLS assure que le membre ne supprime que le sien, et l'admin peut supprimer)
 */
export async function deleteWriting(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('writings')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Erreur lors de la suppression' };
  }
}

/**
 * Admin: Récupère l'ensemble des publications avec leurs auteurs et les métriques
 */
export async function fetchAdminWritings(): Promise<{
  writings: Writing[];
  totalCount: number;
  authorsCount: number;
  monthCount: number;
}> {
  try {
    const { data, error } = await supabase
      .from('writings')
      .select(`
        id,
        author_id,
        title,
        category,
        content,
        created_at,
        updated_at,
        author:profiles!author_id (
          id,
          first_name,
          last_name,
          email
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('fetchAdminWritings error:', error.message);
      return { writings: [], totalCount: 0, authorsCount: 0, monthCount: 0 };
    }

    const items: Writing[] = (data || []).map((row: any) => ({
      id: row.id,
      author_id: row.author_id,
      title: row.title,
      category: row.category,
      content: row.content,
      created_at: row.created_at,
      updated_at: row.updated_at,
      author: row.author
    }));

    const authorIds = new Set(items.map((w) => w.author_id));
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthCount = items.filter((w) => {
      const d = new Date(w.created_at);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;

    return {
      writings: items,
      totalCount: items.length,
      authorsCount: authorIds.size,
      monthCount
    };
  } catch (err) {
    console.warn('Erreur fetchAdminWritings:', err);
    return { writings: [], totalCount: 0, authorsCount: 0, monthCount: 0 };
  }
}


/**
 * SQL Schema definition for Supabase migration
 */
export const SUPABASE_SQL_SCHEMA = `-- ========================================================
-- LES MOTS LIBRES — Schéma PostgreSQL / Supabase
-- Base de données pour l'association littéraire
-- Tables : profiles, events, registrations + RLS & Trigger
-- ========================================================

-- 1. Extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Types Énumérés
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('member', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE event_status AS ENUM ('draft', 'published', 'cancelled', 'archived');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE registration_status AS ENUM ('confirmed', 'waitlist', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. Table PROFILES (reliée à auth.users de Supabase)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role user_role DEFAULT 'member' NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- RLS Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Les profils sont consultables par les membres connectés" ON public.profiles;
CREATE POLICY "Les profils sont consultables par les membres connectés"
  ON public.profiles FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Un utilisateur peut modifier son propre profil" ON public.profiles;
CREATE POLICY "Un utilisateur peut modifier son propre profil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 4. Table EVENTS
CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  subtitle TEXT,
  description TEXT NOT NULL,
  full_description TEXT,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location TEXT NOT NULL,
  address TEXT,
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  registered_count INTEGER DEFAULT 0 NOT NULL,
  image_url TEXT,
  status event_status DEFAULT 'published' NOT NULL,
  category TEXT DEFAULT 'atelier' NOT NULL,
  animator_name TEXT NOT NULL,
  animator_role TEXT,
  animator_bio TEXT,
  prerequisites TEXT,
  materials TEXT[],
  price TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- RLS Events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Les événements publiés sont visibles publiquement par tous" ON public.events;
CREATE POLICY "Les événements publiés sont visibles publiquement par tous"
  ON public.events FOR SELECT
  USING (status = 'published' OR (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  ));

DROP POLICY IF EXISTS "Seuls les administrateurs peuvent insérer/modifier des événements" ON public.events;
CREATE POLICY "Seuls les administrateurs peuvent insérer/modifier des événements"
  ON public.events FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- 5. Table REGISTRATIONS
CREATE TABLE IF NOT EXISTS public.registrations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status registration_status DEFAULT 'confirmed' NOT NULL,
  registered_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE (event_id, user_id)
);

-- RLS Registrations
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Un membre peut voir ses propres inscriptions" ON public.registrations;
CREATE POLICY "Un membre peut voir ses propres inscriptions"
  ON public.registrations FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Un membre authentifié peut s'inscrire à un événement" ON public.registrations;
CREATE POLICY "Un membre authentifié peut s'inscrire à un événement"
  ON public.registrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Les administrateurs peuvent voir et gérer toutes les inscriptions" ON public.registrations;
CREATE POLICY "Les administrateurs peuvent voir et gérer toutes les inscriptions"
  ON public.registrations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- 6. Trigger automatique pour créer un profil lors du Sign-Up Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'Membre'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    NEW.email,
    'member'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. Données initiales d'exemple (Ateliers d'écriture Les Mots Libres)
INSERT INTO public.events (
  title, slug, subtitle, description, full_description, date, start_time, end_time,
  location, address, capacity, registered_count, image_url, status, category,
  animator_name, animator_role, animator_bio, prerequisites, materials, price
)
VALUES 
(
  'Déjouer la page blanche : amorces et premiers jets',
  'dejouer-la-page-blanche',
  'Atelier d’initiation à l’écriture spontanée',
  'Une séance conviviale pour désamorcer l’inhibition du départ, libérer le geste d’écrire à travers des jeux oulipiens et des déclencheurs sensoriels.',
  'Comment franchir le seuil du premier mot sans céder au doute ou à l’autocensure ? Cet atelier fondateur s’adresse à toute personne désireuse de renouer avec le plaisir pur d’écrire...',
  '2026-09-26',
  '14:30:00',
  '17:30:00',
  'L’Atelier des Mots Libres — Salle des Reliures',
  '18 rue des Cascades, 75020 Paris (Métro Jourdain ou Pyrénées)',
  12,
  9,
  'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
  'published',
  'atelier',
  'Clémence Valéry',
  'Romancière & animatrice d’ateliers depuis 8 ans',
  'Autrice de deux romans publiés aux éditions Verticales, Clémence anime des groupes de création littéraire avec un souci constant d’écoute bienveillante et d’audace stylistique.',
  'Aucun prérequis. Ouvert à tous les niveaux, débutants bienvenus.',
  ARRAY['Votre carnet ou cahier favori', 'Un stylo agréable au tracé fluide', 'Votre curiosité sans aucun filtre'],
  'Adhérents : 15 € / Non-adhérents : 25 €'
),
(
  'L’Art de la Nouvelle : tension, chute et condensation',
  'l-art-de-la-nouvelle',
  'Masterclass intensive d’architecture narrative',
  'Explorer les mécanismes du récit court : caractérisation express des personnages, ellipse dramatique et travail chirurgical de la chute.',
  'La nouvelle littéraire n’est pas un roman raccourci, mais un monde clos soumis à une pression constante...',
  '2026-10-03',
  '10:00:00',
  '17:00:00',
  'Bibliothèque Associative Belleville',
  '24 rue Julien-Lacroix, 75020 Paris',
  10,
  8,
  'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80',
  'published',
  'masterclass',
  'Marc-Antoine Delorme',
  'Nouvelliste & critique littéraire',
  'Lauréat du Prix de la Nouvelle en 2021, Marc-Antoine partage son expertise minutieuse de l’économie de mots et du rythme des scènes.',
  'Avoir déjà une ébauche de texte ou un goût prononcé pour la fiction brève.',
  ARRAY['Ordinateur portable ou carnet de travail', 'Une idée ou ébauche de scénario en trois lignes'],
  'Adhérents : 35 € / Non-adhérents : 50 €'
),
(
  'Marathon Nocturne des Écritures d’Automne',
  'marathon-nocturne-automne',
  'Nuit blanche d’écriture collective et contraintes horaires',
  'Six heures d’immersion totale du crépuscule à minuit, rythmées par des consignes surprises renouvelées toutes les heures et des collations partagées.',
  'Quand la ville s’endort et que le silence se dépose sur les toits de Belleville, les plumes s’éveillent...',
  '2026-10-17',
  '18:30:00',
  '00:30:00',
  'L’Atelier des Mots Libres — Les Combles',
  '18 rue des Cascades, 75020 Paris',
  16,
  14,
  'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?auto=format&fit=crop&w=1200&q=80',
  'published',
  'marathon',
  'Sarah Benali & Julien Meyer',
  'Duo d’animation & musiciens de mots',
  'Sarah et Julien orchestrent depuis cinq ans ces nuits blanches d’écriture devenues le rendez-vous culte de l’association.',
  'Ouvert à tous. Capacité d’endurance douce et bonne humeur nocturne requises !',
  ARRAY['Carnets multiples ou tablette', 'Gourde et thermos personnel (tisane et café offerts)', 'Plaid douillet conseillé'],
  'Tarif unique participatif : 20 € (collations incluses)'
),
(
  'Récits de Ville : Arpentage poétique du quartier de Ménilmontant',
  'recits-de-ville-menilmontant',
  'Atelier déambulatoire et carnet de bord',
  'Écrire in situ en marchant : observer les détails invisibles, capter les bribes de conversations et transposer le paysage urbain en prose poétique.',
  'La ville est un palimpseste où chaque ruelle raconte une histoire...',
  '2026-10-24',
  '14:00:00',
  '17:30:00',
  'Départ : Place Maurice Chevalier (devant l’église Notre-Dame de la Croix)',
  'Place Maurice Chevalier, 75020 Paris',
  12,
  7,
  'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1200&q=80',
  'published',
  'atelier',
  'Amina Cherif',
  'Poétesse urbaine et géographe de formation',
  'Amina explore les frottements entre géographie sensible et vers libre à travers des marches d’écriture partout en Île-de-France.',
  'Chaussures confortables pour la marche.',
  ARRAY['Petit carnet de poche rigide', 'Crayon ou feutre ne craignant pas le vent'],
  'Adhérents : 15 € / Non-adhérents : 25 €'
),
(
  'Apéro-Lecture & Scène Ouverte : Voix Croisées',
  'apero-lecture-scene-ouverte',
  'Partage chaleureux de textes courts et lectures à voix haute',
  'Un moment suspendu où chacun est invité à lire un extrait de son cru (ou d’un auteur chéri) pendant 3 à 5 minutes, suivi d’un buffet partagé.',
  'Parce que les textes prennent toute leur dimension lorsqu’ils résonnent dans l’espace...',
  '2026-11-06',
  '19:00:00',
  '22:00:00',
  'Le Café Littéraire « Les Rêveurs »',
  '42 rue de Ménilmontant, 75020 Paris',
  25,
  18,
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
  'published',
  'lecture',
  'Collectif des Mots Libres',
  'Membres de l’association & bénévoles',
  'Une animation collégiale et bienveillante pour écouter, applaudir et échanger autour d’un verre.',
  'Entrée libre, réservation conseillée pour la jauge.',
  ARRAY['Votre texte imprimé ou manuscrit (3 à 5 min max)', 'Une petite spécialité à grignoter à partager si souhaité'],
  'Entrée libre sur consommation de courtoisie au café'
)
ON CONFLICT (slug) DO NOTHING;

-- 8. Table WRITINGS (Écrits des membres)
CREATE TABLE IF NOT EXISTS public.writings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Autre' CHECK (category IN ('Nouvelle', 'Poésie', 'Récit', 'Autre')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS writings_created_at_idx ON public.writings(created_at DESC);
CREATE INDEX IF NOT EXISTS writings_author_id_idx ON public.writings(author_id);

-- RLS Writings
ALTER TABLE public.writings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lecture publique des écrits" ON public.writings;
CREATE POLICY "Lecture publique des écrits"
  ON public.writings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Un membre connecté peut publier son propre écrit" ON public.writings;
CREATE POLICY "Un membre connecté peut publier son propre écrit"
  ON public.writings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Un membre peut modifier son propre écrit" ON public.writings;
CREATE POLICY "Un membre peut modifier son propre écrit"
  ON public.writings FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Suppression par l'auteur ou l'administrateur" ON public.writings;
CREATE POLICY "Suppression par l'auteur ou l'administrateur"
  ON public.writings FOR DELETE
  TO authenticated
  USING (
    auth.uid() = author_id OR 
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );
`;

// Helper mock profiles for testing preview state
export const DEMO_PROFILES: Record<string, Profile> = {
  member: {
    id: 'usr-member-01',
    first_name: 'Camille',
    last_name: 'Rousseau',
    email: 'camille.rousseau@exemple.fr',
    role: 'member',
    created_at: '2026-06-12T14:00:00Z',
    updated_at: '2026-06-12T14:00:00Z',
    bio: 'Passionnée de micro-fiction et de carnets d’observation urbaine.'
  },
  admin: {
    id: 'usr-admin-01',
    first_name: 'Sarah',
    last_name: 'Benali',
    email: 'sarah.benali@lesmotslibres.fr',
    role: 'admin',
    created_at: '2026-01-10T09:00:00Z',
    updated_at: '2026-01-10T09:00:00Z',
    bio: 'Animatrice d’ateliers d’écriture et coordinatrice des Mots Libres.'
  }
};
