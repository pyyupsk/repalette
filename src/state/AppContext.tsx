import { useEffect, useMemo, useReducer, type ReactNode } from "react";
import { AppCtx, type Ctx, type Theme, initialState, reducer } from "./context";

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState, (s) => ({
    ...s,
    theme:
      (typeof localStorage !== "undefined" &&
        (localStorage.getItem("theme") as Theme)) ||
      "system",
  }));

  useEffect(() => {
    const root = document.documentElement;
    if (state.theme === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", state.theme);
    try {
      localStorage.setItem("theme", state.theme);
    } catch {
      // ignore quota / private mode
    }
  }, [state.theme]);

  const effectiveMapping = useMemo(() => {
    if (!state.previewMapping) return state.mapping;
    const m = new Map(state.previewMapping);
    for (const [k, v] of state.mapping) m.set(k, v);
    return m;
  }, [state.mapping, state.previewMapping]);

  const value = useMemo<Ctx>(
    () => ({ ...state, dispatch, effectiveMapping }),
    [state, effectiveMapping],
  );
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}
