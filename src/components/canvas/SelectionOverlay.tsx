import React from 'react';
import type { CanvasElement } from '../../types/canvas';

interface SelectionOverlayProps {
  elements: CanvasElement[];
  selectedIds: string[];
  zoom: number;
  onResizeStart: (handle: string, e: React.MouseEvent) => void;
  onRotateStart: (e: React.MouseEvent) => void;
}

export const SelectionOverlay: React.FC<SelectionOverlayProps> = ({
  elements,
  selectedIds,
  zoom,
  onResizeStart,
  onRotateStart,
}) => {
  if (selectedIds.length === 0) return null;

  const selectedEls = elements.filter((el) => selectedIds.includes(el.id) && el.visible);
  if (selectedEls.length === 0) return null;

  // Compute bounding box for single or multi selection
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  selectedEls.forEach((el) => {
    minX = Math.min(minX, el.x);
    minY = Math.min(minY, el.y);
    maxX = Math.max(maxX, el.x + el.width);
    maxY = Math.max(maxY, el.y + el.height);
  });

  const width = maxX - minX;
  const height = maxY - minY;
  const isSingle = selectedEls.length === 1;
  const rotation = isSingle ? selectedEls[0].rotation || 0 : 0;

  const handleSize = 8 / zoom;
  const halfHandle = handleSize / 2;

  const handles = [
    { type: 'nw', x: 0, y: 0, cursor: 'nwse-resize' },
    { type: 'n', x: width / 2, y: 0, cursor: 'ns-resize' },
    { type: 'ne', x: width, y: 0, cursor: 'nesw-resize' },
    { type: 'e', x: width, y: height / 2, cursor: 'ew-resize' },
    { type: 'se', x: width, y: height, cursor: 'nwse-resize' },
    { type: 's', x: width / 2, y: height, cursor: 'ns-resize' },
    { type: 'sw', x: 0, y: height, cursor: 'nesw-resize' },
    { type: 'w', x: 0, y: height / 2, cursor: 'ew-resize' },
  ];

  return (
    <div
      className="pointer-events-none absolute z-30"
      style={{
        left: `${minX}px`,
        top: `${minY}px`,
        width: `${width}px`,
        height: `${height}px`,
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
        transformOrigin: 'center center',
      }}
    >
      {/* Figma selection boundary border */}
      <div className="absolute inset-0 border border-[#0d99ff] pointer-events-none" />

      {/* Resize Handles */}
      {handles.map((h) => (
        <div
          key={h.type}
          onMouseDown={(e) => {
            e.stopPropagation();
            onResizeStart(h.type, e);
          }}
          className="pointer-events-auto absolute bg-white border border-[#0d99ff] hover:bg-[#0d99ff] transition-colors rounded-[1px] shadow-sm"
          style={{
            left: `${h.x - halfHandle}px`,
            top: `${h.y - halfHandle}px`,
            width: `${handleSize}px`,
            height: `${handleSize}px`,
            cursor: h.cursor,
          }}
        />
      ))}

      {/* Rotation Handle */}
      {isSingle && (
        <div
          onMouseDown={(e) => {
            e.stopPropagation();
            onRotateStart(e);
          }}
          className="pointer-events-auto absolute left-1/2 -top-6 flex -translate-x-1/2 cursor-grab flex-col items-center group"
        >
          <div className="h-3.5 w-3.5 rounded-full border border-[#0d99ff] bg-white group-hover:bg-[#0d99ff] transition-colors shadow-sm" />
          <div className="h-2.5 w-[1px] bg-[#0d99ff]" />
        </div>
      )}

      {/* Dimension Pill Badge */}
      <div
        className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 rounded bg-[#0d99ff] px-1.5 py-0.5 text-[10px] font-medium text-white shadow"
        style={{ fontSize: `${Math.max(10 / zoom, 8)}px` }}
      >
        {Math.round(width)} × {Math.round(height)}
      </div>
    </div>
  );
};
