// Entry animation for list items (songs, playlists).
// Keep the offset small: an item that is still transparent remains clickable, so a large
// offset would let invisible rows sit on top of their neighbours, headers and the nav and
// swallow taps until the animation finished. The stagger is capped so long lists settle fast.
export const listItemAnimation = (i = 0) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: Math.min(i, 12) * 0.03, duration: 0.25 },
});
