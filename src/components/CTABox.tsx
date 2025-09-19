'use client';

import { useState, useEffect } from 'react';

export default function CTABox() {
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [serialNumber, setSerialNumber] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

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
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-10">
        <div className="bg-green-50 border-2 border-green-200 p-6 rounded-2xl shadow-2xl max-w-sm pointer-events-auto">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎉</span>
            </div>
            <h3 className="text-xl font-bold text-green-800">Purchase Confirmed!</h3>
            <p className="text-green-700">
              Your Coit Cache collectible has been secured.
            </p>
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <p className="text-lg font-bold text-gray-800">
                Serial Number: #{serialNumber}/250
              </p>
              <p className="text-sm text-gray-600 mt-1">
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
    <div className={`fixed right-6 top-1/2 -translate-y-1/2 z-20 transition-transform duration-700 ease-out ${isVisible ? 'translate-x-0' : 'translate-x-full'
      }`}>
      <div className="backdrop-blur-md bg-gradient-to-br from-white/20 to-white/10 p-6 rounded-3xl shadow-2xl max-w-sm pointer-events-auto border border-white/30 ring-1 ring-white/20">
        <div className="space-y-5">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-3">Coit Cache</h2>
          </div>

          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-4 rounded-2xl border border-blue-400/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"></div>
              <h3 className="text-lg font-semibold text-white">Limited Edition</h3>
            </div>
            <p className="text-sm text-blue-100 mb-3">
              Premium 3D printed collectible with laser-engraved serial number
            </p>
            <div className="flex justify-between items-center">
              <div className="text-xl font-bold text-white">$49.99</div>
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                63 LEFT
              </div>
            </div>
          </div>

          <button
            onClick={handlePurchase}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white py-4 px-6 rounded-2xl hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 transition-all duration-300 font-bold text-lg shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Processing...
              </div>
            ) : (
              'Secure Collectible'
            )}
          </button>

          <div className="text-center space-y-1">
            <p className="text-xs text-blue-200 font-medium">
              ✨ Unique serial revealed after purchase
            </p>
            <div className="flex items-center justify-center gap-1 text-xs text-white/70">
              <span>🔒</span>
              <span>Powered by Stripe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}