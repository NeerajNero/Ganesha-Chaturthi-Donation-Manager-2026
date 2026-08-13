"use client";

import { useState } from "react";
import { GalleryImage } from "@/components/gallery-image";
import { PhotoModal } from "@/components/photo-modal";

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
  const [selected, setSelected] = useState<Photo | null>(null);

  return (
    <>
      <ul className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {photos.map((p) => (
          <li
            key={p.id}
            className="group relative overflow-hidden rounded-xl bg-white shadow-sm cursor-pointer"
            onClick={() => setSelected(p)}
          >
            <GalleryImage
              src={p.url}
              alt={p.caption ?? "Festival photo"}
            />

            {/* Bottom overlay: caption + like count */}
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-1 bg-gradient-to-t from-black/60 to-transparent px-2 pt-6 pb-2 opacity-0 group-hover:opacity-100 transition-opacity sm:opacity-100">
              {p.caption && (
                <p className="truncate text-[11px] font-medium text-white/90">
                  {p.caption}
                </p>
              )}
              <span className="ml-auto shrink-0 flex items-center gap-0.5 rounded-full bg-white/20 backdrop-blur-sm px-1.5 py-0.5 text-[11px] text-white">
                🤍 {p.likeCount}
              </span>
            </div>

            {/* Tap indicator for mobile */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 active:opacity-100 sm:hidden transition-opacity">
              <div className="rounded-full bg-black/30 px-3 py-1.5 text-[11px] font-semibold text-white">
                Tap to view
              </div>
            </div>
          </li>
        ))}
      </ul>

      {selected && (
        <PhotoModal
          photoId={selected.id}
          photoUrl={selected.url}
          caption={selected.caption}
          initialLikeCount={selected.likeCount}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
