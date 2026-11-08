'use client';

import { useEffect, useReducer } from 'react';

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

interface AnimationState {
  idx: number;
  message: string;
  char: number;
  isActive: boolean;
}

type AnimationAction = { type: 'TICK' | 'PAUSE' | 'RESUME' };

/**
 * The opening frame of a message. It already shows the first character, so the
 * prefix is never empty mid-animation.
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

      const finished =
        state.char - HOLD_TICKS_AFTER_MESSAGE >= messages[state.idx].length;

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
        // Completion is recorded in `idx`, not only in `isActive`, so RESUME
        // cannot re-arm a finished animation.
        return { ...state, idx: messages.length, isActive: false };
      }

      return startOf(nextIdx);
    }
    case 'PAUSE':
      return { ...state, isActive: false };
    case 'RESUME':
      return { ...state, isActive: state.idx < messages.length };
  }
}

export default function EmailLink() {
  const reducedMotion = usePrefersReducedMotion();

  // Opens on the real local part, already complete, so the first thing anyone
  // sees is the actual address — and it holds there before the cycle starts.
  const [state, dispatch] = useReducer(animationReducer, {
    idx: 0,
    message: CONTACT_LOCAL_PART,
    char: messages[0].length,
    isActive: true,
  });

  const animating = state.isActive && !reducedMotion;

  useEffect(() => {
    if (!animating) return;

    const id = setInterval(() => dispatch({ type: 'TICK' }), ANIMATION_TICK_MS);
    return () => clearInterval(id);
  }, [animating]);

  // The reducer never yields an empty prefix, so the only reason to override
  // it is reduced motion, where the real address should simply stand.
  const displayMessage = reducedMotion ? CONTACT_LOCAL_PART : state.message;

  const handlePause = () => dispatch({ type: 'PAUSE' });
  const handleResume = () => dispatch({ type: 'RESUME' });

  return (
    <div
      className="contact-email-container"
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
    >
      {/* Always a real link to a real address. The animation cycles through
          joke aliases, some of which are not valid local-parts, so the shown
          alias is decorative and the destination never changes. */}
      <a
        href={`mailto:${CONTACT_ADDRESS}`}
        className="contact-email-link"
        onFocus={handlePause}
        onBlur={handleResume}
      >
        <span className="sr-only">Email {CONTACT_ADDRESS}</span>
        <span className="contact-email-prefix" aria-hidden="true">
          <span dir="ltr">{displayMessage}</span>
        </span>
        <span className="contact-email-domain" aria-hidden="true">
          @{CONTACT_DOMAIN}
        </span>
      </a>
    </div>
  );
}
