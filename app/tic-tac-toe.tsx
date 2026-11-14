"use client";

import { useReducer, useRef } from "react";
import { PlayerAvatar } from "./player-avatar";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { RotateCcw, Sparkles, Gamepad2, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { gameReducer, initialGame, result } from "./game";
import { Mark, motionQuery } from "./animated-mark";
import { RulesDialog } from "./rules-dialog";

gsap.registerPlugin(useGSAP);

export function TicTacToe() {
  const [game, dispatch] = useReducer(gameReducer, undefined, initialGame);
  const motion = "on";
  const root = useRef<HTMLDivElement>(null);
  const outcome = result(game.board);
  const finished = !!outcome.winner || outcome.draw;
  const suffix = game.round % 100 >= 11 && game.round % 100 <= 13 ? "th" : ({ 1: "st", 2: "nd", 3: "rd" }[game.round % 10] || "th");
  const status = outcome.winner ? `Player ${outcome.winner} wins!` : outcome.draw ? "It’s a draw." : `Player ${game.next}’s turn`;

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add(motionQuery(motion), () => {
      gsap.from(".entrance", { y: 22, autoAlpha: 0, duration: 0.75, stagger: 0.09, ease: "power3.out" });
      gsap.from(".round-badge", { rotation: -16, scale: 0.6, duration: 0.8, ease: "back.out(1.8)" });
    });
    return () => media.revert();
  }, { scope: root, dependencies: [motion], revertOnUpdate: true });

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add(motionQuery(motion), () => {
      gsap.from(".tile-shell", { scale: 0.82, opacity: 0, stagger: { each: 0.04, from: "center" }, duration: 0.5, ease: "back.out(1.3)" });
    });
    return () => media.revert();
  }, { scope: root, dependencies: [game.round, motion], revertOnUpdate: true });

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add(motionQuery(motion), () => {
      gsap.fromTo(".turn-copy", { y: 5, opacity: 0.3 }, { y: 0, opacity: 1, duration: 0.25 });
      gsap.fromTo(".active-score .score-value", { scale: 0.6 }, { scale: 1, duration: 0.5, ease: "back.out(2)" });
      if (outcome.winner) {
        gsap.killTweensOf(".winning");
        gsap.fromTo(".winning", { scale: 1 }, { scale: 0.93, duration: 0.22, stagger: 0.08, repeat: 3, yoyo: true, ease: "sine.inOut" });
        gsap.fromTo(".active-score .avatar", { y: 0 }, { y: -10, duration: 0.25, repeat: 3, yoyo: true });
        gsap.utils.toArray<HTMLElement>(".confetti i").forEach((particle, i) => {
          const angle = i / 28 * Math.PI * 2;
          const radius = 90 + i % 5 * 24;
          gsap.fromTo(particle, { x: 0, y: 0, scale: 0, autoAlpha: 1 }, {
            keyframes: [
              { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius - 60, scale: 1, rotation: i * 27, duration: 0.65, ease: "power3.out" },
              { y: `+=${120 + i * 3}`, autoAlpha: 0, rotation: "+=120", duration: 0.8, ease: "power1.in" },
            ], delay: i % 4 * 0.035,
          });
        });
      }
    });
    return () => media.revert();
  }, { scope: root, dependencies: [status, game.round, outcome.winner, motion], revertOnUpdate: true });

  const { contextSafe } = useGSAP({ scope: root, dependencies: [game.round, motion], revertOnUpdate: true });
  const play = contextSafe((index: number, tile: HTMLButtonElement) => {
    gsap.fromTo(tile, { scale: 0.93 }, { scale: 1, duration: 0.35, ease: "back.out(2)", overwrite: true });
    dispatch({ type: "play", index });
  });

  return (
    <div className="page-wrap">
      <div ref={root} className="site-shell" data-motion={motion}>
        <div className="doodles" aria-hidden="true"><Gamepad2 className="doodle gamepad" /><FlaskConical className="doodle flask" /><FlaskConical className="doodle flask-two" /><Sparkles className="doodle stars" /></div>
        <header className="site-header entrance">
          <h1>TIC <span>TAC</span> TOE</h1>
          <RulesDialog />
        </header>
        <main>
          <div className="round-badge entrance" aria-label={`Round ${game.round}`}><div><strong>{game.round}</strong><sup>{suffix}</sup></div><span>Round</span></div>
          <section className="arena-layout" aria-label="Tic-tac-toe game">
            {(["X", "O"] as const).map(player => (
              <aside key={player} className={`player-panel player-${player.toLowerCase()} entrance ${!finished && game.next === player ? "active-player" : ""} ${outcome.winner === player ? "active-score" : ""}`}>
                <div className="player-card">
                  <div className="avatar"><PlayerAvatar player={player} /></div>
                  <h2>{player === "X" ? "Player One" : "Player Two"}</h2>
                  <span className="player-mark"><Mark player={player} small /></span>
                  <span className="player-state">{outcome.winner === player ? "WINNER!" : !finished && game.next === player ? "YOUR TURN" : outcome.draw ? "WELL PLAYED" : ""}</span>
                </div>
                <div className="wins-badge">Win Rounds: <strong className="score-value" aria-label={`Player ${player} wins: ${game.scores[player]}`}>{game.scores[player]}</strong></div>
              </aside>
            ))}
            <div className="board-section entrance">
              <div className="board-frame">
                <div key={game.round} className="board" role="group" aria-label="Tic-tac-toe board">
                  {game.board.map((cell, index) => (
                    <div className="tile-shell" key={index}>
                      <button className={`cell ${outcome.line.includes(index) ? "winning" : ""}`}
                        aria-label={`Row ${Math.floor(index / 3) + 1}, column ${index % 3 + 1}: ${cell || "empty"}`}
                        disabled={!!cell || finished} onClick={event => play(index, event.currentTarget)}>
                        {cell ? <Mark player={cell} animate motion={motion} /> : <span className="hover-mark"><Mark player={game.next} /></span>}
                      </button>
                    </div>
                  ))}
                </div>
                {outcome.winner && <div className="confetti" aria-hidden="true">{Array.from({ length: 28 }, (_, i) => <i key={`${game.round}-${i}`} />)}</div>}
              </div>
            </div>
          </section>
          <div className="status-area entrance">
            <div className="turn-pill" role="status" aria-live="polite" aria-atomic="true"><span className="turn-copy">{status}</span></div>
            <div className="game-actions">
              <Button className="new-game" onClick={() => dispatch({ type: "new" })}><RotateCcw size={14} />{finished ? "New game · Play again" : "New game"}</Button>
              <span className="action-divider" aria-hidden="true" />
              <Button variant="ghost" className="reset-scores" onClick={() => dispatch({ type: "reset" })}>Reset scores</Button>
            </div>
          </div>
        </main>
        <footer className="entrance">
          <span className="draws-badge" aria-label={`Draws: ${game.scores.draw}`}>Draws: <strong>{game.scores.draw}</strong></span>
          <span className="footer-note">A little friendly competition.</span>
        </footer>
      </div>
    </div>
  );
}
