import { NextResponse } from 'next/server';

import resumeData from '@/data/resume.json';

export async function GET() {
  return NextResponse.json(resumeData, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
