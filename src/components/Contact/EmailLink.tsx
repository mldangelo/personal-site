'use client';

import { useEffect, useState } from 'react';

import profile from '@/data/profile.json';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';

const TICK_MS = 50;
const HOLD_TICKS = 50;
const [LOCAL_PART, DOMAIN] = profile.email.split('@');
const messages = [
  LOCAL_PART,
  'hello',
  'hola',
  'you-can-email-me-at-literally-anything! Really',
  'well, not anything. But most things',
  'like-this',
  'or-this',
  'but not this :(  ',
  'you.can.also.email.me.with.specific.topics.like',
  'just-saying-hi',
  'please-work-for-us',
  'help',
  'admin',
  'or-I-really-like-your-website',
  'thanks',
];
function EmailText({ prefix }: { prefix: string }) {
  return (
    <>
      <span className="contact-email-prefix">{prefix}</span>
      <wbr />
      <span className="contact-email-domain">@{DOMAIN}</span>
    </>
  );
}

export default function EmailLink({
  loopMessage = false,
}: {
  loopMessage?: boolean;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [frame, setFrame] = useState({ index: 0, char: LOCAL_PART.length });
  const finished = frame.index === messages.length;
  const paused = hovered || focused || reducedMotion;

  useEffect(() => {
    if (paused || finished) return;

    const id = setInterval(() => {
      setFrame(({ index, char }) => {
        if (index === messages.length) return { index, char };
        if (char < messages[index].length + HOLD_TICKS) {
          return { index, char: char + 1 };
        }
        const next = index + 1;
        return next === messages.length && loopMessage
          ? { index: 0, char: LOCAL_PART.length }
          : { index: next, char: 1 };
      });
    }, TICK_MS);
    return () => clearInterval(id);
  }, [paused, finished, loopMessage]);

  // Let the gag play, but reveal a usable address when the visitor engages
  // with it, when motion is disabled, and once the sequence finishes.
  const prefix =
    paused || finished
      ? LOCAL_PART
      : messages[frame.index].slice(0, frame.char);

  return (
    <div className="contact-email-container">
      <a
        href={`mailto:${profile.email}`}
        aria-label={profile.email}
        className="contact-email-link"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        {/* The hidden aliases share one grid cell and reserve their tallest
            wrapped height at any font size. They are never selectable or announced. */}
        <span className="contact-email-sizer" aria-hidden="true">
          {messages.map((message) => (
            <span key={message} className="contact-email-text">
              <EmailText prefix={message} />
            </span>
          ))}
        </span>
        <span className="contact-email-text" aria-hidden="true">
          <EmailText prefix={prefix} />
        </span>
      </a>
    </div>
  );
}
