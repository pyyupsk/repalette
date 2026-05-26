import { useRef, useState } from "react";
import { IconUpload } from "./icons";

type Props = {
  onFile: (file: File) => void;
  error: string | null;
};

const accepted = ["image/png", "image/jpeg", "image/webp"];

export function Dropzone({ onFile, error }: Props) {
  const [over, setOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!accepted.includes(file.type)) return;
    onFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onFile(f);
    e.target.value = "";
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      className={[
        "relative grid h-full w-full place-items-center px-8 transition-colors duration-200",
        over ? "bg-raised" : "bg-bg",
      ].join(" ")}
    >
      <input
        ref={fileRef}
        type="file"
        accept={accepted.join(",")}
        onChange={handleChange}
        className="hidden"
      />
      <div className="flex max-w-md flex-col items-center gap-5 text-center">
        <h2 className="font-display text-[clamp(1.8rem,3vw,2.5rem)] font-medium leading-[1.05] tracking-tight text-text">
          Drop an image. Or paste.
        </h2>
        <p className="font-mono text-[12px] text-text-dim">
          accepted: png, jpeg, webp
        </p>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="mt-1 flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-[13px] font-medium transition-opacity duration-150 hover:opacity-90"
          style={{ color: "oklch(14% 0.01 350)" }}
        >
          <IconUpload size={14} />
          Choose file
        </button>
        {error && (
          <p className="font-mono text-[11px] text-text-mid">{error}</p>
        )}
      </div>
      <p
        aria-hidden
        className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-widest text-text-dim"
      >
        ⌘V to paste
      </p>
    </div>
  );
}
