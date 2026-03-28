import ThemePortrait from './ThemePortrait';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-header">
        <div className="hero-avatar">
          <ThemePortrait width={56} height={56} priority />
        </div>
        <h1 className="hero-name">Michael D&apos;Angelo</h1>
      </div>
      <p className="hero-tagline">
        Member of the Technical Staff at <a href="https://openai.com">OpenAI</a>
        , where I work on <a href="https://promptfoo.dev">Promptfoo</a> and
        agent security. Previously co-founded, scaled, and sold Promptfoo to
        OpenAI.
      </p>
    </section>
  );
}
