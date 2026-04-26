import type { Square } from "chess.js";

import type { PieceColor } from "@/features/chess/types/chess";

export const BOARD_SQUARE_SIZE = 1;
export const BOARD_HALF_SPAN = 3.5;
export const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;
export const RANKS = [1, 2, 3, 4, 5, 6, 7, 8] as const;
export const ALL_SQUARES = FILES.flatMap((file) =>
  [...RANKS].reverse().map((rank) => `${file}${rank}` as Square)
);

export function squareToFileIndex(square: Square) {
  return FILES.indexOf(square[0] as (typeof FILES)[number]);
}

export function squareToRankIndex(square: Square) {
  return Number(square[1]) - 1;
}

export function squareToBoardPosition(square: Square): [number, number, number] {
  const fileIndex = squareToFileIndex(square);
  const rankIndex = squareToRankIndex(square);

  return [
    fileIndex * BOARD_SQUARE_SIZE - BOARD_HALF_SPAN,
    0,
    BOARD_HALF_SPAN - rankIndex * BOARD_SQUARE_SIZE
  ];
}

export function isLightSquare(square: Square) {
  return (squareToFileIndex(square) + squareToRankIndex(square)) % 2 === 1;
}

export function toSquare(fileIndex: number, rankIndex: number) {
  return `${FILES[fileIndex]}${rankIndex + 1}` as Square;
}

export function isPromotionSquare(square: Square, color: PieceColor) {
  return color === "white" ? square[1] === "8" : square[1] === "1";
}

export function getEnPassantCaptureSquare(to: Square, color: PieceColor) {
  const capturedRank = Number(to[1]) + (color === "white" ? -1 : 1);
  return `${to[0]}${capturedRank}` as Square;
}
