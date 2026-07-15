"use client";

import { useEffect, useState } from "react";
import styles from "./Work.module.css";

const PLACEHOLDER = [
  {
    title: "Nova — SaaS Platform",
    meta: "web app / product engineering",
    year: "2025",
    tags: ["Next.js", "TypeScript", "Postgres"],
  },
  {
    title: "Halcyon — FinTech API",
    meta: "backend / integrations",
    year: "2025",
    tags: ["Node.js", "Stripe", "GraphQL"],
  },
  {
    title: "Prism — E-commerce Suite",
    meta: "full stack / commerce",
    year: "2024",
    tags: ["Shopify", "Headless", "React"],
  },
];

export default function Work() {
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        const products = data.products || [];
        setItems(products.length > 0 ? products : PLACEHOLDER);
        setReady(true);
      })
      .catch(() => {
        setItems(PLACEHOLDER);
        setReady(true);
      });
  }, []);

  // Show only the first 3 — the 4th slot is the CTA tile
  const visible = items.slice(0, 3);

  return (
    <section id="work" className={styles.section}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.tag}>
            <span className={styles.tagIndex}>02</span>
            Portfolio
          </span>
          <h2 className={styles.title}>
            Our work: <span className={styles.titleAlt}>from</span>
            <br />
            discovery to launch
          </h2>
        </div>
        <a href="/work" className={styles.viewAll}>
          View All Projects
          <span className={styles.viewAllArrow} aria-hidden="true" />
        </a>
      </header>

      <div className={styles.grid} data-ready={ready}>
        {visible.map((item, i) => (
          <a
            key={item._id || i}
            href="#"
            className={styles.card}
            style={{ "--i": i }}
          >
            <div className={styles.cardMedia}>
              {item.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.imageUrl} alt={item.title} className={styles.cardImg} />
              ) : (
                <div className={styles.cardShape} data-variant={i % 3} />
              )}
              {item.year && (
                <span className={styles.cardYear}>© {item.year}</span>
              )}
            </div>
            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              {item.meta && (
                <div className={styles.cardMeta}>{item.meta}</div>
              )}
              {Array.isArray(item.tags) && item.tags.length > 0 && (
                <ul className={styles.cardTags}>
                  {item.tags.slice(0, 4).map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              )}
            </div>
          </a>
        ))}

        <a href="#contact" className={styles.tail} style={{ "--i": visible.length }}>
          <div className={styles.tailInner}>
            <h3 className={styles.tailTitle}>
              Have a project <span className={styles.tailAlt}>in mind?</span>
            </h3>
            <span className={styles.tailCta}>
              Start a Conversation
              <span className={styles.tailArrow} aria-hidden="true" />
            </span>
          </div>
        </a>
      </div>
    </section>
  );
}
