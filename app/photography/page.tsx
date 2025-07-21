'use client';

import React, { useState } from 'react';

import type { Metadata } from 'next';

import { galleries, featuredPhotos, photographyStats } from '@/data/photography';
import type { Gallery, Photo } from '@/data/photography';
import OptimizedImage from '@/components/OptimizedImage/OptimizedImage';

// export const metadata: Metadata = {
//   title: 'Photography',
//   description: "Michael D'Angelo's photography from travels around the world.",
// };

export default function PhotographyPage() {
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  // Lightbox component for full-screen photo view
  const Lightbox = ({ photo, onClose }: { photo: Photo; onClose: () => void }) => (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={onClose}>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300"
        aria-label="Close"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div className="max-w-7xl max-h-[90vh] relative" onClick={(e) => e.stopPropagation()}>
        <img
          src={photo.full}
          alt={photo.title}
          className="max-w-full max-h-[80vh] object-contain"
        />
        <div className="text-white mt-4 text-center">
          <h3 className="text-xl font-semibold">{photo.title}</h3>
          <p className="text-gray-300">{photo.location} • {photo.date}</p>
          {photo.settings && <p className="text-sm text-gray-400 mt-2">{photo.settings}</p>}
          {photo.description && <p className="text-gray-300 mt-2">{photo.description}</p>}
        </div>
      </div>
    </div>
  );

  return (
    <main className="px-6 py-16 sm:px-12 lg:px-16">
      <div className="max-w-6xl mx-auto">
        {!selectedGallery ? (
          <>
            <h1 className="text-3xl font-semibold mb-4">Photography</h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-12 max-w-3xl">
              Capturing moments from {photographyStats.countries} countries. Shot on Nikon D750, D800, and occasionally Mamiya 6II.
            </p>

            {/* Featured Photos */}
            <section className="mb-12">
              <h2 className="text-xl font-semibold mb-6">Featured</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featuredPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative group cursor-pointer overflow-hidden rounded-lg"
                    onClick={() => setSelectedPhoto(photo)}
                  >
                    <div className="aspect-[3/2] bg-gray-200 dark:bg-gray-800">
                      <img
                        src={photo.thumbnail}
                        alt={photo.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="font-semibold">{photo.title}</h3>
                        <p className="text-sm">{photo.location}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Galleries */}
            <section className="mb-12">
              <h2 className="text-xl font-semibold mb-6">Galleries</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleries.map((gallery) => (
                  <div
                    key={gallery.name}
                    className="group glass glass-hover rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => setSelectedGallery(gallery)}
                  >
                    <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-800 relative overflow-hidden">
                      <img
                        src={gallery.coverPhoto}
                        alt={gallery.name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <h3 className="text-white text-2xl font-bold">{gallery.name}</h3>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="font-semibold">{gallery.name}, {gallery.year}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {gallery.photos.length} photos
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {gallery.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          // Gallery View
          <div>
            <button
              onClick={() => setSelectedGallery(null)}
              className="mb-6 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              ← Back to galleries
            </button>
            <h1 className="text-3xl font-semibold mb-4">{selectedGallery.name}</h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              {selectedGallery.description}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedGallery.photos.map((photo) => (
                <div
                  key={photo.id}
                  className="relative group cursor-pointer overflow-hidden rounded-lg"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <div className="aspect-[3/2] bg-gray-200 dark:bg-gray-800">
                    <img
                      src={photo.thumbnail}
                      alt={photo.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="font-semibold text-sm">{photo.title}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gear */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-6">Gear</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Digital</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• Nikon D750 (primary body)</li>
                <li>• Nikon D800 (landscape & high res)</li>
                <li>• Nikkor 24-70mm f/2.8</li>
                <li>• Nikkor 70-200mm f/2.8</li>
                <li>• Nikkor 50mm f/1.4</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Film</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• Mamiya 6II (medium format)</li>
                <li>• 50mm f/4</li>
                <li>• 75mm f/3.5</li>
                <li>• 150mm f/4.5</li>
                <li>• Mostly Portra 400 & Ektar 100</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Philosophy */}
        <section className="glass rounded-lg p-8">
          <h2 className="text-xl font-semibold mb-4">Philosophy</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            I've been taking photos since I was 8, when my parents bought me a Sony Mavica that saved 
            10 images to a floppy disk. Photography for me is about capturing authentic moments and the 
            beauty in everyday scenes.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            I prefer natural light, candid moments, and finding unique perspectives in common places. 
            The best camera is the one you have with you, but I still love the tactile experience of 
            my film cameras.
          </p>
        </section>

        {/* Links */}
        <div className="mt-12 text-center">
          <a
            href="https://instagram.com/dangelosaurus"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline text-gray-600 dark:text-gray-400"
          >
            Follow on Instagram →
          </a>
        </div>

        {/* Lightbox */}
        {selectedPhoto && (
          <Lightbox photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
        )}
      </div>
    </main>
  );
}