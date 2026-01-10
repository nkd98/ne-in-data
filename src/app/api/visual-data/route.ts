import { NextResponse } from 'next/server';

const allowedHosts = new Set(['tngxrcncslblrarjqtwn.supabase.co']);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const urlParam = searchParams.get('url');
  if (!urlParam) {
    return NextResponse.json({ error: 'Missing url' }, { status: 400 });
  }

  let targetUrl: URL;
  try {
    targetUrl = new URL(urlParam);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid url' }, { status: 400 });
  }

  if (targetUrl.protocol !== 'https:' || !allowedHosts.has(targetUrl.host)) {
    return NextResponse.json({ error: 'URL not allowed' }, { status: 400 });
  }

  const upstreamResponse = await fetch(targetUrl.toString(), { cache: 'no-store' });
  if (!upstreamResponse.ok) {
    return NextResponse.json(
      { error: `Upstream fetch failed (${upstreamResponse.status})` },
      { status: upstreamResponse.status }
    );
  }

  const contentType = upstreamResponse.headers.get('content-type') ?? 'text/csv; charset=utf-8';
  const body = await upstreamResponse.text();
  return new NextResponse(body, {
    headers: {
      'content-type': contentType,
      'cache-control': 'no-store',
    },
  });
}
