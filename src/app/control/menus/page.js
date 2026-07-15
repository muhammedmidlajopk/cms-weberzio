"use client";

import { useState, useEffect } from "react";
import { ArrowUp, ArrowDown, Trash2, Plus, Save } from "lucide-react";
import { adminFetch } from "@/lib/admin-fetch";
import styles from "./page.module.css";

const LOCATIONS = [
  { key: "header", label: "Header Menu", hint: "Shown in the top navigation" },
  { key: "footer", label: "Footer Menu", hint: "Shown in the footer" },
];

export default function MenusPage() {
  const [menus, setMenus] = useState({ header: [], footer: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "success" });

  useEffect(() => {
    fetch("/api/menus")
      .then((r) => r.json())
      .then((data) => {
        setMenus({
          header: data.menus?.header || [],
          footer: data.menus?.footer || [],
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function updateItem(loc, idx, field, value) {
    setMenus((m) => ({
      ...m,
      [loc]: m[loc].map((it, i) => (i === idx ? { ...it, [field]: value } : it)),
    }));
  }

  function addItem(loc) {
    setMenus((m) => ({
      ...m,
      [loc]: [...m[loc], { label: "New link", href: "/", id: `tmp-${Date.now()}` }],
    }));
  }

  function removeItem(loc, idx) {
    setMenus((m) => ({ ...m, [loc]: m[loc].filter((_, i) => i !== idx) }));
  }

  function moveItem(loc, idx, dir) {
    setMenus((m) => {
      const arr = [...m[loc]];
      const target = idx + dir;
      if (target < 0 || target >= arr.length) return m;
      [arr[idx], arr[target]] = [arr[target], arr[idx]];
      return { ...m, [loc]: arr };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await adminFetch("/api/menus", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ menus }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Save failed");
      setToast({ msg: "Saved", type: "success" });
    } catch (err) {
      setToast({ msg: err.message || "Save failed", type: "error" });
    } finally {
      setSaving(false);
      setTimeout(() => setToast({ msg: "", type: "success" }), 2500);
    }
  }

  if (loading) return <div className={styles.loading}>Loading…</div>;

  return (
    <form onSubmit={handleSubmit} className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Navigation Menus</h1>
          <p className={styles.subtitle}>Edit the links that appear in your header and footer.</p>
        </div>
        <div className={styles.actions}>
          {toast.msg && (
            <span className={`${styles.toast} ${toast.type === "error" ? styles.toastError : styles.toastOk}`}>
              {toast.msg}
            </span>
          )}
          <button type="submit" disabled={saving} className={styles.primaryBtn}>
            <Save size={14} strokeWidth={2} />
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>

      {LOCATIONS.map((loc) => (
        <section key={loc.key} className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>{loc.label}</h2>
              <p>{loc.hint}</p>
            </div>
            <button
              type="button"
              className={styles.addBtn}
              onClick={() => addItem(loc.key)}
            >
              <Plus size={13} strokeWidth={2} /> Add link
            </button>
          </div>

          {menus[loc.key].length === 0 ? (
            <div className={styles.empty}>No items. Click &ldquo;Add link&rdquo; to create one.</div>
          ) : (
            <div className={styles.list}>
              <div className={styles.listHead}>
                <span>Order</span>
                <span>Label</span>
                <span>URL / Anchor</span>
                <span></span>
              </div>
              {menus[loc.key].map((item, idx) => (
                <div key={item.id || idx} className={styles.row}>
                  <div className={styles.orderBtns}>
                    <button
                      type="button"
                      onClick={() => moveItem(loc.key, idx, -1)}
                      disabled={idx === 0}
                      aria-label="Move up"
                    >
                      <ArrowUp size={13} strokeWidth={1.75} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItem(loc.key, idx, 1)}
                      disabled={idx === menus[loc.key].length - 1}
                      aria-label="Move down"
                    >
                      <ArrowDown size={13} strokeWidth={1.75} />
                    </button>
                  </div>
                  <input
                    className={styles.input}
                    value={item.label}
                    onChange={(e) => updateItem(loc.key, idx, "label", e.target.value)}
                    placeholder="Label"
                  />
                  <input
                    className={styles.input}
                    value={item.href}
                    onChange={(e) => updateItem(loc.key, idx, "href", e.target.value)}
                    placeholder="/ or #services or https://…"
                  />
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => removeItem(loc.key, idx)}
                    aria-label="Remove"
                    title="Remove"
                  >
                    <Trash2 size={14} strokeWidth={1.75} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      ))}
    </form>
  );
}
