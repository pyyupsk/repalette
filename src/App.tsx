import { useCallback, useEffect } from "react";
import { AppProvider } from "./state/AppContext";
import { useApp } from "./state/useApp";
import { extractPalette } from "./lib/palette";
import { detectSource, renderRemapped } from "./lib/remap";
import { TopBar } from "./components/TopBar";
import { PresetRail } from "./components/PresetRail";
import { Canvas } from "./components/Canvas";
import { PaletteList } from "./components/PaletteList";
import { Inspector } from "./components/Inspector";
import { StatusBar } from "./components/StatusBar";
import { ReviewBand } from "./components/ReviewBand";

function Shell() {
  const { image, palette, selectedHex, effectiveMapping, dispatch, theme } = useApp();

  const handleFile = useCallback(async (file: File) => {
    dispatch({ type: "begin-decode" });
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
      dispatch({
        type: "set-image",
        image: { file, url, bitmap, width: result.width, height: result.height, data },
        palette: result.swatches,
        source,
      });
    } catch (err) {
      dispatch({
        type: "decode-failed",
        error: err instanceof Error ? err.message : "decode failed · file may be corrupt",
      });
    }
  }, [dispatch]);

  const handleExport = useCallback(() => {
    if (!image) return;
    const out = effectiveMapping.size === 0
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
      a.download = image.file.name.replace(/(\.[^.]+)?$/, ".repalette.png");
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }, "image/png");
  }, [image, effectiveMapping]);

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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const editing = target.matches("input,textarea,[contenteditable]");
      const mod = e.metaKey || e.ctrlKey;

      if (mod && e.key.toLowerCase() === "e") {
        e.preventDefault();
        handleExport();
        return;
      }
      if (editing) return;
      if (e.key === "t" && !mod) {
        const order = ["light", "dark", "system"] as const;
        const idx = order.indexOf(theme);
        dispatch({ type: "set-theme", theme: order[(idx + 1) % order.length] });
        return;
      }
      if (!palette.length || !selectedHex) return;
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const i = palette.findIndex((s) => s.hex === selectedHex);
        const next = e.key === "ArrowDown"
          ? Math.min(palette.length - 1, i + 1)
          : Math.max(0, i - 1);
        dispatch({ type: "select", hex: palette[next].hex });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [palette, selectedHex, theme, handleExport, dispatch]);

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
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
