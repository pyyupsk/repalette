import { useRef } from "react";
import { IconDownload, IconRotate, IconUpload } from "@tabler/icons-react";
import { useStore } from "../../state/store";
import { Button } from "../ui/button";
import { ThemeToggle } from "./theme-toggle";

type Props = {
  onFile: (file: File) => void;
  onExport: () => void;
};

export function TopBar({ onFile, onExport }: Props) {
  const image = useStore((s) => s.image);
  const reset = useStore((s) => s.reset);
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
        <Button
          onClick={pickFile}
          icon={<IconUpload size={13} stroke={1.6} />}
        >
          Upload
        </Button>
        {image && (
          <Button
            onClick={reset}
            icon={<IconRotate size={13} stroke={1.6} />}
            className="text-text-mid hover:text-text"
          >
            Reset
          </Button>
        )}
        <span className="mx-1 h-5 w-px bg-hairline" aria-hidden />
        <ThemeToggle />
        <span className="mx-1 h-5 w-px bg-hairline" aria-hidden />
        <Button
          variant="accent"
          onClick={onExport}
          disabled={!image}
          icon={<IconDownload size={13} stroke={1.6} />}
          className="px-3 shadow-[inset_0_0_0_1px_oklch(70%_0.25_350)]"
        >
          Export
        </Button>
      </div>
    </header>
  );
}
