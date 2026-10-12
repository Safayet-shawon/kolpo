import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { HeroHome } from "@/components/hero/Heroes";
import Photo from "@/components/Photo";
import Reveal from "@/components/Reveal";
import { CtaBand, OfficeSection, ProcessList, SectionHead } from "@/components/Sections";
import ProjectsExplorer from "@/components/projects/ProjectsExplorer";
import NearestProjects from "@/components/projects/NearestProjects";
import { approach, services } from "@/data/services";
import { articles } from "@/data/journal";
import styles from "./home.module.css";

export const metadata: Metadata = {
  title: { absolute: "KOLPO — Architecture, Interior Design & Construction" },
  description:
    "KOLPO connects architecture and community planning, interior design and construction — one continuous process from an empty page to a finished place.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const a = services.architecture;
  const i = services.interior;
  const c = services.construction;
  const journal = articles[0];

  return (
    <>
      <HeroHome />

      {/* Introduction */}
      <section className="section" aria-labelledby="intro-title">
        <div className="wrap">
          <div className={`grid-12 ${styles.intro}`}>
            <Reveal className={styles.introHead}>
              <p className="eyebrow">Our approach</p>
              <h2 id="intro-title" className="h2">
                Planning, design and construction <em>in one conversation.</em>
              </h2>
            </Reveal>
            <Reveal className={styles.introBody} delay={120}>
              <p className="lede">
                Most projects lose something in the handover between planner, designer and builder. KOLPO keeps the three together, so the
                idea you approve on paper is the one you can walk through.
              </p>
              <p className="muted">
                We think about the whole place first — the streets, the light, the materials — and then the details. Everything we show is
                visualised realistically before it is built, so decisions are made by looking.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Services: three distinct compositions */}
      <section className={`section--tight ${styles.services}`} aria-labelledby="services-title">
        <div className="wrap">
          <SectionHead eyebrow="What we do" title={<span id="services-title">Three disciplines, one result.</span>} />
        </div>

        <Reveal as="article" className={`wrap ${styles.svcA}`}>
          <Link href={a.route} className={styles.svcLink}>
            <div className={styles.svcAMedia}>
              <Photo name={a.image.key} alt={a.image.alt} sizes="(min-width: 900px) 60vw, 100vw" />
            </div>
            <div className={styles.svcAText}>
              <span className={`num ${styles.svcNum}`}>01</span>
              <h3 className="h3">{a.title}</h3>
              <p className="muted">{a.blurb}</p>
              <span className="arrow-link">Architecture <span className="arr" aria-hidden="true">→</span></span>
            </div>
          </Link>
        </Reveal>

        <Reveal as="article" className={`wrap ${styles.svcB}`}>
          <Link href={i.route} className={styles.svcLink}>
            <div className={styles.svcBText}>
              <span className={`num ${styles.svcNum}`}>02</span>
              <h3 className="h3">{i.title}</h3>
              <p className="muted">{i.blurb}</p>
              <span className="arrow-link">Interior design <span className="arr" aria-hidden="true">→</span></span>
            </div>
            <div className={styles.svcBMedia}>
              <Photo name={i.image.key} alt={i.image.alt} sizes="(min-width: 900px) 38vw, 100vw" style={{ objectPosition: "28% 50%" }} />
            </div>
          </Link>
        </Reveal>

        <Reveal as="article" className={styles.svcC}>
          <Link href={c.route} className={styles.svcCLink}>
            <Photo name="cons-4-envelope" alt="A building enclosed behind scaffolding during construction" sizes="100vw" />
            <div className={`wrap ${styles.svcCText}`}>
              <span className={`num ${styles.svcNum}`}>03</span>
              <h3 className="h3">{c.title}</h3>
              <p>{c.blurb}</p>
              <span className="arrow-link">Construction <span className="arr" aria-hidden="true">→</span></span>
            </div>
          </Link>
        </Reveal>
      </section>

      {/* Our Work */}
      <section className="section" id="work" aria-labelledby="work-title">
        <div className="wrap">
          <SectionHead
            eyebrow="Our work"
            title={<span id="work-title">Selected projects</span>}
            lede="Concept projects that show how we think. Each is clearly labelled; real, completed work will be added as it is confirmed."
          />
          <Suspense fallback={<p className="muted">Loading projects…</p>}>
            <ProjectsExplorer limit={6} />
          </Suspense>
          <p style={{ marginTop: "3rem" }}>
            <Link href="/projects" className="arrow-link">All projects <span className="arr" aria-hidden="true">→</span></Link>
          </p>
        </div>
      </section>

      {/* Find our work nearest you */}
      <section className="section section--stone" id="near-you" aria-labelledby="near-title">
        <div className="wrap">
          <SectionHead
            eyebrow="Find our work"
            title={<span id="near-title">Nearest to you</span>}
            lede="Search a city or area, or share your location, to see projects ranked by distance."
          />
          <NearestProjects />
        </div>
      </section>

      {/* Approach */}
      <section className="section" aria-labelledby="process-title">
        <div className="wrap">
          <SectionHead eyebrow="How we work" title={<span id="process-title">From first conversation to handover</span>} />
          <ProcessList steps={approach} />
        </div>
      </section>

      {/* Materials, craft & philosophy (stands in for testimonials until real ones exist) */}
      <section className={`section section--dark ${styles.craft}`} aria-labelledby="craft-title">
        <div className="wrap">
          <div className={`grid-12 ${styles.craftGrid}`}>
            <Reveal className={styles.craftMedia}>
              <Photo name="materials" alt="Flat-lay of oak parquet, linen, brass, terracotta and bronze material samples on limestone" sizes="(min-width: 900px) 50vw, 100vw" />
            </Reveal>
            <Reveal className={styles.craftText} delay={120}>
              <p className="eyebrow">Materials &amp; craft</p>
              <h2 id="craft-title" className="h2">Honest materials, chosen to last.</h2>
              <p className="lede">
                Timber, stone, plaster, linen and metal — surfaces that age well and feel good to touch. We choose each for how it performs
                and how it will look in ten years, not only on the day it is installed.
              </p>
              <ul className={styles.principles}>
                <li><strong>Look for what lasts.</strong> Durable, repairable materials before disposable ones.</li>
                <li><strong>Let daylight do the work.</strong> Orientation, shade and openings considered before mechanical fixes.</li>
                <li><strong>Build it as drawn.</strong> Detailing and site checks so the finished building matches the design.</li>
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Offices */}
      <section className="section" aria-labelledby="office-title">
        <div className="wrap">
          <SectionHead eyebrow="Studio" title={<span id="office-title">Where to find us</span>} />
          <OfficeSection />
        </div>
      </section>

      {/* Journal */}
      <section className="section section--stone" aria-labelledby="journal-title">
        <div className="wrap">
          <SectionHead eyebrow="Journal" title={<span id="journal-title">Notes on place, space and building</span>} />
          {journal ? (
            <Reveal>
              <Link href={`/journal/${journal.slug}`} className={styles.journal}>
                <div className={styles.journalMedia}>
                  <Photo name={journal.image.key} alt={journal.image.alt} sizes="(min-width: 900px) 50vw, 100vw" />
                </div>
                <div>
                  <p className="eyebrow">{journal.category}</p>
                  <h3 className="h3">{journal.title}</h3>
                  <p className="muted">{journal.excerpt}</p>
                  <p className="small muted">Sample article · layout demonstration</p>
                  <span className="arrow-link">Read <span className="arr" aria-hidden="true">→</span></span>
                </div>
              </Link>
            </Reveal>
          ) : null}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
