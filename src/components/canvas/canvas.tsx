import { useEffect, useRef } from "react";
import { renderRemapped } from "../../lib/remap";
import { useEffectiveMapping, useStore } from "../../state/store";
import { Dropzone } from "./dropzone";

type Props = {
  onFile: (file: File) => void;
};

export function Canvas({ onFile }: Props) {
  const image = useStore((s) => s.image);
  const status = useStore((s) => s.status);
  const error = useStore((s) => s.error);
  const effectiveMapping = useEffectiveMapping();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!image) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (effectiveMapping.size === 0) {
      ctx.putImageData(image.data, 0, 0);
      return;
    }
    const remapped = renderRemapped(image.data, effectiveMapping);
    ctx.putImageData(remapped, 0, 0);
  }, [image, effectiveMapping]);

  if (!image) {
    return (
      <section className="relative flex-1 overflow-hidden">
        <Dropzone onFile={onFile} error={error} />
      </section>
    );
  }

  return (
    <section className="relative flex-1 overflow-hidden bg-bg">
      <div
        className="absolute inset-0 grid place-items-center p-8"
        style={{
          backgroundImage:
            "linear-gradient(var(--hairline) 1px, transparent 1px), linear-gradient(90deg, var(--hairline) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          backgroundPosition: "center",
          opacity: 0.25,
        }}
        aria-hidden
      />
      <div className="relative flex h-full w-full items-center justify-center p-8">
        <canvas
          ref={canvasRef}
          className="max-h-full max-w-full"
          style={{
            imageRendering: "pixelated",
            boxShadow: "0 24px 60px oklch(15% 0.006 350 / 0.45)",
          }}
        />
      </div>
      {status === "decoding" && (
        <div className="absolute bottom-4 left-4 font-mono text-[11px] text-text-mid">
          decoding…
        </div>
      )}
    </section>
  );
}
