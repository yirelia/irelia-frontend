import { Point } from "./point"

export class Ellipse {
    public x: number
    public y: number
    public a: number
    public b: number

    public get center() {
        return new Point(this.x, this.y)
    }

    constructor(x?: number, y?: number, a?: number, b?: number) {
        this.x = x == null ? 0 : x
        this.y = y == null ? 0 : y
        this.a = a == null ? 0 : a
        this.b = b == null ? 0 : b
    }


    getCenter() {
        return this.center
    }

    /**
 * Returns ellipse inflated in axis-x by `2 * amount` and in axis-y by
 * `2 * amount`.
 */
    inflate(amount: number): this
    /**
     * Returns ellipse inflated in axis-x by `2 * dx` and in axis-y by `2 * dy`.
     */
    inflate(dx: number, dy: number): this
    inflate(dx: number, dy?: number): this {
        const w = dx
        const h = dy != null ? dy : dx
        this.a += 2 * w
        this.b += 2 * h

        return this
    }
}