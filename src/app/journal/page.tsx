import type { Metadata } from "next";
import Link from "next/link";
import Photo from "@/components/Photo";
import { PageHeader } from "@/components/Sections";
import { articles, journalCategories } from "@/data/journal";
import styles from "./journal.module.css";

export const metadata: Metadata = {
  title: "Journal",
  description: "Notes on architecture, interior design and construction.",
  alternates: { canonical: "/journal" },
};

const fmt = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

export default function JournalPage() {
  return (
    <>
      <PageHeader eyebrow="Journal" title="Notes on place, space and building" lede="Short, practical writing from the studio." />
      <section className="section--tight section">
        <div className="wrap">
          <p className={styles.cats} aria-label="Categories">
            {journalCategories.map((c) => (
              <span key={c} className="tag">{c}</span>
            ))}
          </p>
          {articles.length === 0 ? (
            <p className="lede">The first articles are on their way.</p>
          ) : (
            <ul className={styles.list}>
              {articles.map((a) => (
                <li key={a.slug}>
                  <Link href={`/journal/${a.slug}`} className={styles.item}>
                    <div className={styles.media}>
                      <Photo name={a.image.key} alt={a.image.alt} sizes="(min-width: 900px) 50vw, 100vw" />
                    </div>
                    <div className={styles.text}>
                      <p className="eyebrow">{a.category}</p>
                      <h2 className="h3">{a.title}</h2>
                      <p className="muted">{a.excerpt}</p>
                      <p className="small muted">
                        <time dateTime={a.date}>{fmt(a.date)}</time> · {a.readMinutes} min read{a.sample ? " · Sample article" : ""}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
