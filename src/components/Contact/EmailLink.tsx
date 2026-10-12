'use client';

import { useEffect, useReducer, useRef, useState } from 'react';

import profile from '@/data/profile.json';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';

// Animation timing constants
const ANIMATION_TICK_MS = 50; // Tick length in milliseconds
const HOLD_TICKS_AFTER_MESSAGE = 50; // Ticks to wait after message completes
const COPIED_NOTICE_MS = 2000; // How long the copy button reports success

/** The address this page exists to give out: the link's text and its target. */
const CONTACT_ADDRESS = profile.email;
const [, CONTACT_DOMAIN] = CONTACT_ADDRESS.split('@');

/**
 * Joke aliases, typed one at a time on a decorative line under the address.
 *
 * The first is blank on purpose. The line opens empty and holds for as long as
 * any other message, so the address has been read before anything beneath it
 * moves — and a looping cycle rests the same way between laps.
 */
const messages = [
  '',
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

function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!delay) return;

    const id = setInterval(() => savedCallback.current?.(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

interface AnimationState {
  idx: number;
  message: string;
  char: number;
  isActive: boolean;
}

type AnimationAction =
  | { type: 'TICK'; loopMessage: boolean; hold: number }
  | { type: 'PAUSE' }
  | { type: 'RESUME'; maxIdx: number };

/**
 * The opening frame of a message.
 *
 * Advancing used to reset to zero characters, so `message` was `''` for one
 * tick at every boundary. An empty message draws no alias line, so the line
 * would blink out between every pair of aliases. A message begins already
 * showing its first character; only the blank opening message is ever empty.
 */
function startOf(idx: number): AnimationState {
  return {
    idx,
    message: messages[idx].slice(0, 1),
    char: 2,
    isActive: true,
  };
}

function animationReducer(
  state: AnimationState,
  action: AnimationAction,
): AnimationState {
  switch (action.type) {
    case 'TICK': {
      if (state.idx >= messages.length) {
        return state;
      }

      const finished = state.char - action.hold >= messages[state.idx].length;

      if (!finished) {
        return {
          ...state,
          message: messages[state.idx].slice(0, state.char),
          char: state.char + 1,
          isActive: true,
        };
      }

      const nextIdx = state.idx + 1;

      if (nextIdx === messages.length) {
        if (action.loopMessage) {
          return startOf(0);
        }

        // Completion is recorded in `idx`, not only in `isActive`. Leaving it
        // on the last message meant RESUME's `idx < maxIdx` test passed, so a
        // finished animation re-armed its interval on every mouse-out.
        //
        // The message is cleared with it. A last alias left standing would be
        // a second address under the real one, with no typing left to say it
        // was a joke.
        return { idx: messages.length, message: '', char: 0, isActive: false };
      }

      return startOf(nextIdx);
    }
    case 'PAUSE':
      return { ...state, isActive: false };
    case 'RESUME':
      return {
        ...state,
        isActive: state.idx < action.maxIdx,
      };
    default:
      return state;
  }
}

interface EmailLinkProps {
  loopMessage?: boolean;
}

/**
 * The address, a way to copy it, and — kept apart from both — the alias gag.
 *
 * The aliases used to be typed into the link itself. That left the one thing
 * `/contact` is for on screen for 2.5 seconds of a 50-second cycle, ended on
 * `thanks@…` for good, and let a wrapping alias resize the link and throw the
 * centred page around with it. The link is now static text and the gag has a
 * line of its own, whose space `content.css` reserves whether or not anything
 * is typed there.
 */
export default function EmailLink({ loopMessage = false }: EmailLinkProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [state, dispatch] = useReducer(animationReducer, 0, startOf);
  // A count rather than a flag, so pressing again restarts the notice instead
  // of inheriting whatever was left of the last one.
  const [copies, setCopies] = useState(0);
  const copied = copies > 0;

  useInterval(
    () => {
      dispatch({ type: 'TICK', loopMessage, hold: HOLD_TICKS_AFTER_MESSAGE });
    },
    state.isActive && !reducedMotion ? ANIMATION_TICK_MS : null,
  );

  useEffect(() => {
    if (!copies) return;

    const id = setTimeout(() => setCopies(0), COPIED_NOTICE_MS);
    return () => clearTimeout(id);
  }, [copies]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_ADDRESS);
      setCopies((count) => count + 1);
    } catch {
      // Refused, or no clipboard at all. The address is on screen and can be
      // selected, so the only thing to get right is not claiming a copy.
    }
  };

  // The line is nothing but motion, so there is no still version of it to fall
  // back on: a visitor who asked for less motion gets no line at all.
  const alias = reducedMotion ? '' : state.message;

  // Pointing at or tabbing to any of the three holds the current frame, so a
  // line that otherwise moves for fifty seconds can be stopped (WCAG 2.2.2).
  // The handlers sit on the things themselves, not on the block around them:
  // the block is as wide as the page, and a pointer parked in its empty
  // gutters would stop the line for no reason a visitor could see.
  const pause = () => dispatch({ type: 'PAUSE' });
  const resume = () => dispatch({ type: 'RESUME', maxIdx: messages.length });
  const hold = {
    onMouseEnter: pause,
    onMouseLeave: resume,
    onFocus: pause,
    onBlur: resume,
  };

  return (
    <div className="contact-email-container">
      {/* The link's text is the address, exactly: it is what gets read, what a
          selection copies, and the link's accessible name. Nothing in here
          animates. */}
      <a
        {...hold}
        href={`mailto:${CONTACT_ADDRESS}`}
        className="contact-email-link"
      >
        {CONTACT_ADDRESS}
      </a>
      {/* Decorative, and several aliases are not valid addresses, so it is
          hidden from assistive technology and cannot be selected. One text
          node on purpose: a domain in a node of its own would be pushed along
          by every keystroke, and each push is a layout shift. */}
      {alias ? (
        <span {...hold} className="contact-email-alias" aria-hidden="true">
          {`${alias}@${CONTACT_DOMAIN}`}
        </span>
      ) : null}
      <button
        {...hold}
        type="button"
        className="contact-copy"
        onClick={handleCopy}
      >
        {copied ? 'Copied' : 'Copy address'}
      </button>
      <span className="sr-only" role="status">
        {copied ? 'Address copied' : ''}
      </span>
    </div>
  );
}
