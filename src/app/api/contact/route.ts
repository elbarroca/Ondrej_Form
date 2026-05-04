import { NextResponse } from "next/server"

interface ContactBody {
  name: string
  email: string
  organization?: string
  role?: string
  message?: string
  intent: "demo-booking" | "general"
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactBody

    if (!body.name || !body.email || !body.intent) {
      return NextResponse.json(
        { error: "Name, email, and intent are required." },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      )
    }

    if (!["demo-booking", "general"].includes(body.intent)) {
      return NextResponse.json(
        { error: "Invalid intent." },
        { status: 400 }
      )
    }

    // In production: send to CRM, email service, or database
    console.log("[Contact]", {
      name: body.name,
      email: body.email,
      organization: body.organization || "—",
      role: body.role || "—",
      message: body.message || "—",
      intent: body.intent,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: "Failed to process request." },
      { status: 500 }
    )
  }
}
