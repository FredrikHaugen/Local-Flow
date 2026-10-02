import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

// A plain 404: no page sections, so the static 404.html stays small. Not indexed.
export const metadata: Metadata = {
  title: `Page not found — ${SITE.name}`,
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-md flex-1 flex-col justify-center gap-4 px-6 py-24">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-muted">There&rsquo;s nothing at this address.</p>
      <Link href="/" className="font-semibold text-accent-ink underline underline-offset-4">
        Go to the {SITE.name} home page
      </Link>
    </main>
  );
}
