import React, { useState } from 'react';
import { useCanvasStore } from '../../store/useCanvasStore';
import { useMultiplayerStore } from '../../store/useMultiplayerStore';
import { exportProjectJson } from '../../utils/export';
import {
  Menu,
  Undo2,
  Redo2,
  Play,
  Share2,
  Smartphone,
  Laptop,
  Globe,
  Check,
  ChevronDown,
  Sparkles,
  Copy,
  Code2,
  FileDown,
  FolderOpen,
  Grid,
  Ruler,
} from 'lucide-react';

interface TopNavProps {
  onOpenAiModal: () => void;
  devMode: boolean;
  setDevMode: (dev: boolean) => void;
  onPresent: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  onOpenAiModal,
  devMode,
  setDevMode,
  onPresent,
}) => {
  const {
    zoom,
    setZoom,
    zoomIn,
    zoomOut,
    resetZoom,
    undo,
    redo,
    historyIndex,
    history,
    platformMode,
    setPlatformMode,
    showGrid,
    toggleGrid,
    showRulers,
    toggleRulers,
    elements,
    loadSampleProject,
  } = useCanvasStore();

  const { currentUser, collaborators } = useMultiplayerStore();

  const [documentTitle, setDocumentTitle] = useState('Untitled Design System');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isZoomMenuOpen, setIsZoomMenuOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const zoomPercent = Math.round(zoom * 100);

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <header className="relative z-50 flex h-11 w-full select-none items-center justify-between border-b border-[#282830] bg-[#16161a]/95 px-3 text-[#f4f4f6] backdrop-blur-md font-sans">
      {/* Left Section: Main Menu, File Title, Undo/Redo */}
      <div className="flex items-center gap-2.5">
        {/* Figma Logo / Main Menu Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`flex h-7 w-7 items-center justify-center rounded-md transition-all ${
              isMenuOpen
                ? 'bg-[#2b2b36] text-white ring-1 ring-white/20'
                : 'text-zinc-400 hover:bg-[#252530] hover:text-zinc-100'
            }`}
            title="Main Menu"
          >
            <Menu className="h-4 w-4" />
          </button>

          {isMenuOpen && (
            <div
              className="absolute left-0 top-9 z-50 w-64 rounded-xl border border-white/10 bg-[#1c1c22]/95 p-1.5 shadow-2xl text-xs backdrop-blur-2xl ring-1 ring-black/60 animate-in fade-in zoom-in-95 duration-100"
              onMouseLeave={() => setIsMenuOpen(false)}
            >
              <div className="px-2.5 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                File & Project
              </div>
              <button
                onClick={() => {
                  loadSampleProject();
                  setIsMenuOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-zinc-200 hover:bg-[#0d99ff] hover:text-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FolderOpen className="h-3.5 w-3.5" />
                  <span>Load Sample Template</span>
                </div>
                <span className="figma-kbd">Ctrl+O</span>
              </button>

              <button
                onClick={() => {
                  exportProjectJson(elements, `${documentTitle.toLowerCase().replace(/\s+/g, '-')}.json`);
                  setIsMenuOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-zinc-200 hover:bg-[#0d99ff] hover:text-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileDown className="h-3.5 w-3.5" />
                  <span>Export Project JSON</span>
                </div>
                <span className="figma-kbd">Ctrl+E</span>
              </button>

              <div className="my-1 border-t border-white/10" />

              <div className="px-2.5 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                View & Canvas
              </div>
              <button
                onClick={() => {
                  toggleGrid();
                  setIsMenuOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-zinc-200 hover:bg-[#0d99ff] hover:text-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Grid className="h-3.5 w-3.5" />
                  <span>Pixel Grid</span>
                </div>
                <span className="text-emerald-400 font-bold">{showGrid ? '✓' : ''}</span>
              </button>
              <button
                onClick={() => {
                  toggleRulers();
                  setIsMenuOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-zinc-200 hover:bg-[#0d99ff] hover:text-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Ruler className="h-3.5 w-3.5" />
                  <span>Rulers & Guides</span>
                </div>
                <span className="text-emerald-400 font-bold">{showRulers ? '✓' : ''}</span>
              </button>

              <div className="my-1 border-t border-white/10" />

              <button
                onClick={() => {
                  onOpenAiModal();
                  setIsMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-indigo-400 hover:bg-indigo-600 hover:text-white font-medium transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                <span>AI Design Copilot...</span>
              </button>
            </div>
          )}
        </div>

        {/* Document Title Editable with Cloud Saved Status */}
        <div className="flex items-center gap-1.5 rounded-md px-1.5 py-1 hover:bg-[#252530] transition-colors group">
          <input
            type="text"
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            className="h-6 max-w-[210px] truncate rounded bg-transparent px-1.5 text-xs font-semibold text-zinc-100 placeholder-zinc-500 hover:bg-[#2e2e38] focus:bg-[#18181b] focus:outline-none focus:ring-1 focus:ring-[#0d99ff] transition-all"
          />
          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" title="All changes saved locally" />
        </div>

        {/* History Undo / Redo */}
        <div className="flex items-center gap-0.5 border-l border-[#2e2e38] pl-2">
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 hover:bg-[#252530] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 hover:bg-[#252530] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Center Section: 3-Platform Mode Switcher (UI3 Style Pill) */}
      <div className="flex items-center gap-0.5 rounded-lg border border-[#2e2e38] bg-[#111115] p-0.5 shadow-inner">
        <button
          onClick={() => setPlatformMode('web')}
          className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-150 ${
            platformMode === 'web'
              ? 'bg-[#272730] text-white shadow ring-1 ring-white/10'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
          title="Web Canvas Mode"
        >
          <Globe className="h-3.5 w-3.5 text-blue-400" />
          <span>Web</span>
        </button>

        <button
          onClick={() => setPlatformMode('desktop')}
          className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-150 ${
            platformMode === 'desktop'
              ? 'bg-[#272730] text-white shadow ring-1 ring-white/10'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
          title="Desktop Native App Shell (macOS & Windows)"
        >
          <Laptop className="h-3.5 w-3.5 text-emerald-400" />
          <span>Desktop Native</span>
        </button>

        <button
          onClick={() => setPlatformMode('mobile')}
          className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-150 ${
            platformMode === 'mobile'
              ? 'bg-[#272730] text-white shadow ring-1 ring-white/10'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
          title="Mobile Flagship Device Shell"
        >
          <Smartphone className="h-3.5 w-3.5 text-purple-400" />
          <span>Mobile Native</span>
        </button>
      </div>

      {/* Right Section: Multiplayer, Zoom, Dev Mode, Present, Share */}
      <div className="flex items-center gap-1.5">
        {/* AI Generator Quick Trigger */}
        <button
          onClick={onOpenAiModal}
          className="group relative flex items-center gap-1.5 rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 px-2.5 py-1 text-xs font-semibold text-white shadow-md hover:from-indigo-400 hover:to-purple-500 active:scale-95 transition-all"
          title="AI Design Generator (Ctrl+K)"
        >
          <Sparkles className="h-3.5 w-3.5 transition-transform group-hover:rotate-12" />
          <span className="hidden sm:inline">AI Gen</span>
        </button>

        {/* Live Multiplayer Collaborator Avatars */}
        <div className="flex items-center -space-x-1 pl-1">
          <div
            className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#16161a] text-[10px] font-bold text-white shadow-sm ring-1 ring-black/40"
            style={{ backgroundColor: currentUser.color }}
            title={`You: ${currentUser.name}`}
          >
            {currentUser.name.charAt(0)}
          </div>
          {collaborators.map((c) => (
            <div
              key={c.id}
              className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#16161a] text-[10px] font-bold text-white shadow-sm ring-1 ring-black/40"
              style={{ backgroundColor: c.color }}
              title={`${c.name} (Live Collaborator)`}
            >
              {c.name.charAt(0)}
            </div>
          ))}
        </div>

        {/* Share Button & Popover */}
        <div className="relative">
          <button
            onClick={() => setIsShareOpen(!isShareOpen)}
            className="flex h-7 items-center gap-1.5 rounded-md bg-[#0d99ff] px-2.5 text-xs font-semibold text-white hover:bg-[#0c8ce9] active:scale-95 shadow-sm transition-all"
          >
            <Share2 className="h-3 w-3" />
            <span>Share</span>
          </button>

          {isShareOpen && (
            <div
              className="absolute right-0 top-9 z-50 w-72 rounded-xl border border-white/10 bg-[#1c1c22]/95 p-3 shadow-2xl text-xs backdrop-blur-2xl ring-1 ring-black/60 animate-in fade-in zoom-in-95 duration-100"
              onMouseLeave={() => setIsShareOpen(false)}
            >
              <div className="font-semibold text-white mb-1">Share this project</div>
              <p className="text-[11px] text-zinc-400 mb-3">
                Anyone with this link can collaborate and view your canvas in real-time.
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={window.location.href}
                  className="w-full rounded-md bg-[#121216] px-2.5 py-1.5 text-xs text-zinc-300 border border-[#2f2f38] focus:border-[#0d99ff] outline-none font-mono text-[11px]"
                />
                <button
                  onClick={handleCopyShareLink}
                  className="flex items-center gap-1 rounded-md bg-[#0d99ff] px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-[#0c8ce9] shrink-0 transition-colors"
                >
                  {copiedLink ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Dev Mode Toggle */}
        <button
          onClick={() => setDevMode(!devMode)}
          className={`flex h-7 items-center gap-1.5 rounded-md px-2 text-xs font-medium transition-all ${
            devMode
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 shadow-sm'
              : 'hover:bg-[#252530] text-zinc-400 hover:text-zinc-200'
          }`}
          title="Toggle Dev Mode (Inspect Tailwind / CSS / React)"
        >
          <Code2 className="h-3.5 w-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Dev Mode</span>
        </button>

        {/* Prototype Present Button */}
        <button
          onClick={onPresent}
          className="flex h-7 w-7 items-center justify-center rounded-md bg-[#252530] text-zinc-300 hover:bg-[#323240] hover:text-white active:scale-95 transition-all"
          title="Present Prototype (Ctrl+Enter)"
        >
          <Play className="h-3.5 w-3.5 fill-current" />
        </button>

        {/* Zoom Menu Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsZoomMenuOpen(!isZoomMenuOpen)}
            className="flex h-7 items-center gap-1 rounded-md px-2 text-xs font-medium text-zinc-400 hover:bg-[#252530] hover:text-white transition-colors"
          >
            <span>{zoomPercent}%</span>
            <ChevronDown className="h-3 w-3" />
          </button>

          {isZoomMenuOpen && (
            <div
              className="absolute right-0 top-9 z-50 w-44 rounded-xl border border-white/10 bg-[#1c1c22]/95 py-1.5 shadow-2xl text-xs backdrop-blur-2xl ring-1 ring-black/60 animate-in fade-in zoom-in-95 duration-100"
              onMouseLeave={() => setIsZoomMenuOpen(false)}
            >
              <button
                onClick={() => {
                  zoomIn();
                  setIsZoomMenuOpen(false);
                }}
                className="flex w-full items-center justify-between px-3 py-1.5 text-zinc-200 hover:bg-[#0d99ff] hover:text-white"
              >
                <span>Zoom In</span>
                <span className="figma-kbd">Ctrl +</span>
              </button>
              <button
                onClick={() => {
                  zoomOut();
                  setIsZoomMenuOpen(false);
                }}
                className="flex w-full items-center justify-between px-3 py-1.5 text-zinc-200 hover:bg-[#0d99ff] hover:text-white"
              >
                <span>Zoom Out</span>
                <span className="figma-kbd">Ctrl -</span>
              </button>
              <button
                onClick={() => {
                  resetZoom();
                  setIsZoomMenuOpen(false);
                }}
                className="flex w-full items-center justify-between px-3 py-1.5 text-zinc-200 hover:bg-[#0d99ff] hover:text-white"
              >
                <span>Zoom to 100%</span>
                <span className="figma-kbd">Shift 0</span>
              </button>
              <div className="my-1 border-t border-white/10" />
              <button
                onClick={() => {
                  setZoom(0.5);
                  setIsZoomMenuOpen(false);
                }}
                className="flex w-full items-center px-3 py-1.5 text-zinc-200 hover:bg-[#0d99ff] hover:text-white"
              >
                <span>50%</span>
              </button>
              <button
                onClick={() => {
                  setZoom(2);
                  setIsZoomMenuOpen(false);
                }}
                className="flex w-full items-center px-3 py-1.5 text-zinc-200 hover:bg-[#0d99ff] hover:text-white"
              >
                <span>200%</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
