import Image from 'next/image';
import React from 'react';

interface ThemePortraitProps {
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
}

/**
 * Theme-aware portrait component that swaps between light and dark mode images.
 * Uses CSS-based visibility toggling for instant switching without hydration mismatch.
 */
const ThemePortrait: React.FC<ThemePortraitProps> = ({
  width,
  height,
  priority = false,
  className = '',
}) => {
  return (
    <span className={`theme-portrait ${className}`}>
      <Image
        src="/images/me-light.jpg"
        alt="Michael D'Angelo"
        width={width}
        height={height}
        priority={priority}
        className="theme-portrait-light"
        loading={priority ? undefined : 'lazy'}
      />
      <Image
        src="/images/me-dark.jpg"
        alt="Michael D'Angelo"
        width={width}
        height={height}
        priority={priority}
        className="theme-portrait-dark"
        loading={priority ? undefined : 'lazy'}
      />
    </span>
  );
};

export default ThemePortrait;
