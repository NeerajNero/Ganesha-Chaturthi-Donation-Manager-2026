import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { COMMITTEE_NAME } from "@/lib/config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Gallery — ${COMMITTEE_NAME}`,
};

export default async function GalleryPage() {
  const photos = await prisma.photo.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <main className="flex-1 bg-cream">
      <header className="bg-maroon pb-5 pt-6 text-center text-cream">
        <p className="font-display text-xs text-gold">॥ श्री गणेशाय नमः ॥</p>
        <h1 className="font-display mt-1 px-4 text-2xl">{COMMITTEE_NAME}</h1>
        <p className="text-sm text-cream/80">📸 Festival gallery</p>
      </header>
      <div className="garland" />

      <div className="mx-auto w-full max-w-lg px-4 pb-10">
        {photos.length === 0 ? (
          <p className="mt-8 rounded-2xl bg-white py-8 text-center text-sm text-ink/60 shadow">
            Photos will appear here as the festival preparations begin 🙏
          </p>
        ) : (
          <ul className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {photos.map((p) => (
              <li key={p.id} className="overflow-hidden rounded-xl bg-white shadow-sm">
                <a href={p.url} target="_blank" rel="noopener noreferrer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.url}
                    alt={p.caption ?? "Festival photo"}
                    loading="lazy"
                    className="aspect-square w-full object-cover"
                  />
                </a>
                {p.caption && (
                  <p className="truncate px-2 py-1.5 text-xs text-ink/70">
                    {p.caption}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}

        <footer className="mt-8 flex items-center justify-center gap-5 text-sm">
          <Link href="/" className="font-medium text-maroon underline underline-offset-4">
            🏠 Home
          </Link>
          <Link href="/live" className="font-medium text-maroon underline underline-offset-4">
            📣 Updates
          </Link>
          <Link href="/wall" className="font-medium text-maroon underline underline-offset-4">
            🪔 Donation wall
          </Link>
        </footer>
      </div>
    </main>
  );
}
