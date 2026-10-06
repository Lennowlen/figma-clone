import type { CanvasElement } from '../types/canvas';
import { getStarPath, getPolygonPath, getFreehandPath } from './geometry';

/**
 * Generates pure mathematical vector SVG string directly from element models.
 * Completely resolution-independent, no html-to-image or raster capture.
 */
export function generatePureSvg(
  rootElement: CanvasElement,
  allElements: CanvasElement[]
): string {
  const children = allElements.filter((el) => el.parentId === rootElement.id);

  function renderElementToSvg(el: CanvasElement, offsetX = 0, offsetY = 0): string {
    if (!el.visible) return '';

    const rx = (el.x - offsetX);
    const ry = (el.y - offsetY);
    const rot = el.rotation ? ` transform="rotate(${el.rotation} ${rx + el.width / 2} ${ry + el.height / 2})"` : '';
    const strokeAttr = el.stroke && el.stroke !== 'transparent' && el.strokeWidth > 0
      ? ` stroke="${el.stroke}" stroke-width="${el.strokeWidth}" stroke-opacity="${el.strokeOpacity ?? 1}"`
      : '';
    const fillAttr = ` fill="${el.fill || 'none'}" fill-opacity="${el.fillOpacity ?? 1}"`;

    switch (el.type) {
      case 'frame':
      case 'rectangle':
        return `<rect x="${rx}" y="${ry}" width="${el.width}" height="${el.height}" rx="${el.cornerRadius || 0}"${fillAttr}${strokeAttr}${rot} />`;

      case 'ellipse':
        return `<ellipse cx="${rx + el.width / 2}" cy="${ry + el.height / 2}" rx="${el.width / 2}" ry="${el.height / 2}"${fillAttr}${strokeAttr}${rot} />`;

      case 'star': {
        const cx = rx + el.width / 2;
        const cy = ry + el.height / 2;
        const outerR = Math.min(el.width, el.height) / 2;
        const innerR = outerR * 0.45;
        const pathData = getStarPath(cx, cy, el.pointCount || 5, outerR, innerR);
        return `<path d="${pathData}"${fillAttr}${strokeAttr}${rot} />`;
      }

      case 'polygon': {
        const cx = rx + el.width / 2;
        const cy = ry + el.height / 2;
        const radius = Math.min(el.width, el.height) / 2;
        const pathData = getPolygonPath(cx, cy, el.pointCount || 3, radius);
        return `<path d="${pathData}"${fillAttr}${strokeAttr}${rot} />`;
      }

      case 'text':
        return `<text x="${rx}" y="${ry + (el.fontSize || 16)}" font-family="${el.fontFamily || 'Inter, sans-serif'}" font-size="${el.fontSize || 16}" font-weight="${el.fontWeight || '400'}"${fillAttr}${rot}>${escapeXml(el.text || '')}</text>`;

      case 'line':
        return `<line x1="${rx}" y1="${ry}" x2="${rx + el.width}" y2="${ry + el.height}" stroke="${el.stroke || el.fill}" stroke-width="${Math.max(el.strokeWidth, 2)}"${rot} />`;

      case 'arrow':
        return `<g${rot}>
          <line x1="${rx}" y1="${ry}" x2="${rx + el.width}" y2="${ry + el.height}" stroke="${el.stroke || el.fill}" stroke-width="${Math.max(el.strokeWidth, 2)}" marker-end="url(#arrow-head)" />
        </g>`;

      case 'pencil': {
        if (!el.points || !el.points.length) return '';
        const pathData = getFreehandPath(el.points, el.strokeWidth || 3);
        return `<path d="${pathData}" fill="${el.fill}"${rot} />`;
      }

      default:
        return '';
    }
  }

  function escapeXml(unsafe: string) {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });
  }

  let childrenSvg = '';
  if (rootElement.type === 'frame') {
    childrenSvg = children.map((c) => renderElementToSvg(c, 0, 0)).join('\n  ');
  }

  const rootSvgContent = renderElementToSvg(rootElement, rootElement.x, rootElement.y);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${rootElement.width}" height="${rootElement.height}" viewBox="0 0 ${rootElement.width} ${rootElement.height}">
  <defs>
    <marker id="arrow-head" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="${rootElement.fill || '#fff'}" />
    </marker>
  </defs>
  ${rootSvgContent}
  ${childrenSvg}
</svg>`;
}

export function downloadPureVectorSvg(element: CanvasElement, allElements: CanvasElement[], filename: string) {
  const svgString = generatePureSvg(element, allElements);
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
