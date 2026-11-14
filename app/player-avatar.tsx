import type { Player } from "./game";

export function PlayerAvatar({ player }: { player: Player }) {
  const ghost = player === "X";
  const id = `avatar-${player}`;
  return (
    <svg viewBox="0 0 100 100" role="img" aria-label={ghost ? "Mint ghost avatar" : "Purple monster avatar"}>
      <defs>
        <radialGradient id={`${id}-bg`} cx="30%" cy="25%"><stop stopColor={ghost ? "#bde6db" : "#e4d4ea"} /><stop offset="1" stopColor={ghost ? "#6faaa8" : "#a9a4b2"} /></radialGradient>
        <radialGradient id={`${id}-body`} cx="28%" cy="15%"><stop stopColor={ghost ? "#b8e8d6" : "#f5a7e8"} /><stop offset=".55" stopColor={ghost ? "#71bfae" : "#d463c5"} /><stop offset="1" stopColor={ghost ? "#3c817d" : "#934aa4"} /></radialGradient>
        <linearGradient id={`${id}-hat`} x2="0" y2="1"><stop stopColor="#e3cb94" /><stop offset="1" stopColor="#ac895d" /></linearGradient>
      </defs>
      <circle cx="50" cy="50" r="49" fill={`url(#${id}-bg)`} />
      <ellipse cx="51" cy="85" rx="27" ry="6" fill="#26303d" opacity=".18" />
      {!ghost && <><path d="M24 37 20 15 39 30M61 29 80 17 76 41" fill="#4e384f" /><path d="m25 30-2-10 9 11m35 0 10-9-3 12" fill="#7a627b" /></>}
      <path d={ghost ? "M27 44Q28 23 49 24Q73 24 75 48L79 75Q78 86 67 84L59 78 50 86 41 79 32 85Q22 83 24 73Z" : "M19 49Q20 29 49 28Q78 29 82 51L78 68Q71 85 49 84Q25 81 20 63Z"} fill={`url(#${id}-body)`} />
      {ghost && <><ellipse cx="50" cy="26" rx="30" ry="5" fill="#bba071" /><path d="M35 24 39 16Q50 11 62 17L67 24Z" fill={`url(#${id}-hat)`} /><path d="M37 22Q51 27 65 22" fill="none" stroke="#806c54" strokeWidth="2" /></>}
      <g transform={ghost ? "rotate(5 50 50)" : "rotate(-8 50 50)"}>
        <ellipse cx="38" cy="48" rx="8" ry="12" fill="#f7fbec" /><ellipse cx="62" cy="48" rx="8" ry="12" fill="#f7fbec" />
        <ellipse cx="40" cy="50" rx="3.7" ry="6.4" fill="#35404e" /><ellipse cx="60" cy="50" rx="3.7" ry="6.4" fill="#35404e" />
        <circle cx="41" cy="47" r="1.5" fill="white" /><circle cx="61" cy="47" r="1.5" fill="white" />
        <path d="M36 67Q50 78 65 65Q52 86 36 67" fill="#4f374c" /><path d="m40 69 5 2 1 6-5-3m14-2 6-3-2 6-5 2" fill="#fff5de" />
        <ellipse cx="30" cy="62" rx="5" ry="3" fill="#f4a3a9" opacity=".5" /><ellipse cx="71" cy="60" rx="5" ry="3" fill="#f4a3a9" opacity=".5" />
      </g>
      {ghost && <><ellipse cx="35" cy="84" rx="7" ry="3" fill="#cc5d65" /><ellipse cx="64" cy="84" rx="7" ry="3" fill="#cc5d65" /></>}
    </svg>
  );
}
