# Cinematic Chess MVP

A production-minded chess MVP where official chess rules stay authoritative and the presentation layer turns each move into tactical dark-fantasy theatre.

## Stack

- Next.js App Router
- TypeScript + React
- `chess.js` for legality and notation
- React Three Fiber + `@react-three/drei` for the 3D battlefield
- `motion` for HUD transitions and modal presence
- Tailwind CSS for styling
- Zustand for orchestration and UI state
- Vitest for critical engine and orchestration tests

## Architecture

- Chess engine layer: [`src/features/chess/engine/chess-engine.ts`](./src/features/chess/engine/chess-engine.ts)
  Handles legal moves, turns, checks, mates, draw states, FEN, PGN, and typed move snapshots.
- Game orchestration layer: [`src/features/chess/state/useChessGameStore.ts`](./src/features/chess/state/useChessGameStore.ts) and [`src/features/chess/orchestration/animation-pipeline.ts`](./src/features/chess/orchestration/animation-pipeline.ts)
  Validates player intent through the engine, gates promotion, locks input during presentation, and synchronizes renderable piece state.
- Rendering layer: [`src/components/scene/ChessScene.tsx`](./src/components/scene/ChessScene.tsx), [`src/components/board`](./src/components/board), and [`src/components/pieces`](./src/components/pieces)
  Renders the board, highlights, camera, lighting, and procedural humanoid proxy characters.
- UI layer: [`src/components/ui`](./src/components/ui)
  Presents status, move history, captured pieces, settings, promotion choice, and future-ready HUD slots.

## File Tree

```text
src/
  app/
  components/
    board/
    pieces/
    scene/
    ui/
  features/
    chess/
      engine/
      orchestration/
      state/
      types/
      utils/
  hooks/
  lib/
  stores/
  assets/
  types/
```

## Setup

1. Install dependencies:
   `npm install`
2. Start the development server:
   `npm run dev`
3. Open [http://localhost:3000](http://localhost:3000)
4. Production build check:
   `npm run build`

## Controls

- Click a piece to select it.
- Click a highlighted destination to move.
- Press `Esc` to clear selection.
- Press `N` or `R` to start a new game.
- Use the presentation panel to switch between `Fast`, `Normal`, and `Cinematic` animation modes.

## Verification

- `npm run typecheck`
- `npm test`
- `npm run build`

## Known Limitations

- Piece characters are procedural low-poly stand-ins, not rigged hero assets.
- Animation timing is event-driven but still intentionally lightweight for the MVP.
- Sound, particles, online play, AI, and replay tooling are prepared for but not implemented.
- The board is desktop-first; mobile remains usable but not deeply optimized.
- Browser automation via Playwright is not bundled in this repo yet.

## What To Build Next

- Replace procedural proxies with swappable GLB character sets and authored clips.
- Add audio cues, subtle particles, and richer end-state cinematography.
- Introduce camera presets, replay mode, and move-by-move cinematic review.
- Add local AI, multiplayer transport, and persistent match saves.
- Expose FEN import and PGN export in the HUD for advanced users.

## TODOs

- Add drag or keyboard piece navigation for accessibility.
- Add richer castling and checkmate camera choreography.
- Add theme packs and alternate battlefield materials.
- Add integration tests once Playwright/browser tooling is installed.
