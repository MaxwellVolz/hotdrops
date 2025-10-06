'use client';

import { useEffect } from 'react';
import Image from 'next/image';

interface BuyModalProps {
  isOpen: boolean;
  onClose: () => void;
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

  const productSections = [
    {
      id: 'standard',
      title: 'Coit Cache',
      description: 'Limited edition collectible - a pocket-sized Coit Tower.',
      image: '/product/coit-1.jpg',
      buttons: [
        {
          id: 'standard-pickup',
          title: 'Local Pickup',
          price: '$22',
          link: 'https://buy.stripe.com/7sY9AS5Pg7wC25Y9L89k406'
        },
        {
          id: 'standard-shipping',
          title: 'With Shipping',
          price: '$22 + $5',
          link: 'https://buy.stripe.com/aFa4gyb9A7wC7qie1o9k402'
        }
      ]
    },
    {
      id: 'adult',
      title: 'Adult Version',
      description: 'Includes slots for "candy" cigarettes or mini colored pencils.',
      image: '/product/coit-1.jpg',
      buttons: [
        {
          id: 'adult-pickup',
          title: 'Local Pickup',
          price: '$22',
          link: 'https://buy.stripe.com/cNi9AS4Lc6sy7qi7D09k407'
        },
        {
          id: 'adult-shipping',
          title: 'With Shipping',
          price: '$22 + $5',
          link: 'https://buy.stripe.com/9B65kC2D44kq6me3mK9k405'
        }
      ]
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

        {/* Product Sections */}
        <div className="grid gap-6 md:gap-8">
          {productSections.map((section) => (
            <div
              key={section.id}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/20"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0">
                  <Image
                    src={section.image}
                    alt={section.title}
                    width={96}
                    height={96}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover bg-white/20"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">{section.title}</h3>
                  <p className="text-white/70 text-sm md:text-base">{section.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {section.buttons.map((button) => (
                  <button
                    key={button.id}
                    onClick={() => handlePurchase(button.link)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-bold text-lg transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-green-500/30 flex items-center justify-between"
                  >
                    <span>{button.title}</span>
                    <span className="text-green-100">{button.price}</span>
                  </button>
                ))}
              </div>
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