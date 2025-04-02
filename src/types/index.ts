export interface NewsItem {
  id: string;
  title: string;
  content: string;
  image: string | null;
  date: string;
}

export interface NewsFormData {
  title: string;
  content: string;
  image: File | null;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
}

export interface EventFormData {
  title: string;
  date: string;
  time: string;
  location: string;
}