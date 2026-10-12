import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Photo from "@/components/Photo";
import { CtaBand, PageHeader } from "@/components/Sections";
import { articles, getArticle } from "@/data/journal";
import styles from "../journal.module.css";

type Params = { slug: string };

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  return { title: a.title, description: a.excerpt, alternates: { canonical: `/journal/${a.slug}` } };
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();

  return (
    <>
      <PageHeader eyebrow={a.category} title={a.title} lede={a.excerpt} />
      <article className="section--tight section">
        <div className="wrap">
          <div className={styles.article}>
            <p className="small muted">
              <time dateTime={a.date}>{new Date(a.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</time> ·{" "}
              {a.readMinutes} min read
            </p>
            {a.sample ? (
              <p className={styles.sample} role="note">
                Sample article. This entry demonstrates the journal layout and is not a published KOLPO article.
              </p>
            ) : null}
          </div>
          <div style={{ margin: "2rem 0 3rem" }}>
            <Photo name={a.image.key} alt={a.image.alt} sizes="100vw" className={styles.hero} />
          </div>
          <div className={styles.article}>
            {a.body.map((b, i) => (
              <div key={i}>
                {b.h ? <h2 className="h3">{b.h}</h2> : null}
                <p>{b.p}</p>
              </div>
            ))}
            <p style={{ marginTop: "2rem" }}>
              <Link href="/journal" className="arrow-link">All articles <span className="arr" aria-hidden="true">→</span></Link>
            </p>
          </div>
        </div>
      </article>
      <CtaBand />
    </>
  );
}
