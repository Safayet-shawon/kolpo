"use client";

import { useEffect, useState } from "react";
import Wordmark from "./Wordmark";
import styles from "./Loader.module.css";

const MIN_MS = 900; // enough for the wordmark to draw once; not an artificial delay beyond that
const MAX_MS = 3200; // hard ceiling: never block the site on a slow or failed hero asset
const SEEN_KEY = "kolpo:loaded";

declare global {
  interface Window {
    __kolpoHeroReady?: boolean;
  }
}

/**
 * Brand loader shown on a hard page load only (not on internal navigation, and not again in the same
 * session). It waits for the active hero's first frame to decode, with a timeout. A CSS-only fallback
 * hides it after MAX_MS even if JavaScript never runs.
 */
export default function Loader() {
  const [gone, setGone] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    let done = false;
    let minTimer: number | undefined;

    const finish = () => {
      if (done) return;
      done = true;
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {}
      setLeaving(true);
      window.setTimeout(() => setGone(true), reduce ? 0 : 700);
    };

    const tryFinish = () => {
      const wait = Math.max(0, (seen || reduce ? 0 : MIN_MS) - (performance.now() - start));
      minTimer = window.setTimeout(finish, wait);
    };

    if (window.__kolpoHeroReady) tryFinish();
    else window.addEventListener("kolpo:hero-ready", tryFinish, { once: true });

    // Pages without a hero never emit the event; the ceiling covers them and slow assets.
    const ceiling = window.setTimeout(finish, seen ? 400 : MAX_MS);
    return () => {
      window.removeEventListener("kolpo:hero-ready", tryFinish);
      window.clearTimeout(ceiling);
      window.clearTimeout(minTimer);
    };
  }, []);

  if (gone) return null;
  return (
    <div className={`${styles.loader} ${leaving ? styles.leaving : ""}`} role="status" aria-live="polite" id="kolpo-loader">
      <div className={styles.inner}>
        <Wordmark className={styles.mark} draw />
        <span className={styles.sub}>Architecture · Interiors · Construction</span>
      </div>
      <span className="sr-only">Loading KOLPO</span>
    </div>
  );
}
