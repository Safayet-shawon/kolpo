import Link from "next/link";
import Logo from "@/components/Logo";
import Photo from "@/components/Photo";
import Reveal from "@/components/Reveal";
import { licenses } from "@/data/site";
import { services } from "@/data/services";
import styles from "./HomeSections.module.css";

export function Licenses() {
  return (
    <section className={styles.licenses} aria-labelledby="lic-title">
      <div className="wrap">
        <h2 id="lic-title" className={styles.h}>
          Our licenses
        </h2>
        {licenses.length > 0 ? (
          <ul className={styles.licList}>
            {licenses.map((l) => (
              <li key={l.name}>
                <strong>{l.name}</strong>
                {l.detail ? <span>{l.detail}</span> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted small">Licence and registration details will be listed here.</p>
        )}
      </div>
    </section>
  );
}

const CARDS = [
  { id: "architecture", name: "Architecture" },
  { id: "interior", name: "Interior" },
  { id: "construction", name: "Construction" },
] as const;

/** Four options in one row at every screen size: Architecture, Interior, Construction, All in one. */
export function ServiceRow() {
  return (
    <ul className={styles.row}>
      {CARDS.map((c, i) => {
        const s = services[c.id];
        return (
          <Reveal as="li" key={c.id} delay={i * 80}>
            <Link href={s.route} className={styles.card}>
              <span className={styles.media}>
                <Photo name={s.image.key} alt="" sizes="25vw" style={{ objectPosition: s.image.position ?? "50% 50%" }} />
              </span>
              <span className={styles.name}>{c.name}</span>
            </Link>
          </Reveal>
        );
      })}
      <Reveal as="li" delay={240}>
        <Link href="/contact?service=multiple" className={`${styles.card} ${styles.all}`}>
          <span className={`${styles.media} ${styles.allMedia}`}>
            <Logo variant="mark" tone="light" height={44} />
          </span>
          <span className={styles.name}>All in one</span>
        </Link>
      </Reveal>
    </ul>
  );
}
