"use client";

import { useEffect, useState } from "react";
import styles from "./MenuOverlay.module.css";

export default function MenuOverlay({ open, onClose, items, siteName }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      const t = setTimeout(() => setMounted(false), 700);
      return () => clearTimeout(t);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted && !open) return null;

  return (
    <div className={`${styles.overlay} ${open ? styles.open : ""}`} aria-hidden={!open}>
      <div className={styles.panel} />

      <div className={styles.grid}>
        {/* Left column: brand + vertical MENU watermark */}
        <aside className={styles.leftCol}>
          <a href="/" className={styles.brand} onClick={onClose}>
            {siteName}
          </a>
          <span className={styles.watermark} aria-hidden="true">MENU</span>
        </aside>

        {/* Center column: nav links */}
        <nav className={styles.centerCol}>
          <ul className={styles.list}>
            {items.map((item, i) => (
              <li key={item.href} className={styles.listItem} style={{ "--i": i }}>
                <a href={item.href} className={styles.link} onClick={onClose}>
                  <span className={styles.linkLabel}>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right column: Get in Touch */}
        <aside className={styles.rightCol}>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close menu"
          >
            <span className={styles.closeIcon} aria-hidden="true">
              <span />
              <span />
            </span>
            <span className={styles.closeLabel}>close</span>
          </button>

          <div className={styles.contact}>
            <h3 className={styles.contactTitle}>Get in Touch</h3>
            <p className={styles.contactBody}>
              We help teams design, build, and scale reliable software &mdash;
              from early-stage web apps and APIs to production platforms your
              customers can trust.
            </p>
            <a href="tel:+10000000000" className={styles.contactPhone}>
              +1 (000) 000&mdash;0000
            </a>
            <a href="mailto:hello@example.com" className={styles.contactEmail}>
              hello@example.com
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
