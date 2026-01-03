import { buildJsonResume } from '@/data/resume';

export const dynamic = 'force-static';

export async function GET() {
  const resume = buildJsonResume();

  return new Response(JSON.stringify(resume, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}
