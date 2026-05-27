import { IconUpload } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";
import { cn } from "../../lib/cn";

type Props = {
  onFile: (file: File) => void;
  error: string | null;
};

const accept = {
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/webp": [".webp"],
};

export function Dropzone({ onFile, error }: Props) {
  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    accept,
    multiple: false,
    noClick: true,
    noKeyboard: true,
    onDrop: (files) => {
      const file = files[0];
      if (file) onFile(file);
    },
  });

  return (
    <div
      {...getRootProps({
        className: cn(
          "relative grid h-full w-full place-items-center px-8 transition-colors duration-200",
          isDragActive ? "bg-raised" : "bg-bg",
        ),
      })}
    >
      <input {...getInputProps()} />
      <div className="flex max-w-md flex-col items-center gap-5 text-center">
        <h2 className="font-display text-[clamp(1.8rem,3vw,2.5rem)] font-medium leading-[1.05] tracking-tight text-text">
          Drop an image. Or paste.
        </h2>
        <p className="font-mono text-[12px] text-text-dim">
          accepted: png, jpeg, webp
        </p>
        <button
          type="button"
          onClick={open}
          className="mt-1 flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-[13px] font-medium transition-opacity duration-150 hover:opacity-90"
          style={{ color: "oklch(14% 0.01 350)" }}
        >
          <IconUpload size={14} stroke={1.6} />
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
