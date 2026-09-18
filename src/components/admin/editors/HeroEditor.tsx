"use client";

import EditorShell from "@/components/admin/EditorShell";
import { ListEditor, Panel, TextField, moveItem } from "@/components/admin/fields";
import type { HeroContent } from "@/lib/content/schema";

export default function HeroEditor({ initial, defaults }: { initial: HeroContent; defaults: HeroContent }) {
  return (
    <EditorShell section="hero" initial={initial} defaults={defaults}>
      {(value, update) => (
        <>
          <Panel title="Başlık ve giriş metni" description="Sayfanın en üstünde, ilk görünen alan.">
            <TextField
              label="Üst etiket"
              value={value.label}
              onChange={(next) => update((draft) => void (draft.label = next))}
              maxLength={120}
            />
            <TextField
              label="Ana başlık"
              hint="Başlığın Poppins ile yazılan kısmı."
              value={value.title}
              onChange={(next) => update((draft) => void (draft.title = next))}
              maxLength={200}
            />
            <TextField
              label="Başlık bitişi"
              optional
              hint="Başlığın sonunda yeşil ve Merriweather italik gösterilen kısım (ör. “yanınızdayız.”)."
              value={value.accent}
              onChange={(next) => update((draft) => void (draft.accent = next))}
              maxLength={120}
            />
            <TextField
              label="Giriş metni"
              multiline
              rows={5}
              value={value.lead}
              onChange={(next) => update((draft) => void (draft.lead = next))}
              maxLength={800}
            />
            <TextField
              label="Ana düğme metni"
              hint="İletişim formuna götüren yeşil düğme."
              value={value.primaryCta}
              onChange={(next) => update((draft) => void (draft.primaryCta = next))}
              maxLength={60}
            />
          </Panel>

          <Panel title="Öne çıkan maddeler" description="Giriş alanının altındaki üç kısa bilgi kutusu.">
            <ListEditor
              items={value.highlights}
              itemTitle={(item, index) => item.title || `Madde ${index + 1}`}
              onAdd={() => update((draft) => void draft.highlights.push({ title: "", text: "" }))}
              onRemove={(index) => update((draft) => void draft.highlights.splice(index, 1))}
              onMove={(index, direction) => update((draft) => moveItem(draft.highlights, index, direction))}
              minItems={1}
              maxItems={6}
              addLabel="Madde ekle"
              renderItem={(item, index) => (
                <>
                  <TextField
                    label="Başlık"
                    value={item.title}
                    onChange={(next) => update((draft) => void (draft.highlights[index]!.title = next))}
                    maxLength={80}
                  />
                  <TextField
                    label="Açıklama"
                    multiline
                    rows={2}
                    value={item.text}
                    onChange={(next) => update((draft) => void (draft.highlights[index]!.text = next))}
                    maxLength={240}
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
