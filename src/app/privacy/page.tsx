import type { Metadata } from "next";
import { PageHeader } from "@/components/Sections";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How KOLPO handles enquiry details and location information on this website.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy policy" lede="Plain-language summary of what this website does with your information." />
      <section className="section--tight section">
        <div className="wrap" style={{ maxWidth: "46rem", display: "grid", gap: "1.6rem" }}>
          <p className="small muted">Draft for review. Have this policy checked against your local legal requirements before relying on it.</p>

          <h2 className="h3">Enquiries</h2>
          <p>
            If you send an enquiry through the contact form, we receive the details you enter — name, email, optional phone, service of
            interest, project location, optional budget range and your message — so we can reply. We use them only to respond to your enquiry
            and to discuss your project.
          </p>

          <h2 className="h3">Your location</h2>
          <p>
            The “Use my location” button asks your browser for permission. It is only used when you press it. Your position is processed
            in your browser to sort projects by distance and is not sent to our servers or stored. You can decline, and typing a city
            works instead.
          </p>

          <h2 className="h3">Cookies and storage</h2>
          <p>
            We don’t use advertising or analytics cookies. The site stores two small flags in your browser’s session storage so that the intro
            animation and loading screen are not repeated within the same visit. They are cleared when you close the tab.
          </p>

          <h2 className="h3">Sharing and retention</h2>
          <p>
            Enquiries are delivered by email to the studio through an email delivery service and are not sold or shared for marketing.
            Ask us to delete your enquiry at any time.
          </p>

          <h2 className="h3">Contact</h2>
          <p>
            {site.contactEmail ? (
              <>
                For privacy questions email <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
              </>
            ) : (
              <>For privacy questions, use the <a href="/contact">contact form</a>.</>
            )}
          </p>
        </div>
      </section>
    </>
  );
}
