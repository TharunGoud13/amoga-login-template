import { NextResponse } from 'next/server';
import { verifyEmailInDatabase } from '@/lib/database';

export async function GET(req: any) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Token missing in request.' }, { status: 400 });
  }

  try {
    const userId = extractUserIdFromToken(token);
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

function extractUserIdFromToken(token:any) {
  // Extract user ID from the token. Example: `userId-timestamp`
  const parts = token.split('-');
  return parts[0]; // Return the user ID part
}
