# Figma Clone (UI3 Multi-Platform Studio)

A production-grade, collaborative vector graphics and interface design tool built with **React 19, TypeScript, Tailwind CSS v4, and Vite**. Inspired by modern industry-leading tools like **Figma UI3, Penpot, Framer, Sketch, Adobe XD, Lunacy, UXPin, Axure RP, Plasmic, and Moqups**.

---

## 🌟 Key Features & Industry Inspirations

1. **Figma UI3 Dark Theme & Canvas Engine**
   - Floating glassmorphism dock toolbar with acrylic blur.
   - 11px/12px micro-typography and precision layout hierarchy.
   - Master Components (❖) with live synchronized Instances (◇) and local overrides.
   - Infinite multi-touch interactive canvas with zoom, pan, rulers, and pixel-grid snapping.

2. **Penpot Open-Standards Flexbox & SVG**
   - Full W3C CSS-compliant Auto Layout Flexbox calculation engine (direction, wrap, gap, padding, alignments).
   - Pure mathematical SVG vector path generation and export.

3. **Framer Dev Mode & Code Generation**
   - Instant 1-click code export to **React (TSX)**, **Tailwind CSS v4**, and **Vanilla CSS**.
   - Dev Mode inspector with syntax highlighting and copy-to-clipboard.

4. **Adobe XD Interactive Prototyping**
   - Interactive Bézier curve "noodles" linking elements to target artboards.
   - Fullscreen Presentation Player with realistic navigation and frame transitions (Instant, Dissolve, Slide).

5. **Sketch Inspector Matrix & Asset Library**
   - Comprehensive transform properties (X, Y, Width, Height, Rotation, Corner Radius with Aspect Ratio lock).
   - Reusable symbols and component assets.

6. **Lunacy UI Component Library**
   - Built-in drag-and-drop UI component kits (Buttons, Cards, Badges, Modals, Form Inputs).

7. **UXPin Box Model Metrics**
   - Live visual CSS Box Model metrics diagram (Margin, Border, Padding, Width × Height) in the Inspect tab.

8. **Axure RP Hierarchical Scene Graph**
   - Nested layer tree with guidelines, expand/collapse, lock/unlock (`Ctrl+L`), visibility toggle, and inline rename.

9. **Plasmic Reactive Design Tokens**
   - Color palette tokens and typography scale tokens for fast theme synchronization.

10. **Moqups Smart Distance Guides & Snapping**
    - Hold `Alt` key to reveal real-time pixel distance annotations to canvas boundaries and nearby elements.
    - Smart magnetic alignment snapping guides.

---

## 💻 Multi-Platform Native Wrappers

- **Web Mode**: Full-screen canvas experience with customizable rulers, grid toggles, and multi-user live cursors (`BroadcastChannel` / WebRTC).
- **Desktop Native Wrapper**:
  - macOS Traffic Lights (Red, Yellow, Green) & Windows Title Bar Controls (Min/Max/Close).
  - Native Desktop Menu Bar (`File`, `Edit`, `Object`, `View`, `Plugins`).
  - Status Bar footer with coordinates, zoom level, and sync diagnostics.
- **Mobile Native Shell**:
  - Flagship hardware bezel with **Dynamic Island**, camera punch-hole, and iOS status bar.
  - Bottom home gesture indicator and touch-optimized bottom navigation.

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.x
- npm or yarn

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/Lennowlen/figma-clone.git
cd figma-clone

# Install dependencies
npm install

# Start local dev server
npm run dev

# Build production bundle
npm run build
```

---

## 📦 Releases & Standalone Artifacts

Standalone distribution builds for **Web**, **Desktop**, and **Mobile** are available in the [Releases](https://github.com/Lennowlen/figma-clone/releases) section.
