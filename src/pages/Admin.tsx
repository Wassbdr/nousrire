import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { PlusIcon, NewspaperIcon, CalendarIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import AdminForm from '../components/AdminForm';
import { 
  getNews, addNews, deleteNews, 
  getEvents, addEvent, updateEvent, deleteEvent 
} from '../services/firestoreService';
import { NewsItem, NewsFormData, Event, EventFormData } from '../types';

const Admin = () => {
  const { logout, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'news' | 'events'>('news');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (activeTab === 'news') {
          const newsData = await getNews();
          setNews(newsData);
        } else {
          const eventsData = await getEvents();
          setEvents(eventsData);
        }
      } catch (err) {
        console.error(`Error fetching ${activeTab}:`, err);
        setError(`Erreur lors du chargement des ${activeTab === 'news' ? 'actualités' : 'événements'}`);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [activeTab, isAuthenticated]);

  const handleCreateNews = () => {
    setEditingItem(null);
    setIsEditing(false);
    setIsCreating(true);
  };

  const handleCreateEvent = () => {
    setEditingItem(null);
    setIsEditing(false);
    setIsCreating(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingItem(event);
    setIsEditing(true);
    setIsCreating(true);
  };

  const handleCloseForm = () => {
    setIsCreating(false);
    setIsEditing(false);
    setEditingItem(null);
  };

  const handleSubmitNews = async (data: NewsFormData) => {
    try {
      if (isEditing && editingItem) {
        setIsCreating(false);
        setIsEditing(false);
        setEditingItem(null);
      } else {
        if (news.length >= 3) {
          setError("Attention: l'ajout d'une nouvelle actualité remplacera la plus ancienne, car la limite est de 3 actualités.");
          setTimeout(async () => {
            const newNews = await addNews(data);
            setNews((prev) => [newNews as NewsItem, ...prev.slice(0, 2)]);
            setIsCreating(false);
            setError(null);
          }, 2000);
          return;
        }
        
        const newNews = await addNews(data);
        setNews((prev) => [newNews as NewsItem, ...prev]);
        setIsCreating(false);
      }
    } catch (err: any) {
      console.error("Error with news:", err);
      setError(err.message || "Erreur lors de l'opération sur l'actualité");
    }
  };

  const handleSubmitEvent = async (data: EventFormData) => {
    try {
      if (isEditing && editingItem) {
        const updatedEvent = await updateEvent(editingItem.id, data);
        setEvents((prev) => 
          prev.map((event) => event.id === editingItem.id ? updatedEvent : event)
        );
        setIsEditing(false);
        setEditingItem(null);
      } else {
        const newEvent = await addEvent(data);
        setEvents((prev) => [newEvent as Event, ...prev]);
      }
      setIsCreating(false);
      setError(null);
    } catch (err: any) {
      console.error("Error with event:", err);
      setError(err.message || "Erreur lors de l'opération sur l'événement");
    }
  };

  const handleSubmit = (data: NewsFormData | EventFormData) => {
    if (activeTab === 'news' && 'content' in data) {
      handleSubmitNews(data);
    } else if (activeTab === 'events' && 'date' in data) {
      handleSubmitEvent(data);
    }
  };

  const handleDeleteNews = async (id: string) => {
    try {
      await deleteNews(id);
      setNews((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error deleting news:", err);
      setError("Erreur lors de la suppression de l'actualité");
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await deleteEvent(id);
      setEvents((prev) => prev.filter((event) => event.id !== id));
    } catch (err) {
      console.error("Error deleting event:", err);
      setError("Erreur lors de la suppression de l'événement");
    }
  };

  const getFormDataFromItem = (): NewsFormData | EventFormData | undefined => {
    if (!isEditing || !editingItem) return undefined;
    
    if (activeTab === 'news' && 'content' in editingItem) {
      return {
        title: editingItem.title,
        content: editingItem.content,
        image: null,
      };
    } else if (activeTab === 'events' && 'location' in editingItem) {
      return {
        title: editingItem.title,
        date: editingItem.date,
        time: editingItem.time,
        location: editingItem.location
      };
    }
    
    return undefined;
  };

  return (
    <div className="min-h-screen bg-brand-cream-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-brand-pink-700">Administration</h1>
            <button
              onClick={logout}
              className="px-4 py-2 bg-brand-pink-500 text-white rounded-lg hover:bg-brand-pink-600 transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
            <button 
              onClick={() => setError(null)} 
              className="ml-2 font-bold"
            >
              ×
            </button>
          </div>
        )}
        
        <div className="border-b border-brand-pink-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('news')}
              className={`${
                activeTab === 'news'
                  ? 'border-brand-pink-500 text-brand-pink-700'
                  : 'border-transparent text-brand-pink-400 hover:text-brand-pink-500 hover:border-brand-pink-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <NewspaperIcon className="h-5 w-5 mr-2" />
              Actualités
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`${
                activeTab === 'events'
                  ? 'border-brand-pink-500 text-brand-pink-700'
                  : 'border-transparent text-brand-pink-400 hover:text-brand-pink-500 hover:border-brand-pink-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <CalendarIcon className="h-5 w-5 mr-2" />
              Événements
            </button>
          </nav>
        </div>

        <div className="mb-6">
          <button
            onClick={activeTab === 'news' ? handleCreateNews : handleCreateEvent}
            className="inline-flex items-center px-4 py-2 bg-brand-pink-500 text-white rounded-lg hover:bg-brand-pink-600 transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            {activeTab === 'news' ? 'Nouvelle actualité' : 'Nouvel événement'}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow">
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-pink-500 mx-auto"></div>
              <p className="mt-2 text-brand-pink-600">Chargement...</p>
            </div>
          ) : activeTab === 'news' ? (
            <div className="divide-y divide-brand-pink-200">
              {news.length === 0 ? (
                <div className="p-6 text-center text-brand-pink-500">
                  Aucune actualité publiée
                </div>
              ) : (
                news.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <h3 className="text-lg font-medium text-brand-pink-700">{item.title}</h3>
                          <p className="mt-2 text-sm text-brand-pink-600">{item.content}</p>
                          <p className="mt-2 text-xs text-brand-pink-400">
                            {new Date(item.date).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteNews(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="divide-y divide-brand-pink-200">
              {events.length === 0 ? (
                <div className="p-6 text-center text-brand-pink-500">
                  Aucun événement planifié
                </div>
              ) : (
                events.map((event) => (
                  <div key={event.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-brand-pink-700">{event.title}</h3>
                        <div className="mt-2 text-sm text-brand-pink-600">
                          <p>Date : {event.date}</p>
                          <p>Heure : {event.time}</p>
                          <p>Lieu : {event.location}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditEvent(event)}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>

      {isCreating && (
        <AdminForm
          type={activeTab}
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          initialData={getFormDataFromItem()}
          isEditing={isEditing}
        />
      )}
    </div>
  );
};

export default Admin;