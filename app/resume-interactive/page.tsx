'use client';

import React, { useState } from 'react';
import { positions, skills, courses, degrees } from '@/data/resume';

interface SkillCategory {
  name: string;
  skills: typeof skills;
}

export default function InteractiveResumePage() {
  const [expandedSection, setExpandedSection] = useState<string | null>('experience');
  const [selectedSkillCategory, setSelectedSkillCategory] = useState<string>('All');
  const [experienceFilter, setExperienceFilter] = useState<string>('all');

  // Group skills by category
  const skillCategories: SkillCategory[] = [
    { name: 'Languages', skills: skills.filter(s => s.category.includes('Languages')) },
    { name: 'Frameworks', skills: skills.filter(s => s.category.includes('Javascript') || s.category.includes('Python')) },
    { name: 'Databases', skills: skills.filter(s => s.category.includes('Databases')) },
    { name: 'Machine Learning', skills: skills.filter(s => s.category.includes('Data Science') || s.category.includes('Machine Learning')) },
    { name: 'Tools', skills: skills.filter(s => s.category.includes('Tools')) },
  ];

  const filteredSkills = selectedSkillCategory === 'All' 
    ? skills 
    : skillCategories.find(c => c.name === selectedSkillCategory)?.skills || [];

  const filteredPositions = experienceFilter === 'all'
    ? positions
    : positions.filter(p => {
        if (experienceFilter === 'leadership') return p.title.includes('CTO') || p.title.includes('Founder');
        if (experienceFilter === 'engineering') return p.title.includes('Engineer') || p.title.includes('Developer');
        if (experienceFilter === 'recent') return new Date(p.startDate) > new Date('2020-01-01');
        return true;
      });

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <main className="px-6 py-16 sm:px-12 lg:px-16">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-3xl font-semibold mb-4">Interactive Resume</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Explore my experience interactively. Click sections to expand, filter by categories, and discover more details.
          </p>
        </div>

        {/* Section Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 sticky top-16 bg-white dark:bg-black py-4 z-10">
          {['experience', 'skills', 'education', 'achievements'].map((section) => (
            <button
              key={section}
              onClick={() => toggleSection(section)}
              className={`px-6 py-2 rounded-lg transition-all ${
                expandedSection === section
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-black'
                  : 'glass hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </div>

        {/* Experience Section */}
        {expandedSection === 'experience' && (
          <section className="animate-fade-in">
            <h2 className="text-2xl font-semibold mb-6">Experience</h2>
            
            {/* Filters */}
            <div className="flex gap-2 mb-6">
              {['all', 'leadership', 'engineering', 'recent'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setExperienceFilter(filter)}
                  className={`px-4 py-1 text-sm rounded-full transition-all ${
                    experienceFilter === filter
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>

            <div className="space-y-6">
              {filteredPositions.map((position, index) => (
                <div
                  key={index}
                  className="glass rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => {
                    // Could expand to show more details
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {position.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        <a href={position.url} className="hover:underline" target="_blank" rel="noopener noreferrer">
                          {position.company}
                        </a>
                      </p>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {position.startDate} - {position.endDate || 'Present'}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">{position.summary}</p>
                  <ul className="space-y-1">
                    {position.highlights.slice(0, 3).map((highlight, i) => (
                      <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                  {position.highlights.length > 3 && (
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                      +{position.highlights.length - 3} more achievements
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {expandedSection === 'skills' && (
          <section className="animate-fade-in">
            <h2 className="text-2xl font-semibold mb-6">Skills</h2>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setSelectedSkillCategory('All')}
                className={`px-4 py-1 text-sm rounded-full transition-all ${
                  selectedSkillCategory === 'All'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                All
              </button>
              {skillCategories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedSkillCategory(cat.name)}
                  className={`px-4 py-1 text-sm rounded-full transition-all ${
                    selectedSkillCategory === cat.name
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {cat.name} ({cat.skills.length})
                </button>
              ))}
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSkills.map((skill) => (
                <div
                  key={skill.title}
                  className="glass rounded-lg p-4 hover:shadow-lg transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{skill.title}</h3>
                    <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800">
                      {skill.competency}%
                    </span>
                  </div>
                  
                  {/* Competency Bar */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                      style={{ width: `${skill.competency}%` }}
                    />
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {skill.category.join(' • ')}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education Section */}
        {expandedSection === 'education' && (
          <section className="animate-fade-in">
            <h2 className="text-2xl font-semibold mb-6">Education</h2>
            
            <div className="space-y-6">
              {degrees.map((degree, index) => (
                <div key={index} className="glass rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-2">{degree.degree}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {degree.school} • {degree.year}
                  </p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Selected Coursework</h4>
                    <div className="flex flex-wrap gap-2">
                      {courses
                        .filter(c => c.university === degree.school)
                        .slice(0, 6)
                        .map((course) => (
                          <span
                            key={course.number}
                            className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded-full"
                          >
                            {course.title}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Achievements Section */}
        {expandedSection === 'achievements' && (
          <section className="animate-fade-in">
            <h2 className="text-2xl font-semibold mb-6">Key Achievements</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass rounded-lg p-6">
                <div className="text-3xl mb-3">🚀</div>
                <h3 className="text-lg font-semibold mb-2">Scaled to 170M Users</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Built biometric infrastructure processing 10k QPS across 8 African countries
                </p>
              </div>
              
              <div className="glass rounded-lg p-6">
                <div className="text-3xl mb-3">🛡️</div>
                <h3 className="text-lg font-semibold mb-2">125k+ Developers</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Open-source LLM security tools used by major enterprises worldwide
                </p>
              </div>
              
              <div className="glass rounded-lg p-6">
                <div className="text-3xl mb-3">🛰️</div>
                <h3 className="text-lg font-semibold mb-2">Launched Satellite</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Built and launched nanosatellite that operated for 2+ years in orbit
                </p>
              </div>
              
              <div className="glass rounded-lg p-6">
                <div className="text-3xl mb-3">💰</div>
                <h3 className="text-lg font-semibold mb-2">$50M+ in Exits</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Technical leadership in multiple successful acquisitions and funding rounds
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Download Traditional Resume */}
        <div className="mt-12 text-center">
          <a
            href="/resume.pdf"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download PDF Resume
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </main>
  );
}