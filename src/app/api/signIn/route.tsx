import { NEXT_PUBLIC_API_KEY } from '@/constants/envConfig';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  if (req.method === 'POST') {
    try {
      const body = await req.json();
      const { password, retypePassword, ...formData } = body;

      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${NEXT_PUBLIC_API_KEY}`);
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify(formData);

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
      };

      const response = await fetch("https://us4okg8.219.93.129.146.sslip.io/contacts", requestOptions);
      const result = await response.text();

      if (response.ok) {
        return NextResponse.json({ message: "User Created Successfully" }, { status: response.status });
      } else {
        return NextResponse.json({ message: "Something went wrong, please try again.", details: result }, { status: response.status });
      }
    } catch (error) {
      return NextResponse.json({ message: "An error occurred while creating the user.", error: error }, { status: 500 });
    }
  } else {
    return new NextResponse(`Method ${req.method} Not Allowed`, { status: 405, headers: { Allow: 'POST' } });
  }
}
