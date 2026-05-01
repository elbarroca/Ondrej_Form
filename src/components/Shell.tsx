"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const links = [
    { href: "/", label: "Trips" },
    { href: "/identity", label: "Identity" },
  ];
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-line bg-paper/85 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-2"
            aria-label="Reimburse home"
          >
            <span
              aria-hidden
              className="grid h-7 w-7 place-items-center rounded-md bg-ink text-paper text-xs font-bold"
            >
              R
            </span>
            <span className="font-mono text-[11px] uppercase tracking-widest text-mute sm:text-xs">
              reimburse
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            {links.map((l) => {
              const active =
                l.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`rounded-md px-3 py-1.5 text-sm transition ${
                    active
                      ? "bg-ink text-paper"
                      : "text-ink hover:bg-line/60"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6 sm:py-10">
        {children}
      </main>
      <footer className="border-t border-line py-5 text-center text-xs text-mute sm:py-6">
        Stored locally. Nothing leaves your browser.
      </footer>
    </div>
  );
}
