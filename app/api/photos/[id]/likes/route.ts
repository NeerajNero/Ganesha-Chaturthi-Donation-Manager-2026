import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { id: string };

// GET /api/photos/[id]/likes?fingerprint=<uuid>
export async function GET(
  req: Request,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id: photoId } = await params;
    const { searchParams } = new URL(req.url);
    const fingerprint = searchParams.get("fingerprint") ?? "";

    const [count, liked] = await Promise.all([
      prisma.photoLike.count({ where: { photoId } }),
      fingerprint
        ? prisma.photoLike.findUnique({
            where: { photoId_fingerprint: { photoId, fingerprint } },
            select: { id: true },
          })
        : null,
    ]);

    return NextResponse.json({
      ok: true,
      data: { count, liked: !!liked },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong." },
      { status: 500 }
    );
  }
}

// POST /api/photos/[id]/likes — one-way like (no unlike)
export async function POST(
  req: Request,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id: photoId } = await params;
    const body = await req.json().catch(() => null);
    const fingerprint = typeof body?.fingerprint === "string" ? body.fingerprint : null;

    if (!fingerprint) {
      return NextResponse.json(
        { ok: false, error: "Fingerprint is required." },
        { status: 400 }
      );
    }

    // Check photo exists
    const photo = await prisma.photo.findUnique({ where: { id: photoId }, select: { id: true } });
    if (!photo) {
      return NextResponse.json({ ok: false, error: "Photo not found." }, { status: 404 });
    }

    // Idempotent upsert — if already liked, just return the current count
    await prisma.photoLike.upsert({
      where: { photoId_fingerprint: { photoId, fingerprint } },
      update: {},
      create: { photoId, fingerprint },
    });

    const count = await prisma.photoLike.count({ where: { photoId } });

    return NextResponse.json({ ok: true, data: { count, liked: true } });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong." },
      { status: 500 }
    );
  }
}
