import { IconDeviceDesktop, IconMoon, IconSun } from "@tabler/icons-react";
import { cn } from "@/utils/cn";
import { type Theme, useStore } from "@/state/store";

const order: Theme[] = ["light", "dark", "system"];

export function ThemeToggle() {
  const theme = useStore((s) => s.theme);
  const setTheme = useStore((s) => s.setTheme);

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="flex items-center gap-0.5 rounded-md border border-hairline bg-panel p-0.5"
    >
      {order.map((t) => {
        const active = t === theme;
        const Icon =
          t === "light" ? IconSun : t === "dark" ? IconMoon : IconDeviceDesktop;
        return (
          <button
            key={t}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setTheme(t)}
            className={cn(
              "grid h-6 w-6 place-items-center rounded text-text-mid transition-colors duration-150 hover:bg-raised hover:text-text",
              active && "bg-raised text-text",
            )}
            title={`Theme: ${t}`}
          >
            <Icon size={13} stroke={1.6} />
          </button>
        );
      })}
    </div>
  );
}
