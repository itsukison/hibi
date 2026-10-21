import { iso, TODAY, type Memory } from './data';

export const YEAR = 2026;
export const TODAY_MONTH = Number(TODAY.slice(5, 7)) - 1;

// Leading blanks + day numbers + trailing blanks for a month grid (weeks start on Sunday).
// Every month is padded to 6 weeks so all months share the same height.
export function monthCells(year: number, month: number) {
  const lead = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  // prevDays lets the leading cells show the previous month's last dates.
  return { lead, days, trail: 42 - lead - days, prevDays: new Date(year, month, 0).getDate() };
}

export function groupByDate(memories: Memory[]) {
  const map = new Map<string, Memory[]>();
  for (const m of memories) map.set(m.date, [...(map.get(m.date) ?? []), m]);
  return map;
}

export const isFuture = (date: string) => date > TODAY;
export const dateOf = (month: number, day: number) => iso(YEAR, month, day);

export function shiftDate(date: string, days: number) {
  const d = new Date(`${date}T12:00:00`);
  d.setDate(d.getDate() + days);
  return iso(d.getFullYear(), d.getMonth(), d.getDate());
}
