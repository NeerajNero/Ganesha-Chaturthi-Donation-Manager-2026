import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createCommentSchema } from "@/lib/validators";

type Params = { id: string };

// GET /api/photos/[id]/comments — approved comments only (public)
export async function GET(
  _req: Request,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id: photoId } = await params;

    const comments = await prisma.photoComment.findMany({
      where: { photoId, status: "APPROVED" },
      orderBy: { createdAt: "asc" },
      select: { id: true, name: true, body: true, createdAt: true },
    });

    return NextResponse.json({ ok: true, data: comments });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong." },
      { status: 500 }
    );
  }
}

// POST /api/photos/[id]/comments — submit a comment (rate-limited: 1/photo/fingerprint/day)
export async function POST(
  req: Request,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id: photoId } = await params;

    const body = await req.json().catch(() => null);
    const parsed = createCommentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { name, body: commentBody, fingerprint } = parsed.data;

    // Check photo exists
    const photo = await prisma.photo.findUnique({ where: { id: photoId }, select: { id: true } });
    if (!photo) {
      return NextResponse.json({ ok: false, error: "Photo not found." }, { status: 404 });
    }

    // Rate limit: 1 comment per fingerprint per photo per calendar day (IST)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // server midnight — approximate
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayCount = await prisma.photoComment.count({
      where: {
        photoId,
        fingerprint,
        createdAt: { gte: startOfDay, lte: endOfDay },
      },
    });

    if (todayCount >= 1) {
      return NextResponse.json(
        { ok: false, error: "You have already commented on this photo today. Come back tomorrow! 🙏" },
        { status: 429 }
      );
    }

    const comment = await prisma.photoComment.create({
      data: { photoId, fingerprint, name, body: commentBody },
      select: { id: true, name: true, body: true, status: true, createdAt: true },
    });

    return NextResponse.json({ ok: true, data: comment }, { status: 201 });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong." },
      { status: 500 }
    );
  }
}
