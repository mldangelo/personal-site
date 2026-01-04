import Image from 'next/image';

interface ThemePortraitProps {
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
}

/**
 * Theme-aware portrait component that swaps between light and dark mode images.
 * Uses CSS-based visibility toggling for instant switching without hydration mismatch.
 *
 * Note: Both images are loaded to enable instant theme switching without flash.
 * This is an intentional trade-off for a better UX on theme toggle.
 */
export default function ThemePortrait({
  width,
  height,
  priority = false,
  className = '',
}: ThemePortraitProps) {
  return (
    <span className={`theme-portrait ${className}`}>
      <Image
        src="/images/me-light.jpg"
        alt="Michael D'Angelo"
        width={width}
        height={height}
        priority={priority}
        className="theme-portrait-light"
      />
      <Image
        src="/images/me-dark.jpg"
        alt="Michael D'Angelo"
        width={width}
        height={height}
        priority={priority}
        className="theme-portrait-dark"
      />
    </span>
  );
}
