"use client";

import { useRef, useState } from "react";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export function ScreenshotUpload({
  url,
  onChange,
}: {
  url: string | null;
  onChange: (url: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    return (
      <p className="text-xs text-gray-400">
        Screenshot upload unavailable (Cloudinary not configured).
      </p>
    );
  }

  async function upload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", UPLOAD_PRESET!);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: fd }
      );
      const json = (await res.json()) as { secure_url?: string };
      if (!res.ok || !json.secure_url) throw new Error("Upload failed");
      onChange(json.secure_url);
    } catch {
      setError("Upload failed — try again or submit without it.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void upload(file);
          e.target.value = "";
        }}
      />
      {url ? (
        <div className="flex items-center gap-3">
          {/* Cloudinary URLs are remote; plain img avoids next/image domain config */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt="Payment screenshot"
            className="h-16 w-16 rounded-lg border border-gray-200 object-cover"
          />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="h-11 rounded-lg border border-gray-300 px-3 text-sm text-gray-700 active:bg-gray-100"
          >
            Remove
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="h-11 rounded-lg border border-dashed border-gray-400 px-4 text-sm font-medium text-gray-600 active:bg-gray-100 disabled:opacity-60"
        >
          {uploading ? "Uploading…" : "📷 Upload payment screenshot (optional)"}
        </button>
      )}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
