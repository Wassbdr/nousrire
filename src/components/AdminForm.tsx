import { useState } from 'react';
import { NewsFormData, EventFormData } from '../types';
import DOMPurify from 'dompurify';

interface AdminFormProps {
  type: 'news' | 'events';
  onClose: () => void;
  onSubmit: (data: NewsFormData | EventFormData) => void;
  initialData?: NewsFormData | EventFormData; // Add this prop for editing
  isEditing?: boolean; // Add this prop to indicate edit mode
}

const AdminForm: React.FC<AdminFormProps> = ({ 
  type, 
  onClose, 
  onSubmit, 
  initialData,
  isEditing = false
}) => {
  // Initialize form with initialData if provided
  const [title, setTitle] = useState(
    initialData && 'title' in initialData ? initialData.title : ''
  );
  const [content, setContent] = useState(
    initialData && 'content' in initialData ? initialData.content : ''
  );
  const [image, setImage] = useState<File | null>(null);
  const [date, setDate] = useState(
    initialData && 'date' in initialData ? initialData.date : ''
  );
  const [time, setTime] = useState(
    initialData && 'time' in initialData ? initialData.time : ''
  );
  const [location, setLocation] = useState(
    initialData && 'location' in initialData ? initialData.location : ''
  );

  // Add client-side date validation
  const [dateError, setDateError] = useState('');
  const [error, setError] = useState('');

  // Update the date change handler
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(e.target.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setDateError("La date doit être aujourd'hui ou dans le futur");
    } else {
      setDateError('');
    }

    setDate(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Trim and validate title
    const trimmedTitle = title.trim();
    if (!trimmedTitle || trimmedTitle.length < 3) {
      setError('Le titre doit contenir au moins 3 caractères');
      return;
    }
    
    if (type === 'news') {
      // Validate content
      const trimmedContent = content.trim();
      if (!trimmedContent || trimmedContent.length < 10) {
        setError('Le contenu doit contenir au moins 10 caractères');
        return;
      }
      
      // Validate image if provided
      if (image && !['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(image.type)) {
        setError('Format d\'image non supporté. Utilisez JPG, PNG, GIF ou WebP.');
        return;
      }
      
      if (image && image.size > 5 * 1024 * 1024) { // 5MB limit
        setError('L\'image ne doit pas dépasser 5MB.');
        return;
      }
      
      const newsData: NewsFormData = {
        // Sanitize inputs
        title: DOMPurify.sanitize(trimmedTitle),
        content: DOMPurify.sanitize(trimmedContent),
        image
      };
      
      onSubmit(newsData);
    } else if (type === 'events') {
      // Add validation for events
      const eventDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (eventDate < today) {
        setDateError("La date doit être aujourd'hui ou dans le futur");
        return;
      }

      const trimmedLocation = location.trim();
      if (!trimmedLocation || trimmedLocation.length < 3) {
        setError('Le lieu doit contenir au moins 3 caractères');
        return;
      }

      const eventData: EventFormData = {
        title: DOMPurify.sanitize(trimmedTitle),
        date,
        time,
        location: DOMPurify.sanitize(trimmedLocation)
      };

      onSubmit(eventData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-brand-pink-700">
          {isEditing ? 'Modifier' : 'Ajouter'} {type === 'news' ? 'une actualité' : 'un événement'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-medium text-brand-pink-600">Titre</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          
          {type === 'news' && (
            <>
              <div className="mb-4">
                <label className="block mb-1 font-medium text-brand-pink-600">Contenu</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md h-32"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-1 font-medium text-brand-pink-600">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                  className="w-full"
                />
                {isEditing && !image && (
                  <p className="text-sm text-gray-500 mt-1">
                    Laissez vide pour conserver l'image existante
                  </p>
                )}
              </div>
            </>
          )}
          
          {type === 'events' && (
            <>
              <div className="mb-4">
                <label className="block mb-1 font-medium text-brand-pink-600">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={handleDateChange}
                  className={`w-full px-3 py-2 border rounded-md ${dateError ? 'border-red-500' : ''}`}
                  min={new Date().toISOString().split('T')[0]} // This prevents selecting past dates in the date picker
                  required
                />
                {dateError && (
                  <p className="text-red-500 text-sm mt-1">{dateError}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block mb-1 font-medium text-brand-pink-600">Heure</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-1 font-medium text-brand-pink-600">Lieu</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
            </>
          )}
          
          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-brand-pink-600 hover:bg-brand-pink-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-pink-500 text-white rounded-md hover:bg-brand-pink-600"
            >
              {isEditing ? 'Mettre à jour' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminForm;