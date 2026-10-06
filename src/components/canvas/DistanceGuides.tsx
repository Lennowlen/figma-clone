import React from 'react';
import { useCanvasStore } from '../../store/useCanvasStore';

export const DistanceGuides: React.FC = () => {
  const { elements, selectedIds, hoveredId, isAltPressed } = useCanvasStore();

  if (!isAltPressed || selectedIds.length !== 1 || !hoveredId || hoveredId === selectedIds[0]) {
    return null;
  }

  const selectedEl = elements.find((e) => e.id === selectedIds[0]);
  const hoveredEl = elements.find((e) => e.id === hoveredId);

  if (!selectedEl || !hoveredEl) return null;

  const selRight = selectedEl.x + selectedEl.width;
  const selBottom = selectedEl.y + selectedEl.height;
  const hovRight = hoveredEl.x + hoveredEl.width;
  const hovBottom = hoveredEl.y + hoveredEl.height;

  const guides: React.ReactNode[] = [];

  // Horizontal Distance (Left / Right)
  if (selRight < hoveredEl.x) {
    const dist = Math.round(hoveredEl.x - selRight);
    const midY = (selectedEl.y + selectedEl.height / 2 + hoveredEl.y + hoveredEl.height / 2) / 2;
    guides.push(
      <g key="dist-h-right">
        <line
          x1={selRight}
          y1={midY}
          x2={hoveredEl.x}
          y2={midY}
          stroke="#f43f5e"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
        <rect
          x={(selRight + hoveredEl.x) / 2 - 18}
          y={midY - 10}
          width={36}
          height={18}
          rx={4}
          fill="#f43f5e"
        />
        <text
          x={(selRight + hoveredEl.x) / 2}
          y={midY + 3}
          fill="#ffffff"
          fontSize={10}
          fontWeight="600"
          textAnchor="middle"
        >
          {dist}
        </text>
      </g>
    );
  } else if (hovRight < selectedEl.x) {
    const dist = Math.round(selectedEl.x - hovRight);
    const midY = (selectedEl.y + selectedEl.height / 2 + hoveredEl.y + hoveredEl.height / 2) / 2;
    guides.push(
      <g key="dist-h-left">
        <line
          x1={hovRight}
          y1={midY}
          x2={selectedEl.x}
          y2={midY}
          stroke="#f43f5e"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
        <rect
          x={(hovRight + selectedEl.x) / 2 - 18}
          y={midY - 10}
          width={36}
          height={18}
          rx={4}
          fill="#f43f5e"
        />
        <text
          x={(hovRight + selectedEl.x) / 2}
          y={midY + 3}
          fill="#ffffff"
          fontSize={10}
          fontWeight="600"
          textAnchor="middle"
        >
          {dist}
        </text>
      </g>
    );
  }

  // Vertical Distance (Top / Bottom)
  if (selBottom < hoveredEl.y) {
    const dist = Math.round(hoveredEl.y - selBottom);
    const midX = (selectedEl.x + selectedEl.width / 2 + hoveredEl.x + hoveredEl.width / 2) / 2;
    guides.push(
      <g key="dist-v-bottom">
        <line
          x1={midX}
          y1={selBottom}
          x2={midX}
          y2={hoveredEl.y}
          stroke="#f43f5e"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
        <rect
          x={midX - 18}
          y={(selBottom + hoveredEl.y) / 2 - 9}
          width={36}
          height={18}
          rx={4}
          fill="#f43f5e"
        />
        <text
          x={midX}
          y={(selBottom + hoveredEl.y) / 2 + 4}
          fill="#ffffff"
          fontSize={10}
          fontWeight="600"
          textAnchor="middle"
        >
          {dist}
        </text>
      </g>
    );
  } else if (hovBottom < selectedEl.y) {
    const dist = Math.round(selectedEl.y - hovBottom);
    const midX = (selectedEl.x + selectedEl.width / 2 + hoveredEl.x + hoveredEl.width / 2) / 2;
    guides.push(
      <g key="dist-v-top">
        <line
          x1={midX}
          y1={hovBottom}
          x2={midX}
          y2={selectedEl.y}
          stroke="#f43f5e"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
        <rect
          x={midX - 18}
          y={(hovBottom + selectedEl.y) / 2 - 9}
          width={36}
          height={18}
          rx={4}
          fill="#f43f5e"
        />
        <text
          x={midX}
          y={(hovBottom + selectedEl.y) / 2 + 4}
          fill="#ffffff"
          fontSize={10}
          fontWeight="600"
          textAnchor="middle"
        >
          {dist}
        </text>
      </g>
    );
  }

  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible z-40">
      {/* Target element highlight border */}
      <rect
        x={hoveredEl.x}
        y={hoveredEl.y}
        width={hoveredEl.width}
        height={hoveredEl.height}
        fill="rgba(244, 63, 94, 0.05)"
        stroke="#f43f5e"
        strokeWidth="1.5"
      />
      {guides}
    </svg>
  );
};
