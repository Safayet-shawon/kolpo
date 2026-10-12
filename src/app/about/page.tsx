import type { Metadata } from "next";
import Photo from "@/components/Photo";
import Reveal from "@/components/Reveal";
import { CtaBand, PageHeader, ProcessList, SectionHead } from "@/components/Sections";
import { approach, services } from "@/data/services";
import Link from "next/link";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About",
  description: "KOLPO's philosophy, capabilities and process: architecture, interior design and construction as one continuous practice.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About KOLPO"
        title={<>Imagination, made <em>buildable.</em></>}
        lede="KOLPO brings architecture and community planning, interior design and construction together so an idea stays intact all the way to a finished place."
      />

      <section className="section" aria-labelledby="phil">
        <div className="wrap">
          <div className={`grid-12 ${styles.two}`}>
            <Reveal className={styles.a}>
              <p className="eyebrow">Philosophy</p>
              <h2 id="phil" className="h2">Think of the whole place, then the details.</h2>
            </Reveal>
            <Reveal className={styles.b} delay={100}>
              <p className="lede">
                A good building is more than its facade. It is the street it sits on, the light that reaches its rooms, the materials you
                touch each day, and the care taken on site.
              </p>
              <p className="muted">
                We work from the largest scale to the smallest — masterplan, building, room, joint — and we show each decision in realistic
                visualisation before it is made permanent. Clients should be able to judge a design by looking at it, not by trusting a plan.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className={styles.band} aria-label="Materials">
        <Photo name="materials" alt="Material samples of oak, linen, brass, terracotta and bronze on a limestone slab" sizes="100vw" />
      </section>

      <section className="section" aria-labelledby="caps">
        <div className="wrap">
          <SectionHead eyebrow="Capabilities" title={<span id="caps">Three disciplines, one team</span>} />
          <ul className={styles.disc}>
            {Object.values(services).map((s) => (
              <Reveal as="li" key={s.id}>
                <h3 className="h3">{s.title}</h3>
                <p className="muted">{s.blurb}</p>
                <Link href={s.route} className="arrow-link">Learn more <span className="arr" aria-hidden="true">→</span></Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--stone" aria-labelledby="people">
        <div className="wrap">
          <SectionHead eyebrow="People" title={<span id="people">The team</span>} />
          <p className="lede">
            We haven’t published team profiles yet. We’d rather show real people with their real experience than placeholder biographies —
            this section will be completed with the studio’s confirmed details.
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="process">
        <div className="wrap">
          <SectionHead eyebrow="Process" title={<span id="process">How we work</span>} />
          <ProcessList steps={approach} />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
