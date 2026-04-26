Original prompt: Build a production-quality web-based cinematic chess game in Next.js with App Router, TypeScript, React Three Fiber, chess.js, Motion, Tailwind, and a layered architecture where chess correctness is the source of truth and the 3D scene is only a consumer.

2026-03-24
- Initialized an empty workspace into the requested folder structure.
- Loaded the local `develop-web-game` and `frontend-skill` guidance.
- Established the visual direction as dark-fantasy tactical theatre with a restrained premium HUD.
- Scaffolded the Next.js, Tailwind, and TypeScript app shell.
- Implemented a typed `chess.js` engine wrapper for legal moves, FEN, PGN, check, mate, stalemate, draw states, castling, en passant, and promotion.
- Implemented a Zustand-based orchestration store with promotion gating, input locking, scene piece state, and animation pipeline integration.
- Built a React Three Fiber board scene with procedural humanoid proxy characters for all six piece classes.
- Added legal move highlights, last move state, check indication, captured piece tracking, move history, animation mode settings, and a promotion modal.
- Added tests for legality, promotion, checkmate, stalemate, en passant orchestration, and store-level move resolution.
- Verified `npm run typecheck`, `npm test`, `npm run build`, and a live `npm run start` localhost check returning HTTP 200.

TODO / next-agent notes
- Replace procedural proxies with rigged assets and authored clips when art is available.
- Add AI, multiplayer transport, sound, particles, and replay systems on top of the current orchestration boundaries.
- Add browser automation once Playwright and browser binaries are explicitly added to the repo.
