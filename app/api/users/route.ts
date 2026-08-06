import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { createUserSchema } from "@/lib/validators";

export async function GET() {
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

    const [volunteers, totals] = await Promise.all([
      prisma.user.findMany({
        where: { role: "VOLUNTEER" },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          username: true,
          name: true,
          active: true,
          createdAt: true,
          _count: { select: { donations: true } },
        },
      }),
      prisma.donation.groupBy({
        by: ["collectedById"],
        _sum: { amount: true },
      }),
    ]);

    const totalByUser = new Map(
      totals.map((t) => [t.collectedById, t._sum.amount ?? 0])
    );

    const data = volunteers.map((v) => ({
      id: v.id,
      username: v.username,
      name: v.name,
      active: v.active,
      createdAt: v.createdAt,
      donationCount: v._count.donations,
      totalCollected: totalByUser.get(v.id) ?? 0,
    }));

    return NextResponse.json({ ok: true, data });
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

    const body = await req.json().catch(() => null);
    const parsed = createUserSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { username, password, name } = parsed.data;
    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { username, password: hash, name, role: "VOLUNTEER" },
      select: { id: true, username: true, name: true, active: true },
    });

    return NextResponse.json({ ok: true, data: user }, { status: 201 });
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      return NextResponse.json(
        { ok: false, error: "Username is already taken" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
