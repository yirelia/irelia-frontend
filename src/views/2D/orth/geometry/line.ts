import { Point } from './point'
export class Line {
    public start: Point
    public end: Point

    constructor()
    constructor(start?: Point, end?: Point)
    constructor(start?: Point, end?: Point) {
        this.start = start == null ? new Point() : start
        this.end = end == null ? new Point() : end
    }
    public get center() {
        return new Point(
          (this.start.x + this.end.x) / 2,
          (this.start.y + this.end.y) / 2,
        )
      }

    getCenter() {
        return this.center
      }
}