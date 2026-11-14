"use client";

import { useId, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(useGSAP);

export function RulesDialog() {
  const id = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const releaseScroll = useRef<(() => void) | null>(null);

  useGSAP(() => {
    timeline.current = gsap.timeline({
      paused: true,
      onReverseComplete: () => {
        dialog.current?.close();
      },
    })
      .fromTo(".rules-scrim", { opacity: 0 }, { opacity: 1, duration: 0.25 }, 0)
      .fromTo(".rules-popup", { opacity: 0, scale: 0.88, y: 28, rotation: -2 }, {
        opacity: 1, scale: 1, y: 0, rotation: 0, duration: 0.48, ease: "back.out(1.6)",
      }, 0)
      .fromTo(".rule-step", { opacity: 0, x: -12 }, {
        opacity: 1, x: 0, duration: 0.24, stagger: 0.06, ease: "power2.out",
      }, 0.12);

    return () => {
      releaseScroll.current?.();
      releaseScroll.current = null;
      if (dialog.current?.open) dialog.current.close();
      timeline.current = null;
    };
  }, { scope: dialog });

  const open = () => {
    if (!dialog.current || dialog.current.open) return;
    const page = document.documentElement;
    const previousOverflow = page.style.overflow;
    const previousPadding = page.style.paddingRight;
    const gutter = window.innerWidth - page.clientWidth;
    const padding = parseFloat(getComputedStyle(page).paddingRight) || 0;
    page.style.overflow = "hidden";
    page.style.paddingRight = `${padding + gutter}px`;
    releaseScroll.current = () => {
      page.style.overflow = previousOverflow;
      page.style.paddingRight = previousPadding;
    };
    dialog.current.showModal();
    title.current?.focus({ preventScroll: true });
    timeline.current?.timeScale(1).play(0);
  };

  const close = () => {
    if (!dialog.current?.open) return;
    if (!timeline.current || timeline.current.time() === 0) dialog.current.close();
    else timeline.current.timeScale(1.7).reverse();
  };

  return (
    <>
      <Button ref={trigger} variant="ghost" className="rules-toggle" onClick={open} aria-haspopup="dialog" aria-controls={id}>
        <span className="question">?</span> How to play
      </Button>
      <dialog ref={dialog} id={id} className="rules-dialog" aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`}
        onCancel={event => { event.preventDefault(); close(); }}
        onClick={event => { if (event.target === event.currentTarget) close(); }}
        onClose={() => {
          releaseScroll.current?.();
          releaseScroll.current = null;
          trigger.current?.focus({ preventScroll: true });
        }}>
        <div className="rules-scrim" aria-hidden="true" />
        <div className="rules-popup">
          <Button variant="ghost" className="rules-close" aria-label="Close instructions" onClick={close}><X size={19} /></Button>
          <span className="rules-eyebrow">THE QUICK PLAYBOOK</span>
          <h2 ref={title} id={`${id}-title`} tabIndex={-1}>How to <span>play.</span></h2>
          <p id={`${id}-description`} className="rules-intro">Two players. Three in a row. Endless rematches.</p>
          <ol className="rules-steps">
            <li className="rule-step"><span className="step-number">1</span><div><h3>Pick a square</h3><p>Share this screen with a friend. X starts, then take turns choosing an empty square.</p></div></li>
            <li className="rule-step"><span className="step-number">2</span><div><h3>Make your line</h3><p>Connect three marks in a row, column, or diagonal to win. A full board without a winner is a draw.</p></div></li>
            <li className="rule-step"><span className="step-number">3</span><div><h3>Run it back</h3><p>New Game clears the board and keeps your scores. Reset Scores starts a fresh session.</p></div></li>
          </ol>
          <Button className="rules-done" onClick={close}>Got it. Let’s play <ArrowRight size={17} /></Button>
        </div>
      </dialog>
    </>
  );
}
