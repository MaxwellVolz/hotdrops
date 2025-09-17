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
    }, 2000);

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
              Your North Beach Coit Tower collectible has been secured.
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
    <div className={`fixed right-4 top-1/2 -translate-y-1/2 z-10 transition-transform duration-700 ease-out ${
      isVisible ? 'translate-x-0' : 'translate-x-full'
    }`}>
      <div className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-2xl max-w-sm pointer-events-auto border border-gray-200">
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">HotDrops</h2>
            <p className="text-sm text-gray-600">North Beach Coit Tower</p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Limited Edition</h3>
            <p className="text-sm text-gray-600 mb-3">
              Iconic Coit Tower 3D printed collectible with unique serial number
            </p>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Starting at $49.99</span>
              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                Only 187 left!
              </span>
            </div>
          </div>

          <button
            onClick={handlePurchase}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Purchase Coit Tower'}
          </button>

          <p className="text-xs text-gray-500 text-center">
            ✨ Your unique serial number will be revealed after purchase
          </p>
        </div>
      </div>
    </div>
  );
}