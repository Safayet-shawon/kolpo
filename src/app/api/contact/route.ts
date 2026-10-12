import { NextResponse } from "next/server";
import { validateContact, SERVICE_OPTIONS } from "@/lib/contact-schema";

// Never cache or share responses for user submissions.
export const dynamic = "force-dynamic";
const NO_STORE = { "Cache-Control": "no-store" };

// Best-effort in-memory limiter. On serverless each instance has its own memory, so this slows
// casual abuse but is not a hard guarantee; add Vercel Firewall / BotID rate limiting for production traffic.
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  return recent.length > MAX_PER_WINDOW;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) {
    return NextResponse.json({ ok: false, code: "rate_limited" }, { status: 429, headers: NO_STORE });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, code: "bad_request", message: "Invalid request." }, { status: 400, headers: NO_STORE });
  }

  // Spam signals: filled honeypot or a form submitted implausibly fast. Pretend success so bots learn nothing.
  const elapsed = Number(body.elapsed);
  if ((typeof body.website === "string" && body.website.trim() !== "") || (Number.isFinite(elapsed) && elapsed < 2500)) {
    return NextResponse.json({ ok: true }, { headers: NO_STORE });
  }

  const result = validateContact(body);
  if (!result.ok) {
    return NextResponse.json({ ok: false, code: "invalid", errors: result.errors }, { status: 422, headers: NO_STORE });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    // Be honest: no delivery integration is configured, so we do not claim success or store anything.
    return NextResponse.json({ ok: false, code: "not_configured" }, { status: 503, headers: NO_STORE });
  }

  const c = result.clean;
  const serviceLabel = SERVICE_OPTIONS.find((o) => o.value === c.service)?.label ?? c.service;
  const html = `<h2>New KOLPO enquiry</h2>
<p><strong>Name:</strong> ${esc(c.name)}<br><strong>Email:</strong> ${esc(c.email)}<br><strong>Phone:</strong> ${esc(c.phone || "—")}<br>
<strong>Service:</strong> ${esc(serviceLabel)}<br><strong>Location:</strong> ${esc(c.location)}<br><strong>Budget:</strong> ${esc(c.budget || "—")}</p>
<p>${esc(c.message).replace(/\n/g, "<br>")}</p>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], reply_to: c.email, subject: `KOLPO enquiry — ${serviceLabel} — ${c.name}`, html }),
    });
    if (!res.ok) {
      console.error("Contact delivery failed", res.status);
      return NextResponse.json({ ok: false, code: "delivery_failed", message: "We couldn’t deliver your enquiry. Please try again shortly." }, { status: 502, headers: NO_STORE });
    }
    return NextResponse.json({ ok: true }, { headers: NO_STORE });
  } catch (e) {
    console.error("Contact delivery error", e);
    return NextResponse.json({ ok: false, code: "delivery_failed", message: "We couldn’t deliver your enquiry. Please try again shortly." }, { status: 502, headers: NO_STORE });
  }
}
