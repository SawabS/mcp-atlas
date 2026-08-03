"use client";

import { useReducedMotion } from "motion/react";
import { Cursor } from "motion-plus/react";

/** Motion+'s state-aware, reduced-motion-safe custom cursor. */
export function CursorAura() {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) return null;

  return <Cursor className="atlas-motion-cursor" />;
}
