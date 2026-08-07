import type React from 'react';
import { useEffect, useRef, useState } from 'react';

// Validates the first half of an email address.
const validateText = (text: string) => {
  // NOTE: Passes RFC 5322 but not tested on google's standard.
  // eslint-disable-next-line no-useless-escape
  const re = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))$/;
  return re.test(text) || text.length === 0;
};

const messages = ['hi', 'hello', 'hola'];

const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback: React.MutableRefObject<() => void> = useRef<() => void>(
    () => {}
  );

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay) {
      const id = setInterval(() => {
        savedCallback.current();
      }, delay);
      return () => clearInterval(id);
    }
    return () => {}; // pass linter
  }, [delay]);
};

interface ILoopMessage {
  data?: {
    loopMessage: boolean;
  };
}

const EmailLink = (loopMessage: ILoopMessage) => {
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
    isActive ? delay : null
  );

  const valid = validateText(message);

  return (
    <a
      href={valid ? `mailto:${message}@dase.dev` : undefined}
      // Pause the animation while the address is being read or clicked.
      onMouseEnter={() => setIsActive(false)}
      onMouseLeave={() => idx < messages.length && setIsActive(true)}
      onFocus={() => setIsActive(false)}
      onBlur={() => idx < messages.length && setIsActive(true)}
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
