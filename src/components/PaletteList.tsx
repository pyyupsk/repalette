import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { cn } from "../lib/cn";
import { isLight } from "../lib/colors";
import { useEffectiveMapping, useStore } from "../state/store";

const ROW_HEIGHT = 32;

export function PaletteList() {
  const palette = useStore((s) => s.palette);
  const selectedHex = useStore((s) => s.selectedHex);
  const mapping = useStore((s) => s.mapping);
  const effectiveMapping = useEffectiveMapping();
  const select = useStore((s) => s.select);

  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: palette.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 8,
  });

  if (!palette.length) {
    return (
      <div className="flex-1 overflow-hidden bg-panel">
        <div className="grid h-full place-items-center px-3 font-mono text-[11px] text-text-dim">
          awaiting image
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-panel">
      <div className="flex items-center justify-between border-b border-hairline px-3 py-2">
        <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-dim">
          Palette · {palette.length} colors
        </div>
        <div className="font-mono text-[10px] text-text-dim">
          {mapping.size} mapped
        </div>
      </div>

      <div
        ref={parentRef}
        className="flex-1 overflow-y-auto"
        role="listbox"
        aria-label="Palette"
      >
        <div
          style={{
            height: rowVirtualizer.getTotalSize(),
            width: "100%",
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((vi) => {
            const s = palette[vi.index];
            const selected = s.hex === selectedHex;
            const target = effectiveMapping.get(s.hex);
            const overridden = mapping.has(s.hex);
            return (
              <button
                key={s.hex}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => select(s.hex)}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: vi.size,
                  transform: `translateY(${vi.start}px)`,
                }}
                className={cn(
                  "flex items-center gap-2.5 border-b border-hairline px-3 text-left transition-colors duration-100 hover:bg-raised",
                  selected && "bg-raised",
                )}
              >
                <SwatchTile hex={s.hex} />
                {target && target !== s.hex ? (
                  <>
                    <span className="font-mono text-[11px] text-text-mid line-through decoration-text-dim">
                      {s.hex.replace(/^#/, "")}
                    </span>
                    <span className="font-mono text-[10px] text-text-dim">
                      →
                    </span>
                    <SwatchTile hex={target} small />
                    <span className="font-mono text-[11px] text-text">
                      {target.replace(/^#/, "")}
                    </span>
                  </>
                ) : (
                  <span className="font-mono text-[11px] text-text">
                    {s.hex.replace(/^#/, "")}
                  </span>
                )}
                <span className="flex-1" />
                <span className="font-mono text-[10px] tabular-nums text-text-mid">
                  {s.pct < 0.1 ? "<0.1" : s.pct.toFixed(1)}%
                </span>
                {overridden && (
                  <span className="font-mono text-[9px] uppercase tracking-wider text-accent">
                    edit
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SwatchTile({ hex, small = false }: { hex: string; small?: boolean }) {
  const size = small ? 12 : 18;
  return (
    <span
      aria-hidden
      style={{
        width: size,
        height: size,
        background: hex,
        boxShadow: isLight(hex)
          ? "inset 0 0 0 1px oklch(0% 0 0 / 0.18)"
          : "inset 0 0 0 1px oklch(100% 0 0 / 0.12)",
        borderRadius: 2,
      }}
    />
  );
}
