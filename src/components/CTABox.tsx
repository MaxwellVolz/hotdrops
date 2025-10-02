'use client';

import { useState, useEffect } from 'react';
import { useLoading } from '@/contexts/LoadingContext';

const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/5kQ9ASb9AdV06me6yW9k401';

export default function CTABox() {
  const [isVisible, setIsVisible] = useState(false);
  const { isLoaded } = useLoading();

  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  const handlePurchase = () => {
    // Redirect to Stripe Payment Link
    window.location.href = STRIPE_PAYMENT_LINK;
  };

  return (
    <div className={`fixed bottom-4 right-0 z-20 transition-all duration-700 ease-out ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}>
      <div className="backdrop-blur-xl bg-gradient-to-br from-white/15 to-white/5 p-3 md:p-4 rounded-l-xl shadow-2xl pointer-events-auto border border-r-0 border-white/10">
        <button
          onClick={handlePurchase}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 md:py-4 px-6 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-bold text-base md:text-lg shadow-2xl shadow-green-500/30 transform hover:scale-[1.02] active:scale-[0.98] ring-2 ring-green-400/50 tracking-wide"
          style={{ textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}