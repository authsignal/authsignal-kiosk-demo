import { NextRequest, NextResponse } from "next/server";
import { authsignal } from "@/actions/client";

export async function GET(req: NextRequest, res: NextResponse) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") as string;

  const result = await authsignal.validateChallenge({
    token,
  });

  if (result.isValid) {
    return NextResponse.redirect(
      `${req.nextUrl.origin}/user-device/coffee/success`
    );
  }

  throw "Not Yet Implmented - Challenge Failed";
}
