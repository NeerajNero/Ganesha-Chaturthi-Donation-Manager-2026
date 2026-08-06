import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { updateUserSchema } from "@/lib/validators";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { ok: false, error: "Not logged in" },
        { status: 401 }
      );
    }
    if (session.role !== "ADMIN") {
      return NextResponse.json(
        { ok: false, error: "Admin access required" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await req.json().catch(() => null);
    const parsed = updateUserSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const target = await prisma.user.findUnique({ where: { id } });
    if (!target || target.role !== "VOLUNTEER") {
      return NextResponse.json(
        { ok: false, error: "Volunteer not found" },
        { status: 404 }
      );
    }

    const { active, password } = parsed.data;
    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(active !== undefined ? { active } : {}),
        ...(password ? { password: await bcrypt.hash(password, 10) } : {}),
      },
      select: { id: true, username: true, name: true, active: true },
    });

    return NextResponse.json({ ok: true, data: user });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
