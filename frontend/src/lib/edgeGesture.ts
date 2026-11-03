import { Platform } from 'react-native';

/**
 * The web browser treats a swipe that starts at the left edge of the viewport
 * as "go back": the app navigates away and the screen is rebuilt from scratch.
 * The day strip lives at that edge, so a swipe over it used to throw the user
 * out of the app (and back to today on the way in).
 *
 * The guard cancels the browser's default handling for touches that start on
 * the edge, so the app keeps the gesture. It is a no-op on native, where the
 * equivalent gesture is the system back gesture (disabled for the app tabs in
 * `app/_layout.tsx`).
 */
const EDGE_PX = 32;

export function installEdgeGestureGuard(): () => void {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return () => {};

  let armed = false;

  const onTouchStart = (event: TouchEvent) => {
    const touch = event.touches[0];
    armed = !!touch && touch.clientX <= EDGE_PX;
  };

  const onTouchMove = (event: TouchEvent) => {
    if (!armed) return;
    const touch = event.touches[0];
    if (!touch) return;
    if (touch.clientX > EDGE_PX + 24) {
      // The gesture turned into a real horizontal swipe: keep it in the app.
      event.preventDefault();
      armed = false;
    }
  };

  const onTouchEnd = () => {
    armed = false;
  };

  document.addEventListener('touchstart', onTouchStart, { passive: true });
  document.addEventListener('touchmove', onTouchMove, { passive: false });
  document.addEventListener('touchend', onTouchEnd, { passive: true });
  document.addEventListener('touchcancel', onTouchEnd, { passive: true });

  return () => {
    document.removeEventListener('touchstart', onTouchStart);
    document.removeEventListener('touchmove', onTouchMove);
    document.removeEventListener('touchend', onTouchEnd);
    document.removeEventListener('touchcancel', onTouchEnd);
  };
}
