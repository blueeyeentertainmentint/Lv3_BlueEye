import { NextResponse, type NextRequest } from "next/server";
import {
  registerForEvent,
  getRegistrationForUser,
} from "@/lib/services/eventRegistrationService";
import { getEventBySlug } from "@/lib/services/eventService";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";

export const dynamic = "force-dynamic";

async function getSessionUser() {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!user?.email) return null;
  return {
    id: (user as { id?: string }).id,
    email: user.email,
    name: user.name || "",
  };
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const event = await getEventBySlug(slug);
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ registered: false, requiresAuth: true });
    }

    const registration = await getRegistrationForUser(event._id, {
      userId: user.id,
      email: user.email,
    });

    return NextResponse.json({
      registered: !!registration,
      registration,
      email: user.email,
      name: user.name,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load registration status";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const event = await getEventBySlug(slug);
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Sign in to register for this event" }, { status: 401 });
    }

    const body = await req.json();
    const { guestName, guestPhone, headcount, message } = body;

    if (!guestName || !guestPhone) {
      return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
    }

    const reg = await registerForEvent({
      eventId: event._id,
      userId: user.id,
      guestName,
      guestEmail: user.email,
      guestPhone,
      headcount: headcount || 1,
      message,
    });

    return NextResponse.json({ success: true, registration: reg }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Registration failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
