"use client";

import { useState } from "react";
import { useCreatePhoto, useDeletePhoto, usePhotos } from "@/lib/api/photos";
import { ScreenshotUpload } from "@/components/screenshot-upload";
import { ListSkeleton } from "@/components/skeleton";
import { FestiveSpinner } from "@/components/festive-spinner";

export function GalleryManager() {
  const [url, setUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const photos = usePhotos();
  const create = useCreatePhoto();
  const del = useDeletePhoto();

  return (
    <div className="space-y-4">
      <form
        className="space-y-3 rounded-2xl border border-gold/30 bg-white p-5 shadow-sm"
        onSubmit={(e) => {
          e.preventDefault();
          if (!url) return;
          create.mutate(
            { url, caption: caption.trim() || undefined },
            {
              onSuccess: () => {
                setUrl(null);
                setCaption("");
              },
            }
          );
        }}
      >
        <h2 className="text-base font-semibold">Add photo</h2>
        <ScreenshotUpload
          url={url}
          onChange={setUrl}
          label="📸 Upload festival photo"
        />
        <input
          type="text"
          maxLength={100}
          placeholder="Caption (optional)"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="block h-12 w-full rounded-lg border border-gray-300 px-3 text-base focus:border-saffron focus:outline-none focus:ring-1 focus:ring-saffron"
        />
        <button
          type="submit"
          disabled={!url || create.isPending}
          className="h-12 w-full rounded-lg bg-maroon text-sm font-semibold text-cream active:bg-maroon/90 disabled:opacity-60"
        >
          {create.isPending ? (
            <span className="flex items-center justify-center gap-2">
              <FestiveSpinner size={18} /> Adding…
            </span>
          ) : (
            "Add to gallery"
          )}
        </button>
      </form>

      {photos.isPending ? (
        <ListSkeleton rows={2} rowClassName="h-32" />
      ) : photos.isError ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {photos.error.message}
        </p>
      ) : photos.data.length === 0 ? (
        <p className="rounded-2xl bg-white py-8 text-center text-sm text-gray-500 shadow-sm">
          No photos yet — add the first one above.
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {photos.data.map((p) => (
            <li key={p.id} className="overflow-hidden rounded-xl bg-white shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.url}
                alt={p.caption ?? "Festival photo"}
                loading="lazy"
                className="aspect-square w-full object-cover"
              />
              <div className="flex items-center justify-between gap-2 px-2 py-1.5">
                <p className="min-w-0 truncate text-xs text-gray-600">
                  {p.caption ?? "—"}
                </p>
                <button
                  type="button"
                  disabled={del.isPending}
                  onClick={() => {
                    if (window.confirm("Remove this photo from the gallery?")) {
                      del.mutate(p.id);
                    }
                  }}
                  className="shrink-0 text-xs font-medium text-red-600 disabled:opacity-60"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
