'use client';

import {
  type ClipboardEvent,
  Fragment,
  useEffect,
  useReducer,
  useState,
} from 'react';

import profile from '@/data/profile.json';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';

// Animation timing constants
const ANIMATION_TICK_MS = 50; // Tick length in milliseconds
const HOLD_TICKS_AFTER_MESSAGE = 50; // Ticks to wait after message completes

/** The address the link always resolves to, whatever the animation shows. */
const CONTACT_ADDRESS = profile.email;
const [CONTACT_LOCAL_PART, CONTACT_DOMAIN] = CONTACT_ADDRESS.split('@');
/** A `#`, `?`, or `%` in the local part would otherwise end the address. */
const MAILTO = `mailto:${encodeURIComponent(CONTACT_LOCAL_PART)}@${CONTACT_DOMAIN}`;

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
  /** The message on screen; once past the last one, the cycle has ended. */
  idx: number;
  message: string;
  char: number;
}

/**
 * The opening frame of a message. It already shows the first character, so the
 * prefix is never empty mid-animation.
 */
function startOf(idx: number): AnimationState {
  return {
    idx,
    message: messages[idx].slice(0, 1),
    char: 2,
  };
}

/** One tick of the cycle: the next character, or the next message. */
function tick(state: AnimationState): AnimationState {
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
    };
  }

  const nextIdx = state.idx + 1;

  return nextIdx === messages.length
    ? { ...state, idx: nextIdx }
    : startOf(nextIdx);
}

export default function EmailLink() {
  const reducedMotion = usePrefersReducedMotion();

  // Opens on the real local part, already complete, so the first thing anyone
  // sees is the actual address — and it holds there before the cycle starts.
  const [state, dispatch] = useReducer(tick, {
    idx: 0,
    message: CONTACT_LOCAL_PART,
    char: messages[0].length,
  });

  // Hover and focus each hold the animation, so leaving with the pointer
  // never restarts it under a keyboard user's focus.
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const animating =
    state.idx < messages.length && !reducedMotion && !hovered && !focused;

  useEffect(() => {
    if (!animating) return;

    const id = setInterval(dispatch, ANIMATION_TICK_MS);
    return () => clearInterval(id);
  }, [animating]);

  // The reducer never yields an empty prefix. The real address stands under
  // reduced motion, and while the link has focus, so the address a keyboard
  // user is about to open is the one on screen.
  const displayMessage =
    reducedMotion || focused ? CONTACT_LOCAL_PART : state.message;

  // Whatever alias is showing, a copy from the address is the address. A
  // selection that reaches past it copies as the browser would.
  const copyAddress = (event: ClipboardEvent<HTMLElement>) => {
    const selection = window.getSelection();
    const within = (node: Node | null | undefined) =>
      node != null && event.currentTarget.contains(node);
    if (!within(selection?.anchorNode) || !within(selection?.focusNode)) {
      return;
    }
    event.preventDefault();
    event.clipboardData.setData('text/plain', CONTACT_ADDRESS);
  };

  return (
    <div
      className="contact-email-container"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onCopy={copyAddress}
    >
      {/* Always a real link to a real address. The animation cycles through
          joke aliases, some of which are not valid local-parts, so the shown
          alias is decorative and the destination never changes. */}
      <a
        href={MAILTO}
        className="contact-email-link"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        <span className="sr-only">Email {CONTACT_ADDRESS}</span>
        <span className="contact-email-prefix" aria-hidden="true">
          <span dir="ltr">{displayMessage}</span>
        </span>
        {/* Paper takes whatever frame is showing, so print has the real
            local part in the alias's place. */}
        <span className="contact-email-print" aria-hidden="true">
          {CONTACT_LOCAL_PART}
        </span>
        <span className="contact-email-domain" aria-hidden="true">
          @
          {/* Where the address has to stack, its domain breaks only before a
              dot. <wbr> adds nothing to text copied from the page. */}
          {CONTACT_DOMAIN.split('.').map((part, index) => (
            // A domain's labels can repeat but never reorder.
            <Fragment key={index}>
              {index > 0 && (
                <>
                  <wbr />.
                </>
              )}
              {part}
            </Fragment>
          ))}
        </span>
      </a>
    </div>
  );
}
