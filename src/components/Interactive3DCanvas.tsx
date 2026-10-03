"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";

interface Node {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  baseAlpha: number;
}

export default function Interactive3DCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;

    const isLight = theme === "light";

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    // Track mouse for 3D tilt effect
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;

    const onMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // 3D Nodes setup
    const NODE_COUNT = Math.min(Math.floor(width / 22), 60);
    const nodes: Node[] = [];

    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: (Math.random() - 0.5) * width * 1.2,
        y: (Math.random() - 0.5) * height * 1.2,
        z: Math.random() * 800 + 100,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        vz: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2.5 + 1.5,
        baseAlpha: Math.random() * 0.5 + 0.3,
      });
    }

    const render = () => {
      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const fov = 400;
      const cx = width / 2;
      const cy = height / 2;

      // Mouse shift offset
      const rotX = (mouseY - cy) * 0.0003;
      const rotY = (mouseX - cx) * 0.0003;

      const projected: { px: number; py: number; scale: number; alpha: number; node: Node }[] = [];

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // Move 3D coordinates
        node.x += node.vx;
        node.y += node.vy;
        node.z += node.vz;

        // Boundaries reset
        if (Math.abs(node.x) > width) node.x = (Math.random() - 0.5) * width;
        if (Math.abs(node.y) > height) node.y = (Math.random() - 0.5) * height;
        if (node.z < 50) node.z = 800;
        if (node.z > 900) node.z = 100;

        // Apply 3D perspective rotation
        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);
        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);

        const rx = node.x * cosY - node.z * sinY;
        let rz = node.x * sinY + node.z * cosY;
        const ry = node.y * cosX - rz * sinX;
        rz = node.y * sinX + rz * cosX;

        const scale = fov / (fov + rz);
        const px = cx + rx * scale;
        const py = cy + ry * scale;

        const distanceAlpha = Math.max(0, Math.min(1, 1 - rz / 900));

        projected.push({
          px,
          py,
          scale,
          alpha: distanceAlpha * node.baseAlpha,
          node,
        });
      }

      // Draw 3D Connection Lines
      const maxDistance = 140;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];

          const dx = p1.px - p2.px;
          const dy = p1.py - p2.py;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const edgeAlpha = (1 - dist / maxDistance) * 0.25 * Math.min(p1.alpha, p2.alpha);
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);

            if (isLight) {
              ctx.strokeStyle = `rgba(0, 82, 204, ${edgeAlpha * 1.5})`;
            } else {
              ctx.strokeStyle = `rgba(34, 211, 238, ${edgeAlpha * 1.8})`;
            }
            ctx.lineWidth = Math.min(p1.scale, p2.scale) * 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw Nodes
      for (let i = 0; i < projected.length; i++) {
        const { px, py, scale, alpha, node } = projected[i];
        if (px < -50 || px > width + 50 || py < -50 || py > height + 50) continue;

        ctx.beginPath();
        ctx.arc(px, py, node.size * scale, 0, Math.PI * 2);

        if (isLight) {
          ctx.fillStyle = `rgba(0, 82, 204, ${alpha * 1.2})`;
        } else {
          ctx.fillStyle = `rgba(34, 211, 238, ${alpha * 1.5})`;
        }
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
