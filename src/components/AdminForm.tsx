import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import ImageUpload from './ImageUpload';

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

interface AdminFormProps {
  type: 'news' | 'events';
  onClose: () => void;
  onSubmit: (data: NewsFormData | EventFormData) => void;
}

const AdminForm: React.FC<AdminFormProps> = ({ type, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<NewsFormData | EventFormData>(
    type === 'news'
      ? { title: '', content: '', image: null }
      : { title: '', date: '', time: '09:00', location: '' }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageSelect = (file: File) => {
    if (type === 'news') {
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const getImagePreview = () => {
    if (type === 'news' && (formData as NewsFormData).image) {
      return URL.createObjectURL((formData as NewsFormData).image!);
    }
    return undefined;
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 9; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(time);
      }
    }
    return options;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-brand-pink-700">
            {type === 'news' ? 'Nouvelle actualité' : 'Nouvel événement'}
          </h2>
          <button
            onClick={onClose}
            className="text-brand-pink-400 hover:text-brand-pink-500"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {type === 'news' ? (
            <>
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-brand-pink-700"
                >
                  Titre
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={(formData as NewsFormData).title}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-brand-pink-200 rounded-lg 
                    focus:ring-2 focus:ring-brand-pink-200 focus:border-brand-pink-500"
                />
              </div>

              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-brand-pink-700"
                >
                  Contenu
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={(formData as NewsFormData).content}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="mt-1 block w-full px-4 py-2 border border-brand-pink-200 rounded-lg 
                    focus:ring-2 focus:ring-brand-pink-200 focus:border-brand-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-pink-700">
                  Image
                </label>
                <ImageUpload
                  onImageSelect={handleImageSelect}
                  currentImage={getImagePreview()}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-brand-pink-700"
                >
                  Titre de l'événement
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={(formData as EventFormData).title}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-brand-pink-200 rounded-lg 
                    focus:ring-2 focus:ring-brand-pink-200 focus:border-brand-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-brand-pink-700"
                  >
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={(formData as EventFormData).date}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="mt-1 block w-full px-4 py-2 border border-brand-pink-200 rounded-lg 
                      focus:ring-2 focus:ring-brand-pink-200 focus:border-brand-pink-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="time"
                    className="block text-sm font-medium text-brand-pink-700"
                  >
                    Heure
                  </label>
                  <select
                    id="time"
                    name="time"
                    value={(formData as EventFormData).time}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-4 py-2 border border-brand-pink-200 rounded-lg 
                      focus:ring-2 focus:ring-brand-pink-200 focus:border-brand-pink-500"
                  >
                    {generateTimeOptions().map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-brand-pink-700"
                >
                  Lieu
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={(formData as EventFormData).location}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-brand-pink-200 rounded-lg 
                    focus:ring-2 focus:ring-brand-pink-200 focus:border-brand-pink-500"
                />
              </div>
            </>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-brand-pink-700 hover:text-brand-pink-800"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-pink-500 text-white rounded-lg hover:bg-brand-pink-600"
            >
              {type === 'news' ? 'Publier' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminForm; 