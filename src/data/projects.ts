export interface Project {
  title: string;
  subtitle?: string;
  link?: string;
  image?: string;
  date: string;
  desc: string;
  tech?: string[];
  featured?: boolean;
}

const data: Project[] = [
  {
    title: 'Thevenin Resistance Instrument',
    subtitle: '4-layer PCB | Arduino Uno shield',
    date: '2026-05-01',
    desc: 'Designed a 4-layer Altium Arduino Uno shield that measures Thevenin resistance over 20 current steps using a DAC, op-amp feedback loop, and I2C ADC.',
    tech: ['Altium Designer', 'PCB Design', 'SPICE', 'I2C', 'Analog Design'],
    featured: true,
  },
  {
    title: 'Golden Arduino',
    subtitle: 'Custom ATmega328P board',
    date: '2026-05-01',
    desc: 'Designed, bootloaded, and characterized a custom Arduino with a continuous ground plane, local decoupling, and a ferrite-bead LC filter; measured faster rise times and lower near-field emissions than a commercial Uno.',
    tech: ['Altium Designer', 'ATmega328P', 'Signal Integrity', 'Oscilloscope'],
    featured: true,
  },
  {
    title: 'Embedded Blackjack Game System',
    subtitle: 'STM32 embedded software',
    date: '2025-12-01',
    desc: 'Built a playable casino-style Blackjack system in C with LCD graphics, button controls, randomized cards, balance tracking, event-driven game states, and a custom cheat-code input sequence.',
    tech: ['C', 'STM32', 'LCD UI', 'Interrupts', 'Embedded Systems'],
  },
  {
    title: 'Bluetooth-Controlled Mobile Robot',
    subtitle: 'Electronics Design Lab',
    date: '2025-05-01',
    desc: 'Engineered a Bluetooth-controlled robot with a BJT H-bridge, analog speed sensing, and interrupt-driven closed-loop position control using encoder feedback for millimeter-scale precision.',
    tech: [
      'Arduino Nano Every',
      'C++',
      'SPICE',
      'Control Systems',
      'Bluetooth',
    ],
  },
  {
    title: 'RF & IR Robot',
    subtitle: 'Lead Electrical Engineer',
    date: '2024-12-01',
    desc: 'Led a four-person team to design and build a robot with RF and infrared control modes, a hardware switching interface, modular PCB connectors, and microcontroller control logic.',
    tech: ['Arduino', 'PCB Schematics', 'RF', 'Infrared', 'Team Leadership'],
  },
  {
    title: 'Linux-Style File System Simulator',
    subtitle: 'Computer Science project',
    date: '2024-12-01',
    desc: 'Developed a tree-based file-system simulator with 13+ UNIX-style commands and evaluated linear probing, quadratic probing, and chaining for efficient file lookup.',
    tech: ['C++', 'Data Structures', 'Hash Tables', 'Linux'],
  },
];

export default data;
