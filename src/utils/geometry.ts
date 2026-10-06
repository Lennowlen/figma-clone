import getStroke from 'perfect-freehand';
import type { CanvasElement, SmartGuide } from '../types/canvas';

// Convert points array to SVG path data using perfect-freehand
export function getSvgPathFromStroke(stroke: [number, number, number][]) {
  if (!stroke.length) return '';

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ['M', ...stroke[0], 'Q']
  );

  d.push('Z');
  return d.join(' ');
}

export function getFreehandPath(points: [number, number, number][], strokeWidth = 3) {
  const outline = getStroke(points, {
    size: strokeWidth,
    thinning: 0.5,
    smoothing: 0.5,
    streamline: 0.5,
  });
  return getSvgPathFromStroke(outline as unknown as [number, number, number][]);
}

// Generate Star SVG Path
export function getStarPath(cx: number, cy: number, spikes = 5, outerRadius = 50, innerRadius = 25) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  let path = `M ${cx} ${cy - outerRadius} `;
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    path += `L ${x} ${y} `;
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    path += `L ${x} ${y} `;
    rot += step;
  }
  path += 'Z';
  return path;
}

// Generate Polygon Path
export function getPolygonPath(cx: number, cy: number, sides = 3, radius = 50) {
  const angle = (2 * Math.PI) / sides;
  let path = '';
  for (let i = 0; i < sides; i++) {
    const x = cx + radius * Math.cos(i * angle - Math.PI / 2);
    const y = cy + radius * Math.sin(i * angle - Math.PI / 2);
    path += (i === 0 ? 'M ' : 'L ') + `${x} ${y} `;
  }
  path += 'Z';
  return path;
}

// Smart Guides and Snapping
export function calculateSnapping(
  activeEl: { x: number; y: number; width: number; height: number },
  otherElements: CanvasElement[],
  threshold = 6
): { snappedX: number; snappedY: number; guides: SmartGuide[] } {
  let snappedX = activeEl.x;
  let snappedY = activeEl.y;
  const guides: SmartGuide[] = [];

  const activeCenterX = activeEl.x + activeEl.width / 2;
  const activeRight = activeEl.x + activeEl.width;
  const activeCenterY = activeEl.y + activeEl.height / 2;
  const activeBottom = activeEl.y + activeEl.height;

  for (const other of otherElements) {
    if (!other.visible) continue;
    const otherCenterX = other.x + other.width / 2;
    const otherRight = other.x + other.width;
    const otherCenterY = other.y + other.height / 2;
    const otherBottom = other.y + other.height;

    // X Alignment
    // Left - Left
    if (Math.abs(activeEl.x - other.x) < threshold) {
      snappedX = other.x;
      guides.push({
        type: 'vertical',
        position: other.x,
        start: Math.min(activeEl.y, other.y),
        end: Math.max(activeBottom, otherBottom),
      });
    }
    // Center - Center
    else if (Math.abs(activeCenterX - otherCenterX) < threshold) {
      snappedX = otherCenterX - activeEl.width / 2;
      guides.push({
        type: 'vertical',
        position: otherCenterX,
        start: Math.min(activeEl.y, other.y),
        end: Math.max(activeBottom, otherBottom),
      });
    }
    // Right - Right
    else if (Math.abs(activeRight - otherRight) < threshold) {
      snappedX = otherRight - activeEl.width;
      guides.push({
        type: 'vertical',
        position: otherRight,
        start: Math.min(activeEl.y, other.y),
        end: Math.max(activeBottom, otherBottom),
      });
    }

    // Y Alignment
    // Top - Top
    if (Math.abs(activeEl.y - other.y) < threshold) {
      snappedY = other.y;
      guides.push({
        type: 'horizontal',
        position: other.y,
        start: Math.min(activeEl.x, other.x),
        end: Math.max(activeRight, otherRight),
      });
    }
    // Middle - Middle
    else if (Math.abs(activeCenterY - otherCenterY) < threshold) {
      snappedY = otherCenterY - activeEl.height / 2;
      guides.push({
        type: 'horizontal',
        position: otherCenterY,
        start: Math.min(activeEl.x, other.x),
        end: Math.max(activeRight, otherRight),
      });
    }
    // Bottom - Bottom
    else if (Math.abs(activeBottom - otherBottom) < threshold) {
      snappedY = otherBottom - activeEl.height;
      guides.push({
        type: 'horizontal',
        position: otherBottom,
        start: Math.min(activeEl.x, other.x),
        end: Math.max(activeRight, otherRight),
      });
    }
  }

  return { snappedX, snappedY, guides };
}
