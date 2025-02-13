import { Graph } from '@antv/x6/es';
import { Rectangle } from "./geometry/rectangle";

export class GridMap {
    private _rows = 0;
    private _cols = 0;
    private data: Map<number, Map<number, any>> = new Map();
    constructor() { }

    get columns(): number {
        return this._cols;
    }

    get rows(): number {
        return this._rows;
    }
    set(row: number, column: number, bounds: Rectangle) {
        this._rows = Math.max(this.rows, row + 1);
        this._cols = Math.max(this.columns, column + 1);

        const rowMap: Map<number, Rectangle> = this.data.get(row) || this.data.set(row, new Map()).get(row)!;

        rowMap.set(column, bounds);

    }

    build(verticals: number[], horizontals: number[], bounds: Rectangle,graph: Graph) {
        verticals.sort((a, b) => a - b);
        horizontals.sort((a, b) => a - b);
        let lastX = bounds.x;
        let lastY = bounds.y;
        let column = 0;
        let row = 0;

        for (const y of horizontals) {
            for (const x of verticals) {
                const rect = Rectangle.fromLTRB(lastX, lastY, x, y);
                graph.addNode({
                    shape: 'rect',
                    x: rect.x,
                    y: rect.y,
                    width: rect.width,
                    height: rect.height,
                    attrs: {
                        body: {
                            fill: 'rgba(220,20,60, 0.2)',
                            stroke: '#000',
                            strokeWidth: 1
                        }
                    }
                })
                this.set(row, column++,rect);
                lastX = x;
            }

            // Last cell of the row
            this.set(row, column, Rectangle.fromLTRB(lastX, lastY, bounds.right, y));
            lastX = bounds.x;
            lastY = y;
            column = 0;
            row++;
        }
        lastX = bounds.x;
            // Last fow of cells
        for(const x of verticals) {
            const rect = Rectangle.fromLTRB(lastX, lastY, x, bounds.bottom)
            graph.addNode({
                shape: 'rect',
                x: rect.x,
                y: rect.y,
                width: rect.width,
                height: rect.height,
                attrs: {
                    body: {
                        fill: 'rgba(220,20,60, 0.2)',
                        stroke: '#000',
                        strokeWidth: 1
                    }
                }
            })
            this.set(row, column++, rect);
            lastX = x;
        }

        // Last cell of last row
        this.set(row, column, Rectangle.fromLTRB(lastX, lastY, bounds.right, bounds.bottom));

        return this
    }

}