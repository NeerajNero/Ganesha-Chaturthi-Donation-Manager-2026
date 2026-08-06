import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";

const NAV_LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/donations", label: "Donations" },
  { href: "/admin/volunteers", label: "Volunteers" },
] as const;

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-cream">
      <header className="sticky top-0 z-10 border-b border-gold/30 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-2 px-4 py-3">
          <span className="font-display text-base text-maroon">🙏 GU26 Admin</span>
          <LogoutButton />
        </div>
        <nav className="mx-auto flex max-w-4xl gap-1 overflow-x-auto px-2 pb-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex h-11 shrink-0 items-center rounded-lg px-4 text-sm font-medium text-gray-700 active:bg-saffron/15"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>
      <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-6">{children}</div>
    </div>
  );
}
