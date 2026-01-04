interface ThemePortraitProps {
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
}

/**
 * Theme-aware portrait that swaps between light and dark mode images.
 *
 * Uses native <img> instead of next/image to:
 * - Avoid shipping next/image runtime for static export
 * - Reduce client-side JavaScript bundle
 *
 * CSS visibility toggling handles instant theme switching.
 * Non-visible image uses lazy loading to defer download until needed.
 */
export default function ThemePortrait({
  width,
  height,
  priority = false,
  className = '',
}: ThemePortraitProps) {
  return (
    <span className={`theme-portrait ${className}`}>
      {/* biome-ignore lint/performance/noImgElement: Using native img to avoid next/image runtime overhead for static export */}
      <img
        src="/images/me-light.jpg"
        alt="Michael D'Angelo"
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className="theme-portrait-light"
      />
      {/* biome-ignore lint/performance/noImgElement: Using native img to avoid next/image runtime overhead for static export */}
      <img
        src="/images/me-dark.jpg"
        alt=""
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className="theme-portrait-dark"
        aria-hidden="true"
      />
    </span>
  );
}
