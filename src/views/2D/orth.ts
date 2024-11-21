import { Point, Rectangle } from "@antv/x6/es";

export function orth(
  sourcePoint: Point,
  targetPoint: Point,
  vertices: Point[]
) {
  const points = [sourcePoint, ...vertices, targetPoint];
  const result: Point[] = [];
  for (let i = 0, len = points.length - 1; i < len; i++) {
    const from = points[i];
    const to = points[i + 1];
    if (i === 0) {
    }
  }
}

export function getBearing(from: Point.PointLike, to: Point.PointLike) {
  if (from.x === to.x) {
    return from.y > to.y ? "N" : "S";
  }

  if (from.y === to.y) {
    return from.x > to.x ? "W" : "E";
  }

  return null;
}
