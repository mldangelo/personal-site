import React from 'react';

import type { Metadata } from 'next';
import Link from 'next/link';

import { faGithub } from '@fortawesome/free-brands-svg-icons';
import {
  faArrowRight,
  faBriefcase,
  faChartLine,
  faCode,
  faEnvelope,
  faFileAlt,
  faGraduationCap,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const metadata: Metadata = {
  description:
    "Michael D'Angelo is a data scientist, machine learning engineer, and full-stack engineer.",
};

export default function HomePage() {
  return (
    <>
      {/* Enhanced Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden bg-gray-50 dark:bg-gray-950">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

        {/* Gradient Orbs */}
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-80 h-80 bg-primary/30 rounded-full blur-3xl opacity-20 dark:opacity-10" />
        <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-80 h-80 bg-accent/30 rounded-full blur-3xl opacity-20 dark:opacity-10" />

        {/* Noise Texture */}
        <div className="absolute inset-0 opacity-50 mix-blend-soft-light">
          <svg width="100%" height="100%">
            <filter id="noiseFilter">
              <feTurbulence
                type="turbulence"
                baseFrequency="0.9"
                numOctaves="4"
                stitchTiles="stitch"
              />
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter)" opacity="0.05" />
          </svg>
        </div>
      </div>

      <div className="min-h-screen flex flex-col">
        {/* Hero Section - Fixed spacing and alignment */}
        <section className="flex-1 flex items-center px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-0">
          <div className="w-full max-w-7xl mx-auto">
            <div className="lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-16 lg:items-center">
              {/* Left Content */}
              <div className="lg:col-span-7">
                <div className="max-w-2xl animate-fade-up">
                  {/* Status Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500 text-white text-sm font-semibold mb-8 shadow-lg shadow-green-500/25 animate-fade-in animation-delay-200">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                    </span>
                    Available for new projects
                  </div>

                  {/* Name with proper spacing */}
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-8">
                    <span className="block text-gray-900 dark:text-white">Michael</span>
                    <span className="block text-primary dark:text-primary-light -mt-2">
                      D&apos;Angelo
                    </span>
                  </h1>

                  {/* Enhanced Tagline */}
                  <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed mb-10">
                    Data scientist & ML engineer crafting{' '}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      intelligent solutions
                    </span>{' '}
                    at the intersection of{' '}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      data, design, and code
                    </span>
                    .
                  </p>

                  {/* Social Proof - Fixed spacing and colors */}
                  <div className="flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-3 text-sm text-gray-600 dark:text-gray-400 mb-12">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={faBriefcase}
                        className="w-4 h-4 text-gray-500 dark:text-gray-500"
                      />
                      <span>Ex-Meta, Stanford ICME</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={faGraduationCap}
                        className="w-4 h-4 text-gray-500 dark:text-gray-500"
                      />
                      <span>MS Computer Science</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={faCode}
                        className="w-4 h-4 text-gray-500 dark:text-gray-500"
                      />
                      <span>10+ years experience</span>
                    </div>
                  </div>

                  {/* CTA Buttons - Consistent styling */}
                  <div className="flex flex-col sm:flex-row gap-4 animate-fade-up animation-delay-300">
                    <Link
                      href="/projects"
                      className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-xl text-white bg-primary hover:bg-primary-dark shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                      View My Work
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
                      />
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-xl text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-all duration-200"
                    >
                      Get In Touch
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Stats/Highlights - Fixed spacing and alignment */}
              <div className="mt-12 sm:mt-16 lg:mt-0 lg:col-span-5 animate-fade-up animation-delay-400">
                <div className="relative">
                  {/* Personal Monogram - Better positioning */}
                  <div className="absolute -top-12 -right-12 lg:-top-8 lg:-right-8 opacity-5 dark:opacity-[0.02] pointer-events-none">
                    <svg
                      width="240"
                      height="240"
                      viewBox="0 0 100 100"
                      className="text-gray-900 dark:text-white"
                    >
                      <text
                        x="50"
                        y="70"
                        fontSize="60"
                        fontWeight="900"
                        textAnchor="middle"
                        fill="currentColor"
                        fontFamily="system-ui"
                      >
                        MD
                      </text>
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>

                  {/* Stats Grid - Consistent spacing */}
                  <div className="space-y-4 relative z-10">
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-5 sm:p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-baseline justify-between mb-2">
                        <div className="text-3xl font-black text-gray-900 dark:text-white">
                          120K+
                        </div>
                        <div className="text-sm font-medium text-green-600 dark:text-green-400">
                          +15% YoY
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Lines of production code
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div className="bg-white dark:bg-gray-900 rounded-xl p-4 sm:p-5 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-xl font-bold text-gray-900 dark:text-white">Meta</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          Ex-Engineer
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-900 rounded-xl p-4 sm:p-5 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-xl font-bold text-gray-900 dark:text-white">
                          Stanford
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          MS CS, ICME
                        </div>
                      </div>
                    </div>

                    <div className="bg-primary dark:bg-primary-light text-white dark:text-gray-900 rounded-xl p-4 sm:p-5 text-center shadow-lg shadow-primary/20">
                      <div className="text-sm font-medium opacity-90">Currently</div>
                      <div className="text-base font-bold">Building ML Infrastructure</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid Section - Fixed spacing and styling */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 bg-white/50 dark:bg-black/50 backdrop-blur-sm border-t border-gray-100 dark:border-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-fr lg:grid-rows-2">
              {/* Resume - Large Card */}
              <Link
                href="/resume"
                className="group relative lg:col-span-2 lg:row-span-2 overflow-hidden rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 sm:p-8 transition-all duration-300 hover:shadow-xl hover:border-gray-300 dark:hover:border-gray-700 flex flex-col min-h-[300px]"
              >
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-primary/5 dark:bg-primary/10 rounded-full blur-2xl" />
                <div className="relative flex-1 flex flex-col">
                  <div className="w-14 h-14 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center mb-6">
                    <FontAwesomeIcon
                      icon={faFileAlt}
                      className="w-7 h-7 text-primary dark:text-primary-light"
                    />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Professional Resume
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-8 flex-1">
                    10+ years crafting ML solutions at Meta, Stanford, and Silicon Valley startups.
                    MS Computer Science, published researcher.
                  </p>
                  <div className="inline-flex items-center text-primary dark:text-primary-light font-medium group/link">
                    <span className="border-b border-transparent group-hover/link:border-primary dark:group-hover/link:border-primary-light transition-colors">
                      View Full Resume
                    </span>
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                </div>
              </Link>

              {/* Projects */}
              <Link
                href="/projects"
                className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 sm:p-6 transition-all duration-300 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-700 flex flex-col min-h-[160px]"
              >
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4">
                  <FontAwesomeIcon
                    icon={faCode}
                    className="w-6 h-6 text-purple-600 dark:text-purple-400"
                  />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Projects</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1 leading-relaxed">
                  Open source contributions & client work
                </p>
                <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                  <span>12 featured projects</span>
                  <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3" />
                </div>
              </Link>

              {/* Stats */}
              <Link
                href="/stats"
                className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 sm:p-6 transition-all duration-300 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-700 flex flex-col min-h-[160px]"
              >
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4">
                  <FontAwesomeIcon
                    icon={faChartLine}
                    className="w-6 h-6 text-green-600 dark:text-green-400"
                  />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Statistics</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1 leading-relaxed">
                  Performance & visitor insights
                </p>
                <div className="text-xs font-semibold text-green-600 dark:text-green-400 flex items-center gap-1">
                  <span>Live dashboard</span>
                  <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3" />
                </div>
              </Link>

              {/* Contact - Wide Card */}
              <Link
                href="/contact"
                className="group relative lg:col-span-2 overflow-hidden rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 p-5 sm:p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] flex items-center min-h-[140px]"
              >
                <div className="flex-1">
                  <div className="w-12 h-12 bg-white/10 dark:bg-gray-900/10 rounded-xl flex items-center justify-center mb-4">
                    <FontAwesomeIcon icon={faEnvelope} className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2">Let&apos;s Work Together</h3>
                  <p className="text-sm opacity-90 leading-relaxed">
                    Available for freelance projects and consulting
                  </p>
                </div>
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="w-5 h-5 sm:w-6 sm:h-6 opacity-50 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300"
                />
              </Link>
            </div>

            {/* GitHub Link - Properly styled */}
            <div className="mt-12 sm:mt-16 text-center">
              <a
                href="https://github.com/mldangelo/personal-site"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-xl transition-all duration-200"
              >
                <FontAwesomeIcon icon={faGithub} className="w-4 h-4" />
                <span>View source on GitHub</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
