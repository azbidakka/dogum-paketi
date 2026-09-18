"use client";

import EditorShell from "@/components/admin/EditorShell";
import { ListEditor, Panel, TextField, moveItem } from "@/components/admin/fields";
import type { FaqContent } from "@/lib/content/schema";

/** İki alanı da boş bırakılan bağlantıyı kaldırır. */
function normalize(value: FaqContent): FaqContent {
  for (const group of value.groups) {
    for (const item of group.items) {
      if (item.link && !item.link.href.trim() && !item.link.label.trim()) delete item.link;
    }
  }
  return value;
}

export default function FaqEditor({ initial, defaults }: { initial: FaqContent; defaults: FaqContent }) {
  return (
    <EditorShell section="faq" initial={initial} defaults={defaults} normalize={normalize}>
      {(value, update) => (
        <Panel
          title="Soru grupları"
          description="Gruplar sayfada soldaki başlık listesinde, sorular her grubun altında görünür. Sıralamayı oklarla değiştirebilirsiniz."
        >
          <ListEditor
            items={value.groups}
            itemTitle={(group) => `${group.title || "Yeni grup"} · ${group.items.length} soru`}
            onAdd={() =>
              update(
                (draft) =>
                  void draft.groups.push({
                    id: `grup-${Date.now().toString(36)}`,
                    title: "",
                    items: [{ q: "", a: "" }],
                  })
              )
            }
            onRemove={(g) => update((draft) => void draft.groups.splice(g, 1))}
            onMove={(g, direction) => update((draft) => moveItem(draft.groups, g, direction))}
            minItems={1}
            maxItems={10}
            addLabel="Soru grubu ekle"
            renderItem={(group, g) => (
              <>
                <TextField
                  label="Grup başlığı"
                  value={group.title}
                  onChange={(next) => update((draft) => void (draft.groups[g]!.title = next))}
                  maxLength={60}
                />

                <ListEditor
                  items={group.items}
                  itemTitle={(item, i) => item.q || `Soru ${i + 1}`}
                  onAdd={() => update((draft) => void draft.groups[g]!.items.push({ q: "", a: "" }))}
                  onRemove={(i) => update((draft) => void draft.groups[g]!.items.splice(i, 1))}
                  onMove={(i, direction) => update((draft) => moveItem(draft.groups[g]!.items, i, direction))}
                  minItems={1}
                  maxItems={40}
                  addLabel="Soru ekle"
                  renderItem={(item, i) => (
                    <>
                      <TextField
                        label="Soru"
                        value={item.q}
                        onChange={(next) => update((draft) => void (draft.groups[g]!.items[i]!.q = next))}
                        maxLength={240}
                      />
                      <TextField
                        label="Yanıt"
                        multiline
                        rows={5}
                        value={item.a}
                        onChange={(next) => update((draft) => void (draft.groups[g]!.items[i]!.a = next))}
                        maxLength={2000}
                      />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <TextField
                          label="Bağlantı metni"
                          optional
                          placeholder="ör. Anlaşmalı kurumlar listesi"
                          value={item.link?.label}
                          onChange={(next) =>
                            update((draft) => {
                              const target = draft.groups[g]!.items[i]!;
                              target.link = { href: target.link?.href ?? "", label: next };
                            })
                          }
                          maxLength={80}
                        />
                        <TextField
                          label="Bağlantı adresi"
                          optional
                          type="url"
                          placeholder="https://"
                          value={item.link?.href}
                          onChange={(next) =>
                            update((draft) => {
                              const target = draft.groups[g]!.items[i]!;
                              target.link = { label: target.link?.label ?? "", href: next };
                            })
                          }
                        />
                      </div>
                    </>
                  )}
                />
              </>
            )}
          />
        </Panel>
      )}
    </EditorShell>
  );
}
