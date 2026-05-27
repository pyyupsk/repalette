import { useState } from "react";
import { IconCopy } from "@tabler/icons-react";
import { NumberField } from "@base-ui/react/number-field";
import { Popover } from "@base-ui/react/popover";
import { Slider } from "@base-ui/react/slider";
import { HexColorPicker } from "react-colorful";
import { toast } from "sonner";
import { hexToRgb, isLight, rgbToHex } from "../lib/colors";
import { useEffectiveMapping, useStore } from "../state/store";

const isValidHex = (s: string) => /^#?[0-9a-f]{6}$/i.test(s);

export function Inspector() {
  const selectedHex = useStore((s) => s.selectedHex);
  const palette = useStore((s) => s.palette);
  const mapping = useStore((s) => s.mapping);
  const effectiveMapping = useEffectiveMapping();
  const edit = useStore((s) => s.edit);

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
      key={selectedHex}
      hex={selectedHex}
      currentTarget={currentTarget}
      count={swatch.count}
      pct={swatch.pct}
      edited={mapping.has(selectedHex)}
      edit={edit}
    />
  );
}

type BodyProps = {
  hex: string;
  currentTarget: string;
  count: number;
  pct: number;
  edited: boolean;
  edit: (from: string, to: string | null) => void;
};

function InspectorBody({
  hex,
  currentTarget,
  count,
  pct,
  edited,
  edit,
}: BodyProps) {
  const [r, g, b] = hexToRgb(currentTarget);
  const [draft, setDraft] = useState(currentTarget.replace(/^#/, ""));

  const writeHex = (raw: string) => {
    setDraft(raw);
    const clean = raw.replace(/^#/, "");
    if (clean.length === 6 && isValidHex(clean)) {
      edit(hex, `#${clean.toLowerCase()}`);
    }
  };

  const writeChannel = (channel: 0 | 1 | 2, value: number) => {
    const v = Math.max(0, Math.min(255, value | 0));
    const triplet: [number, number, number] = [r, g, b];
    triplet[channel] = v;
    const next = rgbToHex(triplet);
    setDraft(next.replace(/^#/, ""));
    edit(hex, next);
  };

  const reset = () => {
    setDraft(hex.replace(/^#/, ""));
    edit(hex, null);
  };

  const copy = async () => {
    try {
      await navigator.clipboard?.writeText(currentTarget);
      toast.success(`copied ${currentTarget}`);
    } catch {
      toast.error("clipboard blocked");
    }
  };

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
          <Popover.Root>
            <Popover.Trigger
              className="h-20 w-20 shrink-0 cursor-pointer rounded outline-none focus-visible:ring-2 focus-visible:ring-accent-ring"
              style={{
                background: currentTarget,
                boxShadow: isLight(currentTarget)
                  ? "inset 0 0 0 1px oklch(0% 0 0 / 0.15)"
                  : "inset 0 0 0 1px oklch(100% 0 0 / 0.1)",
              }}
              aria-label={`Pick replacement color for ${hex}`}
              title="Pick color"
            />
            <Popover.Portal>
              <Popover.Positioner sideOffset={8} side="bottom" align="start">
                <Popover.Popup className="rounded-md border border-hairline bg-panel p-2 shadow-[0_8px_24px_oklch(0%_0_0/0.35)] outline-none">
                  <HexColorPicker color={currentTarget} onChange={writeHex} />
                </Popover.Popup>
              </Popover.Positioner>
            </Popover.Portal>
          </Popover.Root>
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
                  <IconCopy size={12} stroke={1.6} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
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
      <Slider.Root
        value={value}
        onValueChange={(v) => onChange(typeof v === "number" ? v : v[0])}
        min={0}
        max={255}
        step={1}
        className="flex-1"
        aria-label={`${label} channel`}
      >
        <Slider.Control className="relative flex h-4 w-full touch-none items-center select-none">
          <Slider.Track className="relative h-1 grow rounded-full bg-hairline">
            <Slider.Indicator className="absolute h-full rounded-full bg-accent" />
            <Slider.Thumb className="block h-3 w-3 -translate-y-1/2 rounded-full bg-accent shadow-[0_1px_2px_oklch(15%_0.006_350/0.4)] outline-none focus-visible:ring-2 focus-visible:ring-accent-ring" />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>
      <NumberField.Root
        value={value}
        onValueChange={(v) => onChange(v ?? 0)}
        min={0}
        max={255}
        step={1}
        aria-label={`${label} value`}
      >
        <NumberField.Input className="w-12 rounded border border-hairline bg-bg px-1.5 py-0.5 text-right font-mono text-[11px] tabular-nums text-text outline-none focus:border-accent" />
      </NumberField.Root>
    </div>
  );
}
