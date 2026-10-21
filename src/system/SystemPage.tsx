import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Sticker } from '../ui/Sticker';
import { DayCell } from '../ui/DayCell';
import { Folder, type FolderTint } from '../ui/Folder';
import { Segmented } from '../ui/Segmented';
import { BottomNav, type Tab } from '../ui/BottomNav';
import { Button } from '../ui/Button';
import { STICKERS, stickerSrc } from '../stickers';

const colors: [string, string, string][] = [
  ['--paper', '#F3F0E8', 'App background'],
  ['--paper-raised', '#FBFAF6', 'Cards, sheets'],
  ['--paper-sunken', '#EAE6DC', 'Inputs, tracks'],
  ['--line', '#E0DACD', 'Hairlines'],
  ['--ink', '#1E1C19', 'Text, primary'],
  ['--ink-2', '#68635A', 'Secondary text'],
  ['--ink-3', '#A29C90', 'Tertiary'],
  ['--kaki', '#D2603A', 'Today, live'],
];
const tints: FolderTint[] = ['sage', 'clay', 'mist', 'butter', 'lilac'];
const s = (i: number) => STICKERS[i % STICKERS.length];
const asSticker = (i: number) => ({ id: s(i).id, src: stickerSrc(s(i)), alt: s(i).label });

// October 2026 starts on a Thursday; demo "today" is the 16th.
const octFilled = new Map<number, number>([[1, 0], [2, 1], [4, 2], [5, 3], [7, 4], [8, 5], [10, 6], [11, 7], [12, 8], [14, 9], [15, 10], [16, 11]]);

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="ds-section">
      <p className="t-meta ds-n">{n}</p>
      <h2 className="t-title">{title}</h2>
      <div className="ds-body">{children}</div>
    </section>
  );
}

export function SystemPage() {
  const [view, setView] = useState<'calendar' | 'folders'>('calendar');
  const [tab, setTab] = useState<Tab>('home');
  return (
    <main className="ds paper">
      <header className="ds-head">
        <p className="t-meta">Design system · v0.1 · Demo prototype</p>
        <h1 className="ds-wordmark">Hibi</h1>
        <p className="t-note ds-lede">a paper diary on a kitchen table — every day becomes a sticker.</p>
      </header>

      <Section n="01" title="Color">
        <div className="ds-swatches">
          {colors.map(([name, hex, use]) => (
            <div key={name} className="ds-swatch">
              <span style={{ background: `var(${name})` }} />
              <p className="t-label">{name}</p>
              <p className="t-meta">{hex} · {use}</p>
            </div>
          ))}
        </div>
        <div className="ds-swatches ds-tints">
          {tints.map(t => (
            <div key={t} className="ds-swatch"><span style={{ background: `var(--folder-${t})` }} /><p className="t-meta">folder-{t}</p></div>
          ))}
        </div>
      </Section>

      <Section n="02" title="Type">
        <div className="ds-type">
          <div><p className="t-meta">Display · Caveat 600 / 40</p><p className="t-display">October 2026</p></div>
          <div><p className="t-meta">Title · Caveat 600 / 28</p><p className="t-title">The long way home</p></div>
          <div><p className="t-meta">Note · Caveat 400 / 22</p><p className="t-note">forgot the name of the café but the hojicha was perfect</p></div>
          <div><p className="t-meta">Body · System sans 400 / 16</p><p className="t-body">When did I last see Mio? The last time was October 11 — you peeled her a persimmon.</p></div>
          <div><p className="t-meta">Label · System sans 500 / 14</p><p className="t-label">Save to today</p></div>
          <div><p className="t-meta">Meta · Plex Mono 400 / 11 caps</p><p className="t-meta" style={{ color: 'var(--ink)' }}>Fri · Oct 16 · Day 289</p></div>
        </div>
      </Section>

      <Section n="03" title="Space, shape, depth">
        <div className="ds-row">
          {[4, 8, 12, 16, 20, 24, 32, 40, 56].map(v => (
            <div key={v} className="ds-space"><span style={{ width: v, height: v }} /><p className="t-meta">{v}</p></div>
          ))}
        </div>
        <div className="ds-row">
          {[['r-sm', 10], ['r-md', 16], ['r-lg', 28], ['r-pill', 999]].map(([n, v]) => (
            <div key={n} className="ds-radius" style={{ borderRadius: Number(v) }}><p className="t-meta">{n}</p></div>
          ))}
          {['card', 'float'].map(n => (
            <div key={n} className="ds-radius" style={{ boxShadow: `var(--shadow-${n})`, background: 'var(--paper-raised)', border: 0 }}><p className="t-meta">shadow-{n}</p></div>
          ))}
        </div>
      </Section>

      <Section n="04" title="Stickers">
        <p className="t-body ds-copy">Subject cut out, white die-cut edge, soft shadow, a stable tilt between −5° and +5° from its id. Press to feel the spring.</p>
        <div className="ds-stickers">
          {STICKERS.map(st => <Sticker key={st.id} id={st.id} src={stickerSrc(st)} alt={st.label} size={88} />)}
        </div>
      </Section>

      <Section n="05" title="Home — calendar & folders">
        <div className="ds-phone paper">
          <div className="ds-phone-inner">
            <p className="t-meta" style={{ color: 'var(--ink-3)' }}>2026</p>
            <div className="ds-phone-top">
              <h3 className="t-display">October</h3>
              <Segmented label="Home view" value={view} onChange={setView} options={[{ value: 'calendar', label: 'Days' }, { value: 'folders', label: 'Folders' }]} />
            </div>
            {view === 'calendar' ? (
              <div className="month">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <span key={i} className="t-meta month-wd">{d}</span>)}
                {Array.from({ length: 4 }, (_, i) => <span key={`b${i}`} />)}
                {Array.from({ length: 31 }, (_, i) => {
                  const day = i + 1, idx = octFilled.get(day);
                  return <DayCell key={day} day={day} label={`October ${day}`} today={day === 16} future={day > 16}
                    sticker={idx === undefined ? undefined : asSticker(idx)} count={idx === undefined ? 0 : day % 5 === 0 ? 3 : 1} />;
                })}
              </div>
            ) : (
              <div className="folders">
                {['Cafés', 'With Mio', 'Summer', 'Little things'].map((n, i) => (
                  <Folder key={n} name={n} count={8 + i * 5} tint={tints[i]} previews={[asSticker(i * 3), asSticker(i * 3 + 1), asSticker(i * 3 + 2)]} />
                ))}
              </div>
            )}
          </div>
          <BottomNav tab={tab} onTab={setTab} onCapture={() => {}} />
        </div>
      </Section>

      <Section n="06" title="Controls">
        <div className="ds-row">
          <Button>Save to today</Button>
          <Button variant="secondary">Add a note</Button>
          <Button variant="ghost">Skip <ArrowRight size={16} strokeWidth={1.75} /></Button>
        </div>
        <div className="ds-row">
          <span className="chip t-note" style={{ fontSize: 19 }}>what did I eat in August?</span>
          <span className="chip t-note" style={{ fontSize: 19 }}>last time with Mio</span>
        </div>
      </Section>

      <Section n="07" title="Chat">
        <div className="ds-chat">
          <p className="bubble-user t-body">When did I last see Mio?</p>
          <div className="reply t-body">
            <p>The last time was October 11 — “peeled one for Mio.”</p>
            <div className="ds-cite">
              {[0, 1, 2].map(i => (
                <figure key={i}><Sticker {...asSticker(i + 4)} size={64} /><figcaption className="t-meta">Sep {26 + i}</figcaption></figure>
              ))}
            </div>
            <p className="t-meta ds-fine">Sample answers · matched from your demo diary</p>
          </div>
        </div>
      </Section>

      <Section n="08" title="Motion">
        <ul className="ds-list t-body">
          <li><b>snappy</b> spring (500 / 32) — presses, toggles</li>
          <li><b>soft</b> spring (260 / 26) — layout, month ↔ year zoom</li>
          <li><b>sticker landing</b> — 1.08 → 1.0 with tilt settling; capture save and collage entry</li>
          <li>Reduced motion — 150ms fades, static tilt kept</li>
        </ul>
      </Section>
    </main>
  );
}
