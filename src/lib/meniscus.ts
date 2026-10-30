/**
 * Geometry for the meniscus socket: ONE outline where the dock's top edge melts down around a bead.
 *
 * Circles involved (y grows downward, the top edge is y = 0):
 *  - bowl:      centre C2 = (bx, by), radius rb, concentric with the bead.
 *  - shoulders: centre C1 = (bx -/+ reach, s), radius s. Each touches the top edge (centre s below it)
 *               and touches the bowl from outside, so |C1C2| = s + rb.
 * Solving |C1C2| = s + rb for the horizontal offset gives
 *   reach = sqrt((s + rb)^2 - (s - by)^2).
 * The tangent point with the bowl lies on the line C1 -> C2, which makes every join G1-continuous.
 */

export type Shape = { W: number; H: number; R: number; rb: number; by: number };

export const reach = (s: number, rb: number, by: number) => Math.sqrt((s + rb) ** 2 - (s - by) ** 2);

/** Largest shoulder radius whose reach still fits in `room` px of flat edge. */
export const maxShoulder = (room: number, rb: number, by: number) => (room * room - rb * rb + by * by) / (2 * (rb + by));

type Pt = [number, number];

export type Socket = {
  sL: number;
  sR: number;
  c1: Pt;
  c2: Pt;
  c3: Pt;
  tL: Pt;
  pL: Pt;
  pR: Pt;
  tR: Pt;
};

const MIN_SHOULDER = 3;

export function socket(bx: number, wantL: number, wantR: number, { W, R, rb, by }: Shape): Socket {
  const sL = Math.max(MIN_SHOULDER, Math.min(wantL, maxShoulder(bx - R, rb, by)));
  const sR = Math.max(MIN_SHOULDER, Math.min(wantR, maxShoulder(W - R - bx, rb, by)));
  const rL = reach(sL, rb, by);
  const rR = reach(sR, rb, by);
  const c1: Pt = [bx - rL, sL];
  const c2: Pt = [bx, by];
  const c3: Pt = [bx + rR, sR];
  const toward = (from: Pt, s: number): Pt => {
    const k = s / (s + rb);
    return [from[0] + (c2[0] - from[0]) * k, from[1] + (c2[1] - from[1]) * k];
  };
  return { sL, sR, c1, c2, c3, tL: [c1[0], 0], pL: toward(c1, sL), pR: toward(c3, sR), tR: [c3[0], 0] };
}

const n = (value: number) => Number(value.toFixed(3));

function flatPath({ W, H, R }: Shape) {
  return `M0 ${R}A${R} ${R} 0 0 1 ${R} 0L${W - R} 0A${R} ${R} 0 0 1 ${W} ${R}L${W} ${H - R}A${R} ${R} 0 0 1 ${W - R} ${H}L${R} ${H}A${R} ${R} 0 0 1 0 ${H - R}Z`;
}

/** Full dock outline. When the bowl is (almost) closed the path is simply the rounded rectangle. */
export function dockPath(bx: number, sL: number, sR: number, shape: Shape): string {
  if (shape.rb < 0.75) return flatPath(shape);
  const { W, H, R, rb, by } = shape;
  const k = socket(bx, sL, sR, shape);
  const phiL = Math.atan2(k.sL - by, -(bx - k.c1[0]));
  const phiR = Math.atan2(k.sR - by, k.c3[0] - bx);
  const large = phiL - phiR > Math.PI ? 1 : 0;
  return (
    `M0 ${R}A${R} ${R} 0 0 1 ${R} 0` +
    `L${n(k.tL[0])} 0` +
    `A${n(k.sL)} ${n(k.sL)} 0 0 1 ${n(k.pL[0])} ${n(k.pL[1])}` +
    `A${n(rb)} ${n(rb)} 0 ${large} 0 ${n(k.pR[0])} ${n(k.pR[1])}` +
    `A${n(k.sR)} ${n(k.sR)} 0 0 1 ${n(k.tR[0])} 0` +
    `L${W - R} 0A${R} ${R} 0 0 1 ${W} ${R}L${W} ${H - R}A${R} ${R} 0 0 1 ${W - R} ${H}L${R} ${H}A${R} ${R} 0 0 1 0 ${H - R}Z`
  );
}
