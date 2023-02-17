// TODO Add a couple lines about each project
const data = [
  {
    title: 'Compressing and Accelerating Stable Diffusion',
    subtitle: 'Harvard CS242: Computing as Scale Final Project',
    link: '/resources/projects/CS_242_Final_Project.pdf',
    image: '/images/projects/Harvard-CS242-results.png',
    date: '2022-12-10',
    desc:
      'We explore methods for compressing and accelerating Stable Diffusion, '
      + 'resulting in a final compressed model with 80% memory size reduction '
      + 'and a generation speed that is ∼4x faster, while maintaining text-to-image quality.',
  },
  {
    title: 'Harvard X Microsoft: Socioeconomic Future of Kenya',
    subtitle: 'Harvard APCOMP 297R: CSE Capstone Project',
    link: 'https://capstone2022-kenya-socioeconomic.shinyapps.io/capstone_kenya/',
    image: '/images/projects/Harvard-APCOMP297R-results.png',
    date: '2022-12-10',
    desc:
      'We developed custom models to understand the historical trends of key economic indicators in Kenya such as Gross County Product (GCP), '
      + 'sector-level GCP, education Level, and population, all on a county level. We presented the results in an interactive model '
      + 'to drive actionable insights.',
  },
  {
    title: 'Uncertainty Quantification in Question-Answering Models',
    subtitle: 'MIT 6.8610: Quantitative Methods for Natural Language Processing Final Project',
    link: '/resources/projects/NLP_Project_Final_Report.pdf',
    image: '/images/projects/MIT-NLP-results.png',
    date: '2022-12-10',
    desc:
      'We examine the uncertainty quantification of BERTbased Span-Extractive QA models, '
      + 'one of the most commonly used and foundational models in '
      + 'QA. We compare the uncertainty characteristics of MC-Dropout, '
      + 'Deep Ensembles, and SNGP applied to ALBERT and DistilBERT base models '
      + 'via Entropy, Probability Variance, and Bayesian Active Learning by Disagreement.',
  },
  {
    title: 'Design Choices for Dual-arm Robotic Manipulation',
    subtitle: 'MIT 6.4212: Robotic Manipulation Final Project',
    link: '/resources/projects/Robotic_Manipulation_Project.pdf',
    video: '/videos/projects/MIT-Robotic-Manipulation-Final-Project.mp4',
    date: '2022-12-10',
    desc:
      'We propose three different controllers for a dual-armed robot system: '
      + '1) separate controllers for each arm with assumptions on the workspace, '
      + '2) separate controllers with a communication channel between them, and '
      + '3) single controller for both arms. We constructed a series of manipulation tasks '
      + 'to determine the advantages and disadvantages of each approach.',
  },
  {
    title: 'Evaluation of Optimal Decision Making with Dead-ends in High-Risk Environments',
    subtitle: 'Stats 234: Sequential Decision Making Final Project',
    link: '/resources/projects/Harvard-STATS-234-final-paper.pdf',
    image: '/images/projects/Harvard-STATS-234-Poster.jpg',
    date: '2022-05-10',
    desc:
      'We investigate the effectivness of multiple offline reinfocment learning algorithms '
      + 'and their abilitiies to detect dead-ends. Dead-ends are states that eventually lead to '
      + 'a negitive reward.',
  },
  {
    title: 'DogeGAN',
    subtitle: 'End-to-end platform for creation of NFT artwork',
    link: '/resources/projects/MIT-CV-DogeGAN-final-paper.pdf',
    video: '/videos/projects/MIT-CV-Final-Project.mp4',
    date: '2022-05-10',
    desc:
    'We propose an end-to-end solution to generating digital artwork '
    + 'using Generative Adversarial Networks (GANs) to mimic '
    + 'popular collections of NFTs. The generation of artwork, can be guided by '
    + 'image or text based inputs powered by CLIP.',
  },
  {
    title: 'Planatary Impact Simulation',
    subtitle: 'CS205: High Performance Computing final project',
    link: '/resources/projects/Harvard-CS205-final-paper.pdf',
    video: '/videos/projects/Harvard-CS205-demo.mp4',
    date: '2022-05-05',
    desc:
      'Developed a Smoothed Particle Hydrodynamics (SPH) simulator supporting 10M+ particles, optimized with OpenMP, OpenMPI, Eigen. Rendered with raw OpenGL.',
  },
  {
    title: 'Alpha Holdem',
    subtitle: 'Building an Efficient Poker Agent Using RL',
    link: '/resources/projects/MIT-CSM-final-paper.pdf',
    image: '/images/projects/MIT-CSM-final-paper.png',
    date: '2022-05-10',
    desc:
      'In this paper we apply three variations of Deep Q-learning (DQN) and '
      + 'Proximal Policy Optimization (PPO) to '
      + 'learn the game of heads-up no-limit Texas Hold’em.',
  },
  {
    title: 'Visual-Inertial Odometry on the MIT Racecars',
    subtitle: '',
    video: '/videos/projects/MIT-VNAV-demo.mp4',
    link: '/resources/projects/MIT-VNAV-final-paper.pdf',
    date: '2021-12-16',
    desc:
      'In this work, we document considerations and results of VINS-Fusion, '
      + 'an open-source implementation of VIO, onto the '
      + 'MIT Racecar mobile platform, using a Jetson TX2 Developer '
      + 'kit and a RealSense D455 stereo camera with an inertial '
      + 'measurement unit.',
  },
  {
    title: 'Galaxy Simulator',
    subtitle: 'AM05: Final Project',
    video: '/images/projects/Harvard-AM205-demo.mp4',
    link: '/resources/projects/MIT-VNAV-final-paper.pdf',
    date: '2021-12-17',
    desc:
      'In this work, we use the oct-tree-based Barnes-Hut algorithm to simulate '
      + '60k particles colliding in a galaxy simulation.',
  },
  {
    title: 'Flying Courier: Cheap Indoor Drone Localization',
    subtitle: '',
    image: '/images/projects/Berkeley-EECS149-drone.jpg',
    link: '/resources/projects/Berkeley-EECS149-final-paper.pdf',
    date: '2015-05-15',
    desc:
      'We propose a robust, redundant, and reliable, indoor localization scheme for drones '
      + 'only requiring readily accessible materials: an HD webcam an a regular Inkjet printer.',
  },
];

export default data;
