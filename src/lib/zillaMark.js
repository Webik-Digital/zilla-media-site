import * as THREE from "three";

/**
 * The Zilla Media "Z" mark, traced off the supplied logo artwork and snapped
 * onto its underlying 45-degree grid. Coordinates live in a 0..100 box with
 * y pointing DOWN (SVG convention); every edge is either vertical or exactly
 * 45 degrees, which is what keeps the extruded bevels crisp.
 */
export const MARK_POINTS = [
  [55.22, 0],
  [55.22, 37.58],
  [74.07, 18.58],
  [74.07, 33.78],
  [55.22, 52.36],
  [55.22, 74.66],
  [92.65, 37.58],
  [92.65, 52.36],
  [44.81, 100],
  [44.81, 62.67],
  [26.32, 81.08],
  [26.32, 66.22],
  [44.81, 47.8],
  [44.81, 25.34],
  [7.35, 62.67],
  [7.35, 47.8],
];

/** Same outline as an SVG path string, for flat DOM/logo usage. */
export const MARK_PATH =
  MARK_POINTS.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x} ${y}`).join(" ") + "Z";

/**
 * Builds the mark as a THREE.Shape centred on the origin and normalised so
 * its longest side spans `size` world units. Y is flipped into Three's
 * y-up space on the way through.
 */
export function createMarkShape(size = 1) {
  const s = size / 100;
  const shape = new THREE.Shape();
  MARK_POINTS.forEach(([x, y], i) => {
    const px = (x - 50) * s;
    const py = (50 - y) * s;
    if (i === 0) shape.moveTo(px, py);
    else shape.lineTo(px, py);
  });
  shape.closePath();
  return shape;
}

/**
 * Extruded, bevelled version of the mark. The bevel is deliberately generous
 * — it's what catches the rim light and reads as machined metal rather than
 * a flat cut-out.
 */
export function createMarkGeometry({
  size = 1,
  depth = 0.16,
  bevel = 0.018,
  curveSegments = 2,
} = {}) {
  const geo = new THREE.ExtrudeGeometry(createMarkShape(size), {
    depth,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelOffset: 0,
    bevelSegments: 2,
    curveSegments,
  });
  geo.center();
  geo.computeVertexNormals();
  return geo;
}
