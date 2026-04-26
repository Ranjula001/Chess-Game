"use client";

import { motion } from "motion/react";

import { useChessGameStore } from "@/stores/useChessGameStore";
import { formatColor } from "@/features/chess/utils/display";
import { PIECE_GLYPHS } from "@/features/chess/utils/pieces";

export function CapturedPiecesPanel() {
  const capturedBy = useChessGameStore((state) => state.snapshot.capturedBy);

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay: 0.04 }}
      className="panel-surface rounded-[28px] p-5"
    >
      <p className="text-[11px] uppercase tracking-[0.32em] text-ember-300/80">Captured Forces</p>
      <div className="mt-4 grid gap-3">
        {(["white", "black"] as const).map((color) => (
          <div key={color} className="rounded-[20px] border border-white/8 bg-white/5 p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-white">{formatColor(color)} captures</p>
              <span className="text-xs uppercase tracking-[0.18em] text-steel-400">{capturedBy[color].length} taken</span>
            </div>
            <div className="mt-3 flex min-h-9 flex-wrap gap-2">
              {capturedBy[color].length ? (
                capturedBy[color].map((role, index) => (
                  <span
                    key={`${color}-${role}-${index}`}
                    className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-base text-steel-100"
                    title={role}
                  >
                    {PIECE_GLYPHS[color][role]}
                  </span>
                ))
              ) : (
                <span className="text-sm text-steel-400">No opposing archetypes removed yet.</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
