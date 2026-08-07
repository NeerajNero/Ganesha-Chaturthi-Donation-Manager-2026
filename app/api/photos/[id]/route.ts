import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
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
    const existing = await prisma.photo.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Photo not found" },
        { status: 404 }
      );
    }

    await prisma.photo.delete({ where: { id } });
    return NextResponse.json({ ok: true, data: null });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
