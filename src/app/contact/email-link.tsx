'use client';

import { useState } from 'react';
import useInterval from '@/hooks/use-interval';

const MESSAGES = ['hi', 'hello', 'hola'];
/** Ticks to hold a completed message before starting the next one. */
const HOLD = 50;
/** Tick length in ms. */
const DELAY = 50;

interface EmailLinkProps {
  /** Restart from the first message after the last one, rather than stopping. */
  loop?: boolean;
}

/**
 * Types the local part of the address one character at a time. Pauses on hover
 * and focus so the address can actually be read or clicked.
 */
const EmailLink = ({ loop = true }: EmailLinkProps) => {
  const [idx, setIdx] = useState(0);
  const [char, setChar] = useState(0);
  const [message, setMessage] = useState(MESSAGES[0]);
  const [isActive, setIsActive] = useState(true);
  // Tracks pointer/keyboard pause separately from the "finished" state, so
  // leaving a finished link does not restart it.
  const [isFinished, setIsFinished] = useState(false);

  useInterval(
    () => {
      const completed = char - HOLD >= MESSAGES[idx].length;
      const nextIdx = completed ? idx + 1 : idx;
      const nextChar = completed ? 0 : char;

      if (nextIdx === MESSAGES.length) {
        if (loop) {
          setIdx(0);
          setChar(0);
        } else {
          setIsFinished(true);
          setIsActive(false);
        }
        return;
      }

      setMessage(MESSAGES[nextIdx].slice(0, nextChar));
      setIdx(nextIdx);
      setChar(nextChar + 1);
    },
    isActive ? DELAY : null
  );

  const resume = () => {
    if (!isFinished) setIsActive(true);
  };

  return (
    <a
      href={`mailto:${message}@dase.dev`}
      onMouseEnter={() => setIsActive(false)}
      onMouseLeave={resume}
      onFocus={() => setIsActive(false)}
      onBlur={resume}
      className="inline-flex items-baseline border border-rule px-5 py-3 font-mono text-lg transition-colors hover:border-accent hover:text-accent"
    >
      <span>{message}</span>
      <span
        aria-hidden="true"
        className="ml-px inline-block w-px self-stretch bg-accent"
      />
      <span>@dase.dev</span>
    </a>
  );
};

export default EmailLink;
