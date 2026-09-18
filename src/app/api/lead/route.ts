import { NextResponse } from "next/server";
import { formatPhone, validateLead, type LeadInput, MESSAGE_MAX } from "@/lib/lead";
import { getMailStatus, sendLeadNotification } from "@/lib/mail";
import { rateLimit } from "@/lib/rate-limit";
import { SITE } from "@/data/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Payload = Partial<Record<keyof LeadInput, unknown>>;

function asString(value: unknown, max: number): string {
  return typeof value === "string" ? value.slice(0, max).trim() : "";
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

async function sendToWebhook(lead: LeadInput, url: string): Promise<void> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      source: SITE.url,
      name: lead.name,
      phone: formatPhone(lead.phone),
      email: lead.email || null,
      message: lead.message || null,
      utm: lead.utm || null,
      submittedAt: new Date().toISOString(),
    }),
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) throw new Error(`Webhook ${response.status}`);
}

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, message: "Geçersiz istek." }, { status: 400 });
  }

  // Honeypot: doldurulmuşsa sessizce başarı döndür, hiçbir yere iletme.
  if (asString(body.website, 200)) {
    return NextResponse.json({ ok: true });
  }

  const limit = rateLimit(clientIp(request));
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, message: "Çok fazla deneme yapıldı. Lütfen bir süre sonra tekrar deneyin." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  const lead: LeadInput = {
    name: asString(body.name, 120),
    phone: asString(body.phone, 40),
    email: asString(body.email, 160),
    message: asString(body.message, MESSAGE_MAX),
    consent: body.consent === true,
    utm: asString(body.utm, 300),
  };

  const errors = validateLead(lead);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  // Teslimat yolu: panelde tanımlı e-posta → yoksa webhook → yoksa telefon yönlendirmesi.
  const status = await getMailStatus();
  const phoneFallback = `Lütfen ${SITE.phoneDisplay} numaralı telefondan bize ulaşın.`;

  if (status.mode === "none") {
    console.error("[lead] Teslimat yapılandırılmamış (panel > E-posta). Talep iletilemedi.");
    return NextResponse.json(
      { ok: false, message: `Talebiniz şu anda alınamadı. ${phoneFallback}` },
      { status: 503 }
    );
  }

  try {
    if (status.mode === "smtp") {
      const result = await sendLeadNotification(lead);
      if (!result.ok) throw new Error(result.error);
    } else {
      await sendToWebhook(lead, process.env.LEAD_WEBHOOK_URL ?? "");
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(
      "[lead] Teslimat hatası:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json(
      { ok: false, message: `Talebiniz iletilemedi. Lütfen tekrar deneyin veya ${phoneFallback}` },
      { status: 502 }
    );
  }
}
