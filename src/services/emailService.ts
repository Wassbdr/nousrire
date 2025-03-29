import emailjs from '@emailjs/browser';

const SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID || '';
const TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || '';
const PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || '';

export const sendVolunteerEmail = async (formData: any) => {
  try {
    // Email au bénévole
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        to_email: formData.email,
        to_name: formData.name,
        message: `Bonjour ${formData.name},\n\nNous avons bien reçu votre demande pour devenir bénévole. Nous vous contacterons très prochainement.\n\nCordialement,\nL'équipe Nous'Rire`,
        reply_to: formData.email
      },
      PUBLIC_KEY
    );

    // Email à l'admin
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        to_email: 'nousrire.contact@gmail.com',
        to_name: 'Admin',
        message: `Nouvelle demande de bénévole :\n\nNom : ${formData.name}\nEmail : ${formData.email}\nTéléphone : ${formData.phone}\nMessage : ${formData.message}`,
        reply_to: formData.email
      },
      PUBLIC_KEY
    );

    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return false;
  }
}; 