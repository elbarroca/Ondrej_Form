'use client'

import Link from 'next/link'

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-line/60 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="flex min-w-0 items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-brand shadow-sm">
              <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="font-mono text-[11px] uppercase tracking-widest text-mute sm:text-xs">reimburse</span>
          </Link>
          <nav className="flex items-center gap-1">
            <ShellLink href="/">Trips</ShellLink>
            <ShellLink href="/identity">Identity</ShellLink>
            <ShellLink href="/demo">Demo</ShellLink>
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
  )
}

function ShellLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="rounded-md px-3 py-1.5 text-sm text-ink transition-colors hover:bg-slate-100">
      {children}
    </Link>
  )
}
