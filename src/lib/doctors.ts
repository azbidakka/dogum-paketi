import "server-only";
import { DOCTORS, type Doctor } from "@/data/doctors";

/**
 * Doktor bilgileri yönetim panelinden gelir (varsayılan: src/data/doctors.ts).
 * Bu yardımcı yalnızca SUNUCU / BUILD tarafında çalışır ve hekim ad/ünvanını resmi TUSA
 * profil sayfalarına karşı doğrular; ziyaretçi tarayıcısından tusahastanesi.com'a istek gitmez.
 *
 * Davranış:
 * - Resmi sayfa okunabilirse yalnızca ad ve ünvan doğrulanır/normalize edilir.
 * - Herhangi bir hata, zaman aşımı veya beklenmeyen HTML durumunda gelen veri aynen
 *   kullanılır; sayfa hiçbir koşulda bu yüzden çökmez.
 * - `DOCTOR_SOURCE_SYNC=0` ile tamamen kapatılabilir (ör. ağ erişimi olmayan CI).
 */

const TIMEOUT_MS = 4000;
const REVALIDATE_SECONDS = 60 * 60 * 24;

function decodeEntities(input: string): string {
  return input
    .replace(/&#(\d+);/g, (_, d: string) => String.fromCodePoint(Number(d)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h: string) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function textContent(html: string): string {
  return decodeEntities(
    html
      .replace(/<(script|style|noscript|svg)[\s\S]*?<\/\1>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  ).replace(/\s+/g, " ");
}

/**
 * Resmi sayfadan "Op. Dr. Melis KOCA" kalıbını çıkarır.
 * Kaynakta ad özel isim (Melis), soyad ise tümü büyük harf (KOCA) biçimindedir;
 * desen bu yazımı esas alır ve isim bitişini soyaddan tespit eder.
 */
function parseOfficialName(html: string, fallback: Doctor): { title: string; name: string } | null {
  const text = textContent(html);
  const match = text.match(
    /(Op\.\s?Dr\.|Uzm\.\s?Dr\.|Prof\.\s?Dr\.|Doç\.\s?Dr\.|Dr\.)\s+((?:\p{Lu}\p{Ll}+\s+)+\p{Lu}{2,}(?:\s\p{Lu}{2,})*)/u
  );
  if (!match?.[1] || !match[2]) return null;

  const name = match[2].trim().replace(/\s+/g, " ");
  // Beklenmedik bir eşleşmeyi UI'a yansıtma: soyadı gelen veriyle tutmalı.
  const lastName = fallback.name.split(" ").at(-1)?.toLocaleLowerCase("tr");
  if (!lastName || !name.toLocaleLowerCase("tr").includes(lastName)) return null;

  return { title: match[1].replace(/\s+/g, " ").trim(), name };
}

async function verifyDoctor(doctor: Doctor): Promise<{ doctor: Doctor; verified: boolean }> {
  if (!doctor.sourceUrl.startsWith("https://tusahastanesi.com/doktor/")) {
    return { doctor, verified: false };
  }

  try {
    const response = await fetch(doctor.sourceUrl, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      next: { revalidate: REVALIDATE_SECONDS },
      headers: { accept: "text/html" },
    });
    if (!response.ok) return { doctor, verified: false };

    const parsed = parseOfficialName(await response.text(), doctor);
    if (!parsed) return { doctor, verified: false };

    return { doctor: { ...doctor, title: parsed.title, name: parsed.name }, verified: true };
  } catch {
    // Kaynak ulaşılamadı — gelen veriyle devam et.
    return { doctor, verified: false };
  }
}

export async function getDoctors(list: Doctor[] = DOCTORS): Promise<Doctor[]> {
  if (process.env.DOCTOR_SOURCE_SYNC === "0") return list;

  const results = await Promise.all(list.map(verifyDoctor));
  const verifiedCount = results.filter((result) => result.verified).length;

  // Build/ISR günlüğü: kaç hekimin resmi kaynaktan doğrulandığını görünür kılar.
  console.info(
    `[doctors] ${verifiedCount}/${results.length} hekim resmi profil sayfasından doğrulandı.`
  );

  return results.map((result) => result.doctor);
}
