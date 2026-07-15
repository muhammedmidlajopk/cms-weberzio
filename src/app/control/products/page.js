"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Pencil, Trash2, Plus, X, Upload } from "lucide-react";
import { adminFetch } from "@/lib/admin-fetch";
import styles from "./page.module.css";

const EMPTY = {
  title: "",
  meta: "",
  price: "",
  year: "",
  imageUrl: "",
  tagsInput: "",
};

export default function AdminProducts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "success" });
  const fileInput = useRef(null);

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setItems(data.products || []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type }), 2500);
  }

  function resetForm() {
    setForm(EMPTY);
    setEditingId(null);
  }

  function handleEdit(item) {
    setForm({
      title: item.title || "",
      meta: item.meta || "",
      price: item.price || "",
      year: item.year || "",
      imageUrl: item.imageUrl || "",
      tagsInput: Array.isArray(item.tags) ? item.tags.join(", ") : "",
    });
    setEditingId(item._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!confirm("Delete this product?")) return;
    try {
      const res = await adminFetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((it) => it._id !== id));
        showToast("Deleted");
      }
    } catch (err) {
      showToast(err.message || "Delete failed", "error");
    }
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast("Image must be under 5MB", "error");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await adminFetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setForm((f) => ({ ...f, imageUrl: data.url }));
      showToast("Image uploaded");
    } catch (err) {
      showToast(err.message || "Upload failed", "error");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.title) return;
    try {
      const tags = form.tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        title: form.title,
        meta: form.meta,
        price: form.price,
        year: form.year,
        imageUrl: form.imageUrl,
        tags,
      };

      const url = editingId ? `/api/products/${editingId}` : "/api/products";
      const method = editingId ? "PUT" : "POST";

      const res = await adminFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Save failed");
      await fetchItems();
      resetForm();
      showToast(editingId ? "Updated" : "Added");
    } catch (err) {
      showToast(err.message || "Save failed", "error");
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Projects</h1>
          <p className={styles.subtitle}>
            Manage case-study projects shown on the home page ({items.length})
          </p>
        </div>
        {toast.msg && (
          <span
            className={`${styles.toast} ${
              toast.type === "error" ? styles.toastError : styles.toastOk
            }`}
          >
            {toast.msg}
          </span>
        )}
      </div>

      <form className={styles.form} onSubmit={handleSave}>
        <h2 className={styles.formTitle}>
          {editingId ? "Edit Project" : "Add New Project"}
        </h2>

        <div className={styles.formGrid}>
          <input
            className={styles.input}
            placeholder="Project title *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            className={styles.input}
            placeholder="Meta (e.g. mobile app design / motion)"
            value={form.meta}
            onChange={(e) => setForm({ ...form, meta: e.target.value })}
          />
          <input
            className={styles.input}
            placeholder="Year (e.g. 2025)"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
          />
          <input
            className={styles.input}
            placeholder="Price (optional, e.g. $28 or FREE)"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
        </div>

        <div className={styles.imageRow}>
          <div className={styles.imagePreview}>
            {form.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.imageUrl} alt="Project" />
            ) : (
              <span className={styles.imageEmpty}>No image</span>
            )}
          </div>
          <div className={styles.imageInfo}>
            <div className={styles.imageLabel}>Cover Image</div>
            <div className={styles.imageHint}>Landscape 4:3, up to 5MB</div>
            <input
              className={styles.input}
              placeholder="Image URL (or upload below)"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />
            <div className={styles.imageButtons}>
              <button
                type="button"
                className={styles.uploadBtn}
                onClick={() => fileInput.current?.click()}
                disabled={uploading}
              >
                <Upload size={13} strokeWidth={1.75} />
                {uploading ? "Uploading…" : "Upload"}
              </button>
              {form.imageUrl && (
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => setForm({ ...form, imageUrl: "" })}
                >
                  <X size={13} strokeWidth={1.75} />
                  Remove
                </button>
              )}
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageUpload}
              />
            </div>
          </div>
        </div>

        <input
          className={styles.input}
          placeholder="Tags — comma separated (e.g. motion, marketing & sales materials)"
          value={form.tagsInput}
          onChange={(e) => setForm({ ...form, tagsInput: e.target.value })}
        />

        <div className={styles.formActions}>
          <button
            type="submit"
            className={styles.saveButton}
            disabled={!form.title}
          >
            {editingId ? (
              <><Pencil size={14} strokeWidth={2} /> Update</>
            ) : (
              <><Plus size={14} strokeWidth={2} /> Add Project</>
            )}
          </button>
          {editingId && (
            <button
              type="button"
              className={styles.cancelButton}
              onClick={resetForm}
            >
              <X size={14} strokeWidth={2} /> Cancel
            </button>
          )}
        </div>
      </form>

      <div className={styles.list}>
        {loading ? (
          <div className={styles.emptyState}>Loading...</div>
        ) : items.length === 0 ? (
          <div className={styles.emptyState}>
            No projects yet. Add one above.
          </div>
        ) : (
          items.map((item) => (
            <article key={item._id} className={styles.card}>
              <div className={styles.cardThumb}>
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.imageUrl} alt={item.title} />
                ) : (
                  <span className={styles.thumbEmpty}>No image</span>
                )}
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardHead}>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <div className={styles.cardActions}>
                    <button
                      className={styles.editButton}
                      onClick={() => handleEdit(item)}
                      aria-label="Edit"
                      title="Edit"
                    >
                      <Pencil size={14} strokeWidth={1.75} />
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(item._id)}
                      aria-label="Delete"
                      title="Delete"
                    >
                      <Trash2 size={14} strokeWidth={1.75} />
                    </button>
                  </div>
                </div>
                <div className={styles.cardMetaRow}>
                  {item.year && <span className={styles.cardYear}>© {item.year}</span>}
                  {item.meta && <span className={styles.cardMeta}>{item.meta}</span>}
                </div>
                {Array.isArray(item.tags) && item.tags.length > 0 && (
                  <ul className={styles.cardTags}>
                    {item.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
