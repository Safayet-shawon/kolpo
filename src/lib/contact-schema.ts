// Shared by the browser form and the /api/contact route so both enforce identical rules.

export const SERVICE_OPTIONS = [
  { value: "architecture", label: "Architecture & community design" },
  { value: "interior-design", label: "Interior design" },
  { value: "construction", label: "Construction" },
  { value: "multiple", label: "More than one service" },
  { value: "not-sure", label: "Not sure yet" },
] as const;

export const BUDGET_OPTIONS = [
  { value: "", label: "Prefer not to say" },
  { value: "discuss", label: "Let's discuss" },
  { value: "small", label: "Smaller scope" },
  { value: "medium", label: "Mid-size project" },
  { value: "large", label: "Large or multi-phase" },
] as const;

export type ContactInput = {
  name: string;
  email: string;
  phone: string;
  service: string;
  location: string;
  budget: string;
  message: string;
  consent: boolean;
};

export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+()\d\s.-]{6,20}$/;
const SERVICE_VALUES: string[] = SERVICE_OPTIONS.map((o) => o.value);
const BUDGET_VALUES: string[] = BUDGET_OPTIONS.map((o) => o.value);

export function validateContact(input: Partial<ContactInput>): { ok: boolean; errors: ContactErrors; clean: ContactInput } {
  const clean: ContactInput = {
    name: String(input.name ?? "").trim(),
    email: String(input.email ?? "").trim(),
    phone: String(input.phone ?? "").trim(),
    service: String(input.service ?? "").trim(),
    location: String(input.location ?? "").trim(),
    budget: String(input.budget ?? "").trim(),
    message: String(input.message ?? "").trim(),
    consent: input.consent === true,
  };
  const errors: ContactErrors = {};

  if (clean.name.length < 2) errors.name = "Please enter your name.";
  else if (clean.name.length > 120) errors.name = "That name is too long.";

  if (!EMAIL_RE.test(clean.email) || clean.email.length > 200) errors.email = "Enter a valid email address.";

  if (clean.phone && !PHONE_RE.test(clean.phone)) errors.phone = "Use digits, spaces, + or - only.";

  if (!SERVICE_VALUES.includes(clean.service)) errors.service = "Choose the service you are interested in.";

  if (clean.location.length < 2) errors.location = "Tell us where the project is.";
  else if (clean.location.length > 160) errors.location = "Please shorten the location.";

  if (!BUDGET_VALUES.includes(clean.budget)) errors.budget = "Choose one of the options.";

  if (clean.message.length < 20) errors.message = "Describe the project in at least a couple of sentences (20+ characters).";
  else if (clean.message.length > 4000) errors.message = "Please keep the description under 4000 characters.";

  if (!clean.consent) errors.consent = "Please confirm you are happy for us to contact you about this enquiry.";

  return { ok: Object.keys(errors).length === 0, errors, clean };
}
