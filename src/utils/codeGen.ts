import type { CanvasElement } from '../types/canvas';

export function generateCSS(el: CanvasElement): string {
  const lines: string[] = [
    `/* ${el.name} */`,
    `width: ${Math.round(el.width)}px;`,
    `height: ${Math.round(el.height)}px;`,
    `background: ${el.fill};`,
  ];

  if (el.opacity < 1) {
    lines.push(`opacity: ${el.opacity};`);
  }
  if (el.cornerRadius && el.cornerRadius > 0) {
    lines.push(`border-radius: ${el.cornerRadius}px;`);
  }
  if (el.strokeWidth > 0 && el.stroke !== 'transparent') {
    lines.push(`border: ${el.strokeWidth}px ${el.strokeStyle} ${el.stroke};`);
  }
  if (el.effects && el.effects.length > 0) {
    const shadow = el.effects[0];
    lines.push(`box-shadow: ${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.spread}px ${shadow.color};`);
  }
  if (el.type === 'text') {
    lines.push(`font-family: "${el.fontFamily || 'Inter'}", sans-serif;`);
    lines.push(`font-size: ${el.fontSize || 16}px;`);
    lines.push(`font-weight: ${el.fontWeight || 400};`);
    lines.push(`text-align: ${el.textAlign || 'left'};`);
    lines.push(`color: ${el.fill};`);
  }

  return lines.join('\n');
}

export function generateTailwind(el: CanvasElement): string {
  const classes: string[] = [];

  classes.push(`w-[${Math.round(el.width)}px]`);
  classes.push(`h-[${Math.round(el.height)}px]`);

  if (el.fill.startsWith('#')) {
    classes.push(`bg-[${el.fill}]`);
  }

  if (el.cornerRadius && el.cornerRadius > 0) {
    classes.push(`rounded-[${el.cornerRadius}px]`);
  }

  if (el.strokeWidth > 0 && el.stroke !== 'transparent') {
    classes.push(`border-[${el.strokeWidth}px]`);
    classes.push(`border-[${el.stroke}]`);
  }

  if (el.effects?.length) {
    classes.push('shadow-lg');
  }

  if (el.type === 'text') {
    classes.push(`text-[${el.fontSize || 16}px]`);
    classes.push(`text-[${el.fill}]`);
    if (el.fontWeight === '700' || el.fontWeight === 'bold') classes.push('font-bold');
    if (el.fontWeight === '600' || el.fontWeight === 'semibold') classes.push('font-semibold');
    if (el.fontWeight === '500' || el.fontWeight === 'medium') classes.push('font-medium');
    if (el.textAlign) classes.push(`text-${el.textAlign}`);
  }

  return classes.join(' ');
}

export function generateReactCode(el: CanvasElement): string {
  const tailwind = generateTailwind(el);

  if (el.type === 'text') {
    return `<div className="${tailwind}">\n  ${el.text || 'Text'}\n</div>`;
  }
  if (el.type === 'frame') {
    return `<div className="relative ${tailwind} overflow-hidden">\n  {/* Child elements */}\n</div>`;
  }
  if (el.type === 'image') {
    return `<img src="${el.src || '/placeholder.png'}" alt="${el.name}" className="${tailwind} object-cover" />`;
  }

  return `<div className="${tailwind}" />`;
}
