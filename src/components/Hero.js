import styles from "./Hero.module.css";

export default function Hero({ siteName = "weberzio", tagline = "UX/UI Designer" }) {
  return (
    <section id="top" className={styles.hero}>
      <div className={styles.glow} aria-hidden="true">
        <span className={styles.glow1} />
        <span className={styles.glow2} />
      </div>

      <div className={styles.inner}>
        <span className={styles.dot} aria-hidden="true" />

        <p className={styles.greeting}>Hi, we&apos;re {siteName}.</p>

        <h1 className={styles.title}>
          <span className={styles.titleLine}>
            <span className={styles.reveal}>We</span>{" "}
            <span className={styles.reveal}>build</span>{" "}
            <span className={styles.reveal}>software</span>
          </span>
          <span className={styles.titleLine}>
            <span className={styles.reveal}>
              <span className={styles.outline}>that</span>
            </span>{" "}
            <span className={styles.reveal}>scales</span>{" "}
            <span className={styles.reveal}>with</span>
          </span>
          <span className={styles.titleLine}>
            <span className={styles.reveal}>
              <span className={styles.outline}>your</span>
            </span>{" "}
            <span className={styles.reveal}>business.</span>
          </span>
        </h1>

        <div className={styles.footer}>
          <a href="#work" className={styles.badge} aria-label="View our projects">
            <BadgeRing text={`View Projects · ${siteName} · Case Studies · `} />
            <span className={styles.badgeCenter}>
              <span className={styles.badgeArrow} aria-hidden="true" />
              <span className={styles.badgeLabel}>View Projects</span>
            </span>
          </a>

          <p className={styles.description}>
            A web development and software solutions team helping startups and
            enterprises ship reliable products &mdash; from web apps and APIs
            to cloud infrastructure and internal tools built for scale.
          </p>
        </div>
      </div>
    </section>
  );
}

function BadgeRing({ text }) {
  return (
    <svg viewBox="0 0 200 200" className={styles.badgeRing} aria-hidden="true">
      <defs>
        <path
          id="badge-circle"
          d="M 100, 100 m -80, 0 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0"
        />
      </defs>
      <text className={styles.badgeText}>
        <textPath href="#badge-circle" startOffset="0">
          {text.repeat(2)}
        </textPath>
      </text>
    </svg>
  );
}
