"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const IMAGES = [
  { src: "/eye.webp", width: 1000, height: 1000 },
  { src: "/eye2.webp", width: 1000, height: 1000 },
] as const;

const DISPLAY_MS = 2000;
const FADE_MS = 1000;

export default function GlobalEyeBackground() {
  const eyeRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showSecondImage, setShowSecondImage] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % IMAGES.length);
    }, DISPLAY_MS + FADE_MS);
    return () => clearInterval(timer);
  }, []);

  // Load the second frame after idle so the initial payload stays small.
  useEffect(() => {
    const idleId =
      typeof requestIdleCallback === "function"
        ? requestIdleCallback(() => setShowSecondImage(true), { timeout: 2500 })
        : window.setTimeout(() => setShowSecondImage(true), 1500);

    return () => {
      if (typeof cancelIdleCallback === "function" && typeof idleId === "number") {
        cancelIdleCallback(idleId);
      } else {
        clearTimeout(idleId as number);
      }
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!eyeRef.current) return;

      if (rafRef.current !== null) return;

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        if (!eyeRef.current) return;

        const maxTilt = 45;
        const dx = (e.clientX - window.innerWidth / 2) / window.innerWidth;
        const dy = (e.clientY - window.innerHeight / 2) / window.innerHeight;
        const clampedDx = Math.max(-1, Math.min(1, dx));
        const clampedDy = Math.max(-1, Math.min(1, dy));

        eyeRef.current.style.transform = `perspective(800px) rotateX(${-clampedDy * maxTilt}deg) rotateY(${clampedDx * maxTilt}deg)`;
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div ref={eyeRef} className="global-eye-container" aria-hidden="true">
      <div className="eyeball-stage">
        {IMAGES.map((image, i) => {
          if (i === 1 && !showSecondImage) return null;

          return (
            <div
              key={image.src}
              className="eyeball-slide"
              style={{
                opacity: activeIndex === i ? 1 : 0,
                transition: `opacity ${FADE_MS}ms ease-in-out`,
              }}
            >
              <Image
                src={image.src}
                alt=""
                fill
                sizes="min(1000px, 95vw)"
                className="eyeball-img"
                draggable={false}
                priority={i === 0}
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "low"}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
