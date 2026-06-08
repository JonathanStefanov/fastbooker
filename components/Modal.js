'use client';

import { useEffect, useState } from 'react';

export default function Modal({ open, onClose, children, maxWidth = '480px' }) {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (open) {
      setVisible(true);
      requestAnimationFrame(() => setAnimating(true));
    } else if (visible) {
      setAnimating(false);
      const timer = setTimeout(() => setVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [open, visible]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      style={{
        backgroundColor: animating ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0)',
        transition: 'background-color 200ms ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl overflow-hidden"
        style={{
          maxWidth,
          width: '100%',
          transform: animating ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(16px)',
          opacity: animating ? 1 : 0,
          transition: 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1), opacity 150ms ease',
        }}
      >
        {children}
      </div>
    </div>
  );
}
