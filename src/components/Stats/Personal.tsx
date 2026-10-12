import { Fragment } from 'react';

import { captionFor, groupBySource, resolveReadings } from '@/lib/readings';
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
 *
 * The caption is derived from the source the declarations carry, never typed
 * here, so a reading filed under a different source would get a table and a
 * caption of its own rather than inherit this one.
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

  return groupBySource(readings).map(({ source, readings: rows }) => (
    <Fragment key={source ?? 'unsourced'}>
      <Table caption={captionFor(source)} data={rows} source={source} />
      {source === 'profile' ? (
        <p className="stats-source-note" data-source="profile">
          The age is counted from my birth date and ticks in your browser.
          Without JavaScript, or with reduced motion, it stays the dated
          snapshot from when this page was built.
        </p>
      ) : null}
    </Fragment>
  ));
}
