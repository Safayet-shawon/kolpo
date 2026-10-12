import type { Metadata } from "next";
import { HeroHome } from "@/components/three/Heroes";
import { Licenses, ServiceRow } from "@/components/HomeSections";
import { RealProjects, SectionHead } from "@/components/Sections";
import ProjectsCarousel from "@/components/projects/ProjectsCarousel";
import { projects } from "@/data/projects";

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
          <ProjectsCarousel list={projects} label="All projects" />
          <h3 className="h3" style={{ margin: "2.4rem 0 1rem" }}>
            Completed projects
          </h3>
          <RealProjects />
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
