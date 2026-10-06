import React, { useState } from 'react';
import { useCanvasStore } from '../../store/useCanvasStore';
import {
  Minus,
  Square,
  X,
  Wifi,
  Battery,
  Compass,
  Maximize2,
  Terminal,
  Sparkles,
  Signal,
  Layers,
  Sliders,
  Check,
  Zap,
} from 'lucide-react';

interface PlatformWrapperProps {
  children: React.ReactNode;
  onOpenAiModal: () => void;
  devMode: boolean;
  setDevMode: (dev: boolean) => void;
}

export const PlatformWrapper: React.FC<PlatformWrapperProps> = ({
  children,
  onOpenAiModal,
  devMode,
  setDevMode,
}) => {
  const { platformMode, setPlatformMode, elements, selectedIds, zoom, undo, redo, deleteSelected, duplicateSelected, groupSelected, ungroupSelected } = useCanvasStore();
  const [osStyle, setOsStyle] = useState<'macos' | 'windows'>('macos');
  const [mobileTab, setMobileTab] = useState<'canvas' | 'layers' | 'properties'>('canvas');
  const [windowMaximized, setWindowMaximized] = useState(true);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const selectedElement = elements.find((el) => selectedIds.includes(el.id));

  // Current time for mobile & desktop status bars
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Menu bar items for desktop native mode
  const menuItems: Record<string, { label: string; shortcut?: string; action?: () => void; divider?: boolean }[]> = {
    File: [
      { label: 'New File', shortcut: '⌘N' },
      { label: 'Save Local Copy', shortcut: '⌘S' },
      { divider: true, label: '' },
      { label: 'Export as SVG / PNG', shortcut: '⇧⌘E' },
      { label: 'Close Window', shortcut: '⌘W', action: () => setPlatformMode('web') },
    ],
    Edit: [
      { label: 'Undo', shortcut: '⌘Z', action: undo },
      { label: 'Redo', shortcut: '⇧⌘Z', action: redo },
      { divider: true, label: '' },
      { label: 'Duplicate', shortcut: '⌘D', action: duplicateSelected },
      { label: 'Delete', shortcut: 'Del', action: deleteSelected },
    ],
    Object: [
      { label: 'Group Selection', shortcut: '⌘G', action: groupSelected },
      { label: 'Ungroup Selection', shortcut: '⇧⌘G', action: ungroupSelected },
      { divider: true, label: '' },
      { label: 'Create Component', shortcut: '⌥⌘K' },
    ],
    View: [
      { label: 'Toggle Grid', shortcut: "⌘'" },
      { label: 'Toggle Rulers', shortcut: '⇧R' },
      { label: 'Dev Mode Inspector', shortcut: '⇧D', action: () => setDevMode(!devMode) },
    ],
    Plugins: [
      { label: 'AI Design Copilot', shortcut: '⌘K', action: onOpenAiModal },
      { label: 'Unsplash Image Library' },
      { label: 'Iconify Vector Icons' },
      { label: 'Design Tokens Sync' },
    ],
  };

  if (platformMode === 'desktop') {
    return (
      <div
        className="flex h-screen w-screen flex-col overflow-hidden bg-[#0a0a0d] p-2 select-none font-sans"
        onClick={() => setActiveMenu(null)}
      >
        {/* Desktop Native Window Shell */}
        <div
          className={`flex flex-col flex-1 overflow-hidden rounded-2xl border border-white/10 bg-[#1e1e24] shadow-[0_25px_60px_rgba(0,0,0,0.85)] ring-1 ring-black/80 transition-all duration-300 ${
            windowMaximized ? 'h-full w-full' : 'max-h-[92vh] max-w-[95vw] mx-auto my-auto rounded-2xl'
          }`}
        >
          {/* OS Window Title Bar */}
          <div className="flex h-9 items-center justify-between border-b border-white/10 bg-[#16161b] px-3.5 select-none relative z-50">
            {/* macOS Window Controls */}
            {osStyle === 'macos' ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPlatformMode('web')}
                  className="group flex h-3 w-3 items-center justify-center rounded-full bg-[#ff5f56] border border-[#e0443e] shadow-sm hover:brightness-110 active:brightness-90 transition-all"
                  title="Close Desktop App (Switch to Web)"
                >
                  <X className="h-2 w-2 text-black/70 opacity-0 group-hover:opacity-100" />
                </button>
                <button
                  onClick={() => setWindowMaximized(!windowMaximized)}
                  className="group flex h-3 w-3 items-center justify-center rounded-full bg-[#ffbd2e] border border-[#dea123] shadow-sm hover:brightness-110 active:brightness-90 transition-all"
                  title="Minimize Window"
                >
                  <Minus className="h-2 w-2 text-black/70 opacity-0 group-hover:opacity-100" />
                </button>
                <button
                  onClick={() => setWindowMaximized(!windowMaximized)}
                  className="group flex h-3 w-3 items-center justify-center rounded-full bg-[#27c93f] border border-[#1aab29] shadow-sm hover:brightness-110 active:brightness-90 transition-all"
                  title="Full Window"
                >
                  <Maximize2 className="h-2 w-2 text-black/70 opacity-0 group-hover:opacity-100" />
                </button>
              </div>
            ) : (
              /* Windows Controls Left */
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded bg-[#0d99ff] text-white font-bold text-[10px] shadow-sm">
                  F
                </div>
                <span className="text-[11px] font-semibold text-zinc-300">Figma Studio Desktop</span>
              </div>
            )}

            {/* Window Centered Document Title & OS Switcher */}
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200">
                <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50 animate-pulse" />
                Figma Studio Native Canvas
              </span>
              <div className="flex items-center rounded-lg border border-white/10 bg-[#22222a] p-0.5 shadow-inner">
                <button
                  onClick={() => setOsStyle('macos')}
                  className={`rounded-md px-2 py-0.5 text-[10px] font-semibold transition-all ${
                    osStyle === 'macos' ? 'bg-[#32323e] text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  macOS
                </button>
                <button
                  onClick={() => setOsStyle('windows')}
                  className={`rounded-md px-2 py-0.5 text-[10px] font-semibold transition-all ${
                    osStyle === 'windows' ? 'bg-[#32323e] text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Windows
                </button>
              </div>
            </div>

            {/* Desktop Native Right Controls */}
            {osStyle === 'windows' ? (
              <div className="flex items-center -mr-2">
                <button className="flex h-8 w-9 items-center justify-center text-zinc-400 hover:bg-[#2c2c36] hover:text-white transition-colors">
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setWindowMaximized(!windowMaximized)}
                  className="flex h-8 w-9 items-center justify-center text-zinc-400 hover:bg-[#2c2c36] hover:text-white transition-colors"
                >
                  <Square className="h-3 w-3" />
                </button>
                <button
                  onClick={() => setPlatformMode('web')}
                  className="flex h-8 w-9 items-center justify-center text-zinc-400 hover:bg-rose-600 hover:text-white transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                <span className="flex items-center gap-1 font-medium text-emerald-400">
                  <Zap className="h-3 w-3" /> Metal GPU Acceleration
                </span>
              </div>
            )}
          </div>

          {/* Desktop Native App Menu Bar */}
          <div className="relative flex h-7 items-center justify-between border-b border-white/10 bg-[#1a1a20] px-3.5 text-xs text-zinc-300 z-40">
            <div className="flex items-center gap-1 text-[11px] font-medium">
              <span className="font-bold text-white tracking-wide px-2 py-1 rounded hover:bg-white/10 cursor-pointer">
                Figma
              </span>
              {Object.keys(menuItems).map((menu) => (
                <div key={menu} className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenu(activeMenu === menu ? null : menu);
                    }}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      activeMenu === menu ? 'bg-[#0d99ff] text-white' : 'hover:bg-white/10 text-zinc-300 hover:text-white'
                    }`}
                  >
                    {menu}
                  </button>

                  {/* Dropdown Menu */}
                  {activeMenu === menu && (
                    <div
                      className="absolute top-7 left-0 z-50 w-52 rounded-xl figma-glass-elevated p-1 shadow-2xl ring-1 ring-black/70 animate-in fade-in duration-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {menuItems[menu].map((item, idx) =>
                        item.divider ? (
                          <div key={idx} className="my-1 h-[1px] bg-white/10" />
                        ) : (
                          <button
                            key={idx}
                            onClick={() => {
                              item.action?.();
                              setActiveMenu(null);
                            }}
                            className="flex w-full items-center justify-between rounded-lg px-2.5 py-1 text-xs text-zinc-200 hover:bg-[#0d99ff] hover:text-white transition-colors group"
                          >
                            <span>{item.label}</span>
                            {item.shortcut && (
                              <span className="figma-kbd text-[10px] group-hover:bg-white/20 group-hover:text-white">
                                {item.shortcut}
                              </span>
                            )}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 text-[11px] text-zinc-400">
              <button
                onClick={onOpenAiModal}
                className="flex items-center gap-1.5 rounded-lg px-2 py-0.5 text-purple-300 bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 hover:text-purple-200 transition-all font-medium text-[11px]"
              >
                <Sparkles className="h-3 w-3 text-purple-400" />
                <span>AI Copilot</span>
              </button>
            </div>
          </div>

          {/* App Workspace Body */}
          <div className="relative flex-1 overflow-hidden">{children}</div>

          {/* Desktop Status Bar Footer */}
          <div className="flex h-6 items-center justify-between border-t border-white/10 bg-[#141418] px-3.5 text-[10px] text-zinc-400">
            <div className="flex items-center gap-3">
              <span className="font-medium text-zinc-300">Elements: {elements.length}</span>
              <span className="text-zinc-600">•</span>
              <span className="truncate max-w-[280px]">
                {selectedElement ? `Selected: ${selectedElement.name} (${selectedElement.type})` : 'No element selected'}
              </span>
            </div>
            <div className="flex items-center gap-4 font-mono">
              <span>Zoom: {Math.round(zoom * 100)}%</span>
              <span className="text-zinc-600">•</span>
              <span>Memory: 42.4 MB</span>
              <span className="text-zinc-600">•</span>
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <Check className="h-3 w-3" /> Live Synced
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (platformMode === 'mobile') {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#08080a] p-4 select-none font-sans">
        {/* Mobile Device Frame Container */}
        <div className="relative flex h-[880px] w-[414px] flex-col overflow-hidden rounded-[54px] border-[12px] border-[#222228] bg-[#18181b] shadow-[0_36px_80px_rgba(0,0,0,0.95)] ring-1 ring-white/10">
          {/* Hardware Notch / Dynamic Island */}
          <div className="absolute top-3.5 left-1/2 -translate-x-1/2 z-50 flex h-7 w-32 items-center justify-between rounded-full bg-black px-3.5 ring-1 ring-white/10 shadow-lg">
            <div className="h-2.5 w-2.5 rounded-full bg-[#1e293b] ring-1 ring-blue-500/30" />
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50" />
          </div>

          {/* Mobile Status Bar */}
          <div className="flex h-11 items-center justify-between px-7 pt-2 text-xs text-white z-40">
            <span className="font-semibold text-xs tracking-tight">{currentTime}</span>
            <div className="flex items-center gap-2">
              <Signal className="h-3 w-3" />
              <Wifi className="h-3 w-3" />
              <Battery className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Mobile Header Bar */}
          <div className="flex h-10 items-center justify-between border-b border-white/10 bg-[#18181b]/95 px-4 z-40 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-[#0d99ff] shadow-sm shadow-[#0d99ff]/50" />
              <span className="text-xs font-bold text-white tracking-wide">Figma Mobile Pro</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPlatformMode('web')}
                className="rounded-lg px-2.5 py-1 text-[10px] font-semibold bg-[#27272e] text-zinc-300 hover:text-white transition-colors border border-white/10 shadow-sm"
              >
                Exit Mobile
              </button>
            </div>
          </div>

          {/* Main App Workspace Canvas */}
          <div className="relative flex-1 overflow-hidden">{children}</div>

          {/* Mobile Bottom Tab Bar */}
          <div className="flex h-14 items-center justify-around border-t border-white/10 bg-[#141418]/95 px-3 z-50 backdrop-blur-md">
            <button
              onClick={() => setMobileTab('canvas')}
              className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
                mobileTab === 'canvas' ? 'text-[#0d99ff]' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Compass className="h-4 w-4" />
              <span>Canvas</span>
            </button>
            <button
              onClick={() => setMobileTab('layers')}
              className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
                mobileTab === 'layers' ? 'text-[#0d99ff]' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>Layers</span>
            </button>
            <button
              onClick={onOpenAiModal}
              className="flex flex-col items-center gap-1 text-[10px] font-semibold text-purple-400 hover:text-purple-300 transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              <span>AI Gen</span>
            </button>
            <button
              onClick={() => {
                setMobileTab('properties');
                setDevMode(!devMode);
              }}
              className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
                devMode ? 'text-emerald-400' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {devMode ? <Terminal className="h-4 w-4" /> : <Sliders className="h-4 w-4" />}
              <span>{devMode ? 'Dev Mode' : 'Inspect'}</span>
            </button>
          </div>

          {/* iOS Bottom Gesture Bar */}
          <div className="flex h-4 items-center justify-center bg-[#141418]">
            <div className="h-1 w-32 rounded-full bg-white/30" />
          </div>
        </div>
      </div>
    );
  }

  // Standard Web App Platform Mode
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#1e1e1e] select-none font-sans">
      {children}
    </div>
  );
};
