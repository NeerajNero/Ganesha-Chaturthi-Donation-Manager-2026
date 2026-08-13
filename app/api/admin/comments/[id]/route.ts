import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { z } from "zod";

type Params = { id: string };

const moderateSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
});

// PATCH /api/admin/comments/[id] — approve or reject a comment
export async function PATCH(
  req: Request,
  { params }: { params: Promise<Params> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { ok: false, error: session ? "Admin access required" : "Not logged in" },
        { status: session ? 403 : 401 }
      );
    }

    const { id } = await params;
    const body = await req.json().catch(() => null);
    const parsed = moderateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const existing = await prisma.photoComment.findUnique({ where: { id }, select: { id: true } });
    if (!existing) {
      return NextResponse.json({ ok: false, error: "Comment not found." }, { status: 404 });
    }

    const updated = await prisma.photoComment.update({
      where: { id },
      data: { status: parsed.data.status },
      select: { id: true, status: true },
    });

    return NextResponse.json({ ok: true, data: updated });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong." },
      { status: 500 }
    );
  }
}
