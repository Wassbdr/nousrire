import { useState } from 'react';
import { motion } from 'framer-motion';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { HeartIcon } from '@heroicons/react/24/outline';

const Donate = () => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const handleDonationSuccess = async (details: any) => {
    console.log('Donation successful:', details);
    // TODO: Implement success handling
  };

  const handleDonationError = (error: any) => {
    console.error('Donation error:', error);
    // TODO: Implement error handling
  };

  const donationAmounts = [10, 20, 50, 100, 200];

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
            Faites un don
          </h2>
          <p className="text-xl text-brand-pink-600 max-w-3xl mx-auto">
            Votre soutien est essentiel pour nous aider à continuer notre mission
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg"
          >
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bayon text-brand-pink-700 mb-6">
                  Choisissez votre montant
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {donationAmounts.map((amount) => (
                    <motion.button
                      key={amount}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedAmount(amount)}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        selectedAmount === amount
                          ? 'border-brand-pink-500 bg-brand-pink-50 text-brand-pink-700'
                          : 'border-brand-pink-200 hover:border-brand-pink-300 text-brand-pink-600'
                      }`}
                    >
                      {amount}€
                    </motion.button>
                  ))}
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-brand-pink-600">
                    <HeartIcon className="h-5 w-5" />
                    <span>Don déductible d'impôts</span>
                  </div>
                  <div className="flex items-center space-x-2 text-brand-pink-600">
                    <HeartIcon className="h-5 w-5" />
                    <span>Reçu fiscal envoyé automatiquement</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <PayPalScriptProvider options={{ 
                  clientId: "test",
                  currency: "EUR"
                }}>
                  <PayPalButtons
                    style={{ layout: "vertical" }}
                    createOrder={(data, actions) => {
                      if (!selectedAmount) return Promise.reject('No amount selected');
                      return actions.order.create({
                        intent: "CAPTURE",
                        purchase_units: [
                          {
                            amount: {
                              value: selectedAmount.toString(),
                              currency_code: "EUR"
                            }
                          }
                        ]
                      });
                    }}
                    onApprove={async (data, actions) => {
                      if (actions.order) {
                        const details = await actions.order.capture();
                        await handleDonationSuccess(details);
                      }
                    }}
                    onError={handleDonationError}
                  />
                </PayPalScriptProvider>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Donate;