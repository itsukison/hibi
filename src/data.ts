// Fictional demo diary. Fixed demo date: October 16, 2026. Nothing here is persisted.
import { STICKERS, stickerSrc, type StickerKey } from './stickers';
import type { FolderTint } from './ui/Folder';

export const TODAY = '2026-10-16';

export type Memory = {
  id: string;
  date: string;          // YYYY-MM-DD
  image: string;         // sticker PNG or a locally read upload (data URL)
  label: string;         // alt text
  note?: string;         // handwritten-style annotation
  folders: string[];
  cutout: boolean;       // false for user uploads (shown as a polaroid)
};

export type FolderDef = { id: string; name: string; tint: FolderTint };

export const initialFolders: FolderDef[] = [
  { id: 'cafes', name: 'Cafés', tint: 'sage' },
  { id: 'mio', name: 'With Mio', tint: 'clay' },
  { id: 'summer', name: "Summer '26", tint: 'butter' },
  { id: 'sweets', name: 'Sweet things', tint: 'lilac' },
  { id: 'little', name: 'Little things', tint: 'mist' },
];

// Optional per-day titles shown on the collage page.
export const dayTitles: Record<string, string> = {
  '2026-08-08': 'Summer festival',
  '2026-08-15': 'Obon at grandma’s',
  '2026-08-22': 'Kamakura beach day',
  '2026-09-21': 'Tsukimi night',
  '2026-09-28': 'Long walk with Mio',
  '2026-10-03': 'Record shop Saturday',
  '2026-10-11': 'Autumn snacks',
  '2026-10-16': 'Today',
};

type Row = [date: string, key: StickerKey, note: string, folders: string[]];

const rows: Row[] = [
  // Earlier in the year (sparse — mostly seen in the year view)
  ['2026-01-03', 'mug', 'new year, new mug', ['little']],
  ['2026-01-18', 'ramen', 'snow outside, miso inside', []],
  ['2026-02-14', 'shortcake', 'made it myself (lopsided)', ['sweets']],
  ['2026-02-27', 'book', '', ['little']],
  ['2026-03-08', 'dango', 'first sakura dango', ['sweets']],
  ['2026-03-29', 'sneakers', 'walked all the way to the river', []],
  ['2026-04-05', 'bouquet', 'from Mio', ['mio']],
  ['2026-04-19', 'matcha', '', ['cafes']],
  ['2026-05-03', 'sneakers', 'golden week walking', []],
  ['2026-05-24', 'plant', 'new plant! named it Ken', ['little']],
  ['2026-06-07', 'umbrella', 'rainy season is here', []],
  ['2026-06-14', 'matcha', 'hiding from the rain', ['cafes']],
  ['2026-06-28', 'icedcoffee', '', ['cafes']],
  ['2026-07-05', 'furin', 'the sound of summer', ['summer']],
  ['2026-07-12', 'sunflower', '', ['summer']],
  ['2026-07-19', 'uchiwa', 'too hot to think', ['summer']],
  ['2026-07-26', 'lemonsoda', '', ['cafes', 'summer']],

  // August
  ['2026-08-01', 'watermelon', 'first watermelon of the year', ['summer']],
  ['2026-08-02', 'icedcoffee', '', ['cafes']],
  ['2026-08-04', 'peach', 'grandma sent a whole box', ['summer']],
  ['2026-08-06', 'sunglasses', 'new ones, very serious', ['little']],
  ['2026-08-08', 'uchiwa', 'free fans at the entrance', ['summer', 'mio']],
  ['2026-08-08', 'kakigori', 'strawberry + condensed milk', ['summer', 'sweets', 'mio']],
  ['2026-08-08', 'watermelon', 'Mio won the seed-spitting contest', ['summer', 'mio']],
  ['2026-08-10', 'matcha', '', ['cafes']],
  ['2026-08-12', 'onigiri', 'konbini lunch on the train', []],
  ['2026-08-15', 'furin', 'grandma’s porch', ['summer']],
  ['2026-08-15', 'watermelon', '', ['summer']],
  ['2026-08-17', 'book', 'finished it in one sitting', ['little']],
  ['2026-08-19', 'lemonsoda', '', ['cafes']],
  ['2026-08-22', 'shell', 'pocketed this one', ['summer', 'mio']],
  ['2026-08-22', 'sunglasses', '', ['summer', 'mio']],
  ['2026-08-24', 'taiyaki', 'custard, not red bean (controversial)', ['sweets']],
  ['2026-08-26', 'cat', 'neighbour’s cat says hi', ['little']],
  ['2026-08-29', 'sushi', 'conveyor belt, 14 plates', ['mio']],
  ['2026-08-31', 'kakigori', 'goodbye summer', ['summer', 'sweets']],

  // September
  ['2026-09-01', 'croissant', '', ['cafes']],
  ['2026-09-03', 'filmcamera', 'found it at the flea market', ['little']],
  ['2026-09-05', 'vinyl', '', ['little']],
  ['2026-09-06', 'matcha', 'the good matcha place', ['cafes', 'mio']],
  ['2026-09-09', 'melonpan', 'still warm', ['sweets']],
  ['2026-09-12', 'shiba', 'met a very polite shiba', ['little']],
  ['2026-09-13', 'pudding', 'firm purin, the right kind', ['sweets', 'cafes']],
  ['2026-09-15', 'ramen', '', []],
  ['2026-09-17', 'headphones', 'new album on repeat', ['little']],
  ['2026-09-19', 'icedcoffee', '', ['cafes']],
  ['2026-09-21', 'dango', 'moon was huge', ['sweets']],
  ['2026-09-21', 'pudding', '', ['sweets']],
  ['2026-09-23', 'book', '', ['little']],
  ['2026-09-25', 'wine', 'Mio’s birthday dinner', ['mio']],
  ['2026-09-25', 'shortcake', '', ['mio', 'sweets']],
  ['2026-09-28', 'onigiri', 'river picnic', ['mio']],
  ['2026-09-28', 'sneakers', '18,000 steps', ['mio']],
  ['2026-09-30', 'postcard', 'from Kyoto, from Aya', ['little']],

  // October (through today, Oct 16)
  ['2026-10-01', 'mug', 'first hot drink of autumn', ['cafes']],
  ['2026-10-03', 'vinyl', 'Hosono, 1,800 yen', ['little']],
  ['2026-10-03', 'tote', '', ['little']],
  ['2026-10-03', 'icedcoffee', '', ['cafes']],
  ['2026-10-04', 'persimmon', 'grandma’s tree again', []],
  ['2026-10-06', 'book', '', ['little']],
  ['2026-10-07', 'croissant', '', ['cafes']],
  ['2026-10-09', 'ticket', 'found Dad’s old ticket stub', ['little']],
  ['2026-10-10', 'candle', 'cosy era begins', ['little']],
  ['2026-10-11', 'persimmon', 'peeled one for Mio', ['mio']],
  ['2026-10-11', 'taiyaki', '', ['sweets']],
  ['2026-10-13', 'pumpkin', '', []],
  ['2026-10-14', 'matcha', 'hot this time', ['cafes']],
  ['2026-10-16', 'melonpan', 'breakfast on the way', ['sweets']],
];


// Second, third… stickers for the same days, so most days read as a small collage.
const extraRows: Row[] = [
  ['2026-08-01', 'icedcoffee', 'iced coffee on the walk home', ['cafes']],
  ['2026-08-01', 'sunflower', 'roadside sunflowers', ['summer']],
  ['2026-08-02', 'croissant', '', ['cafes']],
  ['2026-08-04', 'uchiwa', 'grandma’s fan, still smells like her house', ['summer']],
  ['2026-08-06', 'lemonsoda', 'too sunny to think', ['summer']],
  ['2026-08-10', 'book', 'two chapters with the matcha', ['little']],
  ['2026-08-12', 'furin', 'heard one at the station', ['summer']],
  ['2026-08-15', 'onigiri', 'grandma’s onigiri, salty and perfect', ['summer']],
  ['2026-08-17', 'mug', '', ['little']],
  ['2026-08-19', 'sneakers', 'walked to the far café', ['cafes']],
  ['2026-08-22', 'lemonsoda', 'warm by the time we drank it', ['summer', 'mio']],
  ['2026-08-22', 'watermelon', 'split one on the sand', ['summer', 'mio']],
  ['2026-08-24', 'icedcoffee', '', ['cafes']],
  ['2026-08-26', 'plant', 'watered Ken, he’s thriving', ['little']],
  ['2026-08-29', 'wine', 'one glass turned into three', ['mio']],
  ['2026-08-31', 'sunflower', 'last sunflowers at the market', ['summer']],
  ['2026-09-01', 'book', 'new month, new book', ['little']],
  ['2026-09-03', 'tote', 'carried it home in this', ['little']],
  ['2026-09-05', 'headphones', 'side B on the train', ['little']],
  ['2026-09-06', 'croissant', 'shared, obviously', ['cafes', 'mio']],
  ['2026-09-09', 'icedcoffee', '', ['cafes']],
  ['2026-09-12', 'sneakers', 'followed him for a block', []],
  ['2026-09-13', 'mug', '', ['cafes']],
  ['2026-09-15', 'onigiri', 'late lunch, no regrets', []],
  ['2026-09-17', 'vinyl', 'bought the record too', ['little']],
  ['2026-09-19', 'book', '', ['little']],
  ['2026-09-23', 'plant', 'Ken has a new leaf', ['little']],
  ['2026-09-25', 'candle', 'one candle, one wish', ['mio']],
  ['2026-09-28', 'icedcoffee', 'river kiosk coffee', ['mio', 'cafes']],
  ['2026-09-30', 'mug', 'tea while reading it', ['little']],
  ['2026-10-01', 'croissant', '', ['cafes']],
  ['2026-10-03', 'headphones', 'listened all the way home', ['little']],
  ['2026-10-04', 'pumpkin', 'grandma’s garden haul', []],
  ['2026-10-06', 'mug', 'rainy reading day', ['little']],
  ['2026-10-07', 'matcha', 'hot matcha season', ['cafes']],
  ['2026-10-09', 'vinyl', 'played Dad’s old records', ['little']],
  ['2026-10-10', 'book', 'and a book to go with it', ['little']],
  ['2026-10-13', 'candle', 'early night', ['little']],
  ['2026-10-14', 'croissant', '', ['cafes']],
  ['2026-10-16', 'icedcoffee', 'first coffee at the new place', ['cafes']],
];

// Stable sort keeps the original sticker first within each day.
export const initialMemories: Memory[] = [...rows, ...extraRows].sort((a, b) => a[0].localeCompare(b[0])).map(([date, key, note, folders], i) => {
  const s = STICKERS.find(x => x.id === key)!;
  return { id: `m${i + 1}`, date, image: stickerSrc(s), label: s.label, note: note || undefined, folders, cutout: true };
});

// Simulated camera roll for the capture screen (no real camera access).
export const captureSamples: StickerKey[] = ['icedcoffee', 'croissant', 'plant', 'cat', 'bouquet'];

// Date helpers (local noon avoids timezone edge cases)
export const toDate = (iso: string) => new Date(`${iso}T12:00:00`);
export const iso = (y: number, m: number, d: number) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
export const dayOfYear = (isoDate: string) => {
  const d = toDate(isoDate), start = new Date(d.getFullYear(), 0, 0, 12);
  return Math.round((d.getTime() - start.getTime()) / 86400000);
};
export const metaDate = (isoDate: string) => {
  const d = toDate(isoDate);
  const wd = d.toLocaleDateString('en-US', { weekday: 'short' });
  const md = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${wd} · ${md} · Day ${dayOfYear(isoDate)}`;
};
export const longDate = (isoDate: string) => toDate(isoDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
