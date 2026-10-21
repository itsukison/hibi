// Hand-tuned collage layouts for the day page. Units are % of the collage width (rendered with cqw),
// so a layout keeps its proportions at any phone width. Each day picks a variant from its date.

export type Arrow = 'dl' | 'dr' | 'ul' | 'ur'; // direction the ink arrow points (down-left, …)
export type Slot = { x: number; y: number; w: number; r: number };
export type NoteSlot = { x: number; y: number; w: number; align: 'left' | 'right'; arrow: Arrow };
export type Doodle = { kind: 'star' | 'sparkle' | 'heart' | 'squiggle'; x: number; y: number; r: number };
export type Layout = { h: number; slots: Slot[]; notes: NoteSlot[]; doodles: Doodle[] };

const L: Record<number, Layout[]> = {
  1: [
    { h: 96, slots: [{ x: 10, y: 4, w: 70, r: -3 }], notes: [{ x: 50, y: 76, w: 48, align: 'right', arrow: 'ul' }], doodles: [{ kind: 'sparkle', x: 84, y: 8, r: 0 }] },
    { h: 96, slots: [{ x: 22, y: 12, w: 70, r: 4 }], notes: [{ x: 0, y: 0, w: 46, align: 'left', arrow: 'dr' }], doodles: [{ kind: 'star', x: 6, y: 74, r: -12 }] },
  ],
  2: [
    { h: 112, slots: [{ x: 0, y: 2, w: 58, r: -5 }, { x: 40, y: 46, w: 58, r: 5 }],
      notes: [{ x: 60, y: 6, w: 38, align: 'left', arrow: 'dl' }, { x: 0, y: 74, w: 38, align: 'right', arrow: 'ur' }],
      doodles: [{ kind: 'squiggle', x: 6, y: 62, r: -8 }] },
    { h: 108, slots: [{ x: 38, y: 0, w: 60, r: 4 }, { x: 2, y: 42, w: 56, r: -4 }],
      notes: [{ x: 0, y: 8, w: 36, align: 'right', arrow: 'dr' }, { x: 60, y: 80, w: 38, align: 'left', arrow: 'ul' }],
      doodles: [{ kind: 'heart', x: 86, y: 64, r: 10 }] },
    { h: 100, slots: [{ x: 2, y: 12, w: 50, r: -6 }, { x: 46, y: 4, w: 52, r: 6 }],
      notes: [{ x: 4, y: 66, w: 44, align: 'left', arrow: 'ur' }, { x: 54, y: 62, w: 44, align: 'right', arrow: 'ul' }],
      doodles: [{ kind: 'star', x: 44, y: 0, r: 8 }] },
  ],
  3: [
    { h: 136, slots: [{ x: 2, y: 0, w: 52, r: -4 }, { x: 46, y: 32, w: 52, r: 5 }, { x: 6, y: 72, w: 54, r: -2 }],
      notes: [{ x: 58, y: 4, w: 40, align: 'left', arrow: 'dl' }, { x: 0, y: 50, w: 42, align: 'right', arrow: 'dr' }, { x: 62, y: 96, w: 36, align: 'left', arrow: 'ul' }],
      doodles: [{ kind: 'sparkle', x: 88, y: 76, r: 0 }] },
    { h: 132, slots: [{ x: 24, y: 0, w: 54, r: 3 }, { x: 0, y: 46, w: 48, r: -6 }, { x: 50, y: 52, w: 48, r: 6 }],
      notes: [{ x: 0, y: 6, w: 26, align: 'right', arrow: 'dr' }, { x: 0, y: 98, w: 46, align: 'left', arrow: 'ur' }, { x: 52, y: 104, w: 46, align: 'right', arrow: 'ul' }],
      doodles: [{ kind: 'heart', x: 82, y: 8, r: 12 }] },
    { h: 140, slots: [{ x: 44, y: 0, w: 54, r: 5 }, { x: 2, y: 30, w: 52, r: -5 }, { x: 40, y: 80, w: 56, r: 3 }],
      notes: [{ x: 0, y: 4, w: 42, align: 'right', arrow: 'dr' }, { x: 58, y: 54, w: 40, align: 'left', arrow: 'ul' }, { x: 0, y: 96, w: 38, align: 'right', arrow: 'ur' }],
      doodles: [{ kind: 'squiggle', x: 8, y: 82, r: 10 }] },
  ],
  4: [
    { h: 150, slots: [{ x: 0, y: 4, w: 48, r: -5 }, { x: 50, y: 0, w: 46, r: 4 }, { x: 6, y: 66, w: 46, r: 3 }, { x: 50, y: 72, w: 48, r: -4 }],
      notes: [{ x: 2, y: 50, w: 44, align: 'left', arrow: 'ul' }, { x: 54, y: 46, w: 42, align: 'right', arrow: 'ul' }, { x: 2, y: 114, w: 44, align: 'left', arrow: 'ur' }, { x: 54, y: 122, w: 44, align: 'right', arrow: 'ul' }],
      doodles: [{ kind: 'star', x: 46, y: 60, r: -10 }] },
    { h: 152, slots: [{ x: 26, y: 0, w: 48, r: 3 }, { x: 0, y: 40, w: 44, r: -6 }, { x: 54, y: 44, w: 44, r: 6 }, { x: 24, y: 86, w: 52, r: -2 }],
      notes: [{ x: 0, y: 4, w: 26, align: 'right', arrow: 'dr' }, { x: 0, y: 84, w: 24, align: 'left', arrow: 'ul' }, { x: 76, y: 88, w: 24, align: 'right', arrow: 'ul' }, { x: 26, y: 136, w: 50, align: 'left', arrow: 'ul' }],
      doodles: [{ kind: 'sparkle', x: 82, y: 6, r: 0 }] },
  ],
};

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

// Five or more stickers fall back to a generated zigzag stack.
function zigzag(n: number): Layout {
  const slots: Slot[] = [], notes: NoteSlot[] = [];
  for (let i = 0; i < n; i++) {
    const right = i % 2 === 1, y = i * 34;
    slots.push({ x: right ? 44 : 2, y, w: 54, r: right ? 4 : -4 });
    notes.push({ x: right ? 0 : 58, y: y + 12, w: 40, align: right ? 'right' : 'left', arrow: right ? 'dr' : 'dl' });
  }
  return { h: (n - 1) * 34 + 62, slots, notes, doodles: [{ kind: 'sparkle', x: 86, y: n * 34 - 20, r: 0 }] };
}

export function layoutFor(date: string, n: number): Layout {
  const options = L[n];
  return options ? options[hash(date) % options.length] : zigzag(n);
}
