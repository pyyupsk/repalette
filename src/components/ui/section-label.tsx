import type { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

type Props = HTMLAttributes<HTMLDivElement>;

export function SectionLabel({ className, ...rest }: Props) {
  return (
    <div
      className={cn(
        "font-mono text-[10px] uppercase tracking-[0.08em] text-text-dim",
        className,
      )}
      {...rest}
    />
  );
}
