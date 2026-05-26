import { useApp } from "../state/useApp";
import type { Theme } from "../state/context";
import { IconMonitor, IconMoon, IconSun } from "./icons";

const order: Theme[] = ["light", "dark", "system"];

export function ThemeToggle() {
  const { theme, dispatch } = useApp();

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="flex items-center gap-0.5 rounded-md border border-hairline bg-panel p-0.5"
    >
      {order.map((t) => {
        const active = t === theme;
        const Icon = t === "light" ? IconSun : t === "dark" ? IconMoon : IconMonitor;
        return (
          <button
            key={t}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => dispatch({ type: "set-theme", theme: t })}
            className={[
              "grid h-6 w-6 place-items-center rounded text-text-mid transition-colors duration-150",
              active
                ? "bg-raised text-text"
                : "hover:bg-raised hover:text-text",
            ].join(" ")}
            title={`Theme: ${t}`}
          >
            <Icon size={13} />
          </button>
        );
      })}
    </div>
  );
}
