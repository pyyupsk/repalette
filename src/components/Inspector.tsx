import { useState } from "react";
import { useApp } from "../state/useApp";
import { hexToRgb, isLight, rgbToHex } from "../lib/colors";
import { IconCopy } from "./icons";

const isValidHex = (s: string) => /^#?[0-9a-f]{6}$/i.test(s);

export function Inspector() {
  const { selectedHex, palette, mapping, effectiveMapping, dispatch } =
    useApp();
  const swatch = palette.find((s) => s.hex === selectedHex);
  const currentTarget = selectedHex
    ? (effectiveMapping.get(selectedHex) ?? selectedHex)
    : null;

  if (!swatch || !selectedHex || !currentTarget) {
    return (
      <div className="flex flex-1 flex-col overflow-hidden border-t border-hairline bg-panel">
        <div className="px-3 py-2 font-mono text-[10px] uppercase tracking-[0.08em] text-text-dim">
          Inspector
        </div>
        <div className="grid flex-1 place-items-center px-3 font-mono text-[11px] text-text-dim">
          select a color
        </div>
      </div>
    );
  }

  return (
    <InspectorBody
      key={`${selectedHex}|${currentTarget}`}
      hex={selectedHex}
      currentTarget={currentTarget}
      count={swatch.count}
      pct={swatch.pct}
      edited={mapping.has(selectedHex)}
      dispatch={dispatch}
    />
  );
}

type BodyProps = {
  hex: string;
  currentTarget: string;
  count: number;
  pct: number;
  edited: boolean;
  dispatch: ReturnType<typeof useApp>["dispatch"];
};

function InspectorBody({
  hex,
  currentTarget,
  count,
  pct,
  edited,
  dispatch,
}: BodyProps) {
  const [r, g, b] = hexToRgb(currentTarget);
  const [draft, setDraft] = useState(currentTarget.replace(/^#/, ""));

  const writeHex = (raw: string) => {
    setDraft(raw);
    const clean = raw.replace(/^#/, "");
    if (clean.length === 6 && isValidHex(clean)) {
      dispatch({ type: "edit", from: hex, to: `#${clean.toLowerCase()}` });
    }
  };

  const writeChannel = (channel: 0 | 1 | 2, value: number) => {
    const v = Math.max(0, Math.min(255, value | 0));
    const triplet: [number, number, number] = [r, g, b];
    triplet[channel] = v;
    const next = rgbToHex(triplet);
    setDraft(next.replace(/^#/, ""));
    dispatch({ type: "edit", from: hex, to: next });
  };

  const reset = () => {
    setDraft(hex.replace(/^#/, ""));
    dispatch({ type: "edit", from: hex, to: null });
  };

  const copy = () => navigator.clipboard?.writeText(currentTarget);

  return (
    <div className="flex flex-1 flex-col overflow-hidden border-t border-hairline bg-panel">
      <div className="flex items-center justify-between border-b border-hairline px-3 py-2">
        <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-dim">
          Inspector
        </div>
        <button
          type="button"
          onClick={reset}
          disabled={!edited}
          className="font-mono text-[10px] text-text-dim transition-colors duration-150 hover:text-text disabled:cursor-not-allowed disabled:opacity-30"
        >
          reset
        </button>
      </div>

      <div className="flex flex-col gap-4 overflow-y-auto p-3">
        <div className="flex items-stretch gap-3">
          <div
            className="h-20 w-20 shrink-0 rounded"
            style={{
              background: currentTarget,
              boxShadow: isLight(currentTarget)
                ? "inset 0 0 0 1px oklch(0% 0 0 / 0.15)"
                : "inset 0 0 0 1px oklch(100% 0 0 / 0.1)",
            }}
            aria-label={`Color preview ${currentTarget}`}
          />
          <div className="flex flex-1 flex-col justify-between py-0.5">
            <div className="flex flex-col gap-0.5">
              <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-dim">
                Source
              </div>
              <div className="flex items-center gap-2 font-mono text-[13px] text-text-mid">
                {hex.replace(/^#/, "")}
              </div>
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-dim">
                {edited ? "Mapped to" : "No edit"}
              </div>
              <div className="flex items-center gap-2 font-mono text-[13px] text-text">
                <input
                  value={draft}
                  onChange={(e) => writeHex(e.target.value)}
                  spellCheck={false}
                  maxLength={7}
                  className="w-[7ch] bg-transparent font-mono text-[13px] text-text outline-none"
                />
                <button
                  type="button"
                  onClick={copy}
                  className="text-text-dim transition-colors duration-150 hover:text-text"
                  aria-label="Copy hex"
                  title="Copy hex"
                >
                  <IconCopy size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <ChannelRow
            label="R"
            value={r}
            onChange={(v) => writeChannel(0, v)}
          />
          <ChannelRow
            label="G"
            value={g}
            onChange={(v) => writeChannel(1, v)}
          />
          <ChannelRow
            label="B"
            value={b}
            onChange={(v) => writeChannel(2, v)}
          />
        </div>

        <div className="flex items-center justify-between border-t border-hairline pt-3">
          <div className="flex flex-col gap-0.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-dim">
              Pixel count
            </span>
            <span className="font-mono text-[12px] tabular-nums text-text">
              {count.toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-dim">
              Share
            </span>
            <span className="font-mono text-[12px] tabular-nums text-text">
              {pct.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChannelRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-3 font-mono text-[11px] text-text-mid">{label}</span>
      <input
        type="range"
        min={0}
        max={255}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="flex-1 accent-accent"
        aria-label={`${label} channel`}
      />
      <input
        type="number"
        min={0}
        max={255}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value || "0", 10))}
        className="w-12 rounded border border-hairline bg-bg px-1.5 py-0.5 text-right font-mono text-[11px] tabular-nums text-text outline-none focus:border-accent"
      />
    </div>
  );
}
