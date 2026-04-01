import { NextResponse } from 'next/server';

const SITE_PIN = '20260331';
const COOKIE_NAME = 'flash_dumps_access';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function POST(request: Request) {
  const body = await request.json();
  const { pin } = body;

  if (pin === SITE_PIN) {
    const response = NextResponse.json({ success: true });
    response.cookies.set(COOKIE_NAME, 'granted', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    });
    return response;
  }

  return NextResponse.json({ success: false, error: 'Invalid PIN' }, { status: 401 });
}

export async function GET() {
  return NextResponse.json({ authenticated: false }, { status: 405 });
}
