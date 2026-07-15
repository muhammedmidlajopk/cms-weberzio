import styles from "./Stats.module.css";

const stats = [
  "UI8 Author",
  "7 Years Of Experience",
  "50+ Completed Projects",
  "500+ Sales",
];

export default function Stats() {
  const items = stats.map((stat, i) => (
    <span key={i} className={styles.item}>
      {stat}
      <span className={styles.separator}>*</span>
    </span>
  ));

  return (
    <section className={styles.stats}>
      <div className={styles.marqueeWrapper}>
        <div className={styles.marqueeTrack}>
          {items}
          {items}
        </div>
      </div>
    </section>
  );
}
