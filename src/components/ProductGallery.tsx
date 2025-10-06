'use client';

import { useState } from 'react';
import Image from 'next/image';

const SAMPLE_IMAGES = [
  '/product/coit-1.jpg',
  '/product/coit-2.jpg',
  '/product/coit-3.jpg',
];

const REVIEWS = [
  { text: "I've lived in SF for 30 years and I've never seen anything like this!", author: "Sergio" },
  { text: "Is this the best website on the internet? Um. Yeah. I think it is.", author: "Tom" },
  { text: "Really cute.", author: "John" },
];

interface ProductGalleryProps {
  rainEnabled: boolean;
  toggleRain: () => void;
}

export default function ProductGallery({ rainEnabled, toggleRain }: ProductGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-0 z-10 backdrop-blur-xl bg-gradient-to-br from-white/15 to-white/5 py-3 md:py-4 px-4 md:px-6 rounded-r-xl border border-l-0 border-white/10 shadow-2xl hover:bg-white/20 transition-all duration-300"
      >
        <div className="flex items-center gap-2 text-base md:text-lg text-white font-bold tracking-wide">
          <span>📸</span>
          <span className="hidden sm:inline">View Gallery</span>
        </div>
      </button>

      {/* Slide-out Panel */}
      <div
        className={`fixed inset-y-0 left-0 w-full sm:w-96 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border-r border-white/10 shadow-2xl z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <span className="text-white text-xl">×</span>
        </button>

        <div className="h-full overflow-y-auto p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Product Gallery</h2>

          {/* Image Gallery */}
          <div className="mb-6">
            <div className="aspect-square bg-white/5 rounded-xl mb-3 overflow-hidden">
              <Image
                src={SAMPLE_IMAGES[currentImage]}
                alt={`Product ${currentImage + 1}`}
                width={400}
                height={400}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>

            {/* Image Thumbnails */}
            <div className="flex gap-2">
              {SAMPLE_IMAGES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${currentImage === idx
                    ? 'border-white'
                    : 'border-white/20 opacity-60 hover:opacity-100'
                    }`}
                >
                  <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/40 text-xs">
                    {idx + 1}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="mb-10">
            <h3 className="text-lg font-semibold text-white mb-3">What People Say</h3>
            <div className="space-y-3">
              {REVIEWS.map((review, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10"
                >
                  <p className="text-white/90 text-sm mb-2 italic">&ldquo;{review.text}&rdquo;</p>
                  <p className="text-white/60 text-xs">— {review.author}</p>
                </div>
              ))}
            </div>
          </div>

          {/* About the Artist */}
          <div className="mb-10">
            <h3 className="text-lg font-semibold text-white mb-3">About the Artist</h3>
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
              <p className="text-white/80 text-sm leading-relaxed mb-3">
                Maxwell has called San Francisco home since 2012, falling in love with its architecture, culture, and timeless landmarks.
              </p>
              <p className="text-white/80 text-sm leading-relaxed">
                Coit Cache is his way of capturing the spirit of the city.
              </p>
            </div>
          </div>

          {/* Weather Controls */}
          <div>
            <button
              onClick={toggleRain}
              className="w-full text-4xl py-2 hover:scale-110 transition-all duration-300 flex items-center justify-center"
            >
              {rainEnabled ? '🌧️' : '☀️'}
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        />
      )}
    </>
  );
}
