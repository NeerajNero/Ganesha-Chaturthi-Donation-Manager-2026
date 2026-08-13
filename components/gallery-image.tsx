"use client";

import { useState } from "react";
import { FestiveSpinner } from "@/components/festive-spinner";

interface GalleryImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: string;
}

export function GalleryImage({
  src,
  alt,
  className = "aspect-square w-full object-cover",
  containerClassName = "relative overflow-hidden bg-cream/50",
  aspectRatio = "aspect-square",
}: GalleryImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`${containerClassName} ${aspectRatio} relative flex items-center justify-center`}>
      {isLoading && !hasError && (
        <div
          aria-hidden="true"
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 animate-pulse bg-amber-100/60 p-2 text-center text-xs text-ink/50"
        >
          <FestiveSpinner size={24} />
          <span className="font-medium text-[11px] text-maroon/70">Loading...</span>
        </div>
      )}

      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 p-2 text-center text-xs text-gray-400">
          <span className="text-xl">📷</span>
          <span className="mt-1 text-[11px]">Image unavailable</span>
        </div>
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          className={`${className} ${
            isLoading ? "opacity-0 scale-95" : "opacity-100 scale-100"
          } transition-all duration-300 ease-out`}
        />
      )}
    </div>
  );
}
