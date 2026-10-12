import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { OfficeSection, PageHeader } from "@/components/Sections";
import { site } from "@/data/site";
import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: "Contact & Start a Project",
  description: "Tell KOLPO about your site, space or idea. Send a project enquiry and we’ll reply with how we would approach it.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ service?: string; note?: string }> }) {
  const { service, note } = await searchParams;
  const valid = ["architecture", "interior-design", "construction", "multiple", "not-sure"];
  return (
    <>
      <PageHeader
        eyebrow="Start a project"
        title="Tell us what you’re planning."
        lede="A few details about your site or space is enough to begin. We read every enquiry."
      />
      <section className="section" aria-label="Enquiry form">
        <div className="wrap">
          <div className={`grid-12 ${styles.layout}`}>
            <div className={styles.form}>
              <ContactForm fallbackEmail={site.contactEmail} defaultService={service && valid.includes(service) ? service : ""} defaultMessage={note ? note.slice(0, 400) : ""} />
            </div>
            <aside className={styles.aside} aria-label="Other ways to reach us">
              <h2 className="h3">Other ways to reach us</h2>
              {site.contactEmail ? (
                <p>
                  Email <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
                </p>
              ) : null}
              <p>
                Call{" "}
                {site.phones.map((p, i) => (
                  <span key={p}>
                    {i > 0 ? " · " : ""}
                    <a href={`tel:${p}`}>{p}</a>
                  </span>
                ))}
              </p>
              <OfficeSection />
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
