"use client";

import type { Square } from "chess.js";

import { ALL_SQUARES } from "@/features/chess/utils/board";

import { BoardSquare } from "./BoardSquare";

interface BoardStageProps {
  selectedSquare?: Square;
  hoveredSquare?: Square;
  legalTargets: Square[];
  captureTargets: Square[];
  lastMove?: {
    from: Square;
    to: Square;
  };
  checkSquare?: Square;
  onSquareSelect: (square: Square) => void;
  onSquareHover: (square?: Square) => void;
}

export function BoardStage({
  selectedSquare,
  hoveredSquare,
  legalTargets,
  captureTargets,
  lastMove,
  checkSquare,
  onSquareSelect,
  onSquareHover
}: BoardStageProps) {
  return (
    <group>
      <mesh receiveShadow position={[0, -0.28, 0]}>
        <boxGeometry args={[8.9, 0.38, 8.9]} />
        <meshStandardMaterial color="#221b18" metalness={0.28} roughness={0.74} />
      </mesh>
      <mesh receiveShadow position={[0, -0.54, 0]}>
        <cylinderGeometry args={[6.7, 7.4, 0.28, 32]} />
        <meshStandardMaterial color="#0b0e14" metalness={0.22} roughness={0.9} />
      </mesh>
      {ALL_SQUARES.map((square) => (
        <BoardSquare
          key={square}
          square={square}
          isSelected={selectedSquare === square}
          isHovered={hoveredSquare === square}
          isLegal={legalTargets.includes(square)}
          isCaptureTarget={captureTargets.includes(square)}
          isLastMove={lastMove?.from === square || lastMove?.to === square}
          isCheckSquare={checkSquare === square}
          onSelect={onSquareSelect}
          onHover={onSquareHover}
        />
      ))}
    </group>
  );
}
