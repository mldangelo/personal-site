import { AUTHOR_NAME, SITE_IMAGE_PATH } from '@/lib/utils';

interface ThemePortraitProps {
  width: number;
  height: number;
  priority?: boolean;
}

/**
 * Portrait image component.
 *
 * Uses native <img> instead of next/image to:
 * - Avoid shipping next/image runtime for static export
 * - Reduce client-side JavaScript bundle
 */
export default function ThemePortrait({
  width,
  height,
  priority = false,
}: ThemePortraitProps) {
  return (
    <span className="theme-portrait">
      {/* biome-ignore lint/performance/noImgElement: Using native img to avoid next/image runtime overhead for static export */}
      <img
        src={SITE_IMAGE_PATH}
        alt={AUTHOR_NAME}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    </span>
  );
}
