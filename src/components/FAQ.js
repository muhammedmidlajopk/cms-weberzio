"use client";

import { useState } from "react";
import styles from "./FAQ.module.css";

const FAQS = [
  {
    q: "What kind of projects do you take on?",
    a: "We build custom web applications, SaaS platforms, marketing sites, internal tools, and APIs. Typical engagements range from a focused two-week sprint to multi-quarter product builds — with startups, growing scale-ups, and enterprise product teams.",
  },
  {
    q: "Which technologies do you specialise in?",
    a: "Our core stack is Next.js and React on the frontend, Node.js on the backend, and PostgreSQL or MongoDB for data. We regularly work with TypeScript, Tailwind, Prisma, Stripe, and deploy on Vercel, AWS, and Google Cloud.",
  },
  {
    q: "How do you price a project?",
    a: "Most work is scoped as a fixed-price milestone (for well-defined features) or a monthly retainer (for ongoing product engineering). We share a written proposal with scope, timeline, and pricing before any work begins.",
  },
  {
    q: "How long does a typical build take?",
    a: "A polished marketing site takes 2–4 weeks. A production MVP takes 6–12 weeks. Larger SaaS platforms run in three-month milestone blocks with continuous delivery from week one.",
  },
  {
    q: "Do you work with existing codebases?",
    a: "Yes — we join existing teams, audit legacy applications, and take over stalled projects. We start with a short discovery phase to map the code, identify risks, and agree on the first shipping milestone.",
  },
  {
    q: "How do we get started?",
    a: "Send a note through the contact form with a short description of what you're building. We reply within one business day and set up a call to discuss scope, timeline, and next steps.",
  },
];

export default function FAQ({ tagIndex = "05" }) {
  const [openIndex, setOpenIndex] = useState(0);

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <section id="faq" className={styles.section} aria-labelledby="faq-heading">
      <header className={styles.header}>
        <span className={styles.tag}>
          <span className={styles.tagIndex}>{tagIndex}</span>
          FAQ
        </span>
        <h2 id="faq-heading" className={styles.title}>
          Answers before you <span className={styles.titleAlt}>ask.</span>
        </h2>
      </header>

      <ul className={styles.list}>
        {FAQS.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <li key={item.q} className={`${styles.item} ${isOpen ? styles.itemOpen : ""}`}>
              <button
                type="button"
                className={styles.question}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                id={`faq-trigger-${i}`}
                onClick={() => setOpenIndex(isOpen ? -1 : i)}
              >
                <span className={styles.qText}>{item.q}</span>
                <span className={styles.icon} aria-hidden="true">
                  <span />
                  <span />
                </span>
              </button>
              <div
                id={`faq-panel-${i}`}
                role="region"
                aria-labelledby={`faq-trigger-${i}`}
                className={styles.panel}
                hidden={!isOpen}
              >
                <p className={styles.answer}>{item.a}</p>
              </div>
            </li>
          );
        })}
      </ul>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
    </section>
  );
}
