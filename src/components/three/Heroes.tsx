import Link from "next/link";
import ThreeStage from "./ThreeStage";
import styles from "./HeroCopy.module.css";

function Copy({
  title,
  primary,
  secondary,
}: {
  title: React.ReactNode;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  return (
    <div className={styles.copy}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.actions}>
        <Link href={primary.href} className="btn">
          {primary.label}
        </Link>
        {secondary ? (
          <Link href={secondary.href} className="btn btn--ghost btn--onlight">
            {secondary.label}
          </Link>
        ) : null}
      </div>
    </div>
  );
}

export function HeroHome() {
  return (
    <ThreeStage
      id="home"
      description="Introductory 3D film: a building is designed on an empty site, constructed stage by stage, and finally one flat on the first floor is opened up and furnished."
      fallbackImage="cons-6-front"
      fallbackAlt="Finished limestone-coloured house with a stepped entrance path"
    >
      <Copy
        title={
          <>
            Spaces Designed to Become <em>Places.</em>
          </>
        }
        primary={{ href: "/projects", label: "Explore Our Work" }}
        secondary={{ href: "/#services", label: "Discover Our Services" }}
      />
    </ThreeStage>
  );
}

export function HeroArchitecture() {
  return (
    <ThreeStage
      id="architecture"
      description="3D sequence: an empty site gains a boundary and survey grid, roads and circulation, plots, building footprints, three-dimensional massing and landscape until a complete residential masterplan is visible."
      fallbackImage="arch-colony-aerial"
      fallbackAlt="Aerial view of a planned residential community around a central park"
    >
      <Copy
        title={
          <>
            We Shape the Spaces Where <em>Life Unfolds.</em>
          </>
        }
        primary={{ href: "/projects?category=architecture", label: "Explore Architecture Projects" }}
        secondary={{ href: "/contact", label: "Start a project" }}
      />
    </ThreeStage>
  );
}

export function HeroInterior() {
  return (
    <ThreeStage
      id="interior"
      description="3D sequence: an empty room shell closes up, then receives floor and wall finishes, ceiling and lighting, built-in joinery and furniture, and finally its lights switch on."
      fallbackImage="interior-3-final"
      fallbackAlt="Furnished living room with oak floor, oatmeal sofa and brass pendants"
    >
      <Copy
        title={
          <>
            Transforming Empty Rooms into <em>Meaningful Experiences.</em>
          </>
        }
        primary={{ href: "/projects?category=interior", label: "Explore Interior Projects" }}
        secondary={{ href: "/contact", label: "Start a project" }}
      />
    </ThreeStage>
  );
}

export function HeroConstruction() {
  return (
    <ThreeStage
      id="construction"
      description="3D sequence: a surveyed empty site, a marked footprint and wireframe proposal, excavation, foundations, a three-storey frame, brickwork, windows and doors, finishing and landscaping, ending on a front three-quarter view of the completed building."
      fallbackImage="cons-6-front"
      fallbackAlt="Finished limestone-coloured house with a stepped entrance path"
    >
      <Copy
        title={
          <>
            From Vision to <em>Built Reality.</em>
          </>
        }
        primary={{ href: "/projects?category=construction", label: "Explore Construction Projects" }}
        secondary={{ href: "/contact", label: "Start a project" }}
      />
    </ThreeStage>
  );
}
