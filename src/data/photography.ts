export interface Photo {
  id: string;
  title: string;
  location: string;
  date: string;
  camera: string;
  settings?: string;
  description?: string;
  thumbnail: string;
  full: string;
}

export interface Gallery {
  name: string;
  year: number;
  description: string;
  coverPhoto: string;
  photos: Photo[];
}

export const galleries: Gallery[] = [
  {
    name: 'Svalbard',
    year: 2016,
    description: 'Arctic wilderness at 78°N. Polar bears, glaciers, and 24-hour daylight.',
    coverPhoto: '/images/photography/svalbard/svalbard-cover.jpg',
    photos: [
      {
        id: 'svalbard-1',
        title: 'Midnight Sun over Ny-Ålesund',
        location: 'Ny-Ålesund, Svalbard',
        date: '2016-07-15',
        camera: 'Nikon D750',
        settings: '24mm, f/8, 1/500s, ISO 100',
        description: 'The sun never sets during Arctic summer. This was taken at 2 AM.',
        thumbnail: '/images/photography/svalbard/thumb-1.jpg',
        full: '/images/photography/svalbard/full-1.jpg',
      },
      {
        id: 'svalbard-2',
        title: 'Polar Bear on Ice',
        location: 'Nordaustlandet, Svalbard',
        date: '2016-07-18',
        camera: 'Nikon D750',
        settings: '400mm, f/5.6, 1/1000s, ISO 400',
        description: 'A lone polar bear hunting on the pack ice. Shot from a zodiac at safe distance.',
        thumbnail: '/images/photography/svalbard/thumb-2.jpg',
        full: '/images/photography/svalbard/full-2.jpg',
      },
      {
        id: 'svalbard-3',
        title: 'Monaco Glacier',
        location: 'Liefdefjorden, Svalbard',
        date: '2016-07-20',
        camera: 'Nikon D750',
        settings: '70mm, f/11, 1/250s, ISO 200',
        description: 'The massive Monaco Glacier meets the Arctic Ocean. The ice is over 1000 years old.',
        thumbnail: '/images/photography/svalbard/thumb-3.jpg',
        full: '/images/photography/svalbard/full-3.jpg',
      },
    ],
  },
  {
    name: 'Japan',
    year: 2017,
    description: 'Cherry blossoms, ancient temples, and neon-lit streets of Tokyo.',
    coverPhoto: '/images/photography/japan/japan-cover.jpg',
    photos: [
      {
        id: 'japan-1',
        title: 'Fushimi Inari at Dawn',
        location: 'Kyoto, Japan',
        date: '2017-04-03',
        camera: 'Nikon D800',
        settings: '35mm, f/5.6, 1/125s, ISO 400',
        description: 'The famous thousand torii gates without crowds. Worth the 4 AM wake up.',
        thumbnail: '/images/photography/japan/thumb-1.jpg',
        full: '/images/photography/japan/full-1.jpg',
      },
      {
        id: 'japan-2',
        title: 'Shibuya Crossing',
        location: 'Tokyo, Japan',
        date: '2017-04-08',
        camera: 'Nikon D800',
        settings: '24mm, f/8, 1/60s, ISO 1600',
        description: 'The world\'s busiest pedestrian crossing. Up to 3,000 people cross at once.',
        thumbnail: '/images/photography/japan/thumb-2.jpg',
        full: '/images/photography/japan/full-2.jpg',
      },
      {
        id: 'japan-3',
        title: 'Mount Fuji from Lake Kawaguchi',
        location: 'Yamanashi, Japan',
        date: '2017-04-10',
        camera: 'Nikon D800',
        settings: '85mm, f/8, 1/500s, ISO 100',
        description: 'Perfect reflection of Mount Fuji during cherry blossom season.',
        thumbnail: '/images/photography/japan/thumb-3.jpg',
        full: '/images/photography/japan/full-3.jpg',
      },
    ],
  },
  {
    name: 'Rwanda',
    year: 2023,
    description: 'Land of a thousand hills. Mountain gorillas and incredible people.',
    coverPhoto: '/images/photography/rwanda/rwanda-cover.jpg',
    photos: [
      {
        id: 'rwanda-1',
        title: 'Mountain Gorilla Portrait',
        location: 'Volcanoes National Park, Rwanda',
        date: '2023-06-12',
        camera: 'Nikon D750',
        settings: '200mm, f/4, 1/250s, ISO 800',
        description: 'A silverback in his natural habitat. One of only 1,000 left in the wild.',
        thumbnail: '/images/photography/rwanda/thumb-1.jpg',
        full: '/images/photography/rwanda/full-1.jpg',
      },
      {
        id: 'rwanda-2',
        title: 'Kigali at Dusk',
        location: 'Kigali, Rwanda',
        date: '2023-06-15',
        camera: 'Nikon D750',
        settings: '50mm, f/2.8, 1/60s, ISO 400',
        description: 'The cleanest city in Africa. Plastic bags have been banned since 2008.',
        thumbnail: '/images/photography/rwanda/thumb-2.jpg',
        full: '/images/photography/rwanda/full-2.jpg',
      },
    ],
  },
  {
    name: 'Iceland',
    year: 2017,
    description: 'Fire and ice. Waterfalls, glaciers, and the Northern Lights.',
    coverPhoto: '/images/photography/iceland/iceland-cover.jpg',
    photos: [
      {
        id: 'iceland-1',
        title: 'Aurora Borealis over Jökulsárlón',
        location: 'Jökulsárlón Glacier Lagoon, Iceland',
        date: '2017-11-23',
        camera: 'Nikon D750',
        settings: '14mm, f/2.8, 15s, ISO 3200',
        description: 'Northern lights dancing over the glacier lagoon. -15°C but worth every moment.',
        thumbnail: '/images/photography/iceland/thumb-1.jpg',
        full: '/images/photography/iceland/full-1.jpg',
      },
      {
        id: 'iceland-2',
        title: 'Skógafoss Rainbow',
        location: 'Skógafoss, Iceland',
        date: '2017-11-25',
        camera: 'Nikon D750',
        settings: '24mm, f/11, 1/125s, ISO 100',
        description: 'One of Iceland\'s largest waterfalls. The spray creates constant rainbows.',
        thumbnail: '/images/photography/iceland/thumb-2.jpg',
        full: '/images/photography/iceland/full-2.jpg',
      },
    ],
  },
  {
    name: 'Ethiopia',
    year: 2016,
    description: 'Ancient cultures and dramatic landscapes in the Horn of Africa.',
    coverPhoto: '/images/photography/ethiopia/ethiopia-cover.jpg',
    photos: [
      {
        id: 'ethiopia-1',
        title: 'Erta Ale Lava Lake',
        location: 'Danakil Depression, Ethiopia',
        date: '2016-02-14',
        camera: 'Nikon D750',
        settings: '35mm, f/4, 1/30s, ISO 6400',
        description: 'One of only six permanent lava lakes on Earth. The hottest place on the planet.',
        thumbnail: '/images/photography/ethiopia/thumb-1.jpg',
        full: '/images/photography/ethiopia/full-1.jpg',
      },
      {
        id: 'ethiopia-2',
        title: 'Mursi Tribe Elder',
        location: 'Omo Valley, Ethiopia',
        date: '2016-02-18',
        camera: 'Nikon D750',
        settings: '85mm, f/2.8, 1/250s, ISO 200',
        description: 'Portrait of a Mursi tribe elder. One of the last tribes to maintain traditional ways.',
        thumbnail: '/images/photography/ethiopia/thumb-2.jpg',
        full: '/images/photography/ethiopia/full-2.jpg',
      },
    ],
  },
];

export const featuredPhotos: Photo[] = [
  galleries[0].photos[1], // Polar bear
  galleries[1].photos[2], // Mount Fuji
  galleries[3].photos[0], // Northern Lights
  galleries[2].photos[0], // Mountain Gorilla
];

export const photographyStats = {
  countries: 52,
  photos: 50000,
  cameras: 3,
  favoriteGear: 'Nikon D750 + 24-70mm f/2.8',
};