import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

type Variant = "default" | "accent";
type Size = "sm" | "md";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
};

const sizes: Record<Size, string> = {
  sm: "h-6 rounded px-2 font-mono text-[11px]",
  md: "h-7 rounded-md px-2.5 text-[12px]",
};

const variants: Record<Variant, string> = {
  default:
    "border border-hairline bg-panel text-text hover:bg-raised disabled:hover:bg-panel",
  accent:
    "bg-accent text-accent-fg font-medium transition-opacity hover:opacity-90",
};

export function Button({
  variant = "default",
  size = "md",
  icon,
  className,
  children,
  type = "button",
  ...rest
}: Props) {
  return (
    <button
      type={type}
      className={cn(
        "flex items-center gap-1.5 transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-30",
        sizes[size],
        variants[variant],
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
