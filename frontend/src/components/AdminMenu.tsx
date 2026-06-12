"use client";

import { type FormEvent, type ReactNode, useEffect, useMemo, useState } from "react";
import { ImageIcon, Loader2, Plus, Trash2, Upload } from "lucide-react";
import { api } from "@/lib/api";
import type { Category, Product } from "@/types";

type Fields = {
  name: string;
  price: string; // kept as string for controlled inputs
  description: string;
  image: string;
  isAvailable: boolean;
  isFeatured: boolean;
  isTodaySpecial: boolean;
};

const EMPTY: Fields & { categoryId: string } = {
  name: "",
  price: "",
  description: "",
  image: "",
  isAvailable: true,
  isFeatured: false,
  isTodaySpecial: false,
  categoryId: ""
};

const inputCls =
  "w-full rounded-md border border-cocoa/15 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-berry/40";

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

function toFields(p: Product): Fields {
  return {
    name: p.name,
    price: String(p.price),
    description: p.description,
    image: p.image,
    isAvailable: p.isAvailable,
    isFeatured: p.isFeatured,
    isTodaySpecial: p.isTodaySpecial
  };
}

function validate(f: Pick<Fields, "name" | "price" | "description" | "image">): string | null {
  if (f.name.trim().length < 2) return "Name must be at least 2 characters.";
  if (f.description.trim().length < 10) return "Description must be at least 10 characters.";
  const price = Number(f.price);
  if (!Number.isFinite(price) || price < 0) return "Enter a valid price (0 or more).";
  if (!f.image.trim()) return "Add a photo — upload one or paste an image link.";
  return null;
}

/** Reads an image file and compresses it to a small JPEG data URL (no server storage needed). */
async function fileToDataUrl(file: File): Promise<string> {
  const raw = await new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(new Error("read failed"));
    r.readAsDataURL(file);
  });
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new window.Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error("decode failed"));
    i.src = raw;
  });
  const maxDim = 1000;
  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return raw;
  ctx.drawImage(img, 0, 0, w, h);
  let quality = 0.8;
  let out = canvas.toDataURL("image/jpeg", quality);
  while (out.length > 800_000 && quality > 0.4) {
    quality -= 0.15;
    out = canvas.toDataURL("image/jpeg", quality);
  }
  return out;
}

export function AdminMenu({ token }: { token: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Fields>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [creating, setCreating] = useState(false);
  const [uploadingNew, setUploadingNew] = useState(false);

  const [savingId, setSavingId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([api.getProducts(), api.getCategories()])
      .then(([p, c]) => {
        if (!active) return;
        setProducts(p.products);
        setCategories(c.categories);
        setDrafts(Object.fromEntries(p.products.map((pr) => [pr.id, toFields(pr)])));
        setForm((f) => (f.categoryId ? f : { ...f, categoryId: c.categories[0]?.id ?? "" }));
      })
      .catch(() => active && setError("Could not load the menu. Check your connection and try again."))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const grouped = useMemo(() => {
    const byCat = categories.map((c) => ({ category: c, items: products.filter((p) => p.category?.id === c.id) }));
    const known = new Set(categories.map((c) => c.id));
    const orphans = products.filter((p) => !p.category || !known.has(p.category.id));
    return { byCat, orphans };
  }, [categories, products]);

  const setDraft = (id: string, patch: Partial<Fields>) =>
    setDrafts((cur) => ({ ...cur, [id]: { ...cur[id], ...patch } }));

  const isDirty = (p: Product) => {
    const d = drafts[p.id];
    if (!d) return false;
    const o = toFields(p);
    return (Object.keys(o) as (keyof Fields)[]).some((k) => d[k] !== o[k]);
  };

  async function onNewUpload(file?: File) {
    if (!file) return;
    setUploadingNew(true);
    setError(null);
    try {
      setForm((f) => ({ ...f, image: "" })); // clear stale preview while processing
      const dataUrl = await fileToDataUrl(file);
      setForm((f) => ({ ...f, image: dataUrl }));
    } catch {
      setError("Could not process that image. Try a different photo.");
    } finally {
      setUploadingNew(false);
    }
  }

  async function onRowUpload(id: string, file?: File) {
    if (!file) return;
    setUploadingId(id);
    setError(null);
    try {
      const dataUrl = await fileToDataUrl(file);
      setDraft(id, { image: dataUrl });
    } catch {
      setError("Could not process that image. Try a different photo.");
    } finally {
      setUploadingId(null);
    }
  }

  async function createItem(e: FormEvent) {
    e.preventDefault();
    const err = validate(form);
    if (err) return setError(err);
    if (!form.categoryId) return setError("Choose a category.");
    setCreating(true);
    setError(null);
    setNotice(null);
    try {
      const { product } = await api.adminCreateProduct(token, {
        name: form.name.trim(),
        slug: slugify(form.name) || `item-${Date.now()}`,
        description: form.description.trim(),
        categoryId: form.categoryId,
        price: Number(form.price),
        image: form.image.trim(),
        isAvailable: form.isAvailable,
        isFeatured: form.isFeatured,
        isTodaySpecial: form.isTodaySpecial
      });
      setProducts((cur) => [product, ...cur]);
      setDrafts((cur) => ({ ...cur, [product.id]: toFields(product) }));
      setForm({ ...EMPTY, categoryId: form.categoryId });
      setShowCreate(false);
      setNotice(`Added “${product.name}” to the menu.`);
    } catch (err2) {
      const msg = err2 instanceof Error ? err2.message : "Could not add item.";
      setError(/unique|exists|slug|p2002/i.test(msg) ? "An item with a similar name already exists — tweak the name slightly." : msg);
    } finally {
      setCreating(false);
    }
  }

  async function saveItem(p: Product) {
    const d = drafts[p.id];
    const err = validate(d);
    if (err) return setError(err);
    setSavingId(p.id);
    setError(null);
    setNotice(null);
    try {
      const { product } = await api.adminUpdateProduct(token, p.id, {
        name: d.name.trim(),
        price: Number(d.price),
        description: d.description.trim(),
        image: d.image.trim(),
        isAvailable: d.isAvailable,
        isFeatured: d.isFeatured,
        isTodaySpecial: d.isTodaySpecial
      });
      setProducts((cur) => cur.map((x) => (x.id === p.id ? product : x)));
      setDrafts((cur) => ({ ...cur, [p.id]: toFields(product) }));
      setNotice(`Saved changes to “${product.name}”.`);
    } catch (err2) {
      setError(err2 instanceof Error ? err2.message : "Could not save changes.");
    } finally {
      setSavingId(null);
    }
  }

  async function deleteItem(p: Product) {
    if (!confirm(`Delete “${p.name}” from the menu? This cannot be undone.`)) return;
    setSavingId(p.id);
    setError(null);
    setNotice(null);
    try {
      await api.adminDeleteProduct(token, p.id);
      setProducts((cur) => cur.filter((x) => x.id !== p.id));
      setNotice(`Deleted “${p.name}”.`);
    } catch (err2) {
      setError(err2 instanceof Error ? err2.message : "Could not delete this item.");
    } finally {
      setSavingId(null);
    }
  }

  if (loading) {
    return (
      <div className="mt-4 flex items-center gap-2 rounded-lg bg-white p-8 text-cocoa/60">
        <Loader2 className="animate-spin" size={18} /> Loading menu…
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-lg bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold">Menu Items</h2>
          <p className="text-sm text-cocoa/55">{products.length} items · add new items, change prices and update photos.</p>
        </div>
        <button
          onClick={() => { setShowCreate((v) => !v); setError(null); }}
          className="inline-flex items-center gap-2 rounded-md bg-berry px-4 py-2 text-sm font-semibold text-white hover:bg-berry/90"
        >
          <Plus size={18} /> {showCreate ? "Close" : "Add Item"}
        </button>
      </div>

      {error && <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {notice && <p className="mt-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{notice}</p>}

      {/* Create form */}
      {showCreate && (
        <form onSubmit={createItem} className="mt-5 grid gap-4 rounded-xl border border-cocoa/10 bg-cream/40 p-4 md:grid-cols-[200px_1fr]">
          <ImagePicker
            value={form.image}
            uploading={uploadingNew}
            onUpload={(file) => onNewUpload(file)}
            onUrl={(url) => setForm((f) => ({ ...f, image: url }))}
          />
          <div className="grid gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Labeled label="Item name">
                <input className={inputCls} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Red Velvet Cupcakes" />
              </Labeled>
              <Labeled label="Category">
                <select className={inputCls} value={form.categoryId} onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </Labeled>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Labeled label="Price (Kwacha)">
                <input type="number" min={0} step="0.01" className={inputCls} value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} placeholder="0.00" />
              </Labeled>
            </div>
            <Labeled label="Description" hint="at least 10 characters">
              <textarea rows={2} className={inputCls} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Short, appetising description shown to customers." />
            </Labeled>
            <div className="flex flex-wrap items-center gap-2">
              <Toggle label="Available" checked={form.isAvailable} onChange={(v) => setForm((f) => ({ ...f, isAvailable: v }))} />
              <Toggle label="Featured" checked={form.isFeatured} onChange={(v) => setForm((f) => ({ ...f, isFeatured: v }))} />
              <Toggle label="Today's Special" checked={form.isTodaySpecial} onChange={(v) => setForm((f) => ({ ...f, isTodaySpecial: v }))} />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowCreate(false)} className="rounded-md border border-cocoa/20 px-4 py-2 text-sm font-semibold hover:bg-cream">Cancel</button>
              <button type="submit" disabled={creating || uploadingNew} className="inline-flex items-center gap-2 rounded-md bg-berry px-4 py-2 text-sm font-semibold text-white hover:bg-berry/90 disabled:opacity-50">
                {creating ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />} Add to Menu
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Existing items grouped by category */}
      <div className="mt-6 grid gap-6">
        {grouped.byCat.map(({ category, items }) => (
          <section key={category.id}>
            <h3 className="mb-3 font-display text-lg font-bold text-cocoa/80">{category.name} <span className="text-sm font-normal text-cocoa/40">({items.length})</span></h3>
            {items.length === 0 ? (
              <p className="text-sm text-cocoa/40">No items in this category yet.</p>
            ) : (
              <div className="grid gap-3">
                {items.map((p) => (
                  <ProductRow
                    key={p.id}
                    draft={drafts[p.id]}
                    dirty={isDirty(p)}
                    saving={savingId === p.id}
                    uploading={uploadingId === p.id}
                    onField={(patch) => setDraft(p.id, patch)}
                    onUpload={(file) => onRowUpload(p.id, file)}
                    onSave={() => saveItem(p)}
                    onDelete={() => deleteItem(p)}
                  />
                ))}
              </div>
            )}
          </section>
        ))}
        {grouped.orphans.length > 0 && (
          <section>
            <h3 className="mb-3 font-display text-lg font-bold text-cocoa/80">Other</h3>
            <div className="grid gap-3">
              {grouped.orphans.map((p) => (
                <ProductRow
                  key={p.id}
                  draft={drafts[p.id]}
                  dirty={isDirty(p)}
                  saving={savingId === p.id}
                  uploading={uploadingId === p.id}
                  onField={(patch) => setDraft(p.id, patch)}
                  onUpload={(file) => onRowUpload(p.id, file)}
                  onSave={() => saveItem(p)}
                  onDelete={() => deleteItem(p)}
                />
              ))}
            </div>
          </section>
        )}
        {!products.length && <p className="py-6 text-center text-cocoa/40">No menu items yet. Click “Add Item” to create your first one.</p>}
      </div>
    </div>
  );
}

function ProductRow({
  draft, dirty, saving, uploading, onField, onUpload, onSave, onDelete
}: {
  draft?: Fields;
  dirty: boolean;
  saving: boolean;
  uploading: boolean;
  onField: (patch: Partial<Fields>) => void;
  onUpload: (file?: File) => void;
  onSave: () => void;
  onDelete: () => void;
}) {
  if (!draft) return null;
  return (
    <div className="grid gap-4 rounded-xl border border-cocoa/10 p-4 md:grid-cols-[160px_1fr]">
      <ImagePicker value={draft.image} uploading={uploading} onUpload={onUpload} onUrl={(url) => onField({ image: url })} compact />
      <div className="grid gap-3">
        <input className={inputCls + " font-semibold"} value={draft.name} onChange={(e) => onField({ name: e.target.value })} placeholder="Item name" />
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-cocoa/70">
            Price
            <span className="flex items-center rounded-md border border-cocoa/15 bg-white pl-2 focus-within:ring-2 focus-within:ring-berry/40">
              <span className="text-cocoa/50 text-sm">K</span>
              <input type="number" min={0} step="0.01" className="w-28 bg-transparent px-1 py-2 text-sm focus:outline-none" value={draft.price} onChange={(e) => onField({ price: e.target.value })} />
            </span>
          </label>
          <Toggle label="Available" checked={draft.isAvailable} onChange={(v) => onField({ isAvailable: v })} />
          <Toggle label="Featured" checked={draft.isFeatured} onChange={(v) => onField({ isFeatured: v })} />
          <Toggle label="Today's Special" checked={draft.isTodaySpecial} onChange={(v) => onField({ isTodaySpecial: v })} />
        </div>
        <textarea rows={2} className={inputCls} value={draft.description} onChange={(e) => onField({ description: e.target.value })} placeholder="Description" />
        <div className="flex items-center justify-end gap-2">
          <button onClick={onDelete} disabled={saving} className="inline-flex items-center gap-1.5 rounded-md border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50">
            <Trash2 size={14} /> Delete
          </button>
          <button onClick={onSave} disabled={!dirty || saving || uploading} className="inline-flex items-center gap-1.5 rounded-md bg-cocoa px-4 py-1.5 text-xs font-semibold text-white hover:bg-cocoa/90 disabled:opacity-40">
            {saving ? <Loader2 className="animate-spin" size={14} /> : null}
            {dirty ? "Save changes" : "Saved"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ImagePicker({
  value, uploading, onUpload, onUrl, compact
}: {
  value: string;
  uploading: boolean;
  onUpload: (file?: File) => void;
  onUrl: (url: string) => void;
  compact?: boolean;
}) {
  return (
    <div className="grid gap-2">
      <div className={`relative overflow-hidden rounded-lg border border-cocoa/10 bg-cream ${compact ? "aspect-square" : "aspect-[4/3]"}`}>
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="Preview" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-cocoa/35">
            <ImageIcon size={26} />
            <span className="text-xs">No photo</span>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 text-cocoa">
            <Loader2 className="animate-spin" size={20} />
          </div>
        )}
      </div>
      <label className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md border border-cocoa/20 px-3 py-1.5 text-xs font-semibold text-cocoa hover:bg-cream">
        <Upload size={14} /> {uploading ? "Processing…" : "Upload photo"}
        <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(e) => onUpload(e.target.files?.[0])} />
      </label>
      <input
        className="w-full rounded-md border border-cocoa/15 bg-white px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-berry/40"
        value={value.startsWith("data:") ? "" : value}
        placeholder="or paste image link"
        onChange={(e) => onUrl(e.target.value)}
      />
    </div>
  );
}

function Labeled({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="font-semibold text-cocoa/70">{label}{hint && <span className="ml-1 font-normal text-cocoa/40">· {hint}</span>}</span>
      {children}
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
        checked ? "bg-cocoa text-white" : "border border-cocoa/20 text-cocoa/60 hover:bg-cream"
      }`}
    >
      {label}
    </button>
  );
}
