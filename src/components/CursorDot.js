"use client";

import { useEffect, useRef } from "react";
import styles from "./CursorDot.module.css";

export default function CursorDot() {
  const dotRef = useRef(null);
  const posRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    let rafId = null;

    const onMouseMove = (e) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseLeave = () => {
      dot.style.opacity = "0";
    };

    const onMouseEnter = () => {
      dot.style.opacity = "1";
    };

    let isFirstMove = true;

    const onFirstMove = (e) => {
      if (isFirstMove) {
        isFirstMove = false;
        posRef.current = { x: e.clientX, y: e.clientY };
        targetRef.current = { x: e.clientX, y: e.clientY };
        dot.style.opacity = "1";
      }
    };

    const animate = () => {
      const { x: cx, y: cy } = posRef.current;
      const { x: tx, y: ty } = targetRef.current;

      const dx = tx - cx;
      const dy = ty - cy;

      // Smooth chasing effect using lerp
      const ease = 0.12;
      posRef.current = {
        x: cx + dx * ease,
        y: cy + dy * ease,
      };

      dot.style.translate = `${posRef.current.x - 4}px ${posRef.current.y - 4}px`;
      rafId = requestAnimationFrame(animate);
    };

    // Wait for first mouse move before starting
    const handleFirstMove = (e) => {
      onFirstMove(e);
      animate();
      window.removeEventListener("mousemove", handleFirstMove);
      window.addEventListener("mousemove", onMouseMove);
    };

    window.addEventListener("mouseenter", onMouseEnter);
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("mousemove", handleFirstMove);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("mouseenter", onMouseEnter);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("mousemove", handleFirstMove);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return <div ref={dotRef} className={styles.dot} />;
}
