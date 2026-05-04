"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth/AuthContext"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CheckIcon, FileTextIcon, MailIcon, ArrowRightIcon } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [showMagicLink, setShowMagicLink] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { signIn, signInWithMagicLink } = useAuth()

  async function handleEmailPassword(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) {
      setError("Email is required")
      return
    }
    setLoading(true)
    setError(null)
    try {
      await signIn(email, password)
      router.push("/dashboard")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) {
      setError("Email is required")
      return
    }
    setLoading(true)
    setError(null)
    try {
      await signInWithMagicLink(email)
      setMagicLinkSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send magic link")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-paper">
      {/* Aside — brand gradient */}
      <div className="relative overflow-hidden bg-[radial-gradient(ellipse_80%_60%_at_20%_10%,rgba(255,255,255,.18),transparent_70%),linear-gradient(160deg,#1e40af_0%,#2563eb_60%,#3b82f6_100%)] text-white p-11 flex flex-col justify-between max-lg:hidden">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="grid size-[30px] place-items-center rounded-lg bg-white/20">
            <svg className="size-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="font-semibold text-sm text-white">Reimburse</span>
        </Link>

        {/* Middle: headline + lede */}
        <div className="space-y-3.5">
          <h2 className="text-[36px] leading-[1.15] tracking-[-0.02em] font-semibold text-white">
            Your receipts,
            <br />
            submitted in seconds.
          </h2>
          <p className="text-base text-white/85 max-w-[420px]">
            The reimbursement tool built for public sector workers — no enterprise complexity, no training required.
          </p>
        </div>

        {/* Bottom: trust + escape */}
        <div className="space-y-2.5">
          {["No credit card required", "5-minute setup", "Cancel anytime"].map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm text-white/85">
              <CheckIcon className="size-4 text-[#6ee7b7] shrink-0" />
              {item}
            </div>
          ))}
          <Link
            href="/register"
            className="mt-4 inline-block text-[13.5px] text-white/85 underline underline-offset-4 hover:text-white transition-colors"
          >
            Not ready to sign up? Create an account
          </Link>
        </div>
      </div>

      {/* Form area */}
      <div className="grid place-items-center p-8 lg:px-8">
        <div className="w-full max-w-[360px]">
          {/* Mobile logo */}
          <div className="mb-6 lg:hidden flex items-center gap-2.5">
            <div className="grid size-7 place-items-center rounded-md bg-brand">
              <FileTextIcon className="size-3.5 text-white" />
            </div>
            <span className="font-semibold text-sm">Reimburse</span>
          </div>

          <div className="mb-[26px]">
            <h3 className="text-2xl font-semibold tracking-tight">Welcome back</h3>
            <p className="mt-1.5 text-[13.5px] text-mute">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-brand font-medium hover:underline">
                Create one
              </Link>
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-[10px] bg-red/10 text-red text-[13px] px-3 py-2.5">
              {error}
            </div>
          )}

          {magicLinkSent ? (
            <div className="rounded-[10px] bg-emerald/10 text-emerald text-[13px] p-4 text-center">
              <MailIcon className="size-6 mx-auto mb-2 text-emerald" />
              <p className="font-semibold">Check your inbox</p>
              <p className="text-mute mt-1 text-[13px]">
                We sent a magic link to <span className="font-medium text-ink">{email}</span>
              </p>
              <button
                type="button"
                onClick={() => setMagicLinkSent(false)}
                className="mt-4 text-[13px] text-brand hover:underline"
              >
                Send again
              </button>
            </div>
          ) : showMagicLink ? (
            <form onSubmit={handleMagicLink} className="flex flex-col gap-4">
              <Input
                id="magic-email"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
                placeholder="you@agency.gov.no"
                required
                autoComplete="email"
                error={error && !magicLinkSent ? error : undefined}
              />
              <Button
                type="submit"
                variant="primary"
                className="w-full justify-center py-[11px]"
                loading={loading}
              >
                Send magic link
              </Button>
              <button
                type="button"
                onClick={() => {
                  setShowMagicLink(false)
                  setError(null)
                }}
                className="w-full text-[13.5px] text-mute hover:text-ink transition-colors"
              >
                Back to email/password
              </button>
            </form>
          ) : (
            <form onSubmit={handleEmailPassword} className="flex flex-col gap-4">
              <Input
                id="email"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
                placeholder="you@agency.gov.no"
                required
                autoComplete="email"
              />
              <Input
                id="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                rightAddon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[13px] text-mute hover:text-ink"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                }
              />
              <div className="flex items-center justify-between text-[13px] text-mute">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-brand" />
                  Remember me
                </label>
                <a href="#" className="text-brand hover:underline">
                  Forgot password?
                </a>
              </div>
              <Button
                type="submit"
                variant="primary"
                className="w-full justify-center py-[11px]"
                loading={loading}
              >
                {loading ? "Signing in…" : "Sign in"}
              </Button>

              <div className="flex items-center gap-3 my-1.5 text-[12px] text-mute">
                <span className="flex-1 h-px bg-line" />
                or
                <span className="flex-1 h-px bg-line" />
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowMagicLink(true)
                  setError(null)
                }}
                className="flex w-full items-center justify-center gap-2 rounded-[10px] border border-line bg-white py-[11px] text-[13.5px] font-medium transition-all hover:border-brand/40 hover:text-brand"
              >
                <MailIcon className="size-4" />
                Email me a magic link
              </button>
            </form>
          )}

          <p className="mt-[26px] text-[12.5px] text-mute text-center">
            By signing in you agree to our{" "}
            <Link href="/terms" className="text-mute underline underline-offset-[3px]">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-mute underline underline-offset-[3px]">
              Privacy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
