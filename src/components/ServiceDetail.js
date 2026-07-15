import Link from "next/link";
import { SERVICES } from "@/lib/services-data";
import styles from "./ServiceDetail.module.css";

export default function ServiceDetail({ service }) {
  const others = SERVICES.filter((s) => s.slug !== service.slug);

  return (
    <section className={styles.section}>
      <div className={styles.intro}>
        <span className={styles.eyebrow}>Service</span>
        <h2 className={styles.tagline}>{service.tagline}</h2>
        <p className={styles.description}>{service.description}</p>

        {service.tags?.length > 0 && (
          <ul className={styles.tags}>
            {service.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        )}
      </div>

      {service.highlights?.length > 0 && (
        <div className={styles.highlights}>
          <span className={styles.blockLabel}>What&apos;s included</span>
          <ul className={styles.highlightList}>
            {service.highlights.map((h, i) => (
              <li key={h} className={styles.highlightItem}>
                <span className={styles.highlightIndex}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={styles.related}>
        <span className={styles.blockLabel}>Other services</span>
        <ul className={styles.relatedList}>
          {others.map((s) => (
            <li key={s.slug}>
              <Link href={`/services/${s.slug}`} className={styles.relatedLink}>
                {s.title}
                <span className={styles.relatedArrow} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
