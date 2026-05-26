import { useMemo, useState } from "react";
import { useApp } from "../state/useApp";
import { isLight } from "../lib/colors";

const DEFAULT_TOP = 30;

export function PaletteList() {
  const { palette, selectedHex, effectiveMapping, mapping, dispatch } = useApp();
  const [showAll, setShowAll] = useState(false);

  const list = useMemo(
    () => (showAll ? palette : palette.slice(0, DEFAULT_TOP)),
    [palette, showAll],
  );

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

      <ul
        className="flex-1 overflow-y-auto"
        role="listbox"
        aria-label="Palette"
      >
        {list.map((s) => {
          const selected = s.hex === selectedHex;
          const target = effectiveMapping.get(s.hex);
          const overridden = mapping.has(s.hex);
          return (
            <li key={s.hex}>
              <button
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => dispatch({ type: "select", hex: s.hex })}
                className={[
                  "group flex w-full items-center gap-2.5 border-b border-hairline px-3 py-1.5 text-left transition-colors duration-100",
                  selected ? "bg-raised" : "hover:bg-raised",
                ].join(" ")}
              >
                <SwatchTile hex={s.hex} />
                {target && target !== s.hex ? (
                  <>
                    <span className="font-mono text-[11px] text-text-mid line-through decoration-text-dim">
                      {s.hex.replace(/^#/, "")}
                    </span>
                    <span className="font-mono text-[10px] text-text-dim">→</span>
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
            </li>
          );
        })}
      </ul>

      {palette.length > DEFAULT_TOP && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="border-t border-hairline bg-panel py-2 font-mono text-[11px] text-text-mid transition-colors duration-150 hover:bg-raised hover:text-text"
        >
          {showAll
            ? `show top ${DEFAULT_TOP}`
            : `show all ${palette.length}`}
        </button>
      )}
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
