import type { SceneAnimation, ScenePiece } from "@/features/chess/types/chess";
import type { EngineMoveResult, GameSettings } from "@/features/chess/types/chess";

interface CleanupStep {
  delayMs: number;
  type: "clear-animation" | "remove-piece";
  pieceId: string;
}

export interface SceneTransition {
  scenePieces: ScenePiece[];
  animations: Record<string, SceneAnimation>;
  cleanup: CleanupStep[];
  lockDurationMs: number;
}

const MODE_DURATIONS = {
  fast: {
    move: 140,
    capture: 180,
    defeat: 180,
    castle: 160,
    promotion: 220,
    finish: 220
  },
  normal: {
    move: 260,
    capture: 340,
    defeat: 320,
    castle: 300,
    promotion: 420,
    finish: 420
  },
  cinematic: {
    move: 420,
    capture: 520,
    defeat: 500,
    castle: 460,
    promotion: 620,
    finish: 640
  }
} as const;

const ROLE_ARC: Record<ScenePiece["role"], number> = {
  pawn: 0.18,
  knight: 0.34,
  bishop: 0.24,
  rook: 0.12,
  queen: 0.28,
  king: 0.16
};

export function getPresentationDurations(settings: GameSettings) {
  if (settings.reducedMotion) {
    return {
      move: 1,
      capture: 1,
      defeat: 1,
      castle: 1,
      promotion: 1,
      finish: 1
    };
  }

  return MODE_DURATIONS[settings.animationMode];
}

function clonePieces(pieces: ScenePiece[]) {
  return pieces.map((piece) => ({ ...piece }));
}

function findRenderablePiece(pieces: ScenePiece[], square: ScenePiece["square"]) {
  return pieces.find((piece) => piece.alive && !piece.pendingRemoval && piece.square === square);
}

// This pipeline turns an already-validated chess move into visual piece state and timed animation cleanup.
export function buildSceneTransition({
  scenePieces,
  moveResult,
  settings
}: {
  scenePieces: ScenePiece[];
  moveResult: EngineMoveResult;
  settings: GameSettings;
}): SceneTransition {
  const pieces = clonePieces(scenePieces);
  const animations: Record<string, SceneAnimation> = {};
  const cleanup: CleanupStep[] = [];
  const now = Date.now();
  const durations = getPresentationDurations(settings);

  const movingPiece = findRenderablePiece(pieces, moveResult.move.from);
  if (!movingPiece) {
    return {
      scenePieces,
      animations,
      cleanup,
      lockDurationMs: 0
    };
  }

  const mainDuration = moveResult.specialMove === "promotion"
    ? durations.promotion
    : moveResult.specialMove.startsWith("castle")
      ? durations.castle
      : moveResult.move.captured
        ? durations.capture
        : durations.move;

  const animationKind = moveResult.specialMove === "promotion"
    ? "promotion"
    : moveResult.specialMove.startsWith("castle")
      ? "castle"
      : moveResult.move.captured
        ? "capture"
        : "move";

  movingPiece.square = moveResult.move.to;
  if (moveResult.move.promotion) {
    movingPiece.role = moveResult.move.promotion;
    movingPiece.wasPromoted = true;
  }

  animations[movingPiece.id] = {
    id: `${movingPiece.id}-${now}`,
    pieceId: movingPiece.id,
    kind: animationKind,
    startedAt: now,
    durationMs: mainDuration,
    fromSquare: moveResult.move.from,
    toSquare: moveResult.move.to,
    arcHeight: ROLE_ARC[movingPiece.role] * (settings.animationMode === "cinematic" ? 1.35 : 1),
    emphasis: moveResult.snapshot.checkmate ? 1 : moveResult.snapshot.check ? 0.75 : 0.45
  };
  cleanup.push({
    delayMs: mainDuration,
    type: "clear-animation",
    pieceId: movingPiece.id
  });

  if (moveResult.rookMove) {
    const rook = findRenderablePiece(pieces, moveResult.rookMove.from);
    if (rook) {
      rook.square = moveResult.rookMove.to;
      animations[rook.id] = {
        id: `${rook.id}-${now}`,
        pieceId: rook.id,
        kind: "castle",
        startedAt: now,
        durationMs: durations.castle,
        fromSquare: moveResult.rookMove.from,
        toSquare: moveResult.rookMove.to,
        arcHeight: ROLE_ARC[rook.role] * 0.6,
        emphasis: 0.4
      };
      cleanup.push({
        delayMs: durations.castle,
        type: "clear-animation",
        pieceId: rook.id
      });
    }
  }

  if (moveResult.capturedSquare) {
    const defender = findRenderablePiece(pieces, moveResult.capturedSquare);
    if (defender) {
      defender.pendingRemoval = true;
      animations[defender.id] = {
        id: `${defender.id}-${now}`,
        pieceId: defender.id,
        kind: "defeat",
        startedAt: now,
        durationMs: durations.defeat,
        fromSquare: defender.square,
        arcHeight: 0,
        emphasis: 0.85
      };
      cleanup.push({
        delayMs: durations.defeat,
        type: "clear-animation",
        pieceId: defender.id
      });
      cleanup.push({
        delayMs: durations.defeat,
        type: "remove-piece",
        pieceId: defender.id
      });
    }
  }

  const lockDurationMs = Math.max(
    mainDuration,
    moveResult.capturedSquare ? durations.defeat : 0,
    moveResult.snapshot.checkmate ? durations.finish : 0
  );

  return {
    scenePieces: pieces,
    animations,
    cleanup,
    lockDurationMs
  };
}



