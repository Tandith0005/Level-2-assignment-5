"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { RefObject } from "react";

export function useHeroAnimation(
  container: RefObject<HTMLElement | null>
) {
  useGSAP(
    () => {
      const tl = gsap.timeline();

      tl.from(".hero-title", {
        x: -100,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
      })
        .from(
          ".hero-subtitle",
          {
            x: 50,
            opacity: 0,
            duration: 1,
          },
          "-=0.8"
        )
        .from(
          ".hero-date",
          {
            y: 30,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.6"
        )
        .from(
          ".hero-cta",
          {
            y: 40,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.5"
        )
        .from(
          ".hero-card",
          {
            x: 100,
            opacity: 0,
            duration: 1.2,
          },
          "-=0.8"
        )
        .from(
          ".hero-badge",
          {
            scale: 0,
            opacity: 0,
            duration: 0.6,
            ease: "back.out(1.7)",
            stagger: 0.2,
          },
          "-=0.6"
        );
    },
    { scope: container }
  );
}