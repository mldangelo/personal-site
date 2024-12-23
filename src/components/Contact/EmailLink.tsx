import type React from 'react';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { theme, Button } from 'antd';
import { MailOutlined } from '@ant-design/icons';

interface AnimationState {
  messageIndex: number;
  charIndex: number;
  isActive: boolean;
}

interface AnimationControls {
  pause: () => void;
  resume: () => void;
  reset: () => void;
}

interface AnimationResult {
  currentMessage: string;
  isComplete: boolean;
  controls: AnimationControls;
}

// Custom hook for managing the animated email state
const useAnimatedEmail = (
  messages: readonly string[],
  delay: number,
  hold: number
): AnimationResult => {
  const [state, setState] = useState<AnimationState>({
    messageIndex: 0,
    charIndex: 0,
    isActive: true,
  });

  // Memoize the current message and whether it's complete
  const { currentMessage, isComplete } = useMemo(() => {
    try {
      const message = messages[state.messageIndex].slice(0, state.charIndex);
      return {
        currentMessage: message,
        isComplete: state.charIndex >= messages[state.messageIndex].length,
      };
    } catch (error) {
      console.error('Error in useAnimatedEmail:', error);
      return {
        currentMessage: messages[0],
        isComplete: false,
      };
    }
  }, [messages, state.messageIndex, state.charIndex]);

  // Memoize the animation interval callback
  const animate = useCallback(() => {
    setState((prev) => {
      try {
        if (!prev.isActive) return prev;

        const currentMessageLength = messages[prev.messageIndex].length;
        const shouldMoveToNext = prev.charIndex - hold >= currentMessageLength;

        if (shouldMoveToNext) {
          return {
            messageIndex: (prev.messageIndex + 1) % messages.length,
            charIndex: 0,
            isActive: true,
          };
        }

        return {
          ...prev,
          charIndex: prev.charIndex + 1,
        };
      } catch (error) {
        console.error('Error in animation:', error);
        return prev;
      }
    });
  }, [messages, hold]);

  // Setup interval with cleanup
  useEffect(() => {
    let intervalId: number | undefined;

    if (state.isActive) {
      intervalId = window.setInterval(animate, delay);
    }

    return () => {
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
      }
    };
  }, [state.isActive, animate, delay]);

  // Controls for the animation
  const controls: AnimationControls = useMemo(
    () => ({
      pause: () => setState((prev) => ({ ...prev, isActive: false })),
      resume: () => setState((prev) => ({ ...prev, isActive: true })),
      reset: () => setState({ messageIndex: 0, charIndex: 0, isActive: true }),
    }),
    []
  );

  return { currentMessage, isComplete, controls };
};

// Email validation using modern email regex
const isValidEmail = (text: string): boolean => {
  try {
    // RFC 5322 compliant email regex for local part
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_\`{|}~-]+$/;
    return re.test(text) || text.length === 0;
  } catch (error) {
    console.error('Error in email validation:', error);
    return false;
  }
};

const messages = ['michael.l.dangelo', 'hi', 'hello', 'michael'] as const;

interface EmailLinkProps {
  /** Whether to continue looping through messages */
  loopMessage?: boolean;
  /** Email domain to display */
  domain?: string;
  /** Animation delay in milliseconds */
  animationDelay?: number;
  /** Hold time before next message in milliseconds */
  holdTime?: number;
}

const EmailLink: React.FC<EmailLinkProps> = ({
  loopMessage = true,
  domain = 'mldangelo.com',
  animationDelay = 100,
  holdTime = 120,
}) => {
  const { token } = theme.useToken();

  const { currentMessage, controls } = useAnimatedEmail(messages, animationDelay, holdTime);

  const email = `${currentMessage}@${domain}`;
  const isValid = isValidEmail(currentMessage);

  return (
    <Button
      type="link"
      href={isValid ? `mailto:${email}` : undefined}
      icon={<MailOutlined />}
      size="large"
      style={{
        height: 'auto',
        padding: 0,
        fontSize: token.fontSizeLG,
        display: 'inline-flex',
        alignItems: 'center',
        gap: token.padding,
        minWidth: 300,
      }}
      onMouseEnter={controls.pause}
      onMouseLeave={loopMessage ? controls.resume : undefined}
      onFocus={controls.pause}
      onBlur={loopMessage ? controls.resume : undefined}
      aria-label={`Send email to ${email}`}
    >
      <span
        style={{
          transition: `all ${token.motionDurationMid} ${token.motionEaseInOut}`,
          color: isValid ? token.colorLink : token.colorError,
          display: 'inline-block',
          minWidth: 0,
          whiteSpace: 'nowrap',
          opacity: currentMessage.length ? 1 : 0.7,
        }}
      >
        {currentMessage || 'loading'}
        <span>@{domain}</span>
      </span>
    </Button>
  );
};

export default EmailLink;
