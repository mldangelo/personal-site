import { serializeJsonResume } from '@/lib/resumeJson';

// Same shape as `app/feed.xml/route.ts`: a static file emitted at build time,
// which is all `output: 'export'` allows.
export const dynamic = 'force-static';

export async function GET() {
  return new Response(serializeJsonResume(), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}
