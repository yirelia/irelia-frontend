import type { Graph } from '@antv/x6';
import type { Component } from '../components/component';
import type { DiagramShape } from '../model';
import ShapeAnnotation from './shape-annotation';

export default class BitmapAnnotation extends ShapeAnnotation {
  constructor(graph: Graph, shape: DiagramShape, parent?: Component) {
    super(graph, shape, parent);
  }

  public markup() {
    const { xlinkHref } = this;
    const [p1, p2] = this.getPathPoint();
    const { x, y, width, height } = this.getBox(p1, p2);
    const transform = this.transformation.getTransformationMatrix();
    return {
      tagName: 'image',
      attrs: {
        'xlink:href': xlinkHref,
        width,
        height,
        x,
        y,
        transform
      }
    };
  }
}
