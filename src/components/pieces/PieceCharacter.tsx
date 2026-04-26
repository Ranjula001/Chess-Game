"use client";

import { useFrame } from "@react-three/fiber";
import { memo, useMemo, useRef } from "react";
import type { Group } from "three";
import { MathUtils, Vector3 } from "three";
import type { Square } from "chess.js";

import type { SceneAnimation, ScenePiece } from "@/features/chess/types/chess";
import { squareToBoardPosition } from "@/features/chess/utils/board";

import { BishopCharacter } from "./BishopCharacter";
import { KingCharacter } from "./KingCharacter";
import { KnightCharacter } from "./KnightCharacter";
import { PawnCharacter } from "./PawnCharacter";
import { QueenCharacter } from "./QueenCharacter";
import { ROLE_ANIMATION_PROFILE, TEAM_PALETTES } from "./piece-archetypes";
import { RookCharacter } from "./RookCharacter";

const PIECE_COMPONENTS = {
  pawn: PawnCharacter,
  knight: KnightCharacter,
  bishop: BishopCharacter,
  rook: RookCharacter,
  queen: QueenCharacter,
  king: KingCharacter
} as const;

function hashToUnitInterval(input: string) {
  let hash = 0;
  for (const character of input) {
    hash = (hash * 31 + character.charCodeAt(0)) % 997;
  }

  return hash / 997;
}

function easeInOutCubic(value: number) {
  return value < 0.5
    ? 4 * value * value * value
    : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

interface PieceCharacterProps {
  piece: ScenePiece;
  animation?: SceneAnimation;
  isSelected: boolean;
  isThreatened: boolean;
  isCheckedKing: boolean;
  isLastMoved: boolean;
  interactive: boolean;
  onSelect: (square: Square) => void;
  onHover: (square?: Square) => void;
}

export const PieceCharacter = memo(function PieceCharacter({
  piece,
  animation,
  isSelected,
  isThreatened,
  isCheckedKing,
  isLastMoved,
  interactive,
  onSelect,
  onHover
}: PieceCharacterProps) {
  const root = useRef<Group>(null);
  const targetPosition = useRef(new Vector3());
  const targetScale = useRef(new Vector3(1, 1, 1));
  const palette = TEAM_PALETTES[piece.color];
  const profile = ROLE_ANIMATION_PROFILE[piece.role];
  const phase = useMemo(() => hashToUnitInterval(piece.id) * Math.PI * 2, [piece.id]);
  const basePosition = useMemo(() => {
    const [x, , z] = squareToBoardPosition(piece.square);
    return [x, 0.16, z] as [number, number, number];
  }, [piece.square]);

  const Body = PIECE_COMPONENTS[piece.role];
  const ringColor = isCheckedKing
    ? "#c75a54"
    : isSelected
      ? palette.aura
      : isThreatened
        ? "#6ea680"
        : "#7b8eae";

  useFrame(({ clock }) => {
    if (!root.current) {
      return;
    }

    const from = animation?.fromSquare
      ? squareToBoardPosition(animation.fromSquare)
      : squareToBoardPosition(piece.square);
    const to = animation?.toSquare
      ? squareToBoardPosition(animation.toSquare)
      : squareToBoardPosition(piece.square);
    const progress = animation
      ? MathUtils.clamp((Date.now() - animation.startedAt) / animation.durationMs, 0, 1)
      : 1;
    const eased = easeInOutCubic(progress);
    const idle = Math.sin(clock.elapsedTime * profile.idleSpeed * 2.4 + phase) * profile.idleBob;

    let y = 0.16 + idle;
    let rotationY = piece.color === "white" ? 0 : Math.PI;
    let rotationZ = 0;
    let scale = 1;

    if (animation) {
      y += animation.kind === "defeat" ? 0 : Math.sin(progress * Math.PI) * animation.arcHeight;
      rotationY += animation.kind === "capture" ? Math.sin(progress * Math.PI) * profile.attackLean : 0;
      rotationY += animation.kind === "castle" ? Math.sin(progress * Math.PI) * 0.12 : 0;

      if (animation.kind === "promotion") {
        scale = 0.94 + 0.18 * Math.sin(progress * Math.PI);
        y += 0.08 * Math.sin(progress * Math.PI);
      }

      if (animation.kind === "defeat") {
        y -= eased * 0.75;
        rotationZ = eased * 0.55;
        scale = 1 - eased * 0.34;
      }
    }

    if (isSelected) {
      y += profile.selectionLift + Math.sin(clock.elapsedTime * 10 + phase) * 0.014;
    }

    if (isThreatened) {
      y += Math.sin(clock.elapsedTime * 12 + phase) * 0.012;
    }

    if (isCheckedKing) {
      y += 0.03;
      rotationY += Math.sin(clock.elapsedTime * 13) * 0.09;
    }

    targetPosition.current.set(
      MathUtils.lerp(from[0], to[0], eased),
      y,
      MathUtils.lerp(from[2], to[2], eased)
    );
    targetScale.current.setScalar(scale);

    root.current.position.lerp(targetPosition.current, 0.24);
    root.current.scale.lerp(targetScale.current, 0.18);
    root.current.rotation.y = MathUtils.lerp(root.current.rotation.y, rotationY, 0.18);
    root.current.rotation.z = MathUtils.lerp(root.current.rotation.z, rotationZ, 0.16);
  });

  return (
    <group
      ref={root}
      position={basePosition}
      onClick={(event) => {
        event.stopPropagation();
        if (interactive) {
          onSelect(piece.square);
        }
      }}
      onPointerEnter={(event) => {
        event.stopPropagation();
        onHover(piece.square);
      }}
      onPointerLeave={() => {
        onHover(undefined);
      }}
    >
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]} visible={isSelected || isThreatened || isCheckedKing || isLastMoved}>
        <torusGeometry args={[0.38, 0.045, 16, 40]} />
        <meshStandardMaterial color={ringColor} emissive={ringColor} emissiveIntensity={isSelected || isCheckedKing ? 0.55 : 0.22} transparent opacity={0.88} />
      </mesh>
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} visible={isSelected}>
        <circleGeometry args={[0.28, 30]} />
        <meshBasicMaterial color={palette.aura} transparent opacity={0.18} />
      </mesh>
      <Body palette={palette} emphasis={animation?.emphasis ?? (isSelected ? 0.72 : 0.3)} />
    </group>
  );
});
