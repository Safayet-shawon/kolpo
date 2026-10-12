"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { estimate, estimator, formatArea, formatMoney, type EstimateOption, type ServiceKey } from "@/data/pricing";
import styles from "./CostEstimator.module.css";

/**
 * Pick what you want (home / building / colony …), a popup asks for the area in sq ft, and returns an indicative total.
 * Rates live in src/data/pricing.ts (currently placeholders; see the note there).
 */
export default function CostEstimator({ service }: { service: ServiceKey }) {
  const cfg = estimator[service];
  const dialog = useRef<HTMLDialogElement>(null);
  const inputId = useId();
  const [option, setOption] = useState<EstimateOption | null>(null);
  const [area, setArea] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<ReturnType<typeof estimate> | null>(null);
  const [sqft, setSqft] = useState(0);

  const open = (o: EstimateOption) => {
    setOption(o);
    setArea("");
    setError("");
    setResult(null);
    dialog.current?.showModal();
    requestAnimationFrame(() => document.getElementById(inputId)?.focus());
  };

  const close = () => dialog.current?.close();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!option) return;
    const n = Number(area.replace(/[,\s]/g, ""));
    if (!Number.isFinite(n) || n <= 0) return setError("Enter the area in square feet.");
    if (n < option.min) return setError(`The smallest area we estimate for a ${option.label.toLowerCase()} is ${formatArea(option.min)} sq ft.`);
    if (n > option.max) return setError(`For more than ${formatArea(option.max)} sq ft, please contact us for a custom estimate.`);
    setError("");
    setSqft(n);
    setResult(estimate(option, n));
  };

  const note = option && result ? `${option.label} (${service === "all" ? "design, interior and construction" : service}), ${formatArea(sqft)} sq ft. Indicative estimate ${formatMoney(result.total)}.` : "";

  return (
    <section className="section" aria-labelledby={`${inputId}-t`}>
      <div className="wrap">
        <h2 id={`${inputId}-t`} className="h2" style={{ marginBottom: "1.4rem" }}>
          {cfg.title}
        </h2>
        <ul className={styles.options}>
          {cfg.options.map((o, i) => (
            <li key={o.id}>
              <button type="button" className={`${styles.option} ${styles[`c${i}`]}`} onClick={() => open(o)}>
                <span className={styles.label}>{o.label}</span>
                <span className={styles.hint}>{o.hint}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <dialog ref={dialog} className={styles.dialog} aria-labelledby={`${inputId}-d`} onClose={() => setResult(null)}>
        <form onSubmit={submit} noValidate className={styles.form}>
          <h3 id={`${inputId}-d`} className="h3">
            {option?.label}
          </h3>
          <div className="field">
            <label htmlFor={inputId}>Area (sq ft)</label>
            <input
              id={inputId}
              className="input"
              inputMode="numeric"
              autoComplete="off"
              placeholder={option ? `e.g. ${formatArea(Math.max(option.min, Math.round((option.min * 4) / 100) * 100))}` : ""}
              value={area}
              onChange={(e) => {
                setArea(e.target.value);
                setError("");
              }}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? `${inputId}-e` : undefined}
            />
            {error ? (
              <p id={`${inputId}-e`} className="field-error" role="alert">
                {error}
              </p>
            ) : null}
          </div>
          <button type="submit" className="btn">
            Get total cost
          </button>

          {result ? (
            <div className={styles.result} aria-live="polite">
              <p className={styles.total}>{formatMoney(result.total)}</p>
              <ul>
                {result.lines.map((l) => (
                  <li key={l.label}>
                    <span>{l.label}</span>
                    <span>
                      {formatArea(sqft)} sq ft × {formatMoney(l.perSqft)} = {formatMoney(l.amount)}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="small muted">Indicative estimate only, not a quotation. Final cost depends on site, specification and scope.</p>
              <Link className="btn" href={`/contact?service=${cfg.contactService}&note=${encodeURIComponent(note)}`}>
                Request a quote
              </Link>
            </div>
          ) : null}
        </form>
        <button type="button" className={styles.close} onClick={close} aria-label="Close">
          ×
        </button>
      </dialog>
    </section>
  );
}
