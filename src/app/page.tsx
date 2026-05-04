"use client"

import { useState } from "react"
import Link from "next/link"
import { BookingDialog } from "@/components/landing/BookingDialog"
import {
  ArrowRightIcon,
  CheckIcon,
  StarIcon,
  ClockIcon,
  ShieldIcon,
  GlobeIcon,
  FileTextIcon,
  ZapIcon,
  BuildingIcon,
  CreditCardIcon,
} from "lucide-react"

export default function LandingPage() {
  const [bookingOpen, setBookingOpen] = useState(false)

  const openBooking = () => setBookingOpen(true)

  return (
    <>
      <BookingDialog open={bookingOpen} onOpenChange={setBookingOpen} />

      <div className="min-h-screen bg-paper text-ink">
        {/* ---- Header ---- */}
        <header className="fixed inset-x-0 top-0 z-50 border-b border-line/60 bg-paper/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-3.5">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand shadow-sm">
                <FileTextIcon className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-sm tracking-tight">Reimburse</span>
            </Link>
            <nav className="flex items-center gap-2">
              <a href="#features" className="rounded-lg px-3 py-2 text-sm text-mute transition-colors hover:text-ink">
                Features
              </a>
              <a href="#pricing" className="rounded-lg px-3 py-2 text-sm text-mute transition-colors hover:text-ink">
                Pricing
              </a>
              <Link href="/demo" className="rounded-lg px-3 py-2 text-sm text-mute transition-colors hover:text-ink">
                Demo
              </Link>
              <button
                onClick={openBooking}
                className="ml-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-all hover:bg-brand-dark hover:shadow-md"
              >
                Book a demo
              </button>
            </nav>
          </div>
        </header>

        <main>
          {/* ---- Hero ---- */}
          <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-24 pb-16">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-brand/5 blur-3xl" />
              <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-brand/5 blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-4xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-1.5 text-xs font-medium text-brand">
                <span className="grid h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Now supporting Nordic public sector
              </div>

              <h1 className="mx-auto max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl leading-[1.08]">
                Reimbursements,{" "}
                <span className="text-brand">finally simple.</span>
              </h1>

              <p className="mx-auto mt-5 max-w-xl text-lg text-mute leading-relaxed">
                The reimbursement tool built for public sector workers. Drop receipts, submit, done — no training, no enterprise complexity.
              </p>

              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={openBooking}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-3 text-sm font-medium text-white shadow-md transition-all hover:bg-brand-dark hover:shadow-lg"
                >
                  Book a 15-minute demo
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
                <Link
                  href="/demo"
                  className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-6 py-3 text-sm font-medium transition-all hover:border-brand/30 hover:text-brand"
                >
                  Try the demo
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-5 text-sm text-mute">
                {[
                  "GDPR compliant",
                  "EU-hosted data",
                  "No credit card",
                  "5-minute setup",
                ].map((item) => (
                  <span key={item} className="flex items-center gap-1.5">
                    <CheckIcon className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-12 border-t border-line/80 pt-8">
                <p className="text-xs font-medium uppercase tracking-widest text-mute/60">
                  Trusted by public sector teams
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-mute/70">
                  <span>Oslo</span>
                  <span>Stockholm</span>
                  <span>Copenhagen</span>
                  <span>Helsinki</span>
                  <span>Bergen</span>
                </div>
              </div>
            </div>
          </section>

          {/* ---- Problem ---- */}
          <section className="border-t border-line/60 bg-white/60">
            <div className="mx-auto max-w-6xl px-6 py-24">
              <div className="mb-16 text-center">
                <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-brand">
                  The problem
                </p>
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Your finance team wastes hours on paperwork
                </h2>
              </div>
              <div className="grid gap-6 sm:grid-cols-3">
                {[
                  {
                    stat: "4 hours",
                    label: "Average time spent per reimbursement report with legacy tools",
                  },
                  {
                    stat: "3 months",
                    label: "Typical implementation time for enterprise expense software",
                  },
                  {
                    stat: "€40/month",
                    label: "Per-user cost of SAP Concur — before training and setup fees",
                  },
                ].map(({ stat, label }) => (
                  <div
                    key={stat}
                    className="rounded-xl border border-line bg-white p-6 text-center"
                  >
                    <p className="text-4xl font-bold text-brand">{stat}</p>
                    <p className="mt-2 text-sm text-mute leading-relaxed">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ---- Comparison ---- */}
          <section className="mx-auto max-w-6xl px-6 py-16">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-brand">
                  Reimburse vs. enterprise
                </p>
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Built for the public sector, not the Fortune 500.
                </h2>
                <p className="mt-4 text-mute leading-relaxed">
                  Enterprise tools are designed for corporations with dedicated finance departments.
                  Reimburse is designed for municipal workers who file a few reports a year — and
                  want to get back to their actual job.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    "Approval workflow included — no extra setup",
                    "All Nordic currencies with live FX rates",
                    "Data stored in the EU — GDPR compliant",
                    "Per-transaction pricing — pay only when you submit",
                    "PDF generation built-in — no extra tools needed",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm">
                      <CheckIcon className="mt-0.5 h-4 w-4 text-brand shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Setup time", ours: "5 minutes", theirs: "3 months" },
                  { label: "Cost per report", ours: "€2.50", theirs: "€20–40/month min" },
                  { label: "Training required", ours: "None", theirs: "Mandatory courses" },
                  { label: "PDF generation", ours: "One click", theirs: "IT ticket + 3 days" },
                  { label: "Support", ours: "Direct email", theirs: "Ticket queue" },
                ].map(({ label, ours, theirs }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-4 rounded-xl border border-line bg-white p-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-mute w-32 shrink-0">
                      {label}
                    </p>
                    <div className="flex gap-6 text-right">
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-mute">Reimburse</p>
                        <p className="text-sm font-semibold text-brand">{ours}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-mute">SAP Concur</p>
                        <p className="text-sm font-semibold text-red-500">{theirs}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ---- How it works ---- */}
          <section className="border-t border-line/60 bg-white/60">
            <div className="mx-auto max-w-6xl px-6 py-24">
              <div className="mb-16 text-center">
                <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-brand">
                  How it works
                </p>
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Three steps to reimbursement
                </h2>
                <p className="mt-3 text-mute">
                  From receipt to approved in minutes, not weeks.
                </p>
              </div>
              <div className="grid gap-8 sm:grid-cols-3">
                {[
                  {
                    step: "01",
                    title: "Create a report",
                    desc: "Name your report, choose your currency. Your identity is saved — no re-entering every time.",
                    icon: FileTextIcon,
                  },
                  {
                    step: "02",
                    title: "Drop your receipts",
                    desc: "Drag images, paste from clipboard, or drop PDFs. Categorize each one. FX conversion is automatic.",
                    icon: ZapIcon,
                  },
                  {
                    step: "03",
                    title: "Submit & download",
                    desc: "One click submits for approval. Another downloads a formatted PDF — ready for your finance team.",
                    icon: ShieldIcon,
                  },
                ].map(({ step, title, desc, icon: Icon }) => (
                  <div key={step} className="text-center">
                    <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-brand/10">
                      <Icon className="h-6 w-6 text-brand" />
                    </div>
                    <div className="mb-3 text-4xl font-semibold text-line/80">{step}</div>
                    <h3 className="mb-2 text-base font-semibold">{title}</h3>
                    <p className="text-sm text-mute leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ---- Testimonial ---- */}
          <section className="mx-auto max-w-3xl px-6 py-24 text-center">
            <div className="mb-6 flex justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className="h-5 w-5 fill-brand text-brand" />
              ))}
            </div>
            <blockquote className="text-2xl font-medium leading-relaxed tracking-tight sm:text-3xl">
              &ldquo;We went from paper forms and 3-week turnaround to instant submissions.
              Our finance team finally has weekends back.&rdquo;
            </blockquote>
            <div className="mt-8">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand/10 text-sm font-semibold text-brand">
                MK
              </div>
              <p className="mt-3 text-sm font-semibold">Mette Karlsen</p>
              <p className="text-sm text-mute">Finance Director, Bergen kommune</p>
            </div>
          </section>

          {/* ---- Features ---- */}
          <section id="features" className="border-t border-line/60 bg-white/60">
            <div className="mx-auto max-w-6xl px-6 py-24">
              <div className="mb-16 text-center">
                <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-brand">
                  Features
                </p>
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Everything you need, nothing you don&apos;t
                </h2>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    icon: GlobeIcon,
                    title: "Multi-currency support",
                    desc: "NOK, SEK, DKK, EUR, and 10+ more. Live FX rates mean accurate conversions every time.",
                  },
                  {
                    icon: ClockIcon,
                    title: "Approval workflows",
                    desc: "Built-in multi-step approvals. Submitters file, approvers review, finance receives — all in one place.",
                  },
                  {
                    icon: ShieldIcon,
                    title: "EU data residency",
                    desc: "All data stored in the EU. GDPR compliant by default. No data leaves European servers.",
                  },
                  {
                    icon: FileTextIcon,
                    title: "Instant PDF generation",
                    desc: "One click downloads a formatted, compliant PDF. No formatting, no IT tickets, no waiting.",
                  },
                  {
                    icon: BuildingIcon,
                    title: "Organization dashboard",
                    desc: "Finance teams get a real-time dashboard of all reports, spend by category, and approval status.",
                  },
                  {
                    icon: CreditCardIcon,
                    title: "Pay per submission",
                    desc: "No monthly per-user fees. You pay €2.50 only when a report is submitted — nothing more.",
                  },
                ].map(({ icon: Icon, title, desc }) => (
                  <div
                    key={title}
                    className="rounded-xl border border-line bg-white p-6 transition-all hover:border-brand/30 hover:shadow-sm"
                  >
                    <div className="mb-3 grid h-10 w-10 place-items-center rounded-lg bg-brand/10">
                      <Icon className="h-5 w-5 text-brand" />
                    </div>
                    <h3 className="mb-1.5 text-sm font-semibold">{title}</h3>
                    <p className="text-sm text-mute leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ---- Pricing ---- */}
          <section id="pricing" className="mx-auto max-w-6xl px-6 py-24">
            <div className="mb-16 text-center">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-brand">
                Pricing
              </p>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Pay only for what you use
              </h2>
              <p className="mt-3 text-mute">
                No per-user monthly fees. No enterprise contracts.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {[
                {
                  tier: "Free",
                  price: "€0",
                  period: "Forever",
                  desc: "Perfect for trying things out",
                  features: [
                    "3 reports per month",
                    "Basic receipt categories",
                    "PDF download",
                    "Email support",
                  ],
                  cta: "Try the demo",
                  href: "/demo",
                  highlight: false,
                },
                {
                  tier: "Pay as you go",
                  price: "€2.50",
                  period: "Per submitted report",
                  desc: "For regular public sector workers",
                  features: [
                    "Unlimited reports",
                    "All receipt categories",
                    "Multi-currency FX",
                    "Priority email support",
                    "Approval workflow",
                    "Download + email PDF",
                  ],
                  cta: "Book a demo",
                  onClick: openBooking,
                  highlight: true,
                },
                {
                  tier: "Organization",
                  price: "Custom",
                  period: "Volume pricing",
                  desc: "For agencies and municipalities",
                  features: [
                    "Everything in Pay as you go",
                    "Unlimited submitters",
                    "Org-wide dashboard",
                    "API access",
                    "Dedicated support",
                    "Custom compliance",
                  ],
                  cta: "Contact us",
                  href: "mailto:hello@reimburse.app",
                  highlight: false,
                },
              ].map(({ tier, price, period, desc, features, cta, href, onClick, highlight }) => (
                <div
                  key={tier}
                  className={`rounded-2xl border p-6 flex flex-col ${
                    highlight
                      ? "border-brand shadow-lg shadow-brand/10 bg-brand/[0.02]"
                      : "border-line/80 bg-white"
                  }`}
                >
                  <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-wide text-mute">
                      {tier}
                    </p>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="text-4xl font-semibold">{price}</span>
                      {period && (
                        <span className="text-sm text-mute">/ {period.toLowerCase()}</span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-mute">{desc}</p>
                  </div>
                  <ul className="mb-8 space-y-2.5 flex-1">
                    {features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm">
                        <CheckIcon
                          className={`mt-0.5 h-4 w-4 shrink-0 ${
                            highlight ? "text-brand" : "text-emerald-500"
                          }`}
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {onClick ? (
                    <button
                      onClick={onClick}
                      className="w-full rounded-lg bg-brand px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-brand-dark"
                    >
                      {cta}
                    </button>
                  ) : href?.startsWith("mailto:") ? (
                    <a
                      href={href}
                      className="w-full rounded-lg border border-line bg-white px-6 py-2.5 text-sm font-medium text-center block transition-all hover:border-brand/30 hover:text-brand"
                    >
                      {cta}
                    </a>
                  ) : (
                    <Link
                      href={href ?? "#"}
                      className="w-full rounded-lg border border-line bg-white px-6 py-2.5 text-sm font-medium text-center block transition-all hover:border-brand/30 hover:text-brand"
                    >
                      {cta}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* ---- FAQ ---- */}
            <div className="mx-auto mt-20 max-w-3xl">
              <h3 className="mb-8 text-center text-xl font-semibold tracking-tight">
                Frequently asked questions
              </h3>
              <div className="grid gap-6 sm:grid-cols-2">
                {[
                  {
                    q: "What counts as a submitted report?",
                    a: "A report sent for approval that is no longer in draft. You can add unlimited receipts before submitting.",
                  },
                  {
                    q: "Where is my data stored?",
                    a: "All data is stored on EU servers. We never sell or share your personal or financial information.",
                  },
                  {
                    q: "Can I cancel anytime?",
                    a: "Yes. Pay-as-you-go means no monthly commitment — you only pay when you submit a report.",
                  },
                  {
                    q: "Which currencies are supported?",
                    a: "EUR, USD, GBP, NOK, SEK, DKK, ISK, CHF, PLN, CZK, HUF, JPY, CAD, AUD, BRL — with live FX rates.",
                  },
                  {
                    q: "How does the approval workflow work?",
                    a: "Submitters create and send reports. Approvers review and accept or reject. Finance receives approved PDFs automatically.",
                  },
                  {
                    q: "Is it approved for government use?",
                    a: "We are working towards common public sector compliance standards. Contact us for your specific requirements.",
                  },
                ].map(({ q, a }) => (
                  <div key={q} className="space-y-1.5">
                    <h4 className="text-sm font-semibold">{q}</h4>
                    <p className="text-sm text-mute leading-relaxed">{a}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ---- Final CTA ---- */}
          <section className="border-t border-line/60 bg-brand">
            <div className="mx-auto max-w-3xl px-6 py-20 text-center text-white">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Ready to simplify reimbursements?
              </h2>
              <p className="mt-3 text-lg text-white/70">
                See how Reimburse works for your team in 15 minutes. No commitment, no sales pitch.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={openBooking}
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-brand shadow-md transition-all hover:bg-white/95 hover:shadow-lg"
                >
                  Book your demo
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
                <Link
                  href="/demo"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3 text-sm font-medium text-white transition-all hover:border-white/60 hover:bg-white/10"
                >
                  Try the demo
                </Link>
              </div>
            </div>
          </section>
        </main>

        {/* ---- Footer ---- */}
        <footer className="border-t border-line/60 bg-white/60 py-10">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-wrap items-center justify-center gap-6 mb-6">
              <Link
                href="/demo"
                className="text-sm text-mute transition-colors hover:text-ink"
              >
                Demo
              </Link>
              <button
                onClick={openBooking}
                className="text-sm text-mute transition-colors hover:text-ink"
              >
                Book a demo
              </button>
              <a
                href="mailto:hello@reimburse.app"
                className="text-sm text-mute transition-colors hover:text-ink"
              >
                Contact
              </a>
              <Link
                href="/privacy"
                className="text-sm text-mute transition-colors hover:text-ink"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-mute transition-colors hover:text-ink"
              >
                Terms
              </Link>
            </div>
            <p className="text-center text-xs text-mute">
              &copy; {new Date().getFullYear()} Reimburse. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}
