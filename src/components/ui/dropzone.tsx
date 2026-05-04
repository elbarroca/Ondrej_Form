"use client"

import { useCallback, useState, useRef, type DragEvent } from "react"
import { cn } from "@/lib/utils"
import { UploadIcon, FileIcon, XIcon, AlertCircleIcon, RefreshCwIcon } from "lucide-react"
import { Button } from "./button"

type UploadFile = {
  id: string
  name: string
  size: number
  progress: number
  status: "uploading" | "scanning" | "ready" | "error"
  error?: string
  preview?: string
}

type DropzoneProps = {
  accept?: string
  maxSize?: number
  maxFiles?: number
  onFilesAdded?: (files: File[]) => void
  onRemove?: (id: string) => void
  onRetry?: (id: string) => void
  files?: UploadFile[]
  className?: string
}

const MAX_SIZE = 20 * 1024 * 1024 // 20MB
const ACCEPTED = "image/png,image/jpeg,image/heic,application/pdf"

export function Dropzone({
  accept = ACCEPTED,
  maxSize = MAX_SIZE,
  maxFiles = 50,
  onFilesAdded,
  onRemove,
  onRetry,
  files = [],
  className,
}: DropzoneProps) {
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const errors: string[] = []
      const valid: File[] = []

      for (const f of Array.from(newFiles)) {
        const allowed = accept.split(",").map((s) => s.trim())
        if (!allowed.includes(f.type)) {
          errors.push(`"${f.name}" is not a supported format`)
          continue
        }
        if (f.size > maxSize) {
          errors.push(`"${f.name}" is too large (max 20MB)`)
          continue
        }
        valid.push(f)
      }

      if (errors.length > 0) {
        setError(errors[0])
      } else {
        setError(null)
      }

      if (valid.length > 0) {
        onFilesAdded?.(valid.slice(0, maxFiles - files.length))
      }
    },
    [accept, maxSize, maxFiles, files.length, onFilesAdded]
  )

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    validateFiles(e.dataTransfer.files)
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload receipt files"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            fileInputRef.current?.click()
          }
        }}
        className={cn(
          "cursor-pointer rounded-[14px] border-2 border-dashed border-line p-12 text-center transition-all",
          dragOver && "border-brand bg-brand/4",
          !dragOver && "bg-brand/2 hover:border-brand hover:bg-brand/4"
        )}
      >
        <div className="mx-auto grid size-[54px] place-items-center rounded-[14px] bg-brand/10 text-brand">
          <UploadIcon className="size-6" />
        </div>
        <h3 className="mt-3.5 text-base font-semibold">
          Drop receipts here or click to browse
        </h3>
        <p className="mt-1 text-[13.5px] text-mute">
          Drag images, paste from clipboard, or pick from your files
        </p>
        <p className="mt-3 text-[11.5px] text-mute">
          PNG, JPG, PDF, HEIC — up to 20MB each
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple
          onChange={(e) => {
            if (e.target.files) validateFiles(e.target.files)
            e.target.value = ""
          }}
          className="hidden"
          aria-label="Choose receipt files"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-[10px] bg-red/10 px-3 py-2 text-[13px] text-red">
          <AlertCircleIcon className="size-4 shrink-0" />
          {error}
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f) => (
            <div
              key={f.id}
              className="flex items-center gap-3 rounded-[10px] border border-line bg-white px-3 py-2.5"
            >
              <FileIcon className="size-4 shrink-0 text-mute" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium">{f.name}</p>
                <div className="mt-1 h-1 overflow-hidden rounded-full bg-line">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      f.status === "error"
                        ? "bg-red"
                        : f.status === "scanning"
                          ? "bg-brand animate-pulse"
                          : "bg-emerald"
                    )}
                    style={{ width: `${f.progress}%` }}
                  />
                </div>
              </div>
              <span className="text-[11.5px] text-mute shrink-0">
                {f.status === "uploading" && `${f.progress}%`}
                {f.status === "scanning" && "Scanning..."}
                {f.status === "ready" && "Ready"}
                {f.status === "error" && f.error}
              </span>
              {f.status === "error" && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onRetry?.(f.id)
                  }}
                  className="grid size-7 place-items-center rounded-md text-mute hover:bg-brand/8 hover:text-brand"
                  aria-label={`Retry ${f.name}`}
                >
                  <RefreshCwIcon className="size-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove?.(f.id)
                }}
                className="grid size-7 place-items-center rounded-md text-mute hover:bg-red/8 hover:text-red"
                aria-label={`Remove ${f.name}`}
              >
                <XIcon className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export type { UploadFile }
