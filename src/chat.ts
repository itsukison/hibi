// Deterministic "Ask Hibi" answers: keyword matching over the in-memory diary. Not a live AI model.
import { MONTHS, TODAY, longDate, type FolderDef, type Memory } from './data';

export type Answer = { text: string; cites: Memory[] };

const FOOD = new Set(['onigiri', 'ramen', 'melonpan', 'taiyaki', 'shortcake', 'peach', 'watermelon', 'kakigori', 'sushi', 'dango', 'croissant', 'pudding', 'persimmon', 'pumpkin', 'wine', 'lemonsoda', 'matcha', 'icedcoffee']);
const keyOf = (m: Memory) => m.image.match(/stickers\/(\w+)\./)?.[1] ?? '';
const newest = (list: Memory[]) => [...list].sort((a, b) => b.date.localeCompare(a.date));
const shortDate = (d: string) => longDate(d).replace(/, \d{4}$/, '');
const names = (list: Memory[]) => [...new Set(list.map(m => m.label.toLowerCase()))];
const listing = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs.at(-1)}`);

export const SUGGESTIONS = ['When did I last see Mio?', 'What did I eat in August?', 'My café days', 'What do I keep most?'];

export function answer(question: string, memories: Memory[], folders: FolderDef[]): Answer {
  const q = question.toLowerCase();
  const past = memories.filter(m => m.date <= TODAY);
  const month = MONTHS.findIndex(n => q.includes(n.toLowerCase()) || new RegExp(`\\b${n.slice(0, 3).toLowerCase()}\\b`).test(q));
  const inMonth = month >= 0 ? past.filter(m => Number(m.date.slice(5, 7)) - 1 === month) : past;
  const folder = folders.find(f => q.includes(f.name.toLowerCase().replace(/^with /, '').split(/[ ']/)[0]) || (f.id === 'cafes' && /caf[eé]|coffee/.test(q)));

  if (/today/.test(q)) {
    const t = past.filter(m => m.date === TODAY);
    return t.length
      ? { text: `Today you kept ${listing(names(t))}.${t[0].note ? ` You wrote: “${t[0].note}.”` : ''}`, cites: t }
      : { text: 'Nothing kept today yet — tap the camera to add one.', cites: [] };
  }

  if (folder && /last|when|recent/.test(q)) {
    const list = newest(past.filter(m => m.folders.includes(folder.id)));
    if (!list.length) return { text: `Nothing in “${folder.name}” yet.`, cites: [] };
    const day = list[0].date, same = list.filter(m => m.date === day);
    const note = same.find(m => m.note)?.note;
    return { text: `The last time was ${shortDate(day)}${note ? ` — “${note}.”` : '.'}`, cites: [...same, ...list.filter(m => m.date !== day)].slice(0, 4) };
  }

  if (/\b(eat|ate|eaten|food|snacks?|meals?)\b/.test(q)) {
    const list = newest(inMonth.filter(m => FOOD.has(keyOf(m))));
    if (!list.length) return { text: `I couldn’t find any food${month >= 0 ? ` in ${MONTHS[month]}` : ''}.`, cites: [] };
    return { text: `${month >= 0 ? `In ${MONTHS[month]}` : 'So far this year'} you kept ${list.length} food moments — ${listing(names(list).slice(0, 4))}.`, cites: list.slice(0, 6) };
  }

  if (/\b(most|favou?rite|often)\b/.test(q)) {
    const counts = new Map<string, Memory[]>();
    for (const m of inMonth) counts.set(m.label, [...(counts.get(m.label) ?? []), m]);
    const [label, list] = [...counts.entries()].sort((a, b) => b[1].length - a[1].length)[0] ?? ['', []];
    return list.length
      ? { text: `${label} shows up most — ${list.length} times${month >= 0 ? ` in ${MONTHS[month]}` : ''}, most recently on ${shortDate(newest(list)[0].date)}.`, cites: newest(list).slice(0, 5) }
      : { text: 'Not enough days kept yet to tell.', cites: [] };
  }

  if (folder) {
    const list = newest(inMonth.filter(m => m.folders.includes(folder.id)));
    const days = new Set(list.map(m => m.date)).size;
    return { text: `“${folder.name}” has ${list.length} memories across ${days} days${month >= 0 ? ` in ${MONTHS[month]}` : ''}. The latest is ${list[0] ? shortDate(list[0].date) : '—'}.`, cites: list.slice(0, 6) };
  }

  if (month >= 0) {
    const list = newest(inMonth);
    const days = new Set(list.map(m => m.date)).size;
    return list.length
      ? { text: `${MONTHS[month]}: ${days} days kept, ${list.length} memories. A few highlights below.`, cites: list.filter(m => m.note).slice(0, 6) }
      : { text: `Nothing kept in ${MONTHS[month]}.`, cites: [] };
  }

  const words = q.split(/[^a-z']+/).filter(w => w.length > 3 && !['what', 'when', 'where', 'show', 'have', 'with', 'that', 'this', 'about', 'did'].includes(w));
  const hits = newest(past.filter(m => words.some(w => `${m.label} ${m.note ?? ''}`.toLowerCase().includes(w))));
  return hits.length
    ? { text: `I found ${hits.length} ${hits.length === 1 ? 'memory' : 'memories'} that mention “${words.find(w => hits.some(m => `${m.label} ${m.note ?? ''}`.toLowerCase().includes(w)))}”.`, cites: hits.slice(0, 6) }
    : { text: 'I couldn’t find that in your diary. Try a month, a folder like “Cafés”, or a friend like Mio.', cites: [] };
}
