import styles from "./Process.module.css";

const steps = [
  {
    label: "Discovery",
    title: "Understand the problem.",
    desc: "We start by asking questions. Business goals, user needs, constraints. Nothing gets built until the shape of the problem is clear.",
  },
  {
    label: "Scope",
    title: "Plan the smallest useful thing.",
    desc: "A written plan with milestones, deliverables, and explicit trade-offs. You always know what's coming next and why.",
  },
  {
    label: "Build",
    title: "Ship in short iterations.",
    desc: "Working software every week, deployed to a staging URL. Feedback loops stay tight and course-corrections are cheap.",
  },
  {
    label: "Launch",
    title: "Roll out with confidence.",
    desc: "Monitoring, docs, and handover if you need them. Go-lives are boring because everything was tested twice.",
  },
];

export default function Process() {
  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <span className={styles.tag}>
          <span className={styles.tagIndex}>02</span>
          Process
        </span>
        <h2 className={styles.title}>
          How we <span className={styles.titleAlt}>work.</span>
        </h2>
        <p className={styles.desc}>
          A predictable four-phase engagement. No surprises, no scope creep,
          and no invoices you haven&apos;t seen coming.
        </p>
      </header>

      <ol className={styles.list}>
        {steps.map((step, i) => (
          <li key={step.label} className={styles.step} style={{ "--i": i }}>
            <div className={styles.stepIndex}>0{i + 1}</div>
            <div className={styles.stepMeta}>{step.label}</div>
            <h3 className={styles.stepTitle}>{step.title}</h3>
            <p className={styles.stepDesc}>{step.desc}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
