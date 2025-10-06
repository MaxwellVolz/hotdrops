'use client';

import { useEffect } from 'react';

interface BuyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BuyOption {
  id: string;
  title: string;
  description: string;
  price: string;
  priceBreakdown: string | null;
  image: string;
  link: string;
}

const BuyModal = ({ isOpen, onClose }: BuyModalProps) => {

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const buyOptions = [
    {
      id: 'standard-shipping',
      title: 'Coit Cache + Shipping',
      description: 'Limited edition collectible delivered to your door',
      price: '$27',
      priceBreakdown: '$22 + $5 shipping',
      image: '/product/coit-1.jpg',
      link: 'https://buy.stripe.com/aFa4gyb9A7wC7qie1o9k402'
    },
    {
      id: 'standard-pickup',
      title: 'Coit Cache - Local Pickup',
      description: 'Pick up your limited edition collectible at Mr. Bings during the next 49ers game.',
      price: '$20',
      priceBreakdown: null,
      image: '/product/coit-1.jpg',
      link: 'https://buy.stripe.com/8x228q6TkdV025Y7D09k404'
    },
    {
      id: 'adult-shipping',
      title: 'Adult Version + Shipping',
      description: 'Includes slots for "candy" cigarettes or mini colored pencils',
      price: '$27',
      priceBreakdown: '$22 + $5 shipping',
      image: '/product/coit-1.jpg',
      link: 'https://buy.stripe.com/9B65kC2D44kq6me3mK9k405'
    },
    {
      id: 'adult-pickup',
      title: 'Adult Version - Local Pickup',
      description: 'Adult version with slots for accessories. Local pickup at Mr. Bings during the next 49ers game.',
      price: '$20',
      priceBreakdown: null,
      image: '/product/coit-1.jpg',
      link: 'https://buy.stripe.com/3cIbJ05Pg6sy6me7D09k403'
    }
  ];

  const handlePurchase = (link: string) => {
    if (link !== '#') {
      window.location.href = link;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 md:p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors duration-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Choose Your Coit Cache</h2>
          <p className="text-white/80 text-lg">
            A pocket-sized Coit Tower. Store your keepsakes in a San Francisco icon.
          </p>
        </div>

        {/* Buy Options */}
        <div className="grid gap-4 md:gap-6">
          {buyOptions.map((option) => (
            <div
              key={option.id}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0">
                  <img
                    src={option.image}
                    alt={option.title}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover bg-white/20"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white">{option.title}</h3>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-green-400">{option.price}</span>
                      {option.priceBreakdown && (
                        <div className="text-sm text-white/60">{option.priceBreakdown}</div>
                      )}
                    </div>
                  </div>
                  <p className="text-white/70 text-sm md:text-base">{option.description}</p>
                </div>
              </div>
              <button
                onClick={() => handlePurchase(option.link)}
                disabled={option.link === '#'}
                className={`w-full py-3 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${option.link === '#'
                  ? 'bg-gray-500/50 text-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-green-500/30'
                  }`}
              >
                {option.link === '#' ? 'Coming Soon' : 'Buy Now'}
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-white/60 text-sm">
            Secure checkout powered by Stripe • 30-day money-back guarantee
          </p>
        </div>
      </div>
    </div>
  );
};

export default BuyModal;