'use client';

import { useEffect, useReducer, useRef } from 'react';

import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';

// Animation timing constants
const ANIMATION_TICK_MS = 50; // Tick length in milliseconds
const HOLD_TICKS_AFTER_MESSAGE = 50; // Ticks to wait after message completes

/** The address the link always resolves to, whatever the animation shows. */
const CONTACT_DOMAIN = 'mldangelo.com';
const CONTACT_ADDRESS = `hi@${CONTACT_DOMAIN}`;

const messages = [
  'hi',
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

function animationReducer(
  state: AnimationState,
  action: AnimationAction,
): AnimationState {
  switch (action.type) {
    case 'TICK': {
      let newIdx = state.idx;
      let newChar = state.char;

      if (state.char - action.hold >= messages[state.idx].length) {
        newIdx += 1;
        newChar = 0;
      }

      if (newIdx === messages.length) {
        if (action.loopMessage) {
          return {
            idx: 0,
            message: '',
            char: 0,
            isActive: true,
          };
        }
        return {
          ...state,
          isActive: false,
        };
      }

      return {
        idx: newIdx,
        message: messages[newIdx].slice(0, newChar),
        char: newChar + 1,
        isActive: true,
      };
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

  const [state, dispatch] = useReducer(animationReducer, {
    idx: 0,
    message: '',
    char: 0,
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

  // Use 'hi' as default message when reduced motion or paused with empty message
  const displayMessage =
    reducedMotion || state.message === '' ? 'hi' : state.message;

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
