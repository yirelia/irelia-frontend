import type { Graph } from '@antv/x6';
import BigNumber from 'bignumber.js';
import { Component } from '../component/component';
import { Transformation } from '../component/transformation';
import { DiagramShape, Point } from '../model';
import { toPoint } from '../utils';
import ShapeAnnotation from './shape-annotation';

export default class BitmapAnnotation extends ShapeAnnotation {
  constructor(graph: Graph, shape: DiagramShape, parent: Component) {
    super(graph, shape, parent);
    this.transformation = new Transformation(this, parent);
  }

  public center(p1: Point, p2: Point) {
    const x = new BigNumber(p1.x).plus(p2.x).div(2).toNumber();
    const y = new BigNumber(p1.y).plus(p2.y).div(2).toNumber();
    return {
      x,
      y,
    };
  }

  /**
   * @description:
   * @param {Point} p1
   * @param {Point} p2
   * @return {*}
   */
  public getBox(leftBottomPoint: Point, rightTopPoint: Point) {
    const width = Math.abs(leftBottomPoint.x - rightTopPoint.x);
    const height = Math.abs(leftBottomPoint.y - rightTopPoint.y);
    const center = this.center(leftBottomPoint, rightTopPoint);
    return {
      x: center.x - width / 2,
      y: center.y - height / 2,
      width,
      height,
    };
  }

  public markup() {
    const { imageBase64 } = this.shape;
    const [p1, p2] = this.getPathPoint();
    const { x, y, width, height } = this.getBox(p1, p2);
    const transform = this.transformation.getTransformationMatrix();
    return {
      tagName: 'image',
      attrs: {
        'xlink:href': `data:image/png;base64,${imageBase64}`,
        width,
        height,
        x,
        y,
        transform,
      },
    };
  }
}
