"use client";

import { useState, useEffect } from "react";
import styles from "./Products.module.css";

function ProductIcon() {
  return (
    <svg
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: 60, height: 60, opacity: 0.2 }}
    >
      <rect x="4" y="4" width="52" height="52" rx="8" stroke="white" strokeWidth="1.5" />
      <rect x="14" y="14" width="32" height="24" rx="4" stroke="white" strokeWidth="1" />
      <line x1="20" y1="44" x2="40" y2="44" stroke="white" strokeWidth="1" />
    </svg>
  );
}

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .catch(() => {});
  }, []);

  if (products.length === 0) return null;

  return (
    <section className={styles.products}>
      <div className={styles.sectionHeader}>
        <div className={styles.titleGroup}>
          <span className={styles.tag}>Store</span>
          <h2 className={styles.title}>Digital Products</h2>
        </div>
      </div>
      <div className={styles.grid}>
        {products.map((product) => (
          <div key={product._id} className={styles.card}>
            <div className={styles.cardImage}>
              <ProductIcon />
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{product.title}</h3>
              <span className={styles.cardMeta}>{product.meta}</span>
              <div className={`${styles.cardPrice} ${product.free ? styles.free : ""}`}>
                {product.price}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
