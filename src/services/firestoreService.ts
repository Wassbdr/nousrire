import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  deleteDoc,
  updateDoc,
  Timestamp, 
  query, 
  orderBy,
  where,
  getDoc
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { NewsItem, NewsFormData, Event, EventFormData } from '../types';
import { compressImage } from './imageCompression';

// News functions with limit
export const getNews = async (): Promise<NewsItem[]> => {
  try {
    const newsQuery = query(collection(db, 'news'), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(newsQuery);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        content: data.content,
        image: data.image || null,
        date: data.date.toDate().toISOString(),
      };
    });
  } catch (error) {
    console.error('Error getting news: ', error);
    throw error;
  }
};

export const addNews = async (newsData: NewsFormData): Promise<NewsItem> => {
  try {
    // First, check how many news items we already have
    const newsQuery = query(collection(db, 'news'), orderBy('date', 'asc'));
    const querySnapshot = await getDocs(newsQuery);
    
    // If we already have 3 or more news items, delete the oldest one
    if (querySnapshot.size >= 3) {
      // Get the oldest news item (first in ascending order)
      const oldestNews = querySnapshot.docs[0];
      
      // Delete the oldest news item
      await deleteDoc(doc(db, 'news', oldestNews.id));
      
      // If the oldest news had an image, delete it from storage
      const oldestData = oldestNews.data();
      if (oldestData.image) {
        try {
          // Extract the image path from the URL
          const imageUrl = new URL(oldestData.image);
          const imagePath = decodeURIComponent(imageUrl.pathname.split('/o/')[1].split('?')[0]);
          await deleteObject(ref(storage, imagePath));
          console.log('Old image deleted from storage');
        } catch (err) {
          console.error('Error deleting old image:', err);
          // Continue with adding new news even if image deletion fails
        }
      }
    }
    
    // Upload new image if provided
    let imageUrl = null;
    if (newsData.image) {
      try {
        const compressedImage = await compressImage(newsData.image);
        const fileName = Date.now() + '-' + compressedImage.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const storageRef = ref(storage, `news-images/${fileName}`);
        const metadata = { contentType: compressedImage.type };
        const uploadResult = await uploadBytes(storageRef, compressedImage, metadata);
        imageUrl = await getDownloadURL(uploadResult.ref);
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError);
        // Continue without image if upload fails
      }
    }
    
    // Add to Firestore
    const docRef = await addDoc(collection(db, 'news'), {
      title: newsData.title,
      content: newsData.content,
      image: imageUrl,
      date: Timestamp.now()
    });
    
    return {
      id: docRef.id,
      title: newsData.title,
      content: newsData.content,
      image: imageUrl,
      date: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error adding news: ', error);
    throw error;
  }
};

// Events functions with date validation
export const getEvents = async (): Promise<Event[]> => {
  try {
    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Query only future events (or events happening today)
    const eventsQuery = query(
      collection(db, 'events'), 
      where('date', '>=', today.toISOString().split('T')[0]),
      orderBy('date', 'asc')
    );
    
    const querySnapshot = await getDocs(eventsQuery);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        date: data.date,
        time: data.time,
        location: data.location
      };
    });
  } catch (error) {
    console.error('Error getting events: ', error);
    throw error;
  }
};

export const addEvent = async (eventData: EventFormData): Promise<Event> => {
  try {
    // Validate that event date is not in the past
    const eventDate = new Date(eventData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to midnight
    
    if (eventDate < today) {
      throw new Error("La date de l'événement doit être aujourd'hui ou dans le futur.");
    }
    
    const docRef = await addDoc(collection(db, 'events'), {
      title: eventData.title,
      date: eventData.date,
      time: eventData.time,
      location: eventData.location,
      createdAt: Timestamp.now()
    });
    
    return {
      id: docRef.id,
      title: eventData.title,
      date: eventData.date,
      time: eventData.time,
      location: eventData.location
    };
  } catch (error) {
    console.error('Error adding event: ', error);
    throw error;
  }
};

export const updateEvent = async (id: string, eventData: EventFormData): Promise<Event> => {
  try {
    // Validate that event date is not in the past
    const eventDate = new Date(eventData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to midnight
    
    if (eventDate < today) {
      throw new Error("La date de l'événement doit être aujourd'hui ou dans le futur.");
    }
    
    const eventRef = doc(db, 'events', id);
    
    await updateDoc(eventRef, {
      title: eventData.title,
      date: eventData.date,
      time: eventData.time,
      location: eventData.location,
      updatedAt: Timestamp.now()
    });
    
    return {
      id,
      title: eventData.title,
      date: eventData.date,
      time: eventData.time,
      location: eventData.location
    };
  } catch (error) {
    console.error('Error updating event: ', error);
    throw error;
  }
};

// Other functions remain the same
export const deleteNews = async (id: string): Promise<void> => {
  try {
    // Récupérer l'actualité pour avoir l'URL de l'image
    const newsDoc = await getDoc(doc(db, 'news', id));
    const newsData = newsDoc.data();
    
    // Supprimer l'actualité de Firestore
    await deleteDoc(doc(db, 'news', id));
    
    // Si l'actualité a une image, la supprimer du Storage
    if (newsData && newsData.image) {
      try {
        // Extraire le chemin du fichier de l'URL
        const imageUrl = newsData.image;
        const storageRef = ref(storage, imageUrl);
        await deleteObject(storageRef);
        console.log("Image supprimée:", imageUrl);
      } catch (error) {
        console.error("Erreur lors de la suppression de l'image:", error);
      }
    }
  } catch (error) {
    console.error("Erreur lors de la suppression de l'actualité:", error);
    throw error;
  }
};

export const deleteEvent = async (id: string): Promise<void> => {
  try {
    const eventRef = doc(db, 'events', id);
    await deleteDoc(eventRef);
  } catch (error) {
    console.error('Error deleting event: ', error);
    throw error;
  }
};