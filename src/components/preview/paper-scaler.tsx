'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { PAPER_HEIGHT_PX, PAPER_WIDTH_PX } from './paper-constants';

export function PaperScaler({ children }: { children: ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const update = () => {
      setScale(Math.min(el.clientWidth / PAPER_WIDTH_PX, 1));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={outerRef} className="w-full">
      <div
        id="paper-scaler"
        style={{
          width: PAPER_WIDTH_PX * scale,
          height: PAPER_HEIGHT_PX * scale,
          margin: '0 auto',
          overflow: 'hidden',
        }}
      >
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
