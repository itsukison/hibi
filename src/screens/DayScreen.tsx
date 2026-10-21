import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Camera, Check, Trash2, Undo2, X } from 'lucide-react';
import { TODAY, dayTitles, longDate, metaDate, toDate, type FolderDef, type Memory } from '../data';
import { isFuture, shiftDate } from '../calendar';
import { Sticker } from '../ui/Sticker';
import { Button } from '../ui/Button';
import { snappy } from '../ui/motion';
import { layoutFor, type Arrow as ArrowDir, type Doodle as DoodleDef } from '../collage';
import { Sheet } from '../ui/Sheet';

type Props = {
  date: string;
  byDate: Map<string, Memory[]>;
  folders: FolderDef[];
  onDate: (date: string) => void;
  onClose: () => void;
  onCapture: () => void;
  onToggleFolder: (memoryId: string, folderId: string) => void;
  onDelete: (memoryId: string) => void;
};

export function DayScreen({ date, byDate, folders, onDate, onClose, onCapture, onToggleFolder, onDelete }: Props) {
  const [inspecting, setInspecting] = useState<string | null>(null);
  const list = byDate.get(date) ?? [];
  const inspected = list.find(m => m.id === inspecting);
  const title = dayTitles[date] ?? (date === TODAY ? 'Today' : toDate(date).toLocaleDateString('en-US', { weekday: 'long' }));

  return (
    <div className="screen day-screen">
      <header className="day-bar">
        <p className="t-meta">{metaDate(date)}</p>
        <button className="icon-btn" aria-label="Close day" onClick={onClose}><X size={20} strokeWidth={1.75} /></button>
      </header>

      <div className="screen-scroll day-scroll">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={date} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
            <h1 className="t-display day-title">{title}</h1>
            <p className="t-meta day-sub">{list.length ? `${list.length} ${list.length === 1 ? 'memory' : 'memories'}` : longDate(date)}</p>
            {list.length ? (
              <Collage date={date} memories={list} onInspect={setInspecting} />
            ) : (
              <div className="day-empty">
                <p className="t-note">Nothing kept this day.</p>
                {date === TODAY && <Button onClick={onCapture}><Camera size={18} strokeWidth={1.75} />Capture today</Button>}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <DateStrip date={date} byDate={byDate} onDate={onDate} />

      <Sheet open={!!inspected} onClose={() => setInspecting(null)} label="Memory details">
        {inspected && <Inspector memory={inspected} folders={folders} onToggleFolder={onToggleFolder}
          onDelete={() => { onDelete(inspected.id); setInspecting(null); }} />}
      </Sheet>
    </div>
  );
}

// Collage from a hand-tuned layout (collage.ts): stickers overlap at set spots, each note sits in free
// space with an ink arrow pointing at its sticker, plus one small doodle.
function Collage({ date, memories, onInspect }: { date: string; memories: Memory[]; onInspect: (id: string) => void }) {
  const layout = layoutFor(date, memories.length);
  return (
    <div className="collage-frame">
      <div className="collage" style={{ height: `${layout.h}cqw` }}>
        {layout.doodles.map((d, i) => (
          <motion.span key={`d${i}`} className="doodle" style={{ left: `${d.x}cqw`, top: `${d.y}cqw`, rotate: d.r }}
            initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...snappy, delay: 0.35 }}>
            <Doodle kind={d.kind} />
          </motion.span>
        ))}
        {memories.map((m, i) => {
          const slot = layout.slots[i], note = layout.notes[i];
          return (
            <div key={m.id}>
              <motion.button className="collage-sticker" aria-label={`${m.label}${m.note ? ` — ${m.note}` : ''}. Show details`} onClick={() => onInspect(m.id)}
                style={{ left: `${slot.x}cqw`, top: `${slot.y}cqw`, width: `${slot.w}cqw`, zIndex: i + 1 }}
                initial={{ opacity: 0, scale: 1.12, rotate: slot.r * 3 }} animate={{ opacity: 1, scale: 1, rotate: slot.r }}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} transition={{ ...snappy, delay: 0.05 + i * 0.06 }}>
                <Sticker id={m.id} src={m.image} alt={m.label} size="100%" tilt={0} polaroid={!m.cutout} />
              </motion.button>
              {m.note && note && (
                <motion.div className={`collage-note is-${note.align} arrow-${note.arrow}`} style={{ left: `${note.x}cqw`, top: `${note.y}cqw`, width: `${note.w}cqw` }}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 + i * 0.06, duration: 0.3 }}>
                  {note.arrow[0] === 'u' && <Arrow dir={note.arrow} />}
                  <p className="t-note">{m.note}</p>
                  {note.arrow[0] === 'd' && <Arrow dir={note.arrow} />}
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Base path points down-left; flips give the other three directions.
function Arrow({ dir }: { dir: ArrowDir }) {
  const sx = dir[1] === 'r' ? -1 : 1, sy = dir[0] === 'u' ? -1 : 1;
  return (
    <svg className="arrow" viewBox="0 0 60 40" width="44" height="29" aria-hidden style={{ transform: `scale(${sx}, ${sy})` }}>
      <path d="M56 6 C 40 4, 18 10, 8 30" fill="none" stroke="var(--ink)" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M4 20 L 8 31 L 18 26" fill="none" stroke="var(--ink)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Doodle({ kind }: { kind: DoodleDef['kind'] }) {
  const common = { fill: 'none', stroke: 'var(--ink)', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <svg viewBox="0 0 32 32" width={kind === 'squiggle' ? 44 : 30} height={kind === 'squiggle' ? 44 : 30} aria-hidden>
      {kind === 'star' && <path {...common} d="M16 4.5l3.2 7.3 7.8.6-6 5.1 1.9 7.6-6.9-4.1-6.8 4.2 1.8-7.7-5.9-5.1 7.8-.6Z" />}
      {kind === 'sparkle' && <path {...common} fill="var(--kaki)" stroke="none" d="M16 3c.9 6.4 3.6 9.1 10 10-6.4.9-9.1 3.6-10 10-.9-6.4-3.6-9.1-10-10 6.4-.9 9.1-3.6 10-10Z" />}
      {kind === 'heart' && <path {...common} stroke="var(--kaki)" d="M16 26c-6-4.2-10-8-10-12.4C6 10.3 8.4 8 11.2 8c2 0 3.6 1.1 4.8 2.9C17.2 9.1 18.8 8 20.8 8 23.6 8 26 10.3 26 13.6 26 18 22 21.8 16 26Z" />}
      {kind === 'squiggle' && <path {...common} d="M3 18c3-6 6 6 9 0s6 6 9 0 6 6 8 0" />}
    </svg>
  );
}

function DateStrip({ date, byDate, onDate }: { date: string; byDate: Map<string, Memory[]>; onDate: (d: string) => void }) {
  const days = [-2, -1, 0, 1, 2].map(o => shiftDate(date, o));
  return (
    <div className="date-strip-wrap">
      {date !== TODAY && (
        <button className="today-pill t-meta" onClick={() => onDate(TODAY)}><Undo2 size={12} strokeWidth={2} />Today</button>
      )}
      <nav className="date-strip" aria-label="Nearby days">
        {days.map(d => {
          const dt = toDate(d), has = byDate.has(d);
          return (
            <button key={d} className={`date-chip ${d === date ? 'is-active' : ''}`} disabled={isFuture(d)} aria-current={d === date ? 'date' : undefined}
              aria-label={`${longDate(d)}${has ? ', has memories' : ''}`} onClick={() => onDate(d)}>
              <span className="t-meta">{dt.toLocaleDateString('en-US', { weekday: 'short' })}</span>
              <span className="date-chip-num">{dt.getDate()}</span>
              <span className={`date-chip-dot ${has ? 'is-on' : ''}`} />
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function Inspector({ memory, folders, onToggleFolder, onDelete }: { memory: Memory; folders: FolderDef[]; onToggleFolder: Props['onToggleFolder']; onDelete: () => void }) {
  const [confirm, setConfirm] = useState(false);
  return (
    <div className="inspector">
      <div className="inspector-head">
        <Sticker id={memory.id} src={memory.image} alt={memory.label} size={88} polaroid={!memory.cutout} />
        <div>
          <p className="t-meta">{metaDate(memory.date)}</p>
          <p className="t-title">{memory.label}</p>
          {memory.note && <p className="t-note inspector-note">{memory.note}</p>}
        </div>
      </div>
      <p className="t-meta inspector-label">Folders</p>
      <div className="chip-row">
        {folders.map(f => {
          const on = memory.folders.includes(f.id);
          return (
            <button key={f.id} className={`chip t-label ${on ? 'is-on' : ''}`} aria-pressed={on} onClick={() => onToggleFolder(memory.id, f.id)}
              style={{ ['--tint' as string]: `var(--folder-${f.tint})` }}>
              {on && <Check size={14} strokeWidth={2} />}{f.name}
            </button>
          );
        })}
      </div>
      <Button variant="ghost" className="danger" onClick={() => (confirm ? onDelete() : setConfirm(true))}>
        <Trash2 size={16} strokeWidth={1.75} />{confirm ? 'Tap again to delete this memory' : 'Delete memory'}
      </Button>
    </div>
  );
}
