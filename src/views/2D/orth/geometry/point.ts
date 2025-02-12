export class Point {
    public x: number
    public y: number
  
    constructor()
    constructor(x?: number, y?: number)
    constructor(x?: number, y?: number) {
      this.x = x == null ? 0 : x
      this.y = y == null ? 0 : y
    }

    static create(x: number, y: number) {
        return new Point(x, y)
    }

    distance(p: Point) {
        return Math.sqrt(Math.pow(p.x - this.x, 2) + Math.pow(p.y - this.y, 2));
    }
}

export namespace Point {
 export interface PointLike {
    x: number;
    y: number;
 }
}