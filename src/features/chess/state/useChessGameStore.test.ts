import { beforeEach, describe, expect, it, vi } from "vitest";

import { createChessGameStore } from "@/features/chess/state/useChessGameStore";

describe("useChessGameStore orchestration", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("locks input while a resolved move animation is active and releases it afterwards", () => {
    const store = createChessGameStore();

    store.getState().handleSquareClick("e2");
    store.getState().handleSquareClick("e4");

    expect(store.getState().snapshot.lastMove?.san).toBe("e4");
    expect(store.getState().isInputLocked).toBe(true);
    expect(store.getState().scenePieces.some((piece) => piece.square === "e4" && piece.color === "white")).toBe(true);

    vi.runAllTimers();

    expect(store.getState().isInputLocked).toBe(false);
  });

  it("waits for a promotion choice before finalizing the move", () => {
    const store = createChessGameStore();
    store.getState().loadFen("4k3/P7/8/8/8/8/8/4K3 w - - 0 1");

    store.getState().handleSquareClick("a7");
    store.getState().handleSquareClick("a8");

    expect(store.getState().pendingPromotion).toEqual({
      from: "a7",
      to: "a8",
      color: "white"
    });

    store.getState().choosePromotion("rook");

    expect(store.getState().pendingPromotion).toBeUndefined();
    expect(store.getState().snapshot.board.find((piece) => piece.square === "a8")?.role).toBe("rook");
  });
});
