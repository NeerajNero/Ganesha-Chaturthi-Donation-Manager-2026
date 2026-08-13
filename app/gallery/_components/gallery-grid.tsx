"use client";

import Link from "next/link";
import { GalleryImage } from "@/components/gallery-image";

interface Photo {
  id: string;
  url: string;
  caption: string | null;
  likeCount: number;
}

interface GalleryGridProps {
  photos: Photo[];
}

export function GalleryGrid({ photos }: GalleryGridProps) {
  return (

    <ul className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
      {photos.map((p) => (
        <li
          key={p.id}
          className="group relative overflow-hidden rounded-xl bg-white shadow-sm"
        >
          <Link href={`/gallery/${p.id}`} className="block relative cursor-pointer">
            <GalleryImage
              src={p.url}
              alt={p.caption ?? "Festival photo"}
            />

            {/* Bottom overlay: caption + like count */}
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-1 bg-gradient-to-t from-black/80 to-transparent px-2 pt-8 pb-2 opacity-100">
              {p.caption && (
                <p className="truncate text-[11px] font-medium text-white/90">
                  {p.caption}
                </p>
              )}
              <span className="ml-auto shrink-0 flex items-center gap-0.5 rounded-full bg-white/20 backdrop-blur-sm px-1.5 py-0.5 text-[11px] text-white">
                🤍 {p.likeCount}
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

