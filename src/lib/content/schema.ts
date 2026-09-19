import { z } from "zod";
import { GALLERY } from "@/data/site";

/**
 * Yönetim panelinden düzenlenebilen içeriğin şeması.
 * Hem kayıt sırasında (sunucu) hem de kayıtlı dosya okunurken kullanılır; geçersiz bir
 * bölüm asla sayfaya ulaşmaz, o bölüm için varsayılan içerik gösterilir.
 */

const requiredText = (max: number) =>
  z
    .string()
    .trim()
    .min(1, "Bu alan boş bırakılamaz.")
    .max(max, `En fazla ${max} karakter olabilir.`);

/** Boş dizeyi "yok" kabul eden isteğe bağlı metin. */
const optionalText = (max: number) =>
  z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.string().trim().max(max, `En fazla ${max} karakter olabilir.`).optional()
  );

/** Yalnızca sitenin kendi görselleri (/images/...) veya panelden yüklenenler (/media/...). */
const imagePath = z
  .string()
  .trim()
  .regex(/^\/(images|media)\/[A-Za-z0-9._\-/]+$/, "Geçerli bir görsel yolu değil.")
  .refine((value) => !value.includes(".."), "Geçerli bir görsel yolu değil.");

const httpsUrl = z
  .string()
  .trim()
  .regex(/^https:\/\/[^\s<>"']+$/, "https:// ile başlayan geçerli bir adres girin.");

export const imageSchema = z.object({
  src: imagePath,
  alt: requiredText(300),
});

export const heroSchema = z.object({
  label: requiredText(120),
  title: requiredText(200),
  accent: optionalText(120),
  lead: requiredText(800),
  primaryCta: requiredText(60),
  highlights: z
    .array(z.object({ title: requiredText(80), text: requiredText(240) }))
    .min(1, "En az bir öne çıkan madde olmalı.")
    .max(6, "En fazla 6 madde eklenebilir."),
});

const packageItemSchema = z.object({
  name: requiredText(200),
  /** 2 ve üzeri ise "2 kez" rozeti gösterilir */
  count: z.number().int().min(2).max(10).optional(),
});

const labGroupSchema = z.object({
  group: requiredText(80),
  tests: z.array(requiredText(200)).min(1, "Grupta en az bir test olmalı.").max(40),
});

const visitSchema = z.object({
  week: requiredText(40),
  month: optionalText(40),
  items: z.array(packageItemSchema).min(1, "Her kontrolde en az bir kalem olmalı.").max(20),
  labs: z.array(labGroupSchema).max(10).optional(),
});

const trimesterSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]{1,20}$/),
  label: requiredText(40),
  weeks: requiredText(40),
  title: requiredText(80),
  intro: requiredText(400),
  visits: z.array(visitSchema).min(1, "Her trimesterde en az bir kontrol olmalı.").max(20),
});

export const packageSchema = z.object({
  title: requiredText(200),
  accent: optionalText(120),
  intro: requiredText(800),
  trimesters: z.array(trimesterSchema).length(3, "Üç trimester olmalı."),
  birth: z
    .array(z.object({ title: requiredText(80), text: requiredText(240) }))
    .min(1, "En az bir doğum kalemi olmalı.")
    .max(8),
  footnote: requiredText(600),
});

const faqItemSchema = z.object({
  q: requiredText(240),
  a: requiredText(2000),
  link: z.object({ href: httpsUrl, label: requiredText(80) }).optional(),
});

export const faqSchema = z.object({
  groups: z
    .array(
      z.object({
        id: z.string().regex(/^[a-z0-9-]{1,40}$/, "Geçersiz grup kimliği."),
        title: requiredText(60),
        items: z.array(faqItemSchema).min(1, "Her grupta en az bir soru olmalı.").max(40),
      })
    )
    .min(1, "En az bir soru grubu olmalı.")
    .max(10)
    .refine(
      (groups) => new Set(groups.map((group) => group.id)).size === groups.length,
      "Grup kimlikleri benzersiz olmalı."
    ),
});

export const doctorSchema = z.object({
  name: requiredText(80),
  displayName: requiredText(80),
  title: requiredText(30),
  department: requiredText(80),
  image: z.preprocess((value) => (value === "" ? undefined : value), imagePath.optional()),
  profileUrl: httpsUrl,
  summary: requiredText(600),
  interests: z.array(requiredText(80)).max(12),
});

export const doctorsSchema = z.object({
  items: z.array(doctorSchema).min(1, "En az bir hekim olmalı.").max(8),
});

export const schoolSchema = z.object({
  intro: requiredText(800),
  topics: z.array(z.object({ title: requiredText(120), by: requiredText(120) })).max(10),
});

/** "05 · Odalar & Hastane" galerisi; ilk görsel büyük gösterilir. */
export const galleryItemSchema = z.object({
  src: imagePath,
  title: requiredText(60),
  alt: requiredText(300),
});

export const roomsSchema = z.object({
  title: requiredText(200),
  accent: optionalText(120),
  intro: requiredText(800),
  facts: z
    .array(z.object({ value: requiredText(40), label: requiredText(80) }))
    .max(6, "En fazla 6 bilgi satırı eklenebilir."),
  roomsTitle: requiredText(120),
  roomsIntro: requiredText(600),
  features: z.array(requiredText(160)).max(15, "En fazla 15 madde eklenebilir."),
  roomsNote: optionalText(600),
});

export const imagesSchema = z.object({
  hero: imageSchema,
  tracking: imageSchema,
  cta: imageSchema,
  school: imageSchema,
  location: imageSchema,
  // Galeri sonradan eklendi; eski kayıtlarda yoksa resmi galeri görselleri kullanılır.
  gallery: z
    .array(galleryItemSchema)
    .min(1, "Galeride en az bir görsel olmalı.")
    .max(12, "Galeriye en fazla 12 görsel eklenebilir.")
    .default(() => GALLERY.map((item) => ({ ...item }))),
});

export const SECTION_SCHEMAS = {
  hero: heroSchema,
  package: packageSchema,
  faq: faqSchema,
  doctors: doctorsSchema,
  school: schoolSchema,
  rooms: roomsSchema,
  images: imagesSchema,
} as const;

export type SectionKey = keyof typeof SECTION_SCHEMAS;
export const SECTION_KEYS = Object.keys(SECTION_SCHEMAS) as SectionKey[];

export type SiteContent = { [K in SectionKey]: z.infer<(typeof SECTION_SCHEMAS)[K]> } & {
  updatedAt?: string;
  updatedBy?: string;
};

export type HeroContent = SiteContent["hero"];
export type PackageContent = SiteContent["package"];
export type FaqContent = SiteContent["faq"];
export type DoctorsContent = SiteContent["doctors"];
export type SchoolContent = SiteContent["school"];
export type RoomsContent = SiteContent["rooms"];
export type ImagesContent = SiteContent["images"];
export type ImageContent = z.infer<typeof imageSchema>;
export type GalleryItem = z.infer<typeof galleryItemSchema>;
