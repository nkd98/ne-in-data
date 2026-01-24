import { NextResponse } from "next/server";

const BUTTONDOWN_URL =
  "https://buttondown.email/api/emails/embed-subscribe/northeastindata";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (typeof email !== "string" || email.trim().length === 0) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const body = new URLSearchParams({ email: email.trim() });

    const response = await fetch(BUTTONDOWN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Unable to subscribe right now. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      message: "Thanks! Check your inbox to confirm.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to subscribe right now. Please try again." },
      { status: 500 }
    );
  }
}
