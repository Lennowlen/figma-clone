import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useCanvasStore } from '../../store/useCanvasStore';
import { useMultiplayerStore } from '../../store/useMultiplayerStore';
import { CanvasElementRenderer } from './CanvasElementRenderer';
import { SelectionOverlay } from './SelectionOverlay';
import { SmartGuides } from './SmartGuides';
import { MultiplayerCursors } from './MultiplayerCursors';
import { Rulers } from './Rulers';
import { DistanceGuides } from './DistanceGuides';
import { PrototypeNoodles } from './PrototypeNoodles';
import { calculateSnapping } from '../../utils/geometry';
import type { Point, CanvasElement } from '../../types/canvas';
import { MessageSquare, Check } from 'lucide-react';

export const Canvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    elements,
    selectedIds,
    activeTool,
    zoom,
    panOffset,
    showGrid,
    snapToGrid,
    comments,
    activeCommentId,
    marqueeBox,
    setZoom,
    setPanOffset,
    addElement,
    updateElement,
    updateElements,
    selectElement,
    setSelectedIds,
    clearSelection,
    setActiveTool,
    setSmartGuides,
    setMarqueeBox,
    setHoveredId,
    setIsAltPressed,
    addComment,
    resolveComment,
    setActiveCommentId,
    recordHistory,
  } = useCanvasStore();

  const { updateMyCursor, currentUser } = useMultiplayerStore();

  // Interaction States
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [dragStart, setDragStart] = useState<Point>({ x: 0, y: 0 });
  const [initialPan, setInitialPan] = useState<Point>({ x: 0, y: 0 });

  // Element Drag / Move
  const [isMovingElement, setIsMovingElement] = useState(false);
  const [moveStartPos, setMoveStartPos] = useState<Point>({ x: 0, y: 0 });
  const [initialElementPositions, setInitialElementPositions] = useState<Map<string, Point>>(new Map());

  // Element Resize
  const [resizingHandle, setResizingHandle] = useState<string | null>(null);
  const [resizeStartElement, setResizeStartElement] = useState<CanvasElement | null>(null);

  // Element Rotate
  const [isRotating, setIsRotating] = useState(false);
  const [rotateCenter, setRotateCenter] = useState<Point>({ x: 0, y: 0 });

  // Creation Drag
  const [isCreating, setIsCreating] = useState(false);
  const [createStartPoint, setCreateStartPoint] = useState<Point>({ x: 0, y: 0 });
  const [currentCreatingId, setCurrentCreatingId] = useState<string | null>(null);

  // Freehand Pencil
  const [isDrawing, setIsDrawing] = useState(false);
  const [pencilPoints, setPencilPoints] = useState<[number, number, number][]>([]);

  // Text In-Place Editing
  const [editingTextId, setEditingTextId] = useState<string | null>(null);

  // Spacebar Hand mode tracking
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  // Marquee Selection Drag
  const [isMarqueeActive, setIsMarqueeActive] = useState(false);
  const [marqueeStart, setMarqueeStart] = useState<Point>({ x: 0, y: 0 });

  // New Comment Input popup
  const [newCommentPos, setNewCommentPos] = useState<Point | null>(null);
  const [commentInput, setCommentInput] = useState('');

  // Helper: Convert screen coords to canvas coords
  const screenToCanvas = useCallback(
    (screenX: number, screenY: number): Point => {
      if (!containerRef.current) return { x: screenX, y: screenY };
      const rect = containerRef.current.getBoundingClientRect();
      return {
        x: (screenX - rect.left - panOffset.x) / zoom,
        y: (screenY - rect.top - panOffset.y) / zoom,
      };
    },
    [panOffset, zoom]
  );

  // Keyboard shortcut tracking (Space for hand pan, Alt for distance measurement)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        setIsSpacePressed(true);
      }
      if (e.key === 'Alt') {
        setIsAltPressed(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
      }
      if (e.key === 'Alt') {
        setIsAltPressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setIsAltPressed]);

  // Wheel Zoom & Pan
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      // Zoom
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const mouseCanvas = screenToCanvas(e.clientX, e.clientY);

      setZoom((prevZoom) => {
        const nextZoom = Math.min(Math.max(prevZoom * zoomFactor, 0.1), 5);
        if (!containerRef.current) return nextZoom;
        const rect = containerRef.current.getBoundingClientRect();
        const newPanX = e.clientX - rect.left - mouseCanvas.x * nextZoom;
        const newPanY = e.clientY - rect.top - mouseCanvas.y * nextZoom;
        setPanOffset({ x: newPanX, y: newPanY });
        return nextZoom;
      });
    } else {
      // Pan
      setPanOffset((prev) => ({
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY,
      }));
    }
  };

  // Mouse Down handler
  const handleMouseDown = (e: React.MouseEvent) => {
    // Middle click or Hand tool or Spacebar drag -> Canvas Pan
    if (e.button === 1 || activeTool === 'hand' || isSpacePressed) {
      setIsDraggingCanvas(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setInitialPan({ ...panOffset });
      return;
    }

    if (e.button !== 0) return; // Left click only for editing

    const canvasPos = screenToCanvas(e.clientX, e.clientY);

    // Drop Comment Tool
    if (activeTool === 'comment') {
      setNewCommentPos(canvasPos);
      return;
    }

    // Freehand Pencil Tool
    if (activeTool === 'pencil') {
      setIsDrawing(true);
      const initialPoints: [number, number, number][] = [[canvasPos.x, canvasPos.y, 0.5]];
      setPencilPoints(initialPoints);
      const id = addElement({
        name: 'Drawing',
        type: 'pencil',
        x: canvasPos.x,
        y: canvasPos.y,
        width: 100,
        height: 100,
        rotation: 0,
        opacity: 1,
        visible: true,
        locked: false,
        fill: '#f43f5e',
        fillOpacity: 1,
        stroke: '#f43f5e',
        strokeWidth: 3,
        strokeStyle: 'solid',
        strokeOpacity: 1,
        effects: [],
        points: initialPoints,
      });
      setCurrentCreatingId(id);
      return;
    }

    // Shape Creation Tools
    if (
      ['rectangle', 'ellipse', 'star', 'polygon', 'frame', 'line', 'arrow', 'text'].includes(
        activeTool
      )
    ) {
      setIsCreating(true);
      setCreateStartPoint(canvasPos);

      let initialName = 'Rectangle';
      let fill = '#3b82f6';
      let stroke = 'transparent';
      let strokeWidth = 0;
      let width = 1;
      let height = 1;

      if (activeTool === 'frame') {
        initialName = 'Frame';
        fill = '#1e1e1e';
        stroke = '#383838';
        strokeWidth = 1;
      } else if (activeTool === 'ellipse') {
        initialName = 'Ellipse';
        fill = '#10b981';
      } else if (activeTool === 'star') {
        initialName = 'Star';
        fill = '#fbbf24';
      } else if (activeTool === 'polygon') {
        initialName = 'Triangle';
        fill = '#8b5cf6';
      } else if (activeTool === 'line') {
        initialName = 'Line';
        fill = '#94a3b8';
        stroke = '#94a3b8';
        strokeWidth = 2;
      } else if (activeTool === 'arrow') {
        initialName = 'Arrow';
        fill = '#06b6d4';
        stroke = '#06b6d4';
        strokeWidth = 2;
      } else if (activeTool === 'text') {
        initialName = 'Text';
        fill = '#ffffff';
      }

      const id = addElement({
        name: initialName,
        type: activeTool as any,
        x: canvasPos.x,
        y: canvasPos.y,
        width,
        height,
        rotation: 0,
        opacity: 1,
        visible: true,
        locked: false,
        fill,
        fillOpacity: 1,
        stroke,
        strokeWidth,
        strokeStyle: 'solid',
        strokeOpacity: 1,
        effects: [],
        text: activeTool === 'text' ? 'Type text here' : undefined,
        fontSize: activeTool === 'text' ? 18 : undefined,
        fontFamily: activeTool === 'text' ? 'Inter' : undefined,
      });

      setCurrentCreatingId(id);
      return;
    }

    // Select Tool: Clicked on empty canvas -> clear selection & start Marquee Box Drag
    if (activeTool === 'select') {
      clearSelection();
      setEditingTextId(null);
      setIsMarqueeActive(true);
      setMarqueeStart(canvasPos);
      setMarqueeBox({ x: canvasPos.x, y: canvasPos.y, width: 0, height: 0 });
    }
  };

  // Mouse Move handler
  const handleMouseMove = (e: React.MouseEvent) => {
    // Broadcast live cursor to collaborators
    const canvasPos = screenToCanvas(e.clientX, e.clientY);
    updateMyCursor(canvasPos);

    // Pan Canvas
    if (isDraggingCanvas) {
      setPanOffset({
        x: initialPan.x + (e.clientX - dragStart.x),
        y: initialPan.y + (e.clientY - dragStart.y),
      });
      return;
    }

    // Marquee Selection Drag Box
    if (isMarqueeActive) {
      const box = {
        x: Math.min(marqueeStart.x, canvasPos.x),
        y: Math.min(marqueeStart.y, canvasPos.y),
        width: Math.abs(canvasPos.x - marqueeStart.x),
        height: Math.abs(canvasPos.y - marqueeStart.y),
      };
      setMarqueeBox(box);

      if (box.width > 2 || box.height > 2) {
        const hitIds = elements
          .filter((el) => {
            if (!el.visible) return false;
            return (
              el.x < box.x + box.width &&
              el.x + el.width > box.x &&
              el.y < box.y + box.height &&
              el.y + el.height > box.y
            );
          })
          .map((el) => el.id);
        setSelectedIds(hitIds);
      }
      return;
    }

    // Drawing Pencil Tool
    if (isDrawing && currentCreatingId) {
      const newPts: [number, number, number][] = [...pencilPoints, [canvasPos.x, canvasPos.y, 0.5]];
      setPencilPoints(newPts);
      updateElement(currentCreatingId, { points: newPts });
      return;
    }

    // Shape Drag Creation
    if (isCreating && currentCreatingId) {
      const w = Math.max(Math.abs(canvasPos.x - createStartPoint.x), 10);
      const h = Math.max(Math.abs(canvasPos.y - createStartPoint.y), 10);
      const x = Math.min(canvasPos.x, createStartPoint.x);
      const y = Math.min(canvasPos.y, createStartPoint.y);

      updateElement(currentCreatingId, { x, y, width: w, height: h });
      return;
    }

    // Rotating Single Element
    if (isRotating && selectedIds.length === 1) {
      const elId = selectedIds[0];
      const rad = Math.atan2(canvasPos.y - rotateCenter.y, canvasPos.x - rotateCenter.x);
      let deg = Math.round((rad * 180) / Math.PI + 90);
      if (e.shiftKey) deg = Math.round(deg / 15) * 15; // Snap to 15 deg
      updateElement(elId, { rotation: deg });
      return;
    }

    // Resizing Element
    if (resizingHandle && resizeStartElement) {
      let { x, y, width, height } = resizeStartElement;
      const dx = canvasPos.x - moveStartPos.x;
      const dy = canvasPos.y - moveStartPos.y;

      if (resizingHandle.includes('e')) width = Math.max(width + dx, 10);
      if (resizingHandle.includes('s')) height = Math.max(height + dy, 10);
      if (resizingHandle.includes('w')) {
        const newW = Math.max(width - dx, 10);
        x = x + (width - newW);
        width = newW;
      }
      if (resizingHandle.includes('n')) {
        const newH = Math.max(height - dy, 10);
        y = y + (height - newH);
        height = newH;
      }

      updateElement(resizeStartElement.id, { x, y, width, height });
      return;
    }

    // Moving Element(s)
    if (isMovingElement && selectedIds.length > 0) {
      const dx = canvasPos.x - moveStartPos.x;
      const dy = canvasPos.y - moveStartPos.y;

      const updates: { id: string; changes: Partial<CanvasElement> }[] = [];

      // Calculate snapping for the primary dragged element
      let primarySnapX = 0;
      let primarySnapY = 0;
      let calculatedGuides: any[] = [];

      const primaryId = selectedIds[0];
      const primaryInitial = initialElementPositions.get(primaryId);

      if (primaryInitial && snapToGrid) {
        const primaryEl = elements.find((e) => e.id === primaryId);
        if (primaryEl) {
          const testPos = {
            x: primaryInitial.x + dx,
            y: primaryInitial.y + dy,
            width: primaryEl.width,
            height: primaryEl.height,
          };
          const otherEls = elements.filter((e) => !selectedIds.includes(e.id));
          const snapRes = calculateSnapping(testPos, otherEls);
          primarySnapX = snapRes.snappedX - (primaryInitial.x + dx);
          primarySnapY = snapRes.snappedY - (primaryInitial.y + dy);
          calculatedGuides = snapRes.guides;
        }
      }

      setSmartGuides(calculatedGuides);

      initialElementPositions.forEach((initial, id) => {
        updates.push({
          id,
          changes: {
            x: Math.round(initial.x + dx + primarySnapX),
            y: Math.round(initial.y + dy + primarySnapY),
          },
        });
      });

      updateElements(updates);
    }
  };

  // Mouse Up handler
  const handleMouseUp = () => {
    setIsDraggingCanvas(false);

    if (isMarqueeActive) {
      setIsMarqueeActive(false);
      setMarqueeBox(null);
    }

    if (isCreating || isDrawing) {
      setIsCreating(false);
      setIsDrawing(false);
      setCurrentCreatingId(null);
      setActiveTool('select');
      recordHistory();
    }

    if (isMovingElement) {
      setIsMovingElement(false);
      setSmartGuides([]);
      recordHistory();
    }

    if (resizingHandle) {
      setResizingHandle(null);
      setResizeStartElement(null);
      recordHistory();
    }

    if (isRotating) {
      setIsRotating(false);
      recordHistory();
    }
  };

  // Select and start dragging element (including recursive children inside frames/groups)
  const handleElementMouseDown = (e: React.MouseEvent, id: string) => {
    if (activeTool !== 'select') return;
    e.stopPropagation();

    const isMulti = e.shiftKey;
    if (!selectedIds.includes(id)) {
      selectElement(id, isMulti);
    }

    setIsMovingElement(true);
    const canvasPos = screenToCanvas(e.clientX, e.clientY);
    setMoveStartPos(canvasPos);

    // Collect element and all its children/descendants so moving frame moves its children
    const movingIds = new Set<string>(selectedIds.includes(id) ? selectedIds : [id]);
    let added = true;
    while (added) {
      added = false;
      elements.forEach((el) => {
        if (el.parentId && movingIds.has(el.parentId) && !movingIds.has(el.id)) {
          movingIds.add(el.id);
          added = true;
        }
      });
    }

    const positions = new Map<string, Point>();
    elements.forEach((el) => {
      if (movingIds.has(el.id)) {
        positions.set(el.id, { x: el.x, y: el.y });
      }
    });
    setInitialElementPositions(positions);
  };

  // Double click for in-place text editing
  const handleElementDoubleClick = (e: React.MouseEvent, el: CanvasElement) => {
    e.stopPropagation();
    if (el.type === 'text') {
      setEditingTextId(el.id);
    }
  };

  // Resize Handle Start
  const handleResizeStart = (handle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIds.length !== 1) return;
    const el = elements.find((item) => item.id === selectedIds[0]);
    if (!el) return;

    setResizingHandle(handle);
    setResizeStartElement({ ...el });
    const canvasPos = screenToCanvas(e.clientX, e.clientY);
    setMoveStartPos(canvasPos);
  };

  // Rotate Start
  const handleRotateStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIds.length !== 1) return;
    const el = elements.find((item) => item.id === selectedIds[0]);
    if (!el) return;

    setIsRotating(true);
    setRotateCenter({ x: el.x + el.width / 2, y: el.y + el.height / 2 });
  };

  // Add new comment
  const handleCreateComment = () => {
    if (!newCommentPos || !commentInput.trim()) {
      setNewCommentPos(null);
      return;
    }
    addComment(
      newCommentPos.x,
      newCommentPos.y,
      commentInput.trim(),
      currentUser.name,
      currentUser.color
    );
    setNewCommentPos(null);
    setCommentInput('');
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className={`relative h-full w-full overflow-hidden bg-[#1e1e1e] ${
        activeTool === 'hand' || isSpacePressed
          ? isDraggingCanvas
            ? 'cursor-grabbing'
            : 'cursor-grab'
          : activeTool === 'pencil'
          ? 'cursor-crosshair'
          : activeTool !== 'select'
          ? 'cursor-crosshair'
          : 'cursor-default'
      }`}
    >
      {/* Figma Pixel Grid Background */}
      {showGrid && (
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle, #71717a 1px, transparent 1px)`,
            backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
            backgroundPosition: `${panOffset.x}px ${panOffset.y}px`,
          }}
        />
      )}

      {/* Rulers */}
      <Rulers />

      {/* Smart Snapping Guides */}
      <SmartGuides />

      {/* Multiplayer Live Cursors */}
      <MultiplayerCursors />

      {/* Canvas Elements & Transformations Root */}
      <div
        className="absolute inset-0 origin-top-left pointer-events-none"
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
        }}
      >
        {/* Render Elements */}
        {elements.map((el) => (
          <div
            key={el.id}
            onMouseDown={(e) => handleElementMouseDown(e, el.id)}
            onDoubleClick={(e) => handleElementDoubleClick(e, el)}
            onMouseEnter={() => setHoveredId(el.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="cursor-pointer"
          >
            <CanvasElementRenderer
              element={el}
              isSelected={selectedIds.includes(el.id)}
              isEditingText={editingTextId === el.id}
              onTextChange={(id, text) => updateElement(id, { text })}
            />
          </div>
        ))}

        {/* Prototype Connection Noodles */}
        <PrototypeNoodles />

        {/* Distance Guides (Alt/Option measurement) */}
        <DistanceGuides />

        {/* Marquee Selection Drag Box */}
        {marqueeBox && (
          <div
            className="pointer-events-none absolute border border-[#0d99ff] bg-[#0d99ff]/15 z-50 rounded-[1px]"
            style={{
              left: `${marqueeBox.x}px`,
              top: `${marqueeBox.y}px`,
              width: `${marqueeBox.width}px`,
              height: `${marqueeBox.height}px`,
            }}
          />
        )}

        {/* Interactive Selection Overlay */}
        <SelectionOverlay
          elements={elements}
          selectedIds={selectedIds}
          zoom={zoom}
          onResizeStart={handleResizeStart}
          onRotateStart={handleRotateStart}
        />

        {/* Render Canvas Comments */}
        {comments.map((comment) => (
          <div
            key={comment.id}
            onClick={(e) => {
              e.stopPropagation();
              setActiveCommentId(comment.id);
            }}
            className="pointer-events-auto absolute z-40 flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
            style={{
              left: `${comment.x}px`,
              top: `${comment.y}px`,
            }}
          >
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full shadow-lg ${
                comment.resolved ? 'opacity-60 bg-gray-600' : ''
              }`}
              style={{ backgroundColor: comment.resolved ? undefined : comment.authorColor }}
            >
              <MessageSquare className="h-4 w-4 text-white fill-white" />
            </div>

            {/* Comment Popover */}
            {activeCommentId === comment.id && (
              <div
                className="absolute top-8 left-0 z-50 w-64 rounded-lg border border-[#333] bg-[#222222] p-3 shadow-2xl text-left"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                  <span className="font-semibold text-white">{comment.author}</span>
                  <span>{new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-xs text-gray-200">{comment.content}</p>
                <div className="mt-2 flex items-center justify-between border-t border-[#333] pt-2">
                  <button
                    onClick={() => resolveComment(comment.id)}
                    className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300"
                  >
                    <Check className="h-3 w-3" />
                    {comment.resolved ? 'Reopen' : 'Resolve'}
                  </button>
                  <button
                    onClick={() => setActiveCommentId(null)}
                    className="text-[11px] text-gray-400 hover:text-white"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* New Comment Drop Input */}
        {newCommentPos && (
          <div
            className="pointer-events-auto absolute z-50 rounded-lg border border-indigo-500 bg-[#222222] p-3 shadow-2xl w-64"
            style={{ left: `${newCommentPos.x}px`, top: `${newCommentPos.y}px` }}
          >
            <div className="text-xs font-semibold text-indigo-400 mb-1">Add Comment</div>
            <textarea
              autoFocus
              rows={2}
              placeholder="Leave feedback or note..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              className="w-full resize-none rounded bg-[#18181b] p-2 text-xs text-white outline-none border border-[#3f3f46] focus:border-indigo-500"
            />
            <div className="mt-2 flex justify-end gap-2">
              <button
                onClick={() => setNewCommentPos(null)}
                className="rounded px-2 py-1 text-[11px] text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateComment}
                className="rounded bg-indigo-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-indigo-500"
              >
                Post
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
