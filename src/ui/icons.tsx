// Hand-drawn style icons for the bottom bar: slightly wobbly ink strokes to match the paper diary.
type P = { size?: number };
const base = (size: number) => ({ width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true });

// A diary page with two binding rings and a little sticker on it.
export function DiaryIcon({ size = 22 }: P) {
  return (
    <svg {...base(size)}>
      <path d="M5.2 7.1c-.1-1.2.7-2 1.9-2.1l10-.2c1.1 0 1.9.8 1.9 1.9l.2 11c0 1.2-.8 2-2 2.1l-10 .1c-1.1 0-1.9-.8-2-1.9Z" />
      <path d="M9 3.4v3.2M15.1 3.3v3.3" />
      <path d="M5.4 9.6c4.4-.3 8.8-.3 13.3-.1" />
      <path d="M13.6 12.6l.7 1.4 1.5.2-1.1 1 .3 1.5-1.4-.7-1.3.8.2-1.5-1.1-1.1 1.5-.2Z" fill="currentColor" strokeWidth={1} />
    </svg>
  );
}

// A speech bubble with a small hand-drawn sparkle inside.
export function AskIcon({ size = 22 }: P) {
  return (
    <svg {...base(size)}>
      <path d="M4.6 11.6c-.2-3.7 3-6.6 7.3-6.7 4.2-.1 7.6 2.6 7.6 6.2.1 3.6-3.2 6.4-7.4 6.5-1 0-1.9-.1-2.8-.4l-3.7 1.9 1-3.3c-1.2-1.1-1.9-2.5-2-4.2Z" />
      <path d="M12 8.6c.2 1.4.7 1.9 2 2.1-1.3.3-1.8.8-2 2.1-.3-1.3-.8-1.8-2.1-2.1 1.3-.2 1.8-.7 2.1-2.1Z" fill="currentColor" strokeWidth={1} />
    </svg>
  );
}

// A slightly uneven hand-drawn plus.
export function PlusIcon({ size = 22 }: P) {
  return (
    <svg {...base(size)} strokeWidth={1.9}>
      <path d="M12.2 5.2c-.2 4.6-.1 9.1.1 13.6" />
      <path d="M5.3 12.1c4.5-.3 9-.2 13.5.1" />
    </svg>
  );
}
