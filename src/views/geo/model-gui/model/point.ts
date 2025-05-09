export type PointTuple = [number, number];

export type PointArray = Point[];

export class Point {
  public x: number;
  public y: number;
  constructor(x?: number, y?: number) {
    this.x = x || 0;
    this.y = y || 0;
  }
}
