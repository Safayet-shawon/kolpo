import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Photo from "@/components/Photo";
import Reveal from "@/components/Reveal";
import BeforeAfter from "@/components/BeforeAfter";
import ProjectCard from "@/components/projects/ProjectCard";
import { CtaBand, SectionHead } from "@/components/Sections";
import { categoryMeta, getProject, projects, relatedProjects } from "@/data/projects";
import styles from "./project.module.css";

type Params = { slug: string };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.summary,
    alternates: { canonical: `/projects/${p.slug}` },
    openGraph: { title: p.title, description: p.summary, images: [{ url: `/media/${p.hero.key}-1280.webp`, alt: p.hero.alt }] },
  };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const cat = categoryMeta[p.category];
  const related = relatedProjects(p);

  return (
    <>
      <header className={styles.hero}>
        <div className={styles.heroMedia}>
          <Photo name={p.hero.key} alt={p.hero.alt} priority sizes="100vw" style={{ objectPosition: p.hero.position ?? "50% 50%" }} />
        </div>
        <div className={`wrap ${styles.heroText}`}>
          <nav aria-label="Breadcrumb" className={styles.crumbs}>
            <Link href="/#work">Our work</Link> <span aria-hidden="true">/</span> <Link href={cat.route}>{cat.short}</Link>
          </nav>
          <h1 className="display">{p.title}</h1>
          <p className={styles.sum}>{p.summary}</p>
        </div>
      </header>

      <section className="section--tight section" aria-label="Project overview">
        <div className="wrap">
          {p.demo ? (
            <p className={styles.notice} role="note">
              <strong>Concept visualisation.</strong> This project and its imagery are AI-generated demonstrations of how KOLPO approaches
              this kind of work. It is not a completed KOLPO commission.
            </p>
          ) : null}
          <div className={`grid-12 ${styles.overview}`}>
            <Reveal className={styles.facts}>
              <dl>
                <dt>Service</dt>
                <dd><Link href={cat.route}>{cat.label}</Link></dd>
                <dt>Type</dt>
                <dd>{p.type}</dd>
                <dt>Location</dt>
                <dd>{p.location.city}{p.location.area ? `, ${p.location.area}` : ""}, {p.location.region}</dd>
                <dt>Status</dt>
                <dd>{p.status}{p.year ? ` · ${p.year}` : ""}</dd>
                {p.facts?.map((f) => (
                  <div key={f.label} className={styles.fact}>
                    <dt>{f.label}</dt>
                    <dd>{f.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
            <Reveal className={styles.story} delay={100}>
              {p.description.map((para, i) => (
                <p key={i} className={i === 0 ? "lede" : "muted"}>{para}</p>
              ))}
              <h2 className="h3" style={{ marginTop: "1.5rem" }}>Design intent</h2>
              <p>{p.intent}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {p.beforeAfter ? (
        <section className="section--tight section section--stone" aria-labelledby="ba">
          <div className="wrap">
            <SectionHead eyebrow="Before & after" title={<span id="ba">The transformation</span>} />
            <BeforeAfter {...p.beforeAfter} />
          </div>
        </section>
      ) : null}

      {p.gallery.length > 0 ? (
        <section className="section--tight section" aria-labelledby="gal">
          <div className="wrap">
            <SectionHead eyebrow="Gallery" title={<span id="gal">{p.category === "construction" ? "Stage by stage" : "More views"}</span>} />
            <ul className={styles.gallery}>
              {p.gallery.map((g) => (
                <Reveal as="li" key={g.key}>
                  <figure>
                    <Photo name={g.key} alt={g.alt} sizes="(min-width: 900px) 50vw, 100vw" />
                    {g.caption ? <figcaption className="small muted">{g.caption}</figcaption> : null}
                  </figure>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="section section--dark" aria-labelledby="chal">
        <div className="wrap">
          <SectionHead eyebrow="Challenges & solutions" title={<span id="chal">Decisions that shaped it</span>} />
          <ul className={styles.challenges}>
            {p.challenges.map((c) => (
              <Reveal as="li" key={c.challenge}>
                <p className={styles.q}>{c.challenge}</p>
                <p className={styles.a}>{c.response}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="rel">
        <div className="wrap">
          <SectionHead eyebrow="Related projects" title={<span id="rel">Keep exploring</span>} />
          <div className={styles.related}>
            {related.map((r) => (
              <ProjectCard key={r.slug} project={r} sizes="(min-width: 900px) 33vw, 100vw" />
            ))}
          </div>
        </div>
      </section>

      <CtaBand title="Planning something similar?" body="Tell us about your site or space and we’ll explain how we would approach it." />
    </>
  );
}
