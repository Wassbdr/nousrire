import { HeartIcon, LightBulbIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="relative py-24 bg-gradient-to-b from-brand-cream via-brand-cream-100 to-white">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-bayon text-4xl md:text-5xl text-brand-pink-700 mb-4">
            Notre Mission
          </h2>
          <p className="text-xl text-brand-pink-600 max-w-3xl mx-auto">
            Une association dédiée à la solidarité et au partage, œuvrant pour un monde plus juste et plus humain
          </p>
        </motion.div>

        <motion.div 
          className="grid gap-12 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Mission */}
          <motion.div 
            className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            variants={itemVariants}
          >
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-brand-pink-500 text-white mx-auto mb-6 transform hover:scale-110 transition-transform duration-300">
              <HeartIcon className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bayon text-brand-pink-700 text-center mb-4">
              Notre Mission
            </h3>
            <p className="text-brand-pink-600 text-center text-lg leading-relaxed">
              Nous nous engageons à lutter contre la précarité alimentaire en distribuant des repas
              aux personnes dans le besoin, tout en créant des moments de partage et de convivialité.
            </p>
          </motion.div>

          {/* Vision */}
          <motion.div 
            className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            variants={itemVariants}
          >
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-brand-pink-500 text-white mx-auto mb-6 transform hover:scale-110 transition-transform duration-300">
              <LightBulbIcon className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bayon text-brand-pink-700 text-center mb-4">
              Notre Vision
            </h3>
            <p className="text-brand-pink-600 text-center text-lg leading-relaxed">
              Créer un monde où personne ne doit avoir faim, où la solidarité et le partage sont
              des valeurs fondamentales qui rassemblent notre communauté.
            </p>
          </motion.div>

          {/* Valeurs */}
          <motion.div 
            className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            variants={itemVariants}
          >
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-brand-pink-500 text-white mx-auto mb-6 transform hover:scale-110 transition-transform duration-300">
              <SparklesIcon className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bayon text-brand-pink-700 text-center mb-4">
              Nos Valeurs
            </h3>
            <p className="text-brand-pink-600 text-center text-lg leading-relaxed">
              Solidarité, respect, engagement et partage sont les piliers de notre action quotidienne,
              guidant chaque initiative que nous entreprenons.
            </p>
          </motion.div>
        </motion.div>

        {/* Histoire */}
        <motion.div 
          className="mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-12 shadow-lg">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bayon text-brand-pink-700 mb-6">
                  Notre Histoire
                </h3>
                <p className="text-brand-pink-600 text-lg leading-relaxed">
                  La Maraude 92 est née de la volonté de citoyens engagés de lutter contre la précarité
                  alimentaire. Depuis notre création, nous nous efforçons d'apporter une aide
                  concrète aux personnes dans le besoin, en distribuant des repas et en créant
                  des moments de partage et de convivialité.
                </p>
              </div>
              
              {/* Image avec meilleure gestion */}
              <div className="rounded-xl overflow-hidden shadow-md">
                <div className="aspect-w-4 aspect-h-3">
                  <img
                    src="/images/benevoles.jpg"
                    alt="Benévoles de l'association"
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;