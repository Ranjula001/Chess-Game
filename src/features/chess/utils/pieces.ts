import type { Color, PieceSymbol, Square } from "chess.js";

import type {
  BoardPiece,
  PieceColor,
  PieceRole,
  PromotionRole,
  ScenePiece
} from "@/features/chess/types/chess";

export const PROMOTION_OPTIONS: PromotionRole[] = ["queen", "rook", "bishop", "knight"];

export const PIECE_LABELS: Record<PieceRole, string> = {
  pawn: "Foot Soldier",
  knight: "Duelist Knight",
  bishop: "Battle Cleric",
  rook: "Royal Guard",
  queen: "Sovereign Blade",
  king: "High Commander"
};

export const PIECE_GLYPHS: Record<PieceColor, Record<PieceRole, string>> = {
  white: {
    pawn: "♙",
    knight: "♘",
    bishop: "♗",
    rook: "♖",
    queen: "♕",
    king: "♔"
  },
  black: {
    pawn: "♟",
    knight: "♞",
    bishop: "♝",
    rook: "♜",
    queen: "♛",
    king: "♚"
  }
};

export function toPieceColor(color: Color): PieceColor {
  return color === "w" ? "white" : "black";
}

export function fromPieceColor(color: PieceColor): Color {
  return color === "white" ? "w" : "b";
}

export function toPieceRole(symbol: PieceSymbol): PieceRole {
  const roleMap: Record<PieceSymbol, PieceRole> = {
    p: "pawn",
    n: "knight",
    b: "bishop",
    r: "rook",
    q: "queen",
    k: "king"
  };

  return roleMap[symbol];
}

export function toPieceSymbol(role: PieceRole): PieceSymbol {
  const symbolMap: Record<PieceRole, PieceSymbol> = {
    pawn: "p",
    knight: "n",
    bishop: "b",
    rook: "r",
    queen: "q",
    king: "k"
  };

  return symbolMap[role];
}

export function getOpposingColor(color: PieceColor): PieceColor {
  return color === "white" ? "black" : "white";
}

export function createScenePiecesFromBoard(board: BoardPiece[]): ScenePiece[] {
  const counters = new Map<string, number>();

  return [...board]
    .sort((left, right) => left.square.localeCompare(right.square))
    .map((piece) => {
      const counterKey = `${piece.color}-${piece.role}`;
      const index = (counters.get(counterKey) ?? 0) + 1;
      counters.set(counterKey, index);

      return {
        id: `${piece.color}-${piece.role}-${index}`,
        color: piece.color,
        role: piece.role,
        square: piece.square,
        alive: true,
        originatingSquare: piece.square,
        wasPromoted: false,
        pendingRemoval: false
      } satisfies ScenePiece;
    });
}

export function findActiveScenePiece(pieces: ScenePiece[], square: Square) {
  return pieces.find((piece) => piece.alive && !piece.pendingRemoval && piece.square === square);
}
