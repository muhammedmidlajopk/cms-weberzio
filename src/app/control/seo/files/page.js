"use client";

import { useState, useEffect } from "react";
import { Save, RefreshCw, ExternalLink } from "lucide-react";
import { adminFetch } from "@/lib/admin-fetch";
import styles from "./page.module.css";

const TABS = [
  {
    key: "robots",
    label: "robots.txt",
    path: "/robots.txt",
    hint: "Controls search-engine crawler access.",
    lang: "text",
  },
  {
    key: "llms",
    label: "llms.txt",
    path: "/llms.txt",
    hint: "A summary of the site aimed at AI/LLM crawlers.",
    lang: "text",
  },
  {
    key: "sitemap",
    label: "sitemap.xml",
    path: "/sitemap.xml",
    hint: "URL list for search engines. Use Regenerate to auto-build.",
    lang: "xml",
  },
];

export default function SeoFilesPage() {
  const [files, setFiles] = useState({ robots: "", llms: "", sitemap: "" });
  const [active, setActive] = useState("robots");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [origin, setOrigin] = useState("");
  const [toast, setToast] = useState({ msg: "", type: "success" });

  useEffect(() => {
    if (typeof window !== "undefined") setOrigin(window.location.origin);
    fetch("/api/seo-files")
      .then((r) => r.json())
      .then((data) => {
        if (data.files) setFiles(data.files);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type }), 2500);
  }

  function update(key, value) {
    setFiles((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await adminFetch("/api/seo-files", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(files),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setFiles(data.files);
      showToast("Saved");
    } catch (err) {
      showToast(err.message || "Save failed", "error");
    } finally {
      setSaving(false);
    }
  }

  async function regenerateSitemap() {
    setRegenerating(true);
    try {
      const res = await adminFetch("/api/seo-files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "regenerate-sitemap" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Regenerate failed");
      setFiles((f) => ({ ...f, sitemap: data.files.sitemap }));
      setActive("sitemap");
      showToast("Sitemap regenerated");
    } catch (err) {
      showToast(err.message || "Regenerate failed", "error");
    } finally {
      setRegenerating(false);
    }
  }

  if (loading) return <div className={styles.loading}>Loading…</div>;

  const current = TABS.find((t) => t.key === active);

  return (
    <form onSubmit={handleSubmit} className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>SEO Files</h1>
          <p className={styles.subtitle}>
            Edit <code>robots.txt</code>, <code>llms.txt</code>, and{" "}
            <code>sitemap.xml</code> — served dynamically from these values.
          </p>
        </div>
        <div className={styles.actions}>
          {toast.msg && (
            <span
              className={`${styles.toast} ${
                toast.type === "error" ? styles.toastError : styles.toastOk
              }`}
            >
              {toast.msg}
            </span>
          )}
          <button
            type="button"
            className={styles.ghostBtn}
            onClick={regenerateSitemap}
            disabled={regenerating}
          >
            <RefreshCw
              size={13}
              strokeWidth={1.75}
              className={regenerating ? styles.spinning : ""}
            />
            {regenerating ? "Regenerating…" : "Regenerate Sitemap"}
          </button>
          {TABS.map((t) => (
            <a
              key={t.key}
              href={t.path}
              target="_blank"
              rel="noreferrer"
              className={styles.linkBtn}
            >
              {t.label}
              <ExternalLink size={11} strokeWidth={1.75} />
            </a>
          ))}
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.tabs}>
          {TABS.map((t) => (
            <button
              type="button"
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`${styles.tab} ${active === t.key ? styles.tabActive : ""}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className={styles.editorHeader}>
          <span>
            Served at{" "}
            <a href={current.path} target="_blank" rel="noreferrer">
              {origin}
              {current.path}
            </a>
            . {current.hint}
          </span>
        </div>

        <textarea
          className={styles.textarea}
          value={files[active] || ""}
          onChange={(e) => update(active, e.target.value)}
          spellCheck={false}
          rows={22}
        />
      </div>

      <div className={styles.footer}>
        <button type="submit" disabled={saving} className={styles.primaryBtn}>
          <Save size={14} strokeWidth={2} />
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
