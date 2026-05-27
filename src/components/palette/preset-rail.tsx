import { cn } from "@/lib/cn";
import { type HueBucket, type Preset, presets } from "@/lib/presets";
import { buildColorMap } from "@/lib/remap";
import { useStore } from "@/state/store";
import { SectionLabel } from "@/components/ui/section-label";

const ACCENT_ORDER: HueBucket[] = [
  "red",
  "orange",
  "yellow",
  "green",
  "cyan",
  "blue",
  "purple",
  "pink",
];

const previewSwatches = (preset: Preset): string[] => {
  const n = preset.neutrals;
  const picks: string[] = [];
  if (n.length) picks.push(n[0]);
  if (n.length > 1) picks.push(n[Math.floor(n.length / 2)]);
  if (n.length > 2) picks.push(n[n.length - 1]);
  for (const bucket of ACCENT_ORDER) {
    const hex = preset.accents[bucket];
    if (hex) picks.push(hex);
  }
  return picks;
};

export function PresetRail() {
  const palette = useStore((s) => s.palette);
  const sourcePreset = useStore((s) => s.sourcePreset);
  const previewPreset = useStore((s) => s.previewPreset);
  const setSource = useStore((s) => s.setSource);
  const preview = useStore((s) => s.preview);
  const revertPreview = useStore((s) => s.revertPreview);

  const handleApply = (preset: Preset) => {
    if (!sourcePreset) return;
    if (preset.id === previewPreset?.id) {
      revertPreview();
      return;
    }
    const mapping = buildColorMap(
      palette.map((s) => s.hex),
      sourcePreset,
      preset,
    );
    preview(preset, mapping);
  };

  const handleSource = (preset: Preset) => {
    setSource(preset);
    if (previewPreset) {
      const mapping = buildColorMap(
        palette.map((s) => s.hex),
        preset,
        previewPreset,
      );
      preview(previewPreset, mapping);
    }
  };

  return (
    <aside
      className="flex flex-col overflow-hidden border-r border-hairline bg-panel"
      style={{ width: 220 }}
    >
      <div className="flex flex-col gap-3 overflow-y-auto px-3 py-4">
        <div>
          <SectionLabel>Source preset</SectionLabel>
          <div className="mt-2 grid gap-0.5">
            {presets.map((preset) => {
              const active = sourcePreset?.id === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSource(preset)}
                  disabled={!palette.length}
                  className={cn(
                    "flex h-7 items-center justify-between rounded px-2 text-[12px] text-text-mid transition-colors duration-150 hover:bg-raised hover:text-text disabled:cursor-not-allowed disabled:opacity-40",
                    active && "bg-raised text-text",
                  )}
                >
                  <span className="truncate">{preset.name}</span>
                  {active && (
                    <span className="font-mono text-[10px] text-accent">
                      src
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-1 border-t border-hairline pt-3">
          <SectionLabel>Apply target</SectionLabel>
          <div className="mt-2 flex flex-col gap-1.5">
            {presets.map((preset) => {
              const isPreview = previewPreset?.id === preset.id;
              const disabled =
                !palette.length ||
                !sourcePreset ||
                sourcePreset.id === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleApply(preset)}
                  disabled={disabled}
                  className={cn(
                    "group flex flex-col gap-1 rounded border border-hairline bg-bg px-2 py-1.5 text-left transition-colors duration-150 hover:border-text-dim",
                    isPreview && "border-accent hover:border-accent",
                    disabled &&
                      "cursor-not-allowed opacity-40 hover:border-hairline",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate text-[12px] text-text">
                      {preset.name}
                    </span>
                    {isPreview && (
                      <span className="font-mono text-[10px] text-accent">
                        preview
                      </span>
                    )}
                  </div>
                  <div className="flex h-3 gap-px">
                    {previewSwatches(preset).map((hex) => (
                      <span
                        key={hex}
                        className="flex-1 rounded-[1px]"
                        style={{ background: hex }}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
