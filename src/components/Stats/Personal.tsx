import { resolveReadings } from '@/lib/readings';
import {
  AGE_PRECISION_FULL,
  AGE_PRECISION_STATIC,
  ageAt,
  utcDate,
} from '@/lib/telemetry';

import declarations from '../../data/stats/personal';
import LiveAge from './LiveAge';
import Table from './Table';

/**
 * The personal stats table stays server-rendered. Only its age value is a
 * client leaf, so no-JavaScript readers receive a real, dated snapshot instead
 * of the old dash placeholder.
 */
export default function PersonalStats() {
  const renderedAt = Date.now();
  const readings = resolveReadings(declarations, {
    age: (
      <LiveAge
        initial={ageAt(renderedAt, AGE_PRECISION_STATIC)}
        note={`as of ${utcDate(renderedAt)}`}
        precision={AGE_PRECISION_FULL}
      />
    ),
  });

  return (
    <>
      <Table data={readings} />
      <p className="stats-source-note" data-source="profile">
        Profile readings come from the site&apos;s maintained profile data. The
        age updates in your browser; without JavaScript or with reduced motion,
        it remains the dated snapshot taken when this page was rendered.
      </p>
    </>
  );
}
