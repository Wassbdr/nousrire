import { motion } from 'framer-motion';
import { GiftIcon } from '@heroicons/react/24/outline';

const Donate = () => {
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

  return (
    <section className="py-16 bg-brand-cream-100">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="container mx-auto px-4"
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="text-3xl font-bold text-brand-pink-700 mb-4">
            Faire un Don
          </h2>
          <p className="text-brand-pink-600 max-w-2xl mx-auto">
            Votre don nous permet de continuer à lutter contre la précarité alimentaire.
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center"
        >
          <GiftIcon className="h-16 w-16 text-brand-pink-500 mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-brand-pink-700 mb-4">
            Faire un don via PayPal
          </h3>
          <p className="text-brand-pink-600 mb-8">
            Cliquez sur le bouton ci-dessous pour faire un don sécurisé via PayPal
          </p>
          <a
            href="
www.paypal.me/maraude092?locale.x=fr_FR"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-brand-pink-500 hover:bg-brand-pink-600 text-white 
              py-3 px-8 rounded-full font-medium transition-colors duration-300"
          >
            Faire un don
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Donate;