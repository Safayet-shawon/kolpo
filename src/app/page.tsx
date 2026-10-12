import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { HeroHome } from "@/components/three/Heroes";
import { Licenses, ServiceRow } from "@/components/HomeSections";
import { SectionHead } from "@/components/Sections";
import ProjectsExplorer from "@/components/projects/ProjectsExplorer";

export const metadata: Metadata = {
  title: { absolute: "KOLPO — Architecture, Interior Design & Construction" },
  description: "KOLPO designs and builds: architecture, interior design and construction in Dhaka.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <HeroHome />
      <Licenses />

      <section className="section" id="work" aria-labelledby="work-title">
        <div className="wrap">
          <SectionHead title={<span id="work-title">Our works</span>} />
          <Suspense fallback={<p className="muted">Loading…</p>}>
            <ProjectsExplorer limit={6} />
          </Suspense>
          <p style={{ marginTop: "2rem" }}>
            <Link href="/projects" className="arrow-link">
              All projects <span className="arr" aria-hidden="true">→</span>
            </Link>
          </p>
        </div>
      </section>

      <section className="section section--stone" id="services" aria-labelledby="services-title">
        <div className="wrap">
          <SectionHead title={<span id="services-title">Choose your service</span>} />
          <ServiceRow />
        </div>
      </section>
    </>
  );
}
