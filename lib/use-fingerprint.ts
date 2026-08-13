"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "gu26_fp";

function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Returns a stable UUID fingerprint stored in localStorage.
 * Returns null on the first render (SSR safe).
 */
export function useFingerprint(): string | null {
  const [fp, setFp] = useState<string | null>(null);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        stored = generateUUID();
        localStorage.setItem(STORAGE_KEY, stored);
      }
    } catch {
      stored = generateUUID();
    }
    // Use setTimeout to avoid synchronous setState inside effect (ESLint: react-hooks/set-state-in-effect)
    const value = stored;
    setTimeout(() => setFp(value), 0);
  }, []);

  return fp;
}
