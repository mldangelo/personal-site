import { useRouter } from 'next/router';
import { useEffect } from 'react';

const ScrollToTop = () => {
  const router = useRouter();
  const { pathname } = router;

  useEffect(() => {
    // pathname is the navigation trigger, not a value read inside the effect.
    void pathname;
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
