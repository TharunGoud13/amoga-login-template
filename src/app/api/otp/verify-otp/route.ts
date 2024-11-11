import { NextRequest, NextResponse } from "next/server";

const TWO_FACTOR_API_KEY = process.env.TWO_FACTOR_API_KEY as string;
const BASE_URL = "https://2factor.in/API/V1/";

export async function POST(req: NextRequest) {
  const { sessionId, otp } = await req.json();
  console.log("verify---data---",sessionId, otp);

  if (!sessionId || !otp) {
    return NextResponse.json(
      { message: "Session Id and otp are required" },
      { status: 400 }
    );
  }

  const url = `${BASE_URL}${TWO_FACTOR_API_KEY}/SMS/VERIFY/${sessionId}/${otp}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("data-----",data)

    if (data.Status === "Success") {
      return NextResponse.json({ verified: true });
    } else {
      return NextResponse.json(
        { verified: false, message: "Invalid OTP" },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 }
    );
  }
}
