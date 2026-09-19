"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/admin", label: "Genel bakış" },
  { href: "/admin/hero", label: "Ana sayfa girişi" },
  { href: "/admin/paket", label: "Doğum paketi" },
  { href: "/admin/sss", label: "Sık sorulanlar" },
  { href: "/admin/hekimler", label: "Hekimler" },
  { href: "/admin/odalar", label: "Odalar & Hastane" },
  { href: "/admin/gebe-okulu", label: "Gebe Okulu" },
  { href: "/admin/gorseller", label: "Görseller" },
  { href: "/admin/eposta", label: "E-posta" },
  { href: "/admin/yedekler", label: "Yedekler" },
] as const;

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Panel menüsü" className="overflow-x-auto px-3 pb-3 lg:overflow-visible lg:px-4 lg:pb-0">
      <ul className="flex gap-1 lg:flex-col">
        {ITEMS.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "flex min-h-[44px] items-center rounded-xl px-3.5 text-[0.9375rem] whitespace-nowrap transition-colors",
                  active
                    ? "bg-green-050 font-medium text-green-800"
                    : "text-text hover:bg-offwhite hover:text-ink",
                ].join(" ")}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
