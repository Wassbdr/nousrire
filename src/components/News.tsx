import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  image?: string;
}

const News = () => {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    const savedNews = localStorage.getItem('news');
    if (savedNews) {
      const parsedNews = JSON.parse(savedNews);
      const sortedNews = parsedNews
        .sort((a: NewsItem, b: NewsItem) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3);
      setNews(sortedNews);
    }
  }, []);

  if (!news.length) {
    return (
      <div className="relative py-24">
        <div className="relative text-center py-12">
          <p className="text-brand-pink-600 text-lg">Aucune actualité disponible pour le moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative py-24">
      <div className="relative container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-bayon text-4xl md:text-5xl text-brand-pink-700 mb-4">
            Dernières Actualités
          </h2>
          <p className="text-xl text-brand-pink-600 max-w-3xl mx-auto">
            Restez informé des dernières actions et initiatives de Nous'Rire
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {item.image && (
                <div className="relative h-48">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default News; 