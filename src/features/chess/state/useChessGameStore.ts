import type { Square } from "chess.js";
import { create } from "zustand";

import { ChessEngine } from "@/features/chess/engine/chess-engine";
import { buildSceneTransition } from "@/features/chess/orchestration/animation-pipeline";
import type {
  AnimationMode,
  ChessSnapshot,
  EngineMoveRequest,
  PendingPromotion,
  PromotionRole,
  SceneAnimation,
  ScenePiece
} from "@/features/chess/types/chess";
import { createScenePiecesFromBoard } from "@/features/chess/utils/pieces";

interface ChessGameStore {
  engine: ChessEngine;
  snapshot: ChessSnapshot;
  scenePieces: ScenePiece[];
  activeAnimations: Record<string, SceneAnimation>;
  selection?: Square;
  hoveredSquare?: Square;
  legalTargets: Square[];
  captureTargets: Square[];
  pendingPromotion?: PendingPromotion;
  isInputLocked: boolean;
  settings: {
    animationMode: AnimationMode;
    soundEnabled: boolean;
    reducedMotion: boolean;
  };
  handleSquareClick: (square: Square) => void;
  setHoveredSquare: (square?: Square) => void;
  clearSelection: () => void;
  choosePromotion: (promotion: PromotionRole) => void;
  cancelPromotion: () => void;
  setAnimationMode: (mode: AnimationMode) => void;
  toggleSound: () => void;
  setReducedMotion: (reducedMotion: boolean) => void;
  restart: () => void;
  loadFen: (fen: string) => void;
}

const scheduledTimers = new Set<ReturnType<typeof setTimeout>>();

function clearScheduledTimers() {
  scheduledTimers.forEach((timer) => clearTimeout(timer));
  scheduledTimers.clear();
}

function scheduleTask(task: () => void, delayMs: number) {
  const timer = setTimeout(() => {
    scheduledTimers.delete(timer);
    task();
  }, delayMs);

  scheduledTimers.add(timer);
}

function getBoardPiece(snapshot: ChessSnapshot, square: Square) {
  return snapshot.board.find((piece) => piece.square === square);
}

function dedupeSquares(squares: Square[]) {
  return [...new Set(squares)].sort();
}

// The store is the orchestration boundary between the rules engine, UI intent, and render state.
export const createChessGameStore = () =>
  create<ChessGameStore>((set, get) => {
    const engine = new ChessEngine();
    const snapshot = engine.getSnapshot();

    const selectSquare = (square?: Square) => {
      if (!square) {
        set({
          selection: undefined,
          legalTargets: [],
          captureTargets: []
        });
        return;
      }

      const state = get();
      const piece = getBoardPiece(state.snapshot, square);
      if (!piece || piece.color !== state.snapshot.turn) {
        return;
      }

      const legalMoves = state.engine.getLegalMoves(square);
      set({
        selection: square,
        legalTargets: dedupeSquares(legalMoves.map((move) => move.to)),
        captureTargets: dedupeSquares(
          legalMoves.filter((move) => move.isCapture).map((move) => move.to)
        )
      });
    };

    const commitMove = (request: EngineMoveRequest) => {
      const state = get();
      if (state.isInputLocked) {
        return;
      }

      if (!request.promotion && state.engine.requiresPromotion(request.from, request.to)) {
        const mover = getBoardPiece(state.snapshot, request.from);
        if (mover) {
          set({
            pendingPromotion: {
              from: request.from,
              to: request.to,
              color: mover.color
            }
          });
        }

        return;
      }

      const moveResult = state.engine.applyMove(request);
      if (!moveResult) {
        return;
      }

      const transition = buildSceneTransition({
        scenePieces: state.scenePieces,
        moveResult,
        settings: state.settings
      });

      clearScheduledTimers();
      set({
        snapshot: moveResult.snapshot,
        scenePieces: transition.scenePieces,
        activeAnimations: transition.animations,
        selection: undefined,
        hoveredSquare: undefined,
        legalTargets: [],
        captureTargets: [],
        pendingPromotion: undefined,
        isInputLocked: transition.lockDurationMs > 1
      });

      transition.cleanup.forEach((step) => {
        scheduleTask(() => {
          if (step.type === "clear-animation") {
            set((current) => {
              const nextAnimations = { ...current.activeAnimations };
              delete nextAnimations[step.pieceId];
              return {
                activeAnimations: nextAnimations
              };
            });
            return;
          }

          set((current) => ({
            scenePieces: current.scenePieces.filter((piece) => piece.id !== step.pieceId)
          }));
        }, step.delayMs);
      });

      if (transition.lockDurationMs > 1) {
        scheduleTask(() => {
          set({ isInputLocked: false });
        }, transition.lockDurationMs);
      } else {
        set({ isInputLocked: false });
      }
    };

    return {
      engine,
      snapshot,
      scenePieces: createScenePiecesFromBoard(snapshot.board),
      activeAnimations: {},
      selection: undefined,
      hoveredSquare: undefined,
      legalTargets: [],
      captureTargets: [],
      pendingPromotion: undefined,
      isInputLocked: false,
      settings: {
        animationMode: "normal",
        soundEnabled: false,
        reducedMotion: false
      },
      handleSquareClick: (square) => {
        const state = get();
        if (state.pendingPromotion || state.isInputLocked) {
          return;
        }

        const occupant = getBoardPiece(state.snapshot, square);

        if (!state.selection) {
          if (occupant && occupant.color === state.snapshot.turn) {
            selectSquare(square);
          }
          return;
        }

        if (state.selection === square) {
          selectSquare(undefined);
          return;
        }

        if (occupant && occupant.color === state.snapshot.turn) {
          selectSquare(square);
          return;
        }

        commitMove({
          from: state.selection,
          to: square
        });
      },
      setHoveredSquare: (square) => {
        set({ hoveredSquare: square });
      },
      clearSelection: () => {
        selectSquare(undefined);
      },
      choosePromotion: (promotion) => {
        const pendingPromotion = get().pendingPromotion;
        if (!pendingPromotion) {
          return;
        }

        commitMove({
          ...pendingPromotion,
          promotion
        });
      },
      cancelPromotion: () => {
        const pendingPromotion = get().pendingPromotion;
        set({ pendingPromotion: undefined });
        if (pendingPromotion) {
          selectSquare(pendingPromotion.from);
        }
      },
      setAnimationMode: (animationMode) => {
        set((state) => ({
          settings: {
            ...state.settings,
            animationMode
          }
        }));
      },
      toggleSound: () => {
        set((state) => ({
          settings: {
            ...state.settings,
            soundEnabled: !state.settings.soundEnabled
          }
        }));
      },
      setReducedMotion: (reducedMotion) => {
        set((state) => ({
          settings: {
            ...state.settings,
            reducedMotion
          }
        }));
      },
      restart: () => {
        clearScheduledTimers();
        const nextEngine = new ChessEngine();
        const nextSnapshot = nextEngine.getSnapshot();
        set((state) => ({
          engine: nextEngine,
          snapshot: nextSnapshot,
          scenePieces: createScenePiecesFromBoard(nextSnapshot.board),
          activeAnimations: {},
          selection: undefined,
          hoveredSquare: undefined,
          legalTargets: [],
          captureTargets: [],
          pendingPromotion: undefined,
          isInputLocked: false,
          settings: state.settings
        }));
      },
      loadFen: (fen) => {
        clearScheduledTimers();
        const nextEngine = new ChessEngine(fen);
        const nextSnapshot = nextEngine.getSnapshot();
        set((state) => ({
          engine: nextEngine,
          snapshot: nextSnapshot,
          scenePieces: createScenePiecesFromBoard(nextSnapshot.board),
          activeAnimations: {},
          selection: undefined,
          hoveredSquare: undefined,
          legalTargets: [],
          captureTargets: [],
          pendingPromotion: undefined,
          isInputLocked: false,
          settings: state.settings
        }));
      }
    };
  });

export const useChessGameStore = createChessGameStore();



