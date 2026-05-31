import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-white px-4 py-6 sm:px-6">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-center gap-6 text-sm text-[var(--muted)]">
        <Link href="/privacy" className="hover:text-[var(--foreground)] hover:underline">
          Privacy Policy
        </Link>
        <Link href="/terms" className="hover:text-[var(--foreground)] hover:underline">
          Terms &amp; Conditions
        </Link>
      </div>
    </footer>
  );
}
