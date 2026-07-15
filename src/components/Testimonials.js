"use client";

import { useEffect, useState } from "react";
import styles from "./Testimonials.module.css";

const PLACEHOLDER = [
  {
    name: "Sarah Chen",
    role: "Head of Product",
    company: "Northwind Labs",
    quote:
      "They rebuilt our platform from the ground up in three months. The team is technical, decisive, and genuinely invested in our success — hard to find that combination.",
    rating: 5,
  },
  {
    name: "Marcus Bell",
    role: "CTO",
    company: "Fieldwork",
    quote:
      "Rock-solid engineering. Every deliverable landed on time, well-tested, and documented. Our internal team learned from theirs — that alone paid for the engagement.",
    rating: 5,
  },
  {
    name: "Priya Anand",
    role: "Founder",
    company: "Ledgerly",
    quote:
      "We shipped an MVP in six weeks that would've taken us six months alone. They asked the right questions, pushed back when needed, and never got lost in the weeds.",
    rating: 5,
  },
  {
    name: "James Okafor",
    role: "VP Engineering",
    company: "Orbit Systems",
    quote:
      "Reliable partners for the long haul. Two years in and they still feel like an extension of our team. Clean code, honest estimates, no drama.",
    rating: 5,
  },
  {
    name: "Elena Rossi",
    role: "Operations Lead",
    company: "Kite & Co.",
    quote:
      "Migrated our legacy backend without a single hour of downtime. The care they put into the migration plan and rollout was refreshing.",
    rating: 5,
  },
];

function Stars({ count = 5 }) {
  return (
    <span className={styles.stars} aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < count ? styles.starOn : styles.starOff}>
          ★
        </span>
      ))}
    </span>
  );
}

export default function Testimonials({ tagIndex = "02" }) {
  const [items, setItems] = useState(PLACEHOLDER);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.testimonials) && data.testimonials.length > 0) {
          setItems(data.testimonials);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="testimonials" className={styles.section}>
      <header className={styles.header}>
        <span className={styles.tag}>
          <span className={styles.tagIndex}>{tagIndex}</span>
          Testimonials
        </span>
        <h2 className={styles.title}>
          What our <span className={styles.titleAlt}>clients</span>
          <br />
          are saying.
        </h2>
        <p className={styles.desc}>
          A few kind words from the founders, product leaders, and engineering
          teams we&apos;ve had the privilege of building with.
        </p>
      </header>

      <div className={styles.grid}>
        {items.map((t, i) => (
          <article key={t._id || i} className={styles.card} style={{ "--i": i }}>
            <div className={styles.cardTop}>
              <Stars count={t.rating || 5} />
              <span className={styles.quoteMark} aria-hidden="true">&ldquo;</span>
            </div>

            <blockquote className={styles.quote}>
              {t.quote}
            </blockquote>

            <footer className={styles.person}>
              <div className={styles.avatar}>
                {t.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.avatarUrl} alt={t.name} />
                ) : (
                  <span className={styles.avatarFallback}>
                    {t.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                  </span>
                )}
              </div>
              <div className={styles.personText}>
                <div className={styles.personName}>{t.name}</div>
                <div className={styles.personRole}>
                  {t.role}
                  {t.role && t.company ? " · " : ""}
                  {t.company}
                </div>
              </div>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}
