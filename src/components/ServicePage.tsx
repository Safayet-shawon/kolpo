import Link from "next/link";
import Photo from "@/components/Photo";
import Reveal from "@/components/Reveal";
import BeforeAfter from "@/components/BeforeAfter";
import ProjectCard from "@/components/projects/ProjectCard";
import { CapabilityList, CtaBand, ProcessList, RelatedServices, SectionHead } from "@/components/Sections";
import { projectsByCategory, getProject, type Category } from "@/data/projects";
import { services } from "@/data/services";
import styles from "./ServicePage.module.css";

/** Everything below a service hero. The heroes themselves are unique per service; this body shares structure only. */
export default function ServiceBody({ id }: { id: Category }) {
  const s = services[id];
  const list = projectsByCategory(id).slice(0, 4);
  const pair = id === "interior" ? getProject("sunlit-residence")?.beforeAfter : undefined;

  return (
    <>
      <section className="section" aria-labelledby="svc-intro">
        <div className="wrap">
          <div className={`grid-12 ${styles.intro}`}>
            <Reveal className={styles.introHead}>
              <p className="eyebrow">{s.short}</p>
              <h2 id="svc-intro" className="h2">{s.intro.heading}</h2>
            </Reveal>
            <Reveal className={styles.introBody} delay={120}>
              {s.intro.body.map((p) => (
                <p key={p} className={p === s.intro.body[0] ? "lede" : "muted"}>{p}</p>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section--stone" aria-labelledby="svc-caps">
        <div className="wrap">
          <SectionHead eyebrow="Capabilities" title={<span id="svc-caps">What this covers</span>} />
          <CapabilityList items={s.capabilities} />
          <p className="small muted" style={{ marginTop: "1.5rem" }}>
            Scope is agreed project by project. Tell us what you need and we’ll confirm how we can help.
          </p>
        </div>
      </section>

      {pair ? (
        <section className="section" aria-labelledby="svc-ba">
          <div className="wrap">
            <SectionHead eyebrow="Before & after" title={<span id="svc-ba">The same room, transformed</span>} />
            <BeforeAfter before={pair.before} after={pair.after} alt={pair.alt} />
          </div>
        </section>
      ) : null}

      <section className={pair ? "section section--stone" : "section"} aria-labelledby="svc-work">
        <div className="wrap">
          <SectionHead
            eyebrow="Relevant projects"
            title={<span id="svc-work">Work in this discipline</span>}
            lede="Concept projects that illustrate our approach. Each is labelled; completed work will be added once confirmed."
          />
          <div className={styles.projects}>
            {list.map((p) => (
              <ProjectCard key={p.slug} project={p} sizes="(min-width: 900px) 50vw, 100vw" />
            ))}
          </div>
          <p style={{ marginTop: "3rem" }}>
            <Link href={`/projects?category=${id}`} className="arrow-link">All {s.short.toLowerCase()} projects <span className="arr" aria-hidden="true">→</span></Link>
          </p>
        </div>
      </section>

      <section className={`section section--dark`} aria-labelledby="svc-process">
        <div className="wrap">
          <SectionHead eyebrow="Process" title={<span id="svc-process">How a project unfolds</span>} />
          <ProcessList steps={s.process} dark />
        </div>
      </section>

      <section className={styles.support} aria-label="Supporting photography">
        <Photo name={s.support.key} alt={s.support.alt} sizes="100vw" />
        <p className={`wrap small ${styles.caption}`}>{s.support.caption}</p>
      </section>

      <section className="section" aria-labelledby="svc-related">
        <div className="wrap">
          <SectionHead eyebrow="Related services" title={<span id="svc-related">Works best together</span>} />
          <RelatedServices current={id} ids={s.related} />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
