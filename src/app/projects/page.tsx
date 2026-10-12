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
        lede="Completed work from the studio, followed by concept projects that show how we approach each discipline."
      />
      <section className="section" aria-labelledby="done-title">
        <div className="wrap">
          <SectionHead
            eyebrow="Completed work"
            title={<span id="done-title">Built and delivered</span>}
            lede="Projects KOLPO has completed across offices, restaurants, residences and community buildings. Full case studies and photography are on the studio's current website."
          />
          <RealProjects />
        </div>
      </section>
      <section className="section section--stone" aria-label="Concept projects">
        <div className="wrap">
          <SectionHead
            eyebrow="Concept projects"
            title="How we think"
            lede="These eight projects are concept visualisations created to demonstrate our approach. They are not completed commissions and are labelled as such."
          />
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
