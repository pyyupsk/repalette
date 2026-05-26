import { useContext } from "react";
import { AppCtx, type Ctx } from "./context";

export function useApp(): Ctx {
  const v = useContext(AppCtx);
  if (!v) throw new Error("useApp used outside AppProvider");
  return v;
}
