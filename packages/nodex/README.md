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
      <Nodex>
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
- `MindMapHeader`

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
