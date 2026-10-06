import React from 'react';
import { useCanvasStore } from '../../store/useCanvasStore';

export const Rulers: React.FC = () => {
  const { showRulers, zoom, panOffset } = useCanvasStore();

  if (!showRulers) return null;

  return (
    <>
      {/* Top Horizontal Ruler */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-6 border-b border-[#2c2c2c] bg-[#1e1e1e]/90 text-[9px] text-[#71717a] z-30 flex items-end select-none overflow-hidden">
        <div
          className="flex h-full items-end"
          style={{
            transform: `translateX(${panOffset.x}px)`,
          }}
        >
          {Array.from({ length: 100 }).map((_, i) => {
            const val = (i - 20) * 100;
            return (
              <div
                key={i}
                className="relative flex-none border-l border-[#3f3f46]"
                style={{ width: `${100 * zoom}px`, height: '100%' }}
              >
                <span className="absolute top-0.5 left-1 font-mono text-[9px]">
                  {val}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Left Vertical Ruler */}
      <div className="pointer-events-none absolute top-0 left-0 bottom-0 w-6 border-r border-[#2c2c2c] bg-[#1e1e1e]/90 text-[9px] text-[#71717a] z-30 flex flex-col items-end select-none overflow-hidden">
        <div
          className="flex flex-col w-full items-end"
          style={{
            transform: `translateY(${panOffset.y}px)`,
          }}
        >
          {Array.from({ length: 100 }).map((_, i) => {
            const val = (i - 20) * 100;
            return (
              <div
                key={i}
                className="relative flex-none border-t border-[#3f3f46]"
                style={{ height: `${100 * zoom}px`, width: '100%' }}
              >
                <span className="absolute top-0.5 right-1 font-mono text-[9px] [writing-mode:vertical-rl] rotate-180">
                  {val}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
