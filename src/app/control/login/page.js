"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import styles from "./page.module.css";

export default function AdminLogin() {
  return (
    <Suspense fallback={<div className={styles.page} />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "same-origin",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Login failed");
      }

      const next = searchParams.get("next");
      const target = next && next.startsWith("/control") ? next : "/control";
      window.location.href = target;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (typeof e.getModifierState === "function") {
      setCapsLock(e.getModifierState("CapsLock"));
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.aurora} aria-hidden="true">
        <span className={styles.blob1} />
        <span className={styles.blob2} />
        <span className={styles.blob3} />
      </div>
      <div className={styles.grid} aria-hidden="true" />

      <div className={styles.shell}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandMark} />
          <span>Admin</span>
        </Link>

        <div className={styles.card}>
          <div className={styles.header}>
            <span className={styles.badge}>
              <span className={styles.badgeDot} />
              Secure area
            </span>
            <h1 className={styles.title}>Welcome back</h1>
            <p className={styles.subtitle}>
              Sign in to your admin panel to manage the site.
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            {error && (
              <div className={styles.error} role="alert">
                <AlertCircle size={16} strokeWidth={1.75} />
                <span>{error}</span>
              </div>
            )}

            <div className={styles.field}>
              <label htmlFor="username" className={styles.label}>
                Username
              </label>
              <div className={styles.inputWrap}>
                <User className={styles.inputIcon} size={16} strokeWidth={1.75} />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={styles.input}
                  placeholder="your username"
                  autoComplete="username"
                  autoFocus
                  required
                />
              </div>
            </div>

            <div className={styles.field}>
              <div className={styles.labelRow}>
                <label htmlFor="password" className={styles.label}>
                  Password
                </label>
                {capsLock && (
                  <span className={styles.hint}>Caps Lock is on</span>
                )}
              </div>
              <div className={styles.inputWrap}>
                <Lock className={styles.inputIcon} size={16} strokeWidth={1.75} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKey}
                  onKeyUp={handleKey}
                  className={styles.input}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className={styles.reveal}
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <Eye size={16} strokeWidth={1.75} />
                  ) : (
                    <EyeOff size={16} strokeWidth={1.75} />
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? (
                <span className={styles.spinner} />
              ) : (
                <>
                  Sign in
                  <ArrowRight size={14} strokeWidth={2} />
                </>
              )}
            </button>
          </form>

          <div className={styles.divider}>
            <span>protected by session cookie</span>
          </div>

          <Link href="/" className={styles.backLink}>
            <ArrowLeft size={12} strokeWidth={1.75} />
            Back to website
          </Link>
        </div>

        <p className={styles.footnote}>
          Authorized personnel only. All activity is logged.
        </p>
      </div>
    </div>
  );
}
