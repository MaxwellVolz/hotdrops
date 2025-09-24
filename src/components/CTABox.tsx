'use client';

import { useState, useEffect } from 'react';
import { useLoading } from '@/contexts/LoadingContext';

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

  const handlePurchase = () => {
    setIsLoading(true);

    // Simulate purchase process
    setTimeout(() => {
      const nextSerial = Math.floor(Math.random() * 63) + 188; // Random number between 188-250
      setSerialNumber(nextSerial);
      setShowConfirmation(true);
      setIsLoading(false);
    }, 2000);
  };

  if (showConfirmation) {
    return (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-sm px-4">
        <div className="backdrop-blur-md bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-400/30 p-6 rounded-2xl shadow-2xl pointer-events-auto">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎉</span>
            </div>
            <h3 className="text-xl font-bold text-white">Purchase Confirmed!</h3>
            <p className="text-green-100">
              Your Coit Cache collectible has been secured.
            </p>
            <div className="bg-white/10 p-4 rounded-lg border border-green-400/20">
              <p className="text-lg font-bold text-white">
                Serial Number: #{serialNumber}/250
              </p>
              <p className="text-sm text-green-100 mt-1">
                This unique number will be engraved on your collectible
              </p>
            </div>
            <button
              onClick={() => setShowConfirmation(false)}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
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
      <div className="backdrop-blur-md bg-gradient-to-br from-white/20 to-white/10 p-3 rounded-2xl shadow-2xl pointer-events-auto border border-white/30 ring-1 ring-white/20">
        <button
          onClick={handlePurchase}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 md:py-4 px-6 rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-bold text-base md:text-lg shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.05] active:scale-[0.98] ring-2 ring-green-400/50"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Processing...
            </div>
          ) : (
            'Buy Now - $49.99'
          )}
        </button>
      </div>
    </div>
  );
}