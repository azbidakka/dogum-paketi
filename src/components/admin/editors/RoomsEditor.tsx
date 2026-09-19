"use client";

import Link from "next/link";
import EditorShell from "@/components/admin/EditorShell";
import { LinesField, ListEditor, Panel, TextField, moveItem } from "@/components/admin/fields";
import type { RoomsContent } from "@/lib/content/schema";

export default function RoomsEditor({
  initial,
  defaults,
}: {
  initial: RoomsContent;
  defaults: RoomsContent;
}) {
  return (
    <EditorShell section="rooms" initial={initial} defaults={defaults}>
      {(value, update) => (
        <>
          <Panel title="Bölüm başlığı" description="Başlığın yeşil bitişi ayrı alana yazılır.">
            <TextField
              label="Başlık"
              value={value.title}
              onChange={(next) => update((draft) => void (draft.title = next))}
              maxLength={200}
            />
            <TextField
              label="Başlık bitişi (yeşil)"
              optional
              value={value.accent}
              onChange={(next) => update((draft) => void (draft.accent = next))}
              maxLength={120}
            />
            <TextField
              label="Açıklama"
              multiline
              rows={4}
              value={value.intro}
              onChange={(next) => update((draft) => void (draft.intro = next))}
              maxLength={800}
            />
          </Panel>

          <Panel
            title="Hastane bilgileri"
            description="Başlığın yanındaki bilgi satırları (ör. “12 yatak · Yenidoğan Yoğun Bakım Ünitesi”). Hiç satır bırakmazsanız bu kutu gizlenir."
          >
            <ListEditor
              items={value.facts}
              itemTitle={(fact, index) =>
                fact.label || fact.value ? `${fact.value} · ${fact.label}` : `Satır ${index + 1}`
              }
              onAdd={() => update((draft) => void draft.facts.push({ value: "", label: "" }))}
              onRemove={(index) => update((draft) => void draft.facts.splice(index, 1))}
              onMove={(index, direction) => update((draft) => moveItem(draft.facts, index, direction))}
              maxItems={6}
              addLabel="Bilgi satırı ekle"
              renderItem={(fact, index) => (
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField
                    label="Değer"
                    placeholder="ör. 12 yatak"
                    value={fact.value}
                    onChange={(next) => update((draft) => void (draft.facts[index]!.value = next))}
                    maxLength={40}
                  />
                  <TextField
                    label="Açıklama"
                    placeholder="ör. Yenidoğan Yoğun Bakım Ünitesi"
                    value={fact.label}
                    onChange={(next) => update((draft) => void (draft.facts[index]!.label = next))}
                    maxLength={80}
                  />
                </div>
              )}
            />
          </Panel>

          <Panel
            title="Doğum sonrası kalınan odalar"
            description="Galerinin yanındaki oda metni ve donanım listesi. Sonundaki “Kaynak: Yatan Hasta Rehberi” bağlantısı otomatik eklenir."
          >
            <TextField
              label="Başlık"
              value={value.roomsTitle}
              onChange={(next) => update((draft) => void (draft.roomsTitle = next))}
              maxLength={120}
            />
            <TextField
              label="Açıklama"
              multiline
              rows={3}
              value={value.roomsIntro}
              onChange={(next) => update((draft) => void (draft.roomsIntro = next))}
              maxLength={600}
            />
            <LinesField
              label="Oda donanımı"
              hint="Her satıra bir madde yazın; sitede yeşil onay işaretiyle listelenir."
              rows={7}
              value={value.features}
              onChange={(next) => update((draft) => void (draft.features = next))}
            />
            <TextField
              label="Alt not"
              optional
              multiline
              rows={3}
              value={value.roomsNote}
              onChange={(next) => update((draft) => void (draft.roomsNote = next))}
              maxLength={600}
            />
          </Panel>

          <p className="text-[0.875rem] text-muted">
            Oda ve hastane fotoğrafları için:{" "}
            <Link href="/admin/gorseller" className="font-medium text-green-800 underline underline-offset-4">
              Görseller › Odalar &amp; Hastane galerisi
            </Link>
          </p>
        </>
      )}
    </EditorShell>
  );
}
