import React, { useState, useEffect } from 'react';
import { ActivePage, EventItem, Profile } from './types';
import { INITIAL_EVENTS } from './data/mockEvents';
import {
  supabase,
  fetchEventsFromSupabase,
  registerInSupabase
} from './lib/supabase';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { AboutView } from './components/AboutView';
import { EventsListView } from './components/EventsListView';
import { EventDetailView } from './components/EventDetailView';
import { ContactView } from './components/ContactView';
import { ConnexionView } from './components/ConnexionView';
import { RegistrationModal } from './components/RegistrationModal';

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [registeringEvent, setRegisteringEvent] = useState<EventItem | null>(null);
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [userRegistrations, setUserRegistrations] = useState<string[]>([]);
  const [notification, setNotification] = useState<{ text: string; type?: 'info' | 'success' } | null>(null);

  // Load events from Supabase on mount
  useEffect(() => {
    async function loadData() {
      const liveEvents = await fetchEventsFromSupabase();
      if (liveEvents && liveEvents.length > 0) {
        setEvents(liveEvents);
      }
    }
    loadData();

    // Listen to Supabase auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Fetch or create profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setCurrentUser(profile as Profile);
        } else {
          setCurrentUser({
            id: session.user.id,
            first_name: session.user.user_metadata?.first_name || 'Membre',
            last_name: session.user.user_metadata?.last_name || '',
            email: session.user.email || '',
            role: 'member',
            created_at: session.user.created_at
          });
        }
      } else {
        // Only clear if not in demo session
        setCurrentUser((prev) => (prev?.id?.startsWith('usr-') ? prev : null));
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Sync with browser URL hash for friendly deep linking & back/forward
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('evenement/')) {
        const slug = hash.replace('evenement/', '');
        const found = events.find((e) => e.slug === slug || e.id === slug);
        if (found) {
          setSelectedEvent(found);
          setActivePage('event-detail');
          return;
        }
      }

      switch (hash) {
        case 'association':
          setActivePage('about');
          break;
        case 'evenements':
        case 'agenda':
          setActivePage('events');
          break;
        case 'contact':
          setActivePage('contact');
          break;
        case 'connexion':
        case 'membre':
          setActivePage('connexion');
          break;
        case 'accueil':
        case '':
          setActivePage('home');
          break;
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [events]);

  const handleNavigate = (page: ActivePage) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (page === 'home') window.location.hash = '';
    else if (page === 'about') window.location.hash = 'association';
    else if (page === 'events') window.location.hash = 'evenements';
    else if (page === 'contact') window.location.hash = 'contact';
    else if (page === 'connexion') window.location.hash = 'connexion';
  };

  const handleSelectEvent = (event: EventItem) => {
    setSelectedEvent(event);
    setActivePage('event-detail');
    window.location.hash = `evenement/${event.slug}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenRegistration = (event: EventItem) => {
    setRegisteringEvent(event);
  };

  const handleConfirmRegistration = (
    event: EventItem,
    details: { firstName: string; lastName: string; email: string }
  ) => {
    // Record registration locally in UI state
    setUserRegistrations((prev) => [...prev, event.id]);
    
    // Update local count
    setEvents((prev) =>
      prev.map((e) => (e.id === event.id ? { ...e, registered_count: e.registered_count + 1 } : e))
    );

    // Persist to Supabase if connected
    registerInSupabase(event.id, currentUser?.id).catch((err) => {
      console.warn('Supabase registration sync warning:', err);
    });

    // Provide friendly confirmation
    setNotification({
      text: `Pré-inscription enregistrée pour « ${event.title} ». Un courriel de confirmation est envoyé à ${details.email}.`,
      type: 'success'
    });

    setTimeout(() => {
      setNotification(null);
    }, 6000);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1C1917] font-sans flex flex-col selection:bg-[#EAE2D7] selection:text-[#2E4036]">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-[#2E4036] text-[#FAF7F2] p-4 rounded-lg shadow-lg border border-[#3E5549] animate-in fade-in slide-in-from-bottom-3 text-xs leading-relaxed flex items-start justify-between gap-3">
          <span>{notification.text}</span>
          <button
            onClick={() => setNotification(null)}
            className="text-[#FAF7F2]/70 hover:text-white font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Primary Navigation Bar */}
      <Navbar
        activePage={activePage}
        setActivePage={handleNavigate}
        onOpenAuth={() => handleNavigate('connexion')}
        currentUser={currentUser}
        onLogout={() => {
          setCurrentUser(null);
          setNotification({ text: 'Vous avez été déconnecté.', type: 'info' });
          setTimeout(() => setNotification(null), 3000);
        }}
      />

      {/* Main Page Routing */}
      <main className="flex-1">
        {activePage === 'home' && (
          <HomeView
            events={events}
            onSelectEvent={handleSelectEvent}
            setActivePage={handleNavigate}
          />
        )}

        {activePage === 'about' && (
          <AboutView setActivePage={handleNavigate} />
        )}

        {activePage === 'events' && (
          <EventsListView
            events={events}
            onSelectEvent={handleSelectEvent}
          />
        )}

        {activePage === 'event-detail' && selectedEvent && (
          <EventDetailView
            event={selectedEvent}
            onBack={() => handleNavigate('events')}
            onRegisterClick={handleOpenRegistration}
            currentUser={currentUser}
            isRegistered={userRegistrations.includes(selectedEvent.id)}
          />
        )}

        {activePage === 'contact' && (
          <ContactView />
        )}

        {activePage === 'connexion' && (
          <ConnexionView
            currentUser={currentUser}
            onLogin={(profile) => setCurrentUser(profile)}
            onLogout={() => setCurrentUser(null)}
            setActivePage={handleNavigate}
          />
        )}
      </main>

      {/* Primary Footer */}
      <Footer setActivePage={handleNavigate} />

      {/* Registration Modal Dialog */}
      <RegistrationModal
        event={registeringEvent}
        isOpen={Boolean(registeringEvent)}
        onClose={() => setRegisteringEvent(null)}
        currentUser={currentUser}
        onConfirmRegistration={handleConfirmRegistration}
      />
    </div>
  );
}
