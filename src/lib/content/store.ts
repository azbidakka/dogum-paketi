import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { cache } from "react";
import type { z } from "zod";
import { DEFAULT_CONTENT } from "./defaults";
import { SECTION_KEYS, SECTION_SCHEMAS, type SectionKey, type SiteContent } from "./schema";

/**
 * Panel içeriği sunucu diskinde JSON olarak saklanır.
 * - storage/content.json  → yayındaki içerik
 * - storage/backups/      → her kayıttan önceki sürüm (son 30)
 * - storage/uploads/      → panelden yüklenen görseller (/media/... ile sunulur)
 *
 * Konum CONTENT_DIR ile değiştirilebilir. Deploy'larda bu klasör korunmalıdır.
 */
export const STORAGE_DIR = process.env.CONTENT_DIR
  ? path.resolve(process.env.CONTENT_DIR)
  : path.join(process.cwd(), "storage");

const CONTENT_FILE = path.join(STORAGE_DIR, "content.json");
const BACKUP_DIR = path.join(STORAGE_DIR, "backups");
export const UPLOAD_DIR = path.join(STORAGE_DIR, "uploads");

const MAX_BACKUPS = 30;
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const ALLOWED_UPLOAD_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const BACKUP_NAME = /^content-[0-9TZ-]+\.json$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sectionSchema<K extends SectionKey>(key: K): z.ZodType<SiteContent[K]> {
  return SECTION_SCHEMAS[key] as unknown as z.ZodType<SiteContent[K]>;
}

function assign<K extends SectionKey>(target: SiteContent, key: K, value: SiteContent[K]) {
  target[key] = value;
}

async function readJson(file: string): Promise<unknown> {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.error(`[content] ${file} okunamadı:`, error);
    }
    return null;
  }
}

/** Kayıtlı veriyi bölüm bölüm doğrular; geçersiz bölüm varsayılana düşer. */
function mergeWithDefaults(raw: Record<string, unknown>): SiteContent {
  const content: SiteContent = { ...DEFAULT_CONTENT };

  for (const key of SECTION_KEYS) {
    if (!(key in raw)) continue;
    const parsed = sectionSchema(key).safeParse(raw[key]);
    if (parsed.success) {
      assign(content, key, parsed.data);
    } else {
      console.error(`[content] "${key}" bölümü geçersiz; varsayılan içerik kullanılıyor.`);
    }
  }

  if (typeof raw.updatedAt === "string") content.updatedAt = raw.updatedAt;
  if (typeof raw.updatedBy === "string") content.updatedBy = raw.updatedBy;
  return content;
}

async function loadContent(): Promise<SiteContent> {
  const raw = await readJson(CONTENT_FILE);
  return isRecord(raw) ? mergeWithDefaults(raw) : DEFAULT_CONTENT;
}

/** Sayfa ve panel için içerik (istek başına bir kez okunur). */
export const getContent = cache(loadContent);

async function writeAtomic(file: string, data: string) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const temp = `${file}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(temp, data, "utf8");
  await fs.rename(temp, file);
}

async function pruneBackups() {
  const names = (await fs.readdir(BACKUP_DIR)).filter((name) => BACKUP_NAME.test(name)).sort();
  const excess = names.length - MAX_BACKUPS;
  for (const name of names.slice(0, Math.max(0, excess))) {
    await fs.unlink(path.join(BACKUP_DIR, name)).catch(() => undefined);
  }
}

async function backupCurrent() {
  try {
    await fs.access(CONTENT_FILE);
  } catch {
    return; // henüz kayıt yok
  }
  await fs.mkdir(BACKUP_DIR, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  await fs.copyFile(CONTENT_FILE, path.join(BACKUP_DIR, `content-${stamp}.json`));
  await pruneBackups();
}

async function writeContent(content: SiteContent) {
  await backupCurrent();
  await writeAtomic(CONTENT_FILE, JSON.stringify(content, null, 2));
}

/** Hata mesajlarında alan anahtarları yerine paneldeki Türkçe adlar gösterilir. */
const FIELD_LABELS: Record<string, string> = {
  label: "Etiket",
  title: "Başlık",
  accent: "Başlık bitişi",
  lead: "Giriş metni",
  primaryCta: "Ana düğme metni",
  highlights: "Öne çıkan madde",
  text: "Açıklama",
  intro: "Açıklama",
  trimesters: "Trimester",
  weeks: "Hafta aralığı",
  visits: "Kontrol",
  week: "Hafta",
  month: "Ay",
  items: "Öğe",
  name: "Ad",
  count: "Adet",
  labs: "Laboratuvar grubu",
  group: "Grup adı",
  tests: "Test",
  birth: "Doğum kalemi",
  footnote: "Alt not",
  groups: "Soru grubu",
  q: "Soru",
  a: "Yanıt",
  link: "Bağlantı",
  href: "Bağlantı adresi",
  displayName: "Görünen ad",
  department: "Branş",
  image: "Fotoğraf",
  profileUrl: "Profil adresi",
  summary: "Kısa açıklama",
  interests: "İlgi alanı",
  topics: "Program başlığı",
  by: "Sunan",
  src: "Görsel",
  alt: "Alt metin",
  hero: "Ana görsel",
  tracking: "Doğum paketi görseli",
  cta: "“Yeni bir başlangıç” görseli",
  school: "Gebe Okulu görseli",
  location: "Konum görseli",
};

function formatIssues(error: z.ZodError): string[] {
  return error.issues.slice(0, 10).map((issue) => {
    const where = issue.path
      .map((part) =>
        typeof part === "number" ? `${part + 1}.` : (FIELD_LABELS[String(part)] ?? String(part))
      )
      .join(" › ");
    return where ? `${where}: ${issue.message}` : issue.message;
  });
}

export type SaveResult = { ok: true } | { ok: false; error: string; issues: string[] };

export async function saveSection<K extends SectionKey>(
  key: K,
  data: unknown,
  editor: string
): Promise<SaveResult> {
  const parsed = sectionSchema(key).safeParse(data);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Kaydedilemedi: bazı alanlar eksik veya geçersiz.",
      issues: formatIssues(parsed.error),
    };
  }

  const next: SiteContent = {
    ...(await loadContent()),
    updatedAt: new Date().toISOString(),
    updatedBy: editor,
  };
  assign(next, key, parsed.data);
  await writeContent(next);
  return { ok: true };
}

export type BackupInfo = { name: string; createdAt: string; size: number };

export async function listBackups(): Promise<BackupInfo[]> {
  try {
    const names = (await fs.readdir(BACKUP_DIR)).filter((name) => BACKUP_NAME.test(name));
    const infos = await Promise.all(
      names.map(async (name) => {
        const stat = await fs.stat(path.join(BACKUP_DIR, name));
        return { name, createdAt: stat.mtime.toISOString(), size: stat.size };
      })
    );
    return infos.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch {
    return [];
  }
}

export async function restoreBackup(name: string, editor: string): Promise<SaveResult> {
  if (!BACKUP_NAME.test(name)) {
    return { ok: false, error: "Geçersiz yedek adı.", issues: [] };
  }
  const raw = await readJson(path.join(BACKUP_DIR, name));
  if (!isRecord(raw)) {
    return { ok: false, error: "Yedek dosyası okunamadı.", issues: [] };
  }

  await writeContent({
    ...mergeWithDefaults(raw),
    updatedAt: new Date().toISOString(),
    updatedBy: `${editor} (yedekten geri yüklendi)`,
  });
  return { ok: true };
}

export type UploadOutcome = { ok: true; src: string } | { ok: false; error: string };

/** Görseli doğrular, webp'ye çevirir ve uploads klasörüne yazar. */
export async function saveUpload(file: File, slot: string): Promise<UploadOutcome> {
  if (!ALLOWED_UPLOAD_TYPES.has(file.type)) {
    return { ok: false, error: "Yalnızca JPG, PNG, WebP veya AVIF görseller yüklenebilir." };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return { ok: false, error: "Görsel en fazla 10 MB olabilir." };
  }

  const safeSlot =
    slot
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "")
      .slice(0, 30) || "gorsel";

  let output: Buffer;
  try {
    const sharp = (await import("sharp")).default;
    output = await sharp(Buffer.from(await file.arrayBuffer()))
      .rotate()
      .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
  } catch {
    return { ok: false, error: "Görsel işlenemedi; dosya bozuk ya da desteklenmiyor olabilir." };
  }

  const name = `${safeSlot}-${Date.now()}.webp`;
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, name), output);
  return { ok: true, src: `/media/${name}` };
}
