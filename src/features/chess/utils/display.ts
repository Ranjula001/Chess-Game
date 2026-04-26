import type { AnimationMode, ChessSnapshot, PieceColor, PromotionRole } from "@/features/chess/types/chess";

import { PIECE_LABELS } from "@/features/chess/utils/pieces";

export const ANIMATION_MODE_OPTIONS: Array<{
  mode: AnimationMode;
  label: string;
  description: string;
}> = [
  {
    mode: "fast",
    label: "Fast",
    description: "Competitive clarity with near-instant tactical motion."
  },
  {
    mode: "normal",
    label: "Normal",
    description: "Readable cinematic beats tuned for regular play."
  },
  {
    mode: "cinematic",
    label: "Cinematic",
    description: "Fuller attacks and presence without stalling the match."
  }
];

export const PROMOTION_COPY: Record<PromotionRole, string> = {
  queen: "Elevate into the sovereign finisher.",
  rook: "Promote into a fortress-class protector.",
  bishop: "Ascend into the mystic battle cleric.",
  knight: "Shift into the agile duelist archetype."
};

export function formatColor(color: PieceColor) {
  return color === "white" ? "White" : "Black";
}

export function describeGameStatus(snapshot: ChessSnapshot): {
  tone: "calm" | "alert" | "end";
  title: string;
  detail: string;
} {
  if (snapshot.checkmate) {
    return {
      tone: "end",
      title: `${formatColor(snapshot.winner ?? "white")} claims the field`,
      detail: `${formatColor(snapshot.turn)} has no legal response. Checkmate.`
    };
  }

  if (snapshot.stalemate) {
    return {
      tone: "end",
      title: "The battlefield freezes",
      detail: "No legal move remains, but the king is not in check."
    };
  }

  if (snapshot.status === "insufficient-material") {
    return {
      tone: "end",
      title: "Draw by insufficient material",
      detail: "Neither army can force mate from this material balance."
    };
  }

  if (snapshot.status === "threefold-repetition") {
    return {
      tone: "end",
      title: "Draw by repetition",
      detail: "The position repeated three times and the struggle resolves peacefully."
    };
  }

  if (snapshot.status === "fifty-move-rule") {
    return {
      tone: "end",
      title: "Draw by the fifty-move rule",
      detail: "No pawn move or capture reset the count in fifty moves."
    };
  }

  if (snapshot.check) {
    return {
      tone: "alert",
      title: `${formatColor(snapshot.turn)} king under pressure`,
      detail: "Respond to check before any other plan can continue."
    };
  }

  return {
    tone: "calm",
    title: `${formatColor(snapshot.turn)} to move`,
    detail: "Select a living archetype to reveal its legal lanes."
  };
}

export function describeLastMove(snapshot: ChessSnapshot) {
  if (!snapshot.lastMove) {
    return "Opening formation ready.";
  }

  const actor = `${formatColor(snapshot.lastMove.color)} ${PIECE_LABELS[snapshot.lastMove.piece]}`;
  const suffix = snapshot.lastMove.checkmate
    ? "delivered checkmate."
    : snapshot.lastMove.check
      ? "gave check."
      : snapshot.lastMove.captured
        ? `captured on ${snapshot.lastMove.to}.`
        : `advanced to ${snapshot.lastMove.to}.`;

  return `${actor} ${suffix}`;
}
