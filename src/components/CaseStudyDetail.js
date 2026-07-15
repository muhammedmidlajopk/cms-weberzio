import Link from "next/link";
import styles from "./CaseStudyDetail.module.css";

export default function CaseStudyDetail({ item }) {
  const {
    imageUrl,
    year,
    client,
    role,
    liveUrl,
    summary,
    tags,
    results,
    gallery,
  } = item;

  const facts = [
    client && { label: "Client", value: client },
    role && { label: "Role", value: role },
    year && { label: "Year", value: year },
    liveUrl && {
      label: "Live",
      value: (
        <a href={liveUrl} target="_blank" rel="noreferrer" className={styles.factLink}>
          Visit site ↗
        </a>
      ),
    },
  ].filter(Boolean);

  return (
    <section className={styles.section}>
      {imageUrl && (
        <div className={styles.cover}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt={item.title} />
        </div>
      )}

      <div className={styles.body}>
        <div className={styles.main}>
          {summary && (
            <div className={styles.summary}>
              {summary.split("\n").filter(Boolean).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          )}

          {Array.isArray(results) && results.length > 0 && (
            <div className={styles.block}>
              <h2 className={styles.blockTitle}>Results</h2>
              <ul className={styles.results}>
                {results.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}

          {Array.isArray(gallery) && gallery.length > 0 && (
            <div className={styles.block}>
              <h2 className={styles.blockTitle}>Gallery</h2>
              <div className={styles.gallery}>
                {gallery.map((url, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={url + i} src={url} alt={`${item.title} — ${i + 1}`} />
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className={styles.sidebar}>
          {facts.length > 0 && (
            <dl className={styles.facts}>
              {facts.map((f) => (
                <div key={f.label} className={styles.fact}>
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {Array.isArray(tags) && tags.length > 0 && (
            <div className={styles.tagsBlock}>
              <div className={styles.tagsLabel}>Stack</div>
              <ul className={styles.tags}>
                {tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          )}

          <Link href="/#work" className={styles.back}>
            ← All case studies
          </Link>
        </aside>
      </div>
    </section>
  );
}
