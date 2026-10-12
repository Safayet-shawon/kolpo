"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import Wordmark from "./Wordmark";
import { nav } from "@/data/site";
import styles from "./Nav.module.css";

const HERO_ROUTES = new Set(["/", "/architecture", "/interior-design", "/construction"]);

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor === pathname; // menu auto-closes when the route changes
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const overHero = HERO_ROUTES.has(pathname) && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = useCallback(() => {
    setOpenFor(null);
    toggleRef.current?.focus();
  }, []);

  // Menu behaviour: scroll lock, Escape to close, focus trap.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusables = () =>
      Array.from(panelRef.current?.querySelectorAll<HTMLElement>("a[href], button") ?? []).concat(toggleRef.current ?? []);
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return close();
      if (e.key !== "Tab") return;
      const els = focusables();
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const current = (href: string) => (pathname === href || pathname.startsWith(href + "/") ? "page" : undefined);

  return (
    <header className={`${styles.header} ${overHero ? styles.overHero : styles.solid} ${open ? styles.menuOpen : ""}`}>
      <div className={styles.bar}>
        <Link href="/" className={styles.brand} aria-label="KOLPO — home">
          <Wordmark className={styles.logo} />
        </Link>

        <nav className={styles.desktop} aria-label="Primary">
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={current(item.href)} className={styles.link}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/contact" className={styles.cta} aria-current={current("/contact")}>
            Start a project
          </Link>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => (open ? close() : setOpenFor(pathname))}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span className={styles.bars} aria-hidden="true">
            <i />
            <i />
          </span>
        </button>
      </div>

      <div id="mobile-menu" ref={panelRef} className={styles.panel} hidden={!open}>
        <nav aria-label="Mobile">
          <ul>
            {nav.map((item, i) => (
              <li key={item.href} style={{ ["--i" as string]: i }}>
                <Link href={item.href} aria-current={current(item.href)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/contact" className="btn" style={{ marginTop: "1.5rem" }}>
            Start a project
          </Link>
        </nav>
      </div>
    </header>
  );
}
