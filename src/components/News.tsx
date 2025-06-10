import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getNews } from '../services/firestoreService';
import { NewsItem as NewsItemType } from '../types'; 
import { OptimizedImage } from './OptimizedImage';

const News = () => {
  const [news, setNews] = useState<NewsItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const newsData = await getNews();
        setNews(newsData.slice(0, 3)); // Get only the 3 most recent news items
        setLoading(false);
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Erreur lors du chargement des actualités");
        setLoading(false);
      }
    };
    
    fetchNews();
  }, []);

  // Loading, error and empty states
  if (loading || error || !news.length) {
    const message = loading 
      ? "Chargement des actualités..." 
      : error 
        ? error 
        : "Aucune actualité disponible pour le moment.";
        
    const textColor = error ? "text-red-600" : "text-brand-pink-600";
    
    return (
      <div className="relative py-24">
        <div className="relative text-center py-12">
          <p className={`${textColor} text-lg`}>{message}</p>
        </div>
      </div>
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.215, 0.610, 0.355, 1.000]
      }
    }
  };

  return (
    <div className="relative py-24 overflow-hidden bg-gradient-to-b from-brand-cream-100 via-brand-cream-100 to-brand-cream-50">
      <div className="relative container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={headerVariants}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl text-brand-pink-700 mb-10 font-bold">
            Dernières Actualités
          </h2>
          <p className="text-xl text-brand-pink-600 max-w-3xl mx-auto">
            Restez informé des dernières actions et initiatives de Nous'Rire
          </p>
        </motion.div>

        {/* News Cards */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {news.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </motion.div>
        
        {/* Decorative elements */}
        <motion.div 
          className="hidden lg:block absolute top-24 -right-32 w-64 h-64 bg-brand-pink-100/20 rounded-full blur-3xl" 
          animate={{ 
            x: [0, -20, 0], 
            y: [0, 15, 0] 
          }}
          transition={{
            repeat: Infinity,
            duration: 12,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="hidden lg:block absolute -bottom-32 -left-32 w-64 h-64 bg-brand-pink-100/20 rounded-full blur-3xl" 
          animate={{ 
            x: [0, 20, 0], 
            y: [0, -15, 0] 
          }}
          transition={{
            repeat: Infinity,
            duration: 15,
            ease: "easeInOut"
          }}
        />
      </div>
    </div>
  );
};

// Extract card to its own component
const NewsCard = ({ item }: { item: NewsItemType }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { 
            duration: 0.5,
            ease: [0.215, 0.610, 0.355, 1.000]
          }
        }
      }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3 }
      }}
      className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      {item.image && (
        <LazyNewsImage src={item.image} alt={item.title} />
      )}
      <div className="p-6">
        <h3 className="text-xl font-bold text-brand-pink-700 mb-2">
          {item.title}
        </h3>
        <p className="text-brand-pink-600 mb-4 line-clamp-3">
          {item.content}
        </p>
        <p className="text-sm text-brand-pink-500">
          {format(new Date(item.date), 'd MMMM yyyy', { locale: fr })}
        </p>
      </div>
    </motion.div>
  );
};

// Lazy loading image component
function LazyNewsImage({ src, alt }: { src: string; alt: string }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    // Store the current ref value
    const currentRef = imgRef.current;
    
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      // No need to check imgRef.current here
      // The disconnect() method clears all observations
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={imgRef} className="relative h-48 w-full">
      {isVisible && !hasError ? (
        <OptimizedImage 
          src={src}
          imageName={src.split('/').pop() || ''}
          alt={alt}
          width={400} 
          height={300}
          className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
        />
      ) : isVisible && hasError ? (
        <OptimizedImage 
          src="/images/news-placeholder.webp"
          imageName="news-placeholder.webp"
          alt={alt}
          width={800}
          height={600}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 animate-pulse"></div>
      )}
    </div>
  );
}

export default News;