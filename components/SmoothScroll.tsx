"use client";

import { type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// Rendered as the FIRST child inside #smooth-content so its effect runs before
// every section's useGSAP (React fires effects depth-first in tree order).
// The smoother must exist before any pinned ScrollTrigger is created,
// otherwise those pins are built with fixed positioning and break inside the
// smoother's transformed container.
function SmootherInit() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const smoother = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1.1,
      });

      // anchor links have to go through the smoother, native jumps fight the transform
      const onClick = (e: MouseEvent) => {
        const a = (e.target as HTMLElement).closest?.(
          "a[href^='#']",
        ) as HTMLAnchorElement | null;
        if (!a) return;
        const target = document.querySelector(a.getAttribute("href") ?? "");
        if (!target) return;
        e.preventDefault();
        smoother.scrollTo(target, true);
      };
      document.addEventListener("click", onClick);
      return () => document.removeEventListener("click", onClick);
    });
  });

  return null;
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">
        <SmootherInit />
        {children}
      </div>
    </div>
  );
}
