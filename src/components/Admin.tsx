import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarIcon, MapPinIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Distribution {
  id: string;
  title: string;
  time: string;
  location: string;
  area: string;
  date: string;
}

const Admin = () => {
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [newDistribution, setNewDistribution] = useState<Partial<Distribution>>({
    title: '',
    time: '',
    location: '',
    area: '',
    date: ''
  });

  // Générer les heures de 8h à 22h
  const hours = Array.from({ length: 15 }, (_, i) => {
    const hour = i + 8;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  useEffect(() => {
    // Charger les distributions depuis le localStorage
    const savedDistributions = localStorage.getItem('distributions');
    if (savedDistributions) {
      setDistributions(JSON.parse(savedDistributions));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDistribution.title || !newDistribution.time || !newDistribution.location || !newDistribution.area || !newDistribution.date) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    const distribution: Distribution = {
      ...newDistribution,
      id: Date.now().toString(),
    } as Distribution;

    const updatedDistributions = [...distributions, distribution];
    setDistributions(updatedDistributions);
    localStorage.setItem('distributions', JSON.stringify(updatedDistributions));
    setNewDistribution({
      title: '',
      time: '',
      location: '',
      area: '',
      date: ''
    });
  };

  const handleDelete = (id: string) => {
    const updatedDistributions = distributions.filter(dist => dist.id !== id);
    setDistributions(updatedDistributions);
    localStorage.setItem('distributions', JSON.stringify(updatedDistributions));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Administration du Calendrier</h1>

          {/* Formulaire d'ajout */}
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">Ajouter une Distribution</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                <input
                  type="text"
                  value={newDistribution.title}
                  onChange={(e) => setNewDistribution({ ...newDistribution, title: e.target.value })}
                  className="input"
                  placeholder="Distribution alimentaire"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={newDistribution.date}
                  onChange={(e) => setNewDistribution({ ...newDistribution, date: e.target.value })}
                  className="input"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
                <select
                  value={newDistribution.time}
                  onChange={(e) => setNewDistribution({ ...newDistribution, time: e.target.value })}
                  className="input"
                >
                  <option value="">Sélectionnez une heure</option>
                  {hours.map((hour) => (
                    <option key={hour} value={hour}>
                      {hour}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lieu</label>
                <input
                  type="text"
                  value={newDistribution.location}
                  onChange={(e) => setNewDistribution({ ...newDistribution, location: e.target.value })}
                  className="input"
                  placeholder="Place de la République"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Arrondissement</label>
                <input
                  type="text"
                  value={newDistribution.area}
                  onChange={(e) => setNewDistribution({ ...newDistribution, area: e.target.value })}
                  className="input"
                  placeholder="3ème arrondissement"
                />
              </div>
            </div>
            <button type="submit" className="btn-primary mt-4">
              Ajouter
            </button>
          </form>

          {/* Liste des distributions */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Distributions Planifiées</h2>
            <div className="space-y-4">
              {distributions
                .filter(dist => new Date(dist.date) >= new Date())
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((dist) => (
                  <div key={dist.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <CalendarIcon className="h-6 w-6 text-primary" />
                      <div>
                        <h3 className="font-semibold">{dist.title}</h3>
                        <p className="text-sm text-gray-600">{formatDate(dist.date)} à {dist.time}</p>
                        <div className="flex items-center mt-1">
                          <MapPinIcon className="h-4 w-4 text-primary mr-1" />
                          <span className="text-sm text-gray-600">{dist.location} - {dist.area}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(dist.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Admin; 