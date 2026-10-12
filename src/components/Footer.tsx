import Link from "next/link";
import Wordmark from "./Wordmark";
import { nav, offices, site } from "@/data/site";
import styles from "./Footer.module.css";

export default function Footer() {
  const office = offices[0];
  return (
    <footer className={styles.footer}>
      <div className="wrap">
        <div className={styles.top}>
          <div className={styles.brand}>
            <Wordmark className={styles.logo} />
            <p>{site.description}</p>
          </div>

          <nav aria-label="Services" className={styles.col}>
            <h2>Services</h2>
            <ul>
              <li><Link href="/architecture">Architecture &amp; Community Design</Link></li>
              <li><Link href="/interior-design">Interior Design</Link></li>
              <li><Link href="/construction">Construction</Link></li>
            </ul>
          </nav>

          <nav aria-label="Company" className={styles.col}>
            <h2>Studio</h2>
            <ul>
              {nav.slice(3).map((n) => (
                <li key={n.href}><Link href={n.href}>{n.label}</Link></li>
              ))}
              <li><Link href="/journal">Journal</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </nav>

          <div className={styles.col}>
            <h2>Contact</h2>
            <ul>
              {site.contactEmail ? (
                <li><a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a></li>
              ) : null}
              {site.phone ? <li><a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a></li> : null}
              {office.verified && office.address ? <li>{office.address}</li> : null}
              {!site.contactEmail && !site.phone ? (
                <li>
                  <Link href="/contact">Send an enquiry through the form</Link>
                </li>
              ) : null}
              {!office.verified ? <li className={styles.note}>Studio address to be confirmed.</li> : null}
              {site.social.map((s) => (
                <li key={s.href}><a href={s.href} rel="noopener noreferrer">{s.label}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} KOLPO. All rights reserved.</p>
          <p className={styles.disclaimer}>
            Imagery on this site is conceptual visualisation unless a project is marked as completed.
          </p>
          <Link href="/privacy">Privacy policy</Link>
        </div>
      </div>
    </footer>
  );
}
