"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RefObject, useEffect } from "react";

type Params = {
  sectionRef: RefObject<HTMLElement | null>;
  headerRef: RefObject<HTMLDivElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  eventsLength: number;
  isLoading: boolean;
};


gsap.registerPlugin(ScrollTrigger);

export function useUpcomingEventsSliderAnimation({
  sectionRef,
  headerRef,
  containerRef,
  eventsLength,
  isLoading,
}: Params) {
  useGSAP(
    () => {
      // Skip if still loading or no section
      if (isLoading || !sectionRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
          once: true,                    
        },
      });

      // Header
      tl.fromTo(
        headerRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
      );

      // Container
      tl.fromTo(
        containerRef.current,
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      );

      // Cards (stagger)
      if (eventsLength > 0) {
        const cards = containerRef.current?.querySelectorAll(".slider-card");
        if (cards && cards.length > 0) {
          tl.fromTo(
            cards,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.5,
              ease: "power2.out",
              stagger: 0.08,
            },
            "-=0.10"
          );
        }
      }
    },
    {
      dependencies: [isLoading, eventsLength],   
      scope: sectionRef,
      revertOnUpdate: true,                      
    }
  );
}