"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { LikeButton } from "@/components/like-button";
import { CommentList } from "@/components/comment-list";
import { CommentForm } from "@/components/comment-form";

interface PhotoModalProps {
  photoId: string;
  photoUrl: string;
  caption?: string | null;
  initialLikeCount?: number;
  onClose: () => void;
}

export function PhotoModal({
  photoId,
  photoUrl,
  caption,
  initialLikeCount = 0,
  onClose,
}: PhotoModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Close on Escape key (but only if not in fullscreen — browser handles fs Escape)
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !document.fullscreenElement) onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  // Prevent body scroll while modal open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Sync fullscreen state with browser events
  useEffect(() => {
    function onFsChange() {
      setIsFullscreen(!!document.fullscreenElement);
    }
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const handleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        // Wrap img in a container so it fills the screen with black background
        await imgRef.current?.requestFullscreen?.();
      } else {
        await document.exitFullscreen?.();
      }
    } catch {
      // Fullscreen not supported — open in new tab as fallback
      window.open(photoUrl, "_blank", "noopener,noreferrer");
    }
  }, [photoUrl]);

  return (
    /* Backdrop */
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Photo details"
    >
      {/* Drawer panel */}
      <div className="animate-slide-up relative flex w-full max-w-lg flex-col rounded-t-3xl bg-cream shadow-2xl sm:max-h-[90vh] sm:rounded-3xl">
        {/* Drag handle */}
        <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-ink/20 sm:hidden" />

        {/* Header bar */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <p className="font-display text-sm text-gold">॥ श्री गणेशाय नमः ॥</p>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-ink/10 text-ink/60 hover:bg-ink/20 transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-8 space-y-5">
          {/* Photo with fullscreen button overlay */}
          <div className="group relative overflow-hidden rounded-2xl bg-black shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={photoUrl}
              alt={caption ?? "Festival photo"}
              className="w-full max-h-72 object-contain"
              style={{ background: "#000" }}
            />

            {/* Fullscreen button — visible on hover (desktop) / always on mobile */}
            <button
              type="button"
              onClick={handleFullscreen}
              aria-label={isFullscreen ? "Exit fullscreen" : "View fullscreen"}
              className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-xl bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/70 active:scale-90 sm:opacity-0 sm:group-hover:opacity-100"
            >
              {isFullscreen ? (
                /* Compress icon */
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 3v3a2 2 0 0 1-2 2H3"/>
                  <path d="M21 8h-3a2 2 0 0 1-2-2V3"/>
                  <path d="M3 16h3a2 2 0 0 1 2 2v3"/>
                  <path d="M16 21v-3a2 2 0 0 1 2-2h3"/>
                </svg>
              ) : (
                /* Expand icon */
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 8V5a2 2 0 0 1 2-2h3"/>
                  <path d="M21 8V5a2 2 0 0 1-2-2h-3"/>
                  <path d="M3 16v3a2 2 0 0 0 2 2h3"/>
                  <path d="M21 16v3a2 2 0 0 1-2 2h-3"/>
                </svg>
              )}
            </button>
          </div>

          {/* Caption + Like */}
          <div className="flex items-start justify-between gap-3">
            {caption ? (
              <p className="text-sm text-ink/80 leading-relaxed flex-1">{caption}</p>
            ) : (
              <span className="flex-1" />
            )}
            <LikeButton photoId={photoId} initialCount={initialLikeCount} />
          </div>

          {/* Divider */}
          <div className="h-px bg-gold/20" />

          {/* Comments section */}
          <div className="space-y-4">
            <h2 className="font-display text-base text-maroon">💬 Comments</h2>
            <CommentList photoId={photoId} />
            <div className="h-px bg-gold/20" />
            <CommentForm photoId={photoId} />
          </div>
        </div>
      </div>
    </div>
  );
}

