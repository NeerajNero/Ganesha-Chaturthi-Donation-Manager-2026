import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { COMMITTEE_NAME } from "@/lib/config";
import { Pagination } from "@/components/pagination";
import { GalleryGrid } from "./_components/gallery-grid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Gallery — ${COMMITTEE_NAME}`,
};

const PAGE_SIZE = 12;

interface GalleryPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function GalleryPage({ searchParams }: GalleryPageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);

  const [rawPhotos, total] = await Promise.all([
    prisma.photo.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        _count: { select: { likes: true } },
      },
    }),
    prisma.photo.count(),
  ]);

  const photos = rawPhotos.map((p) => ({
    id: p.id,
    url: p.url,
    caption: p.caption,
    likeCount: p._count.likes,
  }));

  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;

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
          <>
            <GalleryGrid photos={photos} />

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              baseUrl="/gallery"
            />
          </>
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
