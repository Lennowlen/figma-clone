import React, { useState } from 'react';
import { nanoid } from 'nanoid';
import { useCanvasStore } from '../../store/useCanvasStore';
import { generateCSS, generateTailwind, generateReactCode } from '../../utils/codeGen';
import { exportElementAsPng, exportElementAsSvg } from '../../utils/export';
import { downloadPureVectorSvg } from '../../utils/vectorExport';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignVerticalSpaceAround,
  AlignHorizontalSpaceAround,
  Copy,
  Check,
  Download,
  Plus,
  Trash2,
  Code2,
  Box,
  LayoutGrid,
  Link,
  Sparkles,
  Type,
  Eye,
  EyeOff,
  Zap,
} from 'lucide-react';

interface RightSidebarProps {
  devMode: boolean;
  setDevMode: (dev: boolean) => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({ devMode, setDevMode }) => {
  const {
    elements,
    selectedIds,
    updateElement,
    alignSelected,
    distributeSelected,
    toggleAutoLayout,
    updateAutoLayoutProps,
    createMasterComponent,
    createInstance,
    addPrototypeInteraction,
    removePrototypeInteraction,
  } = useCanvasStore();

  const [activeTab, setActiveTab] = useState<'design' | 'dev' | 'prototype'>(
    devMode ? 'dev' : 'design'
  );
  const [codeFormat, setCodeFormat] = useState<'tailwind' | 'css' | 'react'>('tailwind');
  const [copiedCode, setCopiedCode] = useState(false);

  // Prototype state
  const [protoTrigger, setProtoTrigger] = useState<'onClick' | 'onHover' | 'onDrag'>('onClick');
  const [protoTarget, setProtoTarget] = useState<string>('');
  const [protoTransition, setProtoTransition] = useState<
    'smart-animate' | 'instant' | 'dissolve' | 'slide-in'
  >('smart-animate');

  // Sync tab with topnav dev mode toggle
  React.useEffect(() => {
    setActiveTab(devMode ? 'dev' : 'design');
  }, [devMode]);

  const selectedEl = elements.find((e) => selectedIds.includes(e.id));
  const availableFrames = elements.filter((e) => e.type === 'frame' && e.id !== selectedEl?.id);

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleExportPng = () => {
    if (!selectedEl) return;
    const domNode = document.getElementById(`el-${selectedEl.id}`);
    if (domNode) {
      exportElementAsPng(domNode, `${selectedEl.name.toLowerCase().replace(/\s+/g, '-')}.png`);
    }
  };

  const handleExportSvg = () => {
    if (!selectedEl) return;
    const domNode = document.getElementById(`el-${selectedEl.id}`);
    if (domNode) {
      exportElementAsSvg(domNode, `${selectedEl.name.toLowerCase().replace(/\s+/g, '-')}.svg`);
    }
  };

  const handleExportPureVector = () => {
    if (!selectedEl) return;
    downloadPureVectorSvg(
      selectedEl,
      elements,
      `${selectedEl.name.toLowerCase().replace(/\s+/g, '-')}-pure.svg`
    );
  };

  const handleAddInteraction = () => {
    if (!selectedEl || !protoTarget) return;
    addPrototypeInteraction(selectedEl.id, {
      id: nanoid(6),
      trigger: protoTrigger,
      targetFrameId: protoTarget,
      transition: protoTransition,
      durationMs: 300,
    });
  };

  const getActiveCode = () => {
    if (!selectedEl) return '// Select an element on the canvas to inspect its code.';
    if (codeFormat === 'tailwind') return generateTailwind(selectedEl);
    if (codeFormat === 'css') return generateCSS(selectedEl);
    return generateReactCode(selectedEl);
  };

  return (
    <aside className="relative flex h-full w-64 flex-col border-l border-[#282830] bg-[#16161a] text-xs text-[#f4f4f6] select-none z-30 font-sans shadow-[-4px_0_16px_rgba(0,0,0,0.25)]">
      {/* Top Segmented Tabs (UI3 Style) */}
      <div className="flex h-10 items-center border-b border-[#282830] px-2 bg-[#121215]">
        <div className="flex w-full rounded-lg bg-[#1c1c22] p-0.5 border border-[#2b2b36]">
          <button
            onClick={() => {
              setActiveTab('design');
              setDevMode(false);
            }}
            className={`flex flex-1 items-center justify-center rounded-md py-1 text-[11px] font-medium transition-all ${
              activeTab === 'design'
                ? 'bg-[#2b2b36] text-white shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Design
          </button>

          <button
            onClick={() => {
              setActiveTab('prototype');
              setDevMode(false);
            }}
            className={`flex flex-1 items-center justify-center rounded-md py-1 text-[11px] font-medium transition-all ${
              activeTab === 'prototype'
                ? 'bg-[#2b2b36] text-white shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Prototype
          </button>

          <button
            onClick={() => {
              setActiveTab('dev');
              setDevMode(true);
            }}
            className={`flex flex-1 items-center justify-center gap-1 rounded-md py-1 text-[11px] font-medium transition-all ${
              activeTab === 'dev'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Code2 className="h-3 w-3" />
            <span>Inspect</span>
          </button>
        </div>
      </div>

      {/* Main Inspector Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
        {/* Alignment Matrix Toolbar (When 1 or more items selected) */}
        {selectedIds.length > 0 && (
          <div className="rounded-xl bg-[#1c1c22] p-1.5 border border-[#2b2b36] shadow-sm">
            <div className="flex items-center justify-between">
              <button
                onClick={() => alignSelected('left')}
                className="figma-btn-icon"
                title="Align Left (Alt+A)"
              >
                <AlignLeft className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => alignSelected('center')}
                className="figma-btn-icon"
                title="Align Horizontal Centers (Alt+H)"
              >
                <AlignCenter className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => alignSelected('right')}
                className="figma-btn-icon"
                title="Align Right (Alt+D)"
              >
                <AlignRight className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => alignSelected('top')}
                className="figma-btn-icon"
                title="Align Top (Alt+W)"
              >
                <AlignLeft className="h-3.5 w-3.5 rotate-90" />
              </button>
              <button
                onClick={() => alignSelected('middle')}
                className="figma-btn-icon"
                title="Align Vertical Centers (Alt+V)"
              >
                <AlignCenter className="h-3.5 w-3.5 rotate-90" />
              </button>
              <button
                onClick={() => alignSelected('bottom')}
                className="figma-btn-icon"
                title="Align Bottom (Alt+S)"
              >
                <AlignRight className="h-3.5 w-3.5 rotate-90" />
              </button>
              <button
                onClick={() => distributeSelected('horizontal')}
                className="figma-btn-icon"
                title="Distribute Horizontal Spacing"
              >
                <AlignHorizontalSpaceAround className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => distributeSelected('vertical')}
                className="figma-btn-icon"
                title="Distribute Vertical Spacing"
              >
                <AlignVerticalSpaceAround className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 1: Design Inspector Panel */}
        {activeTab === 'design' && (
          <>
            {!selectedEl ? (
              <div className="py-16 text-center text-zinc-500">
                <Box className="mx-auto mb-2 h-7 w-7 text-zinc-600" />
                <p className="font-semibold text-xs text-zinc-300">No selection</p>
                <p className="text-[11px] text-zinc-500 mt-1 max-w-[200px] mx-auto leading-relaxed">
                  Select a frame, vector layer, or text element to inspect design properties.
                </p>
              </div>
            ) : (
              <>
                {/* Element Header & Layer Name */}
                <div className="flex items-center justify-between pb-1 border-b border-[#282830]">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-zinc-400 text-xs">{selectedEl.type}</span>
                    <span className="text-zinc-600">/</span>
                    <span className="font-semibold text-zinc-200 truncate text-xs">
                      {selectedEl.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateElement(selectedEl.id, { visible: !selectedEl.visible })}
                      className="figma-btn-icon h-5 w-5 text-zinc-400 hover:text-white"
                      title={selectedEl.visible ? 'Hide Layer' : 'Show Layer'}
                    >
                      {selectedEl.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    </button>
                  </div>
                </div>

                {/* Transform Geometry Coordinates */}
                <div className="space-y-2 border-b border-[#282830] pb-3.5">
                  <div className="figma-section-title flex items-center justify-between">
                    <span>Position & Dimensions</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="flex items-center rounded-lg bg-[#202026] px-2 py-1 text-xs border border-[#2f2f38] focus-within:border-[#0d99ff] focus-within:ring-1 focus-within:ring-[#0d99ff]/30 transition-all">
                      <span className="w-4 text-zinc-500 text-[10px] font-semibold">X</span>
                      <input
                        type="number"
                        value={Math.round(selectedEl.x)}
                        onChange={(e) =>
                          updateElement(selectedEl.id, { x: Number(e.target.value) })
                        }
                        className="w-full bg-transparent text-right text-zinc-100 outline-none font-mono text-[11px]"
                      />
                    </div>
                    <div className="flex items-center rounded-lg bg-[#202026] px-2 py-1 text-xs border border-[#2f2f38] focus-within:border-[#0d99ff] focus-within:ring-1 focus-within:ring-[#0d99ff]/30 transition-all">
                      <span className="w-4 text-zinc-500 text-[10px] font-semibold">Y</span>
                      <input
                        type="number"
                        value={Math.round(selectedEl.y)}
                        onChange={(e) =>
                          updateElement(selectedEl.id, { y: Number(e.target.value) })
                        }
                        className="w-full bg-transparent text-right text-zinc-100 outline-none font-mono text-[11px]"
                      />
                    </div>
                    <div className="flex items-center rounded-lg bg-[#202026] px-2 py-1 text-xs border border-[#2f2f38] focus-within:border-[#0d99ff] focus-within:ring-1 focus-within:ring-[#0d99ff]/30 transition-all">
                      <span className="w-4 text-zinc-500 text-[10px] font-semibold">W</span>
                      <input
                        type="number"
                        value={Math.round(selectedEl.width)}
                        onChange={(e) =>
                          updateElement(selectedEl.id, {
                            width: Math.max(1, Number(e.target.value)),
                          })
                        }
                        className="w-full bg-transparent text-right text-zinc-100 outline-none font-mono text-[11px]"
                      />
                    </div>
                    <div className="flex items-center rounded-lg bg-[#202026] px-2 py-1 text-xs border border-[#2f2f38] focus-within:border-[#0d99ff] focus-within:ring-1 focus-within:ring-[#0d99ff]/30 transition-all">
                      <span className="w-4 text-zinc-500 text-[10px] font-semibold">H</span>
                      <input
                        type="number"
                        value={Math.round(selectedEl.height)}
                        onChange={(e) =>
                          updateElement(selectedEl.id, {
                            height: Math.max(1, Number(e.target.value)),
                          })
                        }
                        className="w-full bg-transparent text-right text-zinc-100 outline-none font-mono text-[11px]"
                      />
                    </div>
                    <div className="flex items-center rounded-lg bg-[#202026] px-2 py-1 text-xs border border-[#2f2f38] focus-within:border-[#0d99ff] focus-within:ring-1 focus-within:ring-[#0d99ff]/30 transition-all">
                      <span className="w-4 text-zinc-500 text-[10px] font-semibold">∠</span>
                      <input
                        type="number"
                        value={selectedEl.rotation || 0}
                        onChange={(e) =>
                          updateElement(selectedEl.id, { rotation: Number(e.target.value) })
                        }
                        className="w-full bg-transparent text-right text-zinc-100 outline-none font-mono text-[11px]"
                      />
                    </div>
                    <div className="flex items-center rounded-lg bg-[#202026] px-2 py-1 text-xs border border-[#2f2f38] focus-within:border-[#0d99ff] focus-within:ring-1 focus-within:ring-[#0d99ff]/30 transition-all">
                      <span className="w-4 text-zinc-500 text-[10px] font-semibold">⌜</span>
                      <input
                        type="number"
                        value={selectedEl.cornerRadius || 0}
                        onChange={(e) =>
                          updateElement(selectedEl.id, {
                            cornerRadius: Math.max(0, Number(e.target.value)),
                          })
                        }
                        className="w-full bg-transparent text-right text-zinc-100 outline-none font-mono text-[11px]"
                      />
                    </div>
                  </div>
                </div>

                {/* Component System Card */}
                <div className="border-b border-[#282830] pb-3.5">
                  {selectedEl.isMasterComponent ? (
                    <div className="flex items-center justify-between rounded-xl bg-purple-950/40 border border-purple-500/40 p-2.5">
                      <div className="flex items-center gap-1.5 text-purple-300 font-semibold text-xs">
                        <span className="text-purple-400 font-bold">❖</span>
                        <span>Master Component</span>
                      </div>
                      <button
                        onClick={() => createInstance(selectedEl.id)}
                        className="rounded-lg bg-purple-600 px-2.5 py-1 text-[10px] font-semibold text-white hover:bg-purple-500 transition-colors shadow-sm"
                      >
                        + Instance
                      </button>
                    </div>
                  ) : selectedEl.masterComponentId ? (
                    <div className="flex items-center justify-between rounded-xl bg-indigo-950/40 border border-indigo-500/40 p-2.5 text-indigo-300 text-xs">
                      <div className="flex items-center gap-1.5 font-semibold">
                        <span className="text-indigo-400 font-bold">◇</span>
                        <span>Component Instance</span>
                      </div>
                      <span className="text-[10px] text-indigo-400 bg-indigo-500/20 px-2 py-0.5 rounded-md">
                        Synced
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={() => createMasterComponent(selectedEl.id)}
                      className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-purple-500/30 bg-[#202028] py-2 text-xs font-semibold text-purple-300 hover:bg-purple-950/40 hover:border-purple-500/60 transition-all shadow-sm group"
                    >
                      <span className="text-purple-400 group-hover:scale-110 transition-transform">❖</span>
                      <span>Create Component</span>
                      <span className="figma-kbd ml-1">Ctrl+Alt+K</span>
                    </button>
                  )}
                </div>

                {/* Auto Layout Engine (Frames & Groups) */}
                {(selectedEl.type === 'frame' || selectedEl.type === 'group') && (
                  <div className="space-y-2.5 border-b border-[#282830] pb-3.5">
                    <div className="flex items-center justify-between">
                      <span className="figma-section-title flex items-center gap-1.5">
                        <LayoutGrid className="h-3 w-3 text-[#0d99ff]" />
                        <span>Auto Layout</span>
                      </span>
                      <button
                        onClick={() =>
                          toggleAutoLayout(
                            selectedEl.id,
                            selectedEl.layoutMode === 'horizontal'
                              ? 'vertical'
                              : selectedEl.layoutMode === 'vertical'
                              ? 'none'
                              : 'horizontal'
                          )
                        }
                        className={`rounded-lg px-2.5 py-1 text-[10px] font-semibold transition-all ${
                          selectedEl.layoutMode && selectedEl.layoutMode !== 'none'
                            ? 'bg-[#0d99ff] text-white shadow-sm shadow-[#0d99ff]/30'
                            : 'bg-[#202026] text-zinc-400 hover:text-white border border-[#2f2f38]'
                        }`}
                      >
                        {selectedEl.layoutMode === 'horizontal'
                          ? '→ Horizontal'
                          : selectedEl.layoutMode === 'vertical'
                          ? '↓ Vertical'
                          : '+ Add Auto Layout'}
                      </button>
                    </div>

                    {selectedEl.layoutMode && selectedEl.layoutMode !== 'none' && (
                      <div className="space-y-2 text-xs pt-1">
                        <div className="grid grid-cols-2 gap-1.5">
                          <div className="flex items-center rounded-lg bg-[#202026] px-2 py-1 border border-[#2f2f38]">
                            <span className="w-8 text-[10px] font-semibold text-zinc-500">Gap</span>
                            <input
                              type="number"
                              value={selectedEl.itemSpacing ?? 12}
                              onChange={(e) =>
                                updateAutoLayoutProps(selectedEl.id, {
                                  itemSpacing: Number(e.target.value),
                                })
                              }
                              className="w-full bg-transparent text-right text-zinc-100 outline-none text-xs font-mono"
                            />
                          </div>
                          <div className="flex items-center rounded-lg bg-[#202026] px-2 py-1 border border-[#2f2f38]">
                            <span className="w-8 text-[10px] font-semibold text-zinc-500">Pad</span>
                            <input
                              type="number"
                              value={selectedEl.paddingTop ?? 16}
                              onChange={(e) => {
                                const v = Number(e.target.value);
                                updateAutoLayoutProps(selectedEl.id, {
                                  paddingTop: v,
                                  paddingBottom: v,
                                  paddingLeft: v,
                                  paddingRight: v,
                                });
                              }}
                              className="w-full bg-transparent text-right text-zinc-100 outline-none text-xs font-mono"
                            />
                          </div>
                        </div>

                        {/* Sizing Mode Switcher */}
                        <div className="flex items-center justify-between rounded-lg bg-[#202026] p-1 border border-[#2f2f38]">
                          <span className="text-[10px] font-medium text-zinc-400 px-1">Sizing</span>
                          <div className="flex gap-1">
                            <button
                              onClick={() =>
                                updateAutoLayoutProps(selectedEl.id, {
                                  layoutSizingHorizontal: 'hug',
                                  layoutSizingVertical: 'hug',
                                })
                              }
                              className={`rounded-md px-2 py-0.5 text-[10px] font-semibold transition-all ${
                                selectedEl.layoutSizingHorizontal === 'hug'
                                  ? 'bg-[#0d99ff] text-white shadow-sm'
                                  : 'text-zinc-400 hover:text-white'
                              }`}
                            >
                              Hug
                            </button>
                            <button
                              onClick={() =>
                                updateAutoLayoutProps(selectedEl.id, {
                                  layoutSizingHorizontal: 'fixed',
                                  layoutSizingVertical: 'fixed',
                                })
                              }
                              className={`rounded-md px-2 py-0.5 text-[10px] font-semibold transition-all ${
                                selectedEl.layoutSizingHorizontal === 'fixed'
                                  ? 'bg-[#0d99ff] text-white shadow-sm'
                                  : 'text-zinc-400 hover:text-white'
                              }`}
                            >
                              Fixed
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Typography Engine (Text Layer) */}
                {selectedEl.type === 'text' && (
                  <div className="space-y-2 border-b border-[#282830] pb-3.5">
                    <div className="figma-section-title flex items-center gap-1.5">
                      <Type className="h-3 w-3 text-zinc-400" />
                      <span>Typography</span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center rounded-lg bg-[#202026] px-2 py-1 text-xs border border-[#2f2f38]">
                        <span className="w-10 text-zinc-500 text-[10px] font-semibold">Font</span>
                        <input
                          type="text"
                          value={selectedEl.fontFamily || 'Inter'}
                          onChange={(e) =>
                            updateElement(selectedEl.id, { fontFamily: e.target.value })
                          }
                          className="w-full bg-transparent text-right text-zinc-100 outline-none text-[11px]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <div className="flex items-center rounded-lg bg-[#202026] px-2 py-1 text-xs border border-[#2f2f38]">
                          <span className="w-10 text-zinc-500 text-[10px] font-semibold">Size</span>
                          <input
                            type="number"
                            value={selectedEl.fontSize || 16}
                            onChange={(e) =>
                              updateElement(selectedEl.id, {
                                fontSize: Math.max(8, Number(e.target.value)),
                              })
                            }
                            className="w-full bg-transparent text-right text-zinc-100 outline-none font-mono text-[11px]"
                          />
                        </div>
                        <div className="flex items-center rounded-lg bg-[#202026] px-2 py-1 text-xs border border-[#2f2f38]">
                          <span className="w-10 text-zinc-500 text-[10px] font-semibold">Weight</span>
                          <select
                            value={selectedEl.fontWeight || '400'}
                            onChange={(e) =>
                              updateElement(selectedEl.id, { fontWeight: e.target.value })
                            }
                            className="w-full bg-transparent text-right text-zinc-100 outline-none text-[11px] cursor-pointer"
                          >
                            <option value="400" className="bg-[#202026]">Regular</option>
                            <option value="500" className="bg-[#202026]">Medium</option>
                            <option value="600" className="bg-[#202026]">Semibold</option>
                            <option value="700" className="bg-[#202026]">Bold</option>
                            <option value="800" className="bg-[#202026]">ExtraBold</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Fill / Color Paint */}
                <div className="space-y-2 border-b border-[#282830] pb-3.5">
                  <div className="flex items-center justify-between figma-section-title">
                    <span>Fill Color</span>
                    <button
                      onClick={() => updateElement(selectedEl.id, { fill: '#3b82f6' })}
                      className="text-zinc-400 hover:text-white"
                      title="Reset Fill"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-[#202026] p-1.5 border border-[#2f2f38]">
                    <input
                      type="color"
                      value={selectedEl.fill?.startsWith('#') ? selectedEl.fill : '#3b82f6'}
                      onChange={(e) => updateElement(selectedEl.id, { fill: e.target.value })}
                      className="h-6 w-6 cursor-pointer rounded border-0 bg-transparent p-0"
                    />
                    <input
                      type="text"
                      value={selectedEl.fill}
                      onChange={(e) => updateElement(selectedEl.id, { fill: e.target.value })}
                      className="flex-1 bg-transparent font-mono text-xs text-zinc-100 outline-none"
                    />
                    <span className="text-zinc-500 text-[10px] font-medium pr-1">100%</span>
                  </div>
                </div>

                {/* Stroke Outline Section */}
                <div className="space-y-2 border-b border-[#282830] pb-3.5">
                  <div className="flex items-center justify-between figma-section-title">
                    <span>Stroke</span>
                    <button
                      onClick={() =>
                        updateElement(selectedEl.id, {
                          stroke: '#ffffff',
                          strokeWidth: 1,
                        })
                      }
                      className="text-zinc-400 hover:text-white"
                      title="Add Stroke"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-[#202026] p-1.5 border border-[#2f2f38]">
                    <input
                      type="color"
                      value={selectedEl.stroke?.startsWith('#') ? selectedEl.stroke : '#ffffff'}
                      onChange={(e) => updateElement(selectedEl.id, { stroke: e.target.value })}
                      className="h-6 w-6 cursor-pointer rounded border-0 bg-transparent p-0"
                    />
                    <input
                      type="text"
                      value={selectedEl.stroke}
                      onChange={(e) => updateElement(selectedEl.id, { stroke: e.target.value })}
                      className="flex-1 bg-transparent font-mono text-xs text-zinc-100 outline-none"
                    />
                    <div className="flex items-center gap-1 w-12">
                      <span className="text-zinc-500 text-[10px] font-semibold">W</span>
                      <input
                        type="number"
                        value={selectedEl.strokeWidth}
                        onChange={(e) =>
                          updateElement(selectedEl.id, {
                            strokeWidth: Math.max(0, Number(e.target.value)),
                          })
                        }
                        className="w-full bg-transparent text-right text-zinc-100 outline-none text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Visual Effects (Drop Shadow & Blur) */}
                <div className="space-y-2 border-b border-[#282830] pb-3.5">
                  <div className="flex items-center justify-between figma-section-title">
                    <span>Effects</span>
                    <button
                      onClick={() =>
                        updateElement(selectedEl.id, {
                          effects: [
                            {
                              x: 0,
                              y: 8,
                              blur: 16,
                              spread: 0,
                              color: 'rgba(0,0,0,0.5)',
                              opacity: 0.5,
                              type: 'drop-shadow',
                            },
                          ],
                        })
                      }
                      className="text-zinc-400 hover:text-white"
                      title="Add Drop Shadow"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  {selectedEl.effects?.map((eff, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg bg-[#202026] p-2 border border-[#2f2f38] text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-zinc-200">Drop Shadow</span>
                        <span className="text-[10px] font-mono text-zinc-500">
                          {eff.x},{eff.y} ({eff.blur}px)
                        </span>
                      </div>
                      <button
                        onClick={() => updateElement(selectedEl.id, { effects: [] })}
                        className="text-zinc-500 hover:text-rose-400 transition-colors"
                        title="Remove Effect"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Export Options */}
                <div className="space-y-2 pt-1">
                  <div className="figma-section-title">Export Options</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={handleExportPng}
                      className="flex items-center justify-center gap-1.5 rounded-lg bg-[#202026] py-2 font-semibold text-zinc-200 border border-[#2f2f38] hover:bg-[#0d99ff] hover:text-white transition-all shadow-sm"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>PNG Asset</span>
                    </button>
                    <button
                      onClick={handleExportSvg}
                      className="flex items-center justify-center gap-1.5 rounded-lg bg-[#202026] py-2 font-semibold text-zinc-200 border border-[#2f2f38] hover:bg-[#0d99ff] hover:text-white transition-all shadow-sm"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Raster SVG</span>
                    </button>
                    <button
                      onClick={handleExportPureVector}
                      className="col-span-2 flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-950/40 to-teal-950/40 py-2.5 font-bold text-emerald-300 border border-emerald-500/40 hover:from-emerald-600 hover:to-teal-600 hover:text-white transition-all shadow-sm"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Export Pure Vector SVG</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* Tab 2: Dev Mode / Code Inspector Panel */}
        {activeTab === 'dev' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="figma-section-title text-emerald-400 flex items-center gap-1.5">
                <Code2 className="h-3.5 w-3.5" />
                <span>Code Inspector</span>
              </span>
              <button
                onClick={() => handleCopyCode(getActiveCode())}
                className="flex items-center gap-1.5 rounded-lg bg-[#202026] px-2.5 py-1 text-[11px] font-semibold text-zinc-200 border border-[#2f2f38] hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
              >
                {copiedCode ? <Check className="h-3 w-3 text-emerald-300" /> : <Copy className="h-3 w-3" />}
                <span>{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Language Switcher Tabs */}
            <div className="flex rounded-lg bg-[#121215] p-0.5 border border-[#2b2b36]">
              <button
                onClick={() => setCodeFormat('tailwind')}
                className={`flex-1 rounded-md py-1 text-[11px] font-semibold transition-all ${
                  codeFormat === 'tailwind'
                    ? 'bg-[#2b2b36] text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Tailwind
              </button>
              <button
                onClick={() => setCodeFormat('css')}
                className={`flex-1 rounded-md py-1 text-[11px] font-semibold transition-all ${
                  codeFormat === 'css'
                    ? 'bg-[#2b2b36] text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                CSS
              </button>
              <button
                onClick={() => setCodeFormat('react')}
                className={`flex-1 rounded-md py-1 text-[11px] font-semibold transition-all ${
                  codeFormat === 'react'
                    ? 'bg-[#2b2b36] text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                React JSX
              </button>
            </div>

            {/* Live Code Preview Block */}
            <div className="rounded-xl border border-[#2b2b36] bg-[#121215] p-3 font-mono text-[11px] text-emerald-300 leading-relaxed overflow-x-auto whitespace-pre custom-scrollbar shadow-inner">
              {getActiveCode()}
            </div>

            {/* Box Model Dimensions Summary */}
            {selectedEl && (
              <div className="space-y-2 border-t border-[#282830] pt-3">
                <div className="figma-section-title">CSS Box Model</div>
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  <div className="rounded-lg bg-[#202026] p-2 border border-[#2f2f38]">
                    <div className="text-zinc-500 text-[10px] font-semibold">Width</div>
                    <div className="font-bold text-white font-mono">{Math.round(selectedEl.width)}px</div>
                  </div>
                  <div className="rounded-lg bg-[#202026] p-2 border border-[#2f2f38]">
                    <div className="text-zinc-500 text-[10px] font-semibold">Height</div>
                    <div className="font-bold text-white font-mono">{Math.round(selectedEl.height)}px</div>
                  </div>
                  <div className="rounded-lg bg-[#202026] p-2 border border-[#2f2f38]">
                    <div className="text-zinc-500 text-[10px] font-semibold">Position</div>
                    <div className="font-bold text-white font-mono">
                      X: {Math.round(selectedEl.x)} Y: {Math.round(selectedEl.y)}
                    </div>
                  </div>
                  <div className="rounded-lg bg-[#202026] p-2 border border-[#2f2f38]">
                    <div className="text-zinc-500 text-[10px] font-semibold">Color Fill</div>
                    <div className="font-bold text-white font-mono truncate">{selectedEl.fill}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Interactive Prototype Settings & Noodles */}
        {activeTab === 'prototype' && (
          <div className="space-y-3.5">
            <div className="figma-section-title flex items-center justify-between">
              <span>Prototype Interactions</span>
              {selectedEl && (
                <span className="text-[10px] text-[#0d99ff] font-medium lowercase truncate max-w-[100px]">
                  {selectedEl.name}
                </span>
              )}
            </div>

            {!selectedEl ? (
              <div className="p-5 text-center text-xs text-zinc-500 rounded-xl border border-[#2b2b36] bg-[#202026]">
                <Zap className="h-6 w-6 text-zinc-600 mx-auto mb-2" />
                <p className="font-semibold text-zinc-300">Select an element</p>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Choose a frame or button on canvas to attach interaction noodles.
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-[#2b2b36] bg-[#202026] p-3.5 text-xs space-y-3 shadow-sm">
                <div>
                  <div className="text-zinc-300 font-semibold mb-1 text-[11px]">Trigger Event</div>
                  <select
                    value={protoTrigger}
                    onChange={(e) => setProtoTrigger(e.target.value as any)}
                    className="w-full rounded-lg bg-[#141418] p-2 text-xs text-white border border-[#3b3b46] outline-none cursor-pointer"
                  >
                    <option value="onClick">On Click / Tap</option>
                    <option value="onHover">While Hovering</option>
                    <option value="onDrag">On Drag / Swipe</option>
                  </select>
                </div>

                <div>
                  <div className="text-zinc-300 font-semibold mb-1 text-[11px]">Navigate To Target</div>
                  <select
                    value={protoTarget}
                    onChange={(e) => setProtoTarget(e.target.value)}
                    className="w-full rounded-lg bg-[#141418] p-2 text-xs text-white border border-[#3b3b46] outline-none cursor-pointer"
                  >
                    <option value="">Select Target Frame...</option>
                    {availableFrames.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="text-zinc-300 font-semibold mb-1 text-[11px]">Animation Easing</div>
                  <select
                    value={protoTransition}
                    onChange={(e) => setProtoTransition(e.target.value as any)}
                    className="w-full rounded-lg bg-[#141418] p-2 text-xs text-white border border-[#3b3b46] outline-none cursor-pointer"
                  >
                    <option value="smart-animate">Smart Animate (300ms)</option>
                    <option value="instant">Instant (0ms)</option>
                    <option value="dissolve">Dissolve (Ease Out)</option>
                    <option value="slide-in">Slide In (Push)</option>
                  </select>
                </div>

                <button
                  onClick={handleAddInteraction}
                  disabled={!protoTarget}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#0d99ff] py-2 font-semibold text-white disabled:opacity-40 hover:bg-[#0c87e0] transition-all shadow-md shadow-[#0d99ff]/20"
                >
                  <Link className="h-3.5 w-3.5" />
                  <span>Connect Noodle</span>
                </button>

                {/* List Existing Prototype Interactions */}
                {selectedEl.prototypeInteractions && selectedEl.prototypeInteractions.length > 0 && (
                  <div className="border-t border-[#2f2f38] pt-2.5 space-y-1.5">
                    <div className="figma-section-title">
                      Active Connections ({selectedEl.prototypeInteractions.length})
                    </div>
                    {selectedEl.prototypeInteractions.map((inter) => {
                      const targetName =
                        elements.find((el) => el.id === inter.targetFrameId)?.name || 'Target Frame';
                      return (
                        <div
                          key={inter.id}
                          className="flex items-center justify-between rounded-lg bg-[#141418] p-2 text-[11px] border border-[#2f2f38]"
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="text-[#0d99ff] font-bold">↳</span>
                            <span className="text-zinc-200 font-semibold truncate">{targetName}</span>
                            <span className="text-[10px] text-zinc-500 font-mono">({inter.trigger})</span>
                          </div>
                          <button
                            onClick={() => removePrototypeInteraction(selectedEl.id, inter.id)}
                            className="p-1 text-zinc-500 hover:text-rose-400 transition-colors"
                            title="Remove Connection"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
