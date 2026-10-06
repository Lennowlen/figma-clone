import React, { useState } from 'react';
import { useCanvasStore } from '../../store/useCanvasStore';
import type { CanvasElement } from '../../types/canvas';
import {
  Layers,
  Component,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  Frame,
  Square,
  Circle,
  Star,
  Triangle,
  Minus,
  MoveRight,
  Type,
  Pencil,
  Image,
  ArrowUp,
  ArrowDown,
  Plus,
  Search,
  CheckCircle2,
  FileText,
  Sliders,
  FolderClosed,
} from 'lucide-react';

export const LeftSidebar: React.FC = () => {
  const {
    elements,
    selectedIds,
    selectElement,
    updateElement,
    deleteSelected,
    bringForward,
    sendBackward,
    addElement,
    createInstance,
    designTokens,
    panOffset,
    zoom,
  } = useCanvasStore();

  const [activeTab, setActiveTab] = useState<'layers' | 'assets' | 'pages'>('layers');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingLayerId, setEditingLayerId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [activePage, setActivePage] = useState('Page 1');

  const pages = ['Page 1', 'Design System', 'Mobile Wireframes'];

  const getElementIcon = (el: CanvasElement) => {
    if (el.isMasterComponent) {
      return <span className="text-purple-400 font-bold text-xs" title="Master Component">❖</span>;
    }
    if (el.masterComponentId) {
      return <span className="text-indigo-400 font-bold text-xs" title="Component Instance">◇</span>;
    }
    if (el.type === 'group') {
      return (
        <span title="Group">
          <FolderClosed className="h-3.5 w-3.5 text-amber-400" />
        </span>
      );
    }
    switch (el.type) {
      case 'frame':
        return <Frame className="h-3.5 w-3.5 text-purple-400" />;
      case 'rectangle':
        return <Square className="h-3.5 w-3.5 text-blue-400" />;
      case 'ellipse':
        return <Circle className="h-3.5 w-3.5 text-emerald-400" />;
      case 'star':
        return <Star className="h-3.5 w-3.5 text-amber-400" />;
      case 'polygon':
        return <Triangle className="h-3.5 w-3.5 text-pink-400" />;
      case 'line':
        return <Minus className="h-3.5 w-3.5 text-zinc-400" />;
      case 'arrow':
        return <MoveRight className="h-3.5 w-3.5 text-cyan-400" />;
      case 'pencil':
        return <Pencil className="h-3.5 w-3.5 text-rose-400" />;
      case 'text':
        return <Type className="h-3.5 w-3.5 text-zinc-200" />;
      case 'image':
        return <Image className="h-3.5 w-3.5 text-indigo-400" />;
      default:
        return <Square className="h-3.5 w-3.5 text-zinc-400" />;
    }
  };

  const handleStartRename = (el: CanvasElement) => {
    setEditingLayerId(el.id);
    setEditingName(el.name);
  };

  const handleFinishRename = (id: string) => {
    if (editingName.trim()) {
      updateElement(id, { name: editingName.trim() });
    }
    setEditingLayerId(null);
  };

  // Pre-made Component Library Items
  const COMPONENT_PRESETS = [
    {
      name: 'Primary Button',
      category: 'Buttons',
      create: () => {
        const x = Math.round((-panOffset.x + 350) / zoom);
        const y = Math.round((-panOffset.y + 200) / zoom);
        addElement({
          name: 'Primary Button',
          type: 'rectangle',
          x,
          y,
          width: 160,
          height: 48,
          rotation: 0,
          opacity: 1,
          visible: true,
          locked: false,
          fill: '#3b82f6',
          fillOpacity: 1,
          stroke: '#60a5fa',
          strokeWidth: 1,
          strokeStyle: 'solid',
          strokeOpacity: 1,
          cornerRadius: 10,
          effects: [{ x: 0, y: 4, blur: 12, spread: 0, color: 'rgba(59, 130, 246, 0.4)', opacity: 0.4, type: 'drop-shadow' }],
        });
        addElement({
          name: 'Button Text',
          type: 'text',
          x: x + 20,
          y: y + 14,
          width: 120,
          height: 20,
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
          text: 'Get Started',
          fontSize: 15,
          fontWeight: '600',
          textAlign: 'center',
        });
      },
    },
    {
      name: 'Glassmorphism Card',
      category: 'Cards',
      create: () => {
        const x = Math.round((-panOffset.x + 350) / zoom);
        const y = Math.round((-panOffset.y + 200) / zoom);
        addElement({
          name: 'Glass Card',
          type: 'rectangle',
          x,
          y,
          width: 280,
          height: 160,
          rotation: 0,
          opacity: 1,
          visible: true,
          locked: false,
          fill: '#1e1e24',
          fillOpacity: 0.8,
          stroke: '#3f3f46',
          strokeWidth: 1,
          strokeStyle: 'solid',
          strokeOpacity: 0.8,
          cornerRadius: 16,
          effects: [{ x: 0, y: 16, blur: 32, spread: -4, color: 'rgba(0,0,0,0.5)', opacity: 0.5, type: 'drop-shadow' }],
        });
        addElement({
          name: 'Card Title',
          type: 'text',
          x: x + 20,
          y: y + 24,
          width: 240,
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
          text: 'Total Balance',
          fontSize: 18,
          fontWeight: '700',
        });
        addElement({
          name: 'Card Amount',
          type: 'text',
          x: x + 20,
          y: y + 60,
          width: 240,
          height: 36,
          rotation: 0,
          opacity: 1,
          visible: true,
          locked: false,
          fill: '#34d399',
          fillOpacity: 1,
          stroke: 'transparent',
          strokeWidth: 0,
          strokeStyle: 'solid',
          strokeOpacity: 1,
          effects: [],
          text: '$128,450.00',
          fontSize: 26,
          fontWeight: '800',
        });
      },
    },
    {
      name: 'Search Input Field',
      category: 'Inputs',
      create: () => {
        const x = Math.round((-panOffset.x + 350) / zoom);
        const y = Math.round((-panOffset.y + 200) / zoom);
        addElement({
          name: 'Search Container',
          type: 'rectangle',
          x,
          y,
          width: 240,
          height: 40,
          rotation: 0,
          opacity: 1,
          visible: true,
          locked: false,
          fill: '#27272a',
          fillOpacity: 1,
          stroke: '#3f3f46',
          strokeWidth: 1,
          strokeStyle: 'solid',
          strokeOpacity: 1,
          cornerRadius: 8,
          effects: [],
        });
        addElement({
          name: 'Search Placeholder',
          type: 'text',
          x: x + 16,
          y: y + 10,
          width: 200,
          height: 20,
          rotation: 0,
          opacity: 0.6,
          visible: true,
          locked: false,
          fill: '#a1a1aa',
          fillOpacity: 1,
          stroke: 'transparent',
          strokeWidth: 0,
          strokeStyle: 'solid',
          strokeOpacity: 1,
          effects: [],
          text: '🔍 Search anything...',
          fontSize: 13,
          fontWeight: '400',
        });
      },
    },
    {
      name: 'Status Badge (Live)',
      category: 'Badges',
      create: () => {
        const x = Math.round((-panOffset.x + 350) / zoom);
        const y = Math.round((-panOffset.y + 200) / zoom);
        addElement({
          name: 'Badge Pill',
          type: 'rectangle',
          x,
          y,
          width: 90,
          height: 28,
          rotation: 0,
          opacity: 1,
          visible: true,
          locked: false,
          fill: '#064e3b',
          fillOpacity: 0.8,
          stroke: '#059669',
          strokeWidth: 1,
          strokeStyle: 'solid',
          strokeOpacity: 1,
          cornerRadius: 14,
          effects: [],
        });
        addElement({
          name: 'Badge Text',
          type: 'text',
          x: x + 8,
          y: y + 5,
          width: 74,
          height: 18,
          rotation: 0,
          opacity: 1,
          visible: true,
          locked: false,
          fill: '#34d399',
          fillOpacity: 1,
          stroke: 'transparent',
          strokeWidth: 0,
          strokeStyle: 'solid',
          strokeOpacity: 1,
          effects: [],
          text: '● Live Now',
          fontSize: 11,
          fontWeight: '600',
          textAlign: 'center',
        });
      },
    },
  ];

  const filteredElements = [...elements].reverse().filter((el) =>
    el.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="relative flex h-full w-64 flex-col border-r border-[#282830] bg-[#18181c] text-xs text-[#f4f4f6] select-none z-30 font-sans">
      {/* Sidebar Tabs (UI3 Style) */}
      <div className="flex h-10 items-center border-b border-[#282830] px-1.5 bg-[#141418]">
        <button
          onClick={() => setActiveTab('layers')}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1 text-xs font-medium transition-all ${
            activeTab === 'layers'
              ? 'bg-[#272730] text-white shadow-sm ring-1 ring-white/5'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Layers className="h-3.5 w-3.5 text-blue-400" />
          <span>Layers</span>
        </button>

        <button
          onClick={() => setActiveTab('assets')}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1 text-xs font-medium transition-all ${
            activeTab === 'assets'
              ? 'bg-[#272730] text-white shadow-sm ring-1 ring-white/5'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Component className="h-3.5 w-3.5 text-purple-400" />
          <span>Assets</span>
        </button>

        <button
          onClick={() => setActiveTab('pages')}
          className={`flex items-center justify-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
            activeTab === 'pages'
              ? 'bg-[#272730] text-white shadow-sm ring-1 ring-white/5'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
          title="Pages & Design Tokens"
        >
          <FileText className="h-3.5 w-3.5 text-emerald-400" />
          <span>Pages</span>
        </button>
      </div>

      {/* Tab 1: Layers */}
      {activeTab === 'layers' && (
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Search bar & Quick Hierarchy Actions */}
          <div className="flex items-center gap-1.5 border-b border-[#282830] p-2 bg-[#18181c]">
            <div className="flex flex-1 items-center gap-1.5 rounded-md bg-[#202026] px-2 py-1 text-xs text-zinc-300 border border-[#2f2f38] focus-within:border-[#0d99ff] transition-all">
              <Search className="h-3 w-3 text-zinc-500 shrink-0" />
              <input
                type="text"
                placeholder="Filter layers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent outline-none placeholder-zinc-500 text-[11px] text-zinc-100"
              />
            </div>
            {selectedIds.length > 0 && (
              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  onClick={() => bringForward(selectedIds[0])}
                  className="rounded p-1 text-zinc-400 hover:bg-[#272730] hover:text-white transition-colors"
                  title="Bring Forward"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => sendBackward(selectedIds[0])}
                  className="rounded p-1 text-zinc-400 hover:bg-[#272730] hover:text-white transition-colors"
                  title="Send Backward"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={deleteSelected}
                  className="rounded p-1 text-rose-400 hover:bg-rose-500/20 transition-colors"
                  title="Delete Selected"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Layer List */}
          <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5 custom-scrollbar">
            {filteredElements.length === 0 ? (
              <div className="py-12 text-center text-xs text-zinc-500">
                {searchQuery ? 'No layers match search query' : 'No layers on canvas'}
              </div>
            ) : (
              filteredElements.map((el) => {
                const isSelected = selectedIds.includes(el.id);
                const isChild = !!el.parentId;

                return (
                  <div
                    key={el.id}
                    onClick={(e) => selectElement(el.id, e.shiftKey)}
                    onDoubleClick={() => handleStartRename(el)}
                    className={`group flex items-center justify-between rounded-md px-2 py-1.5 text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0d99ff] text-white font-medium shadow-sm'
                        : 'text-zinc-300 hover:bg-[#24242c]'
                    } ${isChild ? 'ml-3.5 border-l border-zinc-700/50 pl-2' : ''}`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="shrink-0">{getElementIcon(el)}</span>

                      {editingLayerId === el.id ? (
                        <input
                          type="text"
                          autoFocus
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onBlur={() => handleFinishRename(el.id)}
                          onKeyDown={(e) => e.key === 'Enter' && handleFinishRename(el.id)}
                          className="h-5 w-28 rounded bg-[#111] px-1 text-xs text-white outline-none border border-blue-400"
                        />
                      ) : (
                        <span className="truncate text-[11px] select-none">{el.name}</span>
                      )}
                    </div>

                    {/* Quick Visibility & Lock Controls */}
                    <div
                      className={`flex items-center gap-1 shrink-0 ${
                        isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => updateElement(el.id, { visible: !el.visible })}
                        className="p-1 rounded hover:bg-black/20 text-inherit transition-colors"
                        title={el.visible ? 'Hide Layer' : 'Show Layer'}
                      >
                        {el.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3 text-zinc-500" />}
                      </button>

                      <button
                        onClick={() => updateElement(el.id, { locked: !el.locked })}
                        className="p-1 rounded hover:bg-black/20 text-inherit transition-colors"
                        title={el.locked ? 'Unlock Layer' : 'Lock Layer'}
                      >
                        {el.locked ? <Lock className="h-3 w-3 text-amber-400" /> : <Unlock className="h-3 w-3" />}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Assets / Components */}
      {activeTab === 'assets' && (
        <div className="flex flex-1 flex-col overflow-y-auto p-3 space-y-4 custom-scrollbar">
          {/* User Master Components */}
          {elements.some((e) => e.isMasterComponent) && (
            <div className="space-y-2 border-b border-[#282830] pb-3">
              <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1">
                <span>❖</span>
                <span>Document Master Components</span>
              </div>
              <div className="space-y-1.5">
                {elements
                  .filter((e) => e.isMasterComponent)
                  .map((master) => (
                    <div
                      key={master.id}
                      onClick={() => createInstance(master.id)}
                      className="flex items-center justify-between rounded-xl border border-purple-500/30 bg-purple-950/20 p-2.5 hover:bg-purple-900/30 cursor-pointer transition-all shadow-sm"
                    >
                      <div className="truncate">
                        <div className="font-semibold text-white text-xs truncate">{master.name}</div>
                        <div className="text-[10px] text-purple-300">Click to place instance (◇)</div>
                      </div>
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-500/20 text-purple-300">
                        <Plus className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            UI Library Presets
          </div>

          <div className="grid grid-cols-1 gap-2">
            {COMPONENT_PRESETS.map((comp) => (
              <div
                key={comp.name}
                onClick={comp.create}
                className="group flex items-center justify-between rounded-xl border border-[#2f2f38] bg-[#202026] p-2.5 transition-all hover:border-[#0d99ff] hover:bg-[#262630] cursor-pointer shadow-sm"
              >
                <div>
                  <div className="font-semibold text-white text-xs group-hover:text-[#0d99ff] transition-colors">{comp.name}</div>
                  <div className="text-[10px] text-zinc-400">{comp.category}</div>
                </div>
                <button className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#0d99ff]/15 text-[#0d99ff] group-hover:bg-[#0d99ff] group-hover:text-white transition-all">
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Pages & Design Tokens */}
      {activeTab === 'pages' && (
        <div className="flex flex-1 flex-col p-3 space-y-4 overflow-y-auto custom-scrollbar">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between pb-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              <span>Canvas Pages</span>
              <button className="rounded p-1 hover:bg-[#272730] text-zinc-300 transition-colors">
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            {pages.map((p) => (
              <div
                key={p}
                onClick={() => setActivePage(p)}
                className={`flex items-center justify-between rounded-lg px-2.5 py-2 text-xs cursor-pointer transition-all ${
                  activePage === p ? 'bg-[#0d99ff] text-white font-semibold shadow-sm' : 'text-zinc-300 hover:bg-[#24242c]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 opacity-80" />
                  <span>{p}</span>
                </div>
                {activePage === p && <CheckCircle2 className="h-3.5 w-3.5" />}
              </div>
            ))}
          </div>

          {/* Design Tokens / Variables */}
          <div className="border-t border-[#282830] pt-3 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Sliders className="h-3.5 w-3.5 text-indigo-400" />
                <span>Design Tokens</span>
              </span>
            </div>
            <div className="space-y-1.5">
              {designTokens.map((tok) => (
                <div
                  key={tok.id}
                  className="flex items-center justify-between rounded-lg bg-[#202026] px-2.5 py-2 text-[11px] border border-[#2f2f38]"
                >
                  <div className="flex items-center gap-2 truncate">
                    <div
                      className="h-3.5 w-3.5 rounded-md border border-white/20 shrink-0 shadow-sm"
                      style={{ backgroundColor: String(tok.value) }}
                    />
                    <span className="text-zinc-200 font-medium truncate">{tok.name}</span>
                  </div>
                  <span className="font-mono text-[10px] text-zinc-400">{String(tok.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
