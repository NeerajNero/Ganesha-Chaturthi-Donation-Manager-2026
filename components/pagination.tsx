"use client";

import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  baseUrl?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  baseUrl,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const prevPage = Math.max(1, currentPage - 1);
  const nextPage = Math.min(totalPages, currentPage + 1);

  const getHref = (page: number) => {
    if (!baseUrl) return "";
    const separator = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${separator}page=${page}`;
  };

  // Generate range of page numbers around currentPage
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push("...");
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }

    return pages;
  };

  const renderPageItem = (p: number | string, index: number) => {
    if (typeof p === "string") {
      return (
        <span
          key={`ellipsis-${index}`}
          className="flex h-9 w-8 items-center justify-center text-xs text-ink/40"
        >
          {p}
        </span>
      );
    }

    const isActive = p === currentPage;
    const itemClass = `flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
      isActive
        ? "bg-maroon text-cream shadow-sm"
        : "bg-white text-ink/80 border border-gold/30 hover:bg-gold/10 hover:text-maroon"
    }`;

    if (baseUrl) {
      return (
        <Link key={p} href={getHref(p)} className={itemClass}>
          {p}
        </Link>
      );
    }

    return (
      <button
        key={p}
        type="button"
        onClick={() => onPageChange?.(p)}
        className={itemClass}
      >
        {p}
      </button>
    );
  };

  const renderNavBtn = (
    label: string,
    targetPage: number,
    isDisabled: boolean
  ) => {
    const btnClass = `flex h-9 items-center justify-center rounded-lg border border-gold/40 px-3 text-xs font-semibold transition-all ${
      isDisabled
        ? "cursor-not-allowed opacity-40 bg-gray-100 text-gray-400"
        : "bg-white text-maroon hover:bg-maroon hover:text-cream shadow-sm"
    }`;

    if (isDisabled) {
      return (
        <span className={btnClass} aria-disabled="true">
          {label}
        </span>
      );
    }

    if (baseUrl) {
      return (
        <Link href={getHref(targetPage)} className={btnClass}>
          {label}
        </Link>
      );
    }

    return (
      <button
        type="button"
        onClick={() => onPageChange?.(targetPage)}
        className={btnClass}
      >
        {label}
      </button>
    );
  };

  return (
    <nav
      aria-label="Pagination"
      className="mt-8 flex flex-col items-center gap-3"
    >
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {renderNavBtn("← Prev", prevPage, currentPage === 1)}

        <div className="flex items-center gap-1">
          {getPageNumbers().map((p, idx) => renderPageItem(p, idx))}
        </div>

        {renderNavBtn("Next →", nextPage, currentPage === totalPages)}
      </div>

      <p className="text-xs font-medium text-ink/50">
        Page {currentPage} of {totalPages}
      </p>
    </nav>
  );
}
