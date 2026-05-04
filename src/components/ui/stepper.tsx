"use client"

import { cn } from "@/lib/utils"
import { CheckIcon } from "lucide-react"

type StepState = "idle" | "active" | "done"

type Step = {
  label: string
  state: StepState
}

type StepperProps = {
  steps: Step[]
  onStepClick?: (index: number) => void
  className?: string
}

export function Stepper({ steps, onStepClick, className }: StepperProps) {
  return (
    <nav
      role="progressbar"
      aria-valuenow={steps.findIndex((s) => s.state === "active") + 1}
      aria-valuemin={1}
      aria-valuemax={steps.length}
      aria-label="Report creation progress"
      className={cn(
        "flex items-center gap-2 rounded-[14px] border border-line bg-white px-[18px] py-3",
        className
      )}
    >
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center gap-2">
          <button
            type="button"
            disabled={step.state === "idle"}
            onClick={() => step.state === "done" && onStepClick?.(i)}
            className={cn(
              "inline-flex items-center gap-2 text-[13px] transition-colors",
              step.state === "active" && "font-semibold text-ink",
              step.state === "idle" && "text-mute cursor-default",
              step.state === "done" && "text-mute cursor-pointer hover:text-ink"
            )}
          >
            <span
              className={cn(
                "grid size-[22px] place-items-center rounded-full text-[11px] font-semibold",
                step.state === "idle" && "bg-[#f1f5f9] text-mute",
                step.state === "active" && "bg-brand text-white",
                step.state === "done" && "bg-emerald text-white"
              )}
            >
              {step.state === "done" ? (
                <CheckIcon className="size-3" />
              ) : (
                i + 1
              )}
            </span>
            {step.label}
          </button>
          {i < steps.length - 1 && (
            <div className="mx-2 h-px flex-1 bg-line" role="separator" />
          )}
        </div>
      ))}
    </nav>
  )
}
