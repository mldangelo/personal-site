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

const getRandomSize = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
};

const getImages = () => (
  images.map(image => <img 
    key={`${image.src}-${getRandomSize(-1000, 1000)}`} 
    src={image.src} 
    alt="pretty kitty"
    width={getRandomSize(200, 400)}
    />)
);

const Photography = () => (
  <div className="photography">
    <h1>Photography</h1>
    <p>Still under construction. Content is likely to change.</p>
    <section classID="photos">
      {getImages()}
    </section>
  </div>
);

export default Photography;
