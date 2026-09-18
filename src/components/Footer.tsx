import Image from "next/image";
import { LEGAL_LINKS, MEDIA, NAV, SITE } from "@/data/site";

export default function Footer() {
  return (
    <footer className="bg-green-900 text-white/80">
      <div className="container-page py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.9fr)] lg:gap-16">
          <div>
            <Image
              src={MEDIA.logoWhite}
              alt={SITE.name}
              width={196}
              height={32}
              loading="lazy"
              className="h-8 w-auto"
            />
            <p className="mt-5 max-w-[34ch] text-[0.9375rem] leading-relaxed">
              Kadın Hastalıkları ve Doğum — gebelik takibi, doğum planlaması ve doğum sonrası
              süreç hakkında bilgilendirme sayfası.
            </p>
            <address className="mt-6 text-[0.9375rem] not-italic">
              {SITE.address.street}
              <br />
              {SITE.address.district}
              <br />
              <a
                href={SITE.phoneHref}
                className="mt-1 inline-flex min-h-[44px] items-center font-medium text-white transition-opacity hover:opacity-80"
              >
                {SITE.phoneDisplay}
              </a>
            </address>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            <FooterColumn title="Sayfa">
              {[...NAV, { href: "#iletisim", label: "İletişim" }].map((item) => (
                <FooterLink key={item.href} href={item.href}>
                  {item.label}
                </FooterLink>
              ))}
            </FooterColumn>

            <FooterColumn title="Yasal">
              {LEGAL_LINKS.map((item) => (
                <FooterLink key={item.href} href={item.href}>
                  {item.label}
                </FooterLink>
              ))}
            </FooterColumn>

            <FooterColumn title="TUSA Hastanesi">
              <FooterLink href={SITE.corporateUrl} external>
                Kurumsal site
              </FooterLink>
              <FooterLink href={SITE.departmentUrl} external>
                Kadın Hastalıkları ve Doğum
              </FooterLink>
            </FooterColumn>
          </div>
        </div>

        <div className="mt-12 border-t border-white/15 pt-8">
          <p className="max-w-[76ch] text-[0.8125rem] leading-relaxed text-white/65">
            Bu web sitesindeki içerikler genel bilgilendirme amacı taşımaktadır. Tanı ve tedavi için
            hekiminize başvurunuz. Sayfadaki bazı görseller temsilidir.
          </p>
          <p className="mt-5 text-[0.8125rem] text-white/55">
            &copy; {new Date().getFullYear()} {SITE.name}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xs font-medium tracking-[0.14em] text-white uppercase">{title}</h2>
      <ul className="mt-4 space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  return (
    <li>
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="text-[0.9375rem] transition-colors hover:text-white"
      >
        {children}
      </a>
    </li>
  );
}
