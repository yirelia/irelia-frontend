import { Point } from "./point";
interface Size {
    width: number
    height: number
}

type Side = 'top' | 'right' | 'bottom' | 'left';
interface RectangleLike {
    x: number
    y: number
    width: number
    height: number
}


export class Rectangle{
    public x: number;
    public y: number;
    public width: number;
    public height: number;

    static get empty(): Rectangle{
        return new Rectangle(0, 0, 0, 0);
    }

    getSidePoint(side: Side) {
        switch(side) {
            case 'top': return new Point(this.x + this.width)
        }
    } 

    static fromRect(r: RectangleLike): Rectangle{
        return new Rectangle(r.x, r.y, r.width, r.height);
    }

    static fromLTRB(left: number, top: number, right: number, bottom: number): Rectangle{
        return new Rectangle(left, top, right - left, bottom - top);
    }

    constructor(x?: number, y?: number, width?: number, height?: number) {
        this.x = x == null ? 0 : x
        this.y = y == null ? 0 : y
        this.width = width == null ? 0 : width
        this.height = height == null ? 0 : height
      }

    contains(p: Point): boolean{
        return p.x >= this.x && p.x <= this.right && p.y >= this.y && p.y <= this.bottom;
    }

    inflate(horizontal: number, vertical: number): Rectangle{
        return Rectangle.fromLTRB(this.x - horizontal, this.y - vertical, this.right + horizontal, this.bottom + vertical);
    }

    intersects(rectangle: Rectangle): boolean{
        let thisX = this.x;
        let thisY = this.y;
        let thisW = this.width;
        let thisH = this.height;
        let rectX = rectangle.x;
        let rectY = rectangle.y;
        let rectW = rectangle.width;
        let rectH = rectangle.height;
        return (rectX < thisX + thisW) && (thisX < (rectX + rectW)) && (rectY < thisY + thisH) && (thisY < rectY + rectH);
    }
    // 
    union(r: Rectangle): Rectangle{
        const x = [this.x, this.right, r.x, r.right];
        const y = [this.y, this.bottom, r.y, r.bottom];
        return Rectangle.fromLTRB(
            Math.min(...x), Math.min(...y),
            Math.max(...x), Math.max(...y)
        );
    }

    get origin() {
        return new Point(this.x, this.y)
      }
    get center(): Point{
        return new Point(this.x + this.width / 2, this.y + this.height / 2)
    }

    get right(): number{
        return this.x + this.width;
    }

    get bottom(): number{
        return this.y + this.height;
    }

    get location(): Point{
        return new Point(this.x, this.y);
    }

    get northEast(): Point{
        return new Point(this.right, this.y);
    }

    get southEast(): Point{
        return  new Point(this.right, this.bottom) 
    }

    get southWest(): Point{
        return  new Point(this.x, this.bottom)
    }

    get northWest(): Point{
        return new Point(this.x, this.y)
    }

    get east(): Point{
        return new Point(this.right, this.center.y);
    }

    get north(): Point{
        return new Point(this.center.x, this.y);
    }

    get south(): Point{
        return new Point(this.center.x, this.bottom);
    }

    get west(): Point{
        return new Point(this.x, this.center.y);
    }

    get size(): Size{
        return {width: this.width, height: this.height};
    } 
}
