"use client";

import { Text } from "@react-three/drei";

import type { Square } from "chess.js";

import { isLightSquare, squareToBoardPosition } from "@/features/chess/utils/board";

interface BoardSquareProps {
  square: Square;
  isSelected: boolean;
  isHovered: boolean;
  isLegal: boolean;
  isCaptureTarget: boolean;
  isLastMove: boolean;
  isCheckSquare: boolean;
  onSelect: (square: Square) => void;
  onHover: (square?: Square) => void;
}

export function BoardSquare({
  square,
  isSelected,
  isHovered,
  isLegal,
  isCaptureTarget,
  isLastMove,
  isCheckSquare,
  onSelect,
  onHover
}: BoardSquareProps) {
  const [x, , z] = squareToBoardPosition(square);
  const light = isLightSquare(square);
  const baseColor = light ? "#786a58" : "#43362d";
  const emissive = isSelected
    ? "#a87544"
    : isCheckSquare
      ? "#7f2c2c"
      : isHovered
        ? "#52606f"
        : "#10131a";

  return (
    <group
      position={[x, 0, z]}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(square);
      }}
      onPointerEnter={(event) => {
        event.stopPropagation();
        onHover(square);
      }}
      onPointerLeave={() => {
        onHover(undefined);
      }}
    >
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[0.96, 0.14, 0.96]} />
        <meshStandardMaterial color={baseColor} metalness={0.14} roughness={0.82} emissive={emissive} emissiveIntensity={isSelected ? 0.26 : isHovered || isCheckSquare ? 0.16 : 0.05} />
      </mesh>
      <mesh position={[0, 0.073, 0]} rotation={[-Math.PI / 2, 0, 0]} visible={isLastMove || isSelected || isCheckSquare}>
        <planeGeometry args={[0.88, 0.88]} />
        <meshBasicMaterial color={isCheckSquare ? "#8f3a38" : isSelected ? "#d99a53" : "#7b8fb6"} transparent opacity={isSelected ? 0.3 : 0.2} />
      </mesh>
      <mesh position={[0, 0.074, 0]} rotation={[-Math.PI / 2, 0, 0]} visible={isLegal && !isCaptureTarget}>
        <circleGeometry args={[0.14, 24]} />
        <meshBasicMaterial color="#7ca484" transparent opacity={0.72} />
      </mesh>
      <mesh position={[0, 0.074, 0]} rotation={[-Math.PI / 2, 0, 0]} visible={isCaptureTarget}>
        <ringGeometry args={[0.2, 0.34, 36]} />
        <meshBasicMaterial color="#d99a53" transparent opacity={0.74} />
      </mesh>
      {(square[1] === "1" || square[0] === "a") && (
        <Text
          position={[-0.34, 0.09, square[0] === "a" ? 0.34 : -0.34]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.08}
          color={light ? "#d8c6ad" : "#94806a"}
          anchorX="center"
          anchorY="middle"
        >
          {square[1] === "1" ? square[0].toUpperCase() : square[1]}
        </Text>
      )}
    </group>
  );
}
