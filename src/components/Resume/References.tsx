import Link from 'next/link';

export default function References() {
  return (
    <div className="references">
      <div className="link-to" id="references" />
      <div className="title">
        <Link href="/contact">
          <h3>References are available upon request</h3>
        </Link>
      </div>
    </div>
  );
}
