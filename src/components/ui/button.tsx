import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2Icon } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg whitespace-nowrap transition-all outline-none select-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-brand text-white shadow-[0_1px_2px_rgba(37,99,235,.25)] hover:bg-brand-dark hover:shadow-[0_4px_12px_rgba(37,99,235,.25)] active:translate-y-px border border-transparent",
        default:
          "bg-brand text-white shadow-[0_1px_2px_rgba(37,99,235,.25)] hover:bg-brand-dark hover:shadow-[0_4px_12px_rgba(37,99,235,.25)] active:translate-y-px border border-transparent",
        ghost:
          "bg-white text-ink border border-line hover:border-brand/35 hover:text-brand",
        outline:
          "bg-white text-ink border border-line hover:border-brand/35 hover:text-brand",
        secondary:
          "bg-secondary text-ink border border-line hover:border-brand/35 hover:text-brand",
        mini:
          "rounded-md font-medium text-xs",
        magic:
          "bg-white border border-line text-ink hover:border-brand/35 hover:text-brand",
        destructive:
          "bg-transparent text-red hover:text-red border border-transparent hover:border-red/35 hover:text-red",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 py-1 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-md px-2 text-xs [&_svg]:size-3",
        sm: "px-2.5 py-[5px] text-xs gap-1 rounded-md",
        md: "px-4 py-2 text-[13.5px] gap-2 rounded-lg",
        lg: "px-[22px] py-[13px] text-sm gap-2 rounded-[11px]",
        "icon-sm": "size-8",
        "icon-md": "size-[34px]",
        icon: "size-8",
        "icon-xs": "size-6 rounded-md",
        "icon-lg": "size-9",
      },
    },
    compoundVariants: [
      { variant: "mini", size: "sm", class: "bg-white border border-line text-ink hover:border-brand/35 hover:text-brand" },
      { variant: "mini", size: "md", class: "bg-brand text-white border-brand hover:bg-brand-dark" },
      { variant: "mini", size: "sm", className: undefined },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

const miniBase = "px-2.5 py-[5px] text-xs gap-1 rounded-md border font-medium transition-all"

const miniVariants = cva(miniBase, {
  variants: {
    miniVariant: {
      ghost: "bg-white border-line text-ink hover:border-brand/35 hover:text-brand",
      primary: "bg-brand text-white border-brand hover:bg-brand-dark",
      danger: "bg-white border-line text-ink hover:border-red hover:text-red",
    },
  },
  defaultVariants: {
    miniVariant: "ghost",
  },
})

type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
    miniVariant?: "ghost" | "primary" | "danger"
  }

function Button({
  className,
  variant = "primary",
  size = "md",
  loading,
  leftIcon,
  rightIcon,
  miniVariant,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const isMini = variant === "mini"

  return (
    <ButtonPrimitive
      data-slot="button"
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      aria-disabled={disabled || loading || undefined}
      className={cn(
        isMini
          ? miniVariants({ miniVariant, className })
          : buttonVariants({ variant, size, className })
      )}
      {...props}
    >
      {loading && <Loader2Icon className="size-4 animate-spin" />}
      {!loading && leftIcon}
      {children}
      {!loading && rightIcon}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants, miniVariants, type ButtonProps }
