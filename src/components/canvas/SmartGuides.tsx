import React from 'react';
import { useCanvasStore } from '../../store/useCanvasStore';

export const SmartGuides: React.FC = () => {
  const { smartGuides, zoom, panOffset } = useCanvasStore();

  if (!smartGuides.length) return null;

  return (
    <svg className="pointer-events-none absolute inset-0 z-40 h-full w-full">
      {smartGuides.map((guide, idx) => {
        if (guide.type === 'vertical') {
          const screenX = guide.position * zoom + panOffset.x;
          const screenY1 = guide.start * zoom + panOffset.y;
          const screenY2 = guide.end * zoom + panOffset.y;
          return (
            <line
              key={idx}
              x1={screenX}
              y1={screenY1}
              x2={screenX}
              y2={screenY2}
              stroke="#ef4444"
              strokeWidth={1}
              strokeDasharray="4 2"
            />
          );
        } else {
          const screenY = guide.position * zoom + panOffset.y;
          const screenX1 = guide.start * zoom + panOffset.x;
          const screenX2 = guide.end * zoom + panOffset.y;
          return (
            <line
              key={idx}
              x1={screenX1}
              y1={screenY}
              x2={screenX2}
              y2={screenY}
              stroke="#ef4444"
              strokeWidth={1}
              strokeDasharray="4 2"
            />
          );
        }
      })}
    </svg>
  );
};
