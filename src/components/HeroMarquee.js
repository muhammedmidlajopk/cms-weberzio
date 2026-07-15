import styles from "./HeroMarquee.module.css";

const services = [
  "Website & Mobile Design",
  "Brand Identity",
  "UI & UX",
  "Motion & Interaction",
  "Product Design",
];

export default function HeroMarquee() {
  const marqueeItems = services.map((service, i) => (
    <span key={i} className={styles.marqueeItem}>
      {service}
      <span className={styles.marqueeSeparator}>*</span>
    </span>
  ));

  return (
    <section className={styles.hero}>
      <div className={styles.marqueeWrapper}>
        <div className={styles.marqueeTrack}>
          {marqueeItems}
          {marqueeItems}
        </div>
      </div>
      <div className={styles.marqueeWrapper}>
        <div className={styles.marqueeTrackReverse}>
          {marqueeItems}
          {marqueeItems}
        </div>
      </div>
      <div className={styles.heroBottom}>
        <div className={styles.heroTitle}>
          <h1>
            weberzio<br />
            <span className={styles.highlight}>UX/UI Designer</span>
          </h1>
        </div>
        <div className={styles.scrollIndicator}>
          <span>Scroll</span>
          <div className={styles.scrollLine} />
        </div>
      </div>
    </section>
  );
}
