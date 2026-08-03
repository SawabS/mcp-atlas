"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";

/** Reveals a block once it enters the viewport, with an optional stagger. */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
  ...rest
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "header" | "aside" | "li";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (typeof IntersectionObserver === "undefined") {
      element.classList.add("is-in");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={`reveal ${className}`.trim()}
      style={{ "--delay": `${delay}ms` } as CSSProperties}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Cursor-tracked sheen for glass surfaces. Pair with the `lit` class. */
export function useLit() {
  return useCallback((event: PointerEvent<HTMLElement>) => {
    const target = event.currentTarget;
    const bounds = target.getBoundingClientRect();
    target.style.setProperty("--mx", `${event.clientX - bounds.left}px`);
    target.style.setProperty("--my", `${event.clientY - bounds.top}px`);
  }, []);
}

/** True once the page has scrolled past `offset`. */
export function useScrolled(offset = 12) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > offset);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [offset]);

  return scrolled;
}
