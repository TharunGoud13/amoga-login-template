import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

// Ensure to use environment variables for sensitive tokens
const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

export async function POST(request: Request): Promise<NextResponse> {

  // Parse the form data and extract the file
  const formData = await request.formData();
  const file = formData.get('file') as File;
  console.log("file----", file);

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  try {
    // Upload the file to Vercel Blob
    const blob = await put(file.name, file, {
      access: 'public', // Make the file publicly accessible
      token: BLOB_READ_WRITE_TOKEN, // Use the token for authentication
    });

    // Return the URL of the uploaded file
    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
