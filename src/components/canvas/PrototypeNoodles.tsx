import React from 'react';
import { useCanvasStore } from '../../store/useCanvasStore';

export const PrototypeNoodles: React.FC = () => {
  const { elements } = useCanvasStore();

  const interactions: {
    sourceId: string;
    sx: number;
    sy: number;
    targetId: string;
    tx: number;
    ty: number;
    trigger: string;
    transition: string;
  }[] = [];

  elements.forEach((el) => {
    if (el.prototypeInteractions?.length) {
      el.prototypeInteractions.forEach((inter) => {
        const target = elements.find((t) => t.id === inter.targetFrameId);
        if (target) {
          interactions.push({
            sourceId: el.id,
            sx: el.x + el.width,
            sy: el.y + el.height / 2,
            targetId: target.id,
            tx: target.x,
            ty: target.y + Math.min(target.height / 2, 40),
            trigger: inter.trigger,
            transition: inter.transition,
          });
        }
      });
    }
  });

  if (interactions.length === 0) return null;

  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible z-35">
      <defs>
        <marker
          id="noodle-arrow"
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="4"
          orient="auto"
        >
          <path d="M1,1 L7,4 L1,7 Z" fill="#0d99ff" />
        </marker>
      </defs>

      {interactions.map((item, idx) => {
        const dx = Math.max(Math.abs(item.tx - item.sx) * 0.5, 40);
        const pathData = `M ${item.sx} ${item.sy} C ${item.sx + dx} ${item.sy}, ${item.tx - dx} ${item.ty}, ${item.tx} ${item.ty}`;

        return (
          <g key={`noodle-${item.sourceId}-${item.targetId}-${idx}`} className="opacity-90">
            {/* Source circular connection node */}
            <circle cx={item.sx} cy={item.sy} r="4" fill="#0d99ff" stroke="#ffffff" strokeWidth="1.5" />

            {/* Bezier connection noodle */}
            <path
              d={pathData}
              fill="none"
              stroke="#0d99ff"
              strokeWidth="2.5"
              markerEnd="url(#noodle-arrow)"
            />

            {/* Interaction label badge */}
            <rect
              x={(item.sx + item.tx) / 2 - 24}
              y={(item.sy + item.ty) / 2 - 10}
              width={48}
              height={18}
              rx={9}
              fill="#0d99ff"
              stroke="#ffffff"
              strokeWidth="1"
            />
            <text
              x={(item.sx + item.tx) / 2}
              y={(item.sy + item.ty) / 2 + 3}
              fill="#ffffff"
              fontSize={9}
              fontWeight="600"
              textAnchor="middle"
            >
              {item.trigger === 'onClick' ? 'Click' : item.trigger}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
