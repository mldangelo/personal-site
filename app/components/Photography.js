import React from 'react';
import { Link } from 'react-router';

const images = [
  { src: '/images/projects/catdetector.jpg' },
  { src: '/images/projects/harvest.jpg' },
  { src: '/images/projects/nearestdollar.jpg' },
  { src: '/images/projects/spacepotato.jpg' },
  { src: '/images/projects/catdetector.jpg' },
  { src: '/images/projects/harvest.jpg' },
  { src: '/images/projects/nearestdollar.jpg' },
  { src: '/images/projects/spacepotato.jpg' },
  { src: '/images/projects/catdetector.jpg' },
  { src: '/images/projects/harvest.jpg' },
  { src: '/images/projects/nearestdollar.jpg' },
  { src: '/images/projects/spacepotato.jpg' },
  { src: '/images/projects/catdetector.jpg' },
  { src: '/images/projects/harvest.jpg' },
  { src: '/images/projects/nearestdollar.jpg' },
  { src: '/images/projects/spacepotato.jpg' },
  { src: '/images/projects/catdetector.jpg' },
  { src: '/images/projects/harvest.jpg' },
  { src: '/images/projects/nearestdollar.jpg' },
  { src: '/images/projects/spacepotato.jpg' },
  { src: '/images/projects/catdetector.jpg' },
  { src: '/images/projects/harvest.jpg' },
  { src: '/images/projects/nearestdollar.jpg' },
  { src: '/images/projects/spacepotato.jpg' },
  { src: '/images/projects/catdetector.jpg' },
  { src: '/images/projects/harvest.jpg' },
  { src: '/images/projects/nearestdollar.jpg' },
  { src: '/images/projects/spacepotato.jpg' },
];

const categories = [
  'Ethiopa 2016',
  'Europe(?) 2016',
  'Svalbard 2016',
  'Uganda 2016',
  'Panama and Costa Rica 2016',
  'Tahoe (?) 2017',
  'Japan 2017',
  'Airplanes'
]

const getRandomSize = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
};

const getImages = () => (
  images.map(image => <img 
    key={`${image.src}-${getRandomSize(-1000, 1000)}`} 
    src={image.src} 
    alt="pretty kitty"
    width={getRandomSize(300, 600)}
    />)
);

const Photography = () => (
  <div className="photography">
    <h1>Photography</h1>
    <p>Still under construction. Content is likely to change.</p>
    <section id="photos">
      {getImages()}
    </section>
  </div>
);

export default Photography;
