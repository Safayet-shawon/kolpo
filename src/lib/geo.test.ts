import { describe, expect, it } from "vitest";
import { formatDistance, haversineKm, normalizeText } from "./geo";

describe("haversineKm", () => {
  it("is zero for identical points", () => {
    expect(haversineKm({ lat: 23.8, lng: 90.4 }, { lat: 23.8, lng: 90.4 })).toBeCloseTo(0, 6);
  });

  it("matches the known Dhaka–Chattogram great-circle distance (~217 km)", () => {
    const d = haversineKm({ lat: 23.8103, lng: 90.4125 }, { lat: 22.3569, lng: 91.7832 });
    expect(d).toBeGreaterThan(200);
    expect(d).toBeLessThan(230);
  });

  it("is symmetric", () => {
    const a = { lat: 24.8949, lng: 91.8687 };
    const b = { lat: 22.8456, lng: 89.5403 };
    expect(haversineKm(a, b)).toBeCloseTo(haversineKm(b, a), 9);
  });
});

describe("formatDistance", () => {
  it("formats sub-kilometre, short and long distances", () => {
    expect(formatDistance(0.45)).toBe("500 m");
    expect(formatDistance(3.456)).toBe("3.5 km");
    expect(formatDistance(217.4)).toBe("217 km");
  });
});

describe("normalizeText", () => {
  it("strips accents, case and punctuation", () => {
    expect(normalizeText("  Chattogram,  BD! ")).toBe("chattogram bd");
    expect(normalizeText("Zürich")).toBe("zurich");
  });
});
