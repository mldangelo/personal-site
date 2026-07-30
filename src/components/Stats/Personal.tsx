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
 * The personal stats table, rendered on the server.
 *
 * It was a client component only so that the age could tick, and the price was
 * that the age did not exist until JavaScript ran: `out/stats/index.html`
 * shipped `--.-----------` as the site's most distinctive value, to every
 * crawler and every reader (or print renderer) with JavaScript off. A browser
 * that prints after hydration already sees the live value. The client boundary
 * is a single `<LiveAge>` span now.
 *
 * The readings are resolved per render rather than once at module scope, because
 * the age the server can prove depends on the instant this runs. Under
 * `output: 'export'` that instant is the build; under `npm run dev` it is the
 * request, which is exactly the behaviour you want while editing.
 */
export default function PersonalStats() {
  const builtAt = Date.now();
  const readings = resolveReadings(declarations, {
    age: (
      <LiveAge
        initial={ageAt(builtAt, AGE_PRECISION_STATIC)}
        note={`as of ${utcDate(builtAt)}`}
        precision={AGE_PRECISION_FULL}
      />
    ),
  });

  return (
    <>
      <Table data={readings} />
      <p className="stats-source-note" data-source="profile">
        Profile readings come from src/data/profile.json. The age is computed in
        your browser from the birth instant recorded there; with no JavaScript
        it holds the coarser reading taken when this build ran.
      </p>
    </>
  );
}
