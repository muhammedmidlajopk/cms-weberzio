"use client";

import { useEffect, useState } from "react";
import styles from "./Footer.module.css";

const FALLBACK_MENU = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
];

export default function Footer({ siteName = "weberzio" }) {
  const marqueeItems = Array.from({ length: 8 }, (_, i) => i);
  const year = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [menu, setMenu] = useState(FALLBACK_MENU);

  useEffect(() => {
    fetch("/api/menus")
      .then((r) => r.json())
      .then((data) => {
        const footer = data.menus?.footer;
        if (Array.isArray(footer) && footer.length > 0) {
          setMenu(footer.map((i) => ({ label: i.label, href: i.href })));
        }
      })
      .catch(() => {});
  }, []);

  function handleSubscribe(e) {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  }

  return (
    <footer id="contact" className={styles.footer}>
      <div className={styles.hero}>
        <h2 className={styles.heading}>
          Ready to build your next project?
          <br />
          <a href="/contact" className={styles.headingLink}>
            Let&apos;s talk.
          </a>
        </h2>
      </div>

      <a href="mailto:hello@example.com" className={styles.marquee} aria-label="Get in touch">
        <div className={styles.marqueeTrack}>
          {marqueeItems.map((i) => (
            <span key={i} className={styles.marqueeGroup}>
              <span className={styles.marqueeItem}>Get in Touch</span>
              <span className={styles.marqueeArrow} aria-hidden="true" />
            </span>
          ))}
        </div>
      </a>

      <div className={styles.info}>
        <div className={styles.col}>
          <h3 className={styles.colTitle}>Address</h3>
          <p className={styles.colText}>
            Remote &mdash; distributed team
            <br />
            operating worldwide
          </p>
        </div>

        <div className={styles.col}>
          <h3 className={styles.colTitle}>Say Hello</h3>
          <a href="mailto:hello@example.com" className={styles.colLink}>
            hello@example.com
          </a>
        </div>

        <div className={styles.col}>
          <h3 className={styles.colTitle}>Menu</h3>
          <ul className={styles.socialList}>
            {menu.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={styles.socialLink}>{item.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.col}>
          <h3 className={styles.colTitle}>Newsletter</h3>
          <form onSubmit={handleSubscribe} className={styles.newsletter}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Type your email"
              className={styles.newsletterInput}
              aria-label="Email address"
              required
            />
            <button
              type="submit"
              className={styles.newsletterButton}
              aria-label="Subscribe"
            >
              <span className={styles.newsletterArrow} aria-hidden="true" />
            </button>
          </form>
          {subscribed && (
            <span className={styles.newsletterOk}>Thanks — we&apos;ll be in touch.</span>
          )}
        </div>
      </div>

      <div className={styles.bottom}>
        <span className={styles.brand}>{siteName}</span>
        <span className={styles.copy}>© {year} All rights reserved</span>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={styles.toTop}
          aria-label="Back to top"
        >
          <span className={styles.toTopArrow} aria-hidden="true" />
        </button>
      </div>
    </footer>
  );
}
