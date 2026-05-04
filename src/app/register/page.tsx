"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth, type ProfileRole } from "@/lib/auth/AuthContext"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
      await signUp(email, password, fullName, role, orgName)
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
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-paper">
        <div className="relative overflow-hidden bg-[radial-gradient(ellipse_80%_60%_at_20%_10%,rgba(255,255,255,.18),transparent_70%),linear-gradient(160deg,#1e40af_0%,#2563eb_60%,#3b82f6_100%)] text-white p-11 flex flex-col justify-between max-lg:hidden">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="grid size-[30px] place-items-center rounded-lg bg-white/20">
              <FileTextIcon className="size-3.5 text-white" />
            </div>
            <span className="font-semibold text-sm text-white">Reimburse</span>
          </Link>
          <div className="space-y-3.5">
            <h2 className="text-[36px] leading-[1.15] tracking-[-0.02em] font-semibold text-white">
              Start in 5
              <br />
              minutes.
            </h2>
            <p className="text-base text-white/85 max-w-[420px]">
              Create your organization account and start submitting reimbursements today.
            </p>
          </div>
          <div className="space-y-2.5">
            {["No credit card required", "5-minute setup", "Cancel anytime"].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-white/85">
                <CheckIcon className="size-4 text-[#6ee7b7] shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="grid place-items-center p-8 lg:px-8">
          <div className="w-full max-w-[360px]">
            <div className="mb-6 lg:hidden flex items-center gap-2.5">
              <div className="grid size-7 place-items-center rounded-md bg-brand">
                <FileTextIcon className="size-3.5 text-white" />
              </div>
              <span className="font-semibold text-sm">Reimburse</span>
            </div>

            <div className="mb-[26px]">
              <h3 className="text-2xl font-semibold tracking-tight">Create account</h3>
              <p className="mt-1.5 text-[13.5px] text-mute">
                Already have an account?{" "}
                <Link href="/login" className="text-brand font-medium hover:underline">Sign in</Link>
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-[10px] bg-red/10 text-red text-[13px] px-3 py-2.5">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input id="fullName" label="Full name" type="text" value={fullName} onChange={(e) => setFullName((e.target as HTMLInputElement).value)} placeholder="Ola Nordmann" required autoComplete="name" />
              <Input id="email" label="Email" type="email" value={email} onChange={(e) => setEmail((e.target as HTMLInputElement).value)} placeholder="you@agency.gov.no" required autoComplete="email" />
              <Input id="password" label="Password" type="password" value={password} onChange={(e) => setPassword((e.target as HTMLInputElement).value)} placeholder="Min 6 characters" required autoComplete="new-password" />

              <div className="flex flex-col gap-1.5">
                <label htmlFor="role" className="text-[13px] font-medium">Role</label>
                <select id="role" value={role} onChange={(e) => setRole(e.target.value as ProfileRole)} className="w-full rounded-[10px] border border-line bg-white px-3 py-2.5 text-[14px] focus:border-brand focus:ring-[3px] focus:ring-brand/15 outline-none">
                  <option value="member">Member — submit expenses</option>
                  <option value="approver">Approver — review and approve</option>
                </select>
                <p className="text-[12px] text-mute">Members submit expenses. Approvers review and approve them.</p>
              </div>

              <Input id="orgName" label="Organization name" type="text" value={orgName} onChange={(e) => setOrgName((e.target as HTMLInputElement).value)} placeholder="Your Agency" required />

              <Button type="submit" variant="primary" className="w-full justify-center py-[11px]" loading={loading}>
                {loading ? "Creating account..." : "Create account"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
