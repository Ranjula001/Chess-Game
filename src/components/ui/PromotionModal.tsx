"use client";

import { AnimatePresence, motion } from "motion/react";

import { useChessGameStore } from "@/stores/useChessGameStore";
import { PIECE_GLYPHS, PIECE_LABELS, PROMOTION_OPTIONS } from "@/features/chess/utils/pieces";
import { PROMOTION_COPY } from "@/features/chess/utils/display";

export function PromotionModal() {
  const pendingPromotion = useChessGameStore((state) => state.pendingPromotion);
  const choosePromotion = useChessGameStore((state) => state.choosePromotion);
  const cancelPromotion = useChessGameStore((state) => state.cancelPromotion);

  return (
    <AnimatePresence>
      {pendingPromotion && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className="panel-surface w-full max-w-3xl rounded-[32px] p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.32em] text-ember-300/80">Promotion</p>
                <h2 className="mt-3 font-[var(--font-display)] text-3xl leading-none text-white">
                  Choose the ascended archetype.
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-steel-300">
                  The pawn from {pendingPromotion.from} is reaching {pendingPromotion.to}. Select the official promotion piece to complete the move.
                </p>
              </div>
              <button
                type="button"
                onClick={cancelPromotion}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-steel-300 transition hover:border-white/20 hover:text-white"
              >
                Cancel
              </button>
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {PROMOTION_OPTIONS.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => choosePromotion(role)}
                  className="rounded-[24px] border border-white/8 bg-white/5 p-4 text-left transition hover:border-ember-300/30 hover:bg-ember-300/10"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-2xl text-white">{PIECE_GLYPHS[pendingPromotion.color][role]}</span>
                    <span className="text-[11px] uppercase tracking-[0.2em] text-ember-300">Official</span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white">{PIECE_LABELS[role]}</h3>
                  <p className="mt-2 text-sm leading-6 text-steel-300">{PROMOTION_COPY[role]}</p>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
