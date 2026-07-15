import styles from "./Highlights.module.css";

const STATS = [
  { value: "50+", label: "Products shipped", detail: "Web apps, SaaS platforms, and internal tools delivered to production." },
  { value: "10+", label: "Years engineering", detail: "Full-stack experience across startups, scale-ups, and enterprise teams." },
  { value: "99.9%", label: "Uptime targeted", detail: "Cloud infrastructure designed, monitored, and hardened for reliability." },
  { value: "24h", label: "Response time", detail: "We reply to project inquiries within one business day." },
];

export default function Highlights({ tagIndex = "03" }) {
  return (
    <section id="highlights" className={styles.section} aria-labelledby="highlights-heading">
      <header className={styles.header}>
        <span className={styles.tag}>
          <span className={styles.tagIndex}>{tagIndex}</span>
          Why teams choose us
        </span>
        <h2 id="highlights-heading" className={styles.title}>
          Engineering you can <span className={styles.titleAlt}>measure.</span>
        </h2>
        <p className={styles.lede}>
          We help startups and enterprises turn ambitious ideas into production-ready
          software — from the first commit through years of scale.
        </p>
      </header>

      <ul className={styles.grid}>
        {STATS.map((s) => (
          <li key={s.label} className={styles.card}>
            <span className={styles.value}>{s.value}</span>
            <span className={styles.label}>{s.label}</span>
            <p className={styles.detail}>{s.detail}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
