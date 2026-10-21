import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, ImagePlus, RefreshCw, X } from 'lucide-react';
import { TODAY, captureSamples, metaDate, type FolderDef, type Memory } from '../data';
import { STICKERS, stickerSrc } from '../stickers';
import { Sticker } from '../ui/Sticker';
import { Button } from '../ui/Button';
import { snappy, soft } from '../ui/motion';

type Shot = { image: string; label: string; cutout: boolean };
type Props = { folders: FolderDef[]; onClose: () => void; onSave: (m: Omit<Memory, 'id'>) => void };

const samples: Shot[] = captureSamples.map(k => {
  const s = STICKERS.find(x => x.id === k)!;
  return { image: stickerSrc(s), label: s.label, cutout: true };
});

// Simulated camera: the viewfinder cycles through bundled sample shots; no camera access.
// "Library" reads a picked image locally in the browser (shown as a polaroid, no cutout).
export function CaptureScreen({ folders, onClose, onSave }: Props) {
  const [sample, setSample] = useState(0);
  const [shot, setShot] = useState<Shot | null>(null);
  const [flash, setFlash] = useState(false);
  const [note, setNote] = useState('');
  const [picked, setPicked] = useState<string[]>([]);
  const file = useRef<HTMLInputElement>(null);

  const shutter = () => {
    setFlash(true);
    setTimeout(() => { setFlash(false); setShot(samples[sample]); }, 140);
  };
  const pick = (f?: File) => {
    if (!f || !f.type.startsWith('image/')) return;
    const r = new FileReader();
    r.onload = () => setShot({ image: String(r.result), label: 'Your photo', cutout: false });
    r.readAsDataURL(f);
  };
  const save = () => {
    if (!shot) return;
    onSave({ date: TODAY, image: shot.image, label: shot.label, cutout: shot.cutout, note: note.trim() || undefined, folders: picked });
  };
  const toggle = (id: string) => setPicked(p => (p.includes(id) ? p.filter(x => x !== id) : [...p, id]));

  return (
    <motion.div className={`screen capture ${shot ? 'is-developed' : ''}`} animate={{ backgroundColor: shot ? '#F3F0E8' : '#1E1C19' }} transition={{ duration: 0.5 }}>
      <header className="capture-bar">
        <button className="icon-btn" aria-label="Close camera" onClick={onClose}><X size={20} strokeWidth={1.75} /></button>
        <p className="t-meta">{shot ? metaDate(TODAY) : 'Sample camera · demo'}</p>
        <span className="icon-btn-spacer" />
      </header>

      <AnimatePresence mode="wait">
        {!shot ? (
          <motion.div key="finder" className="finder-wrap" exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
            <div className="finder">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.img key={sample} className="finder-blur" src={samples[sample].image} alt="" initial={{ opacity: 0 }} animate={{ opacity: 0.45 }} exit={{ opacity: 0 }} />
                <motion.img key={`s${sample}`} className="finder-subject" src={samples[sample].image} alt={`Viewfinder: ${samples[sample].label}`}
                  initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} />
              </AnimatePresence>
              {['tl', 'tr', 'bl', 'br'].map(c => <span key={c} className={`finder-corner ${c}`} aria-hidden />)}
            </div>
            <div className="finder-dots" aria-hidden>{samples.map((_, i) => <span key={i} className={i === sample ? 'is-on' : ''} />)}</div>
            <div className="shutter-row">
              <button className="round-btn" aria-label="Choose from library" onClick={() => file.current?.click()}><ImagePlus size={22} strokeWidth={1.75} /></button>
              <button className="shutter" aria-label="Take photo" onClick={shutter}><span /></button>
              <button className="round-btn" aria-label="Next sample shot" onClick={() => setSample(s => (s + 1) % samples.length)}><RefreshCw size={20} strokeWidth={1.75} /></button>
            </div>
            <input ref={file} type="file" accept="image/*" hidden onChange={e => pick(e.target.files?.[0])} />
          </motion.div>
        ) : (
          <motion.div key="develop" className="develop">
            <motion.div className="develop-sticker" initial={{ scale: 0.6, rotate: -12, opacity: 0 }} animate={{ scale: [0.6, 1.08, 1], rotate: [-12, 4, -2], opacity: 1 }} transition={{ duration: 0.7, ease: 'easeOut' }}>
              <Sticker id="new" src={shot.image} alt={shot.label} size="100%" tilt={0} polaroid={!shot.cutout} />
            </motion.div>
            <motion.div className="develop-sheet" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...soft, delay: 0.45 }}>
              <label className="t-meta" htmlFor="note">Add a note (optional)</label>
              <textarea id="note" className="note-input t-note" rows={2} maxLength={90} placeholder="what made today today?" value={note} onChange={e => setNote(e.target.value)} />
              <p className="t-meta develop-label">Folders (optional)</p>
              <div className="chip-row">
                {folders.map(f => {
                  const on = picked.includes(f.id);
                  return (
                    <motion.button key={f.id} whileTap={{ scale: 0.95 }} transition={snappy} className={`chip t-label ${on ? 'is-on' : ''}`} aria-pressed={on} onClick={() => toggle(f.id)}
                      style={{ ['--tint' as string]: `var(--folder-${f.tint})` }}>
                      {on && <Check size={14} strokeWidth={2} />}{f.name}
                    </motion.button>
                  );
                })}
              </div>
              <div className="develop-actions">
                <Button variant="ghost" onClick={() => { setShot(null); setNote(''); }}>Retake</Button>
                <Button onClick={save}>Save to today</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>{flash && <motion.div className="flash" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} />}</AnimatePresence>
    </motion.div>
  );
}
