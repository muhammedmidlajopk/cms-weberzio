export const SERVICES = [
  {
    slug: "web-application-development",
    title: "Web Application Development",
    tagline: "Full-stack Next.js and React applications built for scale.",
    description:
      "We design and ship production-grade web apps with clean architecture, strong typing, and a focus on measurable performance.",
    tags: ["Next.js", "React", "TypeScript", "Node.js"],
    highlights: [
      "Server-rendered Next.js apps tuned for Core Web Vitals",
      "Component systems and design tokens that scale across teams",
      "End-to-end type safety across frontend, API, and database",
      "Automated testing, previews, and CI-driven deployments",
    ],
  },
  {
    slug: "saas-product-engineering",
    title: "SaaS & Product Engineering",
    tagline: "From MVP to production platform.",
    description:
      "Auth, billing, dashboards, admin panels — the whole stack, iterated with your team from validation to scale.",
    tags: ["SaaS", "Stripe", "Multi-tenant", "Admin"],
    highlights: [
      "Multi-tenant architecture with role-based access",
      "Subscription billing, metering, and Stripe integration",
      "Product analytics, feature flags, and experimentation",
      "Internal admin tooling for support and operations",
    ],
  },
  {
    slug: "api-backend-systems",
    title: "API & Backend Systems",
    tagline: "REST and GraphQL APIs your team can build on.",
    description:
      "Background jobs, integrations, and event-driven systems that are documented, testable, and observable in production.",
    tags: ["REST", "GraphQL", "PostgreSQL", "MongoDB"],
    highlights: [
      "Well-documented REST and GraphQL contracts",
      "Queues, workers, and event pipelines that recover from failure",
      "Third-party integrations with retries and idempotency",
      "Structured logging, tracing, and metrics from day one",
    ],
  },
  {
    slug: "cloud-infrastructure-devops",
    title: "Cloud Infrastructure & DevOps",
    tagline: "Ship reliably. Sleep well.",
    description:
      "Vercel, AWS, and containerized deployments with CI/CD, observability, and cost-conscious infrastructure decisions.",
    tags: ["AWS", "Vercel", "Docker", "CI/CD"],
    highlights: [
      "Infrastructure as code with Terraform or Pulumi",
      "CI/CD pipelines with preview environments per PR",
      "Observability: logs, metrics, alerts, and dashboards",
      "Cost reviews and rightsizing recommendations",
    ],
  },
  {
    slug: "ecommerce-solutions",
    title: "E-commerce Solutions",
    tagline: "Storefronts and checkouts that convert.",
    description:
      "Custom storefronts, headless commerce integrations, and checkout flows built for speed and conversion.",
    tags: ["Shopify", "Stripe", "Headless", "Checkout"],
    highlights: [
      "Headless storefronts on Shopify, BigCommerce, or custom",
      "Optimized checkout flows and payment integrations",
      "Product, inventory, and order sync across systems",
      "Merchandising tools and content-driven landing pages",
    ],
  },
  {
    slug: "technical-consulting",
    title: "Technical Consulting",
    tagline: "A senior perspective, when you need one.",
    description:
      "Architecture reviews, tech-stack decisions, and second opinions to help your team make confident calls.",
    tags: ["Architecture", "Audit", "Strategy", "Hiring"],
    highlights: [
      "Codebase and architecture audits with actionable reports",
      "Technology selection and migration planning",
      "Hiring support: rubrics, interview loops, and calibration",
      "Fractional CTO engagements for early-stage teams",
    ],
  },
];

export function getServiceBySlug(slug) {
  return SERVICES.find((s) => s.slug === slug) || null;
}
