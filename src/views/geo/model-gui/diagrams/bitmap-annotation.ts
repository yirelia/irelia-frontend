import type { Graph } from '@antv/x6';
import type { DiagramShape } from '../model';
import { DiagramAnnotation } from './shape-annotation';

export default class DiagramBitmapAnnotation extends DiagramAnnotation {
  constructor(graph: Graph, shape: DiagramShape) {
    super(graph, shape);
  }

  public markup() {
    const { imageBase64 } = this.shape;
    const [p1, p2] = this.getPathPoint();
    const { x, y, width, height } = this.getBox(p1, p2);
    const zIndex = this.zIndex;
    return {
      tagName: 'image',
      attrs: {
        'xlink:href': `data:image/png;base64,${imageBase64}`,
        width,
        height,
        x,
        y
      },
      data: this.getData(),
      zIndex
    };
  }
}
