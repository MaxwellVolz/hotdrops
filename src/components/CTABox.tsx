'use client';

import { useState, useEffect } from 'react';
import { useLoading } from '@/contexts/LoadingContext';

const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/14A6oG3H8dV04e6g9w9k400';

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
    <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-20 w-full max-w-md px-4 transition-all duration-700 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}>
      <div className="backdrop-blur-xl bg-gradient-to-br from-white/15 to-white/5 p-3 md:p-4 rounded-xl shadow-2xl pointer-events-auto border border-white/10">
        <button
          onClick={handlePurchase}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 md:py-4 px-6 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-bold text-base md:text-lg shadow-2xl shadow-green-500/30 transform hover:scale-[1.02] active:scale-[0.98] ring-2 ring-green-400/50 tracking-wide"
          style={{ textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}
        >
          Buy Now - $42.00
        </button>
      </div>
    </div>
  );
}