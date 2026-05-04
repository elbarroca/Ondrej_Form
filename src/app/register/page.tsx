"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth, type ProfileRole } from "@/lib/auth/AuthContext"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BookingDialog } from "@/components/landing/BookingDialog"
import { FileTextIcon, CheckIcon } from "lucide-react"

export default function RegisterPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<ProfileRole>("member")
  const [orgName, setOrgName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [bookingOpen, setBookingOpen] = useState(false)
  const router = useRouter()
  const { signUp } = useAuth()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error: signUpError } = await signUp(email, password, fullName, role, orgName)
      if (signUpError) throw signUpError
      router.push("/dashboard")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account")
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
              <h2 className="text-2xl font-semibold tracking-tight">
                Create account
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-brand hover:underline font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 text-destructive text-sm p-3">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ola Nordmann"
                  required
                  autoComplete="name"
                />
              </div>

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
                  autoComplete="new-password"
                  minLength={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={(v) => v && setRole(v as ProfileRole)}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="approver">Approver</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Members submit expenses. Approvers review and approve them.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="orgName">Organization name</Label>
                <Input
                  id="orgName"
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="Your Agency"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account..." : "Create account"}
              </Button>
            </form>

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
