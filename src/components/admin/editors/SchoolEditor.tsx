"use client";

import EditorShell from "@/components/admin/EditorShell";
import { ListEditor, Panel, TextField, moveItem } from "@/components/admin/fields";
import type { SchoolContent } from "@/lib/content/schema";

export default function SchoolEditor({
  initial,
  defaults,
}: {
  initial: SchoolContent;
  defaults: SchoolContent;
}) {
  return (
    <EditorShell section="school" initial={initial} defaults={defaults}>
      {(value, update) => (
        <>
          <Panel
            title="Açıklama"
            description="Program dönemsel olduğu için sabit tarih yazmamanız ve güncel bilgi için iletişime yönlendirmeniz önerilir."
          >
            <TextField
              label="Metin"
              multiline
              rows={5}
              value={value.intro}
              onChange={(next) => update((draft) => void (draft.intro = next))}
              maxLength={800}
            />
          </Panel>

          <Panel title="Program başlıkları" description="Başlık ve bu başlığı sunan meslek grubu.">
            <ListEditor
              items={value.topics}
              itemTitle={(topic, index) => topic.title || `Başlık ${index + 1}`}
              onAdd={() => update((draft) => void draft.topics.push({ title: "", by: "" }))}
              onRemove={(index) => update((draft) => void draft.topics.splice(index, 1))}
              onMove={(index, direction) => update((draft) => moveItem(draft.topics, index, direction))}
              maxItems={10}
              addLabel="Başlık ekle"
              renderItem={(topic, index) => (
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField
                    label="Başlık"
                    value={topic.title}
                    onChange={(next) => update((draft) => void (draft.topics[index]!.title = next))}
                    maxLength={120}
                  />
                  <TextField
                    label="Sunan"
                    placeholder="ör. Eğitim Hemşiresi"
                    value={topic.by}
                    onChange={(next) => update((draft) => void (draft.topics[index]!.by = next))}
                    maxLength={120}
                  />
                </div>
              )}
            />
          </Panel>
        </>
      )}
    </EditorShell>
  );
}
