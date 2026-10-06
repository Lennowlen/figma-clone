import React, { useState, useRef, useEffect } from 'react';
import { useCanvasStore } from '../../store/useCanvasStore';
import { FRAME_PRESETS } from '../../utils/presets';
import {
  MousePointer,
  Hand,
  Frame,
  Square,
  Circle,
  Star,
  Triangle,
  Minus,
  MoveRight,
  Pencil,
  Type,
  MessageSquare,
  Sparkles,
  ChevronDown,
  Smartphone,
  Tablet,
  Laptop,
  Watch,
  Share2,
} from 'lucide-react';

interface ToolbarProps {
  onOpenAiModal: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onOpenAiModal }) => {
  const { activeTool, setActiveTool, addElement, panOffset, zoom } = useCanvasStore();

  const [shapeMenuOpen, setShapeMenuOpen] = useState(false);
  const [frameMenuOpen, setFrameMenuOpen] = useState(false);

  const shapeMenuRef = useRef<HTMLDivElement>(null);
  const frameMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (shapeMenuRef.current && !shapeMenuRef.current.contains(e.target as Node)) {
        setShapeMenuOpen(false);
      }
      if (frameMenuRef.current && !frameMenuRef.current.contains(e.target as Node)) {
        setFrameMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isShapeActive = ['rectangle', 'ellipse', 'star', 'polygon', 'line', 'arrow'].includes(
    activeTool
  );

  const getShapeIcon = () => {
    switch (activeTool) {
      case 'ellipse':
        return <Circle className="h-4 w-4" />;
      case 'star':
        return <Star className="h-4 w-4" />;
      case 'polygon':
        return <Triangle className="h-4 w-4" />;
      case 'line':
        return <Minus className="h-4 w-4" />;
      case 'arrow':
        return <MoveRight className="h-4 w-4" />;
      default:
        return <Square className="h-4 w-4" />;
    }
  };

  const handleCreateFramePreset = (preset: typeof FRAME_PRESETS[0]) => {
    // Spawn frame near viewport center
    const x = Math.round((-panOffset.x + 300) / zoom);
    const y = Math.round((-panOffset.y + 150) / zoom);

    addElement({
      name: preset.name,
      type: 'frame',
      x,
      y,
      width: preset.width,
      height: preset.height,
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
      cornerRadius: preset.category === 'Phone' ? 40 : 12,
      effects: [{ x: 0, y: 16, blur: 32, spread: -8, color: 'rgba(0,0,0,0.5)', opacity: 0.5, type: 'drop-shadow' }],
      clipContent: true,
      presetName: preset.name,
    });

    setFrameMenuOpen(false);
    setActiveTool('select');
  };

  return (
    <div className="pointer-events-auto absolute bottom-5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 rounded-2xl figma-glass-dock px-2 py-1.5 shadow-[0_20px_45px_rgba(0,0,0,0.7)] ring-1 ring-white/10">
      {/* Select Tool */}
      <button
        onClick={() => setActiveTool('select')}
        className={`group relative flex h-8 w-8 items-center justify-center rounded-xl text-xs font-medium transition-all ${
          activeTool === 'select'
            ? 'bg-[#0d99ff] text-white shadow-md shadow-[#0d99ff]/35'
            : 'text-zinc-300 hover:bg-white/10 hover:text-white'
        }`}
        title="Move / Select (V)"
      >
        <MousePointer className="h-4 w-4" />
      </button>

      {/* Hand Pan Tool */}
      <button
        onClick={() => setActiveTool('hand')}
        className={`group relative flex h-8 w-8 items-center justify-center rounded-xl text-xs font-medium transition-all ${
          activeTool === 'hand'
            ? 'bg-[#0d99ff] text-white shadow-md shadow-[#0d99ff]/35'
            : 'text-zinc-300 hover:bg-white/10 hover:text-white'
        }`}
        title="Hand tool / Pan (H or Space)"
      >
        <Hand className="h-4 w-4" />
      </button>

      <div className="mx-1 h-4 w-[1px] bg-white/10" />

      {/* Frame Tool with Presets */}
      <div className="relative" ref={frameMenuRef}>
        <div className="flex items-center">
          <button
            onClick={() => setActiveTool('frame')}
            className={`flex h-8 items-center gap-1 rounded-l-xl px-2.5 text-xs font-medium transition-all ${
              activeTool === 'frame'
                ? 'bg-[#0d99ff] text-white shadow-sm'
                : 'text-zinc-300 hover:bg-white/10 hover:text-white'
            }`}
            title="Frame (F)"
          >
            <Frame className="h-4 w-4" />
          </button>
          <button
            onClick={() => setFrameMenuOpen(!frameMenuOpen)}
            className={`flex h-8 w-4.5 items-center justify-center rounded-r-xl border-l border-white/10 transition-all ${
              activeTool === 'frame'
                ? 'bg-[#0d99ff] text-white'
                : 'text-zinc-300 hover:bg-white/10 hover:text-white'
            }`}
            title="Frame Presets"
          >
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>

        {/* Frame Presets Dropdown */}
        {frameMenuOpen && (
          <div className="absolute bottom-11 left-0 z-50 w-72 rounded-2xl figma-glass-elevated p-2 shadow-2xl ring-1 ring-black/60 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-2.5 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider border-b border-white/5 mb-1.5 pb-1.5">
              <span>Frame Presets</span>
              <span className="figma-kbd">F</span>
            </div>
            <div className="max-h-80 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {['Phone', 'Tablet', 'Desktop', 'Watch', 'Social Media'].map((cat) => (
                <div key={cat} className="space-y-0.5">
                  <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                    {cat === 'Phone' && <Smartphone className="h-3 w-3" />}
                    {cat === 'Tablet' && <Tablet className="h-3 w-3" />}
                    {cat === 'Desktop' && <Laptop className="h-3 w-3" />}
                    {cat === 'Watch' && <Watch className="h-3 w-3" />}
                    {cat === 'Social Media' && <Share2 className="h-3 w-3" />}
                    <span>{cat}</span>
                  </div>
                  {FRAME_PRESETS.filter((p) => p.category === cat).map((p) => (
                    <button
                      key={p.name}
                      onClick={() => handleCreateFramePreset(p)}
                      className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 hover:bg-[#0d99ff] hover:text-white text-left transition-colors group"
                    >
                      <span className="truncate group-hover:font-medium">{p.name}</span>
                      <span className="text-[10px] font-mono text-zinc-400 group-hover:text-white/80">
                        {p.width} × {p.height}
                      </span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Shapes Dropdown Tool */}
      <div className="relative" ref={shapeMenuRef}>
        <div className="flex items-center">
          <button
            onClick={() => setActiveTool(isShapeActive ? activeTool : 'rectangle')}
            className={`flex h-8 items-center gap-1 rounded-l-xl px-2.5 text-xs font-medium transition-all ${
              isShapeActive
                ? 'bg-[#0d99ff] text-white shadow-sm'
                : 'text-zinc-300 hover:bg-white/10 hover:text-white'
            }`}
            title="Shapes (R)"
          >
            {getShapeIcon()}
          </button>
          <button
            onClick={() => setShapeMenuOpen(!shapeMenuOpen)}
            className={`flex h-8 w-4.5 items-center justify-center rounded-r-xl border-l border-white/10 transition-all ${
              isShapeActive
                ? 'bg-[#0d99ff] text-white'
                : 'text-zinc-300 hover:bg-white/10 hover:text-white'
            }`}
            title="More Shapes"
          >
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>

        {/* Shapes Menu */}
        {shapeMenuOpen && (
          <div className="absolute bottom-11 left-0 z-50 w-48 rounded-2xl figma-glass-elevated p-1.5 shadow-2xl ring-1 ring-black/60 text-xs animate-in fade-in zoom-in-95 duration-150">
            <div className="px-2 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider border-b border-white/5 mb-1">
              Shapes
            </div>
            <button
              onClick={() => {
                setActiveTool('rectangle');
                setShapeMenuOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-zinc-200 hover:bg-[#0d99ff] hover:text-white transition-colors ${
                activeTool === 'rectangle' ? 'bg-white/10 text-white font-medium' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <Square className="h-3.5 w-3.5" />
                <span>Rectangle</span>
              </div>
              <span className="figma-kbd">R</span>
            </button>
            <button
              onClick={() => {
                setActiveTool('ellipse');
                setShapeMenuOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-zinc-200 hover:bg-[#0d99ff] hover:text-white transition-colors ${
                activeTool === 'ellipse' ? 'bg-white/10 text-white font-medium' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <Circle className="h-3.5 w-3.5" />
                <span>Ellipse</span>
              </div>
              <span className="figma-kbd">O</span>
            </button>
            <button
              onClick={() => {
                setActiveTool('star');
                setShapeMenuOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-zinc-200 hover:bg-[#0d99ff] hover:text-white transition-colors ${
                activeTool === 'star' ? 'bg-white/10 text-white font-medium' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <Star className="h-3.5 w-3.5" />
                <span>Star</span>
              </div>
            </button>
            <button
              onClick={() => {
                setActiveTool('polygon');
                setShapeMenuOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-zinc-200 hover:bg-[#0d99ff] hover:text-white transition-colors ${
                activeTool === 'polygon' ? 'bg-white/10 text-white font-medium' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <Triangle className="h-3.5 w-3.5" />
                <span>Polygon</span>
              </div>
            </button>
            <div className="my-1 h-[1px] bg-white/5" />
            <button
              onClick={() => {
                setActiveTool('line');
                setShapeMenuOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-zinc-200 hover:bg-[#0d99ff] hover:text-white transition-colors ${
                activeTool === 'line' ? 'bg-white/10 text-white font-medium' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <Minus className="h-3.5 w-3.5" />
                <span>Line</span>
              </div>
              <span className="figma-kbd">L</span>
            </button>
            <button
              onClick={() => {
                setActiveTool('arrow');
                setShapeMenuOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-zinc-200 hover:bg-[#0d99ff] hover:text-white transition-colors ${
                activeTool === 'arrow' ? 'bg-white/10 text-white font-medium' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <MoveRight className="h-3.5 w-3.5" />
                <span>Arrow</span>
              </div>
              <span className="figma-kbd">⇧L</span>
            </button>
          </div>
        )}
      </div>

      {/* Pencil Tool */}
      <button
        onClick={() => setActiveTool('pencil')}
        className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-medium transition-all ${
          activeTool === 'pencil'
            ? 'bg-[#0d99ff] text-white shadow-md shadow-[#0d99ff]/35'
            : 'text-zinc-300 hover:bg-white/10 hover:text-white'
        }`}
        title="Pencil Freehand (P)"
      >
        <Pencil className="h-4 w-4" />
      </button>

      {/* Text Tool */}
      <button
        onClick={() => setActiveTool('text')}
        className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-medium transition-all ${
          activeTool === 'text'
            ? 'bg-[#0d99ff] text-white shadow-md shadow-[#0d99ff]/35'
            : 'text-zinc-300 hover:bg-white/10 hover:text-white'
        }`}
        title="Text (T)"
      >
        <Type className="h-4 w-4" />
      </button>

      <div className="mx-1 h-4 w-[1px] bg-white/10" />

      {/* Comments Tool */}
      <button
        onClick={() => setActiveTool('comment')}
        className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-medium transition-all ${
          activeTool === 'comment'
            ? 'bg-[#0d99ff] text-white shadow-md shadow-[#0d99ff]/35'
            : 'text-zinc-300 hover:bg-white/10 hover:text-white'
        }`}
        title="Comment (C)"
      >
        <MessageSquare className="h-4 w-4" />
      </button>

      {/* AI Assistant Tool */}
      <button
        onClick={onOpenAiModal}
        className="flex h-8 items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-500/25 via-indigo-500/25 to-blue-500/25 border border-purple-500/35 px-3 text-xs font-semibold text-purple-200 hover:from-purple-500 hover:to-indigo-600 hover:text-white transition-all shadow-md shadow-purple-500/20 active:scale-95 ml-1"
        title="Generate UI with AI (Ctrl+K)"
      >
        <Sparkles className="h-3.5 w-3.5 text-purple-300 group-hover:text-white" />
        <span>AI Builder</span>
        <span className="ml-1 figma-kbd text-[9px] bg-purple-950/60 border-purple-400/30 text-purple-200">⌘K</span>
      </button>
    </div>
  );
};
