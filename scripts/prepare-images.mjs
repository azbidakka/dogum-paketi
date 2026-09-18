/**
 * TUSA Hastanesi'nin RESMİ galerisinden (tusahastanesi.com/kurumsal/galeri) alınan
 * hastane fotoğraflarını sayfanın ihtiyaç duyduğu boyutlara indirir ve optimize eder.
 *
 * Kullanım:  node scripts/prepare-images.mjs
 *
 * Kaynak galeri kategorileri:
 *   HASTA SERVİSİ ............ gisbir-h04-pro-(n).jpg   (gerçek fotoğraf)
 *   AMELİYATHANE ............. ameliyathane{n}.png      (kurumun yayımladığı görselleştirme)
 *   GİRİŞ KATI VE POLİKLİNİK . giris{n}.png             (kurumun yayımladığı görselleştirme)
 *
 * Dış kaynaktan lisanssız stok görsel kullanılmaz; tüm görseller kurumun kendi
 * yayımladığı varlıklardır.
 */
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const BASE = "https://tusahastanesi.com/assets/fotograflar";
const OUT = "public/images";
const CACHE = ".cache/tusa-galeri";

/** [kaynak dosya, hedef, genişlik, yükseklik, crop konumu] */
const JOBS = [
  // Hastane içi görseller YALNIZCA "05 · Odalar & Hastane" galerisinde kullanılır.
  // Diğer bölümlerin görselleri: scripts/prepare-ai-images.mjs
  // Odalar & hastane galerisi (ilk öğe büyük gösterilir)
  ["gisbir-h04-pro-(38).jpg", "galeri/hasta-odasi.webp", 1600, 1200, "attention"],
  ["gisbir-h04-pro-(45).jpg", "galeri/refakatci-alani.webp", 1200, 900, "centre"],
  ["gisbir-h04-pro-(46).jpg", "galeri/dinlenme-alani.webp", 1200, 900, "attention"],
  ["gisbir-h04-pro-(11).jpg", "galeri/servis-bankosu.webp", 1200, 900, "centre"],
  ["gisbir-h04-pro-(31).jpg", "galeri/hasta-servisi.webp", 1200, 900, "centre"],
  ["giris6.png", "galeri/hasta-kabul.webp", 1200, 900, "centre"],
  ["ameliyathane1.png", "galeri/ameliyathane.webp", 1200, 900, "centre"],
];

async function fetchCached(name) {
  const cached = path.join(CACHE, name);
  try {
    return await fs.readFile(cached);
  } catch {
    const response = await fetch(`${BASE}/${encodeURIComponent(name).replace(/%2F/g, "/")}`);
    if (!response.ok) throw new Error(`${name} indirilemedi: HTTP ${response.status}`);
    const buffer = Buffer.from(await response.arrayBuffer());
    await fs.mkdir(CACHE, { recursive: true });
    await fs.writeFile(cached, buffer);
    return buffer;
  }
}

for (const [src, out, w, h, position] of JOBS) {
  const buffer = await fetchCached(src);
  const target = path.join(OUT, out);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await sharp(buffer)
    .rotate()
    .resize(w, h, { fit: "cover", position })
    .webp({ quality: 82 })
    .toFile(target);
  console.log(`${out.padEnd(32)} <- ${src}`);
}

console.log(`\n${JOBS.length} görsel hazırlandı.`);
