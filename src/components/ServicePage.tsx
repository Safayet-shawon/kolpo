import BeforeAfter from "@/components/BeforeAfter";
import CostEstimator from "@/components/CostEstimator";
import ProjectsCarousel from "@/components/projects/ProjectsCarousel";
import { CapabilityList, CtaBand, SectionHead } from "@/components/Sections";
import { getProject, projectsByCategory, type Category } from "@/data/projects";
import { services } from "@/data/services";

/** Everything below a service hero: designed work carousel, what-do-you-want picker with cost popup, capabilities. */
export default function ServiceBody({ id }: { id: Category }) {
  const s = services[id];
  const list = projectsByCategory(id);
  const pair = id === "interior" ? getProject("sunlit-residence")?.beforeAfter : undefined;

  return (
    <>
      <section className="section" aria-labelledby="svc-designed">
        <div className="wrap">
          <SectionHead title={<span id="svc-designed">Recently designed</span>} />
          <ProjectsCarousel list={list} label={`${s.short} projects`} />
        </div>
      </section>

      <div className="section--stone">
        <CostEstimator service={id} />
      </div>

      {pair ? (
        <section className="section" aria-labelledby="svc-ba">
          <div className="wrap">
            <SectionHead title={<span id="svc-ba">Before and after</span>} />
            <BeforeAfter before={pair.before} after={pair.after} alt={pair.alt} />
          </div>
        </section>
      ) : null}

      <section className="section" aria-labelledby="svc-caps">
        <div className="wrap">
          <SectionHead title={<span id="svc-caps">What we do</span>} />
          <CapabilityList items={s.capabilities} />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
