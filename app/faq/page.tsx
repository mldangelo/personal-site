'use client';

import React, { useState } from 'react';
import Main from '@/layouts/Main';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: 'General',
    question: 'What do you do?',
    answer: "I'm a data scientist and machine learning engineer with a passion for building scalable systems. I've worked on everything from satellite software to startup infrastructure, and I love tackling complex technical challenges.",
  },
  {
    category: 'General',
    question: 'Are you available for freelance work?',
    answer: "I occasionally take on interesting freelance projects. Feel free to reach out through the contact page if you have something specific in mind. I'm particularly interested in ML/AI projects and technical leadership roles.",
  },
  {
    category: 'General',
    question: 'What's your tech stack?',
    answer: "I work with a variety of technologies depending on the project. For ML/AI: Python, PyTorch, TensorFlow. For web: React, TypeScript, Next.js. For systems: Rust, Go, Docker, Kubernetes. I believe in choosing the right tool for the job.",
  },
  {
    category: 'Career',
    question: 'How did you get into machine learning?',
    answer: "I started with a background in physics and gradually transitioned into ML through research projects. The combination of mathematics, programming, and real-world impact drew me in. I've been working in the field professionally since 2016.",
  },
  {
    category: 'Career',
    question: 'What advice would you give to someone starting in tech?',
    answer: "Focus on fundamentals first - data structures, algorithms, and system design. Build projects that solve real problems. Contribute to open source. Most importantly, stay curious and never stop learning. The field evolves quickly, so adaptability is key.",
  },
  {
    category: 'Career',
    question: 'Do you mentor?',
    answer: "Yes, I enjoy mentoring and have mentored several engineers and data scientists. I typically mentor through structured programs or ongoing professional relationships. Check the contact page if you're interested in connecting.",
  },
  {
    category: 'Technical',
    question: 'What's your favorite programming language?',
    answer: "It depends on the context! Python for ML and data science, TypeScript for web development, and Rust for systems programming. Each has its strengths, and I enjoy working with all of them for different reasons.",
  },
  {
    category: 'Technical',
    question: 'How do you stay updated with technology trends?',
    answer: "I follow key researchers on Twitter, read papers on arXiv, participate in tech communities, and build side projects. I also attend conferences when possible and maintain a reading list of technical books and blogs.",
  },
  {
    category: 'Personal',
    question: 'What are your hobbies outside of tech?',
    answer: "I enjoy photography, hiking, and reading. I'm also interested in physics and astronomy - my undergraduate background. I find that having diverse interests helps with creativity and problem-solving in technical work.",
  },
  {
    category: 'Personal',
    question: 'Why did you create this website?',
    answer: "I wanted a central place to share my work, thoughts, and connect with others in the tech community. It's also a playground for trying new web technologies and design ideas. Plus, it's open source, so others can use it as a starting point for their own sites.",
  },
];

const categories = ['All', ...Array.from(new Set(faqs.map(faq => faq.category)))];

const FAQAccordion = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-gray-800">
      <button
        className="w-full py-6 flex justify-between items-center text-left hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-medium pr-8">{question}</span>
        <ChevronDownIcon
          className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 pb-6' : 'max-h-0'
        }`}
      >
        <p className="text-gray-600 dark:text-gray-400">{answer}</p>
      </div>
    </div>
  );
};

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredFAQs = selectedCategory === 'All'
    ? faqs
    : faqs.filter(faq => faq.category === selectedCategory);

  return (
    <Main>
      <article className="prose prose-gray dark:prose-invert max-w-none">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Common questions about my work, experience, and interests.
          </p>
        </header>

        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-3xl">
          {filteredFAQs.map((faq, index) => (
            <FAQAccordion key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        <section className="mt-16 p-8 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Can't find what you're looking for? Feel free to reach out directly.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
          >
            Get in touch →
          </a>
        </section>
      </article>
    </Main>
  );
}