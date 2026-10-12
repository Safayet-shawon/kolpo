import Link from "next/link";
import Photo from "@/components/Photo";
import { categoryMeta, type Project } from "@/data/projects";
import styles from "./Projects.module.css";

type Props = {
  project: Project;
  /** Same-size card (4:5) for carousels. */
  uniform?: boolean;
  priority?: boolean;
  sizes?: string;
};

export default function ProjectCard({ project: p, uniform, priority, sizes = "(min-width: 900px) 50vw, 100vw" }: Props) {
  return (
    <article className={`${styles.card} ${uniform ? styles.uniform : styles[p.shape]}`}>
      <Link href={`/projects/${p.slug}`} className={styles.cardLink}>
        <div className={styles.media}>
          <Photo
            name={p.hero.key}
            alt={p.hero.alt}
            sizes={sizes}
            priority={priority}
            style={{ objectPosition: p.hero.position ?? "50% 50%" }}
          />
          {p.demo ? <span className={styles.badge}>Concept</span> : null}
        </div>
        <div className={styles.meta}>
          <p className={styles.kicker}>
            <span>{categoryMeta[p.category].short}</span>
            <span aria-hidden="true">·</span>
            <span>{p.type}</span>
          </p>
          <h3 className={styles.title}>{p.title}</h3>
          <p className={styles.where}>
            {p.location.city}
            {p.location.area ? `, ${p.location.area}` : ""}
          </p>
          <p className={styles.status}>
            {p.status}
            {p.year ? ` · ${p.year}` : ""}
          </p>
          <span className={`arrow-link ${styles.more}`}>
            View project <span className="arr" aria-hidden="true">→</span>
          </span>
        </div>
      </Link>
    </article>
  );
}
