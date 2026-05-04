"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2Icon, CheckIcon, ArrowRightIcon } from "lucide-react"

interface BookingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BookingDialog({ open, onOpenChange }: BookingDialogProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const [form, setForm] = useState({
    name: "",
    email: "",
    organization: "",
    role: "",
    message: "",
  })

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (status === "error") setStatus("idle")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("submitting")
    setErrorMsg("")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          organization: form.organization,
          role: form.role,
          message: form.message,
          intent: "demo-booking",
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setStatus("error")
        setErrorMsg(data.error || "Something went wrong. Please try again.")
        return
      }

      setStatus("success")
      setTimeout(() => {
        onOpenChange(false)
        setStatus("idle")
        setForm({ name: "", email: "", organization: "", role: "", message: "" })
      }, 4000)
    } catch {
      setStatus("error")
      setErrorMsg("Connection failed. Please check your internet and try again.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton={status !== "success"}>
        {status === "success" ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-emerald-100">
              <CheckIcon className="h-7 w-7 text-emerald-600" />
            </div>
            <DialogTitle className="mt-4">You&apos;re all set</DialogTitle>
            <DialogDescription className="mt-2 max-w-xs">
              Thanks, {form.name.split(" ")[0]}! We&apos;ll reach out within 24 hours to schedule your demo. Check your inbox for a confirmation.
            </DialogDescription>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Book a 15-minute demo</DialogTitle>
              <DialogDescription>
                See how Reimburse works for your team. No sales pitch, just a quick walkthrough.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="booking-name">Full name</Label>
                <Input
                  id="booking-name"
                  placeholder="Ola Nordmann"
                  value={form.name}
                  onChange={handleChange("name")}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="booking-email">Work email</Label>
                <Input
                  id="booking-email"
                  type="email"
                  placeholder="ola@kommune.no"
                  value={form.email}
                  onChange={handleChange("email")}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="booking-org">Organization</Label>
                <Input
                  id="booking-org"
                  placeholder="Oslo kommune"
                  value={form.organization}
                  onChange={handleChange("organization")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="booking-role">Role</Label>
                <Select value={form.role} onValueChange={(v) => { setForm((prev) => ({ ...prev, role: v ?? "" })); if (status === "error") setStatus("idle") }}>
                  <SelectTrigger id="booking-role" className="w-full">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="finance">Finance / Accounting</SelectItem>
                    <SelectItem value="manager">Manager / Department Head</SelectItem>
                    <SelectItem value="employee">Employee / Submitter</SelectItem>
                    <SelectItem value="it">IT / Administrator</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="booking-message">Anything else? (optional)</Label>
                <Textarea
                  id="booking-message"
                  placeholder="Tell us about your team size, current process, or specific needs"
                  rows={3}
                  value={form.message}
                  onChange={handleChange("message")}
                />
              </div>
              {status === "error" && (
                <p className="text-sm text-destructive">{errorMsg}</p>
              )}
              <Button
                type="submit"
                disabled={status === "submitting"}
                className="h-10 w-full bg-brand text-white hover:bg-brand-dark"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    Scheduling...
                  </>
                ) : (
                  <>
                    Book your demo
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
