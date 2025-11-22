'use client';

import React, { useEffect, useReducer, useRef } from 'react';

// Validates the first half of an email address.
const validateText = (text: string): boolean => {
  // NOTE: Passes RFC 5322 but not tested on google's standard.
  // eslint-disable-next-line no-useless-escape
  const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))$/;
  return re.test(text) || text.length === 0;
};

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

const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef<() => void>(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay) {
      const id = setInterval(() => {
        savedCallback.current?.();
      }, delay);
      return () => clearInterval(id);
    }
    return () => {}; // pass linter
  }, [delay]);
};

// React 19: Using useReducer for complex state management
type AnimationState = {
  idx: number;
  message: string;
  char: number;
  isActive: boolean;
};

type AnimationAction =
  | { type: 'TICK'; loopMessage: boolean; hold: number }
  | { type: 'PAUSE' }
  | { type: 'RESUME'; maxIdx: number };

const animationReducer = (
  state: AnimationState,
  action: AnimationAction,
): AnimationState => {
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
};

interface EmailLinkProps {
  loopMessage?: boolean;
}

const EmailLink: React.FC<EmailLinkProps> = ({ loopMessage = false }) => {
  const hold = 50; // ticks to wait after message is complete before rendering next message
  const delay = 50; // tick length in mS

  const [state, dispatch] = useReducer(animationReducer, {
    idx: 0,
    message: messages[0],
    char: 0,
    isActive: true,
  });

  useInterval(
    () => {
      dispatch({ type: 'TICK', loopMessage, hold });
    },
    state.isActive ? delay : null,
  );

  return (
    <div
      className="inline-container"
      style={validateText(state.message) ? {} : { color: 'red' }}
      onMouseEnter={() => dispatch({ type: 'PAUSE' })}
      onMouseLeave={() => dispatch({ type: 'RESUME', maxIdx: messages.length })}
    >
      <a
        href={
          validateText(state.message)
            ? `mailto:${state.message}@mldangelo.com`
            : ''
        }
      >
        <span>{state.message}</span>
        <span>@mldangelo.com</span>
      </a>
    </div>
  );
};

export default EmailLink;
