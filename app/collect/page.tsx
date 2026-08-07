import { getSession } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";
import { DonationForm } from "./_components/donation-form";
import { TodayList } from "./_components/today-list";
import { StreetProgress } from "./_components/street-progress";

export default async function CollectPage() {
  const session = await getSession();

  return (
    <div className="flex flex-1 flex-col bg-cream">
      <header className="sticky top-0 z-10 border-b border-gold/30 bg-white">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-2 px-4 py-3">
          <div className="min-w-0">
            <p className="font-display text-base text-maroon">🙏 GU26 Collect</p>
            <p className="truncate text-xs text-gray-500">{session?.name}</p>
          </div>
          <LogoutButton />
        </div>
      </header>
      <main className="mx-auto w-full max-w-lg flex-1 space-y-6 px-4 py-5">
        <DonationForm />
        <TodayList />
        <StreetProgress />
      </main>
    </div>
  );
}
