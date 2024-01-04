// TODO Add a couple lines about each project
const data = [
  {
    title: 'Master thesis: E-Waste Tracking with Blockchain',
    subtitle: '',
    image: '/images/projects/master_thesis_1.png',
    date: '2023-06-01',
    link: 'https://ntnuopen.ntnu.no/ntnu-xmlui/bitstream/handle/11250/3093301/no.ntnu%3Ainspera%3A146719271%3A95368941.pdf?sequence=1',
    desc:
      'Created a waste tracking system with blockchain that uses a byzantine fault-tolerant consensus algorithm. '
      + 'A unique barcode is assigned to each electronic device and then added to the blockchain.',
  },
  {
    title: 'Waste Classification System',
    subtitle: '',
    image: '/images/projects/waste_classification.png',
    date: '2022-12-01',
    link: 'https://github.com/mgroling/WasteClassification',
    desc:
      'Built a system that can classify waste together with another student. '
      + 'Furthermore, a dataset of ~5000 images was collected from a local waste site. '
      + 'On this dataset, several image classification models were trained and used to classify waste. '
      + 'The work was presented in the Intelligent Systems Conference 2023.',
  },
  {
    title: 'Image Generator using Raycasts',
    subtitle: '',
    image: '/images/projects/scene_creator.png',
    date: '2022-08-01',
    link: 'https://github.com/mgroling/SceneCreator',
    desc:
      'Built a render engine to create high-definition images using ray-casting. '
      + 'The engine is built in C++ and covers lighting, textures, and a parallelised ray-casting procedure.',
  },
  {
    title: "Gym Rubik's Cube",
    subtitle: '',
    image: '/images/projects/rubiks_cube.png',
    date: '2021-10-01',
    link: 'https://github.com/mgroling/GymRubiksCube',
    desc:
      "Created a reinforcement learning environment for the 3-sided Rubik's Cube in Python. "
      + 'The environment features a 3D visualisation tool that can render any object consisting of triangles using rasterization. '
      + 'However, it only runs on the CPU and is thus quite slow.',
  },
  {
    title: 'Bachelor thesis: Learning of Locomotion Data of Guppies with SQIL (RL)',
    subtitle: '',
    image: '/images/projects/bachelor_thesis.png',
    date: '2021-05-01',
    link: 'http://www.mi.fu-berlin.de/inf/groups/ag-ki/Theses/Completed-theses/Bachelor-theses/2021/Groeling/BachelorThesis-Marc-Groeling.pdf',
    desc:
      'Trained an artificial neural network with soft Q imitation learning (SQIL), which uses a combination of supervised learning '
      + 'and reinforcement learning to generate training data. Hyperparameter optimisation was done and metrics to evaluate the models '
      + 'created.',
  },
  {
    title: 'Learning of Locomotion Data of Elephant Fish',
    subtitle: '',
    image: '/images/projects/elephant_fish.jpg',
    date: '2020-07-01',
    link: 'https://github.com/mgroling/Elephant-Fish',
    desc:
      'Trained an LSTM neural network to predict the locomotion behaviour of elephant fish. '
      + 'Data (ray-casts and movement) was extracted from given recordings.'
      + 'The project was done as part of a software project in collaboration with two other people.',
  },
];

export default data;
