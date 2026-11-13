/**
 * A one-pixel article progress reading directly beneath the fixed header.
 *
 * The bar is drawn entirely by a CSS view timeline on the enclosing
 * `.post-page` (see `pages/writing.css`), so it renders no client JavaScript
 * and does no work on scroll.
 */
export default function ReadingProgress() {
  return (
    <div className="reading-progress" aria-hidden="true">
      <span className="reading-progress-indicator" />
    </div>
  );
}
