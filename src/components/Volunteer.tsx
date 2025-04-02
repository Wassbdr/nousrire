import { motion } from 'framer-motion';
import { CalendarIcon, ClockIcon, MapPinIcon, HeartIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { sendVolunteerEmail } from '../services/emailService';
import DOMPurify from 'dompurify';

interface Distribution {
  id: string;
  date: string;
  time: string;
  location: string;
}

const Volunteer = () => {
  const location = useLocation();
  const selectedDistribution = location.state?.distribution as Distribution;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    distribution: selectedDistribution?.id || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setSubmitStatus('error');
      setError('Tous les champs sont obligatoires');
      setIsSubmitting(false);
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitStatus('error');
      setError('Veuillez entrer une adresse email valide');
      setIsSubmitting(false);
      return;
    }
    
    // Phone validation
    const phoneRegex = /^(\+\d{1,3})?\d{9,10}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      setSubmitStatus('error');
      setError('Veuillez entrer un numéro de téléphone valide');
      setIsSubmitting(false);
      return;
    }
    
    // Sanitize data before sending
    const sanitizedData = {
      name: DOMPurify.sanitize(formData.name.trim()),
      email: DOMPurify.sanitize(formData.email.trim()),
      phone: DOMPurify.sanitize(formData.phone.trim()),
      message: DOMPurify.sanitize(formData.message.trim()),
      distribution: formData.distribution
    };
    
    try {
      const success = await sendVolunteerEmail(sanitizedData);
      setSubmitStatus(success ? 'success' : 'error');
      if (success) {
        setFormData({ name: '', email: '', phone: '', message: '', distribution: selectedDistribution?.id || '' });
      }
    } catch (error) {
      setSubmitStatus('error');
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-fade from-white via-brand-cream-50 to-brand-cream-100" />
      
      <div className="relative py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="container mx-auto px-4"
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <HeartIcon className="h-16 w-16 text-brand-pink-500 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold text-brand-pink-600 mb-8">
              Devenir Bénévole
            </h2>
            <p className="text-xl text-brand-pink-700/80 max-w-3xl mx-auto">
              Rejoignez notre équipe de bénévoles et participez à nos actions de distribution alimentaire.
              Votre aide est précieuse pour soutenir les personnes dans le besoin.
            </p>
          </motion.div>

          {selectedDistribution && (
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-lg p-8 mb-12 max-w-2xl mx-auto"
            >
              <h3 className="text-2xl font-semibold text-brand-pink-700 mb-6">
                Distribution sélectionnée
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <CalendarIcon className="h-6 w-6 text-brand-pink-500" />
                  <span className="text-lg text-brand-pink-700/80">{selectedDistribution.date}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <ClockIcon className="h-6 w-6 text-brand-pink-500" />
                  <span className="text-lg text-brand-pink-700/80">{selectedDistribution.time}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <MapPinIcon className="h-6 w-6 text-brand-pink-500" />
                  <span className="text-lg text-brand-pink-700/80">{selectedDistribution.location}</span>
                </div>
              </div>
            </motion.div>
          )}

          <motion.form
            variants={itemVariants}
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block text-brand-pink-700 font-medium mb-2">
                  Nom complet
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-brand-pink-200 focus:border-brand-pink-500 
                    focus:ring-2 focus:ring-brand-pink-200 outline-none transition-colors duration-300"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-brand-pink-700 font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-brand-pink-200 focus:border-brand-pink-500 
                    focus:ring-2 focus:ring-brand-pink-200 outline-none transition-colors duration-300"
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="phone" className="block text-brand-pink-700 font-medium mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-brand-pink-200 focus:border-brand-pink-500 
                  focus:ring-2 focus:ring-brand-pink-200 outline-none transition-colors duration-300"
              />
            </div>

            <div className="mb-8">
              <label htmlFor="message" className="block text-brand-pink-700 font-medium mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-brand-pink-200 focus:border-brand-pink-500 
                  focus:ring-2 focus:ring-brand-pink-200 outline-none transition-colors duration-300"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-brand-pink-500 hover:bg-brand-pink-600 text-white py-3 px-8 
                rounded-full font-medium transition-colors duration-300 transform hover:scale-105 
                active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand-pink-200 ${isSubmitting ? 'cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
            </button>

            {submitStatus === 'success' && (
              <div className="p-4 bg-green-50 text-green-700 rounded-lg">
                Votre message a été envoyé avec succès ! Vous recevrez un email de confirmation.
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                {error || "Une erreur est survenue lors de l'envoi du message. Veuillez réessayer."}
              </div>
            )}
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
};

export default Volunteer;