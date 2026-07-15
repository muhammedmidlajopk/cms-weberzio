"use client";

import { useState, useEffect } from "react";
import styles from "./Services.module.css";

export default function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => setServices(data.services || []))
      .catch(() => {});
  }, []);

  if (services.length === 0) return null;

  return (
    <section id="services" className={styles.services}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div>
            <div className="section-number">01. SERVICES</div>
            <h2 className="section-title">
              My design services for
              <br />
              Your project or business
            </h2>
          </div>
          <p className={styles.description}>
            CRAFTING DIGITAL PRODUCTS SUCH AS WEBSITE & MOBILE APP DESIGN, BRAND
            IDENTITY, UI/UX, MOTION & INTERACTION DESIGN, AND INTERFACE DESIGN
            OF ANY COMPLEXITY.
          </p>
        </div>
      </div>
      <div className={styles.grid}>
        {services.map((service) => (
          <div key={service._id} className={styles.card}>
            <div className={styles.cardNumber}>{service.number}</div>
            <h3 className={styles.cardTitle}>{service.title}</h3>
            <p className={styles.cardDescription}>{service.description}</p>
            <div className={styles.cardTags}>
              {service.tags?.map((tag, j) => (
                <span key={j} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
