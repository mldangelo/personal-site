'use client';

import useLiveAge from '@/hooks/useLiveAge';
import {
  AGE_PRECISION_HERO,
  COMPUTING_SINCE,
  COUNTRIES_VISITED,
  CURRENT_CITY,
} from '@/lib/telemetry';

/**
 * The readout strip: four measured values about the person the site is about.
 *
 * Only the age is live, and it is the only value permitted to carry the
 * signal colour — that restraint is what makes it read as an instrument
 * rather than as decoration.
 */
export default function Telemetry() {
  const age = useLiveAge(AGE_PRECISION_HERO);

  return (
    <dl className="telemetry">
      <div className="telemetry-cell">
        <dt className="telemetry-label">Age</dt>
        <dd className="telemetry-value telemetry-value--live">
          <span className="telemetry-number">{age}</span>
        </dd>
      </div>

      <div className="telemetry-cell">
        <dt className="telemetry-label">Countries visited</dt>
        <dd className="telemetry-value">
          <span className="telemetry-number">{COUNTRIES_VISITED}</span>
        </dd>
      </div>

      <div className="telemetry-cell">
        <dt className="telemetry-label">Computing since</dt>
        <dd className="telemetry-value">
          <span className="telemetry-number">{COMPUTING_SINCE}</span>
        </dd>
      </div>

      <div className="telemetry-cell">
        <dt className="telemetry-label">Based in</dt>
        <dd className="telemetry-value">{CURRENT_CITY}</dd>
      </div>
    </dl>
  );
}
