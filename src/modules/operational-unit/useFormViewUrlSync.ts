import { useEffect } from "react";

export type FormView = "list" | "create" | "edit";

interface UrlFormParams {
  view: FormView;
  id: string | null;
}

// Reads ?view=create|edit&id=X from the current URL (query string only —
// the path itself is already owned/synced by App.tsx's tab routing).
export function getUrlFormParams(): UrlFormParams {
  const params = new URLSearchParams(window.location.search);
  const view = params.get("view");
  if (view === "create") return { view: "create", id: null };
  if (view === "edit" && params.get("id")) return { view: "edit", id: params.get("id") };
  return { view: "list", id: null };
}

// Pushes the given form view onto the URL via the native History API — no
// router dependency, mirrors the pushState/popstate pattern App.tsx already
// uses for top-level tabs. Lets browser back/forward and refresh restore the
// right view instead of always landing back on the list.
export function setUrlFormParams(view: FormView, id?: string | null): void {
  const params = new URLSearchParams(window.location.search);
  if (view === "list") {
    params.delete("view");
    params.delete("id");
  } else {
    params.set("view", view);
    if (id) params.set("id", id);
    else params.delete("id");
  }
  const qs = params.toString();
  const newUrl = `${window.location.pathname}${qs ? `?${qs}` : ""}`;
  window.history.pushState({}, "", newUrl);
}

// Re-runs `onPopState` whenever the browser back/forward buttons change the
// URL, so a module can re-sync its local view state to match.
export function usePopStateSync(onPopState: () => void): void {
  useEffect(() => {
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [onPopState]);
}
