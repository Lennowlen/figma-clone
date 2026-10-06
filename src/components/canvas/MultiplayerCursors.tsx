import React from 'react';
import { useMultiplayerStore } from '../../store/useMultiplayerStore';
import { MousePointer2 } from 'lucide-react';

export const MultiplayerCursors: React.FC = () => {
  const { collaborators } = useMultiplayerStore();

  return (
    <>
      {collaborators.map((collab) => {
        if (!collab.cursor) return null;
        return (
          <div
            key={collab.id}
            className="pointer-events-none absolute z-50 transition-all duration-75 ease-out"
            style={{
              transform: `translate(${collab.cursor.x}px, ${collab.cursor.y}px)`,
            }}
          >
            <MousePointer2
              className="h-5 w-5 drop-shadow"
              style={{
                fill: collab.color,
                color: collab.color,
              }}
            />
            <div
              className="mt-1 flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-medium text-white shadow-md"
              style={{ backgroundColor: collab.color }}
            >
              {collab.name}
            </div>
          </div>
        );
      })}
    </>
  );
};
