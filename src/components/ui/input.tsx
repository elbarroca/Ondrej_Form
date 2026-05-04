import { Input as BaseInput } from "@base-ui/react/input"
import type React from "react"

import { cn } from "@/lib/utils"

type InputProps = Omit<BaseInput.Props, "className"> & {
  label?: string
  hint?: string
  error?: string
  leftIcon?: React.ReactNode
  rightAddon?: React.ReactNode
  required?: boolean
  className?: string
  inputClassName?: string
}

function Input({
  label,
  hint,
  error,
  leftIcon,
  rightAddon,
  required,
  className,
  inputClassName,
  id,
  ...props
}: InputProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined)
  const errorId = inputId ? `${inputId}-error` : undefined
  const hintId = inputId ? `${inputId}-hint` : undefined

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={inputId} className="text-[13px] font-medium text-ink">
          {label}
          {required && <span className="text-red ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-mute">
            {leftIcon}
          </span>
        )}
        <BaseInput
          id={inputId}
          data-slot="input"
          aria-invalid={error ? "true" : undefined}
          aria-describedby={
            error ? errorId : hint ? hintId : undefined
          }
          className={cn(
            "flex w-full rounded-[10px] border border-line bg-white px-3 py-2.5 text-[14px] text-ink transition-all placeholder:text-mute",
            "focus:border-brand focus:outline-none focus:ring-[3px] focus:ring-brand/15",
            error && "border-red ring-[3px] ring-red/15",
            props.disabled && "bg-paper text-mute cursor-not-allowed",
            leftIcon && "pl-10",
            rightAddon && "pr-16",
            inputClassName
          )}
          {...props}
        />
        {rightAddon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-mute">
            {rightAddon}
          </span>
        )}
      </div>
      {error && (
        <p id={errorId} className="text-[12px] text-red" role="alert">
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={hintId} className="text-[12px] text-mute">
          {hint}
        </p>
      )}
    </div>
  )
}

export { Input }
