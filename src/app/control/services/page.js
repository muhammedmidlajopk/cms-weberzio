"use client";

import { useState, useEffect, useCallback } from "react";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import { adminFetch } from "@/lib/admin-fetch";
import styles from "./page.module.css";

export default function AdminServices() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", tags: "" });

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      setItems(data.services || []);
    } catch (err) {
      console.error("Failed to fetch services:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  function resetForm() {
    setForm({ title: "", description: "", tags: "" });
    setEditingId(null);
  }

  function handleEdit(item) {
    setForm({
      title: item.title,
      description: item.description,
      tags: Array.isArray(item.tags) ? item.tags.join(" / ") : item.tags,
    });
    setEditingId(item._id);
  }

  async function handleDelete(id) {
    if (!confirm("Delete this service?")) return;
    try {
      const res = await adminFetch(`/api/services/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems(items.filter((item) => item._id !== id));
      }
    } catch (err) {
      console.error("Failed to delete service:", err);
    }
  }

  async function handleSave() {
    try {
      const tags = form.tags
        .split("/")
        .map((t) => t.trim())
        .filter(Boolean);
      const url = editingId ? `/api/services/${editingId}` : "/api/services";
      const method = editingId ? "PUT" : "POST";

      const res = await adminFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          tags,
        }),
      });

      if (res.ok) {
        await fetchItems();
        resetForm();
      }
    } catch (err) {
      console.error("Failed to save service:", err);
    }
  }

  function handleCancel() {
    resetForm();
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Services</h1>
          <p className={styles.subtitle}>Manage your services ({items.length})</p>
        </div>
      </div>

      <div className={styles.form}>
        <h2 className={styles.formTitle}>{editingId ? "Edit Service" : "Add New Service"}</h2>
        <div className={styles.formGrid}>
          <input
            className={styles.input}
            placeholder="Service title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            className={styles.textarea}
            placeholder="Service description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
          />
          <input
            className={styles.input}
            placeholder="Tags (separate with /)"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />
        </div>
        <div className={styles.formActions}>
          <button className={styles.saveButton} onClick={handleSave} disabled={!form.title}>
            {editingId ? (
              <><Pencil size={14} strokeWidth={2} /> Update</>
            ) : (
              <><Plus size={14} strokeWidth={2} /> Add Service</>
            )}
          </button>
          {editingId && (
            <button className={styles.cancelButton} onClick={handleCancel}>
              <X size={14} strokeWidth={2} /> Cancel
            </button>
          )}
        </div>
      </div>

      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <span className={styles.colTitle}>Title</span>
          <span className={styles.colDesc}>Description</span>
          <span className={styles.colActions}>Actions</span>
        </div>
        {loading ? (
          <div className={styles.emptyState}>Loading...</div>
        ) : items.length === 0 ? (
          <div className={styles.emptyState}>No services yet. Add one above.</div>
        ) : (
          items.map((item) => (
            <div key={item._id} className={styles.tableRow}>
              <span className={styles.colTitle}>{item.title}</span>
              <span className={styles.colDesc}>{item.description}</span>
              <span className={styles.colActions}>
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
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
