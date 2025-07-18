'use client';

import React, { useState } from 'react';

import { ParallaxText } from '@/components/common/Parallax';
import { ScrollAnimation } from '@/components/common/ScrollAnimation';
import type { Position } from '@/data/resume/work';

import Job from './Experience/Job';
import Timeline from './Experience/Timeline';

interface ExperienceProps {
  data: Position[];
}

const Experience: React.FC<ExperienceProps> = ({ data }) => {
  const [view, setView] = useState<'classic' | 'timeline'>('timeline');

  return (
    <div className="mb-16">
      <div className="link-to" id="experience" />
      <ScrollAnimation animation="slideUp">
        <div className="mb-10 flex items-center justify-between">
          <ParallaxText speed={0.2}>
            <div>
              <h3 className="text-4xl font-heading font-bold text-foreground-bold mb-2">
                Experience
              </h3>
              <div className="h-1 w-20 bg-gradient-to-r from-accent to-accent/50 rounded-full" />
            </div>
          </ParallaxText>
          <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-1">
            <button
              onClick={() => setView('timeline')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                view === 'timeline'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => setView('classic')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                view === 'classic'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Classic
            </button>
          </div>
        </div>
      </ScrollAnimation>

      {view === 'classic' ? (
        <ScrollAnimation animation="stagger" className="space-y-8">
          {data.map((job) => (
            <Job data={job} key={`${job.name}-${job.position}`} />
          ))}
        </ScrollAnimation>
      ) : (
        <ScrollAnimation animation="slideUp" delay={200}>
          <Timeline data={data} />
        </ScrollAnimation>
      )}
    </div>
  );
};

export default Experience;
