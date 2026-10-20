"use client";

import { animate, motion, useMotionValue } from "motion/react";
import {
  Children,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { project, rubberband, springMomentum } from "@/lib/motion";

type Props = {
  children: ReactNode;
  label: string;
  rtl?: boolean;
  // Snap mode shows one slide at a time, with momentum and a spring snap.
  // Free mode lets the content glide and stop, with rubber-band at the ends.
  snap?: boolean;
  count?: number;
  index?: number;
  onIndexChange?: (index: number) => void;
  className?: string;
};

type Drag = {
  id: number;
  startX: number;
  startPos: number;
  moved: boolean;
  samples: { t: number; x: number }[];
};

// Draggable, interruptible horizontal rail. It follows the pointer 1:1 from the
// point where the user grabbed it, keeps the release velocity for the spring, and
// projects the flick forward before choosing where to land.
export function DragRail({
  children,
  label,
  rtl = false,
  snap = false,
  count = 0,
  index = 0,
  onIndexChange,
  className = "",
}: Props) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const drag = useRef<Drag | null>(null);
  const dims = useRef({ view: 0, track: 0 });
  const indexRef = useRef(index);
  const suppressClick = useRef(false);
  const [dragging, setDragging] = useState(false);

  // In LTR, moving forward to the next slide shifts the track left (negative x).
  // In RTL the track starts at the right edge, so the sign flips.
  const k = rtl ? 1 : -1;

  // Re-measure on resize and keep the position valid.
  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const sync = () => {
      dims.current = { view: viewport.clientWidth, track: track.scrollWidth };
      const overflow = Math.max(0, dims.current.track - dims.current.view);
      const min = rtl ? 0 : -overflow;
      const max = rtl ? overflow : 0;
      const target = snap
        ? (rtl ? 1 : -1) * indexRef.current * dims.current.view
        : Math.min(Math.max(x.get(), min), max);
      x.set(target);
    };

    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(viewport);
    observer.observe(track);
    return () => observer.disconnect();
  }, [rtl, snap, x]);

  // Controlled slide index (dots, arrows) animates with a spring that carries
  // the current velocity, so a second tap mid-motion does not jerk.
  useEffect(() => {
    indexRef.current = index;
    if (!snap || drag.current) return;
    animate(x, k * index * dims.current.view, { ...springMomentum, velocity: x.getVelocity() });
  }, [index, snap, k, x]);

  function bounds() {
    const overflow = Math.max(0, dims.current.track - dims.current.view);
    return rtl ? { min: 0, max: overflow } : { min: -overflow, max: 0 };
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    // Interrupt any running spring from its live value.
    x.stop();
    drag.current = {
      id: event.pointerId,
      startX: event.clientX,
      startPos: x.get(),
      moved: false,
      samples: [{ t: performance.now(), x: x.get() }],
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const current = drag.current;
    if (!current || current.id !== event.pointerId) return;

    const dx = event.clientX - current.startX;
    // Hysteresis: ignore small jitters before we treat the pointer as a drag.
    if (!current.moved && Math.abs(dx) < 6) return;
    if (!current.moved) {
      current.moved = true;
      setDragging(true);
    }

    const { min, max } = bounds();
    const raw = current.startPos + dx;
    let next = raw;
    if (raw > max) next = max + rubberband(raw - max, dims.current.view);
    else if (raw < min) next = min + rubberband(raw - min, dims.current.view);
    x.set(next);

    const now = performance.now();
    current.samples = [...current.samples.filter((s) => now - s.t < 120), { t: now, x: next }];
  }

  function onPointerEnd(event: PointerEvent<HTMLDivElement>) {
    const current = drag.current;
    if (!current || current.id !== event.pointerId) return;
    drag.current = null;
    setDragging(false);
    if (!current.moved) return;

    // A drag should not also trigger a click on a link inside the rail.
    suppressClick.current = true;
    window.setTimeout(() => {
      suppressClick.current = false;
    }, 50);

    const first = current.samples[0];
    const last = current.samples[current.samples.length - 1];
    const elapsed = Math.max(1, last.t - first.t);
    const velocity = ((last.x - first.x) / elapsed) * 1000; // px/s

    const { min, max } = bounds();
    const projected = x.get() + project(velocity);
    const view = dims.current.view;

    if (snap && view > 0) {
      const nextIndex = Math.min(Math.max(Math.round((k * projected) / view), 0), count - 1);
      animate(x, k * nextIndex * view, { ...springMomentum, velocity });
      if (nextIndex !== indexRef.current) onIndexChange?.(nextIndex);
    } else {
      animate(x, Math.min(Math.max(projected, min), max), { ...springMomentum, velocity });
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const forward = (event.key === "ArrowRight") !== rtl;

    if (snap) {
      const next = Math.min(Math.max(indexRef.current + (forward ? 1 : -1), 0), count - 1);
      if (next !== indexRef.current) onIndexChange?.(next);
      return;
    }

    const { min, max } = bounds();
    const direction = forward ? k : -k;
    const target = Math.min(Math.max(x.get() + direction * dims.current.view * 0.6, min), max);
    animate(x, target, { ...springMomentum, velocity: 0 });
  }

  return (
    <div
      ref={viewportRef}
      role="region"
      aria-label={label}
      aria-roledescription={snap ? "carousel" : undefined}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onClickCapture={(event) => {
        if (suppressClick.current) {
          event.preventDefault();
          event.stopPropagation();
        }
      }}
      className={`rail overflow-hidden ${dragging ? "cursor-grabbing" : "cursor-grab"} ${className}`}
    >
      <motion.div
        ref={trackRef}
        style={{ x, ...(snap ? { width: `${count * 100}%` } : {}) }}
        className={`flex will-change-transform ${snap ? "" : "w-max gap-4"}`}
      >
        {Children.toArray(children).map((child, i) => (
          <div key={i} className="shrink-0" style={snap ? { width: `${100 / count}%` } : undefined}>
            {child}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
