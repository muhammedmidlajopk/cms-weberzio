"use client";

import { useState } from "react";
import styles from "./ContactForm.module.css";

const EMPTY = { name: "", email: "", company: "", budget: "", message: "" };

const BUDGETS = [
  "< $10k",
  "$10k – $25k",
  "$25k – $50k",
  "$50k – $100k",
  "$100k+",
  "Not sure yet",
];

export default function ContactForm({ tagIndex = "02" }) {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState({ state: "idle", msg: "" });

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ state: "sending", msg: "" });
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setStatus({
        state: "success",
        msg: "Thanks — we'll get back to you within one business day.",
      });
      setForm(EMPTY);
    } catch (err) {
      setStatus({
        state: "error",
        msg: err.message || "Something went wrong",
      });
    }
  }

  return (
    <section className={styles.section}>
      <div className={styles.wrapper}>
        <aside className={styles.side}>
          <span className={styles.tag}>
            <span className={styles.tagIndex}>{tagIndex}</span>
            Get in touch
          </span>

          <h2 className={styles.sideTitle}>
            Prefer <span className={styles.sideTitleAlt}>email?</span>
          </h2>

          <p className={styles.sideText}>
            Skip the form and drop us a line directly. We&apos;ll reply within
            one business day.
          </p>

          <a href="mailto:hello@example.com" className={styles.emailLink}>
            hello@example.com
          </a>

          <ul className={styles.details}>
            <li>
              <span className={styles.detailLabel}>Response time</span>
              <span className={styles.detailValue}>~24 hours</span>
            </li>
            <li>
              <span className={styles.detailLabel}>Working with</span>
              <span className={styles.detailValue}>Founders, product teams</span>
            </li>
            <li>
              <span className={styles.detailLabel}>Timezone</span>
              <span className={styles.detailValue}>Global / async</span>
            </li>
          </ul>
        </aside>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.row}>
            <label className={styles.field}>
              <span className={styles.label}>Your name *</span>
              <input
                className={styles.input}
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Jane Doe"
                required
                autoComplete="name"
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Email *</span>
              <input
                type="email"
                className={styles.input}
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="jane@company.com"
                required
                autoComplete="email"
              />
            </label>
          </div>

          <div className={styles.row}>
            <label className={styles.field}>
              <span className={styles.label}>Company</span>
              <input
                className={styles.input}
                value={form.company}
                onChange={(e) => update("company", e.target.value)}
                placeholder="Optional"
                autoComplete="organization"
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Budget</span>
              <div className={styles.selectWrap}>
                <select
                  className={styles.select}
                  value={form.budget}
                  onChange={(e) => update("budget", e.target.value)}
                >
                  <option value="">Choose a range</option>
                  {BUDGETS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
                <span className={styles.selectArrow} aria-hidden="true" />
              </div>
            </label>
          </div>

          <label className={styles.field}>
            <span className={styles.label}>Tell us about your project *</span>
            <textarea
              className={styles.textarea}
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
              placeholder="Goals, timeline, anything we should know…"
              rows={6}
              required
              maxLength={5000}
            />
            <span className={styles.counter}>
              {form.message.length} / 5000
            </span>
          </label>

          <div className={styles.actions}>
            <button
              type="submit"
              className={styles.submit}
              disabled={status.state === "sending"}
            >
              <span>
                {status.state === "sending" ? "Sending…" : "Send message"}
              </span>
              <span className={styles.submitArrow} aria-hidden="true" />
            </button>

            {status.msg && (
              <span
                className={`${styles.status} ${
                  status.state === "error"
                    ? styles.statusError
                    : styles.statusOk
                }`}
                role="status"
              >
                {status.msg}
              </span>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
