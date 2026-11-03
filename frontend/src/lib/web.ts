/**
 * On web, React Native's overlay/modals sit above the page while the element
 * that opened them keeps DOM focus, which makes the framework warn that a
 * focused node is hidden (`aria-hidden`). We never set `aria-hidden` by hand;
 * instead we drop focus from the trigger when an overlay opens, a tab changes
 * or we navigate. No-op on native, where there is no `document`.
 */
export function blurActiveElement(): void {
  if (typeof document === 'undefined') return;
  const el = (document as Document).activeElement as HTMLElement | null;
  el?.blur?.();
}
