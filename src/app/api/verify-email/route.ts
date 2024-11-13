import { NextResponse } from 'next/server';
import { verifyEmailInDatabase } from '@/lib/database';

export async function GET(req: any) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Token missing in request.' }, { status: 400 });
  }

  try {
    const {userId, expiryTimestamp} = extractUserIdFromToken(token);

    if (Date.now() > expiryTimestamp) {
      return NextResponse.json({ error: 'Token has expired.' }, { status: 410 });
    }
    const isVerified = await verifyEmailInDatabase(userId);

    if (isVerified) {
      return NextResponse.json({ message: 'Email verified successfully. Please login at https://amoga-login-template.vercel.app/applogin' });
    } else {
      return NextResponse.json({ error: 'Failed to verify email.' }, { status: 500 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred during verification.' }, { status: 500 });
  }
}

function extractUserIdFromToken(token: any) {
  const parts = token.split("-");
  const userId = parts[0];
  const expiryTimestamp = parseInt(parts[1], 10);
  return { userId, expiryTimestamp };
}
