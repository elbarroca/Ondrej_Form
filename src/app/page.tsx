"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
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
  UploadIcon,
  DownloadIcon,
  ChevronDownIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const PRICING_TIERS = [
  {
    tier: "Free",
    price: "€0",
    period: "Forever",
    desc: "Perfect for trying things out",
    features: ["3 reports per month", "Basic categories", "PDF download", "Email support"],
    cta: "Start a free report",
    href: "/login?next=/dashboard/agreements/new",
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
      "Priority support",
      "Approval workflow",
      "Download + email PDF",
    ],
    cta: "Book a demo",
    href: null,
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
]

const FEATURES = [
  { icon: GlobeIcon, title: "Multi-currency support", desc: "NOK, SEK, DKK, EUR, and 10+ currencies. Live FX rates for accurate conversions every time." },
  { icon: ClockIcon, title: "Approval workflows", desc: "Built-in multi-step approvals. Submitters file, approvers review, finance receives — all in one place." },
  { icon: ShieldIcon, title: "EU data residency", desc: "All data stored in the EU. GDPR compliant by default. No data leaves European servers." },
  { icon: FileTextIcon, title: "Instant PDF generation", desc: "One click downloads a formatted, compliant PDF. No formatting, no IT tickets, no waiting." },
  { icon: BuildingIcon, title: "Organization dashboard", desc: "Finance teams get a real-time dashboard of all reports, spend by category, and approval status." },
  { icon: CreditCardIcon, title: "Pay per submission", desc: "No monthly per-user fees. You pay €2.50 only when a report is submitted — nothing more." },
]

const FAQ_ITEMS = [
  { q: "What counts as a submitted report?", a: "A report sent for approval that is no longer in draft. You can add unlimited receipts before submitting." },
  { q: "Where is my data stored?", a: "All data is stored on EU servers. We never sell or share your personal or financial information." },
  { q: "Can I cancel anytime?", a: "Yes. Pay-as-you-go means no monthly commitment — you only pay when you submit a report." },
  { q: "Which currencies are supported?", a: "EUR, USD, GBP, NOK, SEK, DKK, ISK, CHF, PLN, CZK, HUF, RON, BGN, CAD — with live FX rates." },
  { q: "How does the approval workflow work?", a: "Submitters create and send reports. Approvers review and accept or reject. Finance receives approved PDFs automatically." },
  { q: "Is it approved for government use?", a: "We are working towards common public sector compliance standards. Contact us for your specific requirements." },
]

const PROBLEM_BARS = [
  { label: "Time spent per report", before: "4 hours", after: "12 minutes", fill: 8 },
  { label: "Approval turnaround", before: "14 days", after: "8 hours", fill: 6 },
  { label: "Software setup", before: "3 months", after: "5 minutes", fill: 5 },
  { label: "Lost receipts", before: "23% of reports", after: "0%", fill: 10 },
]

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const [showPerReportPrice, setShowPerReportPrice] = useState(true)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  // Scroll detection for header shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* ---- Header ---- */}
      <header
        className={`sticky top-0 z-50 border-b transition-shadow ${
          scrolled
            ? "border-line/60 bg-paper/82 backdrop-blur-xl shadow-[0_1px_2px_rgba(15,23,42,.04)]"
            : "border-transparent bg-paper/80 backdrop-blur-xl"
        }`}
      >
        <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-6 px-4 sm:px-6 py-3.5">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="grid size-[30px] place-items-center rounded-lg bg-brand text-white shadow-sm">
              <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="font-semibold text-sm tracking-tight hidden sm:inline">Reimburse</span>
          </Link>
          <nav className="flex items-center gap-0.5 sm:gap-1">
            <a href="#features" className="hidden sm:block px-3 py-2 rounded-lg text-[13.5px] text-mute hover:text-ink transition-colors">Product</a>
            <a href="#pricing" className="hidden sm:block px-3 py-2 rounded-lg text-[13.5px] text-mute hover:text-ink transition-colors">Pricing</a>
            <a href="#faq" className="hidden sm:block px-3 py-2 rounded-lg text-[13.5px] text-mute hover:text-ink transition-colors">FAQ</a>
            <Link href="/login" className="ml-1 sm:ml-2">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <a href="mailto:hello@reimburse.app">
              <Button variant="primary" size="sm">Book a demo</Button>
            </a>
          </nav>
        </div>
      </header>

      <main>
        {/* ---- Hero ---- */}
        <section ref={heroRef} className="relative overflow-hidden py-12 sm:py-16 lg:py-20">
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <span className="absolute top-[-40px] left-[12%] h-[380px] w-[380px] rounded-full bg-brand/7 blur-[80px]" />
            <span className="absolute bottom-[-60px] right-[12%] h-[320px] w-[320px] rounded-full bg-brand/7 blur-[80px]" />
          </div>

          <div className="relative max-w-[1180px] mx-auto px-4 sm:px-6 grid items-center gap-10 lg:gap-14 lg:grid-cols-[1fr_1.05fr]">
            <div className="text-center lg:text-left">
              <h1 className="text-[clamp(34px,4.5vw,54px)] font-semibold leading-[1.05] tracking-[-0.025em] text-balance">
                Reimbursements,<br />
                <span className="text-brand">finally simple.</span>
              </h1>

              <p className="mt-5 sm:mt-[18px] max-w-[480px] text-[17px] text-mute leading-[1.55] text-pretty lg:mx-0 mx-auto">
                Drop receipts. Submit. Done. Built for public sector workers — no enterprise complexity, no training required.
              </p>

              <div className="mt-8 sm:mt-[30px] flex flex-wrap gap-3 lg:justify-start justify-center">
                <a href="mailto:hello@reimburse.app">
                  <Button variant="primary" size="lg" rightIcon={<ArrowRightIcon className="size-3.5" />}>
                    Book a 15-minute demo
                  </Button>
                </a>
                <Link href="/login">
                  <Button variant="ghost" size="lg">Try the demo</Button>
                </Link>
              </div>

              <div className="mt-8 sm:mt-[30px] flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-mute lg:justify-start justify-center">
                {["GDPR compliant", "EU-hosted", "No credit card"].map((item) => (
                  <span key={item} className="inline-flex items-center gap-1.5">
                    <CheckIcon className="size-3.5 text-emerald shrink-0" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Product preview */}
            <div className="relative mt-6 lg:mt-0">
              <div className="rounded-2xl border border-line bg-white shadow-[0_30px_80px_-20px_rgba(15,23,42,.18),0_12px_30px_-12px_rgba(37,99,235,.10)] overflow-hidden" style={{ transform: "perspective(1400px) rotateY(-2deg) rotateX(2deg)" }}>
                <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-line bg-[#fafafa]">
                  <span className="size-2.5 rounded-full bg-[#e5e7eb]" />
                  <span className="size-2.5 rounded-full bg-[#e5e7eb]" />
                  <span className="size-2.5 rounded-full bg-[#e5e7eb]" />
                  <span className="ml-2 h-[18px] flex-1 rounded-md bg-[#f1f5f9]" />
                </div>
                <div className="p-4 grid grid-cols-[140px_1fr] gap-3.5 min-h-[320px] sm:min-h-[380px]">
                  <div className="flex flex-col gap-1.5">
                    <div className="h-2.5 rounded-md bg-brand/18" />
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-2.5 rounded-md bg-[#f1f5f9]" style={{ width: `${100 - i * 15}%` }} />
                    ))}
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <div className="grid grid-cols-3 gap-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-12 rounded-lg border border-line bg-[#fafafa]" />
                      ))}
                    </div>
                    <div className="border border-line rounded-[10px] divide-y divide-line-soft">
                      {["Approved", "Submitted", "Approved", "Draft", "Submitted"].map((status, i) => (
                        <div key={i} className="flex items-center gap-2 px-2.5 py-2.5 text-[11px]">
                          <span className="flex-1 h-2 rounded bg-[#f1f5f9]" />
                          <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-semibold ${
                            status === "Approved" ? "bg-emerald/12 text-[#047857]" :
                            status === "Submitted" ? "bg-amber/12 text-[#b45309]" :
                            "bg-slate-meta-bg text-slate-meta"
                          }`}>{status}</span>
                          <span className="w-[50px] h-2 rounded bg-[#e5e7eb]" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating cards */}
              <div className="hidden sm:flex absolute top-[10%] left-[-20px] animate-float bg-white border border-line rounded-[12px] px-3 py-2.5 shadow-[0_4px_16px_rgba(15,23,42,.06)] items-center gap-2.5 text-[11.5px]">
                <span className="grid size-6 place-items-center rounded-md bg-emerald text-white shrink-0">
                  <CheckIcon className="size-3" />
                </span>
                <div>
                  <div className="font-semibold">Receipt added</div>
                  <div className="text-[10.5px] text-mute">Categorized: Travel</div>
                </div>
              </div>
              <div className="hidden sm:flex absolute bottom-[14%] right-[-10px] animate-float bg-white border border-line rounded-[12px] px-3 py-2.5 shadow-[0_4px_16px_rgba(15,23,42,.06)] items-center gap-2.5 text-[11.5px]" style={{ animationDelay: "-3s" }}>
                <span className="grid size-6 place-items-center rounded-md bg-brand text-white shrink-0">
                  <ZapIcon className="size-3" />
                </span>
                <div>
                  <div className="font-semibold">FX automatic</div>
                  <div className="text-[10.5px] text-mute">SEK → EUR · live rate</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---- Problem ---- */}
        <section className="border-y border-line/60 bg-white/55 py-16 sm:py-24">
          <div className="max-w-[1120px] mx-auto px-4 sm:px-6">
            <div className="text-center max-w-[680px] mx-auto mb-10 sm:mb-12">
              <p className="mb-2 text-[12px] font-semibold uppercase tracking-[.14em] text-brand">The problem</p>
              <h2 className="text-[clamp(26px,3vw,38px)] font-semibold leading-[1.15] tracking-[-0.02em] text-balance">Your team wastes hours on paper forms</h2>
            </div>

            <div className="max-w-[880px] mx-auto flex flex-col gap-[18px]">
              {PROBLEM_BARS.map((bar, i) => (
                <div key={bar.label} className="bg-white border border-line rounded-[14px] px-4 sm:px-[22px] py-4 sm:py-[18px]">
                  <div className="flex justify-between items-baseline mb-2.5 flex-wrap gap-y-1">
                    <span className="text-sm font-semibold">{bar.label}</span>
                    <span className="text-[13px] text-mute tabular-nums">
                      Before: <span className="text-red font-medium">{bar.before}</span>
                      {" → "}
                      After: <span className="text-brand font-semibold">{bar.after}</span>
                    </span>
                  </div>
                  <div className="relative h-2.5 rounded-full bg-[#f1f5f9] overflow-hidden">
                    <span className="absolute inset-0 rounded-full bg-red/40" />
                    <span
                      className="relative block h-full rounded-full bg-gradient-to-r from-brand to-[#60a5fa] z-10 transition-all duration-1000 ease-out"
                      style={{ width: `${bar.fill}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- How it works ---- */}
        <section className="py-16 sm:py-24">
          <div className="max-w-[1120px] mx-auto px-4 sm:px-6">
            <div className="text-center max-w-[680px] mx-auto mb-10 sm:mb-12">
              <p className="mb-2 text-[12px] font-semibold uppercase tracking-[.14em] text-brand">How it works</p>
              <h2 className="text-[clamp(26px,3vw,38px)] font-semibold leading-[1.15] tracking-[-0.02em]">Three steps to reimbursement</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-7 max-w-[1100px] mx-auto">
              {[
                { step: "01", title: "Create a report", desc: "Name your report, choose your currency. Your identity is saved — no re-entering every time.", icon: FileTextIcon },
                { step: "02", title: "Drop your receipts", desc: "Drag images, paste from clipboard, or drop PDFs. Categorize each one. FX conversion is automatic.", icon: UploadIcon },
                { step: "03", title: "Submit & download", desc: "One click submits for approval. Another downloads a formatted PDF — ready for your finance team.", icon: DownloadIcon },
              ].map(({ step, title, desc, icon: Icon }) => (
                <div key={step} className="text-center">
                  <div className="mx-auto mb-3.5 grid size-14 place-items-center rounded-[18px] bg-brand/10 text-brand">
                    <Icon className="size-6" />
                  </div>
                  <div className="mb-2 text-[32px] font-semibold text-line/85 font-mono">{step}</div>
                  <h3 className="mb-1.5 text-base font-semibold">{title}</h3>
                  <p className="text-sm text-mute leading-[1.55] max-w-[280px] mx-auto">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Product showcase ---- */}
        <section className="border-y border-line/60 bg-white/55 py-16 sm:py-24">
          <div className="max-w-[1120px] mx-auto px-4 sm:px-6">
            <div className="text-center max-w-[680px] mx-auto mb-10 sm:mb-12">
              <p className="mb-2 text-[12px] font-semibold uppercase tracking-[.14em] text-brand">The product</p>
              <h2 className="text-[clamp(26px,3vw,38px)] font-semibold leading-[1.15] tracking-[-0.02em]">What your dashboard looks like</h2>
              <p className="mt-3 text-base text-mute">No screenshots from another tool. This is Reimburse.</p>
            </div>
            <div className="relative max-w-[1080px] mx-auto">
              <div className="rounded-2xl border border-line bg-white shadow-[0_30px_80px_-25px_rgba(15,23,42,.18)] overflow-hidden">
                <div className="flex items-center gap-1.5 px-3.5 py-3 border-b border-line bg-[#fafafa]">
                  <span className="size-2.5 rounded-full bg-[#e5e7eb]" />
                  <span className="size-2.5 rounded-full bg-[#e5e7eb]" />
                  <span className="size-2.5 rounded-full bg-[#e5e7eb]" />
                  <span className="mx-3 h-[22px] flex-1 rounded-md border border-line bg-white text-[11px] text-mute flex items-center px-2.5">app.reimburse.app</span>
                </div>
                <div className="p-4 sm:p-6 grid sm:grid-cols-[200px_1fr] gap-[18px]">
                  <div className="bg-[#fafafa] border border-line rounded-[10px] p-3 text-xs text-mute hidden sm:block">
                    <p className="font-semibold text-ink mb-2 text-[11px] uppercase tracking-[.08em]">Workspace</p>
                    <ul>
                      <li className="py-1.5 px-2 rounded-md bg-brand/8 text-brand font-semibold flex gap-2 items-center">Overview</li>
                      <li className="py-1.5 px-2 rounded-md flex gap-2 items-center">My reports</li>
                      <li className="py-1.5 px-2 rounded-md flex gap-2 items-center">Approvals</li>
                    </ul>
                  </div>
                  <div className="flex flex-col gap-3.5">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
                      {["This month", "Pending", "Approved", "Rejected"].map((label) => (
                        <div key={label} className="bg-white border border-line rounded-[10px] p-3">
                          <p className="text-[11px] text-mute">{label}</p>
                          <p className="text-lg font-semibold mt-0.5 tabular-nums">€0</p>
                        </div>
                      ))}
                    </div>
                    <div className="bg-white border border-line rounded-[10px] overflow-hidden">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="grid grid-cols-[1fr_90px_90px] gap-2.5 px-3 py-2.5 text-xs border-b border-line-soft last:border-b-0">
                          <span className="font-semibold text-ink">Report #{i + 1}</span>
                          <span className="bg-slate-meta-bg text-slate-meta px-1 py-0.5 rounded-full text-[10px] font-semibold w-fit">Draft</span>
                          <span className="text-right text-mute tabular-nums">NOK 0</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---- Testimonial ---- */}
        <section className="py-16 sm:py-24">
          <div className="max-w-[780px] mx-auto px-4 sm:px-6 text-center">
            <div className="mb-[18px] flex justify-center gap-1 text-brand">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className="size-5 fill-current" />
              ))}
            </div>
            <blockquote className="text-[clamp(22px,2.4vw,30px)] font-medium leading-[1.4] tracking-[-0.015em] text-balance">
              &ldquo;We went from paper forms and 3-week turnaround to instant submissions. Our finance team finally has weekends back.&rdquo;
            </blockquote>
            <div className="mt-[26px] flex items-center gap-3 justify-center">
              <div className="grid size-11 place-items-center rounded-full bg-brand/12 text-brand text-[13px] font-semibold">MK</div>
              <div className="text-left">
                <p className="text-[13.5px] font-semibold">Mette Karlsen</p>
                <p className="text-[13.5px] text-mute">Finance Director, Bergen kommune</p>
              </div>
            </div>
          </div>
        </section>

        {/* ---- Features ---- */}
        <section id="features" className="border-y border-line/60 bg-white/55 py-16 sm:py-24">
          <div className="max-w-[1120px] mx-auto px-4 sm:px-6">
            <div className="text-center max-w-[680px] mx-auto mb-10 sm:mb-12">
              <p className="mb-2 text-[12px] font-semibold uppercase tracking-[.14em] text-brand">Features</p>
              <h2 className="text-[clamp(26px,3vw,38px)] font-semibold leading-[1.15] tracking-[-0.02em]">Everything you need, nothing you don&apos;t</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-[1100px] mx-auto">
              {FEATURES.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-white border border-line rounded-2xl p-[22px] transition-all hover:border-brand/30 hover:shadow-[0_1px_2px_rgba(15,23,42,.04)] hover:-translate-y-px">
                  <div className="mb-3 grid size-[38px] place-items-center rounded-[10px] bg-brand/10 text-brand">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mb-1 text-sm font-semibold">{title}</h3>
                  <p className="text-sm text-mute leading-[1.55]">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Pricing ---- */}
        <section id="pricing" className="py-16 sm:py-24">
          <div className="max-w-[1120px] mx-auto px-4 sm:px-6">
            <div className="text-center max-w-[680px] mx-auto mb-10 sm:mb-12">
              <p className="mb-2 text-[12px] font-semibold uppercase tracking-[.14em] text-brand">Pricing</p>
              <h2 className="text-[clamp(26px,3vw,38px)] font-semibold leading-[1.15] tracking-[-0.02em]">Pay only for what you use</h2>
              <p className="mt-3 text-base text-mute">No per-user monthly fees. No enterprise contracts.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-[18px] max-w-[1100px] mx-auto">
              {PRICING_TIERS.map((tier) => (
                <div
                  key={tier.tier}
                  className={`relative flex flex-col gap-[18px] rounded-[18px] border p-5 sm:p-[26px] ${
                    tier.highlight
                      ? "border-brand bg-gradient-to-b from-brand/3 to-brand/1 shadow-[0_12px_36px_rgba(37,99,235,.08)] md:-mt-4 md:mb-[-16px]"
                      : "border-line bg-white"
                  }`}
                >
                  {tier.highlight && (
                    <span className="absolute top-[-11px] left-[26px] bg-brand text-white px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-[.02em]">
                      Most popular
                    </span>
                  )}
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[.1em] text-mute">{tier.tier}</p>
                    <div className="flex items-baseline gap-1.5 mt-2.5">
                      <span className="text-[38px] font-semibold tracking-[-0.02em]">{tier.price}</span>
                      {showPerReportPrice && (
                        <span className="text-[13.5px] text-mute">/ {tier.period.toLowerCase()}</span>
                      )}
                    </div>
                    <p className="mt-2 text-[13.5px] text-mute">{tier.desc}</p>
                  </div>
                  <ul className="flex flex-col gap-2.5 flex-1">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-[13.5px]">
                        <CheckIcon className="size-4 text-brand mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {tier.href ? (
                    tier.href.startsWith("mailto:") ? (
                      <a href={tier.href} className="w-full">
                        <Button variant={tier.highlight ? "primary" : "ghost"} className="w-full justify-center">
                          {tier.cta}
                        </Button>
                      </a>
                    ) : (
                      <Link href={tier.href} className="w-full">
                        <Button variant={tier.highlight ? "primary" : "ghost"} className="w-full justify-center">
                          {tier.cta}
                        </Button>
                      </Link>
                    )
                  ) : (
                    <a href="mailto:hello@reimburse.app" className="w-full">
                      <Button variant={tier.highlight ? "primary" : "ghost"} className="w-full justify-center">
                        {tier.cta}
                      </Button>
                    </a>
                  )}
                </div>
              ))}
            </div>

            {/* FAQ */}
            <div id="faq" className="mt-12 sm:mt-[56px] max-w-[880px] mx-auto">
              <h3 className="text-center text-xl font-semibold tracking-tight mb-8">Frequently asked questions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-0 sm:gap-y-0">
                {FAQ_ITEMS.map(({ q, a }, i) => {
                  const isOpen = openFaq === i
                  return (
                    <div key={q} className="border-b border-line-soft last:border-b-0 sm:border-b sm:last:border-b">
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : i)}
                        className="w-full flex items-center justify-between gap-2 py-3.5 text-left text-sm font-semibold hover:text-brand transition-colors"
                      >
                        {q}
                        <ChevronDownIcon
                          className={`size-4 shrink-0 text-mute transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-200 ${
                          isOpen ? "max-h-40 pb-3.5" : "max-h-0"
                        }`}
                      >
                        <p className="text-[13.5px] text-mute leading-[1.55]">{a}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ---- Final CTA ---- */}
        <section className="bg-gradient-to-br from-brand-dark to-brand text-white text-center py-16 sm:py-20">
          <h2 className="text-[clamp(26px,3vw,38px)] font-semibold leading-[1.15] tracking-[-0.02em] text-white">Ready to simplify reimbursements?</h2>
          <p className="mt-3 text-[17px] text-white/80 max-w-[540px] mx-auto px-4">
            See how Reimburse works for your team in 15 minutes. No commitment, no sales pitch.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="mailto:hello@reimburse.app">
              <Button variant="primary" size="lg" className="bg-white text-brand hover:bg-white/95">
                Book your demo
                <ArrowRightIcon className="size-3.5 ml-1.5" />
              </Button>
            </a>
            <Link href="/login">
              <Button variant="ghost" size="lg" className="bg-transparent border-white/40 text-white hover:bg-white/10 hover:border-white/70 hover:text-white">
                Try the demo
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* ---- Footer ---- */}
      <footer className="border-t border-line/60 bg-white/40 py-8 sm:py-[38px]">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap justify-center gap-x-7 gap-y-2 sm:gap-[26px] mb-3 sm:mb-4 text-[13px] text-mute">
            <a href="#" className="hover:text-ink transition-colors">Product</a>
            <a href="#pricing" className="hover:text-ink transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-ink transition-colors">FAQ</a>
            <a href="mailto:hello@reimburse.app" className="hover:text-ink transition-colors">Contact</a>
            <Link href="/privacy" className="hover:text-ink transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-ink transition-colors">Terms</Link>
          </div>
          <div className="text-center text-[11px] sm:text-xs text-mute space-y-1">
            <p className="mb-2 sm:mb-1">EU-hosted · GDPR compliant · PCI DSS</p>
            <p>Oslo · Stockholm · Copenhagen · Helsinki · Reykjavik</p>
            <p className="mt-2 sm:mt-1">&copy; {new Date().getFullYear()} Reimburse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
