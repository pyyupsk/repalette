import { IconCheck, IconRotate } from "@tabler/icons-react";
import { useStore } from "../../state/store";
import { Button } from "../ui/button";

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
        <Button
          size="sm"
          onClick={revertPreview}
          icon={<IconRotate size={11} stroke={1.6} />}
          className="text-text-mid hover:text-text"
        >
          Revert
        </Button>
        <Button
          size="sm"
          variant="accent"
          onClick={commitPreview}
          icon={<IconCheck size={11} stroke={1.6} />}
        >
          Commit
        </Button>
      </div>
    </div>
  );
}
