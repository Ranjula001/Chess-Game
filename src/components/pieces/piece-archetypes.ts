import type { PieceColor, PieceRole } from "@/features/chess/types/chess";

export interface TeamPalette {
  skin: string;
  armor: string;
  cloth: string;
  metal: string;
  glow: string;
  aura: string;
}

export interface PieceBodyProps {
  palette: TeamPalette;
  emphasis: number;
}

export const TEAM_PALETTES: Record<PieceColor, TeamPalette> = {
  white: {
    skin: "#d7c3ad",
    armor: "#d9e1ef",
    cloth: "#52697f",
    metal: "#e7bc74",
    glow: "#f0c98b",
    aura: "#f0c98b"
  },
  black: {
    skin: "#a78168",
    armor: "#3a4458",
    cloth: "#617763",
    metal: "#c18d4b",
    glow: "#8fa99c",
    aura: "#83a292"
  }
};

export const ROLE_ANIMATION_PROFILE: Record<
  PieceRole,
  {
    idleBob: number;
    idleSpeed: number;
    attackLean: number;
    selectionLift: number;
  }
> = {
  pawn: {
    idleBob: 0.016,
    idleSpeed: 1.6,
    attackLean: 0.22,
    selectionLift: 0.06
  },
  knight: {
    idleBob: 0.022,
    idleSpeed: 2.1,
    attackLean: 0.34,
    selectionLift: 0.08
  },
  bishop: {
    idleBob: 0.02,
    idleSpeed: 1.4,
    attackLean: 0.2,
    selectionLift: 0.07
  },
  rook: {
    idleBob: 0.012,
    idleSpeed: 1.15,
    attackLean: 0.18,
    selectionLift: 0.05
  },
  queen: {
    idleBob: 0.024,
    idleSpeed: 1.95,
    attackLean: 0.3,
    selectionLift: 0.08
  },
  king: {
    idleBob: 0.014,
    idleSpeed: 1.1,
    attackLean: 0.16,
    selectionLift: 0.05
  }
};
