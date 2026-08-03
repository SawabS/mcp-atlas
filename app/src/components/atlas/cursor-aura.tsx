"use client";

import { useEffect, useRef } from "react";

const ACTION_TARGET = "a, button, select, summary, [role='button'], [data-cursor]";
const TEXT_TARGET = "input, textarea, [contenteditable='true']";

/** A lightweight pointer treatment that never feeds high-frequency movement into React state. */
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
    let frame = 0;
    let targetX = -40;
    let targetY = -40;
    let ringX = -40;
    let ringY = -40;

    const place = (element: HTMLElement, x: number, y: number) => {
      element.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };

    const follow = () => {
      ringX += (targetX - ringX) * 0.2;
      ringY += (targetY - ringY) * 0.2;
      place(ring, ringX, ringY);
      if (Math.abs(targetX - ringX) + Math.abs(targetY - ringY) > 0.08) {
        frame = window.requestAnimationFrame(follow);
      } else {
        frame = 0;
      }
    };

    const wakeFollower = () => {
      if (!frame) frame = window.requestAnimationFrame(follow);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      targetX = event.clientX;
      targetY = event.clientY;
      place(dot, targetX, targetY);
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
      wakeFollower();
    };

    const onDown = () => ring.classList.add("is-down");
    const onUp = () => ring.classList.remove("is-down");
    const onLeave = () => {
      ring.classList.remove("is-visible", "is-down");
      dot.classList.remove("is-visible");
    };

    const enable = () => {
      if (enabled) return;
      enabled = true;
      document.documentElement.dataset.cursor = "aurora";
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onDown, { passive: true });
      window.addEventListener("pointerup", onUp, { passive: true });
      document.documentElement.addEventListener("mouseleave", onLeave);
    };

    const disable = () => {
      if (!enabled) return;
      enabled = false;
      delete document.documentElement.dataset.cursor;
      ring.classList.remove("is-visible", "is-down");
      dot.classList.remove("is-visible");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.cancelAnimationFrame(frame);
      frame = 0;
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
      <span className="cursor-aura-dot" ref={dotRef} aria-hidden="true" />
    </>
  );
}
