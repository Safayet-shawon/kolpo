"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Photo from "@/components/Photo";
import type { Controller, SceneId } from "./runtime";
import styles from "./ThreeStage.module.css";

type Props = {
  id: SceneId;
  /** Persistent headline, copy and calls to action. Always visible and usable, never gated on the animation. */
  children: React.ReactNode;
  /** Text description of the whole sequence for assistive tech. */
  description: string;
  /** Used if WebGL is unavailable or the 3D scene fails to build. */
  fallbackImage: string;
  fallbackAlt: string;
};

declare global {
  interface Window {
    __kolpoHeroReady?: boolean;
  }
}

const SEEN = "kolpo:3d:";

function announceReady() {
  if (window.__kolpoHeroReady) return;
  window.__kolpoHeroReady = true;
  window.dispatchEvent(new Event("kolpo:hero-ready"));
}

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function ThreeStage({ id, children, description, fallbackImage, fallbackAlt }: Props) {
  const hostRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctrl = useRef<Controller | null>(null);
  const [mode, setMode] = useState<"loading" | "3d" | "fallback">("loading");
  const [stage, setStage] = useState({ i: 0, label: "", total: 0 });
  const [done, setDone] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  // Boot the scene (client only, dynamically imported so three/gsap never block the first paint).
  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    let cancelled = false;
    let controller: Controller | null = null;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN + id) === "1";
    } catch {}

    const fallback = (why?: unknown) => {
      if (why) console.error("[KOLPO] 3D scene unavailable, showing still image.", why);
      if (!cancelled) {
        setMode("fallback");
        setDone(true);
        announceReady();
      }
    };

    if (!hasWebGL()) {
      fallback();
      return;
    }

    const safety = window.setTimeout(() => announceReady(), 6000); // never hold the loader on a slow download
    import("./runtime")
      .then(({ createStage }) =>
        createStage(host, canvas, id, {
          onStage: (i, label, total) => !cancelled && setStage({ i, label, total }),
          onDone: () => {
            if (cancelled) return;
            setDone(true);
            try {
              sessionStorage.setItem(SEEN + id, "1");
            } catch {}
          },
        }),
      )
      .then((c) => {
        if (cancelled) return c.dispose();
        controller = c;
        ctrl.current = c;
        if (process.env.NODE_ENV !== "production") (window as unknown as { __stage?: Controller }).__stage = c; // QA hook
        setReduced(reduce);
        setMode("3d");
        document.documentElement.dataset.heroTone = "light";
        if (reduce || seen) c.skip();
        else c.start();
        announceReady();
      })
      .catch(fallback)
      .finally(() => window.clearTimeout(safety));

    return () => {
      cancelled = true;
      window.clearTimeout(safety);
      controller?.dispose();
      ctrl.current = null;
      delete document.documentElement.dataset.heroTone;
    };
  }, [id]);

  // Pause when hidden or off-screen.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let visible = true;
    let inView = true;
    const sync = () => {
      const c = ctrl.current;
      if (!c) return;
      if (visible && inView && !paused) c.resume();
      else c.pause();
    };
    const onVis = () => {
      visible = !document.hidden;
      sync();
    };
    document.addEventListener("visibilitychange", onVis);
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      sync();
    }, { threshold: 0.1 });
    io.observe(host);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      io.disconnect();
    };
  }, [paused, mode]);

  const skip = useCallback(() => ctrl.current?.skip(), []);
  const replay = useCallback(() => {
    setDone(false);
    setPaused(false);
    ctrl.current?.replay();
  }, []);

  return (
    <section ref={hostRef} className={styles.hero} data-hero={id} data-mode={mode} aria-label={description}>
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
      {mode === "fallback" ? (
        <div className={styles.fallback}>
          <Photo name={fallbackImage} alt={fallbackAlt} priority sizes="100vw" />
        </div>
      ) : null}
      <div className={styles.veil} aria-hidden="true" />
      <div className={styles.content}>{children}</div>

      {mode === "3d" ? (
        <div className={styles.hud}>
          <div className={styles.meta} aria-live="polite">
            <span className={styles.ticks} aria-hidden="true">
              {Array.from({ length: stage.total }).map((_, n) => (
                <i key={n} data-on={n <= stage.i ? "true" : undefined} />
              ))}
            </span>
            <span className={styles.label}>
              <span className="num">{String(stage.i + 1).padStart(2, "0")}</span> / {String(stage.total).padStart(2, "0")} — {stage.label}
            </span>
            <span className={styles.disclosure}>Procedural 3D model — illustrative, not an approved plan</span>
          </div>
          <div className={styles.controls}>
            {!reduced && !done ? (
              <button
                type="button"
                aria-pressed={paused}
                onClick={() => {
                  setPaused((p) => !p);
                }}
              >
                {paused ? "Play" : "Pause"}
              </button>
            ) : null}
            {done ? (
              <button type="button" onClick={replay}>
                Replay
              </button>
            ) : (
              <button type="button" onClick={skip}>
                Skip
              </button>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}
