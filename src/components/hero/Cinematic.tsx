"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Photo from "@/components/Photo";
import styles from "./Cinematic.module.css";

export type Camera = {
  /** [scale, x%, y%] at scene start and end. Small values only: this is a slow dolly, not a shake. */
  from: [number, number, number];
  to: [number, number, number];
};

export type Scene = {
  id: string;
  /** Short HUD label, e.g. "The canvas". */
  label: string;
  /** How long the scene holds before the next begins (ms). The last scene holds indefinitely. */
  duration: number;
  /** Which UI tone the nav should use while this scene is showing. */
  tone: "light" | "dark";
  /** Background media key from public/media (omit for pure-canvas scenes). */
  image?: string;
  alt?: string;
  objectPosition?: string;
  /** How the scene enters. The first scene always appears instantly. */
  enter?: "fade" | "wipe";
  camera?: Camera;
  /** Canvas content drawn on a warm-paper background (e.g. the animated plan drawing). */
  canvas?: React.ReactNode;
  /** Extra layer above the image (annotations, footprint overlay…). */
  overlay?: React.ReactNode;
};

type Props = {
  id: string;
  scenes: Scene[];
  /** Persistent headline / entry-point content (always visible and usable, never waits for the sequence). */
  children: React.ReactNode;
  /** Accessible description of the whole sequence. */
  description: string;
  /** Honest labelling shown with the sequence. */
  disclosure?: string;
  className?: string;
};

const SEEN_PREFIX = "kolpo:hero:";
const OVERLAP = 1600;

declare global {
  interface Window {
    __kolpoHeroReady?: boolean;
  }
}

function announceReady() {
  if (typeof window === "undefined" || window.__kolpoHeroReady) return;
  window.__kolpoHeroReady = true;
  window.dispatchEvent(new Event("kolpo:hero-ready"));
}

export default function Cinematic({ id, scenes, children, description, disclosure, className = "" }: Props) {
  const last = scenes.length - 1;
  const [index, setIndex] = useState(0);
  const [booted, setBooted] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [inView, setInView] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [failed, setFailed] = useState<Record<string, true>>({});
  const rootRef = useRef<HTMLElement>(null);

  // Boot: honour reduced motion and "already seen this session" by jumping to the resolved final frame.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_PREFIX + id) === "1";
    } catch {}
    // Browser-only state (matchMedia / sessionStorage) can only be read after mount, to keep SSR output identical.
    /* eslint-disable react-hooks/set-state-in-effect */
    setReduced(reduce);
    if (reduce || seen) setIndex(last);
    setBooted(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [id, last]);

  // Signal readiness to the loader once the first visible frame is decoded (or after a hard timeout).
  useEffect(() => {
    if (!booted) return;
    const first = scenes[index === last ? last : 0];
    let cancelled = false;
    const ready = () => !cancelled && announceReady();
    if (!first.image) {
      ready();
      return;
    }
    const timeout = window.setTimeout(ready, 2500);
    const img = rootRef.current?.querySelector<HTMLImageElement>("img");
    if (!img) ready();
    else if (img.complete && img.naturalWidth) ready();
    else img.decode().then(ready, ready);
    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
    // Only the first resolved frame matters for readiness.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booted]);

  // Pause when the tab is hidden or the hero is off-screen (saves GPU, keeps timing honest).
  useEffect(() => {
    const onVis = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    const el = rootRef.current;
    let io: IntersectionObserver | undefined;
    if (el && typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.15 });
      io.observe(el);
    }
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      io?.disconnect();
    };
  }, []);

  const playing = booted && !reduced && !userPaused && !hidden && inView;

  // Time-based sequencer: one timer per scene, cleaned up on pause/route change. Before advancing it makes sure the
  // next frame has actually loaded (never waiting more than 3s), so a slow connection never fades in a blur placeholder.
  useEffect(() => {
    if (!playing || index >= last) return;
    let cancelled = false;
    let waitTimer: number | undefined;
    const advance = () => {
      if (!cancelled) setIndex((i) => Math.min(i + 1, last));
    };
    const frameReady = (id: string) => {
      const img = rootRef.current?.querySelector<HTMLImageElement>(`[data-scene="${id}"] img`);
      return !img || (img.complete && img.naturalWidth > 0);
    };
    const t = window.setTimeout(() => {
      const next = scenes[index + 1];
      if (!next.image) return advance();
      const started = performance.now();
      const poll = () => {
        if (cancelled) return;
        if (frameReady(next.id) || performance.now() - started > 3000) advance();
        else waitTimer = window.setTimeout(poll, 100);
      };
      poll();
    }, scenes[index].duration);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
      window.clearTimeout(waitTimer);
    };
  }, [playing, index, last, scenes]);

  // Remember completion so returning visitors in this session are not made to sit through it again.
  useEffect(() => {
    if (index !== last) return;
    try {
      sessionStorage.setItem(SEEN_PREFIX + id, "1");
    } catch {}
  }, [index, last, id]);

  // Nav tone follows the scene.
  useEffect(() => {
    document.documentElement.dataset.heroTone = scenes[index].tone;
    return () => {
      delete document.documentElement.dataset.heroTone;
    };
  }, [index, scenes]);

  const skip = useCallback(() => setIndex(last), [last]);
  const replay = useCallback(() => {
    setUserPaused(false);
    setIndex(0);
  }, []);

  const done = index === last;
  const sceneState = (i: number) => (i < index ? "past" : i === index ? "active" : "future");

  return (
    <section
      ref={rootRef}
      className={`${styles.hero} ${className}`}
      data-hero={id}
      data-boot={booted ? "done" : "pending"}
      data-ink={scenes[index].canvas ? "true" : undefined}
      data-paused={playing ? "false" : "true"}
      aria-label={description}
    >
      <div className={styles.stage} aria-hidden="true">
        {scenes.map((s, i) => {
          if (i < index - 1 || i > index + 1) return null;
          const cam = s.camera;
          const holdMs = i === last ? 16000 : s.duration + OVERLAP;
          const style = {
            "--dur": `${holdMs}ms`,
            ...(cam
              ? {
                  "--fs": cam.from[0],
                  "--fx": `${cam.from[1]}%`,
                  "--fy": `${cam.from[2]}%`,
                  "--ts": cam.to[0],
                  "--tx": `${cam.to[1]}%`,
                  "--ty": `${cam.to[2]}%`,
                }
              : {}),
          } as React.CSSProperties;
          const isFirst = i === 0 && !done;
          return (
            <div
              key={s.id}
              className={styles.scene}
              data-scene={s.id}
              data-state={sceneState(i)}
              data-enter={isFirst ? "none" : (s.enter ?? "fade")}
              data-canvas={s.canvas ? "true" : undefined}
              data-failed={failed[s.id] ? "true" : undefined}
              style={style}
            >
              {s.canvas ? <div className={styles.canvas}>{s.canvas}</div> : null}
              {s.image && !failed[s.id] ? (
                <div className={`${styles.cam} ${cam ? styles.moving : ""}`}>
                  <Photo
                    name={s.image}
                    alt=""
                    sizes="100vw"
                    priority={i === 0 || (done && i === last)}
                    eager
                    webpOnly
                    className={styles.img}
                    style={{ objectPosition: s.objectPosition ?? "50% 50%" }}
                    onError={() => setFailed((f) => ({ ...f, [s.id]: true }))}
                  />
                  {s.overlay ? <div className={styles.overlay}>{s.overlay}</div> : null}
                </div>
              ) : null}
            </div>
          );
        })}
        <div className={styles.scrim} />
      </div>

      <div className={styles.content}>{children}</div>

      <div className={styles.hud}>
        <div className={styles.meta} aria-live="polite">
          <span className={styles.ticks} aria-hidden="true">
            {scenes.map((s, i) => (
              <i key={s.id} data-on={i <= index ? "true" : undefined} />
            ))}
          </span>
          <span className={styles.label}>
            <span className="num">{String(index + 1).padStart(2, "0")}</span> / {String(scenes.length).padStart(2, "0")} —{" "}
            {scenes[index].label}
          </span>
          {disclosure ? <span className={styles.disclosure}>{disclosure}</span> : null}
        </div>
        <div className={styles.controls}>
          {!reduced && !done ? (
            <button type="button" onClick={() => setUserPaused((p) => !p)} aria-pressed={userPaused}>
              {userPaused ? "Play" : "Pause"}
            </button>
          ) : null}
          {done ? (
            <button type="button" onClick={replay}>
              Replay intro
            </button>
          ) : (
            <button type="button" onClick={skip}>
              Skip intro
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
