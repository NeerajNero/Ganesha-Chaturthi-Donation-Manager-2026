import { NextResponse, after } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { createPhotoSchema } from "@/lib/validators";
import { sendTelegramMessage } from "@/lib/telegram";

// Public — powers the /gallery page and the admin manager.
export async function GET() {
  try {
    const photos = await prisma.photo.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return NextResponse.json({ ok: true, data: photos });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { ok: false, error: session ? "Admin access required" : "Not logged in" },
        { status: session ? 403 : 401 }
      );
    }

    const body = await req.json().catch(() => null);
    const parsed = createPhotoSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const photo = await prisma.photo.create({
      data: { url: parsed.data.url, caption: parsed.data.caption || null },
    });

    // Announce on Telegram — best-effort, never fails the request.
    const origin = new URL(req.url).origin;
    after(async () => {
      try {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || origin;
        await sendTelegramMessage(
          [
            "📸 New photo in the festival gallery",
            ...(photo.caption ? [`“${photo.caption}”`] : []),
            `${appUrl}/gallery`,
          ].join("\n")
        );
      } catch {
        // best-effort only
      }
    });

    return NextResponse.json({ ok: true, data: photo }, { status: 201 });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
