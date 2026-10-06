import React, { useState } from 'react';
import { useCanvasStore } from '../../store/useCanvasStore';
import type { CanvasElement } from '../../types/canvas';
import { nanoid } from 'nanoid';
import {
  Sparkles,
  X,
  Wand2,
  Layout,
  Smartphone,
  CreditCard,
  BarChart3,
  UserCheck,
  ShoppingBag,
  Palette,
  Loader2,
} from 'lucide-react';

interface AiDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PromptPreset {
  title: string;
  category: string;
  description: string;
  prompt: string;
  icon: React.ReactNode;
}

const PROMPT_PRESETS: PromptPreset[] = [
  {
    title: 'Mobile Crypto Wallet',
    category: 'Mobile App',
    description: 'Dark mode crypto balance card, send/receive actions, & recent activity list',
    prompt: 'Design a high-end dark mobile crypto portfolio screen with balance card, quick actions, and token list',
    icon: <CreditCard className="h-4 w-4 text-purple-400" />,
  },
  {
    title: 'SaaS Analytics Dashboard',
    category: 'Web App',
    description: 'Header, 3 metric KPI cards, interactive graph mockup, and table preview',
    prompt: 'Create a modern SaaS metrics dashboard with KPI cards, revenue graph widget, and recent transactions',
    icon: <BarChart3 className="h-4 w-4 text-blue-400" />,
  },
  {
    title: 'Mobile Auth & Onboarding',
    category: 'Mobile App',
    description: 'Clean login flow with social sign-in, branded illustration, and inputs',
    prompt: 'Generate an elegant mobile login and sign up screen with modern form fields and gradient CTA',
    icon: <UserCheck className="h-4 w-4 text-emerald-400" />,
  },
  {
    title: 'E-Commerce Product Detail',
    category: 'Web / Mobile',
    description: 'Product hero banner, rating, color selector, price, and add-to-cart button',
    prompt: 'Design a luxury ecommerce product showcase card with price badge, rating stars, and buy button',
    icon: <ShoppingBag className="h-4 w-4 text-pink-400" />,
  },
];

export const AiDesignModal: React.FC<AiDesignModalProps> = ({ isOpen, onClose }) => {
  const { addElement, setSelectedIds, panOffset, zoom } = useCanvasStore();
  const [prompt, setPrompt] = useState('');
  const [designStyle, setDesignStyle] = useState<'modern' | 'minimal' | 'cyberpunk' | 'glassmorphism'>('modern');
  const [deviceTarget, setDeviceTarget] = useState<'mobile' | 'desktop' | 'card'>('mobile');
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  if (!isOpen) return null;

  const handleGenerate = () => {
    if (!prompt.trim() && !statusMessage) return;

    setIsGenerating(true);
    setStatusMessage('Analyzing requirements and visual hierarchy...');

    setTimeout(() => {
      setStatusMessage('Synthesizing design tokens, typography & color system...');
    }, 600);

    setTimeout(() => {
      setStatusMessage('Assembling responsive vector elements & layout...');
    }, 1200);

    setTimeout(() => {
      // Spawn near viewport center
      const startX = Math.round((-panOffset.x + 350) / zoom);
      const startY = Math.round((-panOffset.y + 120) / zoom);

      const generatedElements: CanvasElement[] = [];
      const frameId = `frame-ai-${nanoid(6)}`;

      if (deviceTarget === 'mobile' || prompt.toLowerCase().includes('mobile') || prompt.toLowerCase().includes('wallet') || prompt.toLowerCase().includes('login')) {
        // MOBILE SCREEN GENERATION
        const isCrypto = prompt.toLowerCase().includes('crypto') || prompt.toLowerCase().includes('wallet');
        const isLogin = prompt.toLowerCase().includes('login') || prompt.toLowerCase().includes('auth') || prompt.toLowerCase().includes('sign');

        const frameFill = designStyle === 'cyberpunk' ? '#090a16' : '#0f172a';
        const accentColor = designStyle === 'cyberpunk' ? '#06b6d4' : '#6366f1';
        const primaryTextColor = '#ffffff';
        const secondaryTextColor = '#94a3b8';

        // 1. Root Mobile Frame
        const rootFrame: CanvasElement = {
          id: frameId,
          name: isCrypto ? 'AI: Crypto Wallet App' : isLogin ? 'AI: Mobile Onboarding' : 'AI: Mobile Experience',
          type: 'frame',
          x: startX,
          y: startY,
          width: 390,
          height: 844,
          rotation: 0,
          opacity: 1,
          visible: true,
          locked: false,
          fill: frameFill,
          fillOpacity: 1,
          stroke: '#334155',
          strokeWidth: 1,
          strokeStyle: 'solid',
          strokeOpacity: 1,
          cornerRadius: 44,
          effects: [{ x: 0, y: 24, blur: 48, spread: -12, color: 'rgba(0,0,0,0.6)', opacity: 0.6, type: 'drop-shadow' }],
          clipContent: true,
          presetName: 'iPhone 16 Pro',
        };
        generatedElements.push(rootFrame);

        // 2. Status Bar Notch / Dynamic Island
        generatedElements.push({
          id: `ai-elem-${nanoid(6)}`,
          name: 'Dynamic Island',
          type: 'rectangle',
          parentId: frameId,
          x: startX + 135,
          y: startY + 12,
          width: 120,
          height: 32,
          rotation: 0,
          opacity: 1,
          visible: true,
          locked: false,
          fill: '#000000',
          fillOpacity: 1,
          stroke: '#27272a',
          strokeWidth: 1,
          strokeStyle: 'solid',
          strokeOpacity: 1,
          cornerRadius: 20,
          effects: [],
        });

        if (isCrypto) {
          // Top Bar Title
          generatedElements.push({
            id: `ai-elem-${nanoid(6)}`,
            name: 'Screen Header',
            type: 'text',
            parentId: frameId,
            x: startX + 24,
            y: startY + 68,
            width: 200,
            height: 28,
            rotation: 0,
            opacity: 1,
            visible: true,
            locked: false,
            fill: '#ffffff',
            fillOpacity: 1,
            stroke: 'transparent',
            strokeWidth: 0,
            strokeStyle: 'solid',
            strokeOpacity: 0,
            text: 'My Portfolio',
            fontSize: 22,
            fontFamily: 'Inter',
            fontWeight: 'bold',
            textAlign: 'left',
            effects: [],
          });

          // Balance Card Hero
          const cardId = `ai-elem-${nanoid(6)}`;
          generatedElements.push({
            id: cardId,
            name: 'Hero Balance Card',
            type: 'rectangle',
            parentId: frameId,
            x: startX + 20,
            y: startY + 112,
            width: 350,
            height: 180,
            rotation: 0,
            opacity: 1,
            visible: true,
            locked: false,
            fill: '#1e1b4b',
            fillOpacity: 1,
            stroke: '#4338ca',
            strokeWidth: 1.5,
            strokeStyle: 'solid',
            strokeOpacity: 1,
            cornerRadius: 24,
            effects: [{ x: 0, y: 12, blur: 30, spread: -6, color: 'rgba(99,102,241,0.35)', opacity: 0.4, type: 'drop-shadow' }],
          });

          // Card Label
          generatedElements.push({
            id: `ai-elem-${nanoid(6)}`,
            name: 'Total Balance Label',
            type: 'text',
            parentId: frameId,
            x: startX + 44,
            y: startY + 136,
            width: 200,
            height: 20,
            rotation: 0,
            opacity: 1,
            visible: true,
            locked: false,
            fill: '#a5b4fc',
            fillOpacity: 1,
            stroke: 'transparent',
            strokeWidth: 0,
            strokeStyle: 'solid',
            strokeOpacity: 0,
            text: 'TOTAL BALANCE',
            fontSize: 12,
            fontFamily: 'Inter',
            fontWeight: '600',
            textAlign: 'left',
            letterSpacing: 1,
            effects: [],
          });

          // Big Amount
          generatedElements.push({
            id: `ai-elem-${nanoid(6)}`,
            name: 'Portfolio Amount',
            type: 'text',
            parentId: frameId,
            x: startX + 44,
            y: startY + 164,
            width: 260,
            height: 44,
            rotation: 0,
            opacity: 1,
            visible: true,
            locked: false,
            fill: '#ffffff',
            fillOpacity: 1,
            stroke: 'transparent',
            strokeWidth: 0,
            strokeStyle: 'solid',
            strokeOpacity: 0,
            text: '$84,290.50',
            fontSize: 34,
            fontFamily: 'Inter',
            fontWeight: '800',
            textAlign: 'left',
            effects: [],
          });

          // Growth Badge
          generatedElements.push({
            id: `ai-elem-${nanoid(6)}`,
            name: 'Profit Badge',
            type: 'rectangle',
            parentId: frameId,
            x: startX + 44,
            y: startY + 224,
            width: 96,
            height: 28,
            rotation: 0,
            opacity: 1,
            visible: true,
            locked: false,
            fill: '#064e3b',
            fillOpacity: 1,
            stroke: '#059669',
            strokeWidth: 1,
            strokeStyle: 'solid',
            strokeOpacity: 1,
            cornerRadius: 14,
            effects: [],
          });

          generatedElements.push({
            id: `ai-elem-${nanoid(6)}`,
            name: 'Profit Text',
            type: 'text',
            parentId: frameId,
            x: startX + 54,
            y: startY + 229,
            width: 80,
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
            strokeOpacity: 0,
            text: '▲ +14.8%',
            fontSize: 12,
            fontFamily: 'Inter',
            fontWeight: 'bold',
            textAlign: 'center',
            effects: [],
          });

          // Quick Action Buttons
          const actions = ['Send', 'Receive', 'Swap', 'Deposit'];
          actions.forEach((act, idx) => {
            const btnX = startX + 24 + idx * 88;
            const btnY = startY + 312;

            generatedElements.push({
              id: `ai-elem-${nanoid(6)}`,
              name: `Action ${act} Circle`,
              type: 'ellipse',
              parentId: frameId,
              x: btnX + 8,
              y: btnY,
              width: 52,
              height: 52,
              rotation: 0,
              opacity: 1,
              visible: true,
              locked: false,
              fill: '#1e293b',
              fillOpacity: 1,
              stroke: '#334155',
              strokeWidth: 1,
              strokeStyle: 'solid',
              strokeOpacity: 1,
              effects: [],
            });

            generatedElements.push({
              id: `ai-elem-${nanoid(6)}`,
              name: `Action ${act} Label`,
              type: 'text',
              parentId: frameId,
              x: btnX,
              y: btnY + 60,
              width: 68,
              height: 18,
              rotation: 0,
              opacity: 1,
              visible: true,
              locked: false,
              fill: secondaryTextColor,
              fillOpacity: 1,
              stroke: 'transparent',
              strokeWidth: 0,
              strokeStyle: 'solid',
              strokeOpacity: 0,
              text: act,
              fontSize: 12,
              fontFamily: 'Inter',
              fontWeight: '500',
              textAlign: 'center',
              effects: [],
            });
          });

          // Watchlist Section Header
          generatedElements.push({
            id: `ai-elem-${nanoid(6)}`,
            name: 'Assets Header',
            type: 'text',
            parentId: frameId,
            x: startX + 24,
            y: startY + 410,
            width: 200,
            height: 22,
            rotation: 0,
            opacity: 1,
            visible: true,
            locked: false,
            fill: primaryTextColor,
            fillOpacity: 1,
            stroke: 'transparent',
            strokeWidth: 0,
            strokeStyle: 'solid',
            strokeOpacity: 0,
            text: 'Top Holdings',
            fontSize: 16,
            fontFamily: 'Inter',
            fontWeight: '600',
            textAlign: 'left',
            effects: [],
          });

          // List Items
          const tokens = [
            { name: 'Bitcoin', symbol: 'BTC', price: '$94,320', change: '+3.4%', color: '#f59e0b' },
            { name: 'Ethereum', symbol: 'ETH', price: '$3,450', change: '+6.1%', color: '#6366f1' },
            { name: 'Solana', symbol: 'SOL', price: '$218', change: '+12.5%', color: '#14b8a6' },
            { name: 'Cardano', symbol: 'ADA', price: '$0.88', change: '-1.2%', color: '#3b82f6' },
          ];

          tokens.forEach((tok, i) => {
            const itemY = startY + 448 + i * 66;

            // Background row
            generatedElements.push({
              id: `ai-elem-${nanoid(6)}`,
              name: `Token Card ${tok.symbol}`,
              type: 'rectangle',
              parentId: frameId,
              x: startX + 20,
              y: itemY,
              width: 350,
              height: 56,
              rotation: 0,
              opacity: 1,
              visible: true,
              locked: false,
              fill: '#1e293b',
              fillOpacity: 0.6,
              stroke: '#334155',
              strokeWidth: 1,
              strokeStyle: 'solid',
              strokeOpacity: 0.6,
              cornerRadius: 16,
              effects: [],
            });

            // Token Icon Circle
            generatedElements.push({
              id: `ai-elem-${nanoid(6)}`,
              name: `Icon ${tok.symbol}`,
              type: 'ellipse',
              parentId: frameId,
              x: startX + 32,
              y: itemY + 12,
              width: 32,
              height: 32,
              rotation: 0,
              opacity: 1,
              visible: true,
              locked: false,
              fill: tok.color,
              fillOpacity: 1,
              stroke: 'transparent',
              strokeWidth: 0,
              strokeStyle: 'solid',
              strokeOpacity: 0,
              effects: [],
            });

            // Token Name
            generatedElements.push({
              id: `ai-elem-${nanoid(6)}`,
              name: `Name ${tok.name}`,
              type: 'text',
              parentId: frameId,
              x: startX + 76,
              y: itemY + 11,
              width: 140,
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
              strokeOpacity: 0,
              text: tok.name,
              fontSize: 14,
              fontFamily: 'Inter',
              fontWeight: '600',
              textAlign: 'left',
              effects: [],
            });

            // Token Symbol
            generatedElements.push({
              id: `ai-elem-${nanoid(6)}`,
              name: `Symbol ${tok.symbol}`,
              type: 'text',
              parentId: frameId,
              x: startX + 76,
              y: itemY + 30,
              width: 100,
              height: 16,
              rotation: 0,
              opacity: 1,
              visible: true,
              locked: false,
              fill: '#64748b',
              fillOpacity: 1,
              stroke: 'transparent',
              strokeWidth: 0,
              strokeStyle: 'solid',
              strokeOpacity: 0,
              text: tok.symbol,
              fontSize: 11,
              fontFamily: 'Inter',
              fontWeight: '500',
              textAlign: 'left',
              effects: [],
            });

            // Price
            generatedElements.push({
              id: `ai-elem-${nanoid(6)}`,
              name: `Price ${tok.symbol}`,
              type: 'text',
              parentId: frameId,
              x: startX + 230,
              y: itemY + 11,
              width: 124,
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
              strokeOpacity: 0,
              text: tok.price,
              fontSize: 14,
              fontFamily: 'Inter',
              fontWeight: '600',
              textAlign: 'right',
              effects: [],
            });

            // Change
            generatedElements.push({
              id: `ai-elem-${nanoid(6)}`,
              name: `Change ${tok.symbol}`,
              type: 'text',
              parentId: frameId,
              x: startX + 230,
              y: itemY + 30,
              width: 124,
              height: 16,
              rotation: 0,
              opacity: 1,
              visible: true,
              locked: false,
              fill: tok.change.startsWith('+') ? '#34d399' : '#f87171',
              fillOpacity: 1,
              stroke: 'transparent',
              strokeWidth: 0,
              strokeStyle: 'solid',
              strokeOpacity: 0,
              text: tok.change,
              fontSize: 11,
              fontFamily: 'Inter',
              fontWeight: '600',
              textAlign: 'right',
              effects: [],
            });
          });

          // Bottom Nav Bar
          generatedElements.push({
            id: `ai-elem-${nanoid(6)}`,
            name: 'Bottom Tab Bar',
            type: 'rectangle',
            parentId: frameId,
            x: startX + 20,
            y: startY + 740,
            width: 350,
            height: 64,
            rotation: 0,
            opacity: 1,
            visible: true,
            locked: false,
            fill: '#090d16',
            fillOpacity: 0.9,
            stroke: '#1e293b',
            strokeWidth: 1,
            strokeStyle: 'solid',
            strokeOpacity: 1,
            cornerRadius: 32,
            effects: [{ x: 0, y: 10, blur: 25, spread: -5, color: 'rgba(0,0,0,0.5)', opacity: 0.5, type: 'drop-shadow' }],
          });
        } else {
          // GENERAL MOBILE / LOGIN SCREEN
          generatedElements.push({
            id: `ai-elem-${nanoid(6)}`,
            name: 'Brand Logo Circle',
            type: 'ellipse',
            parentId: frameId,
            x: startX + 165,
            y: startY + 110,
            width: 60,
            height: 60,
            rotation: 0,
            opacity: 1,
            visible: true,
            locked: false,
            fill: accentColor,
            fillOpacity: 1,
            stroke: '#818cf8',
            strokeWidth: 2,
            strokeStyle: 'solid',
            strokeOpacity: 1,
            effects: [{ x: 0, y: 10, blur: 25, spread: 0, color: 'rgba(99,102,241,0.5)', opacity: 0.5, type: 'drop-shadow' }],
          });

          generatedElements.push({
            id: `ai-elem-${nanoid(6)}`,
            name: 'Heading Title',
            type: 'text',
            parentId: frameId,
            x: startX + 30,
            y: startY + 200,
            width: 330,
            height: 36,
            rotation: 0,
            opacity: 1,
            visible: true,
            locked: false,
            fill: '#ffffff',
            fillOpacity: 1,
            stroke: 'transparent',
            strokeWidth: 0,
            strokeStyle: 'solid',
            strokeOpacity: 0,
            text: 'Welcome Back',
            fontSize: 28,
            fontFamily: 'Inter',
            fontWeight: 'bold',
            textAlign: 'center',
            effects: [],
          });

          generatedElements.push({
            id: `ai-elem-${nanoid(6)}`,
            name: 'Subheading',
            type: 'text',
            parentId: frameId,
            x: startX + 30,
            y: startY + 242,
            width: 330,
            height: 24,
            rotation: 0,
            opacity: 1,
            visible: true,
            locked: false,
            fill: '#94a3b8',
            fillOpacity: 1,
            stroke: 'transparent',
            strokeWidth: 0,
            strokeStyle: 'solid',
            strokeOpacity: 0,
            text: 'Sign in to access your creative studio',
            fontSize: 14,
            fontFamily: 'Inter',
            fontWeight: 'normal',
            textAlign: 'center',
            effects: [],
          });

          // Email Input Box
          generatedElements.push({
            id: `ai-elem-${nanoid(6)}`,
            name: 'Input Email Container',
            type: 'rectangle',
            parentId: frameId,
            x: startX + 30,
            y: startY + 300,
            width: 330,
            height: 52,
            rotation: 0,
            opacity: 1,
            visible: true,
            locked: false,
            fill: '#1e293b',
            fillOpacity: 0.8,
            stroke: '#334155',
            strokeWidth: 1,
            strokeStyle: 'solid',
            strokeOpacity: 1,
            cornerRadius: 14,
            effects: [],
          });

          generatedElements.push({
            id: `ai-elem-${nanoid(6)}`,
            name: 'Input Email Placeholder',
            type: 'text',
            parentId: frameId,
            x: startX + 46,
            y: startY + 316,
            width: 250,
            height: 20,
            rotation: 0,
            opacity: 1,
            visible: true,
            locked: false,
            fill: '#64748b',
            fillOpacity: 1,
            stroke: 'transparent',
            strokeWidth: 0,
            strokeStyle: 'solid',
            strokeOpacity: 0,
            text: 'alex@company.com',
            fontSize: 14,
            fontFamily: 'Inter',
            fontWeight: '500',
            textAlign: 'left',
            effects: [],
          });

          // Password Input Box
          generatedElements.push({
            id: `ai-elem-${nanoid(6)}`,
            name: 'Input Password Container',
            type: 'rectangle',
            parentId: frameId,
            x: startX + 30,
            y: startY + 370,
            width: 330,
            height: 52,
            rotation: 0,
            opacity: 1,
            visible: true,
            locked: false,
            fill: '#1e293b',
            fillOpacity: 0.8,
            stroke: '#334155',
            strokeWidth: 1,
            strokeStyle: 'solid',
            strokeOpacity: 1,
            cornerRadius: 14,
            effects: [],
          });

          generatedElements.push({
            id: `ai-elem-${nanoid(6)}`,
            name: 'Input Password Placeholder',
            type: 'text',
            parentId: frameId,
            x: startX + 46,
            y: startY + 386,
            width: 250,
            height: 20,
            rotation: 0,
            opacity: 1,
            visible: true,
            locked: false,
            fill: '#64748b',
            fillOpacity: 1,
            stroke: 'transparent',
            strokeWidth: 0,
            strokeStyle: 'solid',
            strokeOpacity: 0,
            text: '••••••••••••',
            fontSize: 14,
            fontFamily: 'Inter',
            fontWeight: '500',
            textAlign: 'left',
            effects: [],
          });

          // Primary Action Button
          generatedElements.push({
            id: `ai-elem-${nanoid(6)}`,
            name: 'Primary Button',
            type: 'rectangle',
            parentId: frameId,
            x: startX + 30,
            y: startY + 450,
            width: 330,
            height: 54,
            rotation: 0,
            opacity: 1,
            visible: true,
            locked: false,
            fill: '#0d99ff',
            fillOpacity: 1,
            stroke: 'transparent',
            strokeWidth: 0,
            strokeStyle: 'solid',
            strokeOpacity: 0,
            cornerRadius: 16,
            effects: [{ x: 0, y: 10, blur: 24, spread: -4, color: 'rgba(13,153,255,0.4)', opacity: 0.4, type: 'drop-shadow' }],
          });

          generatedElements.push({
            id: `ai-elem-${nanoid(6)}`,
            name: 'Button Label',
            type: 'text',
            parentId: frameId,
            x: startX + 30,
            y: startY + 466,
            width: 330,
            height: 22,
            rotation: 0,
            opacity: 1,
            visible: true,
            locked: false,
            fill: '#ffffff',
            fillOpacity: 1,
            stroke: 'transparent',
            strokeWidth: 0,
            strokeStyle: 'solid',
            strokeOpacity: 0,
            text: 'Sign In to Workspace',
            fontSize: 15,
            fontFamily: 'Inter',
            fontWeight: 'bold',
            textAlign: 'center',
            effects: [],
          });
        }
      } else {
        // DESKTOP SAAS DASHBOARD GENERATION
        const frameFill = '#0b0f19';

        const rootFrame: CanvasElement = {
          id: frameId,
          name: 'AI: SaaS Analytics Platform',
          type: 'frame',
          x: startX,
          y: startY,
          width: 1024,
          height: 640,
          rotation: 0,
          opacity: 1,
          visible: true,
          locked: false,
          fill: frameFill,
          fillOpacity: 1,
          stroke: '#1e293b',
          strokeWidth: 1,
          strokeStyle: 'solid',
          strokeOpacity: 1,
          cornerRadius: 16,
          effects: [{ x: 0, y: 24, blur: 48, spread: -12, color: 'rgba(0,0,0,0.6)', opacity: 0.6, type: 'drop-shadow' }],
          clipContent: true,
          presetName: 'Desktop Large',
        };
        generatedElements.push(rootFrame);

        // Sidebar
        generatedElements.push({
          id: `ai-elem-${nanoid(6)}`,
          name: 'Dashboard Sidebar',
          type: 'rectangle',
          parentId: frameId,
          x: startX,
          y: startY,
          width: 220,
          height: 640,
          rotation: 0,
          opacity: 1,
          visible: true,
          locked: false,
          fill: '#0f172a',
          fillOpacity: 1,
          stroke: '#1e293b',
          strokeWidth: 1,
          strokeStyle: 'solid',
          strokeOpacity: 1,
          effects: [],
        });

        // Sidebar Brand Logo
        generatedElements.push({
          id: `ai-elem-${nanoid(6)}`,
          name: 'App Brand Name',
          type: 'text',
          parentId: frameId,
          x: startX + 24,
          y: startY + 28,
          width: 180,
          height: 24,
          rotation: 0,
          opacity: 1,
          visible: true,
          locked: false,
          fill: '#0d99ff',
          fillOpacity: 1,
          stroke: 'transparent',
          strokeWidth: 0,
          strokeStyle: 'solid',
          strokeOpacity: 0,
          text: '◈ Lumina Cloud',
          fontSize: 18,
          fontFamily: 'Inter',
          fontWeight: 'bold',
          textAlign: 'left',
          effects: [],
        });

        // Top Navigation Header Bar
        generatedElements.push({
          id: `ai-elem-${nanoid(6)}`,
          name: 'Top Nav Bar',
          type: 'rectangle',
          parentId: frameId,
          x: startX + 220,
          y: startY,
          width: 804,
          height: 64,
          rotation: 0,
          opacity: 1,
          visible: true,
          locked: false,
          fill: '#0f172a',
          fillOpacity: 0.8,
          stroke: '#1e293b',
          strokeWidth: 1,
          strokeStyle: 'solid',
          strokeOpacity: 1,
          effects: [],
        });

        generatedElements.push({
          id: `ai-elem-${nanoid(6)}`,
          name: 'Page Title',
          type: 'text',
          parentId: frameId,
          x: startX + 250,
          y: startY + 20,
          width: 300,
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
          strokeOpacity: 0,
          text: 'Executive Overview',
          fontSize: 18,
          fontFamily: 'Inter',
          fontWeight: '700',
          textAlign: 'left',
          effects: [],
        });

        // 3 KPI Metric Cards
        const metrics = [
          { label: 'MONTHLY REVENUE', val: '$148,200', growth: '+28.4%', color: '#38bdf8' },
          { label: 'ACTIVE SUBSCRIBERS', val: '24,580', growth: '+14.2%', color: '#818cf8' },
          { label: 'CHURN RATE', val: '1.08%', growth: '-0.4%', color: '#34d399' },
        ];

        metrics.forEach((m, idx) => {
          const cardX = startX + 250 + idx * 252;
          const cardY = startY + 90;

          generatedElements.push({
            id: `ai-elem-${nanoid(6)}`,
            name: `KPI Card: ${m.label}`,
            type: 'rectangle',
            parentId: frameId,
            x: cardX,
            y: cardY,
            width: 236,
            height: 120,
            rotation: 0,
            opacity: 1,
            visible: true,
            locked: false,
            fill: '#1e293b',
            fillOpacity: 0.7,
            stroke: '#334155',
            strokeWidth: 1,
            strokeStyle: 'solid',
            strokeOpacity: 0.8,
            cornerRadius: 14,
            effects: [{ x: 0, y: 8, blur: 20, spread: -4, color: 'rgba(0,0,0,0.3)', opacity: 0.3, type: 'drop-shadow' }],
          });

          generatedElements.push({
            id: `ai-elem-${nanoid(6)}`,
            name: `KPI Label ${idx}`,
            type: 'text',
            parentId: frameId,
            x: cardX + 16,
            y: cardY + 16,
            width: 200,
            height: 16,
            rotation: 0,
            opacity: 1,
            visible: true,
            locked: false,
            fill: '#94a3b8',
            fillOpacity: 1,
            stroke: 'transparent',
            strokeWidth: 0,
            strokeStyle: 'solid',
            strokeOpacity: 0,
            text: m.label,
            fontSize: 10,
            fontFamily: 'Inter',
            fontWeight: '600',
            textAlign: 'left',
            letterSpacing: 0.8,
            effects: [],
          });

          generatedElements.push({
            id: `ai-elem-${nanoid(6)}`,
            name: `KPI Value ${idx}`,
            type: 'text',
            parentId: frameId,
            x: cardX + 16,
            y: cardY + 40,
            width: 200,
            height: 36,
            rotation: 0,
            opacity: 1,
            visible: true,
            locked: false,
            fill: '#ffffff',
            fillOpacity: 1,
            stroke: 'transparent',
            strokeWidth: 0,
            strokeStyle: 'solid',
            strokeOpacity: 0,
            text: m.val,
            fontSize: 26,
            fontFamily: 'Inter',
            fontWeight: '800',
            textAlign: 'left',
            effects: [],
          });

          generatedElements.push({
            id: `ai-elem-${nanoid(6)}`,
            name: `KPI Growth ${idx}`,
            type: 'text',
            parentId: frameId,
            x: cardX + 16,
            y: cardY + 84,
            width: 200,
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
            strokeOpacity: 0,
            text: `${m.growth} vs last month`,
            fontSize: 12,
            fontFamily: 'Inter',
            fontWeight: '500',
            textAlign: 'left',
            effects: [],
          });
        });

        // Main Chart Section Card
        generatedElements.push({
          id: `ai-elem-${nanoid(6)}`,
          name: 'Revenue Chart Card',
          type: 'rectangle',
          parentId: frameId,
          x: startX + 250,
          y: startY + 230,
          width: 740,
          height: 370,
          rotation: 0,
          opacity: 1,
          visible: true,
          locked: false,
          fill: '#1e293b',
          fillOpacity: 0.7,
          stroke: '#334155',
          strokeWidth: 1,
          strokeStyle: 'solid',
          strokeOpacity: 0.8,
          cornerRadius: 16,
          effects: [{ x: 0, y: 12, blur: 24, spread: -6, color: 'rgba(0,0,0,0.4)', opacity: 0.4, type: 'drop-shadow' }],
        });

        generatedElements.push({
          id: `ai-elem-${nanoid(6)}`,
          name: 'Chart Title',
          type: 'text',
          parentId: frameId,
          x: startX + 276,
          y: startY + 254,
          width: 300,
          height: 22,
          rotation: 0,
          opacity: 1,
          visible: true,
          locked: false,
          fill: '#ffffff',
          fillOpacity: 1,
          stroke: 'transparent',
          strokeWidth: 0,
          strokeStyle: 'solid',
          strokeOpacity: 0,
          text: 'Revenue Growth Breakdown',
          fontSize: 16,
          fontFamily: 'Inter',
          fontWeight: '700',
          textAlign: 'left',
          effects: [],
        });

        // Chart mock bars
        const bars = [45, 62, 58, 80, 75, 95, 110, 105, 130, 145, 160, 180];
        bars.forEach((heightVal, bIdx) => {
          const barX = startX + 280 + bIdx * 56;
          const barY = startY + 540 - heightVal;

          generatedElements.push({
            id: `ai-elem-${nanoid(6)}`,
            name: `Bar Metric ${bIdx + 1}`,
            type: 'rectangle',
            parentId: frameId,
            x: barX,
            y: barY,
            width: 34,
            height: heightVal,
            rotation: 0,
            opacity: 1,
            visible: true,
            locked: false,
            fill: '#0d99ff',
            fillOpacity: 0.85,
            stroke: '#38bdf8',
            strokeWidth: 1,
            strokeStyle: 'solid',
            strokeOpacity: 0.6,
            cornerRadius: 6,
            effects: [],
          });
        });
      }

      // Add all generated elements to canvas store
      generatedElements.forEach((el) => {
        addElement(el);
      });

      setSelectedIds([frameId]);
      setIsGenerating(false);
      setStatusMessage('');
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-lg p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl figma-glass-elevated overflow-hidden border border-white/10 ring-1 ring-black/80 font-sans shadow-[0_25px_60px_rgba(0,0,0,0.85)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-blue-500 shadow-md shadow-indigo-500/25 ring-1 ring-white/20">
              <Sparkles className="h-4.5 w-4.5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white tracking-tight">
                  Figma AI Design Generator
                </h2>
                <span className="rounded-full bg-indigo-500/15 border border-indigo-500/30 px-2 py-0.5 text-[10px] font-semibold text-indigo-300">
                  GPT-4o Vision
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Generate responsive multi-layer frames, design systems, and components instantly
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/10 hover:text-white transition-all"
            title="Close (Esc)"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[76vh] overflow-y-auto custom-scrollbar">
          {/* Natural Language Prompt Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Prompt Instructions
            </label>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your design, layout, color style, or workflow (e.g. Modern crypto portfolio with hero card, token list, and glassmorphism)..."
                className="h-28 w-full rounded-xl border border-white/10 bg-[#141418]/90 p-3.5 text-xs text-white placeholder-zinc-500 focus:border-[#0d99ff] focus:outline-none focus:ring-1 focus:ring-[#0d99ff] resize-none transition-all leading-relaxed"
              />
            </div>
          </div>

          {/* Quick Starter Templates */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Design Presets
              </label>
              <span className="text-[10px] text-zinc-500">1-click starter prompts</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {PROMPT_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPrompt(preset.prompt);
                    if (preset.category.includes('Mobile')) {
                      setDeviceTarget('mobile');
                    } else {
                      setDeviceTarget('desktop');
                    }
                  }}
                  className="flex flex-col text-left p-3 rounded-xl border border-white/5 bg-[#1e1e24]/60 hover:border-[#0d99ff]/50 hover:bg-[#252530] transition-all group shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1 rounded-lg bg-white/5 group-hover:bg-[#0d99ff]/10 transition-colors">
                      {preset.icon}
                    </div>
                    <span className="text-xs font-semibold text-zinc-200 group-hover:text-[#0d99ff] transition-colors truncate">
                      {preset.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                    {preset.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Configuration Options */}
          <div className="grid grid-cols-2 gap-4 pt-1">
            {/* Target Canvas Form Factor */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Layout className="h-3 w-3" /> Target Viewport
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDeviceTarget('mobile')}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                    deviceTarget === 'mobile'
                      ? 'border-[#0d99ff] bg-[#0d99ff]/15 text-[#0d99ff] shadow-sm'
                      : 'border-white/10 bg-[#1b1b20] text-zinc-300 hover:bg-[#24242c]'
                  }`}
                >
                  <Smartphone className="h-3.5 w-3.5" /> Mobile
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceTarget('desktop')}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                    deviceTarget === 'desktop'
                      ? 'border-[#0d99ff] bg-[#0d99ff]/15 text-[#0d99ff] shadow-sm'
                      : 'border-white/10 bg-[#1b1b20] text-zinc-300 hover:bg-[#24242c]'
                  }`}
                >
                  <Layout className="h-3.5 w-3.5" /> Desktop
                </button>
              </div>
            </div>

            {/* Design Style */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Palette className="h-3 w-3" /> Aesthetic Theme
              </label>
              <select
                value={designStyle}
                onChange={(e) => setDesignStyle(e.target.value as any)}
                className="w-full rounded-xl border border-white/10 bg-[#1b1b20] py-2 px-3 text-xs text-zinc-200 focus:border-[#0d99ff] focus:outline-none transition-all cursor-pointer"
              >
                <option value="modern">Modern Dark (UI3 System)</option>
                <option value="cyberpunk">Cyberpunk Neon</option>
                <option value="glassmorphism">iOS Acrylic Glassmorphism</option>
                <option value="minimal">Minimalist Monochrome</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-white/10 bg-[#151518] px-6 py-4">
          <div className="flex items-center gap-2">
            {isGenerating && (
              <div className="flex items-center gap-2 text-xs text-indigo-400 animate-pulse">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-400" />
                <span className="font-medium text-[11px]">{statusMessage}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              disabled={isGenerating}
              className="rounded-xl px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-500/25 hover:from-purple-500 hover:to-blue-500 active:scale-98 transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Generating UI...
                </>
              ) : (
                <>
                  <Wand2 className="h-3.5 w-3.5" />
                  Generate UI
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
