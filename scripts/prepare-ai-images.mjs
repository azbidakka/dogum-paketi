/**
 * Magnific (Seedream 5 Pro) ile üretilen TEMSİLİ görselleri sayfa boyutlarına çevirir.
 *
 * Kullanım:  node scripts/prepare-ai-images.mjs
 *
 * Kaynak PNG'ler Magnific hesabından indirilip `.cache/magnific/` altına konur
 * (git'e girmez). Bu görseller hastane içini göstermez; hastane içi fotoğraflar
 * yalnızca "05 · Odalar & Hastane" bölümünde, resmi galeriden kullanılır
 * (bkz. scripts/prepare-images.mjs). Footer'da "Sayfadaki bazı görseller temsilidir."
 * ibaresi yer alır.
 */
import sharp from "sharp";

const SRC = ".cache/magnific/";
const OUT = "public/images/";

/** [kaynak, hedef, genişlik, yükseklik, crop konumu, sahne] */
const JOBS = [
  ["hero-a.png", "hero.webp", 1200, 1500, "attention", "Yenidoğanını göğsüne yaslayan anne"],
  ["takip-a.png", "surec.webp", 1400, 1050, "centre", "Ultrason görüntüsü tutan anne adayı"],
  ["cta-b.png", "cta-banner.webp", 1600, 1200, "centre", "Bebekleriyle anne ve baba"],
  ["okul-a.png", "gebe-okulu.webp", 1200, 1500, "centre", "Gebe Okulu'nda not alan anne adayı"],
];

for (const [src, out, w, h, position, scene] of JOBS) {
  await sharp(SRC + src)
    .resize(w, h, { fit: "cover", position })
    .webp({ quality: 82 })
    .toFile(OUT + out);
  console.log(`${out.padEnd(18)} <- ${src.padEnd(12)} ${scene}`);
}
