import { motion } from 'framer-motion';
import { ShoppingBagIcon, TruckIcon, HandRaisedIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const Actions = () => {
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

  const actions = [
    {
      icon: <ShoppingBagIcon className="h-12 w-12" />,
      title: "Collecte Alimentaire",
      description: "Organisation de collectes auprès de nos partenaires et des grandes surfaces pour récupérer des denrées alimentaires."
    },
    {
      icon: <TruckIcon className="h-12 w-12" />,
      title: "Distribution",
      description: "Distribution régulière de colis alimentaires aux personnes dans le besoin, dans différents quartiers de la ville."
    },
    {
      icon: <HandRaisedIcon className="h-12 w-12" />,
      title: "Aide d'Urgence",
      description: "Intervention rapide pour les situations d'urgence alimentaire, en collaboration avec les services sociaux."
    },
    {
      icon: <UserGroupIcon className="h-12 w-12" />,
      title: "Accompagnement",
      description: "Soutien et orientation des bénéficiaires vers les services adaptés à leurs besoins."
    }
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-fade from-brand-cream-100 via-brand-cream-50 to-white" />
      
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
            Nos Actions
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-xl text-brand-pink-700/80 text-center mb-16 max-w-3xl mx-auto"
          >
            Découvrez comment nous agissons concrètement pour lutter contre la précarité alimentaire
          </motion.p>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {actions.map((action, index) => (
              <motion.div
                key={action.title}
                variants={itemVariants}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl 
                  transform hover:-translate-y-1 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-brand-pink-50 to-brand-cream-50 
                  rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative p-8 flex items-start space-x-6">
                  <div className="text-brand-pink-500 group-hover:text-brand-pink-600 
                    transform group-hover:scale-110 transition-all duration-300">
                    {action.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-brand-pink-700 mb-4">
                      {action.title}
                    </h3>
                    <p className="text-lg text-brand-pink-700/80">
                      {action.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            variants={itemVariants}
            className="mt-16 text-center"
          >
            <p className="text-2xl text-brand-pink-700 mb-8">
              Vous souhaitez nous aider dans nos actions ?
            </p>
            <div className="flex justify-center space-x-6">
              <a
                href="#benevole"
                className="bg-brand-pink-500 hover:bg-brand-pink-600 text-white 
                  py-3 px-8 rounded-full font-medium transition-colors duration-300
                  transform hover:scale-105 active:scale-95"
              >
                Devenir Bénévole
              </a>
              <a
                href="#don"
                className="bg-brand-cream text-brand-pink-dark border-2 border-brand-pink 
                  hover:bg-brand-pink hover:text-white py-3 px-8 rounded-full font-medium 
                  transition-colors duration-300 transform hover:scale-105 active:scale-95"
              >
                Faire un Don
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Actions; 