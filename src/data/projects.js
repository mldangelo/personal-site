// TODO Add a couple lines about each project
const data = [
  {
    title: 'Beta ISA(Instruction Set Architecture) using van Neuman Model',
    subtitle: 'ref. MIT 6.004 Copmutations Structures , Spring 2017 ',
    image: '/images/projects/beta-risc.jpg',
    date: '2021-06-20',
    link: 'https://github.com/pr-mittal/beta-risc',
    desc:
      'Built processor for a general purpose computer using CPU'
      + ' , Main memory and I/O devices where instructions follow 32-bit RISC (reduced instruction set computer) '
      + 'where memory access and operation are separated to provide better performance . '
      + 'Implementation of control operations include arithmetic , arithmetic constant , store , load , branching ,'
      + 'exceptions in Beta Architecture using General Purpose Register , PC and ALU . '
      + 'Run custom test cases by supplying .txt used initialize the Instruction and data memory',
  },
  {
    title: 'Hardware and Software abstraction of Computer',
    subtitle: 'ref. Nand2Tetris By Noam Nisan and Shimon Schocken',
    image: '/images/projects/personalcomputer.jpg',
    date: '2022-08-20',
    link: 'https://github.com/pr-mittal/PersonalComputer',
    desc:
      'ALU/CPU design and implementation using elementary logic gates and flip flops in HDL. '
      + 'Writing Assembler , VMTranslator and Compiler to parse Java like high level language responsible for converting bytecode to machine-specific code.'
      + ' Understanding Object-based design and programming, abstract data types, scoping rules, syntax and semantics, references',
  },
  {
    title: 'Verilog Implementation of Cryptography Block Ciphers',
    subtitle: 'AES128 Standard',
    image: '/images/projects/aes_128.jpg',
    date: '2021-04-30',
    link: 'https://github.com/pr-mittal/AES128_Verilog',
    desc:
      'Implemented and tested Advanced Encryption Standard 128 modes to encode and decode image . '
      + 'Used four different modes of operation of Data and Advanced Encryption Standard Algorithm . '
      + 'Created a python utility to convert binary files to images and vice versa. '
      + 'Cipher consisting of 16 byte input with 10 rounds and 16 byte key . '
      + 'Implemented Electronic Code Book Mode ,Cipher Block Chaining Mode , Cipher Feedback Mode and Output Feedback Mode',
  },
  {
    title: 'Designing Self Balancing Platform using Control System and Opencv',
    subtitle: 'e-Yantra,IIT Bombay',
    image: '/images/projects/eyantra.png',
    date: '2021-01-15',
    link: 'https://github.com/pr-mittal/eYantra-Nirikshak-Bot',
    desc:
      'Designed Ball Balance Platforms with mazes on top , such that colored balls navigate through them in a stipulated amount of time thus ensuring Platforms Quality.'
      + 'Reached Final Task /Task 6 , score of top 15 out of starting 400+ teams. '
      + 'Behaviour modelling of objects in a physics engine based simulator. '
      + 'Designed an optimised Gain scheduling based PID Controller . '
      + 'Used python multiprocessing and opencv on input maze images and construct them on the platforms and ball detection to provide feedback to PID controller . '
      + 'Used Dijkstra’s algorithm to find the shortest path with minimum turns',
  },
  {
    title: 'PHY and MAC packet transmission modelling',
    subtitle: 'MATLAB Network Capacity Calculation Model',
    image: '/images/projects/telecommunication.jpg',
    date: '2022-04-01',
    link: 'https://github.com/pr-mittal/Telecommunication-Network',
    desc:
      'Simulation of source-encoder-channel pipeline for video input in MATLAB . '
      + 'Modelled Data Packet for 802.11 specification and crc for checking successful transmission . '
      + 'Modulation and Demodulation schemes for packet transmission through OFDM were used to compare performance and signal noise at receiver',
  },
];

export default data;
