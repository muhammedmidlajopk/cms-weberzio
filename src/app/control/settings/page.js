"use client";

import { useState, useEffect, useRef } from "react";
import { Upload, Trash2, Save } from "lucide-react";
import { adminFetch } from "@/lib/admin-fetch";
import styles from "./page.module.css";

const EMPTY = {
  siteName: "",
  tagline: "",
  homeTitle: "",
  homeDescription: "",
  keywords: "",
  ogImageUrl: "",
  logoUrl: "",
  faviconUrl: "",
  twitterHandle: "",
  themeColor: "#04050f",
};

export default function SettingsPage() {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "success" });

  const logoInput = useRef(null);
  const faviconInput = useRef(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) setForm({ ...EMPTY, ...data.settings });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type }), 2500);
  }

  async function uploadFile(file) {
    const fd = new FormData();
    fd.append("file", file);
    const res = await adminFetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");
    return data.url;
  }

  async function handleLogoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showToast("Logo must be under 2MB", "error");
      return;
    }
    setUploadingLogo(true);
    try {
      const url = await uploadFile(file);
      update("logoUrl", url);
      showToast("Logo uploaded");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setUploadingLogo(false);
      e.target.value = "";
    }
  }

  async function handleFaviconChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500 * 1024) {
      showToast("Favicon must be under 500KB", "error");
      return;
    }
    setUploadingFavicon(true);
    try {
      const url = await uploadFile(file);
      update("faviconUrl", url);
      showToast("Favicon uploaded");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setUploadingFavicon(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await adminFetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setForm({ ...EMPTY, ...data.settings });
      showToast("Saved");
    } catch (err) {
      showToast(err.message || "Save failed", "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className={styles.loading}>Loading…</div>;

  return (
    <form onSubmit={handleSubmit} className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Site Settings</h1>
          <p className={styles.subtitle}>Logo, favicon, and global site info.</p>
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

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Brand Assets</h2>
          <p>
            Files are saved under <code>public/assets/uploads/DDMMYYYY/</code> and served
            from that path.
          </p>
        </div>

        <div className={styles.assetGrid}>
          <div className={styles.assetCard}>
            <div className={styles.assetPreview}>
              {form.logoUrl ? (
                <img src={form.logoUrl} alt="Logo" />
              ) : (
                <span className={styles.assetEmpty}>No logo uploaded</span>
              )}
            </div>
            <div className={styles.assetInfo}>
              <div className={styles.assetLabel}>Logo</div>
              <div className={styles.assetHint}>PNG or SVG, up to 2MB</div>
              <div className={styles.assetButtons}>
                <button
                  type="button"
                  className={styles.ghostBtn}
                  disabled={uploadingLogo}
                  onClick={() => logoInput.current?.click()}
                >
                  <Upload size={13} strokeWidth={1.75} />
                  {uploadingLogo ? "Uploading…" : "Upload"}
                </button>
                {form.logoUrl && (
                  <button
                    type="button"
                    className={styles.dangerBtn}
                    onClick={() => update("logoUrl", "")}
                  >
                    <Trash2 size={13} strokeWidth={1.75} /> Remove
                  </button>
                )}
              </div>
              <input
                ref={logoInput}
                type="file"
                accept="image/*"
                hidden
                onChange={handleLogoChange}
              />
            </div>
          </div>

          <div className={styles.assetCard}>
            <div className={styles.assetPreview + " " + styles.assetPreviewSm}>
              {form.faviconUrl ? (
                <img src={form.faviconUrl} alt="Favicon" />
              ) : (
                <span className={styles.assetEmpty}>No favicon</span>
              )}
            </div>
            <div className={styles.assetInfo}>
              <div className={styles.assetLabel}>Favicon</div>
              <div className={styles.assetHint}>32×32 PNG or .ico, up to 500KB</div>
              <div className={styles.assetButtons}>
                <button
                  type="button"
                  className={styles.ghostBtn}
                  disabled={uploadingFavicon}
                  onClick={() => faviconInput.current?.click()}
                >
                  <Upload size={13} strokeWidth={1.75} />
                  {uploadingFavicon ? "Uploading…" : "Upload"}
                </button>
                {form.faviconUrl && (
                  <button
                    type="button"
                    className={styles.dangerBtn}
                    onClick={() => update("faviconUrl", "")}
                  >
                    <Trash2 size={13} strokeWidth={1.75} /> Remove
                  </button>
                )}
              </div>
              <input
                ref={faviconInput}
                type="file"
                accept="image/*,.ico"
                hidden
                onChange={handleFaviconChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>General</h2>
          <p>Basic identity used across the public site.</p>
        </div>
        <div className={styles.grid2}>
          <Field label="Site Name" hint="Shown in browser tab & header">
            <input
              className={styles.input}
              value={form.siteName}
              onChange={(e) => update("siteName", e.target.value)}
              placeholder="weberzio"
            />
          </Field>
          <Field label="Tagline" hint="Short one-liner">
            <input
              className={styles.input}
              value={form.tagline}
              onChange={(e) => update("tagline", e.target.value)}
              placeholder="UX/UI Designer"
            />
          </Field>
          <Field label="Home Title" hint="<title> tag on the home page">
            <input
              className={styles.input}
              value={form.homeTitle}
              onChange={(e) => update("homeTitle", e.target.value)}
              placeholder="weberzio — UX/UI Designer"
            />
          </Field>
          <Field label="Theme Color" hint="Used for browser chrome & PWA">
            <div className={styles.colorRow}>
              <input
                type="color"
                className={styles.colorInput}
                value={form.themeColor || "#04050f"}
                onChange={(e) => update("themeColor", e.target.value)}
              />
              <input
                className={styles.input}
                value={form.themeColor}
                onChange={(e) => update("themeColor", e.target.value)}
                placeholder="#04050f"
              />
            </div>
          </Field>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Home Page SEO</h2>
          <p>Meta tags for the site&apos;s home page.</p>
        </div>
        <Field label="Home Description" hint="120–160 characters recommended">
          <textarea
            className={styles.textarea}
            value={form.homeDescription}
            onChange={(e) => update("homeDescription", e.target.value)}
            placeholder="A short description of your site"
            rows={3}
          />
          <span className={styles.counter}>
            {form.homeDescription.length} / 160
          </span>
        </Field>
        <Field label="Keywords" hint="Comma-separated">
          <input
            className={styles.input}
            value={form.keywords}
            onChange={(e) => update("keywords", e.target.value)}
            placeholder="ux, ui, design, portfolio"
          />
        </Field>
        <Field label="Open Graph Image URL" hint="1200×630 recommended for social sharing">
          <input
            className={styles.input}
            value={form.ogImageUrl}
            onChange={(e) => update("ogImageUrl", e.target.value)}
            placeholder="https://example.com/og.png"
          />
        </Field>
        <Field label="Twitter Handle" hint="Optional, without the @">
          <input
            className={styles.input}
            value={form.twitterHandle}
            onChange={(e) => update("twitterHandle", e.target.value)}
            placeholder="weberzio"
          />
        </Field>
      </div>
    </form>
  );
}

function Field({ label, hint, children }) {
  return (
    <label className={styles.field}>
      <div className={styles.fieldTop}>
        <span className={styles.fieldLabel}>{label}</span>
        {hint && <span className={styles.fieldHint}>{hint}</span>}
      </div>
      <div className={styles.fieldControl}>{children}</div>
    </label>
  );
}
