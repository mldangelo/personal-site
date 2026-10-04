import AboutContent from '@/components/About/Sections';
import { aboutMarkdown } from '@/data/about';

interface AboutSectionProps {
  headingLevel?: 'h1' | 'h2';
}

export default function AboutSection({
  headingLevel: Heading = 'h1',
}: AboutSectionProps) {
  return (
    <section className="about-page">
      <header className="about-header">
        <Heading className="page-title">About</Heading>
      </header>

      <div className="about-layout">
        <aside className="about-sidebar" aria-hidden="true">
          <figure className="about-sidebar-figure">
            <img
              src="/images/about/IMG_2445.jpg"
              alt="Hang Hang's hometown view"
            />
            <figcaption>Where I grew up — Shanghai.</figcaption>
          </figure>

          <figure className="about-sidebar-figure">
            <img
              src="/images/about/seafood-expo.jpg"
              alt="At the Boston Seafood Expo translating between my parents and clients"
            />
            <figcaption>
              Bilingual go-between for my parents and their clients at Seafood
              Expo North America (Boston).
            </figcaption>
          </figure>
        </aside>

        <div className="about-main">
          <AboutContent markdown={aboutMarkdown} />
        </div>
      </div>
    </section>
  );
}
