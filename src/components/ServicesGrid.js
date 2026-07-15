"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SERVICES } from "@/lib/services-data";
import styles from "./ServicesGrid.module.css";

const PLACEHOLDER = SERVICES.map((s) => ({
  slug: s.slug,
  title: s.title,
  description: s.description,
  tags: s.tags,
}));

export default function ServicesGrid() {
  const [items, setItems] = useState(PLACEHOLDER);

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.services) && data.services.length > 0) {
          setItems(
            data.services.map((s) => ({
              slug: s.slug,
              title: s.title,
              description: s.description || "",
              tags: Array.isArray(s.tags) ? s.tags : [],
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="services" className={styles.section}>
      <header className={styles.header}>
        <div>
          <span className={styles.tag}>
            <span className={styles.tagIndex}>01</span>
            What we do
          </span>
          <h2 className={styles.title}>
            End-to-end engineering, <span className={styles.titleAlt}>done well.</span>
          </h2>
        </div>
        <p className={styles.desc}>
          We work with founders, product teams, and enterprises across the
          web stack. Every engagement is scoped to the outcome, not the hours.
        </p>
      </header>

      <div className={styles.grid}>
        {items.map((item, i) => {
          const inner = (
            <>
              <div className={styles.cardIndex}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardDesc}>{item.description}</p>
              {item.tags && item.tags.length > 0 && (
                <ul className={styles.cardTags}>
                  {item.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              )}
            </>
          );

          return item.slug ? (
            <Link
              key={item.slug}
              href={`/services/${item.slug}`}
              className={styles.card}
              style={{ "--i": i }}
            >
              {inner}
            </Link>
          ) : (
            <article key={item._id || i} className={styles.card} style={{ "--i": i }}>
              {inner}
            </article>
          );
        })}
      </div>
    </section>
  );
}
