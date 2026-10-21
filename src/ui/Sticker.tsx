import { motion } from 'motion/react';
import { snappy, tiltFor } from './motion';

type Props = { id: string; src: string; alt: string; size?: number | string; tilt?: number; className?: string; layoutId?: string; polaroid?: boolean };

// A die-cut photo sticker: white border is baked into the image, shadow and tilt come from here.
// Uploaded photos (no cutout) render as a small white-framed polaroid instead.
export function Sticker({ id, src, alt, size = 96, tilt, className, layoutId, polaroid }: Props) {
  return (
    <motion.img
      layoutId={layoutId}
      className={`sticker ${polaroid ? 'polaroid' : ''} ${className ?? ''}`}
      src={src}
      alt={alt}
      draggable={false}
      style={{ width: size, height: size, rotate: tilt ?? tiltFor(id) }}
      whileTap={{ scale: 0.94 }}
      transition={snappy}
    />
  );
}
