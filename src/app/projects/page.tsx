import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader, CtaBand, RealProjects, SectionHead } from "@/components/Sections";
import ProjectsExplorer from "@/components/projects/ProjectsExplorer";
import NearestProjects from "@/components/projects/NearestProjects";

export const metadata: Metadata = {
  title: "Our Work",
  description: "Selected architecture, interior design and construction projects by KOLPO, filterable by service and searchable by location.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our work"
        title="Projects"
      />
      <section className="section" aria-labelledby="done-title">
        <div className="wrap">
          <SectionHead title={<span id="done-title">Completed projects</span>} />
          <RealProjects />
        </div>
      </section>
      <section className="section section--stone" aria-label="Concept projects">
        <div className="wrap">
          <SectionHead title="Concept projects" lede="Concept visualisations, not completed commissions." />
          <Suspense fallback={<p className="muted">Loading projects…</p>}>
            <ProjectsExplorer />
          </Suspense>
        </div>
      </section>
      <section className="section" aria-labelledby="near-title">
        <div className="wrap">
          <h2 id="near-title" className="h2" style={{ marginBottom: "2rem" }}>Find work near you</h2>
          <NearestProjects />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
