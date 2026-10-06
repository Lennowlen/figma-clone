import type { CanvasElement } from '../types/canvas';

/**
 * Calculates auto layout positions for children inside a parent frame
 * Supports Horizontal & Vertical flow, gap (itemSpacing), padding, and alignment.
 */
export function calculateAutoLayout(
  parent: CanvasElement,
  children: CanvasElement[]
): {
  updatedChildren: { id: string; changes: Partial<CanvasElement> }[];
  parentDimensionChanges?: { width?: number; height?: number };
} {
  if (!parent.layoutMode || parent.layoutMode === 'none' || children.length === 0) {
    return { updatedChildren: [] };
  }

  const isHorizontal = parent.layoutMode === 'horizontal';
  const spacing = parent.itemSpacing ?? 8;
  const padLeft = parent.paddingLeft ?? 16;
  const padRight = parent.paddingRight ?? 16;
  const padTop = parent.paddingTop ?? 16;
  const padBottom = parent.paddingBottom ?? 16;
  const primaryAlign = parent.primaryAxisAlign ?? 'start';
  const counterAlign = parent.counterAxisAlign ?? 'start';

  const updatedChildren: { id: string; changes: Partial<CanvasElement> }[] = [];

  let currentOffset = isHorizontal ? padLeft : padTop;
  let maxCrossSize = 0;

  // Compute total primary size for space-between or center alignment
  const totalItemPrimarySize = children.reduce(
    (sum, c) => sum + (isHorizontal ? c.width : c.height),
    0
  );
  const totalItemSpacing = Math.max(0, children.length - 1) * spacing;
  const availablePrimarySpace = isHorizontal
    ? parent.width - padLeft - padRight
    : parent.height - padTop - padBottom;

  let dynamicSpacing = spacing;
  if (primaryAlign === 'space-between' && children.length > 1) {
    dynamicSpacing = Math.max(0, (availablePrimarySpace - totalItemPrimarySize) / (children.length - 1));
    currentOffset = isHorizontal ? padLeft : padTop;
  } else if (primaryAlign === 'center') {
    const contentSize = totalItemPrimarySize + totalItemSpacing;
    const startDelta = Math.max(0, (availablePrimarySpace - contentSize) / 2);
    currentOffset = (isHorizontal ? padLeft : padTop) + startDelta;
  } else if (primaryAlign === 'end') {
    const contentSize = totalItemPrimarySize + totalItemSpacing;
    currentOffset = (isHorizontal ? parent.width - padRight : parent.height - padBottom) - contentSize;
  }

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    let childX = child.x;
    let childY = child.y;

    if (isHorizontal) {
      childX = currentOffset;
      // Cross axis alignment (Vertical)
      if (counterAlign === 'center') {
        const availableCross = parent.height - padTop - padBottom;
        childY = padTop + (availableCross - child.height) / 2;
      } else if (counterAlign === 'end') {
        childY = parent.height - padBottom - child.height;
      } else {
        childY = padTop;
      }
      currentOffset += child.width + dynamicSpacing;
      maxCrossSize = Math.max(maxCrossSize, child.height);
    } else {
      childY = currentOffset;
      // Cross axis alignment (Horizontal)
      if (counterAlign === 'center') {
        const availableCross = parent.width - padLeft - padRight;
        childX = padLeft + (availableCross - child.width) / 2;
      } else if (counterAlign === 'end') {
        childX = parent.width - padRight - child.width;
      } else {
        childX = padLeft;
      }
      currentOffset += child.height + dynamicSpacing;
      maxCrossSize = Math.max(maxCrossSize, child.width);
    }

    updatedChildren.push({
      id: child.id,
      changes: {
        x: Math.round(childX),
        y: Math.round(childY),
      },
    });
  }

  // Hug contents dimensions
  const parentChanges: { width?: number; height?: number } = {};
  if (parent.layoutSizingHorizontal === 'hug') {
    if (isHorizontal) {
      parentChanges.width = Math.round(currentOffset - dynamicSpacing + padRight);
    } else {
      parentChanges.width = Math.round(maxCrossSize + padLeft + padRight);
    }
  }

  if (parent.layoutSizingVertical === 'hug') {
    if (isHorizontal) {
      parentChanges.height = Math.round(maxCrossSize + padTop + padBottom);
    } else {
      parentChanges.height = Math.round(currentOffset - dynamicSpacing + padBottom);
    }
  }

  return {
    updatedChildren,
    parentDimensionChanges: Object.keys(parentChanges).length ? parentChanges : undefined,
  };
}
