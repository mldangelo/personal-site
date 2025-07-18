'use client';

import React, { useEffect, useRef, useState } from 'react';

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

interface EmailLinkProps {
  loopMessage?: boolean;
  className?: string;
}

const EmailLink: React.FC<EmailLinkProps> = ({ loopMessage = false, className = '' }) => {
  const hold = 50; // ticks to wait after message is complete before rendering next message
  const delay = 50; // tick length in mS

  const [idx, updateIter] = useState(0); // points to current message
  const [message, updateMessage] = useState(messages[idx]);
  const [char, updateChar] = useState(0); // points to current char
  const [isActive, setIsActive] = useState(true); // disable when all messages are printed

  useInterval(
    () => {
      let newIdx = idx;
      let newChar = char;
      if (char - hold >= messages[idx].length) {
        newIdx += 1;
        newChar = 0;
      }
      if (newIdx === messages.length) {
        if (loopMessage) {
          updateIter(0);
          updateChar(0);
        } else {
          setIsActive(false);
        }
      } else {
        updateMessage(messages[newIdx].slice(0, newChar));
        updateIter(newIdx);
        updateChar(newChar + 1);
      }
    },
    isActive ? delay : null,
  );

  const isValid = validateText(message);

  return (
    <div
      className={`inline-block ${className}`}
      onMouseEnter={() => setIsActive(false)}
      onMouseLeave={() => idx < messages.length && setIsActive(true)}
    >
      <a
        href={isValid ? `mailto:${message}@mldangelo.com` : ''}
        className={`
          inline-flex items-center font-mono text-xl px-8 py-4 rounded-2xl
          border-2 transition-all duration-300
          ${
            isValid
              ? 'bg-primary text-white border-primary hover:bg-primary-dark hover:border-primary-dark hover:scale-105 hover:shadow-xl cursor-pointer'
              : 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 border-red-200 dark:border-red-800 cursor-not-allowed'
          }
        `}
      >
        <span className="min-w-[240px] text-right pr-1">{message}</span>
        <span className="font-bold">@mldangelo.com</span>
      </a>
    </div>
  );
};

export default EmailLink;
