import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginForm } from "./_components/login-form";

export default async function LoginPage() {
  const session = await getSession();
  if (session) {
    redirect(session.role === "ADMIN" ? "/admin" : "/collect");
  }

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
