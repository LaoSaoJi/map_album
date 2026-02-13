# Frontend Architecture (Map Album)

## Goal

This document defines the current frontend structure after refactor.

- Keep the visual style and interaction behavior unchanged.
- Improve maintainability by separating orchestration, state, view, and pure logic.

## Runtime Entry

- `/Users/bilibili/workspace/map_album/app/page.tsx`
  - Renders `MapExplorer` only.
- `/Users/bilibili/workspace/map_album/components/map-explorer.tsx`
  - Composition/orchestration layer.
  - Wires events and passes state to child components.
  - Should avoid heavy business logic and geometry parsing.

## Layered Structure

### 1) Presentation Components

- `/Users/bilibili/workspace/map_album/components/map/puzzle-map.tsx`
  - Puzzle map view.
  - Renders region polygons and city points in puzzle mode.

- `/Users/bilibili/workspace/map_album/components/map/china-map.tsx`
  - China province map view.
  - Renders province paths, highlight states, municipality points.

- `/Users/bilibili/workspace/map_album/components/map/province-focus-overlay.tsx`
  - Province zoom overlay.
  - Renders focused province map and city labels in focused mode.

- `/Users/bilibili/workspace/map_album/components/album/city-album-panel.tsx`
  - Right-side album panel.
  - Renders city cover and photo grid.

- `/Users/bilibili/workspace/map_album/components/map/constants.ts`
  - Map-related static constants (puzzle polygons, label placements).

### 2) State + Derived Data

- `/Users/bilibili/workspace/map_album/hooks/use-map-explorer.ts`
  - Single source of UI state for the page:
    - `mapMode`
    - `activeCityId`
    - `focusedProvinceId`
    - `focusedLabelCityId`
  - Computes derived values:
    - totals
    - province photo counts
    - municipality list
    - focused province/cities
    - focused viewBox data
  - Exposes action helpers:
    - `selectCity(...)`
    - state setters used by orchestration layer

### 3) Pure Logic Utilities

- `/Users/bilibili/workspace/map_album/lib/map-geometry.ts`
  - Pure, reusable geometry/layout helpers:
    - `parseProvincePath`
    - `getProvinceBBox`
    - `buildFocusedViewBox`
    - `parseViewBox`
    - `getSafeLabelLayout`
  - No React dependency.
  - Safe place for future unit tests.

### 4) Data

- `/Users/bilibili/workspace/map_album/data/mock-data.ts`
  - Current mock domain data:
    - city metadata
    - map coordinates
    - album list
  - Future API migration should keep this data shape as contract input to UI.

## Data Flow

1. `MapExplorer` calls `useMapExplorer()`.
2. Hook returns state + derived data + actions.
3. `MapExplorer` passes data down to map/album components via props.
4. Child components emit user events through callbacks.
5. Callbacks update hook state, triggering re-render.

This is a unidirectional flow: `Hook -> Props -> UI -> Callback -> Hook`.

## Interaction Invariants (Must Keep)

- Left click map container in puzzle mode: switch to china mode.
- Right click map container in china mode:
  - if province focused: close province focus;
  - else: switch back to puzzle mode.
- Clicking city chips should keep current visual behavior:
  - set active city;
  - auto-switch to china mode if currently puzzle;
  - set/clear focused province based on municipality.
- Province focus overlay right click closes only the focused overlay.

## Styling Contract

- Existing Tailwind class names and layout composition should remain compatible.
- Visual tokens still come from:
  - `/Users/bilibili/workspace/map_album/app/globals.css`
  - `/Users/bilibili/workspace/map_album/tailwind.config.ts`
- Refactors should avoid introducing visual regressions unless explicitly requested.

## Extension Rules

- Add new map visuals under `components/map/`.
- Add new panel-like blocks under `components/album/` or a dedicated folder.
- Keep new business calculations in hooks or `lib/` utilities, not in view files.
- Prefer pure functions in `lib/` when logic has deterministic input/output.
- Keep `MapExplorer` focused on composition and event wiring.

## Suggested Next Steps

- Add non-interactive ESLint config to enable `npm run lint` in CI.
- Add unit tests for `lib/map-geometry.ts`.
- Add integration tests for key interaction invariants (mode switch/focus close/city select).

