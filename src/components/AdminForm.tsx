import { useState, useRef } from 'react';
import { NewsFormData, EventFormData } from '../types';
import DOMPurify from 'dompurify';

interface AdminFormProps {
  type: 'news' | 'events' | 'volunteers';
  onClose: () => void;
  onSubmit: (data: NewsFormData | EventFormData) => void;
  initialData?: NewsFormData | EventFormData;
  isEditing?: boolean;
}

const AdminForm: React.FC<AdminFormProps> = ({ 
  type, 
  onClose, 
  onSubmit, 
  initialData,
  isEditing = false
}) => {
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

  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dateError, setDateError] = useState('');
  const [error, setError] = useState('');

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

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleImageChange(file);
    }
  };

  const handleImageChange = (file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      setError('Veuillez sélectionner un fichier image valide');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleImageChange(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedTitle = title.trim();
    if (!trimmedTitle || trimmedTitle.length < 3) {
      setError('Le titre doit contenir au moins 3 caractères');
      return;
    }
    
    if (type === 'news') {
      const trimmedContent = content.trim();
      if (!trimmedContent || trimmedContent.length < 10) {
        setError('Le contenu doit contenir au moins 10 caractères');
        return;
      }
      
      if (image && !['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(image.type)) {
        setError('Format d\'image non supporté. Utilisez JPG, PNG, GIF ou WebP.');
        return;
      }
      
      if (image && image.size > 5 * 1024 * 1024) {
        setError('L\'image ne doit pas dépasser 5MB.');
        return;
      }
      
      const newsData: NewsFormData = {
        title: DOMPurify.sanitize(trimmedTitle),
        content: DOMPurify.sanitize(trimmedContent),
        image
      };
      
      onSubmit(newsData);
    } else if (type === 'events') {
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
                <div
                  className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer ${
                    isDragging ? 'border-brand-pink-500 bg-brand-pink-50' : 'border-gray-300'
                  }`}
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={triggerFileInput}
                >
                  {previewUrl ? (
                    <div className="relative">
                      <img 
                        src={previewUrl} 
                        alt="Aperçu" 
                        className="max-h-48 mx-auto rounded" 
                      />
                      <p className="mt-2 text-sm text-gray-600">
                        {image?.name} ({Math.round(image?.size! / 1024)} KB)
                      </p>
                      <button
                        type="button"
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImage(null);
                          setPreviewUrl(null);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <>
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-600">
                        Glissez et déposez une image ici, ou cliquez pour sélectionner
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF ou WEBP jusqu'à 5MB
                      </p>
                    </>
                  )}
                </div>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="hidden"
                />
                
                {isEditing && !image && !previewUrl && (
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
                  min={new Date().toISOString().split('T')[0]}
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