import Link from "next/link";
import { getSession } from "@/lib/auth";
import { LoginForm } from "./_components/login-form";

export default async function LoginPage() {
  const session = await getSession();

  return (
    <main className="flex flex-1 items-center justify-center bg-cream px-4">
      <div className="w-full max-w-sm">
        <p className="font-display mb-1 text-center text-xs text-maroon/80">
          ॥ श्री गणेशाय नमः ॥
        </p>
        <h1 className="font-display mb-1 text-center text-2xl text-maroon">
          🙏 Ganesh Utsav 2026
        </h1>
        <p className="mb-6 text-center text-sm text-ink/60">
          Donation collection — volunteer login
        </p>

        {session && (
          <Link
            href={session.role === "ADMIN" ? "/admin" : "/collect"}
            className="mb-4 block rounded-xl bg-maroon px-4 py-3 text-center text-sm font-semibold text-cream shadow active:bg-maroon/90"
          >
            Namaste {session.name} — go to my dashboard →
          </Link>
        )}

        <LoginForm />

        <div className="mt-5 flex items-center justify-center gap-5 text-sm">
          <Link
            href="/"
            className="font-medium text-maroon underline underline-offset-4"
          >
            🏠 Home
          </Link>
          <Link
            href="/wall"
            className="font-medium text-maroon underline underline-offset-4"
          >
            🪔 Donation wall
          </Link>
        </div>
      </div>
    </main>
  );
}
