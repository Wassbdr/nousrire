import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getNews } from '../services/firestoreService';
import { NewsItem } from '../types'; 

const News = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
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
    <div className="relative py-24 overflow-hidden">
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
            Restez informé des dernières actions et initiatives de Maraude 92
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
const NewsCard = ({ item }: { item: NewsItem }) => {
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
        <div className="relative h-48 overflow-hidden">
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500"
          />
        </div>
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

export default News;