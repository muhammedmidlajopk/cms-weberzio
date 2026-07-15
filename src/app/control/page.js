"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ExternalLink,
  Check,
  X,
  Settings,
  Search,
  Menu as MenuIcon,
  Package,
  Wrench,
  Globe,
  MessageSquareQuote,
} from "lucide-react";
import styles from "./page.module.css";

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ products: "…", services: "…", testimonials: "…" });
  const [settings, setSettings] = useState(null);
  const [menus, setMenus] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const [p, s, t, st, mn] = await Promise.all([
          fetch("/api/products").then((r) => r.json()),
          fetch("/api/services").then((r) => r.json()),
          fetch("/api/testimonials").then((r) => r.json()),
          fetch("/api/settings").then((r) => r.json()),
          fetch("/api/menus").then((r) => r.json()),
        ]);
        setCounts({
          products: p.products?.length ?? 0,
          services: s.services?.length ?? 0,
          testimonials: t.testimonials?.length ?? 0,
        });
        setSettings(st.settings || null);
        setMenus(mn.menus || null);
      } catch {
        setCounts({ products: "—", services: "—", testimonials: "—" });
      }
    }
    load();
  }, []);

  const stats = [
    { label: "Case Studies", value: counts.products, sub: "Home page projects", href: "/control/products" },
    { label: "Services", value: counts.services, sub: "Active", href: "/control/services" },
    { label: "Testimonials", value: counts.testimonials, sub: "Client quotes", href: "/control/testimonials" },
    { label: "Menu Items", value: menus ? (menus.header?.length || 0) + (menus.footer?.length || 0) : "…", sub: "Header + Footer", href: "/control/menus" },
  ];

  const seoScore = getSeoScore(settings);

  const shortcuts = [
    { href: "/control/settings", label: "Site Settings", desc: "Logo, favicon, site title", Icon: Settings },
    { href: "/control/seo", label: "SEO Meta", desc: "Titles, descriptions, OG images", Icon: Search },
    { href: "/control/menus", label: "Navigation", desc: "Header & footer menus", Icon: MenuIcon },
    { href: "/control/products", label: "Case Studies", desc: "Add or edit case studies", Icon: Package },
    { href: "/control/services", label: "Services", desc: "Manage services offered", Icon: Wrench },
    { href: "/control/testimonials", label: "Testimonials", desc: "Client quotes on the home page", Icon: MessageSquareQuote },
    { href: "/", label: "View Site", desc: "Open public site in a new tab", external: true, Icon: Globe },
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.welcome}>
        <div>
          <h1 className={styles.greeting}>Welcome back, Admin</h1>
          <p className={styles.subtitle}>
            {settings?.siteName ? (
              <>You&apos;re managing <b>{settings.siteName}</b>. Here&apos;s a snapshot.</>
            ) : (
              <>Here&apos;s an overview of your site.</>
            )}
          </p>
        </div>
        <div className={styles.headerActions}>
          <Link href="/" className={styles.ghostBtn} target="_blank">
            <ExternalLink size={14} strokeWidth={1.75} />
            View site
          </Link>
          <Link href="/control/settings" className={styles.primaryBtn}>
            <Settings size={14} strokeWidth={2} />
            Site Settings
          </Link>
        </div>
      </div>

      <div className={styles.statsGrid}>
        {stats.map((stat, i) => {
          const Card = stat.href ? Link : "div";
          const cardProps = stat.href ? { href: stat.href } : {};
          return (
            <Card key={i} className={styles.statCard} {...cardProps}>
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statLabel}>{stat.label}</div>
              <div className={styles.statSub}>{stat.sub}</div>
            </Card>
          );
        })}
      </div>

      <div className={styles.grid2}>
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2 className={styles.panelTitle}>SEO Health</h2>
              <p className={styles.panelSubtitle}>
                {seoScore.filled} of {seoScore.total} core fields configured
              </p>
            </div>
            <div className={styles.scoreRing} style={{ "--pct": `${seoScore.percent}%` }}>
              <span>{seoScore.percent}%</span>
            </div>
          </div>
          <ul className={styles.checklist}>
            {seoScore.checks.map((c, i) => (
              <li key={i} className={c.ok ? styles.checkOk : styles.checkMiss}>
                <span className={styles.checkDot}>
                  {c.ok ? <Check size={10} strokeWidth={2.5} /> : <X size={10} strokeWidth={2.5} />}
                </span>
                {c.label}
              </li>
            ))}
          </ul>
          <Link href="/control/seo" className={styles.panelLink}>
            Configure SEO →
          </Link>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2 className={styles.panelTitle}>Site Identity</h2>
              <p className={styles.panelSubtitle}>Logo, favicon and brand info</p>
            </div>
          </div>
          <div className={styles.identity}>
            <div className={styles.identityItem}>
              <div className={styles.identityPreview}>
                {settings?.logoUrl ? (
                  <img src={settings.logoUrl} alt="Logo" />
                ) : (
                  <span className={styles.identityEmpty}>No logo</span>
                )}
              </div>
              <div>
                <div className={styles.identityLabel}>Logo</div>
                <div className={styles.identitySub}>
                  {settings?.logoUrl ? "Configured" : "Not set"}
                </div>
              </div>
            </div>
            <div className={styles.identityItem}>
              <div className={styles.identityPreview + " " + styles.identityPreviewSm}>
                {settings?.faviconUrl ? (
                  <img src={settings.faviconUrl} alt="Favicon" />
                ) : (
                  <span className={styles.identityEmpty}>—</span>
                )}
              </div>
              <div>
                <div className={styles.identityLabel}>Favicon</div>
                <div className={styles.identitySub}>
                  {settings?.faviconUrl ? "Configured" : "Not set"}
                </div>
              </div>
            </div>
            <div className={styles.identityItem}>
              <div>
                <div className={styles.identityLabel}>Site Name</div>
                <div className={styles.identitySub}>{settings?.siteName || "—"}</div>
              </div>
            </div>
            <div className={styles.identityItem}>
              <div>
                <div className={styles.identityLabel}>Home Title</div>
                <div className={styles.identitySub}>{settings?.homeTitle || "—"}</div>
              </div>
            </div>
          </div>
          <Link href="/control/settings" className={styles.panelLink}>
            Edit identity →
          </Link>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Shortcuts</h2>
        <div className={styles.linksGrid}>
          {shortcuts.map((link, i) => {
            const Icon = link.Icon;
            return (
              <Link
                key={i}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                className={styles.quickLink}
              >
                <span className={styles.quickLinkIcon}>
                  <Icon size={16} strokeWidth={1.75} />
                </span>
                <div className={styles.quickLinkText}>
                  <div className={styles.quickLinkLabel}>{link.label}</div>
                  <div className={styles.quickLinkDesc}>{link.desc}</div>
                </div>
                <ChevronRight size={16} strokeWidth={1.75} />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function getSeoScore(settings) {
  const checks = [
    { label: "Site name", ok: !!settings?.siteName },
    { label: "Home page title", ok: !!settings?.homeTitle },
    { label: "Home description", ok: !!settings?.homeDescription },
    { label: "Keywords", ok: !!settings?.keywords },
    { label: "Open Graph image", ok: !!settings?.ogImageUrl },
    { label: "Favicon", ok: !!settings?.faviconUrl },
  ];
  const filled = checks.filter((c) => c.ok).length;
  const percent = Math.round((filled / checks.length) * 100);
  return { checks, filled, total: checks.length, percent };
}
