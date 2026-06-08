'use client';

import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
};

export function AnimatedList({ children, className, style }) {
  return (
    <motion.div
      className={className}
      style={style}
      variants={container}
      initial="hidden"
      animate="show"
    >
      {children}
    </motion.div>
  );
}

export function AnimatedItem({ children, className, style, onClick }) {
  return (
    <motion.div
      className={className}
      style={style}
      variants={item}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

export { container, item };
