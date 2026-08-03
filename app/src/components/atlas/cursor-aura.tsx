"use client";

import { useEffect, useRef } from "react";

const ACTION_TARGET = "a, button, select, summary, [role='button'], [data-cursor]";
const TEXT_TARGET = "input, textarea, [contenteditable='true']";

/** A lightweight shooting-star cursor that never feeds pointer movement into React state. */
export function CursorAura() {
  const ringRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let enabled = false;
    let lastX = -40;
    let lastY = -40;
    let idleTimer = 0;

    const place = (element: HTMLElement, x: number, y: number) => {
      element.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      const x = event.clientX;
      const y = event.clientY;
      const dx = lastX < 0 ? 0 : x - lastX;
      const dy = lastY < 0 ? 0 : y - lastY;
      const velocity = Math.hypot(dx, dy);

      if (velocity > 0.2) {
        ring.style.setProperty("--shoot-angle", `${Math.atan2(dy, dx) * (180 / Math.PI)}deg`);
      }
      ring.style.setProperty("--shoot-length", `${Math.min(92, Math.max(28, 24 + velocity * 2.4))}px`);
      ring.classList.toggle("is-moving", velocity > 1.2);
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        ring.classList.remove("is-moving");
        ring.style.setProperty("--shoot-length", "28px");
      }, 90);

      lastX = x;
      lastY = y;
      place(ring, x, y);
      place(dot, x, y);
      ring.classList.add("is-visible");
      dot.classList.add("is-visible");

      const target = event.target instanceof Element ? event.target : null;
      const mode = target?.closest(TEXT_TARGET)
        ? "text"
        : target?.closest(".canvas-wrap canvas")
          ? "canvas"
          : target?.closest(ACTION_TARGET)
            ? "action"
            : "default";
      ring.dataset.mode = mode;
      dot.dataset.mode = mode;
    };

    const onDown = () => {
      ring.classList.add("is-down");
      dot.classList.add("is-down");
    };
    const onUp = () => {
      ring.classList.remove("is-down");
      dot.classList.remove("is-down");
    };
    const onLeave = () => {
      ring.classList.remove("is-visible", "is-moving", "is-down");
      dot.classList.remove("is-visible", "is-down");
      lastX = -40;
      lastY = -40;
    };

    const enable = () => {
      if (enabled) return;
      enabled = true;
      document.documentElement.dataset.cursor = "shooting-star";
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onDown, { passive: true });
      window.addEventListener("pointerup", onUp, { passive: true });
      document.documentElement.addEventListener("mouseleave", onLeave);
    };

    const disable = () => {
      if (!enabled) return;
      enabled = false;
      delete document.documentElement.dataset.cursor;
      ring.classList.remove("is-visible", "is-moving", "is-down");
      dot.classList.remove("is-visible", "is-down");
      lastX = -40;
      lastY = -40;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.clearTimeout(idleTimer);
    };

    const sync = () => (finePointer.matches && !reducedMotion.matches ? enable() : disable());
    sync();
    finePointer.addEventListener("change", sync);
    reducedMotion.addEventListener("change", sync);

    return () => {
      disable();
      finePointer.removeEventListener("change", sync);
      reducedMotion.removeEventListener("change", sync);
    };
  }, []);

  return (
    <>
      <span className="cursor-aura-ring" ref={ringRef} aria-hidden="true">
        <i />
      </span>
      <span className="cursor-aura-dot" ref={dotRef} aria-hidden="true">
        <i />
      </span>
    </>
  );
}
