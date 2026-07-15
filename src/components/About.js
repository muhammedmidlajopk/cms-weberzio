import Link from "next/link";
import { SERVICES } from "@/lib/services-data";
import styles from "./About.module.css";

const facts = [
  { label: "HQ", value: "Remote / Distributed" },
  { label: "Focus", value: "Web & Software" },
  { label: "Founded", value: "2018" },
  { label: "Availability", value: "Q3 · 2026" },
];

export default function About({ tagIndex = "02" }) {
  return (
    <section id="about" className={styles.section}>
      <header className={styles.header}>
        <span className={styles.tag}>
          <span className={styles.tagIndex}>{tagIndex}</span>
          About
        </span>
        <h2 className={styles.title}>
          A small team with <span className={styles.titleAlt}>deep</span>{" "}
          engineering <span className={styles.titleAlt}>expertise.</span>
        </h2>
      </header>

      <div className={styles.body}>
        <div className={styles.copy}>
          <p>
            We partner with founders, product teams, and enterprises to design
            and build software that solves real problems. From early-stage
            MVPs to production-grade platforms, we own the full stack.
          </p>
          <p>
            Our engineers care about clean architecture, performance, and code
            that&apos;s easy to maintain. Ship fast, ship stable, and build for
            what comes next.
          </p>
        </div>

        <ul className={styles.facts}>
          {facts.map((f) => (
            <li key={f.label} className={styles.fact}>
              <span className={styles.factLabel}>{f.label}</span>
              <span className={styles.factValue}>{f.value}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.services}>
        <span className={styles.servicesLabel}>Services</span>
        <ul className={styles.servicesList}>
          {SERVICES.map((s) => (
            <li key={s.slug} className={styles.servicesItem}>
              <Link href={`/services/${s.slug}`} className={styles.servicesLink}>
                {s.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
