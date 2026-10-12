"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { nav } from "@/data/site";
import styles from "./Nav.module.css";

/**
 * One top bar with every option, identical on phone and laptop. On very narrow screens the row scrolls sideways
 * rather than collapsing into a menu, so nothing is hidden.
 */
export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const current = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/")) ? "page" : undefined;

  return (
    <header className={`${styles.header} ${scrolled ? styles.solid : ""}`}>
      <div className={styles.bar}>
        <Link href="/" className={styles.brand} aria-label="KOLPO — home">
          <Logo variant="mark" height={34} priority />
        </Link>
        <nav className={styles.nav} aria-label="Primary">
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={current(item.href)} className={styles.link}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
