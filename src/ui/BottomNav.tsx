import { motion } from 'motion/react';
import { AskIcon, DiaryIcon, PlusIcon } from './icons';
import { snappy } from './motion';

export type Tab = 'home' | 'chat';
type Props = { tab: Tab; onTab: (t: Tab) => void; onCapture: () => void };

// Quiet bottom bar: a small paper pill with the two tabs on the left, a round "+" to capture on the right
// (DESIGN.md §5 Bottom nav).
export function BottomNav({ tab, onTab, onCapture }: Props) {
  return (
    <nav className="bottom-nav" aria-label="Main">
      <div className="nav-capsule">
        <NavTab label="Diary" active={tab === 'home'} onClick={() => onTab('home')}><DiaryIcon /></NavTab>
        <NavTab label="Ask Hibi" active={tab === 'chat'} onClick={() => onTab('chat')}><AskIcon /></NavTab>
      </div>
      <motion.button className="capture-btn" aria-label="Capture today" onClick={onCapture} whileTap={{ scale: 0.9 }} transition={snappy}>
        <PlusIcon />
      </motion.button>
    </nav>
  );
}

function NavTab({ label, active, onClick, children }: { label: string; active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button className="nav-tab" aria-label={label} aria-current={active} onClick={onClick}>
      {children}
      {active && <motion.span layoutId="nav-dot" className="nav-dot" transition={snappy} />}
    </button>
  );
}
