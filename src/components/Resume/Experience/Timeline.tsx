'use client';

import React, { useState } from 'react';

import { faBriefcase, faCalendar, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';

import type { Position } from '@/data/resume/work';
import { useMobileDetection } from '@/hooks/useMobileDetection';

interface TimelineProps {
  data: Position[];
}

interface TimelineItemProps {
  job: Position;
  isActive: boolean;
  isLast: boolean;
  onClick: () => void;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ job, isActive, isLast, onClick }) => {
  const isPresent = !job.endDate;

  return (
    <div className="relative flex items-start group">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-4 top-8 w-0.5 h-full bg-gradient-to-b from-accent/30 to-accent/10" />
      )}

      {/* Timeline dot */}
      <button
        onClick={onClick}
        className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
          isActive
            ? 'bg-accent scale-125 shadow-lg shadow-accent/30'
            : 'bg-background border-2 border-accent/30 hover:border-accent hover:scale-110'
        }`}
        aria-label={`View details for ${job.position} at ${job.name}`}
      >
        <FontAwesomeIcon
          icon={faBriefcase}
          className={`w-3 h-3 transition-all duration-300 ${
            isActive ? 'text-white' : 'text-accent/50 group-hover:text-accent'
          }`}
        />
        {isPresent && <div className="absolute inset-0 rounded-full animate-ping bg-accent/30" />}
      </button>

      {/* Timeline content */}
      <div
        className={`ml-6 pb-8 cursor-pointer transition-all duration-300 ${
          isActive ? 'opacity-100' : 'opacity-60 hover:opacity-80'
        }`}
        onClick={onClick}
      >
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`text-sm font-medium px-2 py-0.5 rounded-full transition-colors flex items-center gap-1.5 ${
              isActive ? 'bg-accent text-white' : 'bg-accent/10 text-accent'
            }`}
          >
            <FontAwesomeIcon icon={faCalendar} className="w-3 h-3" />
            {dayjs(job.startDate).format('MMM YYYY')} -{' '}
            {job.endDate ? dayjs(job.endDate).format('MMM YYYY') : 'Present'}
          </span>
          {isPresent && (
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">Current</span>
          )}
        </div>
        <h4
          className={`text-lg font-semibold transition-colors ${
            isActive ? 'text-foreground-bold' : 'text-foreground'
          }`}
        >
          {job.position}
        </h4>
        <p className="text-muted-foreground">{job.name}</p>
      </div>
    </div>
  );
};

const Timeline: React.FC<TimelineProps> = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { isMobile } = useMobileDetection();
  const activeJob = data[activeIndex];

  return (
    <div className={`${isMobile ? 'space-y-6' : 'grid lg:grid-cols-[300px_1fr] gap-8'}`}>
      {/* Timeline */}
      <div className="relative">
        <div className="sticky top-24">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-6">
            Career Timeline
          </h4>
          <div className="space-y-0">
            {data.map((job, index) => (
              <TimelineItem
                key={`${job.name}-${job.position}`}
                job={job}
                isActive={index === activeIndex}
                isLast={index === data.length - 1}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Active job details */}
      <div className="relative">
        <div
          className="p-8 rounded-2xl glass glass-border glass-shadow transition-all duration-500"
          key={`${activeJob.name}-${activeJob.position}`}
        >
          {/* Glassmorphism shine effect */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
            <div className="absolute -inset-full top-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-45 translate-x-full animate-shine" />
          </div>

          <header className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-foreground-bold mb-2">
                  {activeJob.position}
                </h3>
                <a
                  href={activeJob.url}
                  className="text-lg text-accent hover:text-accent-hover transition-colors inline-flex items-center gap-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {activeJob.name}
                  <FontAwesomeIcon icon={faExternalLinkAlt} className="w-3 h-3" />
                </a>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">
                  {dayjs(activeJob.startDate).format('MMMM YYYY')} -{' '}
                  {activeJob.endDate ? dayjs(activeJob.endDate).format('MMMM YYYY') : 'Present'}
                </div>
                <div className="text-sm font-medium text-accent mt-1">
                  {activeJob.endDate
                    ? `${Math.round((new Date(activeJob.endDate).getTime() - new Date(activeJob.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30))} months`
                    : 'Ongoing'}
                </div>
              </div>
            </div>
          </header>

          {activeJob.summary && (
            <div className="mb-6">
              <p className="text-foreground leading-relaxed">{activeJob.summary}</p>
            </div>
          )}

          {activeJob.highlights && activeJob.highlights.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Key Achievements
              </h4>
              <ul className="space-y-2">
                {activeJob.highlights.map((highlight, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-foreground animate-fadeIn"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-accent mt-2" />
                    <span className="leading-relaxed">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
