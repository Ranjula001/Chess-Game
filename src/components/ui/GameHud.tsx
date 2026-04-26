"use client";

import { motion } from "motion/react";

import { useChessGameStore } from "@/stores/useChessGameStore";
import { describeGameStatus, describeLastMove, formatColor } from "@/features/chess/utils/display";

const TONE_STYLES = {
  calm: "border-moss-400/30 bg-moss-400/10 text-moss-300",
  alert: "border-ember-400/35 bg-ember-400/10 text-ember-300",
  end: "border-steel-300/30 bg-steel-300/10 text-steel-200"
} as const;

export function GameHud() {
  const snapshot = useChessGameStore((state) => state.snapshot);
  const isInputLocked = useChessGameStore((state) => state.isInputLocked);
  const restart = useChessGameStore((state) => state.restart);
  const status = describeGameStatus(snapshot);

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="panel-surface rounded-[28px] p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.32em] text-ember-300/80">Battle Status</p>
          <h2 className="mt-3 font-[var(--font-display)] text-3xl leading-none text-white">
            {status.title}
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-6 text-steel-300">{status.detail}</p>
        </div>
        <button
          type="button"
          onClick={restart}
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-steel-200 transition hover:border-ember-300/30 hover:bg-ember-300/10 hover:text-white"
        >
          New Game
        </button>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <div className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${TONE_STYLES[status.tone]}`}>
          {snapshot.checkmate ? "Checkmate" : snapshot.check ? "Check" : snapshot.status.replaceAll("-", " ")}
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-steel-200">
          {formatColor(snapshot.turn)} to act
        </div>
        {isInputLocked && (
          <div className="rounded-full border border-ember-300/25 bg-ember-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-ember-300">
            Resolving animation
          </div>
        )}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-[20px] border border-white/8 bg-white/5 p-3">
          <p className="text-[11px] uppercase tracking-[0.24em] text-steel-400">Turn</p>
          <p className="mt-2 text-lg font-semibold text-white">{formatColor(snapshot.turn)}</p>
        </div>
        <div className="rounded-[20px] border border-white/8 bg-white/5 p-3">
          <p className="text-[11px] uppercase tracking-[0.24em] text-steel-400">Moves</p>
          <p className="mt-2 text-lg font-semibold text-white">{snapshot.history.length}</p>
        </div>
        <div className="rounded-[20px] border border-white/8 bg-white/5 p-3">
          <p className="text-[11px] uppercase tracking-[0.24em] text-steel-400">Halfmove</p>
          <p className="mt-2 text-lg font-semibold text-white">{snapshot.halfmoveClock}</p>
        </div>
      </div>

      <p className="mt-5 text-sm leading-6 text-steel-300">{describeLastMove(snapshot)}</p>
    </motion.section>
  );
}
