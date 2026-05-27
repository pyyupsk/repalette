import { IconCheck, IconRotate } from "@tabler/icons-react";
import { useStore } from "../state/store";

export function ReviewBand() {
  const previewPreset = useStore((s) => s.previewPreset);
  const previewMapping = useStore((s) => s.previewMapping);
  const sourcePreset = useStore((s) => s.sourcePreset);
  const revertPreview = useStore((s) => s.revertPreview);
  const commitPreview = useStore((s) => s.commitPreview);

  if (!previewPreset || !previewMapping || !sourcePreset) return null;

  let changed = 0;
  for (const [k, v] of previewMapping) {
    if (k !== v) changed++;
  }

  return (
    <div
      className="flex items-center justify-between gap-3 border-b border-hairline bg-bg px-4"
      style={{ height: 40 }}
    >
      <div className="flex items-center gap-2.5 font-mono text-[11px] text-text">
        <span className="text-text-mid">{sourcePreset.name}</span>
        <span className="text-text-dim">→</span>
        <span>{previewPreset.name}</span>
        <span className="text-text-dim">·</span>
        <span className="tabular-nums text-text-mid">
          {changed} of {previewMapping.size} mapped
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={revertPreview}
          className="flex h-6 items-center gap-1.5 rounded border border-hairline bg-panel px-2 font-mono text-[11px] text-text-mid transition-colors duration-150 hover:bg-raised hover:text-text"
        >
          <IconRotate size={11} stroke={1.6} />
          Revert
        </button>
        <button
          type="button"
          onClick={commitPreview}
          className="flex h-6 items-center gap-1.5 rounded bg-accent px-2 font-mono text-[11px] font-medium transition-opacity duration-150 hover:opacity-90"
          style={{ color: "oklch(14% 0.01 350)" }}
        >
          <IconCheck size={11} stroke={1.6} />
          Commit
        </button>
      </div>
    </div>
  );
}
