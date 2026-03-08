import type { ActionReturn } from "svelte/action";

type TooltipOptions = {
  position?: string;
  align?: string;
  animation?: string;
  theme?: string;
};

// Svelte 5-safe fallback tooltip action.
// We intentionally rely on the native browser tooltip via the `title` attribute.
export function tooltip(
  _node: HTMLElement,
  _options?: TooltipOptions,
): ActionReturn<TooltipOptions> {
  return {
    update: () => undefined,
    destroy: () => undefined,
  };
}
