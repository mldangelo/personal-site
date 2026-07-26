import Link from 'next/link';

export default function References() {
  return (
    <div className="references">
      {/* The sticky index links to #references, so the section needs a
          heading to land on like every other one. */}
      <div className="title">
        <h2>References</h2>
      </div>
      <p className="text-sm text-[var(--color-fg-light)] text-center">
        References available upon request.{' '}
        <Link
          href="/contact"
          className="font-medium text-[var(--color-accent)] hover:text-[var(--color-fg-bold)] transition-colors duration-150"
        >
          Get in touch →
        </Link>
      </p>
    </div>
  );
}
