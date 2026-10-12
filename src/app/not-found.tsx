import Link from "next/link";
import { PageHeader } from "@/components/Sections";

export default function NotFound() {
  return (
    <>
      <PageHeader eyebrow="404" title="This page isn’t on the plan." lede="The link may be old or mistyped. These will get you back on track." />
      <section className="section--tight section">
        <div className="wrap" style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          <Link className="btn" href="/">Home</Link>
          <Link className="btn btn--ghost btn--onlight" href="/projects">Our work</Link>
          <Link className="btn btn--ghost btn--onlight" href="/contact">Contact</Link>
        </div>
      </section>
    </>
  );
}
