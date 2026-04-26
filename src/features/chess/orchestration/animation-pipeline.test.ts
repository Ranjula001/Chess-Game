import { describe, expect, it } from "vitest";

import { ChessEngine } from "@/features/chess/engine/chess-engine";
import { buildSceneTransition } from "@/features/chess/orchestration/animation-pipeline";
import { createScenePiecesFromBoard } from "@/features/chess/utils/pieces";

describe("buildSceneTransition", () => {
  it("keeps en passant capture removal synchronized with the engine result", () => {
    const engine = new ChessEngine("4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1");
    const before = engine.getSnapshot();
    const scenePieces = createScenePiecesFromBoard(before.board);
    const moveResult = engine.applyMove({ from: "e5", to: "d6" });

    expect(moveResult?.specialMove).toBe("en-passant");
    expect(moveResult?.capturedSquare).toBe("d5");

    const transition = buildSceneTransition({
      scenePieces,
      moveResult: moveResult!,
      settings: {
        animationMode: "normal",
        soundEnabled: false,
        reducedMotion: false
      }
    });

    expect(transition.scenePieces.some((piece) => piece.square === "d6" && piece.color === "white")).toBe(true);
    expect(transition.cleanup.some((step) => step.type === "remove-piece")).toBe(true);
  });
});
