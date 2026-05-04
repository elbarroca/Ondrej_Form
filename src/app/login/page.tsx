"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth/AuthContext"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { BookingDialog } from "@/components/landing/BookingDialog"
import { FileTextIcon, CheckIcon } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [showMagicLink, setShowMagicLink] = useState(false)
  const [bookingOpen, setBookingOpen] = useState(false)
  const router = useRouter()
  const { signIn, signInWithMagicLink } = useAuth()

  async function handleEmailPassword(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await signIn(email, password)
      router.push("/dashboard")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in")
    } finally {
      setLoading(false)
    }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
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
    <>
      <BookingDialog open={bookingOpen} onOpenChange={setBookingOpen} />

      <div className="min-h-screen bg-paper flex">
        <div className="hidden lg:flex lg:w-1/2 bg-brand relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-400/30 via-brand to-brand" />
          <div className="relative z-10 flex flex-col justify-between p-12">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/20">
                <FileTextIcon className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold text-white text-sm">Reimburse</span>
            </div>
            <div className="space-y-6">
              <h1 className="text-4xl font-semibold text-white leading-tight">
                Your receipts,
                <br />
                submitted in seconds.
              </h1>
              <p className="text-blue-100 text-lg max-w-md">
                The reimbursement tool built for public sector workers — no
                enterprise complexity, no training required.
              </p>
            </div>
            <div className="space-y-4 text-sm text-blue-100">
              {[
                "No credit card required",
                "5-minute setup",
                "Cancel anytime",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-emerald-400 shrink-0" />
                  {item}
                </div>
              ))}
              <button
                type="button"
                onClick={() => setBookingOpen(true)}
                className="mt-4 inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white transition-colors underline underline-offset-4"
              >
                Not ready to sign up? Book a demo instead
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center p-8">
          <div className="w-full max-w-sm space-y-8">
            <div>
              <div className="mb-6 lg:hidden flex items-center gap-2.5">
                <div className="grid h-7 w-7 place-items-center rounded-md bg-brand">
                  <FileTextIcon className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="font-semibold text-sm">Reimburse</span>
              </div>
              <h2 className="text-2xl font-semibold tracking-tight">Sign in</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-brand hover:underline font-medium"
                >
                  Create one
                </Link>
              </p>
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 text-destructive text-sm p-3">
                {error}
              </div>
            )}

            {magicLinkSent ? (
              <div className="rounded-lg bg-emerald-500/10 text-emerald-600 text-sm p-4 text-center">
                <p className="font-medium">Check your email</p>
                <p className="text-muted-foreground mt-1">
                  We sent a magic link to {email}
                </p>
              </div>
            ) : showMagicLink ? (
              <form onSubmit={handleMagicLink} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="magic-email">Email</Label>
                  <Input
                    id="magic-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@agency.gov.no"
                    required
                    autoComplete="email"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending..." : "Send magic link"}
                </Button>
                <button
                  type="button"
                  onClick={() => setShowMagicLink(false)}
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Back to email/password
                </button>
              </form>
            ) : (
              <form onSubmit={handleEmailPassword} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@agency.gov.no"
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            )}

            {!magicLinkSent && (
              <button
                type="button"
                onClick={() => setShowMagicLink(true)}
                className="w-full text-sm text-brand hover:underline text-center"
              >
                Sign in with magic link
              </button>
            )}

            <div className="lg:hidden pt-4 border-t border-line">
              <button
                type="button"
                onClick={() => setBookingOpen(true)}
                className="w-full text-sm text-muted-foreground hover:text-ink transition-colors"
              >
                Book a demo instead
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
