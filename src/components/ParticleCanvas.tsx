"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  r: number; a: number;
}

/**
 * Interactive particle-network background.
 *
 * Upgrades over the original: DPR-aware rendering (no blur on retina),
 * cursor attraction + a highlighted link radius around the pointer, and
 * density scaled to viewport so phones don't run a 65-node O(n²) loop.
 * Respects prefers-reduced-motion by drawing a single static frame.
 */
export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let W = 0, H = 0, dpr = 1;
    let raf = 0;
    const particles: Particle[] = [];
    const mouse = { x: -9999, y: -9999, active: false };

    const MAX_DIST = 132;
    const MOUSE_DIST = 180;

    function resize() {
      const parent = canvas!.parentElement;
      W = parent ? parent.offsetWidth : window.innerWidth;
      H = parent ? parent.offsetHeight : window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas!.width = Math.floor(W * dpr);
      canvas!.height = Math.floor(H * dpr);
      canvas!.style.width = `${W}px`;
      canvas!.style.height = `${H}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Scale node count to area, capped for perf on large screens.
      const target = Math.round(Math.min(Math.max((W * H) / 19000, 26), 78));

      particles.length = 0;
      for (let i = 0; i < target; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.32,
          vy: (Math.random() - 0.5) * 0.32,
          r: Math.random() * 1.6 + 0.6,
          a: Math.random() * 0.4 + 0.2,
        });
      }
    }

    function draw() {
      const n = particles.length;
      ctx!.clearRect(0, 0, W, H);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // Gentle attraction toward the cursor
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < MOUSE_DIST * MOUSE_DIST && d2 > 1) {
            const d = Math.sqrt(d2);
            const f = (1 - d / MOUSE_DIST) * 0.035;
            p.vx += (dx / d) * f;
            p.vy += (dy / d) * f;
          }
        }

        // Damp so attraction doesn't accumulate into runaway speed
        p.vx = Math.max(-0.85, Math.min(0.85, p.vx * 0.995));
        p.vy = Math.max(-0.85, Math.min(0.85, p.vy * 0.995));

        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        p.x = Math.max(0, Math.min(W, p.x));
        p.y = Math.max(0, Math.min(H, p.y));

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(0, 170, 255, ${p.a})`;
        ctx!.fill();
      }

      // Links between nearby nodes
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.hypot(dx, dy);
          if (d < MAX_DIST) {
            ctx!.beginPath();
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.strokeStyle = `rgba(0, 119, 255, ${(1 - d / MAX_DIST) * 0.2})`;
            ctx!.lineWidth = 0.8;
            ctx!.stroke();
          }
        }
      }

      // Brighter links from the cursor — makes the field feel responsive
      if (mouse.active) {
        for (const p of particles) {
          const d = Math.hypot(mouse.x - p.x, mouse.y - p.y);
          if (d < MOUSE_DIST) {
            ctx!.beginPath();
            ctx!.moveTo(mouse.x, mouse.y);
            ctx!.lineTo(p.x, p.y);
            ctx!.strokeStyle = `rgba(34, 211, 238, ${(1 - d / MOUSE_DIST) * 0.4})`;
            ctx!.lineWidth = 1;
            ctx!.stroke();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    }

    function onMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    }
    function onLeave() {
      mouse.active = false;
      mouse.x = mouse.y = -9999;
    }

    resize();

    if (reduce) {
      // Single static frame — still decorative, no animation loop.
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 170, 255, ${p.a})`;
        ctx.fill();
      }
    } else {
      draw();
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerleave", onLeave, { passive: true });
    }

    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
