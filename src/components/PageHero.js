import styles from "./PageHero.module.css";

export default function PageHero({ eyebrow, title, titleAlt, description }) {
  return (
    <section className={styles.hero}>
      <div className={styles.glow} aria-hidden="true">
        <span className={styles.blob} />
      </div>

      <div className={styles.inner}>
        <span className={styles.dot} aria-hidden="true" />

        {eyebrow && (
          <span className={styles.eyebrow}>
            <span className={styles.eyebrowIndex}>00</span>
            {eyebrow}
          </span>
        )}

        <h1 className={styles.title}>
          {title}
          {titleAlt && (
            <>
              {" "}
              <span className={styles.titleAlt}>{titleAlt}</span>
            </>
          )}
        </h1>

        {description && <p className={styles.description}>{description}</p>}
      </div>
    </section>
  );
}
