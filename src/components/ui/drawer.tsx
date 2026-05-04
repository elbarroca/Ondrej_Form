"use client"

import { useEffect, useRef, useCallback, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { XIcon } from "lucide-react"
import { Button } from "./button"

type DrawerProps = {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  footer?: ReactNode
  width?: number
  className?: string
}

export function Drawer({
  open,
  onClose,
  title,
  children,
  footer,
  width = 520,
  className,
}: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "Tab" && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    },
    [onClose]
  )

  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement as HTMLElement
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
      setTimeout(() => {
        const firstFocusable = drawerRef.current?.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        firstFocusable?.focus()
      }, 100)
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
      if (triggerRef.current) {
        triggerRef.current.focus()
        triggerRef.current = null
      }
    }
  }, [open, handleKeyDown])

  if (!open) return null

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-ink/40 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "fixed right-0 top-0 bottom-0 z-50 flex flex-col bg-white shadow-[0_16px_40px_rgba(15,23,42,.10)]",
          "animate-in slide-in-from-right duration-250",
          className
        )}
        style={{ width: `min(${width}px, 100vw)` }}
      >
        <div className="flex items-center justify-between border-b border-line px-[22px] py-[18px]">
          {title && <h3 className="text-base font-semibold">{title}</h3>}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            aria-label="Close drawer"
          >
            <XIcon className="size-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-auto px-[22px] py-[18px]">
          {children}
        </div>
        {footer && (
          <div className="flex items-center justify-between gap-2 border-t border-line px-[22px] py-[14px]">
            {footer}
          </div>
        )}
      </div>
    </>
  )
}
