import { motion } from 'framer-motion';
import { CalendarIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Distribution {
  id: string;
  title: string;
  time: string;
  location: string;
  area: string;
  date: string;
}

const Schedule = () => {
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedDistributions = localStorage.getItem('distributions');
    if (savedDistributions) {
      const allDistributions = JSON.parse(savedDistributions);
      const futureDistributions = allDistributions
        .filter((dist: Distribution) => new Date(dist.date) >= new Date())
        .sort((a: Distribution, b: Distribution) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      setDistributions(futureDistributions);
    }
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const handleVolunteerClick = (distribution: Distribution) => {
    navigate('/volunteer', { state: { distribution } });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-fade from-white via-brand-cream-50 to-brand-cream-100" />
      
      <div className="relative py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="container mx-auto px-4"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-brand-pink-600 text-center mb-8"
          >
            Calendrier des distributions
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-xl text-brand-pink-700/80 text-center mb-16 max-w-3xl mx-auto"
          >
            Retrouvez nos prochaines distributions et rejoignez-nous en tant que bénévole
          </motion.p>
          
          {distributions.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
              {distributions.map((distribution, index) => (
                <motion.div
                  key={distribution.id || index}
                  variants={itemVariants}
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl 
                    transform hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-pink-50 to-brand-cream-50 
                    rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative p-8">
                    <h3 className="text-2xl font-semibold text-brand-pink-700 mb-4">
                      {distribution.title}
                    </h3>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center text-brand-pink-600">
                        <CalendarIcon className="h-5 w-5 mr-3" />
                        <span className="text-lg">{formatDate(distribution.date)}</span>
                      </div>
                      
                      <div className="flex items-center text-brand-pink-600">
                        <ClockIcon className="h-5 w-5 mr-3" />
                        <span className="text-lg">{distribution.time}</span>
                      </div>
                      
                      <div className="flex items-center text-brand-pink-600">
                        <MapPinIcon className="h-5 w-5 mr-3" />
                        <div>
                          <span className="text-lg">{distribution.location}</span>
                          {distribution.area && (
                            <p className="text-sm text-brand-pink-500 mt-1">{distribution.area}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleVolunteerClick(distribution)}
                      className="w-full bg-brand-pink-500 hover:bg-brand-pink-600 text-white 
                        py-3 px-6 rounded-xl font-medium transition-colors duration-300
                        transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Devenir bénévole
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              variants={itemVariants}
              className="text-center bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto"
            >
              <p className="text-xl text-brand-pink-600">
                Aucune distribution n'est prévue pour le moment.
              </p>
              <p className="text-lg text-brand-pink-500 mt-2">
                Revenez bientôt pour voir les prochaines dates.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Schedule; 