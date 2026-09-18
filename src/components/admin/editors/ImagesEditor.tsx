"use client";

import EditorShell from "@/components/admin/EditorShell";
import { ImageField, Panel } from "@/components/admin/fields";
import type { ImagesContent } from "@/lib/content/schema";

const SLOTS: { key: keyof ImagesContent; label: string; hint: string; aspect: string }[] = [
  {
    key: "hero",
    label: "Ana görsel (sayfa girişi)",
    hint: "Dikey (4:5) fotoğraf önerilir. Sayfada ilk görünen görseldir.",
    aspect: "aspect-4/5",
  },
  {
    key: "tracking",
    label: "Doğum paketi bölümü",
    hint: "Yatay (4:3) fotoğraf önerilir.",
    aspect: "aspect-4/3",
  },
  {
    key: "cta",
    label: "“Yeni bir başlangıç” bölümü",
    hint: "Yatay (4:3) fotoğraf önerilir.",
    aspect: "aspect-4/3",
  },
  {
    key: "school",
    label: "Gebe Okulu",
    hint: "Dikey (4:5) fotoğraf önerilir.",
    aspect: "aspect-4/5",
  },
  {
    key: "location",
    label: "Konum (harita alanı)",
    hint: "Hastane binası fotoğrafı. Üzerinde “Haritayı Göster” katmanı yer alır.",
    aspect: "aspect-8/7",
  },
];

export default function ImagesEditor({
  initial,
  defaults,
}: {
  initial: ImagesContent;
  defaults: ImagesContent;
}) {
  return (
    <EditorShell section="images" initial={initial} defaults={defaults}>
      {(value, update) => (
        <>
          {SLOTS.map((slot) => (
            <Panel key={slot.key} title={slot.label}>
              <ImageField
                label="Görsel"
                hint={slot.hint}
                slot={slot.key}
                aspect={slot.aspect}
                src={value[slot.key].src}
                onSrcChange={(src) => update((draft) => void (draft[slot.key].src = src))}
                alt={value[slot.key].alt}
                onAltChange={(alt) => update((draft) => void (draft[slot.key].alt = alt))}
              />
            </Panel>
          ))}
        </>
      )}
    </EditorShell>
  );
}
