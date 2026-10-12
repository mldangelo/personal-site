'use client';

import { useEffect, useReducer, useRef } from 'react';

import profile from '@/data/profile.json';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';

// Animation timing constants
const ANIMATION_TICK_MS = 50; // Tick length in milliseconds
const HOLD_TICKS_AFTER_MESSAGE = 50; // Ticks to wait after message completes

/** The address the link always resolves to, whatever the animation shows. */
const CONTACT_ADDRESS = profile.email;
const [CONTACT_LOCAL_PART, CONTACT_DOMAIN] = CONTACT_ADDRESS.split('@');

const messages = [
  CONTACT_LOCAL_PART,
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
 * tick at every boundary — and the render fell back to the static address,
 * flashing it fifteen times a cycle. A message now begins already showing its
 * first character, so the prefix is never empty mid-animation.
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
        return { ...state, idx: messages.length, isActive: false };
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

export default function EmailLink({ loopMessage = false }: EmailLinkProps) {
  const reducedMotion = usePrefersReducedMotion();

  // Opens on the real local part, already complete, so the first thing anyone
  // sees is the actual address — and it holds there before the cycle starts.
  const [state, dispatch] = useReducer(animationReducer, {
    idx: 0,
    message: CONTACT_LOCAL_PART,
    char: messages[0].length,
    isActive: true,
  });

  // If user prefers reduced motion, show static email immediately
  useEffect(() => {
    if (reducedMotion) {
      dispatch({ type: 'PAUSE' });
    }
  }, [reducedMotion]);

  useInterval(
    () => {
      dispatch({ type: 'TICK', loopMessage, hold: HOLD_TICKS_AFTER_MESSAGE });
    },
    state.isActive && !reducedMotion ? ANIMATION_TICK_MS : null,
  );

  // The reducer never yields an empty prefix, so the only reason to override
  // it is reduced motion, where the real address should simply stand.
  const displayMessage = reducedMotion ? CONTACT_LOCAL_PART : state.message;

  const handlePause = () => dispatch({ type: 'PAUSE' });
  const handleResume = () => {
    if (!reducedMotion) {
      dispatch({ type: 'RESUME', maxIdx: messages.length });
    }
  };

  return (
    <div
      className="contact-email-container"
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
    >
      {/* Always a real link to a real address.
          The animation cycles through joke aliases, three of which are not
          valid local-parts ("but not this :(  " among them). Those used to
          swap the anchor for an aria-disabled, unfocusable <span>, so for
          roughly a fifth of the cycle the contact page offered no way to
          reach anyone. The gag is now purely visual: the shown alias is
          decorative and the destination never changes. */}
      <a
        href={`mailto:${CONTACT_ADDRESS}`}
        className="contact-email-link"
        onFocus={handlePause}
        onBlur={handleResume}
      >
        <span className="sr-only">Email {CONTACT_ADDRESS}</span>
        <span className="contact-email-prefix" aria-hidden="true">
          {displayMessage}
        </span>
        <span className="contact-email-domain" aria-hidden="true">
          @{CONTACT_DOMAIN}
        </span>
      </a>
    </div>
  );
}
