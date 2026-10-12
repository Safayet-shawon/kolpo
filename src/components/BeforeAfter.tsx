"use client";

import { useId, useState } from "react";
import Photo from "@/components/Photo";
import styles from "./BeforeAfter.module.css";

/** Secondary interaction: drag or use the slider (keyboard accessible) to compare an empty room with the finished one. */
export default function BeforeAfter({ before, after, alt }: { before: string; after: string; alt: string }) {
  const [pos, setPos] = useState(50);
  const id = useId();
  return (
    <figure className={styles.wrap}>
      <div className={styles.stage} style={{ ["--pos" as string]: `${pos}%` }}>
        <Photo name={after} alt={`${alt} — after`} sizes="(min-width: 1100px) 1100px, 100vw" className={styles.img} />
        <div className={styles.beforeLayer}>
          <Photo name={before} alt={`${alt} — before`} sizes="(min-width: 1100px) 1100px, 100vw" className={styles.img} />
        </div>
        <span className={`${styles.tag} ${styles.tagL}`}>Before</span>
        <span className={`${styles.tag} ${styles.tagR}`}>After</span>
        <span className={styles.handle} aria-hidden="true" />
        <label htmlFor={id} className="sr-only">
          Compare before and after
        </label>
        <input
          id={id}
          className={styles.range}
          type="range"
          min={0}
          max={100}
          step={1}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-valuetext={`${pos}% before`}
        />
      </div>
      <figcaption className="small muted">Drag the handle, or use the arrow keys, to compare. Matched renders of the same room; concept visualisation.</figcaption>
    </figure>
  );
}
