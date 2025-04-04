import { motion } from 'framer-motion';
import { 
  CalendarIcon, 
  ClockIcon, 
  MapPinIcon, 
  HeartIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  PaperAirplaneIcon,
  ChatBubbleBottomCenterTextIcon
} from '@heroicons/react/24/outline';
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

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false
  });

  const getFieldError = (field: 'name' | 'email' | 'phone') => {
    if (!touched[field]) return null;
    
    switch (field) {
      case 'name':
        return formData.name.trim().length < 3 ? 'Le nom doit contenir au moins 3 caractères' : null;
      case 'email':
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? 'Email invalide' : null;
      case 'phone':
        return !/^(\+\d{1,3})?\d{9,10}$/.test(formData.phone.replace(/\s/g, '')) ? 'Numéro de téléphone invalide' : null;
      default:
        return null;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (field: 'name' | 'email' | 'phone') => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setTouched({ name: true, email: true, phone: true });
    
    if (getFieldError('name') || getFieldError('email') || getFieldError('phone')) {
      setSubmitStatus('error');
      setError('Veuillez corriger les erreurs dans le formulaire');
      return;
    }
    
    setIsSubmitting(true);
    
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
        setTouched({ name: false, email: false, phone: false });
      }
    } catch (error) {
      setSubmitStatus('error');
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="benevole" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-brand-cream-50 to-brand-cream-100" />
      
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
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-12 max-w-2xl mx-auto"
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
            className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8"
          >
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block text-brand-pink-700 font-medium mb-2 flex items-center">
                  <UserIcon className="h-4 w-4 mr-2" />
                  Nom complet
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={() => handleBlur('name')}
                    required
                    placeholder="Votre nom complet"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      touched.name && getFieldError('name') 
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-200' 
                        : 'border-brand-pink-200 focus:border-brand-pink-500 focus:ring-brand-pink-200'
                    } outline-none transition-all duration-300 bg-white/80`}
                  />
                  {touched.name && getFieldError('name') && (
                    <p className="text-red-500 text-sm mt-1">{getFieldError('name')}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-brand-pink-700 font-medium mb-2 flex items-center">
                  <EnvelopeIcon className="h-4 w-4 mr-2" />
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={() => handleBlur('email')}
                    required
                    placeholder="votre.email@exemple.com"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      touched.email && getFieldError('email') 
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-200' 
                        : 'border-brand-pink-200 focus:border-brand-pink-500 focus:ring-brand-pink-200'
                    } outline-none transition-all duration-300 bg-white/80`}
                  />
                  {touched.email && getFieldError('email') && (
                    <p className="text-red-500 text-sm mt-1">{getFieldError('email')}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="phone" className="block text-brand-pink-700 font-medium mb-2 flex items-center">
                <PhoneIcon className="h-4 w-4 mr-2" />
                Téléphone
              </label>
              <div className="relative">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={() => handleBlur('phone')}
                  required
                  placeholder="06 12 34 56 78"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    touched.phone && getFieldError('phone') 
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-200' 
                      : 'border-brand-pink-200 focus:border-brand-pink-500 focus:ring-brand-pink-200'
                  } outline-none transition-all duration-300 bg-white/80`}
                />
                {touched.phone && getFieldError('phone') && (
                  <p className="text-red-500 text-sm mt-1">{getFieldError('phone')}</p>
                )}
              </div>
            </div>

            <div className="mb-8">
              <label htmlFor="message" className="block text-brand-pink-700 font-medium mb-2 flex items-center">
                <ChatBubbleBottomCenterTextIcon className="h-4 w-4 mr-2" />
                Message <span className="text-sm text-brand-pink-400 ml-1">(optionnel)</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                placeholder="Partagez vos motivations ou posez vos questions..."
                className="w-full px-4 py-3 rounded-lg border border-brand-pink-200 focus:border-brand-pink-500 
                  focus:ring-2 focus:ring-brand-pink-200 outline-none transition-colors duration-300 bg-white/80"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => {
                  setFormData({ name: '', email: '', phone: '', message: '', distribution: formData.distribution });
                  setTouched({ name: false, email: false, phone: false });
                  setSubmitStatus('idle');
                }}
                className="px-6 py-3 border border-brand-pink-300 text-brand-pink-600 rounded-full font-medium 
                  transition-all duration-300 hover:bg-brand-pink-50 focus:outline-none focus:ring-2 focus:ring-brand-pink-200"
              >
                Effacer
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 flex justify-center items-center gap-2 bg-brand-pink-500 hover:bg-brand-pink-600 text-white py-3 px-8 
                  rounded-full font-medium transition-all duration-300 transform hover:scale-[1.02] 
                  active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand-pink-200 ${isSubmitting ? 'cursor-not-allowed opacity-80' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <PaperAirplaneIcon className="h-5 w-5" />
                    <span>Envoyer ma candidature</span>
                  </>
                )}
              </button>
            </div>

            {submitStatus === 'success' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="p-4 mt-6 bg-green-50 border border-green-100 text-green-700 rounded-lg flex items-start"
              >
                <svg className="w-5 h-5 mr-3 mt-0.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <p className="font-medium">Votre candidature a été envoyée avec succès !</p>
                  <p className="text-sm mt-1">Nous vous contacterons prochainement pour confirmer votre participation.</p>
                </div>
              </motion.div>
            )}

            {submitStatus === 'error' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="p-4 mt-6 bg-red-50 border border-red-100 text-red-700 rounded-lg flex items-start"
              >
                <svg className="w-5 h-5 mr-3 mt-0.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <p className="font-medium">Une erreur est survenue</p>
                  <p className="text-sm mt-1">{error || "Veuillez vérifier vos informations et réessayer."}</p>
                </div>
              </motion.div>
            )}
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
};

export default Volunteer;