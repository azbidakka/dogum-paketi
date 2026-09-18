"use client";

import EditorShell from "@/components/admin/EditorShell";
import {
  LinesField,
  ListEditor,
  NumberField,
  Panel,
  TextField,
  moveItem,
} from "@/components/admin/fields";
import type { PackageContent } from "@/lib/content/schema";

const DEFAULT_ITEM = "Kadın hastalıkları ve doğum muayenesi, ultrason eşliğinde";

/** Adet 2'den küçükse rozet gösterilmez; boş laboratuvar listesi kaldırılır. */
function normalize(value: PackageContent): PackageContent {
  for (const trimester of value.trimesters) {
    for (const visit of trimester.visits) {
      for (const item of visit.items) {
        if (!item.count || item.count < 2) delete item.count;
      }
      if (visit.labs && visit.labs.length === 0) delete visit.labs;
    }
  }
  return value;
}

export default function PackageEditor({
  initial,
  defaults,
}: {
  initial: PackageContent;
  defaults: PackageContent;
}) {
  return (
    <EditorShell section="package" initial={initial} defaults={defaults} normalize={normalize}>
      {(value, update) => (
        <>
          <Panel title="Bölüm başlığı" description="“01 · Doğum Paketi” bölümünün başlığı ve giriş metni.">
            <TextField
              label="Başlık"
              value={value.title}
              onChange={(next) => update((draft) => void (draft.title = next))}
              maxLength={200}
            />
            <TextField
              label="Başlık bitişi"
              optional
              hint="Yeşil ve Merriweather italik gösterilen kısım."
              value={value.accent}
              onChange={(next) => update((draft) => void (draft.accent = next))}
              maxLength={120}
            />
            <TextField
              label="Giriş metni"
              multiline
              rows={4}
              value={value.intro}
              onChange={(next) => update((draft) => void (draft.intro = next))}
              maxLength={800}
            />
          </Panel>

          {value.trimesters.map((trimester, t) => (
            <Panel
              key={trimester.id}
              title={`${trimester.label} · ${trimester.weeks}`}
              description="Sekme başlığı, açıklama ve bu dönemdeki kontrol haftaları."
            >
              <div className="grid gap-4 sm:grid-cols-3">
                <TextField
                  label="Sekme adı"
                  value={trimester.label}
                  onChange={(next) => update((draft) => void (draft.trimesters[t]!.label = next))}
                  maxLength={40}
                />
                <TextField
                  label="Hafta aralığı"
                  value={trimester.weeks}
                  onChange={(next) => update((draft) => void (draft.trimesters[t]!.weeks = next))}
                  maxLength={40}
                />
                <TextField
                  label="Dönem başlığı"
                  value={trimester.title}
                  onChange={(next) => update((draft) => void (draft.trimesters[t]!.title = next))}
                  maxLength={80}
                />
              </div>
              <TextField
                label="Dönem açıklaması"
                multiline
                rows={2}
                value={trimester.intro}
                onChange={(next) => update((draft) => void (draft.trimesters[t]!.intro = next))}
                maxLength={400}
              />

              <ListEditor
                items={trimester.visits}
                itemTitle={(visit) =>
                  [visit.week, visit.month].filter(Boolean).join(" · ") || "Yeni kontrol"
                }
                onAdd={() =>
                  update(
                    (draft) =>
                      void draft.trimesters[t]!.visits.push({
                        week: "",
                        month: "",
                        items: [{ name: DEFAULT_ITEM }],
                      })
                  )
                }
                onRemove={(v) => update((draft) => void draft.trimesters[t]!.visits.splice(v, 1))}
                onMove={(v, direction) =>
                  update((draft) => moveItem(draft.trimesters[t]!.visits, v, direction))
                }
                minItems={1}
                addLabel="Kontrol haftası ekle"
                renderItem={(visit, v) => (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <TextField
                        label="Hafta"
                        placeholder="ör. 24. hafta"
                        value={visit.week}
                        onChange={(next) =>
                          update((draft) => void (draft.trimesters[t]!.visits[v]!.week = next))
                        }
                        maxLength={40}
                      />
                      <TextField
                        label="Ay"
                        optional
                        placeholder="ör. 6. ay"
                        value={visit.month}
                        onChange={(next) =>
                          update((draft) => void (draft.trimesters[t]!.visits[v]!.month = next))
                        }
                        maxLength={40}
                      />
                    </div>

                    <div className="space-y-3">
                      <p className="text-[0.875rem] font-medium text-ink">Pakete dahil kalemler</p>
                      <ListEditor
                        items={visit.items}
                        itemTitle={(item) =>
                          `${item.name || "Yeni kalem"}${item.count && item.count > 1 ? ` · ${item.count} kez` : ""}`
                        }
                        onAdd={() =>
                          update((draft) => void draft.trimesters[t]!.visits[v]!.items.push({ name: "" }))
                        }
                        onRemove={(i) =>
                          update((draft) => void draft.trimesters[t]!.visits[v]!.items.splice(i, 1))
                        }
                        onMove={(i, direction) =>
                          update((draft) => moveItem(draft.trimesters[t]!.visits[v]!.items, i, direction))
                        }
                        minItems={1}
                        addLabel="Kalem ekle"
                        renderItem={(item, i) => (
                          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_10rem]">
                            <TextField
                              label="Kalem"
                              value={item.name}
                              onChange={(next) =>
                                update(
                                  (draft) => void (draft.trimesters[t]!.visits[v]!.items[i]!.name = next)
                                )
                              }
                              maxLength={200}
                            />
                            <NumberField
                              label="Adet"
                              hint="2 ve üzeri ise “kez” rozeti çıkar."
                              min={1}
                              max={10}
                              value={item.count}
                              onChange={(next) =>
                                update(
                                  (draft) => void (draft.trimesters[t]!.visits[v]!.items[i]!.count = next)
                                )
                              }
                            />
                          </div>
                        )}
                      />
                    </div>

                    <div className="space-y-3">
                      <p className="text-[0.875rem] font-medium text-ink">Laboratuvar tetkik grupları</p>
                      <ListEditor
                        items={visit.labs ?? []}
                        itemTitle={(group) => `${group.group || "Yeni grup"} · ${group.tests.length} test`}
                        onAdd={() =>
                          update((draft) => {
                            const target = draft.trimesters[t]!.visits[v]!;
                            (target.labs ??= []).push({ group: "", tests: [] });
                          })
                        }
                        onRemove={(g) =>
                          update((draft) => void draft.trimesters[t]!.visits[v]!.labs?.splice(g, 1))
                        }
                        onMove={(g, direction) =>
                          update((draft) => {
                            const labs = draft.trimesters[t]!.visits[v]!.labs;
                            if (labs) moveItem(labs, g, direction);
                          })
                        }
                        addLabel="Laboratuvar grubu ekle"
                        emptyText="Bu kontrolde laboratuvar grubu yok."
                        renderItem={(group, g) => (
                          <>
                            <TextField
                              label="Grup adı"
                              placeholder="ör. Enfeksiyon taraması"
                              value={group.group}
                              onChange={(next) =>
                                update(
                                  (draft) => void (draft.trimesters[t]!.visits[v]!.labs![g]!.group = next)
                                )
                              }
                              maxLength={80}
                            />
                            <LinesField
                              label="Testler"
                              rows={7}
                              value={group.tests}
                              onChange={(tests) =>
                                update(
                                  (draft) => void (draft.trimesters[t]!.visits[v]!.labs![g]!.tests = tests)
                                )
                              }
                            />
                          </>
                        )}
                      />
                    </div>
                  </>
                )}
              />
            </Panel>
          ))}

          <Panel title="Doğumda pakete dahil olanlar" description="Trimester sekmelerinin altındaki yeşil kart.">
            <ListEditor
              items={value.birth}
              itemTitle={(item, index) => item.title || `Kalem ${index + 1}`}
              onAdd={() => update((draft) => void draft.birth.push({ title: "", text: "" }))}
              onRemove={(index) => update((draft) => void draft.birth.splice(index, 1))}
              onMove={(index, direction) => update((draft) => moveItem(draft.birth, index, direction))}
              minItems={1}
              maxItems={8}
              addLabel="Kalem ekle"
              renderItem={(item, index) => (
                <>
                  <TextField
                    label="Başlık"
                    value={item.title}
                    onChange={(next) => update((draft) => void (draft.birth[index]!.title = next))}
                    maxLength={80}
                  />
                  <TextField
                    label="Açıklama"
                    multiline
                    rows={2}
                    value={item.text}
                    onChange={(next) => update((draft) => void (draft.birth[index]!.text = next))}
                    maxLength={240}
                  />
                </>
              )}
            />
          </Panel>

          <Panel title="Alt not" description="Bölümün en altındaki küçük bilgilendirme metni.">
            <TextField
              label="Not"
              multiline
              rows={3}
              value={value.footnote}
              onChange={(next) => update((draft) => void (draft.footnote = next))}
              maxLength={600}
            />
          </Panel>
        </>
      )}
    </EditorShell>
  );
}
