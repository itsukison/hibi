import { Sticker } from './Sticker';

type Props = { day: number; label: string; sticker?: { id: string; src: string; alt: string; polaroid?: boolean }; count?: number; today?: boolean; future?: boolean; onOpen?: () => void };

// One square of the month grid (DESIGN.md §5 Day cell).
export function DayCell({ day, label, sticker, count = 0, today, future, onOpen }: Props) {
  const name = `${label}${count ? `, ${count} ${count === 1 ? 'memory' : 'memories'}` : ''}`;
  return (
    <button className={`day ${future ? 'is-future' : ''}`} aria-label={name} disabled={!sticker} onClick={onOpen}>
      {sticker ? <Sticker {...sticker} size="118%" className="day-sticker" /> : <span className="t-numeral">{day}</span>}
      {count > 1 && <span className="day-count">{count}</span>}
      {today && <span className="day-today" aria-hidden />}
    </button>
  );
}
