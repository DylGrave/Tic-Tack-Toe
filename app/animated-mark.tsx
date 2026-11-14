"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { Player } from "./game";

gsap.registerPlugin(useGSAP);

export type MotionMode = "system" | "on" | "off";
export function motionQuery(mode: MotionMode) {
  return mode === "on" ? "all" : mode === "off" ? "not all" : "(prefers-reduced-motion: no-preference)";
}

export function Mark({ player, small = false, animate = false, motion = "system" }: {
  player: Player;
  small?: boolean;
  animate?: boolean;
  motion?: MotionMode;
}) {
  const root = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    if (!animate) return;
    const media = gsap.matchMedia();
    media.add(motionQuery(motion), () => {
      gsap.fromTo(root.current, { scale: 0.65, rotation: -12 }, {
        scale: 1, rotation: 0, duration: 0.55, ease: "back.out(2.5)",
      });
      gsap.fromTo(".mark-stroke", { strokeDasharray: 1, strokeDashoffset: 1 }, {
        strokeDashoffset: 0, duration: 0.35, stagger: 0.09, ease: "power2.out",
      });
    });
    return () => media.revert();
  }, { scope: root, dependencies: [player, animate, motion], revertOnUpdate: true });

  return (
    <svg ref={root} className={`mark mark-${player.toLowerCase()} ${small ? "mark-small" : ""}`}
      viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="11" aria-hidden="true">
      {player === "X" ? <>
        <path className="mark-stroke" pathLength="1" d="M13 13 51 51" />
        <path className="mark-stroke" pathLength="1" d="M51 13 13 51" />
      </> : <circle className="mark-stroke" pathLength="1" cx="32" cy="32" r="22" />}
    </svg>
  );
}
