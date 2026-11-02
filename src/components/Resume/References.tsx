import Link from 'next/link';

export default function References() {
  return (
    <div className="references">
      {/* The sticky index links to #references, so the section needs a
          heading to land on like every other one. */}
      <div className="section-header">
        <h2 className="section-heading">References</h2>
      </div>
      <p className="resume-note">
        References available upon request.{' '}
        <Link href="/contact">
          Get in touch{' '}
          {/* → for a link that stays on the site; ↗ is kept for one that
              leaves it. Decorative either way: the words name the link. */}
          <span className="resume-note-arrow" aria-hidden="true">
            →
          </span>
        </Link>
      </p>
    </div>
  );
}
