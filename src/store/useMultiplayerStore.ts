import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type { Collaborator, Point } from '../types/canvas';

interface MultiplayerState {
  currentUser: Collaborator;
  collaborators: Collaborator[];
  channel: BroadcastChannel | null;
  
  // Actions
  initMultiplayer: () => void;
  updateMyCursor: (pos: Point) => void;
  updateMySelection: (ids: string[]) => void;
  setUserName: (name: string) => void;
  setUserColor: (color: string) => void;
}

const FIGMA_COLORS = [
  '#f43f5e', // rose
  '#06b6d4', // cyan
  '#10b981', // emerald
  '#8b5cf6', // violet
  '#f59e0b', // amber
  '#ec4899', // pink
  '#3b82f6', // blue
];

const RANDOM_NAMES = [
  'Alex Designer',
  'Devin Coder',
  'Sam Product',
  'Jordan UX',
  'Taylor Lead',
  'Morgan Creative',
];

export const useMultiplayerStore = create<MultiplayerState>((set, get) => {
  const initialColor = FIGMA_COLORS[Math.floor(Math.random() * FIGMA_COLORS.length)];
  const initialName = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
  const initialId = nanoid(6);

  return {
    currentUser: {
      id: initialId,
      name: initialName,
      color: initialColor,
      lastActive: Date.now(),
      selectedElementIds: [],
    },
    collaborators: [
      // Simulated live collaborator for instant demo
      {
        id: 'collab-alex',
        name: 'Sarah (Design Lead)',
        color: '#f43f5e',
        cursor: { x: 420, y: 220 },
        lastActive: Date.now(),
        selectedElementIds: ['rect-bg-glow'],
      },
      {
        id: 'collab-dev',
        name: 'Ken (Frontend)',
        color: '#06b6d4',
        cursor: { x: 780, y: 350 },
        lastActive: Date.now(),
        selectedElementIds: ['widget-1'],
      }
    ],
    channel: null,

    initMultiplayer: () => {
      try {
        const channel = new BroadcastChannel('figma-clone-sync');
        
        channel.onmessage = (event) => {
          const { type, payload } = event.data;
          const { currentUser } = get();

          if (payload.id === currentUser.id) return;

          if (type === 'cursor-move') {
            set((state) => {
              const existingIdx = state.collaborators.findIndex((c) => c.id === payload.id);
              if (existingIdx !== -1) {
                const updated = [...state.collaborators];
                updated[existingIdx] = {
                  ...updated[existingIdx],
                  cursor: payload.cursor,
                  lastActive: Date.now(),
                };
                return { collaborators: updated };
              } else {
                return {
                  collaborators: [
                    ...state.collaborators,
                    {
                      id: payload.id,
                      name: payload.name,
                      color: payload.color,
                      cursor: payload.cursor,
                      lastActive: Date.now(),
                      selectedElementIds: [],
                    },
                  ],
                };
              }
            });
          }
        };

        set({ channel });
      } catch (err) {
        console.warn('BroadcastChannel not available:', err);
      }
    },

    updateMyCursor: (pos) => {
      const { currentUser, channel } = get();
      set({
        currentUser: { ...currentUser, cursor: pos, lastActive: Date.now() },
      });

      if (channel) {
        channel.postMessage({
          type: 'cursor-move',
          payload: {
            id: currentUser.id,
            name: currentUser.name,
            color: currentUser.color,
            cursor: pos,
          },
        });
      }
    },

    updateMySelection: (ids) => {
      set((state) => ({
        currentUser: { ...state.currentUser, selectedElementIds: ids },
      }));
    },

    setUserName: (name) => {
      set((state) => ({
        currentUser: { ...state.currentUser, name },
      }));
    },

    setUserColor: (color) => {
      set((state) => ({
        currentUser: { ...state.currentUser, color },
      }));
    },
  };
});
