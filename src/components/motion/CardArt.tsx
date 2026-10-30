export type CardArtKind = "football" | "cricket" | "tennis";

const LINE = { fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round" } as const;

function Football() {
  return (
    <g {...LINE}>
      <rect x="20" y="20" width="360" height="220" rx="4" />
      <path d="M200 20V240" />
      <circle cx="200" cy="130" r="38" />
      <circle cx="200" cy="130" r="2.5" fill="currentColor" />
      <rect x="20" y="75" width="62" height="110" />
      <rect x="20" y="102" width="24" height="56" />
      <rect x="318" y="75" width="62" height="110" />
      <rect x="356" y="102" width="24" height="56" />
      <path d="M82 112 A26 26 0 0 1 82 148M318 112 A26 26 0 0 0 318 148" />
    </g>
  );
}

function Cricket() {
  return (
    <g {...LINE}>
      <ellipse cx="200" cy="130" rx="182" ry="112" />
      <ellipse cx="200" cy="130" rx="118" ry="72" strokeDasharray="4 7" />
      <rect x="184" y="70" width="32" height="120" />
      <path d="M170 88H230M170 172H230" />
      <path d="M194 74v10M200 74v10M206 74v10M194 176v10M200 176v10M206 176v10" />
    </g>
  );
}

function Tennis() {
  return (
    <g {...LINE}>
      <rect x="40" y="30" width="320" height="200" />
      <path d="M40 58H360M40 202H360" />
      <path d="M125 58V202M275 58V202M125 130H275" />
      <path d="M200 30V230" strokeDasharray="5 5" />
    </g>
  );
}

const ART = { football: Football, cricket: Cricket, tennis: Tennis } as const;

/**
 * Decorative stadium layer behind a card's content: pitch / court line art under two floodlight glows. The inner "zoom" layer slowly scales up when the card is hovered or focused
 * (CSS, see .card-art in globals.css) and the float layer drifts against the pointer for depth.
 */
export function CardArt({ kind }: { kind: CardArtKind }) {
  const Lines = ART[kind];
  return (
    <span aria-hidden="true" className="card-art">
      <span className="card-art__float">
        <span className="card-art__zoom">
          <svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full text-[#B6FF3B] opacity-[0.2]">
            <Lines />
          </svg>
        </span>
      </span>
    </span>
  );
}
