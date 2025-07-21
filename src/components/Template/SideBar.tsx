'use client';

import React from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import ContactIcons from '../Contact/ContactIcons';

const SideBar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="w-[22rem] lg:w-full border border-gray-200 dark:border-gray-800">
      {/* Intro Section */}
      <section className="relative px-8 py-8 lg:text-center">
        <Link href="/" className="inline-block mb-6">
          <Image
            src="/images/me.jpg"
            alt="Michael D'Angelo"
            width={200}
            height={200}
            priority
            className="w-40 h-40 rounded-full object-cover"
          />
        </Link>
        <header>
          <h2 className="mb-3 text-2xl lg:text-xl font-heading font-bold leading-tight text-foreground-bold">
            Michael D&apos;Angelo
          </h2>
          <p className="text-sm lg:text-xs">
            <a href="mailto:michael@mldangelo.com" className="hover:underline">
              michael@mldangelo.com
            </a>
          </p>
        </header>
      </section>

      {/* Blurb Section */}
      <section className="px-8 py-8 border-t border-gray-200 dark:border-gray-800">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider">About</h2>
        <p className="mb-6 text-sm leading-relaxed">
          Hi, I&apos;m Michael. I am a{' '}
          <a href="https://icme.stanford.edu/" className="hover:underline">
            Stanford ICME
          </a>{' '}
          graduate, YC alumnus, and the co-founder and CTO of{' '}
          <a href="https://promptfoo.dev" className="hover:underline">
            Promptfoo
          </a>
          . Previously, I was VP of Engineering at{' '}
          <a href="https://usesmileid.com" className="hover:underline">
            SmileID
          </a>
          , co-founder and CTO of{' '}
          <a href="https://arthena.com" className="hover:underline">
            Arthena
          </a>
          , and co-founded{' '}
          <a href="https://matroid.com" className="hover:underline">
            Matroid
          </a>
          .
        </p>
        <div className="mt-4">
          {pathname && !pathname.includes('/resume') ? (
            <Link
              href="/resume"
              className="block text-center py-2 px-4 border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 text-sm"
            >
              Learn More
            </Link>
          ) : (
            <Link
              href="/about"
              className="block text-center py-2 px-4 border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 text-sm"
            >
              About Me
            </Link>
          )}
        </div>
      </section>

      {/* Footer Section */}
      <section className="px-8 py-8 border-t border-gray-200 dark:border-gray-800">
        <ContactIcons className="mb-6" />
        <p className="text-center text-xs uppercase tracking-wider text-gray-500 dark:text-gray-500">
          &copy; Michael D&apos;Angelo{' '}
          <Link href="/" className="hover:underline">
            mldangelo.com
          </Link>
          .
        </p>
      </section>
    </aside>
  );
};

export default SideBar;
