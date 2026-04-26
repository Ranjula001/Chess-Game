"use client";

import { motion } from "motion/react";

import { useChessGameStore } from "@/stores/useChessGameStore";

export function MoveHistoryPanel() {
  const snapshot = useChessGameStore((state) => state.snapshot);
  const turns = [] as Array<{
    turn: number;
    white?: (typeof snapshot.history)[number];
    black?: (typeof snapshot.history)[number];
  }>;

  for (let index = 0; index < snapshot.history.length; index += 2) {
    turns.push({
      turn: Math.floor(index / 2) + 1,
      white: snapshot.history[index],
      black: snapshot.history[index + 1]
    });
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay: 0.12 }}
      className="panel-surface flex min-h-0 flex-col rounded-[28px] p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.32em] text-ember-300/80">Move History</p>
          <p className="mt-2 text-sm leading-6 text-steel-300">SAN history, FEN snapshot, and PGN export-ready notation.</p>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-steel-300">
          {snapshot.history.length} plies
        </div>
      </div>

      <div className="premium-scrollbar mt-4 flex-1 overflow-y-auto rounded-[20px] border border-white/8 bg-white/5 p-3">
        {turns.length ? (
          <div className="space-y-2">
            {turns.map((entry) => (
              <div key={entry.turn} className="grid grid-cols-[48px_minmax(0,1fr)_minmax(0,1fr)] gap-2 rounded-[16px] border border-white/6 bg-black/10 px-3 py-2 text-sm text-steel-200">
                <span className="text-steel-400">{entry.turn}.</span>
                <span>{entry.white?.san ?? "-"}</span>
                <span>{entry.black?.san ?? "-"}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-full min-h-32 items-center justify-center text-center text-sm text-steel-400">
            The opening ledger will populate as soon as the first move lands.
          </div>
        )}
      </div>

      <details className="mt-4 rounded-[20px] border border-white/8 bg-white/5 p-4">
        <summary className="cursor-pointer text-sm font-semibold text-white">Notation and Position Data</summary>
        <div className="mt-4 space-y-4 text-xs leading-6 text-steel-300">
          <div>
            <p className="uppercase tracking-[0.2em] text-steel-400">Current FEN</p>
            <code className="mt-2 block break-all rounded-[16px] border border-white/6 bg-black/20 px-3 py-2 text-[11px] text-steel-100">
              {snapshot.fen}
            </code>
          </div>
          <div>
            <p className="uppercase tracking-[0.2em] text-steel-400">Current PGN</p>
            <code className="mt-2 block whitespace-pre-wrap rounded-[16px] border border-white/6 bg-black/20 px-3 py-2 text-[11px] text-steel-100">
              {snapshot.pgn || "No moves recorded yet."}
            </code>
          </div>
        </div>
      </details>
    </motion.section>
  );
}
