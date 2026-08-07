'use client';

import { useEffect, useState } from 'react';

const BIRTH_TIME = new Date('1993-03-25T00:00:00');
/** Milliseconds in an average year. */
const MS_PER_YEAR = 1000 * 60 * 60 * 24 * 365.2421897;

/**
 * A live-ticking age to eleven decimal places. Client-only by necessity: it
 * would otherwise be frozen at build time, and it would mismatch on hydration.
 */
const Age = () => {
  const [age, setAge] = useState<string>();

  useEffect(() => {
    const tick = () =>
      setAge(((Date.now() - BIRTH_TIME.getTime()) / MS_PER_YEAR).toFixed(11));

    tick();
    const timer = setInterval(tick, 25);
    return () => clearInterval(timer);
  }, []);

  return <>{age ?? '—'}</>;
};

export default Age;
