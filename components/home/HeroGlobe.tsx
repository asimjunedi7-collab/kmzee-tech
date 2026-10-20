"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import landDots from "@/data/land-dots.json";

type Vec3 = [number, number, number];

type Link = {
  a: number;
  b: number;
  start: number; // seconds
  life: number; // seconds
  speed: number; // packet laps per second
  offset: number; // where the packet starts along the arc (0..1)
  lift: number; // how far the arc rises off the surface
};

type Colors = { land: string; link: string; packet: string; ocean: string; halo: string; accent: string };

const TILT = 0.38; // axial tilt, in radians
const SPIN = 0.085; // idle rotation, radians per second
const SPAWN_PER_SECOND = 4; // new connections per second
const MAX_LINKS = 20;
const LINK_LIFE = 3.4; // seconds a connection stays visible

// Land points on the unit sphere, from data/land-dots.json (built by scripts/build-land.mjs).
const DOTS: Vec3[] = (landDots as [number, number][]).map(([lat, lon]) => {
  const phi = (lat * Math.PI) / 180;
  const lam = (lon * Math.PI) / 180;
  return [Math.cos(phi) * Math.sin(lam), Math.sin(phi), Math.cos(phi) * Math.cos(lam)];
});

const COS_TILT = Math.cos(TILT);
const SIN_TILT = Math.sin(TILT);

function dot(a: Vec3, b: Vec3) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

// Spin around the vertical axis, then tilt. Writes [x (right), y (up), depth (toward viewer)] into out.
function project(p: Vec3, angle: number, out: number[]) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const x1 = p[0] * cos + p[2] * sin;
  const z1 = -p[0] * sin + p[2] * cos;
  out[0] = x1;
  out[1] = p[1] * COS_TILT - z1 * SIN_TILT;
  out[2] = p[1] * SIN_TILT + z1 * COS_TILT;
}

function quadratic(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, t: number) {
  const u = 1 - t;
  return {
    x: u * u * x0 + 2 * u * t * x1 + t * t * x2,
    y: u * u * y0 + 2 * u * t * y1 + t * t * y2,
  };
}

// Colors come from the site's theme tokens, so the globe follows light, dark, and system modes.
function readColors(): Colors {
  const style = getComputedStyle(document.documentElement);
  const get = (name: string, fallback: string) => style.getPropertyValue(name).trim() || fallback;
  return {
    land: get("--tone-aqua", "#2bb5c4"),
    link: get("--tone-sea", "#8fc5cf"),
    packet: get("--tone-sunrise", "#f2b66d"),
    ocean: get("--band", "#0c343d"),
    halo: get("--glow-a", "rgb(43 181 196 / 0.3)"),
    accent: get("--accent", "#2e6e7a"),
  };
}

// Picks two visible land points 13° to 43° apart to connect.
function pickLink(now: number, depth: Float32Array, life: number): Link | null {
  for (let attempt = 0; attempt < 30; attempt++) {
    const a = Math.floor(Math.random() * DOTS.length);
    if (depth[a] < 0.2) continue;
    for (let inner = 0; inner < 40; inner++) {
      const b = Math.floor(Math.random() * DOTS.length);
      if (depth[b] < 0.2) continue;
      const d = dot(DOTS[a], DOTS[b]);
      if (d < 0.73 || d > 0.975) continue;
      return {
        a,
        b,
        start: now,
        life,
        speed: 0.45 + Math.random() * 0.25,
        offset: Math.random(),
        lift: 0.12 + (1 - d) * 1.1,
      };
    }
  }
  return null;
}

// The hero visual: a spinning Earth built from land dots. Connections draw between
// points, and light packets travel along them. Drag to spin. Reduced motion shows one still frame.
export function HeroGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvasEl = canvasRef.current;
    const context = canvasEl?.getContext("2d") ?? null;
    if (!canvasEl || !context) return;
    // Non-null bindings, so the helper functions below type-check without repeated checks.
    const canvas: HTMLCanvasElement = canvasEl;
    const ctx: CanvasRenderingContext2D = context;

    const reduced = reduceMotion === true;
    const count = DOTS.length;
    const screenX = new Float32Array(count);
    const screenY = new Float32Array(count);
    const depth = new Float32Array(count);
    const buf: number[] = [0, 0, 0];

    let size = 0;
    let dpr = 1;
    let rotation = 1.2;
    let velocity = 0;
    let dragging = false;
    let lastX = 0;
    let lastTime = 0;
    let spawnBudget = 0;
    let frameId = 0;
    let running = false;
    let links: Link[] = [];
    let colors = readColors();

    function projectAll() {
      const cx = size / 2;
      const cy = size / 2;
      const radius = size * 0.4;
      for (let i = 0; i < count; i++) {
        project(DOTS[i], rotation, buf);
        screenX[i] = cx + buf[0] * radius;
        screenY[i] = cy - buf[1] * radius;
        depth[i] = buf[2];
      }
    }

    function drawLink(link: Link, now: number, cx: number, cy: number, radius: number) {
      const age = now - link.start;
      const { a, b } = link;
      const x0 = screenX[a];
      const y0 = screenY[a];
      const x2 = screenX[b];
      const y2 = screenY[b];

      // The control point is the midpoint pushed outward, so the arc rises above the surface.
      const mx = DOTS[a][0] + DOTS[b][0];
      const my = DOTS[a][1] + DOTS[b][1];
      const mz = DOTS[a][2] + DOTS[b][2];
      const len = Math.hypot(mx, my, mz) || 1;
      const scale = 1 + link.lift;
      const control: Vec3 = [(mx / len) * scale, (my / len) * scale, (mz / len) * scale];
      project(control, rotation, buf);
      const x1 = cx + buf[0] * radius;
      const y1 = cy - buf[1] * radius;

      // Draw in over the first second, hold, then fade over the last 30% of the lifetime.
      const grow = Math.min(age / 0.9, 1);
      const eased = 1 - (1 - grow) ** 3;
      const fadeFrom = link.life * 0.7;
      const life = age < fadeFrom ? 1 : Math.max(0, 1 - (age - fadeFrom) / (link.life - fadeFrom));
      const average = (depth[a] + depth[b]) / 2;
      const facing = Math.min(1, Math.max(0.12, (average + 0.3) / 0.8));

      const steps = 30;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      for (let s = 1; s <= steps; s++) {
        const p = quadratic(x0, y0, x1, y1, x2, y2, (s / steps) * eased);
        ctx.lineTo(p.x, p.y);
      }
      ctx.globalAlpha = 0.6 * life * facing;
      ctx.strokeStyle = colors.link;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // A packet travels along arcs that are fully drawn.
      if (!reduced && grow >= 1 && life > 0) {
        const t = (link.offset + age * link.speed) % 1;
        const p = quadratic(x0, y0, x1, y1, x2, y2, t);
        ctx.fillStyle = colors.packet;
        ctx.globalAlpha = life * facing;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.25 * life * facing;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function render(now: number) {
      const cx = size / 2;
      const cy = size / 2;
      const radius = size * 0.4;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);

      // Soft halo outside the sphere
      const halo = ctx.createRadialGradient(cx, cy, radius * 0.95, cx, cy, radius * 1.3);
      halo.addColorStop(0, colors.halo);
      halo.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // The ocean: flat Deep Teal, darker toward the rim so the sphere reads as round.
      // No bright spot, so nothing reads as a white circle inside the globe.
      const body = ctx.createRadialGradient(cx, cy, radius * 0.55, cx, cy, radius);
      body.addColorStop(0, colors.ocean);
      body.addColorStop(1, "#061f25");
      ctx.globalAlpha = 1;
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // Thin rim light around the edge
      ctx.globalAlpha = 0.35;
      ctx.strokeStyle = colors.link;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(cx, cy, radius - 0.6, 0, Math.PI * 2);
      ctx.stroke();

      // Land dots: the front face is bright, the back face faint
      ctx.fillStyle = colors.land;
      for (let i = 0; i < count; i++) {
        const z = depth[i];
        const front = z > 0;
        ctx.globalAlpha = front ? 0.45 + 0.5 * z : 0.12;
        ctx.beginPath();
        ctx.arc(screenX[i], screenY[i], front ? 0.9 + 1.1 * z : 0.7, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const link of links) drawLink(link, now, cx, cy, radius);
      ctx.globalAlpha = 1;
    }

    function update(now: number) {
      const dt = Math.min(0.05, now - lastTime);
      lastTime = now;

      if (!dragging) rotation += SPIN * dt + velocity;
      velocity *= Math.pow(0.92, dt * 60);
      projectAll();

      // New connections appear over time, so the dots look like they are getting connected.
      spawnBudget = Math.min(spawnBudget + dt * SPAWN_PER_SECOND, 2);
      while (spawnBudget >= 1) {
        spawnBudget -= 1;
        if (links.length < MAX_LINKS) {
          const link = pickLink(now, depth, LINK_LIFE * (0.85 + Math.random() * 0.3));
          if (link) links.push(link);
        }
      }
      links = links.filter((link) => now - link.start < link.life);

      render(now);
    }

    function tick(ms: number) {
      frameId = 0;
      update(ms / 1000);
      if (running) frameId = requestAnimationFrame(tick);
    }

    function start() {
      if (reduced || running) return;
      running = true;
      lastTime = performance.now() / 1000;
      frameId = requestAnimationFrame(tick);
    }

    function stop() {
      running = false;
      if (frameId) cancelAnimationFrame(frameId);
      frameId = 0;
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0) return;
      size = rect.width;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      projectAll();
      if (reduced) render(performance.now() / 1000);
    }

    resize();
    lastTime = performance.now() / 1000;

    if (reduced) {
      // A still frame with connections already in place. Nothing moves.
      const now = performance.now() / 1000;
      for (let i = 0; i < 16; i++) {
        const link = pickLink(now - 2, depth, Infinity);
        if (link) links.push(link);
      }
      render(now);
    } else {
      for (let i = 0; i < 6; i++) {
        const link = pickLink(lastTime - Math.random() * 1.5, depth, LINK_LIFE);
        if (link) links.push(link);
      }
    }

    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(canvas);

    // Only animate while the globe is on screen.
    const visibility = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start();
      else stop();
    });
    visibility.observe(canvas);

    const refreshColors = () => {
      colors = readColors();
      if (reduced) render(performance.now() / 1000);
    };
    const themeObserver = new MutationObserver(refreshColors);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const scheme = window.matchMedia("(prefers-color-scheme: dark)");
    scheme.addEventListener("change", refreshColors);

    // Drag to spin. Release carries momentum that slows down.
    const onPointerDown = (event: PointerEvent) => {
      dragging = true;
      lastX = event.clientX;
      velocity = 0;
      canvas.setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      const dx = event.clientX - lastX;
      lastX = event.clientX;
      rotation += dx * 0.008;
      velocity = dx * 0.008;
      if (reduced) {
        projectAll();
        render(performance.now() / 1000);
      }
    };
    const onPointerUp = () => {
      dragging = false;
    };
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);

    return () => {
      stop();
      resizeObserver.disconnect();
      visibility.disconnect();
      themeObserver.disconnect();
      scheme.removeEventListener("change", refreshColors);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
    };
  }, [reduceMotion]);

  return (
    <div className="relative mx-auto hidden aspect-square w-full max-w-[34rem] select-none md:block">
      <div aria-hidden="true" className="glow inset-[12%]" style={{ background: "var(--glow-b)" }} />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="relative block h-full w-full cursor-grab touch-pan-y active:cursor-grabbing"
      />
    </div>
  );
}
