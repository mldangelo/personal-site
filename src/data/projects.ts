export interface ProjectReport {
  href: string;
  label?: string;
}

export interface Project {
  title: string;
  subtitle?: string;
  link?: string;
  image: string;
  date: string;
  desc: string;
  tech?: string[];
  featured?: boolean;
  reports?: ProjectReport[];
}

const data: Project[] = [
  {
    title: '4-Layer PCB – Thevenin Resistance Instrument',
    image: '/images/projects/thevenin-instrument.jpg',
    date: '2026-05-01',
    desc: 'Designed a 4-layer Arduino Uno shield in Altium to measure Thevenin resistance across 20 current steps using a DAC, op-amp feedback loop, and ADC over I2C. Simulated and verified analog subsystems including MOSFET-driven electronic load, voltage dividers, and sense resistor circuitry in SPICE. Debugged full system bring-up using oscilloscopes and test points, resolving component orientation errors and an ADC footprint mismatch to achieve consistent measurements from 12mA to 251mA.',
    tech: ['Altium', 'Arduino', 'SPICE', 'I2C'],
    featured: true,
  },
  {
    title: 'PCB Design – Golden Arduino',
    image: '/images/projects/golden-arduino.jpg',
    date: '2026-05-01',
    desc: 'Designed a custom ATmega328P-based Arduino in Altium with signal integrity best practices: minimized cross-unders, decoupling capacitors at every VCC pin, ferrite bead LC filter, and a continuous ground plane. Bootloaded and characterized the board against a commercial Arduino Uno, achieving 2x faster rise times and 10x lower near-field emissions on the 5V rail. Debugged a solder bridge under the ATmega and resolved bootloading failure through systematic signal probing.',
    tech: ['Altium', 'ATmega328P', 'PCB Design'],
    featured: true,
  },
  {
    title: 'Embedded Software Blackjack Game System',
    image: '/images/projects/blackjack-stm32.jpg',
    date: '2025-12-01',
    desc: 'Developed an embedded casino-style game system in C for an STM32 microcontroller featuring a fully playable Blackjack game with real-time LCD graphics, interactive button controls, randomized card generation, and dynamic balance tracking. Implemented game-state management, recursive gameplay logic, hidden dealer card behavior, and betting mechanics with a custom cheat-code detection sequence using timed push-button interrupts.',
    tech: ['C', 'STM32', 'Embedded Systems'],
  },
  {
    title: 'Electronics Design Lab Robot',
    subtitle: 'Electrical Engineer',
    image: '/images/projects/edl-robot.jpg',
    date: '2025-05-01',
    desc: 'Designed and implemented a Bluetooth-controlled mobile robot utilizing the HC-05 module for reliable wireless communication. Simulated and verified analog subsystems in SPICE, including dual DC motor models, compensator circuits, and a BJT-based H-bridge for bidirectional control. Programmed an interrupt-driven position control system on the Arduino Nano Every with encoder pulse feedback for closed-loop control and millimeter positional precision.',
    tech: ['Arduino', 'Bluetooth', 'SPICE', 'HC-05'],
  },
  {
    title: 'RF & IR Robot',
    subtitle: 'Lead Electrical Engineer',
    image: '/images/projects/rf-ir-robot.jpg',
    date: '2024-12-01',
    desc: 'Led a four-person team in designing and building a robot controllable via radio frequency or infrared signals, featuring autonomous motion and hardware-based control switching. Designed PCB schematics to integrate Arduino and modular connectors, and programmed microcontroller logic for dual-mode RF/IR control with reliable switching through a hardware interface.',
    tech: ['Arduino', 'PCB Design', 'RF', 'IR'],
  },
  {
    title: 'File System Simulator',
    image: '/images/projects/filesystem-simulator.jpg',
    date: '2024-12-01',
    desc: 'Developed a Linux-style file system simulator using a tree data structure to represent files and directories. Implemented 13+ commands (mkdir, cd, search, etc.) to mimic UNIX operations, with an optimized hash table for file lookups comparing linear and quadratic probing and chaining.',
    tech: ['C++', 'Data Structures', 'Hash Tables'],
  },
];

export default data;
