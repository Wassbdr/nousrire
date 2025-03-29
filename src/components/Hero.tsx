import { motion } from 'framer-motion';

interface Stat {
  value: string;
  label: string;
}

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  const stats: Stat[] = [
    { value: "5000+", label: "Repas distribués" },
    { value: "100+", label: "Bénévoles actifs" },
    { value: "50+", label: "Partenaires" },
  ];

  return (
    <section id="accueil" className="relative min-h-screen pt-20 bg-gradient-to-b from-brand-cream to-brand-cream-50 overflow-hidden">
      {/* Logo en arrière-plan */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <img 
          src="/images/maraude_bg.png" 
          alt="Background Logo" 
          className="w-[120%] h-[120%] object-cover"
        />
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative container mx-auto px-4 py-32"
      >
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-brand-pink-dark mb-6">
              Ensemble, luttons contre la précarité alimentaire
            </h1>
            <p className="text-lg text-brand-pink-dark/80 mb-8">
              Maraude 92 est une association caritative qui s'engage à distribuer des denrées alimentaires 
              aux personnes dans le besoin. Notre mission est de garantir l'accès à une alimentation 
              saine et équilibrée pour tous.
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.a
                href="#benevole"
                className="btn-primary bg-brand-pink hover:bg-brand-pink-dark text-white px-8 py-3 rounded-full font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Devenir Bénévole
              </motion.a>
              <motion.a
                href="#calendrier"
                className="btn-secondary border-2 border-brand-pink bg-brand-cream hover:bg-brand-pink hover:text-white px-8 py-3 rounded-full font-medium transition-colors text-brand-pink-dark"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Voir le Calendrier
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
                alt="Distribution alimentaire"
                className="object-cover w-full h-full"
              />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-brand-pink-700 mb-2">
                {stat.value}
              </div>
              <div className="text-lg text-brand-pink-600">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;