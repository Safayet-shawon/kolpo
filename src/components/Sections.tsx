import Link from "next/link";
import Photo from "@/components/Photo";
import Reveal from "@/components/Reveal";
import { offices, site } from "@/data/site";
import { services } from "@/data/services";
import type { Category } from "@/data/projects";
import styles from "./Sections.module.css";

export function SectionHead({
  eyebrow,
  title,
  lede,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  as?: "h1" | "h2";
}) {
  return (
    <Reveal className={styles.head}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <Tag className="h2">{title}</Tag>
      {lede ? <p className="lede">{lede}</p> : null}
    </Reveal>
  );
}

/** Plain page header for inner pages (non-cinematic). */
export function PageHeader({ eyebrow, title, lede }: { eyebrow: string; title: React.ReactNode; lede?: React.ReactNode }) {
  return (
    <header className={styles.pageHeader}>
      <div className="wrap">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="display">{title}</h1>
        {lede ? <p className="lede">{lede}</p> : null}
      </div>
    </header>
  );
}

export function ProcessList({ steps, dark = false }: { steps: { title: string; body: string }[]; dark?: boolean }) {
  return (
    <ol className={`${styles.process} ${dark ? styles.processDark : ""}`}>
      {steps.map((s, i) => (
        <Reveal as="li" key={s.title} delay={i * 70} className={styles.step}>
          <span className={`num ${styles.stepN}`}>{String(i + 1).padStart(2, "0")}</span>
          <h3>{s.title}</h3>
          <p>{s.body}</p>
        </Reveal>
      ))}
    </ol>
  );
}

export function CapabilityList({ items }: { items: { title: string; body: string }[] }) {
  return (
    <ul className={styles.caps}>
      {items.map((c, i) => (
        <Reveal as="li" key={c.title} delay={i * 50} className={styles.cap}>
          <h3>{c.title}</h3>
          <p className="muted">{c.body}</p>
        </Reveal>
      ))}
    </ul>
  );
}

export function RelatedServices({ current, ids }: { current: Category; ids?: Category[] }) {
  const list = ids ?? (Object.keys(services) as Category[]).filter((c) => c !== current);
  return (
    <div className={styles.related}>
      {list.map((id) => {
        const s = services[id];
        return (
          <Link key={id} href={s.route} className={styles.relatedItem}>
            <div className={styles.relatedMedia}>
              <Photo name={s.image.key} alt={s.image.alt} sizes="(min-width: 760px) 50vw, 100vw" style={{ objectPosition: s.image.position ?? "50% 50%" }} />
            </div>
            <div>
              <h3>{s.title}</h3>
              <p className="muted">{s.blurb}</p>
              <span className="arrow-link">
                Explore <span className="arr" aria-hidden="true">→</span>
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export function CtaBand({
  title = "Have a site, a space or an idea?",
  body = "Tell us what you are planning. We’ll respond with how we would approach it.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className={`section section--dark ${styles.cta}`} aria-labelledby="cta-title">
      <div className="wrap">
        <Reveal className={styles.ctaInner}>
          <p className="eyebrow">Start a project</p>
          <h2 id="cta-title" className="display">{title}</h2>
          <p className="lede">{body}</p>
          <div className={styles.ctaActions}>
            <Link href="/contact" className="btn btn--ghost">
              Discuss your project <span aria-hidden="true">→</span>
            </Link>
            {site.contactEmail ? (
              <a className="arrow-link" href={`mailto:${site.contactEmail}`}>
                {site.contactEmail}
              </a>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function OfficeSection() {
  const verified = offices.filter((o) => o.verified);
  return (
    <div className={styles.offices}>
      {verified.length === 0 ? (
        <div className={styles.officeNote}>
          <h3 className="h3">Studio details coming soon.</h3>
          <p className="muted">
            We haven’t published a verified studio address yet, and we won’t guess one. Until then, the quickest way to reach us is the
            enquiry form{site.contactEmail ? ` or ${site.contactEmail}` : ""}.
          </p>
          <Link href="/contact" className="arrow-link">
            Send an enquiry <span className="arr" aria-hidden="true">→</span>
          </Link>
        </div>
      ) : (
        verified.map((o) => (
          <article key={o.id} className={styles.office}>
            <h3 className="h3">{o.name}</h3>
            <dl>
              {o.address ? (<><dt>Address</dt><dd>{o.address}</dd></>) : null}
              {o.phone ? (<><dt>Phone</dt><dd><a href={`tel:${o.phone.replace(/\s/g, "")}`}>{o.phone}</a></dd></>) : null}
              {o.email ? (<><dt>Email</dt><dd><a href={`mailto:${o.email}`}>{o.email}</a></dd></>) : null}
              {o.hours ? (<><dt>Hours</dt><dd>{o.hours}</dd></>) : null}
            </dl>
            {o.address ? (
              <a className="arrow-link" href={o.mapUrl ?? `https://www.openstreetmap.org/search?query=${encodeURIComponent(o.address)}`} rel="noopener noreferrer" target="_blank">
                Directions <span className="arr" aria-hidden="true">→</span>
              </a>
            ) : null}
          </article>
        ))
      )}
    </div>
  );
}
