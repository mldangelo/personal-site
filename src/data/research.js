// TODO Add a couple lines about each project
const data = [
  {
    category: {
      title: 'Energy Markets',
      image: '/images/research/proactive_electricity_markets.jpeg',
      imageMobile: '/images/research/proactive_electricity_markets_mobile.jpeg',
    },
    papers: [
      {
        title: 'Proactive Electricity Markets',
        authors: 'Kai Zhang, Nicolas Lanzetti, Florian Dörfler, Keith Moffat',
        status: 'Working Paper',
        links: [
          {
            link: '/files/master_thesis_stochastic_electricity_markets.pdf',
            text: 'Master Thesis',
          },
          {
            link: 'https://svorasro.wordpress.com/2025/07/07/congratulations-to-kai-zhang-on-receiving-the-2025-svor-masters-thesis-award/',
            text: 'SVOR Best Master Thesis Award 2025',
          },
        ],
      },
    ],
  },
  {
    category: {
      title: 'Data-Driven Control',
      image: '/images/research/deeprc.png',
      imageMobile: '/images/research/deeprc_mobile.jpeg',
      // desc:
      //   'Built for a social impact hackathon. '
      //   + 'NearestDollar connected to your bank accounts, credit cards, '
      //   + 'or debit cards and rounded up your purchases to donate the balance to '
      //   + 'the charity of your choice.',
    },
    papers: [
      {
        title: 'Data-Enabled Predictive Iterative Control',
        authors: 'Kai Zhang, Riccardo Zuliani, Efe Balta, John Lygeros',
        journal: 'IEEE Control Systems Letters',
        year: 2024,
        links: [
          {
            link: 'https://doi.org/10.1109/LCSYS.2024.3408073',
            text: '10.1109/LCSYS.2024.3408073',
          },
        ],
      },
      {
        title: 'Data-Enabled Predictive Control for Dynamic Traffic Routing',
        authors: 'Kai Zhang, Kenan Zhang, Linbin Huang, Giuseppe Belgioioso, John Lygeros, Florian Dörfler',
        journal: 'TRB Annual Meeting',
        year: 2024,
        links: [
          {
            link: 'https://www.research-collection.ethz.ch/bitstream/handle/20.500.11850/719197/6/23_Zhang_TRBAM_DeePC-routing.pdf',
            text: 'ETH Zurich Research Collection',
          },
        ],
      },
    ],
  },
];

export default data;
