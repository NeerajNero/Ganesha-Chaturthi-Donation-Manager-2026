import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { COMMITTEE_NAME, FESTIVAL_DATES, SCHEDULE, VENUE } from "@/lib/config";
import { Diya } from "@/components/diya";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Schedule & Updates — ${COMMITTEE_NAME}`,
};

export default async function LivePage() {
  const updates = await prisma.update.findMany({
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  const timeFmt = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });

  return (
    <main className="flex-1 bg-cream">
      <header className="bg-maroon pb-5 pt-6 text-center text-cream">
        <p className="font-display text-xs text-gold">॥ श्री गणेशाय नमः ॥</p>
        <h1 className="font-display mt-1 px-4 text-2xl">{COMMITTEE_NAME}</h1>
        <p className="text-sm text-cream/80">
          📅 {FESTIVAL_DATES} · 📍 {VENUE}
        </p>
      </header>
      <div className="garland" />

      <div className="mx-auto w-full max-w-lg px-4 pb-10">
        <section className="mt-6">
          <h2 className="font-display mb-3 text-center text-xl text-maroon">
            📣 Latest updates
          </h2>
          {updates.length === 0 ? (
            <p className="rounded-2xl bg-white py-6 text-center text-sm text-ink/60 shadow">
              Announcements will appear here during the festival 🙏
            </p>
          ) : (
            <ul className="space-y-2">
              {updates.map((u) => (
                <li
                  key={u.id}
                  className="rounded-xl border border-gold/25 bg-white px-4 py-3 shadow-sm"
                >
                  <p className="text-sm leading-relaxed">{u.message}</p>
                  <p className="mt-1 text-xs text-ink/40">
                    {timeFmt.format(u.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-8">
          <h2 className="font-display mb-3 text-center text-xl text-maroon">
            🪔 Festival programme
          </h2>
          <ul className="space-y-2">
            {SCHEDULE.map((item) => (
              <li
                key={`${item.date}-${item.title}`}
                className="flex items-center gap-3 rounded-xl border border-gold/25 bg-white px-4 py-3 shadow-sm"
              >
                <Diya size={24} />
                <div className="min-w-0">
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-xs text-ink/50">
                    {item.date} ({item.day}) · {item.time}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <footer className="mt-8 flex items-center justify-center gap-5 text-sm">
          <Link href="/" className="font-medium text-maroon underline underline-offset-4">
            🏠 Home
          </Link>
          <Link href="/wall" className="font-medium text-maroon underline underline-offset-4">
            🪔 Donation wall
          </Link>
          <Link href="/gallery" className="font-medium text-maroon underline underline-offset-4">
            📸 Gallery
          </Link>
        </footer>
      </div>
    </main>
  );
}
