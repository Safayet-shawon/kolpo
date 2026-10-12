import { describe, expect, it } from "vitest";
import { estimate, estimator, formatMoney, groupBD } from "./pricing";

describe("estimate", () => {
  it("multiplies each part by the area and sums the total", () => {
    const opt = estimator.all.options[0];
    const r = estimate(opt, 1000);
    expect(r.lines).toHaveLength(3);
    expect(r.total).toBe(r.lines.reduce((a, l) => a + l.amount, 0));
    expect(r.total).toBe(Math.round(1000 * opt.parts.reduce((a, p) => a + p.perSqft, 0)));
  });

  it("is linear in area", () => {
    const opt = estimator.construction.options[0];
    expect(estimate(opt, 2000).total).toBe(2 * estimate(opt, 1000).total);
  });

  it("every option has a sensible range and at least one part", () => {
    for (const cfg of Object.values(estimator))
      for (const o of cfg.options) {
        expect(o.min).toBeGreaterThan(0);
        expect(o.max).toBeGreaterThan(o.min);
        expect(o.parts.length).toBeGreaterThan(0);
      }
  });
});

describe("formatMoney", () => {
  it("prefixes the taka sign and groups digits", () => {
    expect(formatMoney(1234567)).toContain("৳");
    expect(formatMoney(1234567).replace(/\D/g, "")).toBe("1234567");
  });
});

describe("groupBD", () => {
  it("groups digits the Bangladeshi way", () => {
    expect(groupBD(999)).toBe("999");
    expect(groupBD(1000)).toBe("1,000");
    expect(groupBD(150000)).toBe("1,50,000");
    expect(groupBD(12345678)).toBe("1,23,45,678");
  });
});
