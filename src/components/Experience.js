import styles from "./Experience.module.css";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CEO",
    company: "MEG-Analytics",
    quote: "Working with this designer was a game-changer for our product. The attention to detail and user-centric approach resulted in a 40% increase in user engagement within the first quarter.",
    rating: 5,
  },
  {
    name: "James Mitchell",
    role: "CTO",
    company: "SENLAINC",
    quote: "Exceptional UX/UI work that transformed our platform. The redesign was intuitive, beautiful, and our clients consistently praise the new experience. Truly world-class design thinking.",
    rating: 5,
  },
  {
    name: "Elena Rodriguez",
    role: "Product Manager",
    company: "TechVentures",
    quote: "I've worked with many designers, but none brought the level of strategic thinking and creative excellence as this one. Every pixel served a purpose, every interaction felt natural.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Engineering Director",
    company: "NexGen Systems",
    quote: "A rare combination of creative vision and technical precision. The design system they built for us scaled beautifully across our entire product ecosystem.",
    rating: 5,
  },
  {
    name: "Aiko Tanaka",
    role: "Founder",
    company: "DesignLab Studio",
    quote: "Working together on multiple projects has been an absolute pleasure. The ability to take complex requirements and turn them into elegant, usable interfaces is unmatched.",
    rating: 5,
  },
];

function StarRating({ rating }) {
  return (
    <div className={styles.stars} aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`${styles.star} ${i < rating ? styles.starFilled : ""}`}
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
        >
          <path
            d="M7 0L8.57 4.83L13.66 5.03L9.56 8.33L10.82 13.27L7 10.24L3.18 13.27L4.44 8.33L0.34 5.03L5.43 4.83L7 0Z"
            fill="currentColor"
          />
        </svg>
      ))}
    </div>
  );
}

export default function Experience() {
  return (
    <section id="testimonials" className={styles.testimonials}>
      <div className={styles.header}>
        <div className="section-number">03. CLIENT TESTIMONIALS</div>
        <h2 className="section-title">
          What people say about
          <br />
          working with me.
        </h2>
      </div>
      <div className={styles.grid}>
        {testimonials.map((t, i) => (
          <div key={i} className={styles.card}>
            <div className={styles.quoteIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M10 11H6C5.44772 11 5 10.5523 5 10V7C5 5.89543 5.89543 5 7 5H10C11.1046 5 12 5.89543 12 7V11.5C12 14.5376 10.5 17 7 19"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M21 11H17C16.4477 11 16 10.5523 16 10V7C16 5.89543 16.8954 5 18 5H21C22.1046 5 23 5.89543 23 7V11.5C23 14.5376 21.5 17 18 19"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <blockquote className={styles.quote}>
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <StarRating rating={t.rating} />
            <div className={styles.author}>
              <div className={styles.avatar}>
                <span>{t.name.split(" ").map(n => n[0]).join("")}</span>
              </div>
              <div className={styles.authorInfo}>
                <span className={styles.authorName}>{t.name}</span>
                <span className={styles.authorRole}>
                  {t.role}, {t.company}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
