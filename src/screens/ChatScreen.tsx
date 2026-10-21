import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { type FolderDef, type Memory } from '../data';
import { SUGGESTIONS, answer, type Answer } from '../chat';
import { Sticker } from '../ui/Sticker';
import { snappy } from '../ui/motion';

type Msg = { id: number; from: 'me' | 'hibi'; text: string; cites?: Memory[] };
type Props = { memories: Memory[]; folders: FolderDef[]; onOpenDay: (date: string) => void };

export function ChatScreen({ memories, folders, onOpenDay }: Props) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [draft, setDraft] = useState('');
  const [thinking, setThinking] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  const seq = useRef(0);

  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [msgs, thinking]);

  const ask = (text: string) => {
    const q = text.trim();
    if (!q || thinking) return;
    setMsgs(m => [...m, { id: ++seq.current, from: 'me', text: q }]);
    setDraft('');
    setThinking(true);
    // Short pause so the reply feels considered; the answer itself is computed locally.
    setTimeout(() => {
      const a: Answer = answer(q, memories, folders);
      setMsgs(m => [...m, { id: ++seq.current, from: 'hibi', text: a.text, cites: a.cites }]);
      setThinking(false);
    }, 650);
  };

  return (
    <div className="screen chat">
      <div className="screen-scroll chat-scroll">
        <p className="t-meta home-year">Ask Hibi</p>
        <h1 className="t-display">Ask your days</h1>
        <p className="t-meta chat-fine">Sample answers · matched from the demo diary, not a live AI</p>

        {msgs.length === 0 && (
          <div className="chat-empty">
            <p className="t-note">try asking…</p>
            <div className="chip-col">
              {SUGGESTIONS.map(s => <button key={s} className="chip t-note chat-suggest" onClick={() => ask(s)}>{s}</button>)}
            </div>
          </div>
        )}

        <div className="chat-log" aria-live="polite">
          <AnimatePresence initial={false}>
            {msgs.map(m => m.from === 'me' ? (
              <motion.p key={m.id} className="bubble-user t-body" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={snappy}>{m.text}</motion.p>
            ) : (
              <motion.div key={m.id} className="reply t-body" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={snappy}>
                <p>{m.text}</p>
                {!!m.cites?.length && (
                  <div className="cite-row">
                    {m.cites.map(c => (
                      <button key={c.id} className="cite" aria-label={`Open ${c.date}: ${c.label}`} onClick={() => onOpenDay(c.date)}>
                        <Sticker id={c.id} src={c.image} alt="" size={60} polaroid={!c.cutout} />
                        <span className="t-meta">{new Date(`${c.date}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {thinking && <p className="t-note chat-thinking" aria-label="Hibi is looking">flipping through your days…</p>}
          <div ref={end} />
        </div>
      </div>

      <form className="chat-input" onSubmit={e => { e.preventDefault(); ask(draft); }}>
        <input className="t-body" value={draft} onChange={e => setDraft(e.target.value)} placeholder="Ask about a day, a month, a friend…" aria-label="Ask Hibi" />
        <button className="send-btn" aria-label="Send" disabled={!draft.trim() || thinking}><ArrowUp size={18} strokeWidth={2} /></button>
      </form>
    </div>
  );
}
