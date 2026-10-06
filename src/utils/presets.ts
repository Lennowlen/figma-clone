import type { FramePreset } from '../types/canvas';

export const FRAME_PRESETS: FramePreset[] = [
  // Phone
  { name: 'iPhone 16 Pro', category: 'Phone', width: 402, height: 874 },
  { name: 'iPhone 16 Pro Max', category: 'Phone', width: 440, height: 956 },
  { name: 'iPhone 15 / 14', category: 'Phone', width: 393, height: 852 },
  { name: 'Android Large', category: 'Phone', width: 360, height: 800 },
  { name: 'Android Small', category: 'Phone', width: 360, height: 640 },

  // Tablet
  { name: 'iPad Pro 12.9"', category: 'Tablet', width: 1024, height: 1366 },
  { name: 'iPad Pro 11"', category: 'Tablet', width: 834, height: 1194 },
  { name: 'iPad Air', category: 'Tablet', width: 820, height: 1180 },
  { name: 'iPad Mini', category: 'Tablet', width: 744, height: 1133 },

  // Desktop
  { name: 'Desktop (1440)', category: 'Desktop', width: 1440, height: 1024 },
  { name: 'MacBook Air (1280)', category: 'Desktop', width: 1280, height: 832 },
  { name: 'MacBook Pro 14"', category: 'Desktop', width: 1512, height: 982 },
  { name: 'MacBook Pro 16"', category: 'Desktop', width: 1728, height: 1117 },
  { name: 'Full HD (1920x1080)', category: 'Desktop', width: 1920, height: 1080 },

  // Watch
  { name: 'Apple Watch 45mm', category: 'Watch', width: 198, height: 242 },
  { name: 'Apple Watch 41mm', category: 'Watch', width: 176, height: 215 },
  { name: 'Apple Watch Ultra', category: 'Watch', width: 205, height: 251 },

  // Social Media
  { name: 'Instagram Post (1:1)', category: 'Social Media', width: 1080, height: 1080 },
  { name: 'Instagram Story (9:16)', category: 'Social Media', width: 1080, height: 1920 },
  { name: 'Twitter/X Header', category: 'Social Media', width: 1500, height: 500 },
  { name: 'Dribbble Shot', category: 'Social Media', width: 1600, height: 1200 },
  { name: 'YouTube Thumbnail', category: 'Social Media', width: 1280, height: 720 },
];
