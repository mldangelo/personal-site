import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { Button, theme } from 'antd';
import { UpOutlined } from '@ant-design/icons';
import type { CSSProperties } from 'react';

const SCROLL_THRESHOLD = 300;
const TRANSITION_DURATION = '0.3s';

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { token } = theme.useToken();

  const toggleVisibility = useCallback(() => {
    setIsVisible(window.pageYOffset > SCROLL_THRESHOLD);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [toggleVisibility]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  const styles = {
    container: {
      position: 'fixed',
      bottom: token.marginLG,
      right: token.marginLG,
      zIndex: token.zIndexBase + 10,
      opacity: isVisible ? 1 : 0,
      visibility: isVisible ? 'visible' : 'hidden',
      transform: `translateY(${isVisible ? 0 : 20}px)`,
      transition: `all ${TRANSITION_DURATION}`,
      '@media (max-width: 768px)': {
        bottom: token.margin,
        right: token.margin,
      },
    } as CSSProperties,
    button: {
      boxShadow: token.boxShadowSecondary,
      width: 40,
      height: 40,
    } as CSSProperties,
  };

  return (
    <div style={styles.container} role="complementary" aria-label="Scroll to top">
      <Button
        type="primary"
        shape="circle"
        icon={<UpOutlined />}
        size="large"
        onClick={scrollToTop}
        style={styles.button}
        aria-label="Scroll to top of page"
        title="Scroll to top"
      />
    </div>
  );
};

export default ScrollToTop;
