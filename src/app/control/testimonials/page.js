"use client";

import { useState, useEffect, useCallback } from "react";
import { Pencil, Trash2, Plus, X, Star } from "lucide-react";
import { adminFetch } from "@/lib/admin-fetch";
import styles from "./page.module.css";

const EMPTY = {
  name: "",
  role: "",
  company: "",
  quote: "",
  avatarUrl: "",
  rating: 5,
  order: 0,
};

export default function AdminTestimonials() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [toast, setToast] = useState({ msg: "", type: "success" });

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch("/api/testimonials");
      const data = await res.json();
      setItems(data.testimonials || []);
    } catch (err) {
      console.error("Failed to fetch testimonials:", err);
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
      name: item.name || "",
      role: item.role || "",
      company: item.company || "",
      quote: item.quote || "",
      avatarUrl: item.avatarUrl || "",
      rating: item.rating || 5,
      order: item.order || 0,
    });
    setEditingId(item._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!confirm("Delete this testimonial?")) return;
    try {
      const res = await adminFetch(`/api/testimonials/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((it) => it._id !== id));
        showToast("Deleted");
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.error || "Delete failed", "error");
      }
    } catch (err) {
      showToast(err.message || "Delete failed", "error");
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.name || !form.quote) {
      showToast("Name and quote are required", "error");
      return;
    }

    try {
      const url = editingId ? `/api/testimonials/${editingId}` : "/api/testimonials";
      const method = editingId ? "PUT" : "POST";

      const res = await adminFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
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
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Testimonials</h1>
          <p className={styles.subtitle}>
            Manage client testimonials shown on the landing page ({items.length})
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
          {editingId ? "Edit Testimonial" : "Add New Testimonial"}
        </h2>

        <div className={styles.formGrid}>
          <label className={styles.field}>
            <span className={styles.label}>Name *</span>
            <input
              className={styles.input}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Sarah Chen"
              required
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Role</span>
            <input
              className={styles.input}
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              placeholder="Head of Product"
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Company</span>
            <input
              className={styles.input}
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              placeholder="Northwind Labs"
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Avatar URL</span>
            <input
              className={styles.input}
              value={form.avatarUrl}
              onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
              placeholder="https://…"
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Rating</span>
            <div className={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  type="button"
                  key={n}
                  onClick={() => setForm({ ...form, rating: n })}
                  className={`${styles.starBtn} ${n <= form.rating ? styles.starBtnOn : ""}`}
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                >
                  <Star size={16} strokeWidth={1.75} fill={n <= form.rating ? "currentColor" : "none"} />
                </button>
              ))}
              <span className={styles.ratingValue}>{form.rating} / 5</span>
            </div>
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Order</span>
            <input
              type="number"
              className={styles.input}
              value={form.order}
              onChange={(e) => setForm({ ...form, order: Number(e.target.value) || 0 })}
              placeholder="0"
            />
          </label>
        </div>

        <label className={`${styles.field} ${styles.fullWidth}`}>
          <span className={styles.label}>Quote *</span>
          <textarea
            className={styles.textarea}
            value={form.quote}
            onChange={(e) => setForm({ ...form, quote: e.target.value })}
            placeholder="They rebuilt our platform in three months…"
            rows={4}
            required
          />
        </label>

        <div className={styles.formActions}>
          <button type="submit" className={styles.saveButton} disabled={!form.name || !form.quote}>
            {editingId ? (
              <><Pencil size={14} strokeWidth={2} /> Update</>
            ) : (
              <><Plus size={14} strokeWidth={2} /> Add Testimonial</>
            )}
          </button>
          {editingId && (
            <button type="button" className={styles.cancelButton} onClick={resetForm}>
              <X size={14} strokeWidth={2} /> Cancel
            </button>
          )}
        </div>
      </form>

      <div className={styles.list}>
        {loading ? (
          <div className={styles.empty}>Loading…</div>
        ) : items.length === 0 ? (
          <div className={styles.empty}>No testimonials yet. Add one above.</div>
        ) : (
          items.map((item) => (
            <article key={item._id} className={styles.card}>
              <div className={styles.cardHead}>
                <div className={styles.person}>
                  <div className={styles.avatar}>
                    {item.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.avatarUrl} alt={item.name} />
                    ) : (
                      <span>
                        {item.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className={styles.name}>{item.name}</div>
                    <div className={styles.role}>
                      {item.role}
                      {item.role && item.company ? " · " : ""}
                      {item.company}
                    </div>
                  </div>
                </div>
                <div className={styles.actions}>
                  <span className={styles.rating}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        size={12}
                        strokeWidth={1.75}
                        fill={i < (item.rating || 5) ? "#fbbf24" : "none"}
                        color={i < (item.rating || 5) ? "#fbbf24" : "rgba(255,255,255,0.2)"}
                      />
                    ))}
                  </span>
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
              <blockquote className={styles.quote}>{item.quote}</blockquote>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
