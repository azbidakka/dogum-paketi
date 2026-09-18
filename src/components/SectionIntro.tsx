import type { ReactNode } from "react";
import Reveal from "@/components/Reveal";

type SectionIntroProps = {
  label: string;
  title: string;
  /** Başlığın yeşil vurgulu bitişi */
  accent?: string;
  children?: ReactNode;
  className?: string;
  /** Başlığın maksimum genişliği; okunabilir satır uzunluğu için */
  titleClassName?: string;
};

export default function SectionIntro({
  label,
  title,
  accent,
  children,
  className,
  titleClassName,
}: SectionIntroProps) {
  return (
    <Reveal className={className}>
      <p className="section-label">{label}</p>
      <h2
        className={[
          "mt-5 font-semibold tracking-[-0.02em] text-[clamp(1.4rem,5.2vw,1.7rem)] leading-[1.3] lg:text-[2.05rem]",
          titleClassName ?? "max-w-[22ch]",
        ].join(" ")}
      >
        {title}
        {accent ? (
          <>
            {" "}
            <span className="font-display text-green-700">{accent}</span>
          </>
        ) : null}
      </h2>
      {children ? <div className="mt-6 max-w-[62ch] space-y-4 text-text">{children}</div> : null}
    </Reveal>
  );
}
