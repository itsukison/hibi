import { motion } from 'motion/react';
import { snappy, tiltFor } from './motion';

export type FolderTint = 'sage' | 'clay' | 'mist' | 'butter' | 'lilac';
type Props = { name: string; count: number; tint: FolderTint; previews: { id: string; src: string }[]; onOpen?: () => void };

// Paper folder with up to three stickers peeking out of the pocket.
export function Folder({ name, count, tint, previews, onOpen }: Props) {
  const peeks = previews.slice(0, 3);
  return (
    <motion.button className="folder" style={{ ['--tint' as string]: `var(--folder-${tint})` }} onClick={onOpen} initial="rest" whileHover="lift" whileTap="lift" aria-label={`${name}, ${count} memories`}>
      <span className="folder-back" />
      <span className="folder-peeks">
        {peeks.map((p, i) => (
          <motion.img key={p.id} src={p.src} alt="" className="folder-peek" draggable={false}
            style={{ left: `${8 + i * 26}%`, rotate: tiltFor(p.id, 9), zIndex: i }}
            variants={{ rest: { y: 0 }, lift: { y: -8 - i * 2 } }} transition={snappy} />
        ))}
      </span>
      <span className="folder-front">
        <span className="t-title folder-name">{name}</span>
        <span className="t-meta folder-count">{count} memories</span>
      </span>
    </motion.button>
  );
}
