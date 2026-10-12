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

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const { service } = await searchParams;
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
              <ContactForm fallbackEmail={site.contactEmail} defaultService={service && valid.includes(service) ? service : ""} />
            </div>
            <aside className={styles.aside} aria-label="Other ways to reach us">
              <h2 className="h3">Other ways to reach us</h2>
              {site.contactEmail ? (
                <p>
                  Email <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
                </p>
              ) : (
                <p className="muted">A public email address will be published here once confirmed. Until then, the form is the best way to reach us.</p>
              )}
              {site.phone ? (
                <p>
                  Call <a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a>
                </p>
              ) : null}
              <OfficeSection />
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
