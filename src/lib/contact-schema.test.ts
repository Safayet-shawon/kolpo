import { describe, expect, it } from "vitest";
import { validateContact } from "./contact-schema";

const valid = {
  name: "Ayesha Rahman",
  email: "ayesha@example.com",
  phone: "+880 1700 000000",
  service: "interior-design",
  location: "Dhaka",
  budget: "discuss",
  message: "We would like to discuss a full interior fit-out for a three bedroom apartment.",
  consent: true,
};

describe("validateContact", () => {
  it("accepts a complete valid enquiry", () => {
    const r = validateContact(valid);
    expect(r.ok).toBe(true);
    expect(r.errors).toEqual({});
  });

  it("accepts an empty optional phone and budget", () => {
    expect(validateContact({ ...valid, phone: "", budget: "" }).ok).toBe(true);
  });

  it("rejects bad email, short message and missing consent", () => {
    const r = validateContact({ ...valid, email: "nope", message: "short", consent: false });
    expect(r.ok).toBe(false);
    expect(Object.keys(r.errors).sort()).toEqual(["consent", "email", "message"]);
  });

  it("rejects an unknown service or budget value", () => {
    const r = validateContact({ ...valid, service: "plumbing", budget: "free" });
    expect(r.errors.service).toBeTruthy();
    expect(r.errors.budget).toBeTruthy();
  });

  it("trims whitespace", () => {
    expect(validateContact({ ...valid, name: "  Ayesha  " }).clean.name).toBe("Ayesha");
  });
});
