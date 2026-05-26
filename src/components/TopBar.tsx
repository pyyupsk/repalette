import { useRef } from "react";
import { useApp } from "../state/useApp";
import { ThemeToggle } from "./ThemeToggle";
import { IconDownload, IconRotate, IconUpload } from "./icons";

type Props = {
  onFile: (file: File) => void;
  onExport: () => void;
};

export function TopBar({ onFile, onExport }: Props) {
  const { image, dispatch } = useApp();
  const fileRef = useRef<HTMLInputElement>(null);

  const pickFile = () => fileRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onFile(f);
    e.target.value = "";
  };

  return (
    <header
      className="flex items-center justify-between gap-3 border-b border-hairline bg-panel px-4"
      style={{ height: 44 }}
    >
      <div className="flex items-center gap-3">
        <span className="font-display text-[15px] font-semibold tracking-tight text-text">
          repalette
        </span>
        {image && (
          <>
            <span className="text-text-dim">·</span>
            <span className="font-mono text-[12px] text-text-mid">
              {image.file.name}
            </span>
            <span className="font-mono text-[12px] text-text-dim">
              {image.width}×{image.height}
            </span>
          </>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={pickFile}
          className="flex h-7 items-center gap-1.5 rounded-md border border-hairline bg-panel px-2.5 text-[12px] text-text transition-colors duration-150 hover:bg-raised"
        >
          <IconUpload size={13} />
          Upload
        </button>
        {image && (
          <button
            type="button"
            onClick={() => dispatch({ type: "reset" })}
            className="flex h-7 items-center gap-1.5 rounded-md border border-hairline bg-panel px-2.5 text-[12px] text-text-mid transition-colors duration-150 hover:bg-raised hover:text-text"
          >
            <IconRotate size={13} />
            Reset
          </button>
        )}
        <span className="mx-1 h-5 w-px bg-hairline" aria-hidden />
        <ThemeToggle />
        <span className="mx-1 h-5 w-px bg-hairline" aria-hidden />
        <button
          type="button"
          onClick={onExport}
          disabled={!image}
          className="flex h-7 items-center gap-1.5 rounded-md bg-accent px-3 text-[12px] font-medium text-text shadow-[inset_0_0_0_1px_oklch(70%_0.25_350)] transition-opacity duration-150 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
          style={{ color: "oklch(14% 0.01 350)" }}
        >
          <IconDownload size={13} />
          Export
        </button>
      </div>
    </header>
  );
}
