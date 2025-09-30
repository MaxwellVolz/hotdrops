'use client';

import { useState, useEffect } from 'react';
import { useLoading } from '@/contexts/LoadingContext';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CTABox() {
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [serialNumber, setSerialNumber] = useState<number | null>(null);
  const { isLoaded } = useLoading();

  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  const handlePurchase = async () => {
    setIsLoading(true);

    try {
      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const { sessionId, error } = await response.json();

      if (error) {
        console.error('Checkout error:', error);
        alert('Payment error. Please try again.');
        setIsLoading(false);
        return;
      }

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (stripe) {
        const { error: stripeError } = await stripe.redirectToCheckout({
          sessionId,
        });

        if (stripeError) {
          console.error('Stripe redirect error:', stripeError);
          alert('Payment error. Please try again.');
        }
      }
    } catch (err) {
      console.error('Purchase error:', err);
      alert('Payment error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (showConfirmation) {
    return (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-sm px-4">
        <div className="backdrop-blur-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-400/30 p-6 rounded-xl shadow-2xl shadow-green-500/20 pointer-events-auto">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎉</span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>Purchase Confirmed!</h3>
            <p className="text-green-100/90">
              Your Coit Cache collectible has been secured.
            </p>
            <div className="bg-white/10 p-4 rounded-xl border border-green-400/20">
              <p className="text-lg font-bold text-white tracking-wide" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.2)' }}>
                Serial Number: #{serialNumber}/250
              </p>
              <p className="text-sm text-green-100/80 mt-1">
                This unique number will be engraved on your collectible
              </p>
            </div>
            <button
              onClick={() => setShowConfirmation(false)}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 transition-all duration-300 font-semibold shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
              style={{ textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}
            >
              Continue Exploring
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-20 w-full max-w-md px-4 transition-all duration-700 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}>
      <div className="backdrop-blur-xl bg-gradient-to-br from-white/15 to-white/5 p-3 md:p-4 rounded-xl shadow-2xl pointer-events-auto border border-white/10">
        <button
          onClick={handlePurchase}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 md:py-4 px-6 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-bold text-base md:text-lg shadow-2xl shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] ring-2 ring-green-400/50 tracking-wide"
          style={{ textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Processing...
            </div>
          ) : (
            'Buy Now - $42.00'
          )}
        </button>
      </div>
    </div>
  );
}