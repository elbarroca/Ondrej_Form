"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { CheckIcon, XIcon, InfoIcon, AlertTriangleIcon } from "lucide-react"

type ToastVariant = "success" | "error" | "info" | "warning"
type Toast = {
  id: string
  message: string
  variant: ToastVariant
  action?: { label: string; onClick: () => void }
}

type ToastContextValue = {
  toast: (message: string, options?: { variant?: ToastVariant; action?: Toast["action"] }) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used within ToastProvider")
  return ctx
}

const icons: Record<ToastVariant, ReactNode> = {
  success: <CheckIcon className="size-4 text-emerald" />,
  error: <XIcon className="size-4 text-red" />,
  info: <InfoIcon className="size-4 text-brand" />,
  warning: <AlertTriangleIcon className="size-4 text-amber" />,
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback(
    (
      message: string,
      options?: { variant?: ToastVariant; action?: Toast["action"] }
    ) => {
      const id = crypto.randomUUID()
      setToasts((prev) => [
        ...prev,
        { id, message, variant: options?.variant ?? "info", action: options?.action },
      ])
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 5000)
    },
    []
  )

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        className="fixed right-4 top-4 z-[100] flex flex-col gap-2"
        role="status"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "flex items-start gap-3 rounded-[10px] border border-line bg-white p-3 shadow-[0_4px_16px_rgba(15,23,42,.06)] min-w-[280px] max-w-[400px]"
            )}
          >
            <span className="mt-0.5">{icons[t.variant]}</span>
            <p className="flex-1 text-[13px]">{t.message}</p>
            {t.action && (
              <button
                type="button"
                onClick={t.action.onClick}
                className="text-[12px] font-medium text-brand hover:underline"
              >
                {t.action.label}
              </button>
            )}
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              className="text-mute hover:text-ink -mt-0.5"
              aria-label="Dismiss"
            >
              <XIcon className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
