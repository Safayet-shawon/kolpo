"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Carousel.module.css";

/** Left-to-right carousel. Every slide is the same size (set in CSS); scroll-snaps, swipes, and has Prev/Next buttons. */
export default function Carousel({ label, children }: { label: string; children: React.ReactNode }) {
  const track = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft < 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [update]);

  const go = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const slide = el.querySelector("li");
    const step = (slide?.getBoundingClientRect().width ?? 300) + 16;
    el.scrollBy({ left: dir * step * (el.clientWidth > 700 ? 2 : 1), behavior: "smooth" });
  };

  return (
    <div className={styles.wrap} role="region" aria-roledescription="carousel" aria-label={label}>
      <div className={styles.controls}>
        <button type="button" onClick={() => go(-1)} disabled={edge.start} aria-label="Previous">
          ←
        </button>
        <button type="button" onClick={() => go(1)} disabled={edge.end} aria-label="Next">
          →
        </button>
      </div>
      <ul ref={track} className={styles.track} tabIndex={0} aria-label={`${label} slides`}>
        {children}
      </ul>
    </div>
  );
}
