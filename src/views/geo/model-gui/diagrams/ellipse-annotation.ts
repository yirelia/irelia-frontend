import type { DiagramShape } from '../model';
import { ShapeType } from '../enums';
import type { Graph } from '@antv/x6';
import { DiagramAnnotation } from './shape-annotation';

export default class DiagramEllipseAnnotation extends DiagramAnnotation {
  tag = ShapeType.Ellipse;

  constructor(graph: Graph, shape: DiagramShape) {
    super(graph, shape);
  }

  public markup() {
    const [p1, p2] = this.getPathPoint();
    const { width, height, x, y } = this.getBox(p1, p2);
    const fill = this.fill;
    const stroke = this.lineColor;
    const strokeWidth = this.lineThickness;
    const zIndex = this.zIndex;
    // 此处处理事有问题的，后续在确定
    return {
      shape: 'ellipse',
      x,
      y,
      width,
      height,
      attrs: {
        body: {
          fill,
          stroke,
          strokeWidth
        }
      },
      data: this.getData(),
      zIndex
    };
  }
}
