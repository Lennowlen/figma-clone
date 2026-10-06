import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type {
  CanvasElement,
  ToolType,
  Point,
  SmartGuide,
  PlatformMode,
  CanvasComment,
  MarqueeBox,
  PrototypeInteraction,
  DesignToken,
} from '../types/canvas';
import { calculateAutoLayout } from '../utils/autoLayout';

interface CanvasState {
  elements: CanvasElement[];
  selectedIds: string[];
  activeTool: ToolType;
  platformMode: PlatformMode;
  showRulers: boolean;
  showGrid: boolean;
  snapToGrid: boolean;
  
  // Viewport
  zoom: number;
  panOffset: Point;
  isPanning: boolean;
  
  // Smart Guides & Alt Distance
  smartGuides: SmartGuide[];
  hoveredId: string | null;
  isAltPressed: boolean;
  
  // Marquee Selection Box
  marqueeBox: MarqueeBox | null;
  
  // Undo/Redo History
  history: CanvasElement[][];
  historyIndex: number;
  
  // Comments
  comments: CanvasComment[];
  activeCommentId: string | null;

  // Design Tokens
  designTokens: DesignToken[];
  
  // Actions
  setElements: (elements: CanvasElement[]) => void;
  addElement: (element: Omit<CanvasElement, 'id'>) => string;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  updateElements: (updates: { id: string; changes: Partial<CanvasElement> }[]) => void;
  deleteSelected: () => void;
  duplicateSelected: () => void;
  
  // Selection
  setSelectedIds: (ids: string[]) => void;
  selectElement: (id: string, multi?: boolean) => void;
  clearSelection: () => void;
  setMarqueeBox: (box: MarqueeBox | null) => void;
  setHoveredId: (id: string | null) => void;
  setIsAltPressed: (pressed: boolean) => void;

  // Grouping & Hierarchy
  groupSelected: () => void;
  ungroupSelected: () => void;
  frameSelection: () => void;
  
  // Master Component & Instances
  createMasterComponent: (id: string) => void;
  createInstance: (masterId: string) => void;

  // Auto Layout
  toggleAutoLayout: (frameId: string, mode: 'none' | 'horizontal' | 'vertical') => void;
  updateAutoLayoutProps: (frameId: string, props: Partial<CanvasElement>) => void;

  // Prototyping
  addPrototypeInteraction: (sourceId: string, interaction: PrototypeInteraction) => void;
  removePrototypeInteraction: (sourceId: string, interactionId: string) => void;
  
  // Ordering
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;
  
  // Tool & Mode
  setActiveTool: (tool: ToolType) => void;
  setPlatformMode: (mode: PlatformMode) => void;
  toggleRulers: () => void;
  toggleGrid: () => void;
  toggleSnap: () => void;
  
  // Viewport Actions
  setZoom: (zoom: number | ((prev: number) => number)) => void;
  setPanOffset: (offset: Point | ((prev: Point) => Point)) => void;
  setIsPanning: (isPanning: boolean) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  
  // Alignment Actions
  alignSelected: (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  distributeSelected: (axis: 'horizontal' | 'vertical') => void;
  
  // Smart Guides
  setSmartGuides: (guides: SmartGuide[]) => void;
  
  // History Actions
  undo: () => void;
  redo: () => void;
  recordHistory: () => void;
  
  // Comments Actions
  addComment: (x: number, y: number, text: string, author: string, color: string) => void;
  resolveComment: (id: string) => void;
  setActiveCommentId: (id: string | null) => void;
  
  // Presets / Samples
  loadSampleProject: () => void;
}


const INITIAL_SAMPLE_ELEMENTS: CanvasElement[] = [
  // Frame: Mobile App Screen
  {
    id: 'frame-1',
    name: 'iPhone 16 Pro - Login',
    type: 'frame',
    x: 100,
    y: 100,
    width: 402,
    height: 874,
    rotation: 0,
    opacity: 1,
    visible: true,
    locked: false,
    fill: '#0f172a',
    fillOpacity: 1,
    stroke: '#334155',
    strokeWidth: 1,
    strokeStyle: 'solid',
    strokeOpacity: 1,
    cornerRadius: 44,
    effects: [{ x: 0, y: 20, blur: 40, spread: -10, color: 'rgba(0,0,0,0.5)', opacity: 0.5, type: 'drop-shadow' }],
    clipContent: true,
  },
  // Card inside Frame
  {
    id: 'rect-bg-glow',
    name: 'Glow Card',
    type: 'rectangle',
    x: 130,
    y: 160,
    width: 342,
    height: 180,
    rotation: 0,
    opacity: 1,
    visible: true,
    locked: false,
    fill: '#6366f1',
    fillOpacity: 1,
    stroke: '#818cf8',
    strokeWidth: 1,
    strokeStyle: 'solid',
    strokeOpacity: 0.5,
    cornerRadius: 24,
    effects: [{ x: 0, y: 12, blur: 24, spread: -4, color: '#6366f1', opacity: 0.4, type: 'drop-shadow' }],
    parentId: 'frame-1',
  },
  // Heading Text
  {
    id: 'text-heading',
    name: 'Title Text',
    type: 'text',
    x: 154,
    y: 195,
    width: 290,
    height: 40,
    rotation: 0,
    opacity: 1,
    visible: true,
    locked: false,
    fill: '#ffffff',
    fillOpacity: 1,
    stroke: 'transparent',
    strokeWidth: 0,
    strokeStyle: 'solid',
    strokeOpacity: 1,
    effects: [],
    text: 'Figma Cloud Pro',
    fontSize: 28,
    fontFamily: 'Inter',
    fontWeight: '700',
    textAlign: 'left',
    parentId: 'frame-1',
  },
  // Subtext
  {
    id: 'text-sub',
    name: 'Subtitle',
    type: 'text',
    x: 154,
    y: 245,
    width: 290,
    height: 40,
    rotation: 0,
    opacity: 0.9,
    visible: true,
    locked: false,
    fill: '#e0e7ff',
    fillOpacity: 1,
    stroke: 'transparent',
    strokeWidth: 0,
    strokeStyle: 'solid',
    strokeOpacity: 1,
    effects: [],
    text: 'Collaborate with your team anywhere, in real-time.',
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '400',
    textAlign: 'left',
    parentId: 'frame-1',
  },
  // CTA Button
  {
    id: 'btn-cta',
    name: 'Primary Button',
    type: 'rectangle',
    x: 130,
    y: 760,
    width: 342,
    height: 56,
    rotation: 0,
    opacity: 1,
    visible: true,
    locked: false,
    fill: '#4f46e5',
    fillOpacity: 1,
    stroke: '#6366f1',
    strokeWidth: 1,
    strokeStyle: 'solid',
    strokeOpacity: 1,
    cornerRadius: 16,
    effects: [{ x: 0, y: 8, blur: 16, spread: 0, color: 'rgba(79, 70, 229, 0.4)', opacity: 0.5, type: 'drop-shadow' }],
    parentId: 'frame-1',
  },
  {
    id: 'btn-text',
    name: 'Button Text',
    type: 'text',
    x: 130,
    y: 776,
    width: 342,
    height: 24,
    rotation: 0,
    opacity: 1,
    visible: true,
    locked: false,
    fill: '#ffffff',
    fillOpacity: 1,
    stroke: 'transparent',
    strokeWidth: 0,
    strokeStyle: 'solid',
    strokeOpacity: 1,
    effects: [],
    text: 'Get Started 🚀',
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '600',
    textAlign: 'center',
    parentId: 'frame-1',
  },

  // Desktop Frame
  {
    id: 'frame-desktop',
    name: 'Desktop - Dashboard',
    type: 'frame',
    x: 600,
    y: 100,
    width: 900,
    height: 600,
    rotation: 0,
    opacity: 1,
    visible: true,
    locked: false,
    fill: '#18181b',
    fillOpacity: 1,
    stroke: '#27272a',
    strokeWidth: 1,
    strokeStyle: 'solid',
    strokeOpacity: 1,
    cornerRadius: 16,
    effects: [{ x: 0, y: 24, blur: 48, spread: -12, color: 'rgba(0,0,0,0.6)', opacity: 0.6, type: 'drop-shadow' }],
    clipContent: true,
  },
  // Desktop Header
  {
    id: 'desk-header',
    name: 'Top Navigation Bar',
    type: 'rectangle',
    x: 600,
    y: 100,
    width: 900,
    height: 64,
    rotation: 0,
    opacity: 1,
    visible: true,
    locked: false,
    fill: '#27272a',
    fillOpacity: 1,
    stroke: '#3f3f46',
    strokeWidth: 1,
    strokeStyle: 'solid',
    strokeOpacity: 0.5,
    cornerRadius: 0,
    effects: [],
    parentId: 'frame-desktop',
  },
  // Desktop Header Brand Text
  {
    id: 'desk-logo',
    name: 'Logo Text',
    type: 'text',
    x: 624,
    y: 120,
    width: 200,
    height: 24,
    rotation: 0,
    opacity: 1,
    visible: true,
    locked: false,
    fill: '#ffffff',
    fillOpacity: 1,
    stroke: 'transparent',
    strokeWidth: 0,
    strokeStyle: 'solid',
    strokeOpacity: 1,
    effects: [],
    text: '⚡ ANTIGRAVITY STUDIO',
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '700',
    textAlign: 'left',
    parentId: 'frame-desktop',
  },
  // Desktop Widget 1
  {
    id: 'widget-1',
    name: 'Analytics Card',
    type: 'rectangle',
    x: 630,
    y: 190,
    width: 400,
    height: 220,
    rotation: 0,
    opacity: 1,
    visible: true,
    locked: false,
    fill: '#27272a',
    fillOpacity: 0.8,
    stroke: '#3f3f46',
    strokeWidth: 1,
    strokeStyle: 'solid',
    strokeOpacity: 1,
    cornerRadius: 12,
    effects: [],
    parentId: 'frame-desktop',
  },
  // Star decoration
  {
    id: 'star-badge',
    name: 'Star Badge',
    type: 'star',
    x: 950,
    y: 210,
    width: 48,
    height: 48,
    rotation: 15,
    opacity: 1,
    visible: true,
    locked: false,
    fill: '#fbbf24',
    fillOpacity: 1,
    stroke: '#f59e0b',
    strokeWidth: 2,
    strokeStyle: 'solid',
    strokeOpacity: 1,
    effects: [{ x: 0, y: 4, blur: 12, spread: 0, color: 'rgba(251, 191, 36, 0.4)', opacity: 0.6, type: 'drop-shadow' }],
    pointCount: 5,
    parentId: 'frame-desktop',
  },
];

export const useCanvasStore = create<CanvasState>((set, get) => ({
  elements: INITIAL_SAMPLE_ELEMENTS,
  selectedIds: ['frame-1'],
  activeTool: 'select',
  platformMode: 'web',
  showRulers: true,
  showGrid: true,
  snapToGrid: true,
  
  zoom: 0.85,
  panOffset: { x: 80, y: 60 },
  isPanning: false,
  
  smartGuides: [],
  hoveredId: null,
  isAltPressed: false,
  marqueeBox: null,

  designTokens: [
    { id: 'token-brand', name: 'Primary / Indigo 600', type: 'color', value: '#4f46e5' },
    { id: 'token-accent', name: 'Accent / Amber 400', type: 'color', value: '#fbbf24' },
    { id: 'token-bg', name: 'Surface / Zinc 900', type: 'color', value: '#18181b' },
  ],
  
  history: [INITIAL_SAMPLE_ELEMENTS],
  historyIndex: 0,
  
  comments: [
    {
      id: 'com-1',
      x: 350,
      y: 180,
      author: 'Sarah Designer',
      authorColor: '#ec4899',
      content: 'Love this vibrant gradient card! Can we make the font slightly bolder?',
      createdAt: Date.now() - 3600000,
      resolved: false,
    }
  ],
  activeCommentId: null,

  setElements: (elements) => {
    set({ elements });
    get().recordHistory();
  },

  addElement: (elementData) => {
    const id = nanoid(8);
    const newElement: CanvasElement = {
      ...elementData,
      id,
      effects: elementData.effects || [],
      strokeOpacity: elementData.strokeOpacity ?? 1,
      fillOpacity: elementData.fillOpacity ?? 1,
    };

    set((state) => ({
      elements: [...state.elements, newElement],
      selectedIds: [id],
    }));
    get().recordHistory();
    return id;
  },

  updateElement: (id, updates) => {
    set((state) => ({
      elements: state.elements.map((el) => (el.id === id ? { ...el, ...updates } : el)),
    }));
  },

  updateElements: (updates) => {
    set((state) => {
      const updateMap = new Map(updates.map((u) => [u.id, u.changes]));
      return {
        elements: state.elements.map((el) => {
          const changes = updateMap.get(el.id);
          return changes ? { ...el, ...changes } : el;
        }),
      };
    });
  },

  deleteSelected: () => {
    const { selectedIds, elements } = get();
    if (selectedIds.length === 0) return;

    set({
      elements: elements.filter((el) => !selectedIds.includes(el.id)),
      selectedIds: [],
    });
    get().recordHistory();
  },

  duplicateSelected: () => {
    const { selectedIds, elements } = get();
    if (selectedIds.length === 0) return;

    const newElements: CanvasElement[] = [];
    const newSelectedIds: string[] = [];

    elements.forEach((el) => {
      if (selectedIds.includes(el.id)) {
        const newId = nanoid(8);
        const dup: CanvasElement = {
          ...JSON.parse(JSON.stringify(el)),
          id: newId,
          name: `${el.name} (Copy)`,
          x: el.x + 20,
          y: el.y + 20,
        };
        newElements.push(dup);
        newSelectedIds.push(newId);
      }
    });

    set((state) => ({
      elements: [...state.elements, ...newElements],
      selectedIds: newSelectedIds,
    }));
    get().recordHistory();
  },

  setSelectedIds: (ids) => set({ selectedIds: ids }),

  selectElement: (id, multi = false) => {
    set((state) => {
      if (multi) {
        return {
          selectedIds: state.selectedIds.includes(id)
            ? state.selectedIds.filter((item) => item !== id)
            : [...state.selectedIds, id],
        };
      }
      return { selectedIds: [id] };
    });
  },

  clearSelection: () => set({ selectedIds: [] }),
  setMarqueeBox: (marqueeBox) => set({ marqueeBox }),
  setHoveredId: (hoveredId) => set({ hoveredId }),
  setIsAltPressed: (isAltPressed) => set({ isAltPressed }),

  groupSelected: () => {
    const { elements, selectedIds } = get();
    if (selectedIds.length < 2) return;
    const selectedEls = elements.filter((el) => selectedIds.includes(el.id));
    const minX = Math.min(...selectedEls.map((e) => e.x));
    const minY = Math.min(...selectedEls.map((e) => e.y));
    const maxX = Math.max(...selectedEls.map((e) => e.x + e.width));
    const maxY = Math.max(...selectedEls.map((e) => e.y + e.height));
    const groupId = `group-${nanoid(6)}`;
    const newGroup: CanvasElement = {
      id: groupId,
      name: 'Group',
      type: 'group',
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      fill: 'transparent',
      fillOpacity: 1,
      stroke: 'transparent',
      strokeWidth: 0,
      strokeStyle: 'solid',
      strokeOpacity: 1,
      effects: [],
    };
    const updatedElements = elements.map((el) => {
      if (selectedIds.includes(el.id)) {
        return { ...el, parentId: groupId };
      }
      return el;
    });
    set({
      elements: [...updatedElements, newGroup],
      selectedIds: [groupId],
    });
    get().recordHistory();
  },

  ungroupSelected: () => {
    const { elements, selectedIds } = get();
    if (selectedIds.length === 0) return;
    const targetGroups = elements.filter(
      (e) => selectedIds.includes(e.id) && (e.type === 'group' || e.type === 'frame')
    );
    if (targetGroups.length === 0) return;
    const groupIds = targetGroups.map((g) => g.id);
    const newElements = elements
      .filter((e) => !groupIds.includes(e.id))
      .map((el) => {
        if (el.parentId && groupIds.includes(el.parentId)) {
          return { ...el, parentId: undefined };
        }
        return el;
      });
    set({ elements: newElements, selectedIds: [] });
    get().recordHistory();
  },

  frameSelection: () => {
    const { elements, selectedIds } = get();
    if (selectedIds.length === 0) return;
    const selectedEls = elements.filter((el) => selectedIds.includes(el.id));
    const minX = Math.min(...selectedEls.map((e) => e.x));
    const minY = Math.min(...selectedEls.map((e) => e.y));
    const maxX = Math.max(...selectedEls.map((e) => e.x + e.width));
    const maxY = Math.max(...selectedEls.map((e) => e.y + e.height));
    const frameId = `frame-${nanoid(6)}`;
    const newFrame: CanvasElement = {
      id: frameId,
      name: 'Frame',
      type: 'frame',
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      fill: '#18181b',
      fillOpacity: 1,
      stroke: '#334155',
      strokeWidth: 1,
      strokeStyle: 'solid',
      strokeOpacity: 1,
      cornerRadius: 8,
      effects: [],
      clipContent: true,
    };
    const updatedElements = elements.map((el) => {
      if (selectedIds.includes(el.id)) {
        return { ...el, parentId: frameId };
      }
      return el;
    });
    set({
      elements: [...updatedElements, newFrame],
      selectedIds: [frameId],
    });
    get().recordHistory();
  },

  createMasterComponent: (id) => {
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, isMasterComponent: true, name: `❖ ${el.name.replace('❖ ', '')}` } : el
      ),
    }));
    get().recordHistory();
  },

  createInstance: (masterId) => {
    const { elements } = get();
    const master = elements.find((e) => e.id === masterId);
    if (!master) return;
    const instanceId = nanoid(8);
    const instance: CanvasElement = {
      ...JSON.parse(JSON.stringify(master)),
      id: instanceId,
      name: `◇ ${master.name.replace('❖ ', '')} (Instance)`,
      x: master.x + 30,
      y: master.y + 30,
      isMasterComponent: false,
      masterComponentId: masterId,
      overrides: {},
    };
    set((state) => ({
      elements: [...state.elements, instance],
      selectedIds: [instanceId],
    }));
    get().recordHistory();
  },

  toggleAutoLayout: (frameId, mode) => {
    const { elements } = get();
    const frame = elements.find((e) => e.id === frameId);
    if (!frame) return;
    const children = elements.filter((e) => e.parentId === frameId);
    const updatedFrame: CanvasElement = {
      ...frame,
      layoutMode: mode,
      itemSpacing: frame.itemSpacing ?? 12,
      paddingTop: frame.paddingTop ?? 16,
      paddingRight: frame.paddingRight ?? 16,
      paddingBottom: frame.paddingBottom ?? 16,
      paddingLeft: frame.paddingLeft ?? 16,
      primaryAxisAlign: frame.primaryAxisAlign ?? 'start',
      counterAxisAlign: frame.counterAxisAlign ?? 'start',
      layoutSizingHorizontal: frame.layoutSizingHorizontal ?? 'hug',
      layoutSizingVertical: frame.layoutSizingVertical ?? 'hug',
    };
    const layoutRes = calculateAutoLayout(updatedFrame, children);
    const updatedChildrenMap = new Map(layoutRes.updatedChildren.map((c) => [c.id, c.changes]));
    set({
      elements: elements.map((el) => {
        if (el.id === frameId) {
          return { ...updatedFrame, ...(layoutRes.parentDimensionChanges || {}) };
        }
        if (updatedChildrenMap.has(el.id)) {
          return { ...el, ...updatedChildrenMap.get(el.id) };
        }
        return el;
      }),
    });
    get().recordHistory();
  },

  updateAutoLayoutProps: (frameId, props) => {
    const { elements } = get();
    const frame = elements.find((e) => e.id === frameId);
    if (!frame) return;
    const updatedFrame: CanvasElement = { ...frame, ...props };
    const children = elements.filter((e) => e.parentId === frameId);
    const layoutRes = calculateAutoLayout(updatedFrame, children);
    const updatedChildrenMap = new Map(layoutRes.updatedChildren.map((c) => [c.id, c.changes]));
    set({
      elements: elements.map((el) => {
        if (el.id === frameId) {
          return { ...updatedFrame, ...(layoutRes.parentDimensionChanges || {}) };
        }
        if (updatedChildrenMap.has(el.id)) {
          return { ...el, ...updatedChildrenMap.get(el.id) };
        }
        return el;
      }),
    });
  },

  addPrototypeInteraction: (sourceId, interaction) => {
    set((state) => ({
      elements: state.elements.map((el) => {
        if (el.id === sourceId) {
          const current = el.prototypeInteractions || [];
          return { ...el, prototypeInteractions: [...current, interaction] };
        }
        return el;
      }),
    }));
    get().recordHistory();
  },

  removePrototypeInteraction: (sourceId, interactionId) => {
    set((state) => ({
      elements: state.elements.map((el) => {
        if (el.id === sourceId) {
          const current = el.prototypeInteractions || [];
          return { ...el, prototypeInteractions: current.filter((i) => i.id !== interactionId) };
        }
        return el;
      }),
    }));
    get().recordHistory();
  },

  bringToFront: (id) => {
    set((state) => {
      const el = state.elements.find((e) => e.id === id);
      if (!el) return state;
      const rest = state.elements.filter((e) => e.id !== id);
      return { elements: [...rest, el] };
    });
    get().recordHistory();
  },

  sendToBack: (id) => {
    set((state) => {
      const el = state.elements.find((e) => e.id === id);
      if (!el) return state;
      const rest = state.elements.filter((e) => e.id !== id);
      return { elements: [el, ...rest] };
    });
    get().recordHistory();
  },

  bringForward: (id) => {
    set((state) => {
      const index = state.elements.findIndex((e) => e.id === id);
      if (index === -1 || index === state.elements.length - 1) return state;
      const copy = [...state.elements];
      const temp = copy[index];
      copy[index] = copy[index + 1];
      copy[index + 1] = temp;
      return { elements: copy };
    });
    get().recordHistory();
  },

  sendBackward: (id) => {
    set((state) => {
      const index = state.elements.findIndex((e) => e.id === id);
      if (index <= 0) return state;
      const copy = [...state.elements];
      const temp = copy[index];
      copy[index] = copy[index - 1];
      copy[index - 1] = temp;
      return { elements: copy };
    });
    get().recordHistory();
  },

  setActiveTool: (tool) => set({ activeTool: tool }),
  setPlatformMode: (mode) => set({ platformMode: mode }),
  toggleRulers: () => set((state) => ({ showRulers: !state.showRulers })),
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  toggleSnap: () => set((state) => ({ snapToGrid: !state.snapToGrid })),

  setZoom: (zoom) =>
    set((state) => ({
      zoom: Math.min(Math.max(typeof zoom === 'function' ? zoom(state.zoom) : zoom, 0.1), 5),
    })),

  setPanOffset: (panOffset) =>
    set((state) => ({
      panOffset: typeof panOffset === 'function' ? panOffset(state.panOffset) : panOffset,
    })),

  setIsPanning: (isPanning) => set({ isPanning }),

  zoomIn: () => set((state) => ({ zoom: Math.min(state.zoom * 1.25, 5) })),
  zoomOut: () => set((state) => ({ zoom: Math.max(state.zoom / 1.25, 0.1) })),
  resetZoom: () => set({ zoom: 1, panOffset: { x: 100, y: 100 } }),

  alignSelected: (alignment) => {
    const { elements, selectedIds } = get();
    if (selectedIds.length < 2) return;

    const selectedEls = elements.filter((el) => selectedIds.includes(el.id));
    let targetVal = 0;

    if (alignment === 'left') {
      targetVal = Math.min(...selectedEls.map((el) => el.x));
      set({
        elements: elements.map((el) => (selectedIds.includes(el.id) ? { ...el, x: targetVal } : el)),
      });
    } else if (alignment === 'right') {
      targetVal = Math.max(...selectedEls.map((el) => el.x + el.width));
      set({
        elements: elements.map((el) =>
          selectedIds.includes(el.id) ? { ...el, x: targetVal - el.width } : el
        ),
      });
    } else if (alignment === 'center') {
      const minX = Math.min(...selectedEls.map((el) => el.x));
      const maxX = Math.max(...selectedEls.map((el) => el.x + el.width));
      const centerX = minX + (maxX - minX) / 2;
      set({
        elements: elements.map((el) =>
          selectedIds.includes(el.id) ? { ...el, x: centerX - el.width / 2 } : el
        ),
      });
    } else if (alignment === 'top') {
      targetVal = Math.min(...selectedEls.map((el) => el.y));
      set({
        elements: elements.map((el) => (selectedIds.includes(el.id) ? { ...el, y: targetVal } : el)),
      });
    } else if (alignment === 'bottom') {
      targetVal = Math.max(...selectedEls.map((el) => el.y + el.height));
      set({
        elements: elements.map((el) =>
          selectedIds.includes(el.id) ? { ...el, y: targetVal - el.height } : el
        ),
      });
    } else if (alignment === 'middle') {
      const minY = Math.min(...selectedEls.map((el) => el.y));
      const maxY = Math.max(...selectedEls.map((el) => el.y + el.height));
      const centerY = minY + (maxY - minY) / 2;
      set({
        elements: elements.map((el) =>
          selectedIds.includes(el.id) ? { ...el, y: centerY - el.height / 2 } : el
        ),
      });
    }
    get().recordHistory();
  },

  distributeSelected: (axis) => {
    const { elements, selectedIds } = get();
    if (selectedIds.length < 3) return;

    const selectedEls = elements
      .filter((el) => selectedIds.includes(el.id))
      .sort((a, b) => (axis === 'horizontal' ? a.x - b.x : a.y - b.y));

    if (axis === 'horizontal') {
      const first = selectedEls[0];
      const last = selectedEls[selectedEls.length - 1];
      const totalWidths = selectedEls.reduce((sum, el) => sum + el.width, 0) - first.width - last.width;
      const totalSpace = last.x - (first.x + first.width);
      const gap = (totalSpace - totalWidths) / (selectedEls.length - 1);

      let currentX = first.x + first.width + gap;
      const newPos = new Map<string, number>();

      for (let i = 1; i < selectedEls.length - 1; i++) {
        newPos.set(selectedEls[i].id, currentX);
        currentX += selectedEls[i].width + gap;
      }

      set({
        elements: elements.map((el) => (newPos.has(el.id) ? { ...el, x: newPos.get(el.id)! } : el)),
      });
    }
    get().recordHistory();
  },

  setSmartGuides: (guides) => set({ smartGuides: guides }),

  recordHistory: () => {
    set((state) => {
      const currentHistory = state.history.slice(0, state.historyIndex + 1);
      return {
        history: [...currentHistory, JSON.parse(JSON.stringify(state.elements))],
        historyIndex: currentHistory.length,
      };
    });
  },

  undo: () => {
    set((state) => {
      if (state.historyIndex <= 0) return state;
      const newIndex = state.historyIndex - 1;
      return {
        elements: JSON.parse(JSON.stringify(state.history[newIndex])),
        historyIndex: newIndex,
      };
    });
  },

  redo: () => {
    set((state) => {
      if (state.historyIndex >= state.history.length - 1) return state;
      const newIndex = state.historyIndex + 1;
      return {
        elements: JSON.parse(JSON.stringify(state.history[newIndex])),
        historyIndex: newIndex,
      };
    });
  },

  addComment: (x, y, content, author, authorColor) => {
    const newComment: CanvasComment = {
      id: nanoid(6),
      x,
      y,
      content,
      author,
      authorColor,
      createdAt: Date.now(),
      resolved: false,
    };
    set((state) => ({
      comments: [...state.comments, newComment],
      activeCommentId: newComment.id,
      activeTool: 'select',
    }));
  },

  resolveComment: (id) => {
    set((state) => ({
      comments: state.comments.map((c) => (c.id === id ? { ...c, resolved: !c.resolved } : c)),
    }));
  },

  setActiveCommentId: (id) => set({ activeCommentId: id }),

  loadSampleProject: () => {
    set({
      elements: INITIAL_SAMPLE_ELEMENTS,
      history: [INITIAL_SAMPLE_ELEMENTS],
      historyIndex: 0,
      selectedIds: ['frame-1'],
    });
  },
}));
