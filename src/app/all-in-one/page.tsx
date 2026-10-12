import type { Metadata } from "next";
import CostEstimator from "@/components/CostEstimator";
import ProjectsCarousel from "@/components/projects/ProjectsCarousel";
import { CtaBand, PageHeader, SectionHead } from "@/components/Sections";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "All in one",
  description: "Architecture, interior design and construction from one team, with an indicative cost estimate.",
  alternates: { canonical: "/all-in-one" },
};

export default function AllInOnePage() {
  return (
    <>
      <PageHeader eyebrow="Design · Interior · Construction" title="All in one" />
      <CostEstimator service="all" />
      <section className="section section--stone" aria-labelledby="all-work">
        <div className="wrap">
          <SectionHead title={<span id="all-work">Recently designed</span>} />
          <ProjectsCarousel list={projects} label="All projects" />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
