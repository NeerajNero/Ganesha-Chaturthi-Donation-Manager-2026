import nextDynamic from "next/dynamic";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getWallData } from "@/lib/public-data";
import {
  COMMITTEE_NAME,
  FESTIVAL_DATES,
  GOAL_AMOUNT,
  VENUE,
  VENUE_COORDS,
} from "@/lib/config";
import { mapsDirectionsUrl } from "@/lib/location";
import { GaneshaSvg } from "@/components/ganesha-svg";
import { Petals } from "@/components/petals";
import { Diya } from "@/components/diya";
import { MilestoneBanner } from "@/components/milestone-banner";

// Lazy client chunk; static Ganesha renders until (and unless) JS arrives.
const GaneshaScene = nextDynamic(
  () => import("@/components/ganesha-scene").then((m) => m.GaneshaScene),
  { loading: () => <GaneshaSvg className="h-auto w-full" /> }
);

export const dynamic = "force-dynamic";

const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default async function HomePage() {
  const [session, wall] = await Promise.all([getSession(), getWallData()]);
  const progress = Math.min(
    100,
    Math.round((wall.grandTotal / GOAL_AMOUNT) * 100)
  );
  const recent = wall.donations.slice(0, 6);

  return (
    <div className="relative flex-1 overflow-hidden bg-cream">
      <Petals />
      <div className="garland" />

      {session && (
        <div className="relative mx-auto mt-3 w-full max-w-lg px-4">
          <Link
            href={session.role === "ADMIN" ? "/admin" : "/collect"}
            className="block rounded-xl bg-maroon px-4 py-2.5 text-center text-sm font-semibold text-cream shadow"
          >
            Namaste {session.name} — go to my dashboard →
          </Link>
        </div>
      )}

      <main className="relative mx-auto w-full max-w-lg px-4 pb-10">
        {/* hero */}
        <section className="pt-6 text-center">
          <p className="font-display text-sm text-maroon">
            ॥ श्री गणेशाय नमः ॥
          </p>
          <div className="mx-auto mt-2 w-52 sm:w-60">
            <GaneshaScene />
          </div>
          <p className="mt-1 text-xs text-ink/50">
            psst — tap Bappa for a blessing
          </p>
          <h1 className="font-display mt-3 text-3xl leading-tight text-maroon">
            {COMMITTEE_NAME}
          </h1>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs font-medium">
            <span className="rounded-full bg-saffron/15 px-3 py-1.5 text-maroon">
              📅 {FESTIVAL_DATES}
            </span>
            {VENUE_COORDS ? (
              <a
                href={mapsDirectionsUrl(VENUE_COORDS)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-saffron/15 px-3 py-1.5 text-maroon underline underline-offset-2"
              >
                📍 {VENUE} →
              </a>
            ) : (
              <span className="rounded-full bg-saffron/15 px-3 py-1.5 text-maroon">
                📍 {VENUE}
              </span>
            )}
            <Link
              href="/live"
              className="rounded-full bg-maroon px-3 py-1.5 text-cream shadow-sm"
            >
              📣 Schedule & updates
            </Link>
            <Link
              href="/gallery"
              className="rounded-full bg-maroon px-3 py-1.5 text-cream shadow-sm"
            >
              📸 Gallery
            </Link>
          </div>
        </section>

        <div className="mt-6">
          <MilestoneBanner progress={progress} />
        </div>

        {/* live total */}
        <section className="mt-6 rounded-3xl border border-gold/40 bg-white p-6 text-center shadow-lg">
          <p className="text-xs uppercase tracking-widest text-ink/60">
            Collected so far
          </p>
          <p className="font-display mt-1 text-4xl text-maroon">
            {rupees(wall.grandTotal)}
          </p>
          <p className="mt-1 text-sm text-ink/60">
            of {rupees(GOAL_AMOUNT)} goal
          </p>
          <div className="mt-4 h-4 overflow-hidden rounded-full bg-cream ring-1 ring-gold/40">
            <div
              className="h-full rounded-full bg-gradient-to-r from-marigold to-gold"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-sm font-semibold text-ink/80">
            {progress}% of goal
          </p>
        </section>

        {/* recent contributors */}
        <section className="mt-8">
          <h2 className="font-display mb-3 text-center text-xl text-maroon">
            Recent contributors
          </h2>
          {recent.length === 0 ? (
            <p className="rounded-2xl bg-white py-6 text-center text-sm text-ink/60 shadow">
              Be the first to contribute this year 🙏
            </p>
          ) : (
            <ul className="grid grid-cols-2 gap-2">
              {recent.map((d) => (
                <li
                  key={d.id}
                  className="rounded-xl border border-gold/30 bg-white px-3 py-2.5 shadow-sm"
                >
                  <p className="truncate text-sm font-semibold">{d.name}</p>
                  <p className="truncate text-xs text-ink/50">{d.street}</p>
                  <p className="mt-0.5 text-sm font-bold text-maroon">
                    {rupees(d.amount)}
                  </p>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-center">
            <Link
              href="/wall"
              className="text-sm font-semibold text-maroon underline underline-offset-4"
            >
              View the full donation wall →
            </Link>
          </p>
        </section>

        {/* transparency */}
        <section className="mt-8 rounded-3xl bg-maroon p-6 text-cream shadow-lg">
          <h2 className="font-display flex items-center gap-2 text-xl">
            <Diya size={26} /> Where your money goes
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-cream/90">
            Every rupee is accounted for: the murti and mandap decoration,
            daily aarti and prasad. Every donation gets a numbered receipt, and
            all verified collections appear on our public wall — full
            transparency, always.
          </p>
        </section>

        <footer className="mt-10 space-y-2 text-center">
          <p className="font-display text-sm text-maroon/80">
            ॥ गणपति बाप्पा मोरया ॥
          </p>
          <Link
            href="/login"
            className="text-xs text-ink/40 underline underline-offset-2"
          >
            Volunteer login
          </Link>
        </footer>
      </main>

      <div className="garland rotate-180" />
    </div>
  );
}
