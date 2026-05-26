import { cn } from "../lib/cn";
import { presets, type Preset } from "../lib/presets";
import { buildColorMap } from "../lib/remap";
import { useApp } from "../state/useApp";

const slotPreview: Array<keyof Preset["colors"]> = [
  "base",
  "surface1",
  "overlay1",
  "text",
  "blue",
  "green",
  "yellow",
  "red",
  "pink",
  "mauve",
];

export function PresetRail() {
  const { palette, sourcePreset, previewPreset, dispatch } = useApp();

  const handleApply = (preset: Preset) => {
    if (!sourcePreset) return;
    if (preset.id === previewPreset?.id) {
      dispatch({ type: "revert-preview" });
      return;
    }
    const mapping = buildColorMap(
      palette.map((s) => s.hex),
      sourcePreset,
      preset,
    );
    dispatch({ type: "preview", preset, mapping });
  };

  const handleSource = (preset: Preset) => {
    dispatch({ type: "set-source", preset });
    if (previewPreset) {
      const mapping = buildColorMap(
        palette.map((s) => s.hex),
        preset,
        previewPreset,
      );
      dispatch({ type: "preview", preset: previewPreset, mapping });
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
                    {slotPreview.map((slot) => (
                      <span
                        key={slot}
                        className="flex-1 rounded-[1px]"
                        style={{ background: preset.colors[slot] }}
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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-dim">
      {children}
    </div>
  );
}
