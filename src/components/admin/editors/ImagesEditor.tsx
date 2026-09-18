"use client";

import EditorShell from "@/components/admin/EditorShell";
import { ImageField, ListEditor, Panel, TextField, moveItem } from "@/components/admin/fields";
import type { ImagesContent } from "@/lib/content/schema";

type SlotKey = Exclude<keyof ImagesContent, "gallery">;

const SLOTS: { key: SlotKey; label: string; hint: string; aspect: string }[] = [
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

          <Panel
            title="Odalar & Hastane galerisi"
            description="“05 · Odalar & Hastane” bölümündeki oda ve hastane fotoğrafları. İlk görsel büyük, diğerleri altında üçlü ızgarada gösterilir; sırayı oklarla değiştirebilirsiniz."
          >
            <ListEditor
              items={value.gallery}
              itemTitle={(item, index) => item.title || `Görsel ${index + 1}`}
              onAdd={() =>
                update((draft) => void draft.gallery.push({ src: "", title: "", alt: "" }))
              }
              onRemove={(index) => update((draft) => void draft.gallery.splice(index, 1))}
              onMove={(index, direction) =>
                update((draft) => moveItem(draft.gallery, index, direction))
              }
              minItems={1}
              maxItems={12}
              addLabel="Galeriye görsel ekle"
              renderItem={(item, index) => (
                <>
                  <ImageField
                    label={index === 0 ? "Görsel (büyük gösterilir)" : "Görsel"}
                    hint="Yatay (4:3) fotoğraf önerilir."
                    slot="galeri"
                    src={item.src || undefined}
                    onSrcChange={(src) => update((draft) => void (draft.gallery[index]!.src = src))}
                    alt={item.alt}
                    onAltChange={(alt) => update((draft) => void (draft.gallery[index]!.alt = alt))}
                  />
                  <TextField
                    label="Başlık"
                    hint="Görselin altında yazan kısa ad, örn. “Hasta odası”."
                    value={item.title}
                    onChange={(title) => update((draft) => void (draft.gallery[index]!.title = title))}
                    maxLength={60}
                  />
                </>
              )}
            />
          </Panel>
        </>
      )}
    </EditorShell>
  );
}
