export type ToolType =
  | 'select'
  | 'hand'
  | 'frame'
  | 'rectangle'
  | 'ellipse'
  | 'star'
  | 'polygon'
  | 'line'
  | 'arrow'
  | 'pencil'
  | 'text'
  | 'image'
  | 'comment'
  | 'eraser';

export type ElementType =
  | 'frame'
  | 'rectangle'
  | 'ellipse'
  | 'star'
  | 'polygon'
  | 'line'
  | 'arrow'
  | 'pencil'
  | 'text'
  | 'image'
  | 'group';

export interface Point {
  x: number;
  y: number;
}

export interface ShadowEffect {
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  type: 'drop-shadow' | 'inner-shadow' | 'layer-blur';
}

export interface CanvasElement {
  id: string;
  name: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  visible: boolean;
  locked: boolean;
  parentId?: string; // If inside a frame or group
  
  // Fill & Stroke
  fill: string;
  fillOpacity: number;
  stroke: string;
  strokeWidth: number;
  strokeStyle: 'solid' | 'dashed' | 'dotted';
  strokeOpacity: number;
  
  // Appearance
  cornerRadius?: number;
  effects: ShadowEffect[];
  
  // Text-specific
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: number;
  letterSpacing?: number;
  
  // Pencil / Freehand specific
  points?: [number, number, number][]; // [x, y, pressure]
  
  // Image specific
  src?: string;
  aspectRatio?: number;
  
  // Frame specific
  clipContent?: boolean;
  presetName?: string;
  
  // Star & Polygon specific
  pointCount?: number;

  // Auto Layout Properties
  layoutMode?: 'none' | 'horizontal' | 'vertical';
  itemSpacing?: number;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  primaryAxisAlign?: 'start' | 'center' | 'end' | 'space-between';
  counterAxisAlign?: 'start' | 'center' | 'end';
  layoutSizingHorizontal?: 'fixed' | 'hug' | 'fill';
  layoutSizingVertical?: 'fixed' | 'hug' | 'fill';
  layoutWrap?: boolean;

  // Constraints
  constraints?: {
    horizontal: 'left' | 'right' | 'center' | 'scale';
    vertical: 'top' | 'bottom' | 'center' | 'scale';
  };

  // Component & Instance System
  isMasterComponent?: boolean;
  masterComponentId?: string; // If this element is an instance of a master component
  overrides?: Record<string, any>;

  // Interactive Prototyping & Noodles
  prototypeInteractions?: PrototypeInteraction[];

  // Pen Tool / Bezier Vector Path
  pathData?: string;
}

export interface PrototypeInteraction {
  id: string;
  trigger: 'onClick' | 'onHover' | 'onDrag';
  targetFrameId: string;
  transition: 'instant' | 'smart-animate' | 'dissolve' | 'slide-in';
  durationMs?: number;
}

export interface DesignToken {
  id: string;
  name: string;
  type: 'color' | 'typography' | 'number';
  value: string | number;
}

export interface MarqueeBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DistanceGuide {
  fromId: string;
  toId: string;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

export interface FramePreset {
  name: string;
  category: 'Phone' | 'Tablet' | 'Desktop' | 'Watch' | 'Social Media';
  width: number;
  height: number;
  icon?: string;
}

export interface SmartGuide {
  type: 'horizontal' | 'vertical';
  position: number;
  start: number;
  end: number;
  distance?: number;
}

export interface Collaborator {
  id: string;
  name: string;
  color: string;
  avatar?: string;
  cursor?: Point;
  lastActive: number;
  selectedElementIds: string[];
}

export interface CanvasComment {
  id: string;
  x: number;
  y: number;
  author: string;
  authorColor: string;
  content: string;
  createdAt: number;
  resolved: boolean;
}

export type PlatformMode = 'web' | 'desktop' | 'mobile';

