"use client";

import EditorShell from "@/components/admin/EditorShell";
import { ImageField, LinesField, ListEditor, Panel, TextField, moveItem } from "@/components/admin/fields";
import type { DoctorsContent } from "@/lib/content/schema";

export default function DoctorsEditor({
  initial,
  defaults,
}: {
  initial: DoctorsContent;
  defaults: DoctorsContent;
}) {
  return (
    <EditorShell section="doctors" initial={initial} defaults={defaults}>
      {(value, update) => (
        <Panel
          title="Hekim kartları"
          description="“04 · Hekimlerimiz” bölümündeki kartlar. Bilgilerin tusahastanesi.com’daki resmi profille uyumlu olmasına dikkat edin."
        >
          <ListEditor
            items={value.items}
            itemTitle={(doctor, index) => doctor.displayName || `Hekim ${index + 1}`}
            onAdd={() =>
              update(
                (draft) =>
                  void draft.items.push({
                    name: "",
                    displayName: "",
                    title: "Op. Dr.",
                    department: "Kadın Hastalıkları ve Doğum",
                    image: undefined,
                    profileUrl: "https://tusahastanesi.com/doktor/",
                    summary: "",
                    interests: [],
                  })
              )
            }
            onRemove={(index) => update((draft) => void draft.items.splice(index, 1))}
            onMove={(index, direction) => update((draft) => moveItem(draft.items, index, direction))}
            minItems={1}
            maxItems={8}
            addLabel="Hekim ekle"
            renderItem={(doctor, index) => (
              <>
                <ImageField
                  label="Fotoğraf"
                  hint="Dikey portre önerilir; yüz üst kısımda kalacak şekilde kırpılır."
                  slot="hekim"
                  aspect="aspect-4/5"
                  src={doctor.image}
                  onSrcChange={(src) => update((draft) => void (draft.items[index]!.image = src))}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField
                    label="Görünen ad"
                    hint="Kartta yazan ad (ör. Op. Dr. Melis Koca)."
                    value={doctor.displayName}
                    onChange={(next) => update((draft) => void (draft.items[index]!.displayName = next))}
                    maxLength={80}
                  />
                  <TextField
                    label="Resmi yazım"
                    hint="Profildeki yazım (ör. Melis KOCA)."
                    value={doctor.name}
                    onChange={(next) => update((draft) => void (draft.items[index]!.name = next))}
                    maxLength={80}
                  />
                  <TextField
                    label="Ünvan"
                    value={doctor.title}
                    onChange={(next) => update((draft) => void (draft.items[index]!.title = next))}
                    maxLength={30}
                  />
                  <TextField
                    label="Branş"
                    value={doctor.department}
                    onChange={(next) => update((draft) => void (draft.items[index]!.department = next))}
                    maxLength={80}
                  />
                </div>
                <TextField
                  label="Resmi profil adresi"
                  type="url"
                  value={doctor.profileUrl}
                  onChange={(next) => update((draft) => void (draft.items[index]!.profileUrl = next))}
                />
                <TextField
                  label="Kısa açıklama"
                  multiline
                  rows={3}
                  value={doctor.summary}
                  onChange={(next) => update((draft) => void (draft.items[index]!.summary = next))}
                  maxLength={600}
                />
                <LinesField
                  label="İlgi alanları"
                  hint="Her satıra bir ilgi alanı; kartta etiket olarak görünür."
                  value={doctor.interests}
                  onChange={(interests) => update((draft) => void (draft.items[index]!.interests = interests))}
                />
              </>
            )}
          />
        </Panel>
      )}
    </EditorShell>
  );
}
