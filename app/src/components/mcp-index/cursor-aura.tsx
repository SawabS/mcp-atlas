"use client";

import { useReducedMotion } from "motion/react";
import { Cursor, useCursorState } from "motion-plus/react";

/** Motion+'s state-aware, reduced-motion-safe custom cursor. */
export function CursorAura() {
  const shouldReduceMotion = useReducedMotion();
  const cursor = useCursorState();

  if (shouldReduceMotion) return null;

  return <Cursor className="index-motion-cursor" data-index-cursor={cursor.type} />;
}
