import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { createUpdateSchema } from "@/lib/validators";

// Public — powers the /live page updates feed and the admin manager.
export async function GET() {
  try {
    const updates = await prisma.update.findMany({
      orderBy: { createdAt: "desc" },
      take: 30,
    });
    return NextResponse.json({ ok: true, data: updates });
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
    const parsed = createUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const update = await prisma.update.create({
      data: { message: parsed.data.message },
    });
    return NextResponse.json({ ok: true, data: update }, { status: 201 });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
