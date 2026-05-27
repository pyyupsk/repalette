import { useCallback, useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Toaster, toast } from "sonner";
import { Canvas } from "./components/canvas/canvas";
import { Inspector } from "./components/palette/inspector";
import { PaletteList } from "./components/palette/palette-list";
import { PresetRail } from "./components/palette/preset-rail";
import { ReviewBand } from "./components/layout/review-band";
import { StatusBar } from "./components/layout/status-bar";
import { TopBar } from "./components/layout/top-bar";
import { extractPalette } from "./lib/palette";
import { detectSource, renderRemapped } from "./lib/remap";
import { useEffectiveMapping, useStore } from "./state/store";

const themeOrder = ["light", "dark", "system"] as const;

export default function App() {
  const image = useStore((s) => s.image);
  const palette = useStore((s) => s.palette);
  const selectedHex = useStore((s) => s.selectedHex);
  const theme = useStore((s) => s.theme);
  const effectiveMapping = useEffectiveMapping();

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.themeChanging = "";
    if (theme === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // ignore quota / private mode
    }
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        delete root.dataset.themeChanging;
      });
    });
    return () => cancelAnimationFrame(id);
  }, [theme]);

  const handleFile = useCallback(async (file: File) => {
    const { beginDecode, setImage, decodeFailed } = useStore.getState();
    beginDecode();
    try {
      const url = URL.createObjectURL(file);
      const bitmap = await createImageBitmap(file);
      const result = extractPalette(bitmap);
      const c = document.createElement("canvas");
      c.width = result.width;
      c.height = result.height;
      const ctx = c.getContext("2d");
      if (!ctx) throw new Error("no 2d context");
      ctx.drawImage(bitmap, 0, 0);
      const data = ctx.getImageData(0, 0, result.width, result.height);
      const source = detectSource(result.swatches);
      setImage(
        {
          file,
          url,
          bitmap,
          width: result.width,
          height: result.height,
          data,
        },
        result.swatches,
        source,
      );
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "decode failed · file may be corrupt";
      decodeFailed(msg);
      toast.error(msg);
    }
  }, []);

  const handleExport = useCallback(() => {
    if (!image) return;
    const out =
      effectiveMapping.size === 0
        ? image.data
        : renderRemapped(image.data, effectiveMapping);
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.putImageData(out, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const name = image.file.name.replace(/(\.[^.]+)?$/, ".repalette.png");
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success(`exported ${name}`);
    }, "image/png");
  }, [image, effectiveMapping]);

  useHotkeys(
    "mod+e",
    (e) => {
      e.preventDefault();
      handleExport();
    },
    { enableOnFormTags: true },
  );

  useHotkeys("t", () => {
    const idx = themeOrder.indexOf(theme);
    useStore.getState().setTheme(themeOrder[(idx + 1) % themeOrder.length]);
  });

  const cycleSwatch = useCallback(
    (direction: 1 | -1) => {
      if (!palette.length || !selectedHex) return;
      const i = palette.findIndex((s) => s.hex === selectedHex);
      const next =
        direction === 1
          ? Math.min(palette.length - 1, i + 1)
          : Math.max(0, i - 1);
      useStore.getState().select(palette[next].hex);
    },
    [palette, selectedHex],
  );

  useHotkeys("ArrowDown", (e) => {
    e.preventDefault();
    cycleSwatch(1);
  });
  useHotkeys("ArrowUp", (e) => {
    e.preventDefault();
    cycleSwatch(-1);
  });

  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const item = Array.from(e.clipboardData?.items ?? []).find((i) =>
        i.type.startsWith("image/"),
      );
      const file = item?.getAsFile();
      if (file) handleFile(file);
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [handleFile]);

  return (
    <div className="flex h-svh flex-col overflow-hidden">
      <TopBar onFile={handleFile} onExport={handleExport} />
      <ReviewBand />
      <div className="grid min-h-0 flex-1 grid-cols-[auto_1fr_360px] overflow-hidden">
        <PresetRail />
        <Canvas onFile={handleFile} />
        <aside className="flex min-h-0 flex-col overflow-hidden border-l border-hairline bg-panel">
          <PaletteList />
          <Inspector />
        </aside>
      </div>
      <StatusBar />
      <Toaster
        theme={theme}
        position="bottom-right"
        toastOptions={{
          className: "font-mono",
          style: {
            background: "var(--panel)",
            color: "var(--text)",
            border: "1px solid var(--hairline)",
          },
        }}
      />
    </div>
  );
}
