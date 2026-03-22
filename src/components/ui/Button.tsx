import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all \
  disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed \
  [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 \
  outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:border-ring \
  aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive \
  bg-[var(--btn-bg)] hover:bg-[var(--btn-bg-hover)] text-[var(--btn-text)] hover:text-[var(--btn-text-hover)] \
  border-[var(--btn-border)] hover:border-[var(--btn-border-hover)]",
  {
    variants: {
      variant: {
        solid: "[--btn-bg:var(--primary)] [--btn-bg-hover:color-mix(in_srgb,var(--primary)_90%,transparent)] [--btn-text:var(--primary-foreground)] [--btn-text-hover:var(--primary-foreground)] [--btn-border:transparent] [--btn-border-hover:transparent]",
        outline: "[--btn-bg:transparent] [--btn-bg-hover:--primary-foreground] [--btn-text:var(--primary-foreground)] [--btn-text-hover:var(--primary)] [--btn-border:var(--primary-foreground)] [--btn-border-hover:var(--primary)]",
        destructive: "[--btn-bg:var(--destructive)] [--btn-bg-hover:color-mix(in_srgb,var(--destructive)_90%,transparent)] [--btn-text:--primary-foreground] [--btn-text-hover:--primary-foreground] [--btn-border:transparent] [--btn-border-hover:transparent]",
        ghost: "[--btn-bg:transparent] [--btn-bg-hover:color-mix(in_srgb,var(--accent)_15%,transparent)] [--btn-text:var(--foreground)] [--btn-text-hover:var(--accent)] [--btn-border:transparent] [--btn-border-hover:transparent]",
        text: "[--btn-bg:transparent] [--btn-bg-hover:transparent] [--btn-text:var(--foreground)] [--btn-text-hover:var(--primary)] [--btn-border:transparent] [--btn-border-hover:transparent]",
        link: "[--btn-bg:transparent] [--btn-bg-hover:transparent] [--btn-text:var(--primary)] [--btn-text-hover:var(--primary)] [--btn-border:transparent] [--btn-border-hover:transparent] underline-offset-4 hover:underline hover:scale-100",
      },
      size: {
        xs: "h-7 px-2.5 text-xs",
        sm: "h-8 px-3 text-sm",
        md: "h-9 px-4 text-sm",
        lg: "h-10 px-6 text-base",
        xl: "h-11 px-7 text-base",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "md",
    },
  }
)

export type ButtonVariant = VariantProps<typeof buttonVariants>["variant"]
export type ButtonSize = VariantProps<typeof buttonVariants>["size"]

const borderModeClass: Record<BorderMode, string> = {
  none: "border-0 hover:border-0",
  hover: "border border-transparent hover:border-[var(--btn-border-hover)]",
  always: "border border-[var(--btn-border)] hover:border-[var(--btn-border-hover)]",
}

type BorderMode = "none" | "hover" | "always"

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement> & { className?: string }>

const THEME_COLOR_KEYS = new Set([
  "background",
  "foreground",
  "text",
  "surface",
  "surface-2",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "border",
  "ring",
  "input",
  "input-background",
  "switch-background",
  "sidebar",
  "sidebar-foreground",
  "sidebar-primary",
  "sidebar-primary-foreground",
  "sidebar-accent",
  "sidebar-accent-foreground",
  "sidebar-border",
  "sidebar-ring",
])

function resolveColorToken(value: string | undefined): string | undefined {
  if (!value) return undefined

  const trimmed = value.trim()
  if (!trimmed) return undefined

  // If they already provided a concrete CSS color, respect it.
  if (
    trimmed.startsWith("var(") ||
    trimmed.startsWith("#") ||
    trimmed.startsWith("rgb(") ||
    trimmed.startsWith("rgba(") ||
    trimmed.startsWith("hsl(") ||
    trimmed.startsWith("hsla(") ||
    trimmed.startsWith("oklch(") ||
    trimmed.startsWith("oklab(") ||
    trimmed.startsWith("color-mix(")
  ) {
    return trimmed
  }

  // Allow passing Tailwind-ish utility tokens like "text-foreground".
  const withoutPrefix = trimmed.replace(/^(text|bg|border)-/, "")

  const match = withoutPrefix.match(/^([a-zA-Z][\w-]*)(?:\/(\d{1,3}))?$/)
  if (!match) return trimmed

  const base = match[1]
  const pctRaw = match[2]
  const pct = pctRaw ? Number(pctRaw) : undefined

  const baseColor = THEME_COLOR_KEYS.has(base) ? `var(--${base})` : base
  if (pct === undefined) return baseColor

  const clamped = Math.min(100, Math.max(0, pct))
  return `color-mix(in srgb, ${baseColor} ${clamped}%, transparent)`
}

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    href?: string
    fullWidth?: boolean
    usePointerCursor?: boolean
    pointerCursor?: boolean
    useHoverScale?: boolean
    hoverScale?: boolean
    icon?: React.ReactNode | IconComponent
    iconPosition?: "left" | "right"
    iconClassName?: string
    bgColor?: string
    hoverBgColor?: string
    textColor?: string
    hoverTextColor?: string
    borderColor?: string
    hoverBorderColor?: string
    borderMode?: BorderMode
    borderNone?: boolean
    borderHover?: boolean
    borderAlways?: boolean
  }

function Button({
  className,
  variant = "solid",
  size = "md",
  fullWidth = false,
  usePointerCursor = true,
  pointerCursor,
  useHoverScale = true,
  hoverScale,
  icon,
  iconPosition = "left",
  iconClassName,
  asChild = false,
  href,
  bgColor,
  hoverBgColor,
  textColor,
  hoverTextColor,
  borderColor,
  hoverBorderColor,
  borderMode,
  borderNone,
  borderHover,
  borderAlways,
  children,
  ...props
}: ButtonProps) {
  const resolvedPointerCursor = pointerCursor ?? usePointerCursor

  const defaultHoverScale = variant === "link" ? false : true
  const resolvedHoverScale = hoverScale ?? useHoverScale ?? defaultHoverScale

  const defaultBorderMode: BorderMode = variant === "outline" ? "always" : "none"
  const resolvedBorderMode: BorderMode = borderNone
    ? "none"
    : borderAlways
      ? "always"
      : borderHover
        ? "hover"
        : borderMode ?? defaultBorderMode

  const resolvedIcon = React.useMemo(() => {
    if (!icon) return null
    if (React.isValidElement(icon)) return icon
    if (
      typeof icon === "function" ||
      (typeof icon === "object" &&
        icon !== null &&
        "$$typeof" in (icon as Record<string, unknown>))
    ) {
      const Icon = icon as React.ElementType
      return React.createElement(Icon, {
        className: cn("size-[1em] text-current", iconClassName),
      })
    }
    return icon as React.ReactNode
  }, [icon, iconClassName])

  const style = {
    ...(bgColor ? { ["--btn-bg" as string]: resolveColorToken(bgColor) } : {}),
    ...(hoverBgColor ? { ["--btn-bg-hover" as string]: resolveColorToken(hoverBgColor) } : {}),
    ...(textColor ? { ["--btn-text" as string]: resolveColorToken(textColor) } : {}),
    ...(hoverTextColor
      ? { ["--btn-text-hover" as string]: resolveColorToken(hoverTextColor) }
      : {}),
    ...(borderColor ? { ["--btn-border" as string]: resolveColorToken(borderColor) } : {}),
    ...(hoverBorderColor
      ? { ["--btn-border-hover" as string]: resolveColorToken(hoverBorderColor) }
      : {}),
  } as React.CSSProperties

  // Build the inner content (icon + children) once.
  const composedChildren = resolvedIcon ? (
    iconPosition === "left" ? (
      <>
        {resolvedIcon}
        <span>{children}</span>
      </>
    ) : (
      <>
        <span>{children}</span>
        {resolvedIcon}
      </>
    )
  ) : (
    children
  )

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement
    return React.cloneElement(child, {
      "data-slot": "button",
      "data-variant": variant,
      "data-size": size,
      className: cn(
        buttonVariants({ variant, size }),
        borderModeClass[resolvedBorderMode],
        fullWidth && "w-full",
        resolvedPointerCursor && "cursor-pointer",
        !resolvedPointerCursor && "cursor-default",
        resolvedHoverScale && "hover:scale-103",
        !resolvedHoverScale && "hover:scale-100",
        child.props.className,
        className
      ),
      style: {
        ...(child.props.style || {}),
        ...style,
      },
      ...props,
      children: composedChildren,
    })
  }

  const Element = href ? "a" : "button"

  return (
    <Element
      data-slot="button"
      data-variant={variant}
      data-size={size}
      href={href}
      className={cn(
        buttonVariants({ variant, size }),
        borderModeClass[resolvedBorderMode],
        fullWidth && "w-full",
        resolvedPointerCursor && "cursor-pointer",
        !resolvedPointerCursor && "cursor-default",
        resolvedHoverScale && "hover:scale-103",
        !resolvedHoverScale && "hover:scale-100",
        className
      )}
      style={style}
      {...props}
    >
      {composedChildren}
    </Element>
  )
}

export { Button, buttonVariants }
