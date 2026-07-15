"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Wrench,
  Menu as MenuIcon,
  Search,
  Settings,
  ChevronLeft,
  ExternalLink,
  LogOut,
  FileText,
  Tag,
  MessageSquareQuote,
} from "lucide-react";
import styles from "./layout.module.css";

const navItems = [
  { href: "/control", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/control/products", label: "Case Studies", Icon: Package },
  { href: "/control/services", label: "Services", Icon: Wrench },
  { href: "/control/testimonials", label: "Testimonials", Icon: MessageSquareQuote },
  { href: "/control/menus", label: "Menus", Icon: MenuIcon },
  {
    href: "/control/seo",
    label: "SEO",
    Icon: Search,
    children: [
      { href: "/control/seo", label: "Meta Tags", Icon: Tag },
      { href: "/control/seo/files", label: "SEO Files", Icon: FileText },
    ],
  },
  { href: "/control/settings", label: "Settings", Icon: Settings },
];

function findLabel(items, path) {
  for (const item of items) {
    if (item.href === path) return item.label;
    if (item.children) {
      const child = item.children.find((c) => c.href === path);
      if (child) return child.label;
    }
  }
  return null;
}

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/control/login";

  const [sidebarOpen, setSidebarOpen] = useState(true);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/control/login";
  }

  if (isLoginPage) {
    return children;
  }

  return (
    <div className={styles.layout}>
      <aside className={`${styles.sidebar} ${!sidebarOpen ? styles.sidebarCollapsed : ""}`}>
        <div className={styles.sidebarHeader}>
          <Link href="/control" className={styles.logo}>
            {sidebarOpen ? "Admin Panel" : "AP"}
          </Link>
          <button
            className={styles.toggle}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <ChevronLeft
              size={18}
              style={{ transform: sidebarOpen ? "none" : "rotate(180deg)", transition: "transform 0.2s ease" }}
            />
          </button>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => {
            const Icon = item.Icon;
            const inSection = pathname === item.href || pathname.startsWith(item.href + "/");
            const isActive = pathname === item.href;
            const showChildren = sidebarOpen && item.children && inSection;
            return (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <span className={styles.navIcon}>
                    <Icon size={16} strokeWidth={1.75} />
                  </span>
                  {sidebarOpen && <span>{item.label}</span>}
                </Link>
                {showChildren && (
                  <div className={styles.subNav}>
                    {item.children.map((child) => {
                      const ChildIcon = child.Icon;
                      const childActive = pathname === child.href;
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`${styles.subNavItem} ${childActive ? styles.subNavItemActive : ""}`}
                        >
                          <ChildIcon size={13} strokeWidth={1.75} />
                          <span>{child.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/" className={styles.viewSite} title={!sidebarOpen ? "View Site" : undefined}>
            <ExternalLink size={14} strokeWidth={1.75} />
            {sidebarOpen && <span>View Site</span>}
          </Link>
          <button onClick={handleLogout} className={styles.logoutButton} title={!sidebarOpen ? "Logout" : undefined}>
            <LogOut size={14} strokeWidth={1.75} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <main className={`${styles.main} ${!sidebarOpen ? styles.mainExpanded : ""}`}>
        <header className={styles.topbar}>
          <div className={styles.topbarTitle}>
            {findLabel(navItems, pathname) || "Admin"}
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className={styles.mobileToggle}>
            <MenuIcon size={20} strokeWidth={1.75} />
          </button>
        </header>
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
}
