import type { Square } from "chess.js";

export type PieceColor = "white" | "black";
export type PieceRole = "pawn" | "knight" | "bishop" | "rook" | "queen" | "king";
export type PromotionRole = Exclude<PieceRole, "pawn" | "king">;
export type AnimationMode = "fast" | "normal" | "cinematic";

export type GameStatus =
  | "ongoing"
  | "check"
  | "checkmate"
  | "stalemate"
  | "draw"
  | "insufficient-material"
  | "threefold-repetition"
  | "fifty-move-rule";

export interface BoardPiece {
  square: Square;
  color: PieceColor;
  role: PieceRole;
}

export interface LegalMove {
  from: Square;
  to: Square;
  san: string;
  flags: string;
  piece: PieceRole;
  captured?: PieceRole;
  promotion?: PromotionRole;
  isCapture: boolean;
  isCastleKingside: boolean;
  isCastleQueenside: boolean;
  isEnPassant: boolean;
  isPromotion: boolean;
}

export interface MoveRecord {
  index: number;
  color: PieceColor;
  san: string;
  lan: string;
  from: Square;
  to: Square;
  piece: PieceRole;
  captured?: PieceRole;
  promotion?: PromotionRole;
  flags: string;
  fenAfter: string;
  pgnAfter: string;
  check: boolean;
  checkmate: boolean;
  stalemate: boolean;
  draw: boolean;
}

export interface ChessSnapshot {
  fen: string;
  pgn: string;
  turn: PieceColor;
  board: BoardPiece[];
  status: GameStatus;
  winner: PieceColor | null;
  check: boolean;
  checkmate: boolean;
  stalemate: boolean;
  draw: boolean;
  insufficientMaterial: boolean;
  threefoldRepetition: boolean;
  fiftyMoveRule: boolean;
  halfmoveClock: number;
  fullmoveNumber: number;
  history: MoveRecord[];
  lastMove?: MoveRecord;
  capturedBy: Record<PieceColor, PieceRole[]>;
  kingSquares: Record<PieceColor, Square | null>;
}

export interface EngineMoveRequest {
  from: Square;
  to: Square;
  promotion?: PromotionRole;
}

export interface EngineMoveResult {
  move: MoveRecord;
  snapshot: ChessSnapshot;
  specialMove:
    | "normal"
    | "capture"
    | "castle-kingside"
    | "castle-queenside"
    | "en-passant"
    | "promotion";
  capturedSquare?: Square;
  rookMove?: {
    from: Square;
    to: Square;
  };
}

export interface PendingPromotion {
  from: Square;
  to: Square;
  color: PieceColor;
}

export type SceneAnimationKind = "move" | "capture" | "defeat" | "castle" | "promotion";

export interface SceneAnimation {
  id: string;
  pieceId: string;
  kind: SceneAnimationKind;
  startedAt: number;
  durationMs: number;
  fromSquare: Square;
  toSquare?: Square;
  arcHeight: number;
  emphasis: number;
  capturedPieceId?: string;
}

export interface ScenePiece {
  id: string;
  color: PieceColor;
  role: PieceRole;
  square: Square;
  alive: boolean;
  originatingSquare: Square;
  wasPromoted: boolean;
  pendingRemoval: boolean;
}

export interface GameSettings {
  animationMode: AnimationMode;
  soundEnabled: boolean;
  reducedMotion: boolean;
}
