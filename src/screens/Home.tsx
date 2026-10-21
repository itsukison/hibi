import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Info, LayoutGrid, Plus } from 'lucide-react';
import { MONTHS, TODAY, type FolderDef, type Memory } from '../data';
import { YEAR, TODAY_MONTH, monthCells, dateOf, isFuture } from '../calendar';
import { usePinchSwipe } from '../gestures';
import { DayCell } from '../ui/DayCell';
import { Folder } from '../ui/Folder';
import { Segmented } from '../ui/Segmented';
import { Sticker } from '../ui/Sticker';
import { soft } from '../ui/motion';

export type HomeView = 'calendar' | 'folders';
export type Zoom = 'month' | 'year';

type Props = {
  memories: Memory[];
  byDate: Map<string, Memory[]>;
  folders: FolderDef[];
  view: HomeView; onView: (v: HomeView) => void;
  zoom: Zoom; onZoom: (z: Zoom) => void;
  month: number; onMonth: (m: number) => void;
  onOpenDay: (date: string) => void;
  onOpenFolder: (id: string) => void;
  onCreateFolder: (name: string) => void;
  onAbout: () => void;
};

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const cellSticker = (m: Memory) => ({ id: m.id, src: m.image, alt: m.label, polaroid: !m.cutout });

export function Home(p: Props) {
  const surface = useRef<HTMLDivElement>(null);
  const goMonth = (m: number) => p.onMonth(Math.max(0, Math.min(TODAY_MONTH, m)));
  usePinchSwipe(surface, {
    onZoomOut: () => p.view === 'calendar' && p.onZoom('year'),
    onZoomIn: () => p.view === 'calendar' && p.onZoom('month'),
    onSwipe: dir => p.view === 'calendar' && p.zoom === 'month' && goMonth(p.month + dir),
  });

  const total = p.memories.length;
  return (
    <div className="screen home" ref={surface}>
      <header className="home-bar">
        <Segmented label="Home view" value={p.view} onChange={p.onView} options={[{ value: 'calendar', label: 'Days' }, { value: 'folders', label: 'Folders' }]} />
        <div className="home-bar-actions">
          {p.view === 'calendar' && (
            <button className="icon-btn" aria-label={p.zoom === 'month' ? 'Zoom out to the year' : 'Back to the month'} aria-pressed={p.zoom === 'year'} onClick={() => p.onZoom(p.zoom === 'month' ? 'year' : 'month')}>
              <LayoutGrid size={20} strokeWidth={1.75} />
            </button>
          )}
          <button className="icon-btn" aria-label="About this demo" onClick={p.onAbout}><Info size={20} strokeWidth={1.75} /></button>
        </div>
      </header>

      <div className="screen-scroll">
        {p.view === 'folders' ? (
          <FoldersView {...p} total={total} />
        ) : (
          <AnimatePresence mode="popLayout" initial={false}>
            {p.zoom === 'month'
              ? <MonthView key="month" {...p} goMonth={goMonth} />
              : <YearView key="year" {...p} />}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

function MonthView({ month, byDate, onOpenDay, goMonth }: Props & { goMonth: (m: number) => void }) {
  const { lead, days, trail, prevDays } = monthCells(YEAR, month);
  let kept = 0, count = 0;
  for (let d = 1; d <= days; d++) { const n = byDate.get(dateOf(month, d))?.length ?? 0; if (n) { kept++; count += n; } }
  return (
    <motion.section className="month-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
      <p className="t-meta home-year">{YEAR} · {kept} days kept · {count} memories</p>
      <div className="month-title">
        <AnimatePresence mode="wait" initial={false}>
          <motion.h1 key={month} className="t-display" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}>{MONTHS[month]}</motion.h1>
        </AnimatePresence>
        <div className="month-nav">
          <button className="icon-btn" aria-label="Previous month" disabled={month === 0} onClick={() => goMonth(month - 1)}><ChevronLeft size={20} strokeWidth={1.75} /></button>
          <button className="icon-btn" aria-label="Next month" disabled={month === TODAY_MONTH} onClick={() => goMonth(month + 1)}><ChevronRight size={20} strokeWidth={1.75} /></button>
        </div>
      </div>

      <motion.div layoutId={`month-${month}`} className="month-card" transition={soft}>
        <div className="month">
          {WEEKDAYS.map((d, i) => <span key={i} className="t-meta month-wd" aria-hidden>{d}</span>)}
          {Array.from({ length: lead }, (_, i) => <span key={`b${i}`} className="day day-other t-numeral" aria-hidden>{prevDays - lead + i + 1}</span>)}
          {Array.from({ length: days }, (_, i) => {
            const day = i + 1, date = dateOf(month, day), list = byDate.get(date) ?? [];
            const top = list[list.length - 1];
            return (
              <DayCell key={date} day={day} label={`${MONTHS[month]} ${day}`} today={date === TODAY} future={isFuture(date)}
                sticker={top && cellSticker(top)} count={list.length} onOpen={() => onOpenDay(date)} />
            );
          })}
          {Array.from({ length: trail }, (_, i) => <span key={`t${i}`} className="day day-other t-numeral" aria-hidden>{i + 1}</span>)}
        </div>
      </motion.div>

      <p className="t-note month-hint">pinch to see the whole year</p>
    </motion.section>
  );
}

function YearView({ byDate, onMonth, onZoom }: Props) {
  const open = (m: number) => { onMonth(m); onZoom('month'); };
  return (
    <motion.section className="year-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
      <p className="t-meta home-year">{byDate.size} days kept</p>
      <h1 className="t-display year-title">{YEAR}</h1>
      <div className="year-grid">
        {MONTHS.map((name, m) => {
          const { lead, days, trail } = monthCells(YEAR, m);
          const future = m > TODAY_MONTH;
          return (
            <button key={name} className="mini" disabled={future} aria-label={`Open ${name}`} onClick={() => open(m)}>
              <span className="mini-name">{name.slice(0, 3)}</span>
              <motion.span layoutId={`month-${m}`} className="mini-grid" transition={soft}>
                {Array.from({ length: lead }, (_, i) => <span key={`b${i}`} className="mini-dot is-other" />)}
                {Array.from({ length: days }, (_, i) => {
                  const date = dateOf(m, i + 1), top = byDate.get(date)?.at(-1);
                  if (top) return <Sticker key={date} id={top.id} src={top.image} alt="" size="100%" className="mini-sticker" polaroid={!top.cutout} />;
                  return <span key={date} className={`mini-dot ${date === TODAY ? 'is-today' : ''} ${isFuture(date) ? 'is-future' : ''}`} />;
                })}
                {Array.from({ length: trail }, (_, i) => <span key={`t${i}`} className="mini-dot is-other" />)}
              </motion.span>
            </button>
          );
        })}
      </div>
    </motion.section>
  );
}

function FoldersView({ folders, memories, onOpenFolder, onCreateFolder, total }: Props & { total: number }) {
  const [naming, setNaming] = useState(false);
  const [name, setName] = useState('');
  const submit = () => { if (name.trim()) onCreateFolder(name.trim()); setName(''); setNaming(false); };
  return (
    <section className="folders-view">
      <p className="t-meta home-year">{folders.length} folders · {total} memories</p>
      <h1 className="t-display folders-title">Folders</h1>
      <div className="folders">
        {folders.map(f => {
          const inside = memories.filter(m => m.folders.includes(f.id)).sort((a, b) => b.date.localeCompare(a.date));
          return <Folder key={f.id} name={f.name} count={inside.length} tint={f.tint} previews={inside.slice(0, 3).map(m => ({ id: m.id, src: m.image }))} onOpen={() => onOpenFolder(f.id)} />;
        })}
        {naming ? (
          <form className="folder-new is-naming" onSubmit={e => { e.preventDefault(); submit(); }}>
            <input autoFocus className="t-title" placeholder="Name it…" value={name} onChange={e => setName(e.target.value)} onBlur={submit} aria-label="New folder name" maxLength={24} />
          </form>
        ) : (
          <button className="folder-new" onClick={() => setNaming(true)}><Plus size={22} strokeWidth={1.75} /><span className="t-label">New folder</span></button>
        )}
      </div>
    </section>
  );
}
