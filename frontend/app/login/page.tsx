import { Suspense } from "react";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-xl py-12">
      <section className="rounded-[2.5rem] border border-line bg-white p-8 shadow-card">
        <p className="text-sm uppercase tracking-[0.18em] text-pine/70">Account</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink">
          Login to save your shortlist
        </h1>
        <p className="mt-4 text-sm leading-7 text-ink/65">
          This MVP uses a lightweight email-based login so your saved colleges stay attached to
          you instead of a shared demo user.
        </p>
        <div className="mt-8">
          <Suspense fallback={<p className="text-sm text-ink/60">Loading login...</p>}>
            <LoginForm />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
