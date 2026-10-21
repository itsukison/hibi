import { motion } from 'motion/react';
import { snappy } from './motion';

type Props<T extends string> = { value: T; options: { value: T; label: string }[]; onChange: (v: T) => void; label: string };

export function Segmented<T extends string>({ value, options, onChange, label }: Props<T>) {
  return (
    <div className="segmented" role="tablist" aria-label={label}>
      {options.map(o => (
        <button key={o.value} role="tab" aria-selected={o.value === value} className="t-label" onClick={() => onChange(o.value)}>
          {o.value === value && <motion.span layoutId={`seg-${label}`} className="segmented-thumb" transition={snappy} />}
          <span className="segmented-text">{o.label}</span>
        </button>
      ))}
    </div>
  );
}
