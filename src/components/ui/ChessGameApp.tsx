"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { useEffect } from "react";

import { CapturedPiecesPanel } from "@/components/ui/CapturedPiecesPanel";
import { GameHud } from "@/components/ui/GameHud";
import { MoveHistoryPanel } from "@/components/ui/MoveHistoryPanel";
import { PromotionModal } from "@/components/ui/PromotionModal";
import { SettingsPanel } from "@/components/ui/SettingsPanel";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useChessGameStore } from "@/stores/useChessGameStore";

const ChessScene = dynamic(
  () => import("@/components/scene/ChessScene").then((module) => module.ChessScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-sm uppercase tracking-[0.3em] text-steel-300">
        Loading scene
      </div>
    )
  }
);

// This root client shell coordinates layout, accessibility hooks, and lightweight automation state output.
export function ChessGameApp() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const setReducedMotion = useChessGameStore((state) => state.setReducedMotion);
  const clearSelection = useChessGameStore((state) => state.clearSelection);
  const restart = useChessGameStore((state) => state.restart);
  const snapshot = useChessGameStore((state) => state.snapshot);
  const scenePieces = useChessGameStore((state) => state.scenePieces);
  const selection = useChessGameStore((state) => state.selection);
  const legalTargets = useChessGameStore((state) => state.legalTargets);
  const pendingPromotion = useChessGameStore((state) => state.pendingPromotion);
  const isInputLocked = useChessGameStore((state) => state.isInputLocked);
  const settings = useChessGameStore((state) => state.settings);

  useEffect(() => {
    setReducedMotion(prefersReducedMotion);
  }, [prefersReducedMotion, setReducedMotion]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        clearSelection();
      }

      if (["n", "N", "r", "R"].includes(event.key)) {
        restart();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [clearSelection, restart]);

  useEffect(() => {
    window.render_game_to_text = () =>
      JSON.stringify({
        turn: snapshot.turn,
        status: snapshot.status,
        check: snapshot.check,
        checkmate: snapshot.checkmate,
        selection: selection ?? null,
        legalTargets,
        inputLocked: isInputLocked,
        pendingPromotion,
        lastMove: snapshot.lastMove
          ? {
              san: snapshot.lastMove.san,
              from: snapshot.lastMove.from,
              to: snapshot.lastMove.to
            }
          : null,
        pieces: scenePieces.map((piece) => ({
          id: piece.id,
          color: piece.color,
          role: piece.role,
          square: piece.square,
          pendingRemoval: piece.pendingRemoval
        }))
      });

    return () => {
      delete window.render_game_to_text;
    };
  }, [snapshot, selection, legalTargets, scenePieces, pendingPromotion, isInputLocked]);

  return (
    <main className="min-h-screen px-4 py-4 sm:px-5 lg:px-6">
      <div className="mx-auto grid max-w-[1540px] gap-4 xl:grid-cols-[minmax(0,1.45fr)_380px]">
        <section className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(217,154,83,0.14),transparent_34%),radial-gradient(circle_at_bottom,rgba(104,132,111,0.18),transparent_38%),linear-gradient(180deg,rgba(12,17,26,0.98),rgba(8,10,16,0.98))] p-3 shadow-panel">
          <div className="pointer-events-none absolute inset-0 bg-grain opacity-90" />
          <div className="relative flex items-end justify-between gap-4 px-2 pb-4 pt-2">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-ember-300/80">Official Rules, Living Theatre</p>
              <h1 className="mt-3 font-[var(--font-display)] text-5xl leading-none text-white sm:text-6xl">
                Cinematic Chess
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-steel-300">
                Official chess law drives every move. The scene only translates that truth into atmosphere, timing, and battle presence.
              </p>
            </div>
            <div className="hidden rounded-[24px] border border-white/10 bg-black/20 px-4 py-3 text-right text-xs uppercase tracking-[0.24em] text-steel-300 lg:block">
              <p>{settings.animationMode} mode</p>
              <p className="mt-2 text-[11px] tracking-[0.18em] text-steel-400">
                {prefersReducedMotion ? "Reduced motion active" : "Esc deselect | N new game"}
              </p>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="panel-surface relative h-[min(72vh,880px)] min-h-[600px] overflow-hidden rounded-[28px]"
          >
            <ChessScene />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 border-t border-white/10 bg-gradient-to-t from-black/45 to-transparent px-4 py-3 text-[11px] uppercase tracking-[0.22em] text-steel-300">
              <span>{snapshot.lastMove ? `Last move ${snapshot.lastMove.san}` : "Opening position"}</span>
              <span>{pendingPromotion ? "Promotion choice required" : isInputLocked ? "Animation lock" : `${snapshot.history.length} plies recorded`}</span>
            </div>
          </motion.div>
        </section>

        <aside className="grid gap-4 xl:h-[min(72vh,880px)] xl:min-h-[600px] xl:grid-rows-[auto_auto_auto_1fr]">
          <GameHud />
          <CapturedPiecesPanel />
          <SettingsPanel />
          <MoveHistoryPanel />
        </aside>
      </div>

      <PromotionModal />
    </main>
  );
}



