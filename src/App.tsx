import { useState, useEffect } from 'react';
import { TopNav } from './components/layout/TopNav';
import { LeftSidebar } from './components/layout/LeftSidebar';
import { RightSidebar } from './components/layout/RightSidebar';
import { Toolbar } from './components/layout/Toolbar';
import { Canvas } from './components/canvas/Canvas';
import { PlatformWrapper } from './components/platforms/PlatformWrapper';
import { AiDesignModal } from './components/ai/AiDesignModal';
import { PresentationModal } from './components/presentation/PresentationModal';
import { useCanvasStore } from './store/useCanvasStore';
import { useMultiplayerStore } from './store/useMultiplayerStore';

export function App() {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [devMode, setDevMode] = useState(false);

  const { initMultiplayer } = useMultiplayerStore();
  const {
    undo,
    redo,
    deleteSelected,
    duplicateSelected,
    setSelectedIds,
    elements,
    selectedIds,
    groupSelected,
    ungroupSelected,
    frameSelection,
    createMasterComponent,
  } = useCanvasStore();

  // Initialize live multiplayer sync on startup
  useEffect(() => {
    initMultiplayer();
  }, [initMultiplayer]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input / textarea or text editing
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Undo / Redo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }

      // Delete
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        deleteSelected();
      }

      // Duplicate (Ctrl/Cmd + D)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        duplicateSelected();
      }

      // Select All (Ctrl/Cmd + A)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setSelectedIds(elements.map((el) => el.id));
      }

      // Grouping (Ctrl+G), Ungrouping (Ctrl+Shift+G), Frame Selection (Ctrl+Alt+G)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'g') {
        e.preventDefault();
        if (e.shiftKey) {
          ungroupSelected();
        } else if (e.altKey) {
          frameSelection();
        } else {
          groupSelected();
        }
      }

      // Create Master Component (Ctrl+Alt+K)
      if ((e.metaKey || e.ctrlKey) && e.altKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (selectedIds.length === 1) {
          createMasterComponent(selectedIds[0]);
        }
      }

      // Open AI modal shortcut (Ctrl/Cmd + K without alt or Ctrl/Cmd + I)
      if ((e.metaKey || e.ctrlKey) && !e.altKey && (e.key.toLowerCase() === 'k' || e.key.toLowerCase() === 'i')) {
        e.preventDefault();
        setIsAiModalOpen((prev) => !prev);
      }

      // Present shortcut (Ctrl/Cmd + Alt + Enter or Shift + Space)
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        setIsPresentationOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    undo,
    redo,
    deleteSelected,
    duplicateSelected,
    setSelectedIds,
    elements,
    selectedIds,
    groupSelected,
    ungroupSelected,
    frameSelection,
    createMasterComponent,
  ]);

  return (
    <PlatformWrapper
      onOpenAiModal={() => setIsAiModalOpen(true)}
      devMode={devMode}
      setDevMode={setDevMode}
    >
      {/* Figma Top Navigation Bar */}
      <TopNav
        onOpenAiModal={() => setIsAiModalOpen(true)}
        devMode={devMode}
        setDevMode={setDevMode}
        onPresent={() => setIsPresentationOpen(true)}
      />

      {/* Main Workspace: Left Sidebar + Infinite Canvas + Right Sidebar */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Left Hierarchy & Asset Sidebar */}
        <LeftSidebar />

        {/* Central Infinite Interactive Vector Canvas */}
        <main className="relative flex-1 overflow-hidden bg-[#1e1e1e]">
          <Canvas />
          {/* Floating Figma Toolbar */}
          <Toolbar onOpenAiModal={() => setIsAiModalOpen(true)} />
        </main>

        {/* Right Design & Dev Mode Inspector Sidebar */}
        <RightSidebar devMode={devMode} setDevMode={setDevMode} />
      </div>

      {/* AI Design Generator Modal */}
      <AiDesignModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />

      {/* Fullscreen Interactive Presentation Player */}
      <PresentationModal
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
      />
    </PlatformWrapper>
  );
}

export default App;
