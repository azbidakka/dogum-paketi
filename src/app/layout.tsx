import type { Metadata, Viewport } from "next";
import { Merriweather, Poppins } from "next/font/google";
import { SITE } from "@/data/site";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-poppins-var",
});

// Başlık fontu: yalnızca Merriweather Bold Italic kesiti yüklenir.
const merriweather = Merriweather({
  subsets: ["latin", "latin-ext"],
  weight: ["700"],
  style: ["italic"],
  display: "swap",
  variable: "--font-merriweather-var",
});

const TITLE = "Doğum Paketi ve Gebelik Takibi | TUSA Hastanesi Tuzla";
const DESCRIPTION =
  "TUSA Hastanesi Kadın Hastalıkları ve Doğum bölümünde gebelik takibi, doğum planlaması, normal ve sezaryen doğum süreçleri hakkında bilgi alın. Tuzla / İstanbul.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: TITLE,
    template: "%s | TUSA Hastanesi",
  },
  description: DESCRIPTION,
  // Brief'te belirtilen kanonik adres (sonunda eğik çizgi ile)
  alternates: { canonical: `${SITE.url}/` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: SITE.name,
    url: SITE.url,
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/images/og.jpg", width: 1200, height: 630, alt: `${SITE.name} — Gebelik ve Doğum` }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/images/og.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a6a39",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${poppins.variable} ${merriweather.variable}`}>
      <head>
        {/*
          Giriş animasyonları yalnızca `html.js` altında uygulanır; böylece JS
          kapalıyken veya hata alındığında içerik her koşulda görünür kalır.
          Render'dan önce çalıştığı için sınıf değişimi görsel bir sıçrama yaratmaz.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body className="antialiased">
        <a
          href="#icerik"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-green-700 focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-white"
        >
          İçeriğe geç
        </a>
        {children}
      </body>
    </html>
  );
}
