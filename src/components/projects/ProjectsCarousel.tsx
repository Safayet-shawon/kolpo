import Carousel from "@/components/Carousel";
import ProjectCard from "./ProjectCard";
import type { Project } from "@/data/projects";

/** All the given projects in one left-to-right carousel, every card the same size. */
export default function ProjectsCarousel({ list, label }: { list: Project[]; label: string }) {
  return (
    <Carousel label={label}>
      {list.map((p) => (
        <li key={p.slug}>
          <ProjectCard project={p} uniform sizes="300px" />
        </li>
      ))}
    </Carousel>
  );
}
