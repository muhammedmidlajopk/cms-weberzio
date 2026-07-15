"use client";

import { useState, useEffect, useRef } from "react";
import MenuOverlay from "./MenuOverlay";
import styles from "./Header.module.css";

const FALLBACK_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Work", href: "/#work" },
  { label: "Contact", href: "/contact" },
];

export default function Header({ siteName = "weberzio", logoUrl = "" }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [items, setItems] = useState(FALLBACK_ITEMS);
  const [tapDebug, setTapDebug] = useState("idle");
  const [rectDebug, setRectDebug] = useState("...");
  const btnRef = useRef(null);

  useEffect(() => {
    function measure() {
      const btn = btnRef.current;
      if (!btn) { setRectDebug("no-btn-ref"); return; }
      const r = btn.getBoundingClientRect();
      const cs = window.getComputedStyle(btn);
      const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      setRectDebug(
        `vw:${window.innerWidth} btn:${Math.round(r.left)},${Math.round(r.top)} ${Math.round(r.width)}x${Math.round(r.height)} pe:${cs.pointerEvents} top:${top?.tagName || "none"}.${(top?.className || "").toString().slice(0, 20)}`
      );
    }
    measure();
    const t = setTimeout(measure, 500);
    window.addEventListener("resize", measure);
    return () => { clearTimeout(t); window.removeEventListener("resize", measure); };
  }, []);

  useEffect(() => {
    fetch("/api/menus")
      .then((r) => r.json())
      .then((data) => {
        const header = data.menus?.header;
        if (Array.isArray(header) && header.length > 0) {
          setItems(header.map((i) => ({ label: i.label, href: i.href })));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <header className={`${styles.header} ${menuOpen ? styles.headerHidden : ""}`}>
        <div className={styles.inner}>
          <a href="/" className={styles.logo} aria-label={siteName}>
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt={siteName} className={styles.logoImg} />
            ) : (
              <span>{siteName}</span>
            )}
          </a>

          <div
            style={{
              padding: 20,
              margin: -20,
              background: "rgba(255,0,0,0.25)",
              pointerEvents: "auto",
              position: "relative",
              zIndex: 1002,
            }}
            onPointerDown={() => setTapDebug("wrap-pointerdown")}
            onTouchStart={() => setTapDebug("wrap-touchstart")}
            onClick={() => {
              setTapDebug("wrap-click");
              setMenuOpen((v) => !v);
            }}
          >
          <button
            ref={btnRef}
            type="button"
            className={`${styles.menuButton} ${menuOpen ? styles.menuButtonOpen : ""}`}
            onPointerDown={() => setTapDebug("btn-pointerdown")}
            onTouchStart={() => setTapDebug("btn-touchstart")}
            onClick={() => {
              setTapDebug("btn-click");
              setMenuOpen((v) => !v);
            }}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span className={styles.menuIcon}>
              <span />
              <span />
            </span>
            <span className={styles.menuLabel}>
              <span className={styles.menuLabelInner} data-open={menuOpen}>
                <span>Menu</span>
                <span>Close</span>
              </span>
            </span>
          </button>
          </div>
        </div>
      </header>

      <MenuOverlay
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        items={items}
        siteName={siteName}
      />

      {/* TEMP DEBUG — remove once mobile menu confirmed */}
      <div
        style={{
          position: "fixed",
          bottom: 12,
          left: 12,
          zIndex: 99999,
          padding: "6px 10px",
          background: "rgba(0,0,0,0.85)",
          color: "#0f0",
          font: "12px monospace",
          borderRadius: 6,
          pointerEvents: "none",
        }}
      >
        <div>tap:{tapDebug} open:{String(menuOpen)}</div>
        <div style={{ marginTop: 4, fontSize: 10, color: "#ff0" }}>{rectDebug}</div>
      </div>
    </>
  );
}
