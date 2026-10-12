"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useMemo } from "react";
import ProjectCard from "./ProjectCard";
import { categoryMeta, projects, type Category } from "@/data/projects";
import styles from "./Projects.module.css";

const FILTERS: { value: "all" | Category; label: string }[] = [
  { value: "all", label: "All" },
  { value: "architecture", label: "Architecture" },
  { value: "interior", label: "Interior" },
  { value: "construction", label: "Construction" },
];

const isCategory = (v: string | null): v is Category => v === "architecture" || v === "interior" || v === "construction";

export default function ProjectsExplorer({ limit, showFilters = true }: { limit?: number; showFilters?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const raw = params.get("category");
  const active: "all" | Category = isCategory(raw) ? raw : "all";

  const list = useMemo(() => {
    const filtered = active === "all" ? projects : projects.filter((p) => p.category === active);
    return limit ? filtered.slice(0, limit) : filtered;
  }, [active, limit]);

  const counts = useMemo(
    () => ({
      all: projects.length,
      architecture: projects.filter((p) => p.category === "architecture").length,
      interior: projects.filter((p) => p.category === "interior").length,
      construction: projects.filter((p) => p.category === "construction").length,
    }),
    [],
  );

  const choose = (value: "all" | Category) => {
    const next = new URLSearchParams(params.toString());
    if (value === "all") next.delete("category");
    else next.set("category", value);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return (
    <div>
      {showFilters ? (
        <div className={styles.filters} role="group" aria-label="Filter projects by service">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              className={styles.filter}
              aria-pressed={active === f.value}
              onClick={() => choose(f.value)}
            >
              {f.label} <span className={styles.count}>{counts[f.value]}</span>
            </button>
          ))}
        </div>
      ) : null}

      <p className="sr-only" role="status" aria-live="polite">
        Showing {list.length} {list.length === 1 ? "project" : "projects"}
        {active !== "all" ? ` in ${categoryMeta[active].label}` : ""}.
      </p>

      <div className={styles.grid}>
        {list.map((p, i) => (
          <ProjectCard key={p.slug} project={p} priority={i < 2} />
        ))}
      </div>
    </div>
  );
}
