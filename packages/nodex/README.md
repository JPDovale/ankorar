# @ankorar/nodex

Composable React package for building and extending a keyboard-driven mind map experience.

This package exposes **state, hooks, and UI primitives** so each consumer app can build its own screen composition without being locked to a single page component.

## What This Package Provides

- Stateful mind map engine (Zustand-based)
- Ready-to-compose visual components (board, nodes, minimap, popovers)
- Keyboard and interaction handlers
- Debounce hooks for history/state flow
- Type exports for consumer-side extensions

## Installation

### Workspace (monorepo)

```bash
pnpm add @ankorar/nodex --workspace
```

### Future npm install

```bash
pnpm add @ankorar/nodex
```

## Quick Usage (Composition)

```tsx
import "@ankorar/nodex/styles.css";
import {
  Background,
  Board,
  MindMapHeader,
  MineMap,
  Nodex,
  ZenCard,
  useMindMapDebounce,
} from "@ankorar/nodex";

export function MindMapPage() {
  useMindMapDebounce(() => undefined, { delayMs: 3000 });

  return (
    <section className="h-[calc(100dvh-11rem)] min-h-[38rem]">
      <Nodex readOnly={false}>
        <MindMapHeader title="Mind Map" />
        <Board>
          <Background />
          <MineMap />
          <ZenCard />
        </Board>
      </Nodex>
    </section>
  );
}
```

## Read-only Mode

Use `Nodex` with `readOnly` when the map should be visual-only:

```tsx
<Nodex readOnly>
  <MindMapHeader title="Mind Map (View)" />
  <Board>
    <Background />
    <MineMap />
    <ZenCard />
  </Board>
</Nodex>
```

In `readOnly` mode, the package blocks content mutations (keyboard shortcuts, inline edits, add/remove node actions, and style popover updates).

## High-quality image export

You can export the whole map as a high-resolution PNG so that text stays readable when zooming, even on very large maps.

- **From the header**: set `showExportImageButton` on `MindMapHeader` to show an “Export image” button that downloads a PNG (scale factor 3× by default).
- **Programmatic**: use `exportMindMapAsHighQualityImage(nodes, options?)` with optional `scale` (1–4) and `filename`. Exported image dimensions are derived from node bounds plus padding, then multiplied by `scale`.

```tsx
import { MindMapHeader, exportMindMapAsHighQualityImage, useMindMapState } from "@ankorar/nodex";

// In your page:
<MindMapHeader title="My Map" showExportImageButton />

// Or call manually:
const nodes = useMindMapState.getState().getFlatNodes();
await exportMindMapAsHighQualityImage(nodes, { scale: 3, filename: "my-map" });
```

## Initial State

`@ankorar/nodex` now starts with an empty node list (`nodes: []`).

If your app loads maps from an API, hydrate the state explicitly:

```tsx
import { useEffect } from "react";
import { useMindMapState, type MindMapNode } from "@ankorar/nodex";

export function MindMapHydrator({ nodes }: { nodes: MindMapNode[] }) {
  useEffect(() => {
    useMindMapState.setState({
      nodes,
      selectedNodeId: null,
      editingNodeId: null,
    });
  }, [nodes]);

  return null;
}
```

## Styling

`@ankorar/nodex` ships its own precompiled stylesheet, so consumer apps do not need to compile Tailwind classes from this package.

Import it once at app entry:

```tsx
import "@ankorar/nodex/styles.css";
```

## Public API

### Components

- `Nodex`
- `Board`
- `Background`
- `Nodes`
- `Segments`
- `CentalNode`
- `DefaultNode`
- `ImageNode`
- `NodeStylePopover`
- `KeyboardHelpDialog`
- `MineMap`
- `ZenCard`
- `MindMapHeader` (optional: `showExportImageButton` for PNG export)

### Utilities

- `getMindMapPreviewDataUrl(nodes)` – data URL for minimap-style preview thumbnails
- `exportMindMapAsHighQualityImage(nodes, options?)` – render map to high-resolution PNG and trigger download
- `HIGH_QUALITY_EXPORT_SCALE` – default scale factor (3) for export

### Hooks

- `useMindMapDebounce`
- `useMindMapHistoryDebounce`

### State

- `useMindMapState`
- `useMindMapHistory`
- `createMindMapSnapshot`

### Types

- `MindMapNode`
- `MindMapNodeStyle`
- `MindMapNodeType`
- `MindMapNodeTextAlign`
- `MindMapNodeFontSize`

## Package Structure

```text
src/
  components/
    mindMap/
    ui/
  config/
  handlers/
  helpers/
  hooks/
    mindMap/
  lib/
  state/
  index.ts
```

## Development

From the monorepo root:

```bash
pnpm --filter @ankorar/nodex dev
```

Available scripts in this package:

- `dev`: watches types and regenerates `styles.css`
- `build`: type validation + stylesheet build
- `lint`: Type validation (`tsc --noEmit`)

## Consumer Responsibilities

Because this package is composition-first, the consumer app is responsible for:

- Defining the route/page shell
- Providing app-level layout and authentication wrappers
- Loading global styles/tokens expected by the selected UI setup

## Versioning and Publishing

Before publishing a new version:

1. Validate exports in `src/index.ts`.
2. Run package checks:
   - `pnpm --filter @ankorar/nodex build`
   - `pnpm --filter @ankorar/nodex lint`
3. Update docs for any API/behavior change.
4. Bump package version in `packages/nodex/package.json`.

## Documentation Policy

All package documentation must be written in **English**.

For mandatory documentation rules (including AI/chat workflows), see:

- `docs/AI_DOCUMENTATION_POLICY.md`
