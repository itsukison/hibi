// Shared spring presets (DESIGN.md §7).
export const snappy = { type: 'spring', stiffness: 500, damping: 32 } as const;
export const soft = { type: 'spring', stiffness: 260, damping: 26 } as const;

// Stable pseudo-random tilt in [-5, 5] degrees, derived from an id.
export function tiltFor(id: string, range = 5) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return ((Math.abs(h) % 1000) / 1000) * range * 2 - range;
}
