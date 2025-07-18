'use client';

import React, { ReactNode, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

interface ParallaxProps {
  children: ReactNode;
  speed?: number;
  offset?: number;
  className?: string;
  disabled?: boolean;
}

export const Parallax: React.FC<ParallaxProps> = ({
  children,
  speed = 0.5,
  offset = 0,
  className,
  disabled = false,
}) => {
  const [translateY, setTranslateY] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled || typeof window === 'undefined') return;

    const handleScroll = () => {
      if (!elementRef.current) return;

      const element = elementRef.current;
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate if element is in viewport
      const elementTop = rect.top;
      const elementBottom = rect.bottom;

      if (elementBottom >= 0 && elementTop <= windowHeight) {
        // Element is in viewport
        const scrolled = window.pageYOffset;
        const rate = scrolled * -speed;
        setTranslateY(rate + offset);
      }
    };

    // Initial calculation
    handleScroll();

    // Throttle scroll events for performance
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [speed, offset, disabled]);

  return (
    <div
      ref={elementRef}
      className={cn('will-change-transform', className)}
      style={{
        transform: disabled ? undefined : `translateY(${translateY}px)`,
      }}
    >
      {children}
    </div>
  );
};

// Specialized parallax components
export const ParallaxSection: React.FC<{
  children: ReactNode;
  className?: string;
  backgroundImage?: string;
  overlay?: boolean;
}> = ({ children, className, backgroundImage, overlay = true }) => {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      {backgroundImage && (
        <Parallax speed={0.3} className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              height: '120%',
              width: '100%',
            }}
          />
          {overlay && <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />}
        </Parallax>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export const ParallaxText: React.FC<{
  children: ReactNode;
  className?: string;
  speed?: number;
}> = ({ children, className, speed = 0.3 }) => {
  const { innerWidth } = typeof window !== 'undefined' ? window : { innerWidth: 1024 };
  const isMobile = innerWidth < 768;

  return (
    <Parallax
      speed={speed}
      disabled={isMobile} // Disable on mobile for performance
      className={className}
    >
      {children}
    </Parallax>
  );
};
