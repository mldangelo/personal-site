import {
  AGE_PRECISION_FULL,
  AGE_PRECISION_STATIC,
  ageAt,
  COUNTRIES_VISITED,
  CURRENT_CITY,
  utcDate,
} from '@/lib/telemetry';

import LiveAge from './LiveAge';
import Table from './Table';

/**
 * The personal stats table stays server-rendered. Only its age value is a
 * client leaf, so no-JavaScript readers receive a real, dated snapshot.
 */
export default function PersonalStats() {
  const renderedAt = Date.now();

  return (
    <Table
      data={[
        {
          label: 'Current age',
          value: (
            <LiveAge
              initial={ageAt(renderedAt, AGE_PRECISION_STATIC)}
              note={`as of ${utcDate(renderedAt)}`}
              precision={AGE_PRECISION_FULL}
            />
          ),
        },
        {
          label: 'Countries visited',
          value: String(COUNTRIES_VISITED),
          link: 'https://www.google.com/maps/d/embed?mid=1iBBTscqateQ93pWFVfHCUZXoDu8&z=2',
        },
        { label: 'Current city', value: CURRENT_CITY },
      ]}
    />
  );
}
