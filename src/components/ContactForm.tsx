"use client";

import { useEffect, useRef, useState } from "react";
import { BUDGET_OPTIONS, SERVICE_OPTIONS, validateContact, type ContactErrors, type ContactInput } from "@/lib/contact-schema";
import styles from "./ContactForm.module.css";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "not-configured" }
  | { kind: "error"; message: string };

const empty: ContactInput = {
  name: "",
  email: "",
  phone: "",
  service: "",
  location: "",
  budget: "",
  message: "",
  consent: false,
};

export default function ContactForm({ fallbackEmail, defaultService = "" }: { fallbackEmail: string | null; defaultService?: string }) {
  const [values, setValues] = useState<ContactInput>({ ...empty, service: defaultService });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [honeypot, setHoneypot] = useState("");
  const openedAt = useRef(0);
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    openedAt.current = Date.now(); // used server-side as a "was this filled in by a human?" timing signal
  }, []);

  const set = <K extends keyof ContactInput>(k: K, v: ContactInput[K]) => {
    setValues((s) => ({ ...s, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status.kind === "sending") return;
    const result = validateContact(values);
    setErrors(result.errors);
    if (!result.ok) {
      const first = Object.keys(result.errors)[0];
      requestAnimationFrame(() => document.getElementById(`f-${first}`)?.focus());
      return;
    }
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...result.clean, website: honeypot, elapsed: Date.now() - openedAt.current }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; code?: string; errors?: ContactErrors; message?: string };
      if (res.ok && data.ok) {
        setStatus({ kind: "sent" });
        setValues({ ...empty });
        requestAnimationFrame(() => summaryRef.current?.focus());
      } else if (data.code === "not_configured") {
        setStatus({ kind: "not-configured" });
        requestAnimationFrame(() => summaryRef.current?.focus());
      } else if (res.status === 422 && data.errors) {
        setErrors(data.errors);
        setStatus({ kind: "idle" });
      } else if (res.status === 429) {
        setStatus({ kind: "error", message: "Too many enquiries from this connection. Please wait a little while and try again." });
      } else {
        setStatus({ kind: "error", message: data.message ?? "We couldn’t send your enquiry. Please try again in a moment." });
      }
    } catch {
      setStatus({ kind: "error", message: "We couldn’t reach the server. Check your connection and try again." });
    }
  }

  if (status.kind === "sent") {
    return (
      <div ref={summaryRef} tabIndex={-1} className={styles.notice} role="status">
        <h3 className="h3">Thank you. Your enquiry has been sent.</h3>
        <p className="muted">We’ll reply to the email address you gave us. If you don’t hear back, please write to us directly.</p>
        <button className="btn btn--ghost btn--onlight" type="button" onClick={() => setStatus({ kind: "idle" })}>
          Send another enquiry
        </button>
      </div>
    );
  }

  if (status.kind === "not-configured") {
    const subject = encodeURIComponent("Project enquiry");
    const body = encodeURIComponent(
      `Name: ${values.name}\nEmail: ${values.email}\nPhone: ${values.phone}\nService: ${values.service}\nLocation: ${values.location}\nBudget: ${values.budget}\n\n${values.message}`,
    );
    return (
      <div ref={summaryRef} tabIndex={-1} className={styles.notice} role="alert">
        <h3 className="h3">Your enquiry has not been sent.</h3>
        <p>
          Online enquiries aren’t switched on for this site yet, so nothing was delivered and nothing was saved.
          {fallbackEmail ? " You can email us directly instead:" : " Please check back soon — a direct contact address will be published here."}
        </p>
        {fallbackEmail ? (
          <a className="btn" href={`mailto:${fallbackEmail}?subject=${subject}&body=${body}`}>
            Email {fallbackEmail}
          </a>
        ) : null}
        <button className="btn btn--ghost btn--onlight" type="button" onClick={() => setStatus({ kind: "idle" })}>
          Back to the form
        </button>
      </div>
    );
  }

  const err = (k: keyof ContactInput) => (errors[k] ? `e-${k}` : undefined);
  const invalid = (k: keyof ContactInput) => (errors[k] ? true : undefined);

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate aria-describedby="form-status">
      <div className={styles.row}>
        <div className="field">
          <label htmlFor="f-name">Name</label>
          <input id="f-name" className="input" autoComplete="name" value={values.name} onChange={(e) => set("name", e.target.value)} aria-invalid={invalid("name")} aria-describedby={err("name")} required />
          {errors.name ? <p id="e-name" className="field-error">{errors.name}</p> : null}
        </div>
        <div className="field">
          <label htmlFor="f-email">Email</label>
          <input id="f-email" type="email" className="input" autoComplete="email" value={values.email} onChange={(e) => set("email", e.target.value)} aria-invalid={invalid("email")} aria-describedby={err("email")} required />
          {errors.email ? <p id="e-email" className="field-error">{errors.email}</p> : null}
        </div>
      </div>

      <div className={styles.row}>
        <div className="field">
          <label htmlFor="f-phone">Phone <span className="opt">(optional)</span></label>
          <input id="f-phone" type="tel" className="input" autoComplete="tel" value={values.phone} onChange={(e) => set("phone", e.target.value)} aria-invalid={invalid("phone")} aria-describedby={err("phone")} />
          {errors.phone ? <p id="e-phone" className="field-error">{errors.phone}</p> : null}
        </div>
        <div className="field">
          <label htmlFor="f-service">Service of interest</label>
          <select id="f-service" className="select" value={values.service} onChange={(e) => set("service", e.target.value)} aria-invalid={invalid("service")} aria-describedby={err("service")} required>
            <option value="" disabled>Select a service</option>
            {SERVICE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          {errors.service ? <p id="e-service" className="field-error">{errors.service}</p> : null}
        </div>
      </div>

      <div className={styles.row}>
        <div className="field">
          <label htmlFor="f-location">Project location</label>
          <input id="f-location" className="input" autoComplete="address-level2" value={values.location} onChange={(e) => set("location", e.target.value)} aria-invalid={invalid("location")} aria-describedby={err("location")} required />
          {errors.location ? <p id="e-location" className="field-error">{errors.location}</p> : null}
        </div>
        <div className="field">
          <label htmlFor="f-budget">Budget range <span className="opt">(optional)</span></label>
          <select id="f-budget" className="select" value={values.budget} onChange={(e) => set("budget", e.target.value)} aria-invalid={invalid("budget")} aria-describedby={err("budget")}>
            {BUDGET_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor="f-message">Tell us about the project</label>
        <textarea id="f-message" className="textarea" value={values.message} onChange={(e) => set("message", e.target.value)} aria-invalid={invalid("message")} aria-describedby={err("message")} required />
        {errors.message ? <p id="e-message" className="field-error">{errors.message}</p> : null}
      </div>

      {/* Honeypot: invisible to people, tempting to bots. */}
      <div className={styles.hp} aria-hidden="true">
        <label htmlFor="f-website">Website</label>
        <input id="f-website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>

      <div className="field">
        <label className={styles.consent}>
          <input id="f-consent" type="checkbox" checked={values.consent} onChange={(e) => set("consent", e.target.checked)} aria-invalid={invalid("consent")} aria-describedby={err("consent")} />
          <span>
            I agree that KOLPO may use these details to reply to my enquiry. See the <a href="/privacy">privacy policy</a>.
          </span>
        </label>
        {errors.consent ? <p id="e-consent" className="field-error">{errors.consent}</p> : null}
      </div>

      <div id="form-status" aria-live="polite">
        {status.kind === "error" ? <p className={styles.error} role="alert">{status.message}</p> : null}
      </div>

      <button className="btn" type="submit" disabled={status.kind === "sending"}>
        {status.kind === "sending" ? "Sending…" : "Send enquiry"} <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
