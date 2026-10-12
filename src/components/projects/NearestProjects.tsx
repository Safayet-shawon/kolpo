"use client";

import { useEffect, useMemo, useState } from "react";
import ProjectCard from "./ProjectCard";
import { projects, type Project } from "@/data/projects";
import { gazetteer } from "@/data/gazetteer";
import { formatDistance, haversineKm, normalizeText, type LatLng } from "@/lib/geo";
import styles from "./Projects.module.css";

type Origin =
  | { kind: "device"; point: LatLng }
  | { kind: "place"; point: LatLng; name: string }
  | { kind: "text"; query: string }
  | null;

type GeoState = "idle" | "locating" | "denied" | "unavailable" | "error";

export default function NearestProjects() {
  const [input, setInput] = useState("");
  const [debounced, setDebounced] = useState("");
  const [device, setDevice] = useState<LatLng | null>(null);
  const [geo, setGeo] = useState<GeoState>("idle");

  // Debounce typing so the list does not reshuffle on every keystroke.
  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(input), 220);
    return () => window.clearTimeout(t);
  }, [input]);

  const typed = useMemo<Origin>(() => {
    const q = normalizeText(debounced);
    if (!q) return null;
    // A recognised place gives a real coordinate, so we can rank by distance from its centre.
    const place = gazetteer.find((g) => normalizeText(g.name) === q) ?? gazetteer.find((g) => normalizeText(g.name).startsWith(q) && q.length >= 3);
    if (place) return { kind: "place", name: place.name, point: { lat: place.lat, lng: place.lng } };
    return { kind: "text", query: q };
  }, [debounced]);

  // Typing overrides the device location; clearing the field returns to it.
  const origin = useMemo<Origin>(() => typed ?? (device ? { kind: "device", point: device } : null), [typed, device]);

  const results = useMemo(() => {
    if (!origin) return projects.map((p) => ({ project: p, km: null as number | null }));
    if (origin.kind === "text") {
      const q = origin.query;
      return projects
        .filter((p) => normalizeText(`${p.location.city} ${p.location.area ?? ""} ${p.location.region} ${p.title}`).includes(q))
        .map((p) => ({ project: p, km: null as number | null }));
    }
    return projects
      .map((p) => ({ project: p, km: haversineKm(origin.point, { lat: p.location.lat, lng: p.location.lng }) }))
      .sort((a, b) => (a.km ?? 0) - (b.km ?? 0));
  }, [origin]);

  const useMyLocation = () => {
    if (!("geolocation" in navigator)) return setGeo("unavailable");
    setGeo("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDevice({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setInput("");
        setDebounced("");
        setGeo("idle");
      },
      (err) => setGeo(err.code === err.PERMISSION_DENIED ? "denied" : "error"),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  };

  const heading = (() => {
    if (!origin) return "All projects";
    if (origin.kind === "device") return "Nearest to your location";
    if (origin.kind === "place") return `Nearest to ${origin.name}`;
    return `Projects matching “${debounced.trim()}”`;
  })();

  const note = (() => {
    if (!origin) return "Showing every project. Search a city or area, or use your location, to sort by distance.";
    if (origin.kind === "device") return "Straight-line distance from your device’s reported position. Your location stays in your browser and is never sent to us.";
    if (origin.kind === "place") return `Straight-line distance from the centre of ${origin.name} to each project’s city.`;
    return "Area-based match on the project’s city or region. Enter a known city name to rank by distance instead.";
  })();

  return (
    <div className={styles.finder}>
      <form className={styles.finderForm} onSubmit={(e) => e.preventDefault()} role="search" aria-label="Find projects near you">
        <div className="field" style={{ flex: 1 }}>
          <label htmlFor="near-q">City, area or project location</label>
          <input
            id="near-q"
            className="input"
            type="search"
            inputMode="search"
            autoComplete="off"
            placeholder="e.g. Chattogram, Sylhet, Dhaka"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            list="near-places"
          />
          <datalist id="near-places">
            {gazetteer.map((g) => (
              <option key={g.name} value={g.name} />
            ))}
          </datalist>
        </div>
        <button type="button" className="btn btn--ghost btn--onlight" onClick={useMyLocation} disabled={geo === "locating"}>
          {geo === "locating" ? "Locating…" : device ? "Update my location" : "Use my location"}
        </button>
      </form>

      <div aria-live="polite" className={styles.finderStatus}>
        {geo === "denied" ? (
          <p className={styles.alert}>
            Location permission was declined, so we haven’t used it. You can still type a city or area above, and results will rank
            from there.
          </p>
        ) : null}
        {geo === "unavailable" ? <p className={styles.alert}>This browser can’t provide a location. Type a city or area above instead.</p> : null}
        {geo === "error" ? <p className={styles.alert}>We couldn’t get a position just now. Try again, or type a city or area above.</p> : null}
      </div>

      <div className={styles.finderHead}>
        <h3 className="h3">{heading}</h3>
        <p className="muted small">{note}</p>
      </div>

      {results.length === 0 ? (
        <div className={styles.empty}>
          <h4>No projects match “{debounced.trim()}”.</h4>
          <p className="muted">
            Try a nearby city, or clear the search to see everything. Not seeing your area? <a href="/contact">Tell us about your project</a> — we
            can discuss work anywhere you are building.
          </p>
        </div>
      ) : (
        <ul className={styles.finderList}>
          {results.map(({ project, km }) => (
            <li key={project.slug}>
              <FinderRow project={project} km={km} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FinderRow({ project, km }: { project: Project; km: number | null }) {
  return <ProjectCard project={project} distanceLabel={km != null ? formatDistance(km) : undefined} sizes="(min-width: 900px) 33vw, 100vw" />;
}
