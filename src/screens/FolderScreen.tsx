import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Trash2 } from 'lucide-react';
import { type FolderDef, type Memory } from '../data';
import { Sticker } from '../ui/Sticker';
import { Button } from '../ui/Button';
import { snappy } from '../ui/motion';

type Props = { folder: FolderDef; memories: Memory[]; onBack: () => void; onOpenDay: (date: string) => void; onDeleteFolder: () => void };

export function FolderScreen({ folder, memories, onBack, onOpenDay, onDeleteFolder }: Props) {
  const [confirm, setConfirm] = useState(false);
  const inside = memories.filter(m => m.folders.includes(folder.id)).sort((a, b) => b.date.localeCompare(a.date));
  const days = new Set(inside.map(m => m.date)).size;
  return (
    <div className="screen folder-screen" style={{ ['--tint' as string]: `var(--folder-${folder.tint})` }}>
      <header className="day-bar">
        <button className="icon-btn" aria-label="Back to folders" onClick={onBack}><ChevronLeft size={20} strokeWidth={1.75} /></button>
        <p className="t-meta">{inside.length} memories · {days} days</p>
        <span className="icon-btn-spacer" />
      </header>
      <div className="screen-scroll">
        <div className="folder-hero">
          <h1 className="t-display">{folder.name}</h1>
        </div>
        {inside.length ? (
          <div className="folder-grid">
            {inside.map((m, i) => (
              <motion.button key={m.id} className="folder-item" onClick={() => onOpenDay(m.date)} aria-label={`${m.label}, ${m.date}. Open day`}
                initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...snappy, delay: Math.min(i, 12) * 0.03 }}>
                <Sticker id={m.id} src={m.image} alt="" size="100%" polaroid={!m.cutout} />
                <span className="t-meta">{new Date(`${m.date}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </motion.button>
            ))}
          </div>
        ) : (
          <p className="t-note folder-empty">This folder is empty — add memories from any day.</p>
        )}
        <div className="folder-foot">
          <Button variant="ghost" className="danger" onClick={() => (confirm ? onDeleteFolder() : setConfirm(true))}>
            <Trash2 size={16} strokeWidth={1.75} />{confirm ? 'Tap again — memories stay in your days' : 'Delete folder'}
          </Button>
        </div>
      </div>
    </div>
  );
}
