"use client";

import { motion } from "motion/react";

import { useChessGameStore } from "@/stores/useChessGameStore";
import { ANIMATION_MODE_OPTIONS } from "@/features/chess/utils/display";

export function SettingsPanel() {
  const settings = useChessGameStore((state) => state.settings);
  const setAnimationMode = useChessGameStore((state) => state.setAnimationMode);
  const toggleSound = useChessGameStore((state) => state.toggleSound);

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay: 0.08 }}
      className="panel-surface rounded-[28px] p-5"
    >
      <p className="text-[11px] uppercase tracking-[0.32em] text-ember-300/80">Presentation</p>
      <div className="mt-4 space-y-2">
        {ANIMATION_MODE_OPTIONS.map((option) => {
          const active = settings.animationMode === option.mode;
          return (
            <button
              key={option.mode}
              type="button"
              onClick={() => setAnimationMode(option.mode)}
              className={`w-full rounded-[18px] border px-4 py-3 text-left transition ${
                active
                  ? "border-ember-300/35 bg-ember-300/10 shadow-glow"
                  : "border-white/8 bg-white/5 hover:border-white/15 hover:bg-white/7"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-white">{option.label}</span>
                {active && (
                  <span className="text-[11px] uppercase tracking-[0.2em] text-ember-300">Active</span>
                )}
              </div>
              <p className="mt-2 text-sm leading-6 text-steel-300">{option.description}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-5 rounded-[20px] border border-white/8 bg-white/5 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-white">Sound Toggle</p>
            <p className="mt-1 text-sm leading-6 text-steel-300">UI state only for the MVP. Audio systems land next.</p>
          </div>
          <button
            type="button"
            onClick={toggleSound}
            className={`rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
              settings.soundEnabled
                ? "border-moss-300/30 bg-moss-300/12 text-moss-300"
                : "border-white/10 bg-transparent text-steel-300 hover:border-white/15 hover:text-white"
            }`}
          >
            {settings.soundEnabled ? "On" : "Off"}
          </button>
        </div>
      </div>

      <div className="mt-5 rounded-[20px] border border-white/8 bg-white/5 p-4">
        <p className="text-sm font-semibold text-white">Future Systems</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            "AI Seat",
            "Online Match",
            "Replay Mode",
            "Theme Skins"
          ].map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/10 bg-transparent px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-steel-400"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
