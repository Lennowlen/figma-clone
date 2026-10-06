import { toPng, toSvg } from 'html-to-image';
import type { CanvasElement } from '../types/canvas';

export async function exportElementAsPng(node: HTMLElement, filename = 'design.png') {
  try {
    const dataUrl = await toPng(node, { quality: 0.95 });
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error('Failed to export PNG', err);
  }
}

export async function exportElementAsSvg(node: HTMLElement, filename = 'design.svg') {
  try {
    const dataUrl = await toSvg(node);
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error('Failed to export SVG', err);
  }
}

export function exportProjectJson(elements: CanvasElement[], filename = 'figma-project.json') {
  const data = JSON.stringify(elements, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}
