import React from 'react';
import type { CanvasElement } from '../../types/canvas';
import { getFreehandPath, getStarPath, getPolygonPath } from '../../utils/geometry';

interface ElementRendererProps {
  element: CanvasElement;
  isSelected?: boolean;
  onTextChange?: (id: string, newText: string) => void;
  isEditingText?: boolean;
}

export const CanvasElementRenderer: React.FC<ElementRendererProps> = ({
  element,
  onTextChange,
  isEditingText,
}) => {
  if (!element.visible) return null;

  const shadowCss = element.effects?.length
    ? element.effects
        .map((eff) => `${eff.x}px ${eff.y}px ${eff.blur}px ${eff.spread}px ${eff.color}`)
        .join(', ')
    : undefined;

  const commonStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${element.x}px`,
    top: `${element.y}px`,
    width: `${element.width}px`,
    height: `${element.height}px`,
    transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
    transformOrigin: 'center center',
    opacity: element.opacity ?? 1,
    boxShadow: shadowCss,
    pointerEvents: 'auto',
  };

  switch (element.type) {
    case 'frame':
      return (
        <div
          id={`el-${element.id}`}
          style={{
            ...commonStyle,
            backgroundColor: element.fill,
            borderRadius: `${element.cornerRadius || 0}px`,
            borderWidth: `${element.strokeWidth}px`,
            borderColor: element.stroke,
            borderStyle: element.strokeStyle,
            overflow: element.clipContent ? 'hidden' : 'visible',
          }}
          className="relative transition-shadow"
        >
          {/* Frame Name Label (Figma-style) */}
          <div
            className="pointer-events-none absolute -top-6 left-0 text-[11px] font-medium text-gray-400 select-none whitespace-nowrap truncate max-w-[200px]"
          >
            {element.name}
          </div>
        </div>
      );

    case 'rectangle':
      return (
        <div
          id={`el-${element.id}`}
          style={{
            ...commonStyle,
            backgroundColor: element.fill,
            borderRadius: `${element.cornerRadius || 0}px`,
            borderWidth: `${element.strokeWidth}px`,
            borderColor: element.stroke,
            borderStyle: element.strokeStyle,
          }}
        />
      );

    case 'ellipse':
      return (
        <div
          id={`el-${element.id}`}
          style={{
            ...commonStyle,
            backgroundColor: element.fill,
            borderRadius: '50%',
            borderWidth: `${element.strokeWidth}px`,
            borderColor: element.stroke,
            borderStyle: element.strokeStyle,
          }}
        />
      );

    case 'text':
      return (
        <div
          id={`el-${element.id}`}
          style={{
            ...commonStyle,
            color: element.fill,
            fontSize: `${element.fontSize || 16}px`,
            fontFamily: element.fontFamily || 'Inter, sans-serif',
            fontWeight: element.fontWeight || '400',
            textAlign: element.textAlign || 'left',
            lineHeight: element.lineHeight ? `${element.lineHeight}px` : 'normal',
            letterSpacing: element.letterSpacing ? `${element.letterSpacing}px` : 'normal',
            display: 'flex',
            alignItems: 'center',
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
          }}
        >
          {isEditingText ? (
            <textarea
              autoFocus
              defaultValue={element.text || ''}
              onChange={(e) => onTextChange?.(element.id, e.target.value)}
              className="h-full w-full resize-none bg-transparent outline-none border border-indigo-500 rounded p-1 text-inherit font-inherit"
              style={{ color: element.fill }}
            />
          ) : (
            element.text || 'Type something...'
          )}
        </div>
      );

    case 'star': {
      const cx = element.width / 2;
      const cy = element.height / 2;
      const outerR = Math.min(element.width, element.height) / 2;
      const innerR = outerR * 0.45;
      const pathData = getStarPath(cx, cy, element.pointCount || 5, outerR, innerR);

      return (
        <svg
          id={`el-${element.id}`}
          style={commonStyle}
          viewBox={`0 0 ${element.width} ${element.height}`}
        >
          <path
            d={pathData}
            fill={element.fill}
            stroke={element.stroke}
            strokeWidth={element.strokeWidth}
          />
        </svg>
      );
    }

    case 'polygon': {
      const cx = element.width / 2;
      const cy = element.height / 2;
      const radius = Math.min(element.width, element.height) / 2;
      const pathData = getPolygonPath(cx, cy, element.pointCount || 3, radius);

      return (
        <svg
          id={`el-${element.id}`}
          style={commonStyle}
          viewBox={`0 0 ${element.width} ${element.height}`}
        >
          <path
            d={pathData}
            fill={element.fill}
            stroke={element.stroke}
            strokeWidth={element.strokeWidth}
          />
        </svg>
      );
    }

    case 'line':
      return (
        <svg
          id={`el-${element.id}`}
          style={commonStyle}
          viewBox={`0 0 ${element.width} ${element.height}`}
        >
          <line
            x1="0"
            y1="0"
            x2={element.width}
            y2={element.height}
            stroke={element.stroke !== 'transparent' ? element.stroke : element.fill}
            strokeWidth={Math.max(element.strokeWidth, 2)}
            strokeDasharray={element.strokeStyle === 'dashed' ? '6 4' : undefined}
          />
        </svg>
      );

    case 'arrow':
      return (
        <svg
          id={`el-${element.id}`}
          style={commonStyle}
          viewBox={`0 0 ${element.width} ${element.height}`}
        >
          <defs>
            <marker
              id={`arrow-head-${element.id}`}
              markerWidth="10"
              markerHeight="10"
              refX="6"
              refY="3"
              orient="auto"
            >
              <path d="M0,0 L0,6 L9,3 z" fill={element.fill} />
            </marker>
          </defs>
          <line
            x1="0"
            y1="0"
            x2={element.width}
            y2={element.height}
            stroke={element.stroke !== 'transparent' ? element.stroke : element.fill}
            strokeWidth={Math.max(element.strokeWidth, 2)}
            markerEnd={`url(#arrow-head-${element.id})`}
          />
        </svg>
      );

    case 'pencil': {
      if (!element.points || !element.points.length) return null;
      const pathData = getFreehandPath(element.points, element.strokeWidth || 3);
      return (
        <svg
          id={`el-${element.id}`}
          style={commonStyle}
          viewBox={`0 0 ${element.width} ${element.height}`}
          className="overflow-visible"
        >
          <path d={pathData} fill={element.fill} />
        </svg>
      );
    }

    case 'image':
      return (
        <div
          id={`el-${element.id}`}
          style={{
            ...commonStyle,
            borderRadius: `${element.cornerRadius || 0}px`,
            overflow: 'hidden',
          }}
        >
          <img
            src={element.src || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80'}
            alt={element.name}
            className="h-full w-full object-cover pointer-events-none"
          />
        </div>
      );

    default:
      return null;
  }
};
