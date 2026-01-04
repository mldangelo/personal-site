'use client';

import { useEffect, useReducer, useRef, useState } from 'react';

// Validates the first half of an email address per RFC 5322
function validateText(text: string): boolean {
  const re = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))$/;
  return re.test(text) || text.length === 0;
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

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
  const hold = 50; // ticks to wait after message is complete before rendering next message
  const delay = 50; // tick length in mS

  // Check for reduced motion preference
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(prefersReducedMotion());
  }, []);

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
      dispatch({ type: 'TICK', loopMessage, hold });
    },
    state.isActive && !reducedMotion ? delay : null,
  );

  // Use 'hi' as default message when reduced motion or paused with empty message
  const displayMessage =
    reducedMotion || state.message === '' ? 'hi' : state.message;
  const isValid = validateText(displayMessage);

  const handlePause = () => dispatch({ type: 'PAUSE' });
  const handleResume = () => {
    if (!reducedMotion) {
      dispatch({ type: 'RESUME', maxIdx: messages.length });
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!isValid) {
      e.preventDefault();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isValid && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
    }
  };

  const emailContent = (
    <>
      <span className="contact-email-prefix">{displayMessage}</span>
      <span className="contact-email-domain">@mldangelo.com</span>
    </>
  );

  return (
    <div
      className="contact-email-container"
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
    >
      {isValid ? (
        <a
          href={`mailto:${displayMessage}@mldangelo.com`}
          className="contact-email-link"
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onFocus={handlePause}
          onBlur={handleResume}
        >
          {emailContent}
        </a>
      ) : (
        <span
          className="contact-email-link contact-email-link--invalid"
          aria-disabled="true"
          onFocus={handlePause}
          onBlur={handleResume}
        >
          {emailContent}
        </span>
      )}
    </div>
  );
}
