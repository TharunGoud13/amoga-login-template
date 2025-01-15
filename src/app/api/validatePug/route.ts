import { NextRequest, NextResponse } from "next/server";
import pug from "pug";

export async function POST(req: NextRequest) {
  const { template } = await req.json();

  if (!template) {
    return NextResponse.json(
      { valid: false, error: "Template is required" },
      { status: 400 }
    );
  }

  try {
    pug.compile(template);
    return NextResponse.json({ valid: true }, { status: 200 });
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Invalid Pug syntax";
    return NextResponse.json(
      {
        valid: false,
        error: errorMessage,
      },
      { status: 400 }
    );
  }
}
