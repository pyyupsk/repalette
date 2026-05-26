import { useApp } from "../state/useApp";

export function StatusBar() {
  const { image, palette, mapping, previewPreset, sourcePreset, status } = useApp();
  if (!image) return null;

  return (
    <footer
      className="flex items-center justify-between border-t border-hairline bg-panel px-3 font-mono text-[10px] text-text-mid"
      style={{ height: 28 }}
    >
      <div className="flex items-center gap-3">
        <span className="tabular-nums">
          {image.width}×{image.height}
        </span>
        <span className="text-text-dim">·</span>
        <span className="tabular-nums">
          {palette.length} colors
        </span>
        <span className="text-text-dim">·</span>
        <span className="tabular-nums">
          {mapping.size} mapped
        </span>
        {sourcePreset && (
          <>
            <span className="text-text-dim">·</span>
            <span>src {sourcePreset.name}</span>
          </>
        )}
        {previewPreset && (
          <>
            <span className="text-text-dim">·</span>
            <span className="text-accent">preview {previewPreset.name}</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        {status === "decoding" && <span>decoding…</span>}
        <span className="text-text-dim">↑/↓ swatch · t theme · ⌘E export</span>
      </div>
    </footer>
  );
}
