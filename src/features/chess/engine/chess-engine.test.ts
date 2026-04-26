import { describe, expect, it } from "vitest";

import { ChessEngine } from "@/features/chess/engine/chess-engine";

describe("ChessEngine", () => {
  it("returns the correct opening moves for a starting pawn", () => {
    const engine = new ChessEngine();
    const moves = engine.getLegalMoves("e2").map((move) => move.to).sort();

    expect(moves).toEqual(["e3", "e4"]);
    expect(engine.requiresPromotion("e2", "e4")).toBe(false);
  });

  it("supports official promotion choices", () => {
    const engine = new ChessEngine("4k3/P7/8/8/8/8/8/4K3 w - - 0 1");

    expect(engine.requiresPromotion("a7", "a8")).toBe(true);

    const result = engine.applyMove({
      from: "a7",
      to: "a8",
      promotion: "queen"
    });

    expect(result?.move.promotion).toBe("queen");
    expect(result?.snapshot.board.find((piece) => piece.square === "a8")?.role).toBe("queen");
    expect(result?.snapshot.turn).toBe("black");
  });

  it("detects checkmate sequences", () => {
    const engine = new ChessEngine();
    const sequence = [
      ["e2", "e4"],
      ["e7", "e5"],
      ["d1", "h5"],
      ["b8", "c6"],
      ["f1", "c4"],
      ["g8", "f6"],
      ["h5", "f7"]
    ] as const;

    sequence.forEach(([from, to]) => {
      engine.applyMove({ from, to });
    });

    const snapshot = engine.getSnapshot();
    expect(snapshot.checkmate).toBe(true);
    expect(snapshot.winner).toBe("white");
    expect(snapshot.lastMove?.san).toBe("Qxf7#");
  });

  it("detects stalemate positions from fen", () => {
    const engine = new ChessEngine("7k/5Q2/6K1/8/8/8/8/8 b - - 0 1");
    const snapshot = engine.getSnapshot();

    expect(snapshot.stalemate).toBe(true);
    expect(snapshot.status).toBe("stalemate");
  });
});
