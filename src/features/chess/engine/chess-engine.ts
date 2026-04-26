import { Chess, type Move, type PieceSymbol, type Square } from "chess.js";

import type {
  BoardPiece,
  ChessSnapshot,
  EngineMoveRequest,
  EngineMoveResult,
  GameStatus,
  LegalMove,
  MoveRecord,
  PieceColor,
  PieceRole,
  PromotionRole
} from "@/features/chess/types/chess";
import { FILES, getEnPassantCaptureSquare } from "@/features/chess/utils/board";
import { getOpposingColor, toPieceColor, toPieceRole, toPieceSymbol } from "@/features/chess/utils/pieces";

type ChessCompatibility = Chess & {
  inCheck?: () => boolean;
  isCheck?: () => boolean;
  isDrawByFiftyMoves?: () => boolean;
};

function serializeBoard(game: Chess): BoardPiece[] {
  const rows = game.board();
  const pieces: BoardPiece[] = [];

  rows.forEach((row, rowIndex) => {
    row.forEach((piece, fileIndex) => {
      if (!piece) {
        return;
      }

      pieces.push({
        square: `${FILES[fileIndex]}${8 - rowIndex}` as Square,
        color: toPieceColor(piece.color),
        role: toPieceRole(piece.type)
      });
    });
  });

  return pieces.sort((left, right) => left.square.localeCompare(right.square));
}

function isGameInCheck(game: Chess) {
  const compatible = game as ChessCompatibility;
  return compatible.inCheck ? compatible.inCheck() : compatible.isCheck ? compatible.isCheck() : false;
}

function isDrawByFifty(game: Chess) {
  const compatible = game as ChessCompatibility;
  return compatible.isDrawByFiftyMoves ? compatible.isDrawByFiftyMoves() : false;
}

function toPromotionRole(symbol?: PieceSymbol): PromotionRole | undefined {
  return symbol ? (toPieceRole(symbol) as PromotionRole) : undefined;
}

function mapVerboseMove(move: Move): LegalMove {
  return {
    from: move.from,
    to: move.to,
    san: move.san,
    flags: move.flags,
    piece: toPieceRole(move.piece),
    captured: move.captured ? toPieceRole(move.captured) : undefined,
    promotion: toPromotionRole(move.promotion),
    isCapture: Boolean(move.captured),
    isCastleKingside: move.flags.includes("k"),
    isCastleQueenside: move.flags.includes("q"),
    isEnPassant: move.flags.includes("e"),
    isPromotion: move.flags.includes("p")
  };
}

function buildHistory(game: Chess, baseFen: string): MoveRecord[] {
  const replay = new Chess(baseFen);
  const verboseHistory = game.history({ verbose: true }) as Move[];

  return verboseHistory.map((move, index) => {
    replay.move({
      from: move.from,
      to: move.to,
      promotion: move.promotion
    });

    return {
      index: index + 1,
      color: toPieceColor(move.color),
      san: move.san,
      lan: `${move.from}${move.to}${move.promotion ?? ""}`,
      from: move.from,
      to: move.to,
      piece: toPieceRole(move.piece),
      captured: move.captured ? toPieceRole(move.captured) : undefined,
      promotion: toPromotionRole(move.promotion),
      flags: move.flags,
      fenAfter: replay.fen(),
      pgnAfter: replay.pgn(),
      check: isGameInCheck(replay),
      checkmate: replay.isCheckmate(),
      stalemate: replay.isStalemate(),
      draw: replay.isDraw()
    } satisfies MoveRecord;
  });
}

function deriveStatus(game: Chess): GameStatus {
  if (game.isCheckmate()) {
    return "checkmate";
  }

  if (game.isStalemate()) {
    return "stalemate";
  }

  if (game.isInsufficientMaterial()) {
    return "insufficient-material";
  }

  if (game.isThreefoldRepetition()) {
    return "threefold-repetition";
  }

  if (isDrawByFifty(game)) {
    return "fifty-move-rule";
  }

  if (game.isDraw()) {
    return "draw";
  }

  if (isGameInCheck(game)) {
    return "check";
  }

  return "ongoing";
}

function deriveCapturedBy(history: MoveRecord[]) {
  const capturedBy: Record<PieceColor, PieceRole[]> = {
    white: [],
    black: []
  };

  history.forEach((move) => {
    if (move.captured) {
      capturedBy[move.color].push(move.captured);
    }
  });

  return capturedBy;
}

// The engine wraps chess.js so the rest of the app only consumes typed snapshots and move results.
export class ChessEngine {
  private game: Chess;
  private baseFen: string;

  constructor(fen?: string) {
    this.game = fen ? new Chess(fen) : new Chess();
    this.baseFen = fen ?? new Chess().fen();
  }

  getSnapshot(): ChessSnapshot {
    const fen = this.game.fen();
    const [, turnFen, , , halfmoveClock, fullmoveNumber] = fen.split(" ");
    const board = serializeBoard(this.game);
    const history = buildHistory(this.game, this.baseFen);
    const kingSquares = board.reduce<ChessSnapshot["kingSquares"]>(
      (squares, piece) => {
        if (piece.role === "king") {
          squares[piece.color] = piece.square;
        }

        return squares;
      },
      {
        white: null,
        black: null
      }
    );
    const turn = toPieceColor(turnFen as "w" | "b");

    return {
      fen,
      pgn: this.game.pgn(),
      turn,
      board,
      status: deriveStatus(this.game),
      winner: this.game.isCheckmate() ? getOpposingColor(turn) : null,
      check: isGameInCheck(this.game),
      checkmate: this.game.isCheckmate(),
      stalemate: this.game.isStalemate(),
      draw: this.game.isDraw(),
      insufficientMaterial: this.game.isInsufficientMaterial(),
      threefoldRepetition: this.game.isThreefoldRepetition(),
      fiftyMoveRule: isDrawByFifty(this.game),
      halfmoveClock: Number(halfmoveClock),
      fullmoveNumber: Number(fullmoveNumber),
      history,
      lastMove: history.at(-1),
      capturedBy: deriveCapturedBy(history),
      kingSquares
    };
  }

  getLegalMoves(square?: Square) {
    const moves = this.game.moves(
      square ? { square, verbose: true } : { verbose: true }
    ) as Move[];

    return moves.map(mapVerboseMove);
  }

  requiresPromotion(from: Square, to: Square) {
    return this.getLegalMoves(from).some((move) => move.to === to && move.isPromotion);
  }

  applyMove(request: EngineMoveRequest): EngineMoveResult | null {
    const move = this.game.move({
      from: request.from,
      to: request.to,
      promotion: request.promotion ? toPieceSymbol(request.promotion) : undefined
    }) as Move | null;

    if (!move) {
      return null;
    }

    const snapshot = this.getSnapshot();
    const specialMove = move.promotion
      ? "promotion"
      : move.flags.includes("k")
        ? "castle-kingside"
        : move.flags.includes("q")
          ? "castle-queenside"
          : move.flags.includes("e")
            ? "en-passant"
            : move.captured
              ? "capture"
              : "normal";

    const rookMove = move.flags.includes("k")
      ? {
          from: `h${move.from[1]}` as Square,
          to: `f${move.from[1]}` as Square
        }
      : move.flags.includes("q")
        ? {
            from: `a${move.from[1]}` as Square,
            to: `d${move.from[1]}` as Square
          }
        : undefined;

    return {
      move: snapshot.lastMove!,
      snapshot,
      specialMove,
      capturedSquare: move.flags.includes("e")
        ? getEnPassantCaptureSquare(move.to, toPieceColor(move.color))
        : move.captured
          ? move.to
          : undefined,
      rookMove
    };
  }

  loadFen(fen: string) {
    this.baseFen = fen;
    this.game.load(fen);
    return this.getSnapshot();
  }

  reset() {
    this.game.reset();
    this.baseFen = this.game.fen();
    return this.getSnapshot();
  }
}



