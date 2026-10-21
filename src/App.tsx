import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { TODAY, initialFolders, initialMemories, type FolderDef, type Memory } from './data';
import { TODAY_MONTH, groupByDate } from './calendar';
import { Home, type HomeView, type Zoom } from './screens/Home';
import { DayScreen } from './screens/DayScreen';
import { CaptureScreen } from './screens/CaptureScreen';
import { ChatScreen } from './screens/ChatScreen';
import { FolderScreen } from './screens/FolderScreen';
import { BottomNav, type Tab } from './ui/BottomNav';
import { Sheet } from './ui/Sheet';
import { Button } from './ui/Button';
import { soft } from './ui/motion';
import type { FolderTint } from './ui/Folder';

type Overlay = { kind: 'day'; date: string } | { kind: 'folder'; id: string } | { kind: 'capture' };
const TINTS: FolderTint[] = ['sage', 'clay', 'mist', 'butter', 'lilac'];

// All state is in memory: reloading or "Reset the demo" restores the sample diary.
export default function App() {
  const [memories, setMemories] = useState<Memory[]>(initialMemories);
  const [folders, setFolders] = useState<FolderDef[]>(initialFolders);
  const [tab, setTab] = useState<Tab>('home');
  const [stack, setStack] = useState<Overlay[]>([]);
  const [view, setView] = useState<HomeView>('calendar');
  const [zoom, setZoom] = useState<Zoom>('month');
  const [month, setMonth] = useState(TODAY_MONTH);
  const [about, setAbout] = useState(false);
  const [session, setSession] = useState(0);

  const byDate = useMemo(() => groupByDate(memories), [memories]);
  const top = stack.at(-1);
  const push = (o: Overlay) => setStack(s => [...s, o]);
  const pop = () => setStack(s => s.slice(0, -1));
  const openDay = (date: string) => push({ kind: 'day', date });

  const addMemory = (m: Omit<Memory, 'id'>) => {
    setMemories(ms => [...ms, { ...m, id: `u${Date.now()}` }]);
    setMonth(TODAY_MONTH); setZoom('month');
    setStack([{ kind: 'day', date: TODAY }]);
  };
  const toggleFolder = (memoryId: string, folderId: string) => setMemories(ms => ms.map(m => m.id !== memoryId ? m
    : { ...m, folders: m.folders.includes(folderId) ? m.folders.filter(f => f !== folderId) : [...m.folders, folderId] }));
  const deleteMemory = (id: string) => setMemories(ms => ms.filter(m => m.id !== id));
  const createFolder = (name: string) => setFolders(fs => [...fs, { id: `f${Date.now()}`, name, tint: TINTS[fs.length % TINTS.length] }]);
  // Deleting a folder keeps its memories; they just leave the folder.
  const deleteFolder = (id: string) => {
    setFolders(fs => fs.filter(f => f.id !== id));
    setMemories(ms => ms.map(m => ({ ...m, folders: m.folders.filter(f => f !== id) })));
    pop();
  };
  const reset = () => {
    setMemories(initialMemories); setFolders(initialFolders); setStack([]); setTab('home');
    setView('calendar'); setZoom('month'); setMonth(TODAY_MONTH); setAbout(false); setSession(s => s + 1);
  };

  const folder = top?.kind === 'folder' ? folders.find(f => f.id === top.id) : undefined;

  return (
    <div className="stage">
      <aside className="stage-intro">
        <p className="t-meta">Interactive prototype · demo only</p>
        <h1 className="stage-wordmark">Hibi</h1>
        <p className="t-note stage-lede">a paper diary where every day becomes a sticker.</p>
        <ul className="stage-tips t-body">
          <li><b>Pinch</b> (or ctrl + scroll) on the calendar to see the whole year.</li>
          <li><b>Swipe</b> sideways to change month.</li>
          <li>Tap a day to open its collage.</li>
          <li>The camera and chat are simulated. Nothing is saved after a reload.</li>
        </ul>
        <p className="t-meta stage-links"><a href="/system.html">Design system</a> · <a href="/credits.html">Photo credits</a></p>
      </aside>

      <div className="phone paper" key={session}>
        <div className="phone-notch" aria-hidden />
        <div className={`base ${top ? 'is-covered' : ''}`} aria-hidden={!!top} inert={!!top}>
          {tab === 'home' ? (
            <Home memories={memories} byDate={byDate} folders={folders} view={view} onView={setView} zoom={zoom} onZoom={setZoom}
              month={month} onMonth={setMonth} onOpenDay={openDay} onOpenFolder={id => push({ kind: 'folder', id })}
              onCreateFolder={createFolder} onAbout={() => setAbout(true)} />
          ) : (
            <ChatScreen memories={memories} folders={folders} onOpenDay={openDay} />
          )}
          <BottomNav tab={tab} onTab={setTab} onCapture={() => push({ kind: 'capture' })} />
        </div>

        <AnimatePresence>
          {top && (
            <motion.div key={top.kind === 'folder' ? `folder-${top.id}` : top.kind} className="overlay paper"
              initial={{ y: top.kind === 'folder' ? 0 : '100%', x: top.kind === 'folder' ? '100%' : 0 }}
              animate={{ x: 0, y: 0 }} exit={{ y: top.kind === 'folder' ? 0 : '100%', x: top.kind === 'folder' ? '100%' : 0 }} transition={soft}>
              {top.kind === 'day' && (
                <DayScreen date={top.date} byDate={byDate} folders={folders} onClose={pop}
                  onDate={date => setStack(s => [...s.slice(0, -1), { kind: 'day', date }])}
                  onCapture={() => setStack(s => [...s.slice(0, -1), { kind: 'capture' }])}
                  onToggleFolder={toggleFolder} onDelete={deleteMemory} />
              )}
              {top.kind === 'capture' && <CaptureScreen folders={folders} onClose={pop} onSave={addMemory} />}
              {top.kind === 'folder' && folder && (
                <FolderScreen folder={folder} memories={memories} onBack={pop} onOpenDay={openDay} onDeleteFolder={() => deleteFolder(folder.id)} />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <Sheet open={about} onClose={() => setAbout(false)} label="About this demo">
          <div className="about">
            <p className="t-title">About this demo</p>
            <p className="t-body">Hibi is a design prototype. The diary, people and places are fictional, and today is fixed at October 16, 2026.</p>
            <p className="t-body">The camera shows sample shots, and the chat matches keywords in this sample diary. It is not a live AI. Photos you pick stay in this browser tab and disappear when you reload.</p>
            <Button variant="secondary" onClick={reset}><RotateCcw size={16} strokeWidth={1.75} />Reset the demo</Button>
          </div>
        </Sheet>
      </div>
    </div>
  );
}
