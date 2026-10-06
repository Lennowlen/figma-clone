import React, { useState } from 'react';
import { useCanvasStore } from '../../store/useCanvasStore';
import { CanvasElementRenderer } from '../canvas/CanvasElementRenderer';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Smartphone,
  Monitor,
  Sparkles,
} from 'lucide-react';

interface PresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PresentationModal: React.FC<PresentationModalProps> = ({ isOpen, onClose }) => {
  const { elements } = useCanvasStore();

  // Find all top-level frames
  const frames = elements.filter((el) => el.type === 'frame' && !el.parentId);
  const [activeFrameIndex, setActiveFrameIndex] = useState(0);
  const [deviceSkin, setDeviceSkin] = useState<'fit' | 'iphone' | 'desktop'>('fit');
  const [hotspotEffect, setHotspotEffect] = useState<{ x: number; y: number } | null>(null);

  if (!isOpen) return null;

  const currentFrame = frames[activeFrameIndex] || frames[0];
  const frameChildren = currentFrame
    ? elements.filter((el) => el.parentId === currentFrame.id)
    : [];

  const handleNext = () => {
    if (activeFrameIndex < frames.length - 1) {
      setActiveFrameIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (activeFrameIndex > 0) {
      setActiveFrameIndex((prev) => prev - 1);
    }
  };

  const handleElementInteraction = (el: any, e: React.MouseEvent) => {
    if (el.prototypeInteractions?.length) {
      const clickInter = el.prototypeInteractions.find((i: any) => i.trigger === 'onClick');
      if (clickInter) {
        const targetIdx = frames.findIndex((f) => f.id === clickInter.targetFrameId);
        if (targetIdx !== -1) {
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          setHotspotEffect({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          });
          setTimeout(() => setHotspotEffect(null), 600);
          setActiveFrameIndex(targetIdx);
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex flex-col bg-[#0b0b0e] text-zinc-100 select-none font-sans">
      {/* Presentation Top Control Bar */}
      <div className="flex h-12 items-center justify-between border-b border-white/10 bg-[#16161a]/95 px-4 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition-all border border-white/5"
            title="Exit Presentation Mode (Esc)"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="h-4 w-[1px] bg-white/10" />
          <span className="text-xs font-semibold text-zinc-200 tracking-wide">
            {currentFrame ? currentFrame.name : 'Untitled Frame'}
          </span>
          {frames.length > 1 && (
            <span className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] font-mono text-zinc-400 border border-white/5">
              {activeFrameIndex + 1} / {frames.length}
            </span>
          )}
        </div>

        {/* Center: Device skin selector */}
        <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-[#202026]/90 p-1 backdrop-blur-md">
          <button
            onClick={() => setDeviceSkin('fit')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
              deviceSkin === 'fit' ? 'bg-[#0d99ff] text-white shadow-sm shadow-[#0d99ff]/30' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Monitor className="h-3.5 w-3.5" /> Fit Frame
          </button>
          <button
            onClick={() => setDeviceSkin('iphone')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
              deviceSkin === 'iphone' ? 'bg-[#0d99ff] text-white shadow-sm shadow-[#0d99ff]/30' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" /> iPhone Device
          </button>
        </div>

        {/* Right: Slide Controls & Exit */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={activeFrameIndex === 0}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-zinc-300 hover:bg-white/10 disabled:opacity-30 transition-all border border-white/5"
            title="Previous Frame (Left Arrow)"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={handleNext}
            disabled={activeFrameIndex >= frames.length - 1}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-zinc-300 hover:bg-white/10 disabled:opacity-30 transition-all border border-white/5"
            title="Next Frame (Right Arrow)"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              if (document.fullscreenElement) {
                document.exitFullscreen();
              } else {
                document.documentElement.requestFullscreen();
              }
            }}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white transition-all border border-white/5"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Prototype Viewport */}
      <div className="relative flex flex-1 items-center justify-center overflow-auto p-8">
        {!currentFrame ? (
          <div className="text-center text-zinc-500">
            <Sparkles className="mx-auto mb-2 h-8 w-8 text-zinc-600" />
            <p className="text-sm font-semibold text-zinc-300">No Frames to present</p>
            <p className="text-xs text-zinc-500 mt-1">Create a Frame in the canvas and switch to Prototype mode</p>
          </div>
        ) : deviceSkin === 'iphone' ? (
          /* iPhone Realistic Bezel Container */
          <div
            className="relative rounded-[54px] border-[12px] border-[#222228] bg-black p-3.5 shadow-[0_36px_80px_rgba(0,0,0,0.9)] ring-1 ring-white/10 transition-all duration-300"
            style={{ width: 420, height: 860 }}
          >
            {/* Dynamic Island Notch */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 h-7 w-32 rounded-full bg-black flex items-center justify-between px-3.5 ring-1 ring-white/10 shadow-lg">
              <div className="h-2.5 w-2.5 rounded-full bg-[#111827] ring-1 ring-blue-500/30" />
              <div className="h-2 w-2 rounded-full bg-emerald-500/90 animate-pulse shadow-sm shadow-emerald-500/50" />
            </div>

            {/* Frame Inner Screen Viewport */}
            <div className="relative h-full w-full overflow-hidden rounded-[40px] bg-slate-900">
              {hotspotEffect && (
                <div
                  className="prototype-hit-ripple z-50"
                  style={{
                    left: hotspotEffect.x - 20,
                    top: hotspotEffect.y - 20,
                    width: 40,
                    height: 40,
                  }}
                />
              )}
              <div
                style={{
                  position: 'relative',
                  width: currentFrame.width,
                  height: currentFrame.height,
                  transform: `scale(${392 / currentFrame.width})`,
                  transformOrigin: 'top left',
                  backgroundColor: currentFrame.fill,
                }}
              >
                {frameChildren.map((el) => {
                  const relativeX = el.x - currentFrame.x;
                  const relativeY = el.y - currentFrame.y;
                  const hasInteraction = !!el.prototypeInteractions?.length;

                  return (
                    <div
                      key={el.id}
                      onClick={(e) => handleElementInteraction(el, e)}
                      style={{
                        position: 'absolute',
                        left: relativeX,
                        top: relativeY,
                        width: el.width,
                        height: el.height,
                        transform: `rotate(${el.rotation}deg)`,
                      }}
                      className={hasInteraction ? 'cursor-pointer transition-transform active:scale-95' : ''}
                    >
                      <CanvasElementRenderer element={el} />
                    </div>
                  );
                })}
              </div>
            </div>
            {/* iOS Home Indicator Bar */}
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 h-1 w-32 rounded-full bg-white/30" />
          </div>
        ) : (
          /* Freeform Framed View */
          <div
            className="relative shadow-[0_32px_64px_rgba(0,0,0,0.8)] transition-all duration-300 ring-1 ring-white/10"
            style={{
              width: currentFrame.width,
              height: currentFrame.height,
              backgroundColor: currentFrame.fill,
              borderRadius: currentFrame.cornerRadius || 0,
              overflow: currentFrame.clipContent ? 'hidden' : 'visible',
            }}
          >
            {frameChildren.map((el) => {
              const relativeX = el.x - currentFrame.x;
              const relativeY = el.y - currentFrame.y;
              const hasInteraction = !!el.prototypeInteractions?.length;

              return (
                <div
                  key={el.id}
                  onClick={(e) => handleElementInteraction(el, e)}
                  style={{
                    position: 'absolute',
                    left: relativeX,
                    top: relativeY,
                    width: el.width,
                    height: el.height,
                    transform: `rotate(${el.rotation}deg)`,
                  }}
                  className={hasInteraction ? 'cursor-pointer transition-transform active:scale-95' : ''}
                >
                  <CanvasElementRenderer element={el} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
