// TODO Add a couple lines about each project
const data = [
  {
    title: 'Image Generator using Raycasts',
    subtitle: '',
    image: '/images/projects/scene_creator.png',
    date: '2022-07-01',
    link: 'https://github.com/mgroling/SceneCreator',
    desc:
      'Built a render engine to create high-definition images using ray-casting. '
      + 'The engine is built in C++ and covers lighting, textures, and a parallelised ray-casting procedure.',
  },
  {
    title: 'Waste Classification System',
    subtitle: '',
    image: '/images/projects/waste_classification.png',
    date: '2022-04-01',
    link: 'https://github.com/mgroling/WasteClassification',
    desc:
      'Built a system that can help classifiy waste together with another student. '
      + 'Furthermore, a dataset of ~5000 images was collected from a local waste site. '
      + 'On this dataset, several image classification models were trained and used to classify waste. '
      + 'The work was presented in the Intelligent Systems Conference 2023.',
  },
  {
    title: "Gym Rubik's Cube",
    subtitle: '',
    image: '/images/projects/rubiks_cube.png',
    date: '2021-08-01',
    link: 'https://github.com/mgroling/GymRubiksCube',
    desc:
      "Created a reinforcement learning environment for the 3-sided Rubik's Cube in Python. "
      + 'The environment features a 3D visualisation tool that can render any object consisting of triangles using rasterization. '
      + 'However, it only runs on the cpu and is thus quite slow.',
  },
  {
    title: 'Learning of Locomotion Data of Elephant Fish',
    subtitle: '',
    image: '/images/projects/elephant_fish.jpg',
    date: '2020-05-01',
    link: 'https://github.com/mgroling/Elephant-Fish',
    desc:
      'Trained an LSTM neural network to predict the locomotion behaviour of elephant fish. '
      + 'Data (ray-casts and movement) was extracted from given recordings.'
      + 'The project was done as part of a software project in collaboration with two other people.',
  },
];

export default data;
