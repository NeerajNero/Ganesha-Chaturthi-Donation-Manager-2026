import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { LikeButton } from "@/components/like-button";
import { CommentList } from "@/components/comment-list";
import { CommentForm } from "@/components/comment-form";

export const dynamic = "force-dynamic";

interface PhotoPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PhotoPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  return { title: `Photo Details` };
}

export default async function PhotoPage({ params }: PhotoPageProps) {
  const resolvedParams = await params;
  const photo = await prisma.photo.findUnique({
    where: { id: resolvedParams.id },
    include: { _count: { select: { likes: true } } },
  });

  if (!photo) return notFound();

  return (
    <main className="flex-1 bg-cream pb-12">
      <header className="sticky top-0 z-20 flex items-center border-b border-gold/30 bg-white/90 backdrop-blur px-4 py-3">
        <div className="mx-auto flex w-full max-w-lg items-center justify-between">
          <Link
            href="/gallery"
            className="flex h-9 items-center gap-1.5 rounded-lg pr-3 text-sm font-semibold text-maroon hover:bg-marigold/10 transition-colors"
          >
            <span className="text-lg leading-none">←</span> Back to gallery
          </Link>
          <p className="font-display text-xs text-gold">॥ श्री गणेशाय नमः ॥</p>
        </div>
      </header>
      
      <div className="mx-auto w-full max-w-lg px-4 pt-6 space-y-6">
        {/* Photo with open full size button */}
        <div className="group relative overflow-hidden rounded-2xl bg-black shadow-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.url}
            alt={photo.caption ?? "Festival photo"}
            className="w-full max-h-[70vh] object-contain"
          />

          <a
            href={photo.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View full size"
            className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-xl bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/70 active:scale-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 8V5a2 2 0 0 1 2-2h3"/>
              <path d="M21 8V5a2 2 0 0 1-2-2h-3"/>
              <path d="M3 16v3a2 2 0 0 0 2 2h3"/>
              <path d="M21 16v3a2 2 0 0 1-2 2h-3"/>
            </svg>
          </a>
        </div>

        {/* Caption + Like */}
        <div className="flex items-start justify-between gap-3 px-1">
          {photo.caption ? (
            <p className="text-sm text-ink/80 leading-relaxed flex-1">{photo.caption}</p>
          ) : (
            <span className="flex-1" />
          )}
          <LikeButton photoId={photo.id} initialCount={photo._count.likes} />
        </div>

        <div className="h-px bg-gold/20" />

        {/* Comments section */}
        <div className="space-y-4 px-1">
          <h2 className="font-display text-base text-maroon">💬 Comments</h2>
          <CommentList photoId={photo.id} />
          <div className="h-px bg-gold/20" />
          <CommentForm photoId={photo.id} />
        </div>
      </div>
    </main>
  );
}
