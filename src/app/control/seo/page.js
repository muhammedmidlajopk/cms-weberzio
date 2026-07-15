"use client";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { adminFetch } from "@/lib/admin-fetch";
import styles from "./page.module.css";

const PAGES = [
  { slug: "home", label: "Home", path: "/" },
  { slug: "products", label: "Products", path: "/products" },
  { slug: "services", label: "Services", path: "/services" },
  { slug: "portfolio", label: "Portfolio", path: "/portfolio" },
];

const EMPTY = { title: "", description: "", keywords: "", ogImage: "" };

export default function SeoPage() {
  const [pages, setPages] = useState({});
  const [active, setActive] = useState("home");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "success" });

  useEffect(() => {
    fetch("/api/seo")
      .then((r) => r.json())
      .then((data) => {
        const merged = {};
        for (const p of PAGES) merged[p.slug] = { ...EMPTY, ...(data.pages?.[p.slug] || {}) };
        setPages(merged);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function update(field, value) {
    setPages((p) => ({
      ...p,
      [active]: { ...(p[active] || EMPTY), [field]: value },
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await adminFetch("/api/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pages }),
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

  const current = pages[active] || EMPTY;
  const activePage = PAGES.find((p) => p.slug === active);

  return (
    <form onSubmit={handleSubmit} className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>SEO Meta</h1>
          <p className={styles.subtitle}>Per-page titles, descriptions, and social images.</p>
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

      <div className={styles.tabs}>
        {PAGES.map((p) => {
          const filled =
            pages[p.slug] &&
            (pages[p.slug].title || pages[p.slug].description);
          return (
            <button
              type="button"
              key={p.slug}
              onClick={() => setActive(p.slug)}
              className={`${styles.tab} ${active === p.slug ? styles.tabActive : ""}`}
            >
              <span className={styles.tabLabel}>{p.label}</span>
              <span className={styles.tabPath}>{p.path}</span>
              {filled && <span className={styles.tabDot} />}
            </button>
          );
        })}
      </div>

      <div className={styles.grid}>
        <div className={styles.editor}>
          <div className={styles.field}>
            <div className={styles.fieldTop}>
              <span className={styles.fieldLabel}>Title</span>
              <span className={styles.fieldHint}>50–60 chars ideal</span>
            </div>
            <input
              className={styles.input}
              value={current.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder={`${activePage.label} — your site`}
              maxLength={80}
            />
            <span className={styles.counter}>{current.title.length} / 60</span>
          </div>

          <div className={styles.field}>
            <div className={styles.fieldTop}>
              <span className={styles.fieldLabel}>Description</span>
              <span className={styles.fieldHint}>120–160 chars ideal</span>
            </div>
            <textarea
              className={styles.textarea}
              value={current.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="A short summary of this page"
              rows={4}
              maxLength={200}
            />
            <span className={styles.counter}>{current.description.length} / 160</span>
          </div>

          <div className={styles.field}>
            <div className={styles.fieldTop}>
              <span className={styles.fieldLabel}>Keywords</span>
              <span className={styles.fieldHint}>Comma-separated</span>
            </div>
            <input
              className={styles.input}
              value={current.keywords}
              onChange={(e) => update("keywords", e.target.value)}
              placeholder="ux, ui, portfolio"
            />
          </div>

          <div className={styles.field}>
            <div className={styles.fieldTop}>
              <span className={styles.fieldLabel}>Open Graph Image URL</span>
              <span className={styles.fieldHint}>1200×630</span>
            </div>
            <input
              className={styles.input}
              value={current.ogImage}
              onChange={(e) => update("ogImage", e.target.value)}
              placeholder="https://example.com/og-image.png"
            />
          </div>
        </div>

        <aside className={styles.preview}>
          <div className={styles.previewHeader}>Google Preview</div>
          <div className={styles.serp}>
            <div className={styles.serpUrl}>yoursite.com{activePage.path}</div>
            <div className={styles.serpTitle}>
              {current.title || `${activePage.label} — your site`}
            </div>
            <div className={styles.serpDesc}>
              {current.description || "Your page description will appear here…"}
            </div>
          </div>

          <div className={styles.previewHeader}>Social card</div>
          <div className={styles.ogCard}>
            <div className={styles.ogImage}>
              {current.ogImage ? (
                <img src={current.ogImage} alt="OG preview" />
              ) : (
                <span>1200 × 630</span>
              )}
            </div>
            <div className={styles.ogText}>
              <div className={styles.ogDomain}>yoursite.com</div>
              <div className={styles.ogTitle}>
                {current.title || activePage.label}
              </div>
              <div className={styles.ogDesc}>
                {current.description || "Add a description to see it here."}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </form>
  );
}
