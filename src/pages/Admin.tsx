import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { PlusIcon, NewspaperIcon, CalendarIcon, TrashIcon } from '@heroicons/react/24/outline';
import AdminForm from '../components/AdminForm';
import { useNavigate } from 'react-router-dom';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  image: string | null;
  date: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
}

interface NewsFormData {
  title: string;
  content: string;
  image: File | null;
}

interface EventFormData {
  title: string;
  date: string;
  time: string;
  location: string;
}

const Admin = () => {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'news' | 'events'>('news');
  const [news, setNews] = useState<NewsItem[]>(() => {
    const savedNews = localStorage.getItem('news');
    return savedNews ? JSON.parse(savedNews) : [];
  });
  const [events, setEvents] = useState<Event[]>(() => {
    const savedEvents = localStorage.getItem('events');
    return savedEvents ? JSON.parse(savedEvents) : [];
  });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    localStorage.setItem('news', JSON.stringify(news));
  }, [news]);

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  if (!isAuthenticated) {
    return null;
  }

  const handleCreateNews = () => {
    setIsCreating(true);
  };

  const handleCreateEvent = () => {
    setIsCreating(true);
  };

  const handleCloseForm = () => {
    setIsCreating(false);
  };

  const handleSubmitNews = async (data: NewsFormData) => {
    let imageBase64 = null;
    if (data.image) {
      imageBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(data.image!);
      });
    }

    const newNews: NewsItem = {
      ...data,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      image: imageBase64,
    };
    setNews((prev) => [newNews, ...prev]);
    setIsCreating(false);
  };

  const handleSubmitEvent = (data: EventFormData) => {
    const newEvent: Event = {
      ...data,
      id: Date.now().toString(),
    };
    setEvents((prev) => [newEvent, ...prev]);
    setIsCreating(false);
  };

  const handleSubmit = (data: NewsFormData | EventFormData) => {
    if (activeTab === 'news' && 'content' in data) {
      handleSubmitNews(data);
    } else if (activeTab === 'events' && 'date' in data) {
      handleSubmitEvent(data);
    }
  };

  const handleDeleteNews = (id: string) => {
    setNews((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  };

  return (
    <div className="min-h-screen bg-brand-cream-50">
      {/* En-tête */}
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

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Onglets */}
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

        {/* Bouton de création */}
        <div className="mb-6">
          <button
            onClick={activeTab === 'news' ? handleCreateNews : handleCreateEvent}
            className="inline-flex items-center px-4 py-2 bg-brand-pink-500 text-white rounded-lg hover:bg-brand-pink-600 transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            {activeTab === 'news' ? 'Nouvelle actualité' : 'Nouvel événement'}
          </button>
        </div>

        {/* Liste des éléments */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === 'news' ? (
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
                          <p className="mt-2 text-xs text-brand-pink-400">{item.date}</p>
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
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>

      {/* Formulaire modal */}
      {isCreating && (
        <AdminForm
          type={activeTab}
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default Admin; 