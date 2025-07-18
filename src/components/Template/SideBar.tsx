'use client';

import React from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Parallax } from '@/components/common/Parallax';
import { Button } from '@/components/ui/button';

import ContactIcons from '../Contact/ContactIcons';

const SideBar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="w-[22rem] lg:w-full glass glass-border relative overflow-hidden">
      {/* Parallax background gradient */}
      <Parallax speed={-0.2} className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/5" />
        {/* Floating orbs for depth */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl" />
      </Parallax>

      {/* Intro Section */}
      <section className="relative px-8 py-8 lg:text-center">
        <Link href="/" className="inline-block mb-6 group">
          <Image
            src="/images/me.jpg"
            alt="Michael D'Angelo"
            width={200}
            height={200}
            priority
            className="w-40 h-40 rounded-full object-cover shadow-lg group-hover:shadow-xl transition-shadow duration-300"
          />
        </Link>
        <header>
          <h2 className="mb-3 text-2xl lg:text-xl font-heading font-bold leading-tight text-foreground-bold">
            Michael D&apos;Angelo
          </h2>
          <p className="text-sm lg:text-xs">
            <a
              href="mailto:michael@mldangelo.com"
              className="text-foreground hover:text-accent transition-colors duration-200"
            >
              michael@mldangelo.com
            </a>
          </p>
        </header>
      </section>

      {/* Blurb Section */}
      <section className="px-8 py-8 border-t border-border/50">
        <h2 className="mb-4 text-sm font-heading font-bold uppercase tracking-wider text-foreground-bold">
          About
        </h2>
        <p className="mb-6 text-sm leading-relaxed text-foreground">
          Hi, I&apos;m Michael. I am a{' '}
          <a
            href="https://icme.stanford.edu/"
            className="text-foreground hover:text-accent transition-colors"
          >
            Stanford ICME
          </a>{' '}
          graduate, YC alumnus, and the co-founder and CTO of{' '}
          <a
            href="https://promptfoo.dev"
            className="text-foreground hover:text-accent transition-colors"
          >
            Promptfoo
          </a>
          . Previously, I was VP of Engineering at{' '}
          <a
            href="https://usesmileid.com"
            className="text-foreground hover:text-accent transition-colors"
          >
            SmileID
          </a>
          , co-founder and CTO of{' '}
          <a
            href="https://arthena.com"
            className="text-foreground hover:text-accent transition-colors"
          >
            Arthena
          </a>
          , and co-founded{' '}
          <a
            href="https://matroid.com"
            className="text-foreground hover:text-accent transition-colors"
          >
            Matroid
          </a>
          .
        </p>
        <div className="mt-4">
          {pathname && !pathname.includes('/resume') ? (
            <Button
              variant="outline"
              asChild
              className="w-full uppercase tracking-wide h-auto py-3 px-6 rounded-lg font-heading font-medium text-sm border-border hover:border-accent hover:text-accent hover:bg-accent/5 transition-all duration-200"
            >
              <Link href="/resume">Learn More</Link>
            </Button>
          ) : (
            <Button
              variant="outline"
              asChild
              className="w-full uppercase tracking-wide h-auto py-3 px-6 rounded-lg font-heading font-medium text-sm border-border hover:border-accent hover:text-accent hover:bg-accent/5 transition-all duration-200"
            >
              <Link href="/about">About Me</Link>
            </Button>
          )}
        </div>
      </section>

      {/* Footer Section */}
      <section className="px-8 py-8 border-t border-border/50">
        <ContactIcons className="mb-6" />
        <p className="text-center text-xs uppercase tracking-wider font-heading text-muted-foreground">
          &copy; Michael D&apos;Angelo{' '}
          <Link
            href="/"
            className="text-muted-foreground hover:text-accent transition-colors duration-200"
          >
            mldangelo.com
          </Link>
          .
        </p>
      </section>
    </aside>
  );
};

export default SideBar;
